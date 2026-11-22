const { execSync } = require('child_process');
try {
  const diff = execSync('git show dea05ee --stat').toString();
  console.log(diff);
  const diffContent = execSync('git show dea05ee:frontend/src/components/CircularBookCarousel.jsx').toString();
  // Find where Prev / Next / Revolve was in that commit
  const lines = diffContent.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('Revolve') || l.includes('handleStepPrev') || l.includes('Prev')) {
      console.log(`${i+1}: ${l}`);
    }
  });
} catch (e) {
  console.error(e.message);
}
