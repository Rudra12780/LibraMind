import path from 'path';
import smsService from '../backend/services/smsService.js';
import { SUBJECT_CATEGORIES, TOTAL_SUBCATEGORIES_COUNT, ALL_UNIQUE_SUBCATEGORIES } from '../frontend/src/data/interestCategories.js';
import OTP from '../backend/models/OTP.js';
import User from '../backend/models/User.js';

async function runTests() {
  console.log('=== LibraMind Authentication, OTP & Category Verification ===\n');
  let passed = 0;
  let failed = 0;

  function assert(desc, condition) {
    if (condition) {
      console.log(`[PASS] ${desc}`);
      passed++;
    } else {
      console.error(`[FAIL] ${desc}`);
      failed++;
    }
  }

  // 1. Verify Category Structure
  console.log('--- 1. Testing Academic Subject Categories ---');
  assert(`Total categories is exactly 15 (Found: ${SUBJECT_CATEGORIES.length})`, SUBJECT_CATEGORIES.length === 15);
  assert(`Total subcategories count is 140 (Found: ${TOTAL_SUBCATEGORIES_COUNT})`, TOTAL_SUBCATEGORIES_COUNT === 140);
  assert(`Total unique subcategories is 140 (Found: ${ALL_UNIQUE_SUBCATEGORIES.length})`, ALL_UNIQUE_SUBCATEGORIES.length === 140);

  console.log('\nCategories breakdown:');
  SUBJECT_CATEGORIES.forEach((cat, idx) => {
    console.log(`  ${idx + 1}. ${cat.name} (${cat.subcategories.length} subcategories)`);
  });

  // 2. Test SMS Service Logic
  console.log('\n--- 2. Testing SMS Service Gateway Logic ---');
  const configured = smsService.isConfigured();
  assert(`isConfigured() returns boolean (${configured})`, typeof configured === 'boolean');
  
  try {
    await smsService.sendVerificationSMS('+919876543210', '123456');
    assert('sendVerificationSMS throws error when unconfigured', false);
  } catch (err) {
    assert(`sendVerificationSMS reports clear missing gateway error: "${err.message}"`, 
      err.message.includes('SMS Gateway is not configured') || err.message.includes('SMS'));
  }

  // 3. Test OTP & User Model Schemas
  console.log('\n--- 3. Testing Mongoose Model Schemas ---');
  const otpPaths = OTP.schema.paths;
  assert('OTP schema has purpose field', !!otpPaths['purpose']);
  assert('OTP purpose enum contains register and login', 
    otpPaths['purpose'].enumValues && otpPaths['purpose'].enumValues.includes('register') && otpPaths['purpose'].enumValues.includes('login'));
  assert('OTP schema has phone field', !!otpPaths['phone']);
  assert('OTP schema has otp_code field', !!otpPaths['otp_code']);
  assert('OTP schema has expires_at field', !!otpPaths['expires_at']);

  const userPaths = User.schema.paths;
  assert('User schema has phone_verified field', !!userPaths['phone_verified']);
  assert('User schema has phone field', !!userPaths['phone']);

  console.log(`\n========================================`);
  console.log(`Verification Complete: ${passed} passed, ${failed} failed.`);
  console.log(`========================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});

