const { execSync } = require('child_process');
try {
  const log = execSync('git log -G"Scroll or drag wheel" -p').toString();
  console.log('Found in commits:', log.slice(0, 1000));
} catch (e) {
  console.error(e.message);
}
