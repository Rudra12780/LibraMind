function checkOverlap(N, R, W, H) {
  const step = (2 * Math.PI) / N;
  let overlaps = 0;
  for (let i = 0; i < N; i++) {
    const a1 = i * step;
    const a2 = ((i + 1) % N) * step;
    const dx = Math.abs(R * Math.cos(a1) - R * Math.cos(a2));
    const dy = Math.abs(R * Math.sin(a1) - R * Math.sin(a2));
    if (W - dx > 0 && H - dy > 0) {
      overlaps++;
    }
  }
  return overlaps;
}

console.log('Mobile (R <= 138):');
for (const N of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 18]) {
  // Let's test what (W, H) gives 0 overlaps for upright cards
  let found = null;
  for (let w = 46; w >= 28; w -= 2) {
    const h = Math.round(w * 1.45);
    const r = Math.min(136, Math.max(95, 80 + N * 3.5));
    const ov = checkOverlap(N, r, w, h);
    if (ov === 0) {
      found = { N, r, w, h, ov };
      break;
    }
  }
  console.log(`N=${N}:`, found || 'No upright 0-overlap found with W>=28');
}

console.log('\nDesktop (R <= 228):');
for (const N of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 18]) {
  let found = null;
  for (let w = 70; w >= 40; w -= 2) {
    const h = Math.round(w * 1.45);
    const r = Math.min(226, Math.max(130, 110 + N * 7));
    const ov = checkOverlap(N, r, w, h);
    if (ov === 0) {
      found = { N, r, w, h, ov };
      break;
    }
  }
  console.log(`Desktop N=${N}:`, found || 'No upright 0-overlap found with W>=40');
}
