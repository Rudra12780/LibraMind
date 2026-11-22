// Test various rotation angles and dimensions for front covers to eliminate all overlaps
function simulateCircleLayout(N, R, W, H, rotFactor = 0) {
  const step = (2 * Math.PI) / N;
  let maxOverlap = 0;
  let overlaps = 0;

  // Check all pairs
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const a1 = i * step - Math.PI / 2;
      const a2 = j * step - Math.PI / 2;
      
      const cx1 = R * Math.cos(a1);
      const cy1 = R * Math.sin(a1);
      const cx2 = R * Math.cos(a2);
      const cy2 = R * Math.sin(a2);

      const dist = Math.hypot(cx1 - cx2, cy1 - cy2);
      // Rough bounding radius of card
      const cardRadius = Math.hypot(W, H) / 2;
      
      // Detailed SAT (Separating Axis Theorem) or axis-aligned check
      const rot1 = rotFactor === 'radial' ? (a1 * 180 / Math.PI + 90) : (Math.sin(a1) * rotFactor);
      const rot2 = rotFactor === 'radial' ? (a2 * 180 / Math.PI + 90) : (Math.sin(a2) * rotFactor);

      // If rot is small, test bounding box
      const rad1 = Math.abs(rot1 * Math.PI / 180);
      const bbW1 = W * Math.cos(rad1) + H * Math.sin(rad1);
      const bbH1 = W * Math.sin(rad1) + H * Math.cos(rad1);
      const rad2 = Math.abs(rot2 * Math.PI / 180);
      const bbW2 = W * Math.cos(rad2) + H * Math.sin(rad2);
      const bbH2 = W * Math.sin(rad2) + H * Math.cos(rad2);

      const dx = Math.abs(cx1 - cx2);
      const dy = Math.abs(cy1 - cy2);

      const overlapX = (bbW1 + bbW2) / 2 - dx;
      const overlapY = (bbH1 + bbH2) / 2 - dy;

      if (overlapX > 0 && overlapY > 0) {
        overlaps++;
        const area = overlapX * overlapY;
        if (area > maxOverlap) maxOverlap = area;
      }
    }
  }
  return { N, R, W, H, rotFactor, overlaps, maxOverlap: maxOverlap.toFixed(1) };
}

console.log('Mobile tests:');
console.log('N=15, R=135, W=36, H=53, rotFactor=0:', simulateCircleLayout(15, 135, 36, 53, 0));
console.log('N=15, R=135, W=36, H=53, rotFactor=15:', simulateCircleLayout(15, 135, 36, 53, 15));
console.log('N=15, R=135, W=36, H=53, rotFactor=25:', simulateCircleLayout(15, 135, 36, 53, 25));
console.log('N=11, R=130, W=42, H=62, rotFactor=15:', simulateCircleLayout(11, 130, 42, 62, 15));
console.log('N=7, R=125, W=46, H=68, rotFactor=0:', simulateCircleLayout(7, 125, 46, 68, 0));

console.log('\nDesktop tests:');
console.log('N=18, R=225, W=56, H=82, rotFactor=0:', simulateCircleLayout(18, 225, 56, 82, 0));
console.log('N=18, R=225, W=56, H=82, rotFactor=15:', simulateCircleLayout(18, 225, 56, 82, 15));
console.log('N=18, R=225, W=56, H=82, rotFactor=25:', simulateCircleLayout(18, 225, 56, 82, 25));
console.log('N=15, R=225, W=58, H=86, rotFactor=15:', simulateCircleLayout(15, 225, 58, 86, 15));
