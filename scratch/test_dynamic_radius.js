// Calculate dynamic circular bookshelf layout
function calcDynamicCarousel(N, isMobile, isTablet) {
  // Book cover dimensions
  let w, h;
  if (isMobile) {
    if (N <= 5) { w = 46; h = 68; }
    else if (N <= 8) { w = 42; h = 62; }
    else if (N <= 14) { w = 38; h = 56; }
    else if (N <= 20) { w = 34; h = 50; }
    else { w = 28; h = 42; }
  } else if (isTablet) {
    if (N <= 5) { w = 62; h = 92; }
    else if (N <= 8) { w = 56; h = 84; }
    else if (N <= 14) { w = 50; h = 74; }
    else if (N <= 20) { w = 44; h = 66; }
    else { w = 38; h = 56; }
  } else {
    // Desktop
    if (N <= 5) { w = 72; h = 106; }
    else if (N <= 8) { w = 66; h = 98; }
    else if (N <= 14) { w = 58; h = 86; }
    else if (N <= 20) { w = 50; h = 74; }
    else { w = 44; h = 65; }
  }

  // Desired gap between adjacent book edges along circumference:
  // For small N (like 5), we want a nice tidy gap (around 20-30px desktop, 15-20px mobile)
  // so the circle doesn't look empty or sparse!
  // Circumference C = 2 * PI * R
  // Distance between book centers = C / N
  // Gap = (C / N) - w
  // Therefore, desired R = N * (w + desiredGap) / (2 * PI)
  let desiredGap;
  if (isMobile) {
    desiredGap = N <= 4 ? 20 : (N <= 8 ? 16 : 12);
  } else {
    desiredGap = N <= 4 ? 32 : (N <= 6 ? 26 : (N <= 12 ? 22 : 18));
  }

  let idealRadius = (N * (w + desiredGap)) / (2 * Math.PI);

  // Clamp radius within sensible bounds for the screen
  const minR = isMobile ? 85 : 120;
  const maxR = isMobile ? 135 : 225;
  const radius = Math.round(Math.min(maxR, Math.max(minR, idealRadius)));

  const carouselSize = isMobile ? Math.min(360, radius * 2 + h + 24) : (radius * 2 + h + 40);
  const innerHubDiameter = Math.round(Math.max(isMobile ? 100 : 130, radius * 2 - h - (isMobile ? 16 : 28)));

  const circ = 2 * Math.PI * radius;
  const arcDist = circ / N;
  const actualGap = arcDist - w;

  return { N, radius, carouselSize, innerHubDiameter, w, h, actualGap: actualGap.toFixed(1) };
}

console.log('--- Desktop Tests ---');
[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 18, 24].forEach(N => {
  const res = calcDynamicCarousel(N, false, false);
  console.log(`N=${N}: size=${res.carouselSize}px, R=${res.radius}px, hub=${res.innerHubDiameter}px, book=${res.w}x${res.h}px, gap=${res.actualGap}px`);
});

console.log('\n--- Mobile Tests ---');
[1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 18].forEach(N => {
  const res = calcDynamicCarousel(N, true, false);
  console.log(`N=${N}: size=${res.carouselSize}px, R=${res.radius}px, hub=${res.innerHubDiameter}px, book=${res.w}x${res.h}px, gap=${res.actualGap}px`);
});
