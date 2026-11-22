const centerX = 345;
const centerY = 260;

// Test two touch points during a swipe down along the left arc
const p1 = { x: 80, y: 220 };
const p2 = { x: 80, y: 300 };

const a1 = Math.atan2(p1.y - centerY, p1.x - centerX) * 180 / Math.PI;
const a2 = Math.atan2(p2.y - centerY, p2.x - centerX) * 180 / Math.PI;

console.log('Swipe from (80, 220) to (80, 300):');
console.log('Angle 1:', a1.toFixed(1), 'deg');
console.log('Angle 2:', a2.toFixed(1), 'deg');
console.log('Delta angle:', (a2 - a1).toFixed(1), 'deg');
