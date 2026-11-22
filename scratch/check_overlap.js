const R = 226;
const N = 20;
const cardW = 66;
const cardH = 98;

console.log('--- Overlap check for N=20, R=226, W=66, H=98 ---');
let hasOverlap = false;
for (let i = 0; i < N; i++) {
  const a1 = (i * (360 / N)) * Math.PI / 180;
  const a2 = ((i + 1) * (360 / N)) * Math.PI / 180;
  const x1 = R * Math.cos(a1);
  const y1 = R * Math.sin(a1);
  const x2 = R * Math.cos(a2);
  const y2 = R * Math.sin(a2);
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  // Two axis-aligned boxes overlap if dx < cardW AND dy < cardH
  if (dx < cardW && dy < cardH) {
    console.log(`Overlap between book ${i} and ${i+1}: dx=${dx.toFixed(1)} < ${cardW}, dy=${dy.toFixed(1)} < ${cardH}`);
    hasOverlap = true;
  }
}
console.log('Has overlap with 20 books:', hasOverlap);

// Try N = 14 or 16 or adjusting R or card size
for (const count of [12, 14, 15, 16, 18, 20]) {
  let overlapCount = 0;
  for (let i = 0; i < count; i++) {
    const a1 = (i * (360 / count)) * Math.PI / 180;
    const a2 = ((i + 1) * (360 / count)) * Math.PI / 180;
    const x1 = R * Math.cos(a1);
    const y1 = R * Math.sin(a1);
    const x2 = R * Math.cos(a2);
    const y2 = R * Math.sin(a2);
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    if (dx < cardW && dy < cardH) {
      overlapCount++;
    }
  }
  console.log(`Count ${count}: overlaps=${overlapCount}`);
}

for (const R of [220, 230, 240, 250]) {
  for (const W of [52, 56, 60, 64]) {
    const H = Math.round(W * 1.45);
    for (const N of [10, 12, 14, 16]) {
      let overlaps = 0;
      for (let i = 0; i < N; i++) {
        const a1 = (i * 360 / N) * Math.PI / 180;
        const a2 = ((i + 1) * 360 / N) * Math.PI / 180;
        const dx = Math.abs(R * Math.cos(a2) - R * Math.cos(a1));
        const dy = Math.abs(R * Math.sin(a2) - R * Math.sin(a1));
        if (dx < W + 2 && dy < H + 2) overlaps++;
      }
      if (overlaps === 0) {
        console.log(`R=${R}, W=${W}, H=${H}, N=${N} -> ZERO OVERLAP! Perfect spacing.`);
      }
    }
  }
}

console.log('--- Mobile check ---');
const mR = 132;
const mW = 44;
const mH = 64;
for (const mN of [8, 9, 10]) {
  let overlaps = 0;
  for (let i = 0; i < mN; i++) {
    const a1 = (i * 360 / mN) * Math.PI / 180;
    const a2 = ((i + 1) * 360 / mN) * Math.PI / 180;
    const dx = Math.abs(mR * Math.cos(a2) - mR * Math.cos(a1));
    const dy = Math.abs(mR * Math.sin(a2) - mR * Math.sin(a1));
    if (dx < mW + 2 && dy < mH + 2) overlaps++;
  }
  console.log(`Mobile: mR=${mR}, mW=${mW}, mH=${mH}, mN=${mN} -> overlaps=${overlaps}`);
}
