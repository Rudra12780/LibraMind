// Test 1: Category with 5 books (like AI & Data Science)
const total = 5;
const step = 360 / total;
console.log('5-book step:', step);
for (let i = 0; i < total; i++) {
  const angleDeg = (i * step - 90) % 360;
  const angleRad = (angleDeg * Math.PI) / 180;
  const rot = (Math.sin(angleRad) * 8).toFixed(1);
  console.log(`Book ${i}: angle=${angleDeg} deg, rot=${rot} deg (Upright: ${Math.abs(parseFloat(rot)) <= 8})`);
}

// Test 2: Radius and clearances for N = 5
const size = 440;
const radius = 148;
const hub = 150;
const cardW = 70;
const cardH = 106;
const innerBookEdge = radius - cardH / 2;
const hubRadius = hub / 2;
const hubClearance = innerBookEdge - hubRadius;
const outerBookEdge = radius + cardH / 2;
const rimRadius = size / 2;
const rimClearance = rimRadius - outerBookEdge;

console.log('Hub clearance (px):', hubClearance);
console.log('Rim clearance (px):', rimClearance);

// Test 3: Chord distance between books
const chordDist = 2 * radius * Math.sin((step / 2) * Math.PI / 180);
const gapBetweenBooks = chordDist - cardW;
console.log('Chord distance (px):', chordDist.toFixed(1));
console.log('Gap between books (px):', gapBetweenBooks.toFixed(1));
