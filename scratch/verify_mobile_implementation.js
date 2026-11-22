const fs = require('fs');

console.log('=== VERIFYING MOBILE ROTUNDA IMPLEMENTATION ===');

const carousel = fs.readFileSync('frontend/src/components/CircularBookCarousel.jsx', 'utf8');
const home = fs.readFileSync('frontend/src/pages/Home.jsx', 'utf8');
const dashboard = fs.readFileSync('frontend/src/pages/StudentDashboard.jsx', 'utf8');
const catalog = fs.readFileSync('frontend/src/pages/Catalog.jsx', 'utf8');

const hasMobileGeometry = carousel.includes('mobileGeometry = useMemo') && carousel.includes('ROTUNDA SHELF');
const hasMobileTouch = carousel.includes('handleTouchStart') && carousel.includes('handleTouchMove');
const hasOuterAndInnerMobile = carousel.includes('outBooks.map') && carousel.includes('inBooks.map');
const hasInspectorCard = carousel.includes('activeBookCoverUrl') && carousel.includes('Examine');

const homeHasCarousel = home.includes('CircularBookCarousel') && home.includes('<CircularBookCarousel');
const dashboardHasCarousel = dashboard.includes('CircularBookCarousel') && dashboard.includes('<CircularBookCarousel');
const catalogHasCarousel = catalog.includes('CircularBookCarousel') && catalog.includes('<CircularBookCarousel');

console.log('1. Carousel has Mobile Orbital Geometry:', hasMobileGeometry);
console.log('2. Carousel has Touch Handlers for Screen Swiping:', hasMobileTouch);
console.log('3. Carousel has Concentric Outer & Inner Shelves on Mobile:', hasOuterAndInnerMobile);
console.log('4. Carousel has Floating Inspector Card on Mobile:', hasInspectorCard);
console.log('5. Home page integrates Mobile Circular Shelf:', homeHasCarousel);
console.log('6. Student Dashboard integrates Mobile Circular Shelf:', dashboardHasCarousel);
console.log('7. Catalog page integrates Circular Shelf:', catalogHasCarousel);
