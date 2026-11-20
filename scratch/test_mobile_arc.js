// Test mobile arc layout coordinates and clearances
const W = 390; // Typical iPhone 12/13/14/15 width
const H = 540; // Container height
const Xc = W * 0.96; // ~374px
const Yc = H / 2;    // 270px
const R = 250;       // Radius of shelf track
const cardW = 72;
const cardH = 104;
const stepDeg = 26;  // Step angle between books

console.log(`Mobile Arc Config: W=${W}, H=${H}, Center=(${Xc.toFixed(1)}, ${Yc.toFixed(1)}), R=${R}`);

// Test 5 books on visible arc (around theta = 180 deg +/- 52 deg)
[-2, -1, 0, 1, 2].forEach(offset => {
  const thetaDeg = 180 + offset * stepDeg;
  const thetaRad = (thetaDeg * Math.PI) / 180;
  const x = Xc + R * Math.cos(thetaRad);
  const y = Yc + R * Math.sin(thetaRad);
  const bookRot = thetaDeg + 90;
  console.log(`  Book offset ${offset}: angle=${thetaDeg}deg, pos=(${x.toFixed(1)}, ${y.toFixed(1)}), rot=${bookRot}deg`);
});

const arcDistance = R * (stepDeg * Math.PI / 180);
const gap = arcDistance - cardW;
console.log(`Arc distance between centers: ${arcDistance.toFixed(1)}px, Card width: ${cardW}px, Inter-book gap: ${gap.toFixed(1)}px`);
