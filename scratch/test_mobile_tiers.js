const counts = [1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 24, 30];
const windowWidth = 375;
for (const N of counts) {
  let size, radius, hub;
  if (N <= 3) {
    size = Math.min(windowWidth - 20, 290);
    radius = Math.round(size * 0.33);
    hub = Math.round(size * 0.38);
  } else if (N <= 5) {
    size = Math.min(windowWidth - 20, 315);
    radius = Math.round(size * 0.35);
    hub = Math.round(size * 0.40);
  } else if (N <= 8) {
    size = Math.min(windowWidth - 20, 335);
    radius = Math.round(size * 0.36);
    hub = Math.round(size * 0.42);
  } else if (N <= 12) {
    size = Math.min(windowWidth - 20, 350);
    radius = Math.round(size * 0.37);
    hub = Math.round(size * 0.44);
  } else {
    size = Math.min(windowWidth - 20, 360);
    radius = Math.round(size * 0.38);
    hub = Math.round(size * 0.44);
  }
  const isLargeSet = N > 18;
  const h = isLargeSet ? 52 : 68;
  const w = isLargeSet ? 36 : 46;
  const circ = 2 * Math.PI * radius;
  const arcPerBook = circ / N;
  const gap = arcPerBook - w;
  console.log(`N=${N}: size=${size}, radius=${radius}, w=${w}, h=${h}, arcDist=${arcPerBook.toFixed(1)}, gap=${gap.toFixed(1)}px, hubDia=${hub}`);
}
