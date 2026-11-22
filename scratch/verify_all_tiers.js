function verifyGeometry(width) {
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const carouselSize = isMobile ? 360 : (isTablet ? 520 : 660);
  const centerRadius = carouselSize / 2;

  [12, 25, 76].forEach(totalBooks => {
    let tiers = [];
    if (totalBooks <= 16) {
      tiers = [{
        name: 'Single',
        count: totalBooks,
        radius: isMobile ? 134 : (isTablet ? 190 : 240),
        w: isMobile ? 42 : (isTablet ? 50 : 56),
        h: isMobile ? 60 : (isTablet ? 72 : 80),
        hubD: isMobile ? 150 : (isTablet ? 210 : 250)
      }];
    } else if (totalBooks <= 36) {
      const nOut = Math.round(totalBooks * 0.58);
      const nIn = totalBooks - nOut;
      tiers = [
        {
          name: 'Outer',
          count: nOut,
          radius: isMobile ? 142 : (isTablet ? 200 : 255),
          w: isMobile ? 32 : (isTablet ? 40 : 44),
          h: isMobile ? 46 : (isTablet ? 58 : 64)
        },
        {
          name: 'Inner',
          count: nIn,
          radius: isMobile ? 92 : (isTablet ? 130 : 165),
          w: isMobile ? 26 : (isTablet ? 32 : 36),
          h: isMobile ? 38 : (isTablet ? 46 : 52),
          hubD: isMobile ? 120 : (isTablet ? 160 : 190)
        }
      ];
    } else {
      const n1 = Math.round(totalBooks * 0.42);
      const n2 = Math.round(totalBooks * 0.34);
      const n3 = totalBooks - n1 - n2;
      tiers = [
        {
          name: 'Tier 1 (Outer)',
          count: n1,
          radius: isMobile ? 146 : (isTablet ? 208 : 265),
          w: isMobile ? 24 : (isTablet ? 30 : 34),
          h: isMobile ? 36 : (isTablet ? 42 : 48)
        },
        {
          name: 'Tier 2 (Mid)',
          count: n2,
          radius: isMobile ? 108 : (isTablet ? 154 : 196),
          w: isMobile ? 22 : (isTablet ? 26 : 30),
          h: isMobile ? 32 : (isTablet ? 38 : 44)
        },
        {
          name: 'Tier 3 (Inner)',
          count: n3,
          radius: isMobile ? 74 : (isTablet ? 106 : 136),
          w: isMobile ? 20 : (isTablet ? 22 : 26),
          h: isMobile ? 28 : (isTablet ? 32 : 38),
          hubD: isMobile ? 96 : (isTablet ? 130 : 160)
        }
      ];
    }

    console.log(`\nWidth: ${width}px | Books: ${totalBooks}`);
    for (let i = 0; i < tiers.length; i++) {
      const t = tiers[i];
      const circ = 2 * Math.PI * t.radius;
      const arcGap = (circ / t.count) - t.w;
      console.log(`  ${t.name} (R=${t.radius}px): ${t.count} books, card=${t.w}x${t.h}px, arcGap=${arcGap.toFixed(1)}px`);
      if (i > 0) {
        const prev = tiers[i - 1];
        const radialGap = (prev.radius - prev.h / 2) - (t.radius + t.h / 2);
        console.log(`    Radial clearance between ${prev.name} & ${t.name}: ${radialGap.toFixed(1)}px`);
      }
    }
    const innermost = tiers[tiers.length - 1];
    const hubR = (innermost.hubD || 160) / 2;
    const hubClearance = (innermost.radius - innermost.h / 2) - hubR;
    console.log(`    Radial clearance to Center Hub (radius ${hubR}px): ${hubClearance.toFixed(1)}px`);
  });
}

verifyGeometry(1200);
verifyGeometry(768);
verifyGeometry(375);
