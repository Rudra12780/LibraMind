import fs from 'fs';
import path from 'path';

function runTests() {
  console.log('--- Testing Dashboard & Navigation Fixes ---');

  // 1. Check frontend/src/api.js
  const apiSrc = fs.readFileSync('frontend/src/api.js', 'utf8');
  if (!apiSrc.includes('getUserSeatReservations:') || !apiSrc.includes("request('/seats/my-bookings')")) {
    throw new Error('FAIL: api.getUserSeatReservations is missing in frontend/src/api.js');
  }
  if (!apiSrc.includes('libramind:data-updated')) {
    throw new Error('FAIL: libramind:data-updated event dispatch missing in frontend/src/api.js');
  }
  console.log('✓ PASS: api.js has getUserSeatReservations and real-time custom event dispatch');

  // 2. Check frontend/src/components/UserNavbar.jsx
  const userNavSrc = fs.readFileSync('frontend/src/components/UserNavbar.jsx', 'utf8');
  if (!userNavSrc.includes("id: 'home'")) {
    throw new Error('FAIL: Home link missing in UserNavbar.jsx');
  }
  if (!userNavSrc.includes("label: 'Home'")) {
    throw new Error('FAIL: Consistent Home label missing in UserNavbar.jsx');
  }
  if (userNavSrc.includes("label: isCurrentlyDashboard ? 'Home' : 'Dashboard'")) {
    throw new Error('FAIL: UserNavbar is still dynamically toggling Dashboard label');
  }
  if (userNavSrc.includes("Study Pods${") || userNavSrc.includes("Wishlist${")) {
    throw new Error('FAIL: UserNavbar still contains embedded number counts in labels');
  }
  if (!userNavSrc.includes("label: 'Study Pods'")) {
    throw new Error('FAIL: Clean Study Pods label missing in UserNavbar');
  }
  if (!userNavSrc.includes("label: 'Wishlist'")) {
    throw new Error('FAIL: Clean Wishlist label missing in UserNavbar');
  }
  if (!userNavSrc.includes("id: 'wishlist'")) {
    throw new Error('FAIL: Wishlist item missing from UserNavbar siteNavItems');
  }
  if (!userNavSrc.includes("activePage = 'dashboard'")) {
    throw new Error('FAIL: activePage prop missing in UserNavbar');
  }
  console.log('✓ PASS: UserNavbar consistently displays Home and clean labels without embedded numbers');

  // 3. Check frontend/src/pages/StudentDashboard.jsx
  const dashSrc = fs.readFileSync('frontend/src/pages/StudentDashboard.jsx', 'utf8');
  
  // SS2 check: No Search or Settings icons on Explore Catalog & Curate Interests
  const exploreIdx = dashSrc.indexOf('<span>Explore Catalog</span>');
  const curateIdx = dashSrc.indexOf('<span>Curate Interests</span>');
  if (exploreIdx === -1 || curateIdx === -1) {
    throw new Error('FAIL: Explore Catalog or Curate Interests button not found in StudentDashboard.jsx');
  }
  const exploreSnippet = dashSrc.substring(exploreIdx - 200, exploreIdx + 100);
  const curateSnippet = dashSrc.substring(curateIdx - 200, curateIdx + 100);
  if (exploreSnippet.includes('<Search') || curateSnippet.includes('<Settings')) {
    throw new Error('FAIL: Search or Settings icons still present on Explore Catalog / Curate Interests buttons');
  }
  console.log('✓ PASS: Explore Catalog and Curate Interests buttons have no icons (SS2 resolved)');

  // SS3 check: Resilient Promise.all and real-time event listener
  if (!dashSrc.includes('api.getUserSeatReservations().catch(')) {
    throw new Error('FAIL: getUserSeatReservations with catch fallback missing in StudentDashboard.jsx');
  }
  if (!dashSrc.includes("window.addEventListener('libramind:data-updated'")) {
    throw new Error('FAIL: libramind:data-updated listener missing in StudentDashboard.jsx');
  }
  console.log('✓ PASS: StudentDashboard has resilient API calls and real-time auto refresh (SS3 resolved)');

  // SS4 check: Redundant tabs strip removed
  if (dashSrc.includes('All Records') && dashSrc.includes('Borrowed Copies') && dashSrc.includes('Hold Queues') && dashSrc.includes('Compare Matrix')) {
    // Specifically check if the old tab button list is present
    const tabsListMatch = dashSrc.match(/tabs\s*=\s*\[\s*\{\s*id:\s*'all'/);
    if (tabsListMatch) {
      throw new Error('FAIL: Redundant sub-tab filter buttons still found in StudentDashboard.jsx');
    }
  }
  console.log('✓ PASS: Redundant sub-navigation tab strip removed (SS4 resolved)');

  // Section anchors check
  if (!dashSrc.includes('id="loans-section"') || !dashSrc.includes('id="holds-section"') || !dashSrc.includes('id="seats-section"') || !dashSrc.includes('id="wishlist-section"')) {
    throw new Error('FAIL: Section IDs for loans, holds, seats, and wishlist are missing');
  }
  console.log('✓ PASS: All section anchors (loans, holds, seats, wishlist) present');

  // 4. Check frontend/src/App.jsx
  const appSrc = fs.readFileSync('frontend/src/App.jsx', 'utf8');
  if (!appSrc.includes('Boolean(user && user.role !== \'librarian\' && !(user.role === \'admin\' && adminVerified))')) {
    throw new Error('FAIL: isUserPortal condition in App.jsx does not keep UserNavbar across pages');
  }
  if (!appSrc.includes('initialStats={userStats}')) {
    throw new Error('FAIL: initialStats prop not passed to StudentDashboard in App.jsx');
  }
  console.log('✓ PASS: App.jsx maintains UserNavbar and passes real-time initialStats to StudentDashboard');

  console.log('\nALL CHECKS PASSED SUCCESSFULLY!');
}

runTests();
