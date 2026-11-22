// Test bookshelf shelves distribution
function testBookshelfLayout(totalBooks) {
  const booksPerShelf = 12;
  const numShelves = Math.min(4, Math.max(2, Math.ceil(totalBooks / booksPerShelf)));
  console.log(`Total books: ${totalBooks} -> ${numShelves} shelves`);
  
  const shelves = [];
  for (let s = 0; s < numShelves; s++) {
    shelves.push([]);
  }
  for (let i = 0; i < totalBooks; i++) {
    shelves[i % numShelves].push(i);
  }
  shelves.forEach((shelf, s) => {
    console.log(`  Shelf ${s + 1}: ${shelf.length} books`);
  });
}

testBookshelfLayout(14);
testBookshelfLayout(56);
testBookshelfLayout(75);
testBookshelfLayout(8);
testBookshelfLayout(3);
