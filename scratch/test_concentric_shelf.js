// Test concentric bookshelf geometry
const stageSize = 580;
const center = stageSize / 2; // 290

const R_outer = 242;
const R_inner = 172;
const outerCount = 28;
const innerCount = 22;

console.log(`Concentric Bookshelf Test: Stage ${stageSize}x${stageSize}, Center: (${center}, ${center})`);
console.log(`Outer Ring: R=${R_outer}px, ${outerCount} books. Step=${(360/outerCount).toFixed(2)} deg`);
console.log(`Inner Ring: R=${R_inner}px, ${innerCount} books. Step=${(360/innerCount).toFixed(2)} deg`);

// Sample outer book positions
[0, 7, 14, 21].forEach(i => {
  const angle = (i * 360 / outerCount) * Math.PI / 180;
  const x = center + R_outer * Math.cos(angle);
  const y = center + R_outer * Math.sin(angle);
  console.log(`  Outer book ${i}: angle=${(i * 360 / outerCount).toFixed(0)}deg, pos=(${x.toFixed(1)}, ${y.toFixed(1)})`);
});

// Sample inner book positions
[0, 5, 11, 16].forEach(i => {
  const angle = (i * 360 / innerCount) * Math.PI / 180;
  const x = center + R_inner * Math.cos(angle);
  const y = center + R_inner * Math.sin(angle);
  console.log(`  Inner book ${i}: angle=${(i * 360 / innerCount).toFixed(0)}deg, pos=(${x.toFixed(1)}, ${y.toFixed(1)})`);
});
