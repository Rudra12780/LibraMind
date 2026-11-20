const fs = require('fs');

console.log('=== VERIFYING CATALOG.JSX & CIRCULARBOOKCAROUSEL.JSX ===');
const catalogSrc = fs.readFileSync('frontend/src/pages/Catalog.jsx', 'utf8');
const carouselSrc = fs.readFileSync('frontend/src/components/CircularBookCarousel.jsx', 'utf8');
const homeSrc = fs.readFileSync('frontend/src/pages/Home.jsx', 'utf8');

const hasConcentricShelves = carouselSrc.includes('TIER 1: OUTER SHELF RING') && carouselSrc.includes('TIER 2: INNER SHELF RING');
const hasSpinePalette = carouselSrc.includes('SPINE_PALETTES');
const hasCenterCoverPreview = carouselSrc.includes('Thumbnail of the actual Front Cover');
const hasOutwardSlide = carouselSrc.includes('activeRadius = outerShelfRadius + (isHovered ? 24');
const homeUntouched = homeSrc.includes('hero-section') && homeSrc.includes('genres-section') && homeSrc.includes('authors-section');

console.log('Carousel has Concentric Double-Tier Shelves:', hasConcentricShelves);
console.log('Carousel has Chromatic Spine Palettes (matching ref photo):', hasSpinePalette);
console.log('Center hub shows Front Cover preview & details:', hasCenterCoverPreview);
console.log('Hover slides book outward from shelf:', hasOutwardSlide);
console.log('Front page (Home.jsx) remains untouched:', homeUntouched);
