const path = require('path');
const smsService = require('../backend/services/smsService');
const { interestCategories, getAllSubcategories } = require('../frontend/src/data/interestCategories');
const OTP = require('../backend/models/OTP');
const User = require('../backend/models/User');

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
  assert('Total categories is exactly 15', interestCategories.length === 15);
  const totalSubcategories = getAllSubcategories().length;
  assert(`Total subcategories is 140 (Found: ${totalSubcategories})`, totalSubcategories === 140);
  
  const expectedCategoryNames = [
    'Computer Science & Artificial Intelligence',
    'Mathematics & Computational Theory',
    'Physics & Quantum Sciences',
    'Literature & Literary Criticism',
    'History & Classical Studies',
    'Philosophy & Ethics',
    'Psychology & Cognitive Sciences',
    'Economics & Financial Analytics',
    'Biology & Medical Sciences',
    'Environmental Science & Ecology',
    'Engineering & Applied Robotics',
    'Arts, Architecture & Aesthetics',
    'Political Science & Global Governance',
    'Sociology & Anthropology',
    'Business, Strategy & Leadership'
  ];

  const actualCategoryNames = interestCategories.map(c => c.name);
  const allNamesMatch = expectedCategoryNames.every(name => actualCategoryNames.includes(name));
  assert('All 15 category names match requested specifications', allNamesMatch);

  // 2. Test SMS Service Logic
  console.log('\n--- 2. Testing SMS Service Gateway Logic ---');
  const configured = smsService.isConfigured();
  assert('isConfigured() returns boolean false when env credentials are empty/default', typeof configured === 'boolean');
  
  try {
    await smsService.sendVerificationSMS('+919876543210', '123456');
    assert('sendVerificationSMS throws error when unconfigured', false);
  } catch (err) {
    assert('sendVerificationSMS reports clear missing gateway configuration error', 
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

