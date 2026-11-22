const { execSync } = require('child_process');
try {
  const commits = execSync('git --no-pager log --format="%H %s" -n 25').toString().split('\n').filter(Boolean);
  for (const c of commits) {
    const hash = c.split(' ')[0];
    const diff = execSync(`git --no-pager show ${hash}`).toString();
    if (diff.includes('FRONT COVER DISPLAY') || diff.includes('Upright Front Cover Presentation')) {
      console.log('Found in commit:', c);
    }
  }
} catch (e) {
  console.error(e.message);
}
