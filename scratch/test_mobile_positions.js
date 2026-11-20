// Verify mobile arc positions and visibility
const W = 375; // standard iPhone SE / Mini
const H = 500;
const Xc = W * 0.94; // ~352.5px
const Yc = H / 2;    // 250px
const R = 240;
const cardW = 68;
const cardH = 98;
const stepDeg = 28;

console.log(`Mobile Arc Screen: ${W}x${H}, Center: (${Xc.toFixed(1)}, ${Yc.toFixed(1)}), R: ${R}`);

// We want 7 books distributed around theta = 180 deg (-3 to +3)
[-3, -2, -1, 0, 1, 2, 3].forEach(offset => {
  const thetaDeg = 180 + offset * stepDeg;
  const thetaRad = (thetaDeg * Math.PI) / 180;
  const x = Xc + R * Math.cos(thetaRad);
  const y = Yc + R * Math.sin(thetaRad);
  const rot = thetaDeg + 90;
  const isVisible = (x >= -40 && x <= W + 40 && y >= -40 && y <= H + 40);
  console.log(`Offset ${offset} (${thetaDeg}deg): X=${x.toFixed(1)}, Y=${y.toFixed(1)}, Rot=${rot}deg, Visible: ${isVisible}`);
});
