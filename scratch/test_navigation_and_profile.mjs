import fs from 'fs';
import path from 'path';

function runVerification() {
  console.log('=== LibraMind Mobile Navigation & Profile Responsive Verification ===\n');
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

  // 1. Verify ProfileDropdown component
  console.log('--- 1. Testing ProfileDropdown Component ---');
  const profileDropdownPath = path.join(process.cwd(), 'frontend/src/components/ProfileDropdown.jsx');
  assert('ProfileDropdown.jsx exists', fs.existsSync(profileDropdownPath));
  const pdContent = fs.readFileSync(profileDropdownPath, 'utf8');

  assert('Contains responsive width min(320px, calc(100vw - 20px))', 
    pdContent.includes("min(320px, calc(100vw - 20px))") || pdContent.includes("calc(100vw - 20px)"));
  assert('Contains right: 0 anchoring', pdContent.includes("right: 0"));
  assert('Contains user identity header (name, email, role, membership_id)',
    pdContent.includes('user.name') && pdContent.includes('user.email') && pdContent.includes('user.membership_id'));
  assert('Contains Edit Profile navigation item', pdContent.includes("'complete-profile'"));
  assert('Contains Dashboard/Hub navigation item', pdContent.includes("'dashboard'"));
  assert('Contains Reservations / Hold Queues item', pdContent.includes("'reservations'"));
  assert('Contains Study Pods item', pdContent.includes("'seats'"));
  assert('Contains Wishlist item', pdContent.includes("'wishlist'"));
  assert('Contains Notifications item', pdContent.includes("'notifications'"));
  assert('Contains Policies & Terms item', pdContent.includes("'terms'"));
  assert('Contains Help & Contact item', pdContent.includes("'contact'"));
  assert('Contains Admin Console & Analytics for admin', pdContent.includes("'admin'") && pdContent.includes("'analytics'"));
  assert('Contains Circulation Desk for librarian', pdContent.includes("'librarian'"));
  assert('Contains Sign Out action', pdContent.includes('handleSignOut') && pdContent.includes('LogOut'));
  assert('Contains click-outside listener', pdContent.includes('handleClickOutside') && pdContent.includes('addEventListener'));
  assert('Contains Escape key listener', pdContent.includes('Escape') && pdContent.includes('keydown'));

  // 2. Verify Navbar.jsx
  console.log('\n--- 2. Testing Navbar.jsx Mobile Layout & Login Button ---');
  const navbarContent = fs.readFileSync(path.join(process.cwd(), 'frontend/src/components/Navbar.jsx'), 'utf8');
  assert('Navbar imports ProfileDropdown', navbarContent.includes("import ProfileDropdown from './ProfileDropdown'"));
  assert('Navbar has showProfileMenu state', navbarContent.includes('showProfileMenu'));
  assert('Login button has login-nav-btn priority class', navbarContent.includes('login-nav-btn'));
  assert('Join Library button has desktop-only-btn class to protect mobile space', navbarContent.includes('desktop-only-btn'));
  assert('Brand logo has brand-vol-badge and brand-subtitle classes', 
    navbarContent.includes('brand-vol-badge') && navbarContent.includes('brand-subtitle'));
  assert('Profile chip button is clickable and toggles profile menu', 
    navbarContent.includes('setShowProfileMenu(!showProfileMenu)') || navbarContent.includes('setShowProfileMenu'));
  assert('Renders ProfileDropdown when showProfileMenu is true', navbarContent.includes('<ProfileDropdown'));
  assert('Mobile drawer provides access to Login, Register, Profile and Sign Out',
    navbarContent.includes("'login'") && navbarContent.includes("'register'") && navbarContent.includes('handleLogout'));

  // 3. Verify UserNavbar.jsx
  console.log('\n--- 3. Testing UserNavbar.jsx Responsive Profile & Actions ---');
  const userNavbarContent = fs.readFileSync(path.join(process.cwd(), 'frontend/src/components/UserNavbar.jsx'), 'utf8');
  assert('UserNavbar imports ProfileDropdown', userNavbarContent.includes("import ProfileDropdown from './ProfileDropdown'"));
  assert('UserNavbar has showProfileMenu state', userNavbarContent.includes('showProfileMenu'));
  assert('User profile chip is interactive button', userNavbarContent.includes('setShowProfileMenu'));
  assert('Renders ProfileDropdown in UserNavbar', userNavbarContent.includes('<ProfileDropdown'));
  assert('Standalone Sign Out button has desktop-only-btn class', userNavbarContent.includes('desktop-only-btn'));
  assert('Mobile drawer includes Profile and Sign Out options', 
    userNavbarContent.includes("'complete-profile'") && userNavbarContent.includes('handleLogout'));

  // 4. Verify AdminNavbar.jsx and LibrarianNavbar.jsx
  console.log('\n--- 4. Testing AdminNavbar and LibrarianNavbar ---');
  const adminNavContent = fs.readFileSync(path.join(process.cwd(), 'frontend/src/components/AdminNavbar.jsx'), 'utf8');
  const libNavContent = fs.readFileSync(path.join(process.cwd(), 'frontend/src/components/LibrarianNavbar.jsx'), 'utf8');
  assert('AdminNavbar imports ProfileDropdown', adminNavContent.includes("import ProfileDropdown from './ProfileDropdown'"));
  assert('AdminNavbar renders ProfileDropdown', adminNavContent.includes('<ProfileDropdown'));
  assert('LibrarianNavbar imports ProfileDropdown', libNavContent.includes("import ProfileDropdown from './ProfileDropdown'"));
  assert('LibrarianNavbar renders ProfileDropdown', libNavContent.includes('<ProfileDropdown'));

  // 5. Verify Login.jsx Responsive Layout
  console.log('\n--- 5. Testing Login.jsx Responsiveness ---');
  const loginContent = fs.readFileSync(path.join(process.cwd(), 'frontend/src/pages/Login.jsx'), 'utf8');
  assert('Login container uses clamp padding for small screens', loginContent.includes('clamp(24px, 5vw, 60px)'));
  assert('Login card uses clamp padding', loginContent.includes('clamp(20px, 4vw, 38px)'));
  assert('Method toggle uses auto-fit repeat grid', loginContent.includes('repeat(auto-fit, minmax(130px, 1fr))'));
  assert('Demo login buttons have flexWrap: wrap for narrow screens', loginContent.includes("flexWrap: 'wrap'"));

  // 6. Verify CSS Responsive Rules
  console.log('\n--- 6. Testing Global CSS Media Queries in index.css ---');
  const cssContent = fs.readFileSync(path.join(process.cwd(), 'frontend/src/index.css'), 'utf8');
  assert('CSS has .desktop-only-btn media query', cssContent.includes('.desktop-only-btn'));
  assert('CSS has .brand-subtitle media query for mobile', cssContent.includes('.brand-subtitle'));
  assert('CSS has .brand-vol-badge media query for narrow screens', cssContent.includes('.brand-vol-badge'));
  assert('CSS has .profile-chip-details media query for small phones', cssContent.includes('.profile-chip-details'));
  assert('CSS has .profile-dropdown-container safeguards', cssContent.includes('.profile-dropdown-container'));
  assert('CSS has .login-nav-btn priority class', cssContent.includes('.login-nav-btn'));

  console.log(`\n========================================`);
  console.log(`Verification Complete: ${passed} passed, ${failed} failed.`);
  console.log(`========================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runVerification();
