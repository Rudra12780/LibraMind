const fs = require('fs');
const content = fs.readFileSync('scratch/old_carousel.jsx', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('VOLUMES') || l.includes('Presentation') || l.includes('Scroll or drag')) {
    console.log(`${i+1}: ${l}`);
  }
});
