function testTiers(totalBooks, width) {
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const size = isMobile ? 360 : (isTablet ? 520 : 660);

  let tiers = [];
  if (totalBooks <= 16) {
    tiers = [{ name: 'Single Ring', count: totalBooks, radius: isMobile ? 134 : (isTablet ? 190 : 240), w: isMobile ? 42 : 56, h: isMobile ? 60 : 80 }];
  } else if (totalBooks <= 36) {
    const nOut = Math.round(totalBooks * 0.58);
    const nIn = totalBooks - nOut;
    tiers = [
      { name: 'Outer Tier', count: nOut, radius: isMobile ? 142 : (isTablet ? 200 : 255), w: isMobile ? 32 : 44, h: isMobile ? 46 : 64 },
      { name: 'Inner Tier', count: nIn, radius: isMobile ? 92 : (isTablet ? 130 : 165), w: isMobile ? 26 : 36, h: isMobile ? 38 : 52 }
    ];
  } else {
    // 3 Tiers for large collection (e.g. 76 books)
    const n1 = Math.round(totalBooks * 0.42);
    const n2 = Math.round(totalBooks * 0.34);
    const n3 = totalBooks - n1 - n2;
    tiers = [
      { name: 'Tier 1 (Outer)', count: n1, radius: isMobile ? 146 : (isTablet ? 208 : 265), w: isMobile ? 24 : 34, h: isMobile ? 36 : 48 },
      { name: 'Tier 2 (Mid)', count: n2, radius: isMobile ? 108 : (isTablet ? 154 : 196), w: isMobile ? 22 : 30, h: isMobile ? 32 : 44 },
      { name: 'Tier 3 (Inner)', count: n3, radius: isMobile ? 74 : (isTablet ? 106 : 136), w: isMobile ? 20 : 26, h: isMobile ? 28 : 38 }
    ];
  }

  console.log(`=== Width ${width}px | Total Books: ${totalBooks} | Size: ${size}px ===`);
  tiers.forEach(t => {
    const circ = 2 * Math.PI * t.radius;
    const arcSpacing = circ / t.count;
    console.log(`  ${t.name}: ${t.count} books, R=${t.radius}px, Card=${t.w}x${t.h}px, ArcSpacing=${arcSpacing.toFixed(1)}px, FreeGap=${(arcSpacing - t.w).toFixed(1)}px`);
  });
}

testTiers(76, 1200);
testTiers(76, 768);
testTiers(76, 380);
testTiers(25, 1200);
testTiers(12, 1200);
