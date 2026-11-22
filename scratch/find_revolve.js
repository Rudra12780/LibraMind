const { execSync } = require('child_process');
try {
  const log = execSync('git log -p -n 15 frontend/src/components/CircularBookCarousel.jsx').toString();
  const matches = log.match(/.*Revolve.*/g);
  console.log('Matches:', matches ? matches.slice(0, 5) : 'None');
} catch (e) {
  console.error(e.message);
}
