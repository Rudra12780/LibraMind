/**
 * LibraMind SMS Service
 * Supports Twilio and MSG91 SMS Gateways for real OTP delivery.
 * If credentials are not configured in backend/.env, clearly identifies the missing integration.
 */

const https = require('https');

function getSmsConfig() {
  const provider = (process.env.SMS_PROVIDER || 'twilio').toLowerCase();
  
  if (provider === 'msg91') {
    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;
    const senderId = process.env.MSG91_SENDER_ID || 'LIBRAM';
    const isConfigured = Boolean(authKey && templateId);
    const missing = [];
    if (!authKey) missing.push('MSG91_AUTH_KEY');
    if (!templateId) missing.push('MSG91_TEMPLATE_ID');

    return {
      provider: 'msg91',
      isConfigured,
      authKey,
      templateId,
      senderId,
      missing
    };
  }

  // Default: Twilio
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  const isConfigured = Boolean(accountSid && authToken && fromNumber);
  const missing = [];
  if (!accountSid) missing.push('TWILIO_ACCOUNT_SID');
  if (!authToken) missing.push('TWILIO_AUTH_TOKEN');
  if (!fromNumber) missing.push('TWILIO_PHONE_NUMBER');

  return {
    provider: 'twilio',
    isConfigured,
    accountSid,
    authToken,
    fromNumber,
    missing
  };
}

/**
 * Dispatch real SMS message via configured provider
 */
async function sendSmsOtp(phoneNumber, otpCode, purpose = 'verification', expiresInSeconds = 300) {
  const config = getSmsConfig();

  const validityLabel = expiresInSeconds <= 60
    ? `${expiresInSeconds} seconds only`
    : `${Math.max(1, Math.round(expiresInSeconds / 60))} minutes`;

  if (!config.isConfigured) {
    const missingList = config.missing.join(', ');
    const err = new Error(
      `SMS Gateway is not configured. Missing environment variables in backend/.env: ${missingList}. ` +
      `Please configure ${config.provider.toUpperCase()} credentials to send real SMS OTPs.`
    );
    err.code = 'SMS_GATEWAY_NOT_CONFIGURED';
    err.provider = config.provider;
    err.missing = config.missing;
    throw err;
  }

  const messageText = `Your LibraMind Library verification code is ${otpCode}. Valid for ${validityLabel}. Do not share this code with anyone.`;

  if (config.provider === 'twilio') {
    return sendTwilioSms(config, phoneNumber, messageText);
  } else if (config.provider === 'msg91') {
    return sendMsg91Otp(config, phoneNumber, otpCode);
  }

  throw new Error(`Unsupported SMS provider: ${config.provider}`);
}

/**
 * Send SMS using Twilio REST API
 */
function sendTwilioSms(config, to, body) {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      To: to,
      From: config.fromNumber,
      Body: body
    }).toString();

    const options = {
      hostname: 'api.twilio.com',
      port: 443,
      path: `/2010-04-01/Accounts/${config.accountSid}/Messages.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Basic ${Buffer.from(`${config.accountSid}:${config.authToken}`).toString('base64')}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, sid: parsed.sid, provider: 'twilio' });
          } else {
            const err = new Error(parsed.message || `Twilio SMS failed with HTTP status ${res.statusCode}`);
            err.twilioCode = parsed.code;
            reject(err);
          }
        } catch (e) {
          reject(new Error(`Failed to parse Twilio response: ${data}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error(`Twilio network request error: ${err.message}`));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Send OTP using MSG91 OTP API
 */
function sendMsg91Otp(config, mobile, otpCode) {
  return new Promise((resolve, reject) => {
    const cleanMobile = mobile.replace(/[^0-9]/g, '');
    const options = {
      hostname: 'control.msg91.com',
      port: 443,
      path: `/api/v5/otp?template_id=${encodeURIComponent(config.templateId)}&mobile=${encodeURIComponent(cleanMobile)}&authkey=${encodeURIComponent(config.authKey)}&otp=${encodeURIComponent(otpCode)}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'success' || (res.statusCode >= 200 && res.statusCode < 300)) {
            resolve({ success: true, msg91Response: parsed, provider: 'msg91' });
          } else {
            reject(new Error(parsed.message || 'MSG91 OTP dispatch failed'));
          }
        } catch (e) {
          reject(new Error(`Failed to parse MSG91 response: ${data}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error(`MSG91 network request error: ${err.message}`));
    });

    req.end();
  });
}

module.exports = {
  getSmsConfig,
  isConfigured: () => getSmsConfig().isConfigured,
  sendSmsOtp,
  sendVerificationSMS: sendSmsOtp
};
