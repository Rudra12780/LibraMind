const cards = [
  { x: -570, y: 70, rot: -46 },
  { x: -475, y: -25, rot: -36 },
  { x: -365, y: -125, rot: -26 },
  { x: -225, y: -198, rot: -15 },
  { x: -78,  y: -240, rot: -5 },
  { x: 78,   y: -240, rot: 5 },
  { x: 225,  y: -198, rot: 15 },
  { x: 365,  y: -125, rot: 26 },
  { x: 475,  y: -25, rot: 36 },
  { x: 570,  y: 70, rot: 46 }
];

const textBBox = { minX: -290, maxX: 290, minY: -75, maxY: 105 };
console.log('Text bounding box:', textBBox);

let anyOverlap = false;
for (let i = 0; i < cards.length; i++) {
  const c = cards[i];
  const halfW = 60;
  const halfH = 82;
  const cardMinX = c.x - halfW;
  const cardMaxX = c.x + halfW;
  const cardMinY = c.y - halfH;
  const cardMaxY = c.y + halfH;
  const overlapX = !(cardMaxX < textBBox.minX || cardMinX > textBBox.maxX);
  const overlapY = !(cardMaxY < textBBox.minY || cardMinY > textBBox.maxY);
  const overlaps = overlapX && overlapY;
  if (overlaps) anyOverlap = true;
  console.log(`Card ${i} at (${c.x}, ${c.y}): Y [${cardMinY}, ${cardMaxY}], X [${cardMinX}, ${cardMaxX}] => Overlaps text? ${overlaps}`);
}

console.log('ANY OVERLAP WITH TEXT:', anyOverlap);
