const total = 76;
const step = 360 / total;
let visibleCount = 0;
let culledCount = 0;

for (let i = 0; i < total; i++) {
  const angleDeg = (i * step - 180) % 360;
  const rad = (angleDeg * Math.PI) / 180;
  const cosVal = Math.cos(rad);
  if (cosVal > 0.35) {
    culledCount++;
  } else {
    visibleCount++;
  }
}

console.log(`Out of ${total} books:`);
console.log(`Visible on phone screen: ${visibleCount}`);
console.log(`Culled off-screen: ${culledCount}`);
