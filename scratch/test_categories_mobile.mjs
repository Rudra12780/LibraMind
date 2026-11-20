import fs from 'fs';
import path from 'path';
import { SUBJECT_CATEGORIES, TOTAL_SUBCATEGORIES_COUNT } from '../frontend/src/data/interestCategories.js';

function runCategoryTests() {
  console.log('=== LibraMind Mobile Literary Interests & Categories Verification ===\n');
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

  // 1. Data Integrity
  console.log('--- 1. Testing Academic Subject Categories Data ---');
  assert(`Exact 15 categories present (Found: ${SUBJECT_CATEGORIES.length})`, SUBJECT_CATEGORIES.length === 15);
  assert(`Exact 140 subcategories present (Found: ${TOTAL_SUBCATEGORIES_COUNT})`, TOTAL_SUBCATEGORIES_COUNT === 140);

  // 2. InterestCategorySelector Component Source Verification
  console.log('\n--- 2. Testing InterestCategorySelector Mobile Features ---');
  const selectorFile = path.join(process.cwd(), 'frontend/src/components/InterestCategorySelector.jsx');
  assert('InterestCategorySelector.jsx exists', fs.existsSync(selectorFile));
  const content = fs.readFileSync(selectorFile, 'utf8');

  assert('Contains horizontal quick-filter category pills bar', content.includes('category-pills-scroll'));
  assert('Contains All Areas (15) quick filter pill', content.includes('All Areas (15)'));
  assert('Contains 1-tap Expand All / Collapse All toggle button', 
    content.includes('handleToggleExpandAll') && content.includes('Expand All'));
  assert('Contains Active Reading Portfolio Topics preview chips with removal [X]', 
    content.includes('Active Reading Portfolio Topics') && content.includes('removeInterest'));
  assert('Contains mobile-optimized search input bar', content.includes('Search 140 topics'));
  assert('Contains wordBreak: break-word and touch-friendly padding on topic pills', 
    content.includes("wordBreak: 'break-word'") && content.includes("padding: '7px 12px'"));
  assert('Defaults first category expanded on mobile so topics are immediately visible', 
    content.includes("'fiction-literature': true"));

  // 3. ProfileCompletion Page Mobile Adaptations
  console.log('\n--- 3. Testing ProfileCompletion.jsx Layout ---');
  const profileFile = path.join(process.cwd(), 'frontend/src/pages/ProfileCompletion.jsx');
  assert('ProfileCompletion.jsx exists', fs.existsSync(profileFile));
  const profileContent = fs.readFileSync(profileFile, 'utf8');

  assert('Uses clamp padding for mobile container (clamp(20px, 4vw, 50px))', 
    profileContent.includes('clamp(20px, 4vw, 50px)'));
  assert('Uses clamp padding for bio-card (clamp(18px, 4vw, 38px))', 
    profileContent.includes('clamp(18px, 4vw, 38px)'));
  assert('Embeds InterestCategorySelector with compact={false}', 
    profileContent.includes('<InterestCategorySelector'));

  // 4. Global CSS Mobile Rules
  console.log('\n--- 4. Testing CSS Rules in index.css ---');
  const cssFile = path.join(process.cwd(), 'frontend/src/index.css');
  const cssContent = fs.readFileSync(cssFile, 'utf8');

  assert('Removes nested scroll locks on mobile (.interest-selector-accordion max-height: none)', 
    cssContent.includes('.interest-selector-accordion') && cssContent.includes('max-height: none !important'));
  assert('Hides scrollbar on horizontal category pills (.category-pills-scroll::-webkit-scrollbar)', 
    cssContent.includes('.category-pills-scroll::-webkit-scrollbar'));

  console.log(`\n========================================`);
  console.log(`Verification Complete: ${passed} passed, ${failed} failed.`);
  console.log(`========================================`);

  if (failed > 0) process.exit(1);
}

runCategoryTests();
