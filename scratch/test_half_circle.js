// Test mobile semi-circle arc geometry
function testMobileHalfCircle() {
  const stageW = 360;
  const stageH = 340;
  const cx = stageW / 2;
  const cy = stageH * 0.88; // Center near bottom
  const R = 200; // Arc radius

  console.log(`Stage: ${stageW}x${stageH}, Center: (${cx}, ${cy}), R=${R}`);
  // Visible semi-circle angles: from -165deg (left) to -15deg (right)
  const angles = [-160, -135, -110, -90, -70, -45, -20];
  angles.forEach(deg => {
    const rad = deg * Math.PI / 180;
    const x = cx + R * Math.cos(rad);
    const y = cy + R * Math.sin(rad);
    console.log(`Angle ${deg}deg: x=${x.toFixed(1)}px, y=${y.toFixed(1)}px`);
  });
}

testMobileHalfCircle();
