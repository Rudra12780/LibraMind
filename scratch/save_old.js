const { execSync } = require('child_process');
const fs = require('fs');
const content = execSync('git --no-pager show dea05ee:frontend/src/components/CircularBookCarousel.jsx').toString();
fs.writeFileSync('scratch/old_carousel.jsx', content);
console.log('Saved old carousel, length:', content.length);
