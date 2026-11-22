function testOneLayer(totalBooks) {
  const phoneWidth = 375;
  const phoneHeight = 520;
  
  // For phone, wheel center is on the right
  // If radius R = 260px, circumference is 2 * PI * 260 = 1633px
  const R = 260;
  const circ = 2 * Math.PI * R;
  const stepDeg = 360 / totalBooks;
  const arcDist = circ / totalBooks;
  
  // Card dimensions:
  // If card width is 44px, height is 64px
  const cardW = 44;
  const cardH = 64;
  const gap = arcDist - cardW;
  
  console.log(`=== Total Books: ${totalBooks} in ONE LAYER ===`);
  console.log(`Radius R: ${R}px, Circumference: ${circ.toFixed(1)}px`);
  console.log(`Step Angle: ${stepDeg.toFixed(2)}deg`);
  console.log(`Arc Distance per book: ${arcDist.toFixed(1)}px`);
  console.log(`Card Size: ${cardW}x${cardH}px`);
  console.log(`Arc Gap between books: ${gap.toFixed(1)}px`);
  
  // How many books are visible on the phone arc at any time?
  // The phone screen captures roughly 100deg of the circle (from 130deg to 230deg)
  const visibleArcDeg = 110;
  const visibleBooksCount = Math.round(visibleArcDeg / stepDeg);
  console.log(`Visible on screen at any moment: ~${visibleBooksCount} books`);
}

testOneLayer(76);
testOneLayer(36);
testOneLayer(20);
testOneLayer(12);
