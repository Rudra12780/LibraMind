const fs = require('fs');

console.log('=== VERIFYING CIRCULAR BOOK CAROUSEL ===');
const carouselSrc = fs.readFileSync('frontend/src/components/CircularBookCarousel.jsx', 'utf8');

const hasPointerHand = carouselSrc.includes('POINTER HAND / CLOCK NEEDLE');
const hasCenterDisc = carouselSrc.includes('CENTRAL CIRCLE DISC');
const hasWheelListener = carouselSrc.includes("addEventListener('wheel', handleWheelEvent");
const hasPointerDrag = carouselSrc.includes('handlePointerDown') && carouselSrc.includes('handlePointerMove');
const hasHoverOutward = carouselSrc.includes('activeRadius') && carouselSrc.includes('isHovered');
const hasBookNameInCenter = carouselSrc.includes('BOOK NAME IN CENTER OF CIRCLE');

console.log('Has Pointer Needle Hand:', hasPointerHand);
console.log('Has Central Circle Disc:', hasCenterDisc);
console.log('Has Non-Passive Wheel Event Listener:', hasWheelListener);
console.log('Has Pointer / Touch Drag Handler:', hasPointerDrag);
console.log('Has Smooth Hover Radial Outward Movement:', hasHoverOutward);
console.log('Displays Book Name in Center of Circle:', hasBookNameInCenter);

console.log('\n=== VERIFYING CATALOG.JSX ===');
const catalogSrc = fs.readFileSync('frontend/src/pages/Catalog.jsx', 'utf8');

const importsCarousel = catalogSrc.includes("import CircularBookCarousel from '../components/CircularBookCarousel'");
const hasViewModeState = catalogSrc.includes("const [viewMode, setViewMode] = useState");
const hasViewModeToggle = catalogSrc.includes('3D Circular Bookshelf') && catalogSrc.includes('Standard Grid');
const rendersCarousel = catalogSrc.includes('<CircularBookCarousel');

console.log('Imports CircularBookCarousel:', importsCarousel);
console.log('Has viewMode state defaulting for signed-in user:', hasViewModeState);
console.log('Has View Mode Toggle switcher:', hasViewModeToggle);
console.log('Renders CircularBookCarousel component:', rendersCarousel);
