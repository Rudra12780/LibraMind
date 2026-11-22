function testMobileArc() {
  const phoneWidth = 375;
  const phoneHeight = 520;
  const wheelRadius = 290;
  const centerX = phoneWidth * 0.92; // circle center placed near right edge
  const centerY = phoneHeight / 2;

  const rOut = 265;
  const rIn = 185;

  console.log(`Phone: ${phoneWidth}x${phoneHeight}px, Center: (${centerX.toFixed(1)}, ${centerY.toFixed(1)})`);

  // Check the x positions of books at various angles facing into the screen
  // Angles pointing into the screen (leftwards from center): 140deg to 220deg (where 180deg is straight left)
  const angles = [140, 160, 180, 200, 220];
  console.log('\nOuter Tier (R=265px):');
  angles.forEach(deg => {
    const rad = deg * Math.PI / 180;
    const x = centerX + rOut * Math.cos(rad);
    const y = centerY + rOut * Math.sin(rad);
    console.log(`  Angle ${deg}deg: x=${x.toFixed(1)}px (left=${(x - 26).toFixed(1)}px), y=${y.toFixed(1)}px`);
  });

  console.log('\nInner Tier (R=185px):');
  angles.forEach(deg => {
    const rad = deg * Math.PI / 180;
    const x = centerX + rIn * Math.cos(rad);
    const y = centerY + rIn * Math.sin(rad);
    console.log(`  Angle ${deg}deg: x=${x.toFixed(1)}px (left=${(x - 21).toFixed(1)}px), y=${y.toFixed(1)}px`);
  });
}

testMobileArc();
