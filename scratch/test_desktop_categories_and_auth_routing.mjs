import fs from 'fs';
import path from 'path';

console.log('=== LibraMind Desktop Categories & Auth Routing Verification ===\n');

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

// ── 1. Check InterestCategorySelector & Desktop CSS ──
console.log('--- 1. Testing Desktop Literary Categories & UI ---');
const selectorPath = path.join(baseDir, 'frontend/src/components/InterestCategorySelector.jsx');
const cssPath = path.join(baseDir, 'frontend/src/index.css');

assert(fs.existsSync(selectorPath), 'InterestCategorySelector.jsx exists');
assert(fs.existsSync(cssPath), 'index.css exists');

const selectorCode = fs.readFileSync(selectorPath, 'utf8');
const cssCode = fs.readFileSync(cssPath, 'utf8');

assert(selectorCode.includes('topic-pill-btn'), 'Topic pill buttons have topic-pill-btn class for desktop hover feedback');
assert(selectorCode.includes('title={sub}'), 'Topic pill buttons provide desktop title tooltips');
assert(selectorCode.includes('initial[cat.id] = true'), 'Pre-expands categories matching selected interests on initial load');
assert(selectorCode.includes('setExpandedCategories(prev => {'), 'Auto-expands categories dynamically when currentSelected changes');

assert(cssCode.includes('@media (min-width: 641px)'), 'index.css contains desktop responsive media query (min-width: 641px)');
assert(cssCode.includes('flex-wrap: wrap !important') && cssCode.includes('.category-pills-scroll'), 'Desktop wraps quick category pills so all 15 are immediately visible without horizontal scrolling');
assert(cssCode.includes('.interest-selector-accordion::-webkit-scrollbar'), 'Desktop provides slim custom styled scrollbars for category accordions');
assert(cssCode.includes('.topic-pill-btn:hover'), 'Desktop provides topic pill button hover styling with elevation');

// ── 2. Check App.jsx Routing & Role Redirection ──
console.log('\n--- 2. Testing App.jsx Auth Routing Logic ---');
const appPath = path.join(baseDir, 'frontend/src/App.jsx');
assert(fs.existsSync(appPath), 'App.jsx exists');
const appCode = fs.readFileSync(appPath, 'utf8');

// A. Role-based protection & default page redirection effect
assert(
  appCode.includes("['home', 'login', 'register'].includes(activePage)"),
  'App.jsx redirects authenticated users away from home, login, and register'
);

// B. syncRouteFromLocation root path handling
assert(
  appCode.includes("cleanPath === '' || cleanPath === 'home'") &&
  appCode.includes("if (user) {") &&
  appCode.includes("setActivePage('dashboard')") &&
  appCode.includes("setActivePage('home')"),
  'syncRouteFromLocation: Shows dashboard if signed in; shows main landing page by default if not signed in'
);

// C. syncRouteFromLocation login & register redirection
assert(
  appCode.includes("cleanPath === 'login'") &&
  appCode.includes("cleanPath === 'register'") &&
  appCode.includes("user.role === 'admin' ? 'admin' : user.role === 'librarian' ? 'librarian' : 'dashboard'"),
  'syncRouteFromLocation: Redirects signed-in users on /login and /register to their respective dashboards'
);

// D. navigate function interceptor
assert(
  appCode.includes("if (cleanPage === 'home' && user)") &&
  appCode.includes("user.role === 'admin' ? 'admin' : user.role === 'librarian' ? 'librarian' : 'dashboard'"),
  'navigate(): Intercepts onNavigate("home") while signed in and routes to user dashboard'
);

// E. UserNavbar logo click and nav items
console.log('\n--- 3. Testing UserNavbar Navigation ---');
const userNavPath = path.join(baseDir, 'frontend/src/components/UserNavbar.jsx');
assert(fs.existsSync(userNavPath), 'UserNavbar.jsx exists');
const userNavCode = fs.readFileSync(userNavPath, 'utf8');

assert(
  userNavCode.includes("if (onNavigate) onNavigate('dashboard')"),
  'UserNavbar: handleLogoClick navigates to dashboard instead of home'
);
assert(
  userNavCode.includes("{ id: 'dashboard', label: 'Dashboard', action: () => { setMobileMenuOpen(false); onNavigate('dashboard'); } }"),
  'UserNavbar: First nav item is Dashboard leading to user dashboard'
);
assert(
  userNavCode.includes("onClick={handleLogoClick}"),
  'UserNavbar: Brand logo element uses handleLogoClick'
);

console.log('\n========================================');
console.log(`Verification Complete: ${passed} passed, ${failed} failed.`);
console.log('========================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
