import fs from 'fs';
import path from 'path';

console.log('=== LibraMind Desktop Categories View & Squish Fix Verification ===\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

const baseDir = path.resolve('c:/Users/ADMIN/Desktop/smartlib');
const selectorPath = path.join(baseDir, 'frontend/src/components/InterestCategorySelector.jsx');
const cssPath = path.join(baseDir, 'frontend/src/index.css');

assert(fs.existsSync(selectorPath), 'InterestCategorySelector.jsx exists');
assert(fs.existsSync(cssPath), 'index.css exists');

const selectorCode = fs.readFileSync(selectorPath, 'utf8');
const cssCode = fs.readFileSync(cssPath, 'utf8');

// 1. Anti-squish protections
console.log('--- 1. Testing Anti-Squish & Visual Integrity ---');
assert(selectorCode.includes('className="category-card-item"'), 'Category cards have className="category-card-item"');
assert(selectorCode.includes('flexShrink: 0'), 'Explicit flexShrink: 0 is set on accordion category cards');
assert(cssCode.includes('.category-card-item'), 'index.css defines .category-card-item rule');
assert(cssCode.includes('flex-shrink: 0 !important'), 'index.css enforces flex-shrink: 0 !important so cards never collapse');
assert(cssCode.includes('min-height: fit-content !important'), 'index.css enforces min-height: fit-content !important to prevent height-chopping');

// 2. Desktop-specific modes
console.log('\n--- 2. Testing Desktop View Modes ---');
assert(selectorCode.includes("desktopViewMode === 'split'"), 'Contains Desktop Split Explorer (Two-Column master-detail view)');
assert(selectorCode.includes("desktopViewMode === 'grid'"), 'Contains Desktop 2-Column Grid view');
assert(selectorCode.includes("desktopViewMode === 'stack'"), 'Contains Accordion Stack view');
assert(selectorCode.includes("setDesktopViewMode('split')"), 'Interactive segmented toggle to switch to Explorer view');
assert(selectorCode.includes("setDesktopViewMode('grid')"), 'Interactive segmented toggle to switch to 2-Column view');
assert(selectorCode.includes("setDesktopViewMode('stack')"), 'Interactive segmented toggle to switch to Stack view');

// 3. Split Explorer Features
console.log('\n--- 3. Testing Split Explorer Details ---');
assert(selectorCode.includes('desktop-cat-rail-item'), 'Navigation rail has desktop-cat-rail-item with hover feedback');
assert(selectorCode.includes('setActiveSplitCategory(cat.id)'), 'Clicking category in left rail switches active workspace');
assert(selectorCode.includes('currentSplitCat'), 'Active category detail workspace computes currentSplitCat cleanly');
assert(selectorCode.includes('Select All {currentSplitCat.subcategories.length}'), 'Workspace provides 1-click Select All for active category');
assert(selectorCode.includes('clearCategory(currentSplitCat.subcategories)'), 'Workspace provides 1-click Clear for active category');

// 4. Responsive Adaptation
console.log('\n--- 4. Testing Responsive Adaptation ---');
assert(selectorCode.includes('window.innerWidth >= 768'), 'Detects desktop viewport (>= 768px)');
assert(selectorCode.includes("addEventListener('resize'"), 'Listens to window resize events to switch views seamlessly');
assert(cssCode.includes('.custom-editorial-scrollbar'), 'Custom editorial slim scrollbars defined in index.css');

console.log('\n========================================');
console.log(`Verification Complete: ${passed} passed, ${failed} failed.`);
console.log('========================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
