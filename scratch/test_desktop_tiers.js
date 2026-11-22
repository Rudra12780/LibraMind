const counts = [1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 24, 30];
for (const N of counts) {
  let size, radius, hub;
  if (N <= 3) {
    size = 400; radius = 134; hub = 140;
  } else if (N <= 5) {
    size = 440; radius = 148; hub = 150;
  } else if (N <= 8) {
    size = 480; radius = 168; hub = 170;
  } else if (N <= 12) {
    size = 530; radius = 192; hub = 190;
  } else {
    size = 600; radius = 225; hub = 220;
  }
  const isLargeSet = N > 18;
  const h = isLargeSet ? 84 : 106;
  const w = isLargeSet ? 56 : 70;
  const circ = 2 * Math.PI * radius;
  const arcPerBook = circ / N;
  const gap = arcPerBook - w;
  console.log(`Desktop N=${N}: size=${size}, radius=${radius}, w=${w}, h=${h}, arcDist=${arcPerBook.toFixed(1)}, gap=${gap.toFixed(1)}px, hubDia=${hub}`);
}
