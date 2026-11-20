const fs = require('fs');

console.log('=== VERIFYING NAVBAR.JSX ===');
const navbarSrc = fs.readFileSync('frontend/src/components/Navbar.jsx', 'utf8');

const hasHomeInPublic = /publicNavItems\s*=\s*\[[^\]]*'Home'[^\]]*\]/i.test(navbarSrc);
const hasBooksInPublic = /publicNavItems\s*=\s*\[[^\]]*'Books'[^\]]*\]/i.test(navbarSrc);
const hasAuthors = /id:\s*'authors'/i.test(navbarSrc);
const hasRules = /id:\s*'rules'/i.test(navbarSrc);
const hasGenres = /id:\s*'genres'/i.test(navbarSrc);
const hasHeritage = /id:\s*'heritage'/i.test(navbarSrc);
const hasAbout = /id:\s*'about'/i.test(navbarSrc);
const hasLogoHeroScroll = /handleLogoClick[\s\S]*?hero-section/.test(navbarSrc);

console.log('No "Home" in publicNavItems:', !hasHomeInPublic);
console.log('No "Books" in publicNavItems:', !hasBooksInPublic);
console.log('Has Authors nav item:', hasAuthors);
console.log('Has Direct Rules nav item:', hasRules);
console.log('Has Genres nav item:', hasGenres);
console.log('Has Heritage nav item:', hasHeritage);
console.log('Has About nav item:', hasAbout);
console.log('Logo click scrolls to hero-section:', hasLogoHeroScroll);

console.log('\n=== VERIFYING HOME.JSX SECTIONS ===');
const homeSrc = fs.readFileSync('frontend/src/pages/Home.jsx', 'utf8');

const requiredSections = [
  'hero-section',
  'genres-section',
  'heritage-section',
  'authors-section',
  'rules-section',
  'about-section'
];

requiredSections.forEach(id => {
  const exists = homeSrc.includes(`id="${id}"`);
  console.log(`Section #${id} exists:`, exists);
});

console.log('\n=== VERIFYING AUTHOR BOOKS ===');
const sqliteDb = require('../backend/db/database');
const books = sqliteDb.prepare('SELECT * FROM books').all();
const authors = ['Woolf', 'Borges', 'Turing', 'Dostoevsky', 'Austen', 'Orwell'];

authors.forEach(auth => {
  const match = books.filter(b => b.author.toLowerCase().includes(auth.toLowerCase()));
  console.log(`Author "${auth}": ${match.length} books in DB:`, match.map(b => b.title));
});
