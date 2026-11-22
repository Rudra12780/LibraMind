console.log('Testing Single Layer Rotary Math:');
const totalBooks = 76;
const R = 250;
const stepAngle = 360 / totalBooks;
console.log('Step angle for 76 books:', stepAngle.toFixed(3), 'deg');

const centerX = 345;
const centerY = 240;

// Test visible slice facing left into screen (-180deg center)
for (let i = 0; i < 5; i++) {
  const angleDeg = (i * stepAngle - 180);
  const rad = angleDeg * Math.PI / 180;
  const x = centerX + R * Math.cos(rad);
  const y = centerY + R * Math.sin(rad);
  console.log(`Book ${i}: angle=${angleDeg.toFixed(1)}deg, x=${x.toFixed(1)}px, y=${y.toFixed(1)}px`);
}
