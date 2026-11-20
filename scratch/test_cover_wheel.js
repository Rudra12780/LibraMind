// Test front cover dimensions on the concentric wheel
function testWheel(outerCount = 22, innerCount = 16, R_out = 236, R_in = 148, outW = 46, inW = 38) {
  const outCirc = 2 * Math.PI * R_out;
  const outStepDeg = 360 / outerCount;
  const outArcDist = outCirc / outerCount;
  const outGap = outArcDist - outW;

  const inCirc = 2 * Math.PI * R_in;
  const inStepDeg = 360 / innerCount;
  const inArcDist = inCirc / innerCount;
  const inGap = inArcDist - inW;

  console.log(`Outer: ${outerCount} books, Step=${outStepDeg.toFixed(1)}deg, ArcDist=${outArcDist.toFixed(1)}px, CardW=${outW}px, Gap=${outGap.toFixed(1)}px`);
  console.log(`Inner: ${innerCount} books, Step=${inStepDeg.toFixed(1)}deg, ArcDist=${inArcDist.toFixed(1)}px, CardW=${inW}px, Gap=${inGap.toFixed(1)}px`);
}

console.log('Desktop 580px:');
testWheel(22, 16, 236, 148, 46, 38);

console.log('\nTablet 490px:');
testWheel(20, 14, 196, 122, 38, 32);

console.log('\nMobile 360px:');
testWheel(16, 10, 144, 88, 32, 26);
