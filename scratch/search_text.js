const fs = require('fs');
const path = require('path');

function searchDir(dir, pattern) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f === 'node_modules' || f === '.git' || f === 'dist') continue;
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      searchDir(full, pattern);
    } else if (stat.isFile() && (f.endsWith('.jsx') || f.endsWith('.js') || f.endsWith('.html') || f.endsWith('.md'))) {
      const content = fs.readFileSync(full, 'utf8');
      if (pattern.test(content)) {
        console.log('Found in:', full);
        const lines = content.split('\n');
        lines.forEach((l, i) => {
          if (pattern.test(l)) {
            console.log(`  Line ${i+1}: ${l.trim()}`);
          }
        });
      }
    }
  }
}

console.log('Searching for FRONT COVER DISPLAY...');
searchDir('.', /FRONT COVER DISPLAY/i);

console.log('Searching for Upright Front Cover Presentation...');
searchDir('.', /Upright Front Cover Presentation/i);

console.log('Searching for Scroll or drag wheel...');
searchDir('.', /Scroll or drag wheel/i);
