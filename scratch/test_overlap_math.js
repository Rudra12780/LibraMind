// Test upright rectangle non-overlapping conditions
function testUprightNonOverlap(N, R, W, H) {
  let minGap = Infinity;
  let overlappingPairs = [];
  const step = (2 * Math.PI) / N;
  
  for (let i = 0; i < N; i++) {
    const angle1 = i * step;
    const angle2 = ((i + 1) % N) * step;
    
    const x1 = R * Math.cos(angle1);
    const y1 = R * Math.sin(angle1);
    const x2 = R * Math.cos(angle2);
    const y2 = R * Math.sin(angle2);
    
    const dx = Math.abs(x1 - x2);
    const dy = Math.abs(y1 - y2);
    
    // For two upright rectangles of width W and height H:
    // Overlap if dx < W AND dy < H
    const overlapX = W - dx;
    const overlapY = H - dy;
    
    if (overlapX > 0 && overlapY > 0) {
      overlappingPairs.push({ i, angle1Deg: (angle1*180/Math.PI).toFixed(0), angle2Deg: (angle2*180/Math.PI).toFixed(0), overlapX: overlapX.toFixed(1), overlapY: overlapY.toFixed(1) });
    }
  }
  return { N, R, W, H, overlaps: overlappingPairs.length, details: overlappingPairs };
}

console.log('Mobile test (screen width 360-390, max R ~ 135):');
console.log('N=15, R=135, W=46, H=68:', testUprightNonOverlap(15, 135, 46, 68));
console.log('N=11, R=135, W=46, H=68:', testUprightNonOverlap(11, 135, 46, 68));
console.log('N=7, R=135, W=46, H=68:', testUprightNonOverlap(7, 135, 46, 68));
console.log('N=5, R=110, W=46, H=68:', testUprightNonOverlap(5, 110, 46, 68));
