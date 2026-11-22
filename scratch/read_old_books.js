const fs = require('fs');
const content = fs.readFileSync('scratch/old_carousel.jsx', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(50, 95).join('\n'));
