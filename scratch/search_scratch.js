const fs = require('fs');
const path = require('path');
const dir = 'scratch';
const files = fs.readdirSync(dir);
for (const f of files) {
  const full = path.join(dir, f);
  if (fs.statSync(full).isFile()) {
    try {
      const txt = fs.readFileSync(full, 'utf8');
      if (txt.includes('VOLUMES') || txt.includes('rotate 360') || txt.includes('Presentation')) {
        console.log('Found in scratch file:', f);
      }
    } catch (e) {}
  }
}
