// Test adjusted arch card bounds and clearance
const DESKTOP_CARDS_10_ADJ = [
  { x: -570, y: 95, rot: -44 },
  { x: -475, y: 5,  rot: -35 },
  { x: -365, y: -90, rot: -25 },
  { x: -225, y: -165, rot: -14 },
  { x: -78,  y: -208, rot: -5 },
  { x: 78,   y: -208, rot: 5 },
  { x: 225,  y: -165, rot: 14 },
  { x: 365,  y: -90, rot: 25 },
  { x: 475,  y: 5,  rot: 35 },
  { x: 570,  y: 95, rot: 44 }
];

const TABLET_CARDS_8_ADJ = [
  { x: -335, y: 65,  rot: -38 },
  { x: -250, y: -20, rot: -28 },
  { x: -155, y: -95, rot: -16 },
  { x: -55,  y: -140, rot: -5 },
  { x: 55,   y: -140, rot: 5 },
  { x: 155,  y: -95, rot: 16 },
  { x: 250,  y: -20, rot: 28 },
  { x: 335,  y: 65,  rot: 38 }
];

function testViewport(w) {
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 1024;
  const isDesktop = w >= 1024;
  const stageH = isTablet ? 520 : 600;

  const desktopScale = isDesktop ? Math.min(1.0, Math.max(0.76, (w * 0.94) / 1380)) : 1.0;
  const tabletScale = isTablet ? Math.min(1.0, Math.max(0.72, (w * 0.94) / 860)) : 1.0;
  const scale = isTablet ? tabletScale : desktopScale;

  const cards = isTablet ? TABLET_CARDS_8_ADJ : DESKTOP_CARDS_10_ADJ;
  const cardW = Math.round((isTablet ? 92 : 120) * scale);
  const cardH = Math.round((isTablet ? 126 : 164) * scale);

  let minY = Infinity;
  let maxY = -Infinity;
  let minX = Infinity;
  let maxX = -Infinity;

  cards.forEach((c) => {
    const curX = Math.round(c.x * scale);
    const curY = Math.round(c.y * scale);
    const rad = Math.abs((c.rot * Math.PI) / 180);
    const halfBoxW = (cardW / 2) * Math.cos(rad) + (cardH / 2) * Math.sin(rad);
    const halfBoxH = (cardW / 2) * Math.sin(rad) + (cardH / 2) * Math.cos(rad);

    minY = Math.min(minY, curY - halfBoxH);
    maxY = Math.max(maxY, curY + halfBoxH);
    minX = Math.min(minX, curX - halfBoxW);
    maxX = Math.max(maxX, curX + halfBoxW);
  });

  const centerY = stageH * 0.50;
  const stageBottom = stageH;

  const absoluteMinY = centerY + minY;
  const absoluteMaxY = centerY + maxY;

  console.log(`Viewport ${w}px (Scale: ${scale.toFixed(2)}, Stage: ${stageH}px):`);
  console.log(`  Top clearance: ${absoluteMinY.toFixed(1)}px (Stage Top: 0)`);
  console.log(`  Bottom clearance: ${(stageBottom - absoluteMaxY).toFixed(1)}px (Stage Bottom: ${stageBottom})`);
  console.log(`  X span: [${minX.toFixed(1)}, ${maxX.toFixed(1)}], Total W: ${(maxX - minX).toFixed(1)}px`);
}

[1920, 1440, 1280, 1024, 800, 640].forEach(w => testViewport(w));
