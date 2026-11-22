const fs = require('fs');
const content = fs.readFileSync('scratch/old_carousel.jsx', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (/volume|rotate|presentation|360/i.test(l)) {
    console.log(`${i+1}: ${l.trim()}`);
  }
});
