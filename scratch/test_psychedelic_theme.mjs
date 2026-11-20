import fs from 'fs';

console.log('=== Verifying Cosmic Neon Psychedelic Theme Implementation ===\n');

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

// 1. Check ThemeContext & ThemeToggle
const themeContext = fs.readFileSync('frontend/src/context/ThemeContext.jsx', 'utf8');
const themeToggle = fs.readFileSync('frontend/src/components/ThemeToggle.jsx', 'utf8');
assert(themeContext.includes("localStorage.getItem('libramind_theme') || 'psychedelic'"), 'ThemeContext defaults to psychedelic');
assert(themeToggle.includes('🍄 Psychedelic'), 'ThemeToggle supports Psychedelic label');
assert(themeToggle.includes('📜 Classic'), 'ThemeToggle supports Classic label');

// 2. Check Navbars have ThemeToggle
const userNav = fs.readFileSync('frontend/src/components/UserNavbar.jsx', 'utf8');
const libNav = fs.readFileSync('frontend/src/components/LibrarianNavbar.jsx', 'utf8');
const adminNav = fs.readFileSync('frontend/src/components/AdminNavbar.jsx', 'utf8');
const pubNav = fs.readFileSync('frontend/src/components/Navbar.jsx', 'utf8');

assert(userNav.includes('<ThemeToggle'), 'UserNavbar renders ThemeToggle');
assert(libNav.includes('<ThemeToggle'), 'LibrarianNavbar renders ThemeToggle');
assert(adminNav.includes('<ThemeToggle'), 'AdminNavbar renders ThemeToggle');
assert(pubNav.includes('<ThemeToggle'), 'Navbar renders ThemeToggle');

// 3. Check App.jsx wraps ThemeProvider
const appCode = fs.readFileSync('frontend/src/App.jsx', 'utf8');
assert(appCode.includes('<ThemeProvider>'), 'App.jsx wraps tree in ThemeProvider');

// 4. Check index.html sets initial data-theme
const indexHtml = fs.readFileSync('frontend/index.html', 'utf8');
assert(indexHtml.includes('data-theme="psychedelic"'), 'index.html has data-theme="psychedelic" on <html>');

// 5. Check index.css has cosmic neon palette
const indexCss = fs.readFileSync('frontend/src/index.css', 'utf8');
assert(indexCss.includes('#0A0518'), 'index.css has cosmic midnight void (#0A0518)');
assert(indexCss.includes('#FF007F'), 'index.css has hyper-radiant neon magenta (#FF007F)');
assert(indexCss.includes('#00F0FF'), 'index.css has electric cyan (#00F0FF)');
assert(indexCss.includes('html[data-theme="classic"]'), 'index.css preserves Classic Editorial theme');
assert(indexCss.includes('linear-gradient(135deg, #FF007F 0%, #8338EC 50%, #00F0FF 100%)'), 'index.css has chromatic gradient buttons');

console.log(`\nVerification complete: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
process.exit(0);
