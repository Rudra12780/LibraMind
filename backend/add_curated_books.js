const db = require('./db/database');

const curatedBooks = [
  // --- AI & Data Science ---
  {
    title: 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow',
    author: 'Aurélien Géron',
    isbn: '9781492032649',
    publisher: "O'Reilly Media",
    publication_year: 2019,
    category: 'AI & Data Science',
    language: 'English',
    edition: '2nd Edition',
    description: 'Through a series of recent breakthroughs, deep learning has boosted the entire field of machine learning. Now, even programmers who know close to nothing about this technology can use simple, efficient tools to implement programs capable of learning from data.',
    cover_image: 'https://covers.openlibrary.org/b/isbn/9781492032649-L.jpg',
    floor: 'Floor 2',
    section: 'AI & Machine Learning Stacks',
    shelf: 'Shelf AI-01',
    rack: 'Rack 02',
    total_copies: 4,
    available_copies: 4
  },
  {
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell, Peter Norvig',
    isbn: '9780136042594',
    publisher: 'Pearson',
    publication_year: 2020,
    category: 'AI & Data Science',
    language: 'English',
    edition: '4th Edition',
    description: 'The long-anticipated revision of Artificial Intelligence: A Modern Approach explores the full breadth and depth of the field of artificial intelligence (AI). The 4th Edition brings readers up to date on the latest technologies, present concepts in a more unified manner, and offers new or expanded coverage of machine learning, deep learning, transfer learning, multiagent systems, robotics, natural language processing, causality, probabilistic programming, privacy, fairness, and safe AI.',
    cover_image: 'https://covers.openlibrary.org/b/isbn/9780136042594-L.jpg',
    floor: 'Floor 2',
    section: 'AI & Machine Learning Stacks',
    shelf: 'Shelf AI-02',
    rack: 'Rack 01',
    total_copies: 3,
    available_copies: 3
  },
  {
    title: 'Python for Data Analysis',
    author: 'Wes McKinney',
    isbn: '9781491957660',
    publisher: "O'Reilly Media",
    publication_year: 2017,
    category: 'AI & Data Science',
    language: 'English',
    edition: '2nd Edition',
    description: 'Get complete instructions for manipulating, processing, cleaning, and crunching datasets in Python. Updated for Python 3.6, the second edition of this hands-on guide is packed with practical case studies that show you how to solve a broad set of data analysis problems effectively. Written by Wes McKinney, the creator of the Python pandas project.',
    cover_image: 'https://covers.openlibrary.org/b/isbn/9781491957660-L.jpg',
    floor: 'Floor 2',
    section: 'AI & Machine Learning Stacks',
    shelf: 'Shelf AI-03',
    rack: 'Rack 03',
    total_copies: 3,
    available_copies: 3
  },
  {
    title: 'Practical Statistics for Data Scientists',
    author: 'Peter Bruce, Andrew Bruce, Peter Gedeck',
    isbn: '9781492072942',
    publisher: "O'Reilly Media",
    publication_year: 2020,
    category: 'AI & Data Science',
    language: 'English',
    edition: '2nd Edition',
    description: 'Statistical methods are a key part of data science, yet few data scientists have formal statistical training. Courses and books on basic statistics rarely cover the topic from a data science perspective. This practical guide explains how to apply various statistical methods to data science, tells you how to avoid their misuse, and gives you advice on what is important and what is not.',
    cover_image: 'https://covers.openlibrary.org/b/isbn/9781492072942-L.jpg',
    floor: 'Floor 2',
    section: 'AI & Machine Learning Stacks',
    shelf: 'Shelf AI-04',
    rack: 'Rack 01',
    total_copies: 2,
    available_copies: 2
  },
  {
    title: 'Introduction to Machine Learning with Python',
    author: 'Andreas C. Müller, Sarah Guido',
    isbn: '9781449369415',
    publisher: "O'Reilly Media",
    publication_year: 2016,
    category: 'AI & Data Science',
    language: 'English',
    edition: '1st Edition',
    description: 'Machine learning has become an integral part of many commercial applications and research projects, but this field is not exclusive to large companies with extensive research teams. If you use Python, even as a beginner, this book will teach you practical ways to build your own machine learning solutions.',
    cover_image: 'https://covers.openlibrary.org/b/isbn/9781449369415-L.jpg',
    floor: 'Floor 2',
    section: 'AI & Machine Learning Stacks',
    shelf: 'Shelf AI-05',
    rack: 'Rack 02',
    total_copies: 3,
    available_copies: 3
  },

  // --- Programming ---
  {
    title: 'Python Crash Course',
    author: 'Eric Matthes',
    isbn: '9781593279288',
    publisher: 'No Starch Press',
    publication_year: 2019,
    category: 'Programming & Technology',
    language: 'English',
    edition: '2nd Edition',
    description: 'Python Crash Course is a fast-paced, thorough introduction to Python that will have you writing programs, solving problems, and making things that work in no time. In the first half of the book, you will learn basic programming concepts, such as variables, lists, classes, and loops, and practice writing clean code.',
    cover_image: 'https://covers.openlibrary.org/b/isbn/9781593279288-L.jpg',
    floor: 'Floor 1',
    section: 'Programming & Systems',
    shelf: 'Shelf PR-01',
    rack: 'Rack 01',
    total_copies: 4,
    available_copies: 4
  },
  {
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    isbn: '9780132350884',
    publisher: 'Prentice Hall',
    publication_year: 2008,
    category: 'Programming & Technology',
    language: 'English',
    edition: '1st Edition',
    description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn\'t have to be that way. Noted software expert Robert C. Martin presents a revolutionary paradigm with Clean Code.',
    cover_image: 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg',
    floor: 'Floor 1',
    section: 'Programming & Systems',
    shelf: 'Shelf PR-02',
    rack: 'Rack 02',
    total_copies: 3,
    available_copies: 3
  },
  {
    title: 'The Pragmatic Programmer: Your Journey To Mastery',
    author: 'David Thomas, Andrew Hunt',
    isbn: '9780135957059',
    publisher: 'Addison-Wesley Professional',
    publication_year: 2019,
    category: 'Programming & Technology',
    language: 'English',
    edition: '20th Anniversary Edition',
    description: 'The Pragmatic Programmer is one of those rare tech audiobooks you will listen, re-listen, and listen to again over the years. Whether you\'re new to the field or an experienced practitioner, you will come away each time with fresh insights.',
    cover_image: 'https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg',
    floor: 'Floor 1',
    section: 'Programming & Systems',
    shelf: 'Shelf PR-03',
    rack: 'Rack 01',
    total_copies: 3,
    available_copies: 3
  },
  {
    title: 'Eloquent JavaScript: A Modern Introduction to Programming',
    author: 'Marijn Haverbeke',
    isbn: '9781593279509',
    publisher: 'No Starch Press',
    publication_year: 2018,
    category: 'Programming & Technology',
    language: 'English',
    edition: '3rd Edition',
    description: 'JavaScript lies at the heart of almost every modern web application, from social apps like Twitter to browser-based game frameworks. Though simple for beginners to pick up and play with, JavaScript is a flexible, complex language that you can use to build full-scale applications.',
    cover_image: 'https://covers.openlibrary.org/b/isbn/9781593279509-L.jpg',
    floor: 'Floor 1',
    section: 'Programming & Systems',
    shelf: 'Shelf PR-04',
    rack: 'Rack 02',
    total_copies: 3,
    available_copies: 3
  },
  {
    title: 'Learning React: Modern Patterns for Developing React Apps',
    author: 'Alex Banks, Eve Porcello',
    isbn: '9781492051725',
    publisher: "O'Reilly Media",
    publication_year: 2020,
    category: 'Programming & Technology',
    language: 'English',
    edition: '2nd Edition',
    description: 'If you want to learn how to build efficient user interfaces with React, this is your book. Authors Alex Banks and Eve Porcello show you how to create UIs with this small-footprint library that can deftly display data changes on large-scale, data-driven websites without page reloads.',
    cover_image: 'https://covers.openlibrary.org/b/isbn/9781492051725-L.jpg',
    floor: 'Floor 1',
    section: 'Programming & Systems',
    shelf: 'Shelf PR-05',
    rack: 'Rack 03',
    total_copies: 3,
    available_copies: 3
  },

  // --- Personal Development ---
  {
    title: 'Atomic Habits: Tiny Changes, Remarkable Results',
    author: 'James Clear',
    isbn: '9780735211292',
    publisher: 'Avery',
    publication_year: 2018,
    category: 'Personal Growth',
    language: 'English',
    edition: '1st Edition',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving—every day. James Clear, one of the world\'s leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
    cover_image: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
    floor: 'Floor 1',
    section: 'Personal Growth & Mindfulness',
    shelf: 'Shelf PG-01',
    rack: 'Rack 01',
    total_copies: 4,
    available_copies: 4
  },
  {
    title: 'Deep Work: Rules for Focused Success in a Distracted World',
    author: 'Cal Newport',
    isbn: '9781455586691',
    publisher: 'Grand Central Publishing',
    publication_year: 2016,
    category: 'Personal Growth',
    language: 'English',
    edition: '1st Edition',
    description: 'Deep work is the ability to focus without distraction on a cognitively demanding task. It\'s a skill that allows you to quickly master complicated information and produce better results in less time. Deep work will make you better at what you do and provide the sense of true fulfillment that comes from craftsmanship.',
    cover_image: 'https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg',
    floor: 'Floor 1',
    section: 'Personal Growth & Mindfulness',
    shelf: 'Shelf PG-02',
    rack: 'Rack 02',
    total_copies: 3,
    available_copies: 3
  },
  {
    title: 'The Psychology of Money: Timeless Lessons on Wealth, Greed, and Happiness',
    author: 'Morgan Housel',
    isbn: '9780857197689',
    publisher: 'Harriman House',
    publication_year: 2020,
    category: 'Personal Growth',
    language: 'English',
    edition: '1st Edition',
    description: 'Doing well with money isn\'t necessarily about what you know. It\'s about how you behave. And behavior is hard to teach, even to really smart people. Money—investing, personal finance, and business decisions—is typically taught as a math-based field, where data and formulas tell us exactly what to do.',
    cover_image: 'https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg',
    floor: 'Floor 1',
    section: 'Personal Growth & Mindfulness',
    shelf: 'Shelf PG-03',
    rack: 'Rack 01',
    total_copies: 3,
    available_copies: 3
  },
  {
    title: 'Ikigai: The Japanese Secret to a Long and Happy Life',
    author: 'Héctor García, Francesc Miralles',
    isbn: '9780143130727',
    publisher: 'Penguin Books',
    publication_year: 2017,
    category: 'Personal Growth',
    language: 'English',
    edition: '1st Edition',
    description: 'According to the Japanese, everyone has an ikigai—a reason for living. And according to the residents of the Japanese village with the world\'s longest-living people, finding it is the key to a happier and longer life.',
    cover_image: 'https://covers.openlibrary.org/b/isbn/9780143130727-L.jpg',
    floor: 'Floor 1',
    section: 'Personal Growth & Mindfulness',
    shelf: 'Shelf PG-04',
    rack: 'Rack 02',
    total_copies: 3,
    available_copies: 3
  },

  // --- Fiction & Mystery ---
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: 'J. K. Rowling',
    isbn: '9780747532743',
    publisher: 'Bloomsbury',
    publication_year: 1997,
    category: 'Fiction & Mystery',
    language: 'English',
    edition: '1st Edition',
    description: 'Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle.',
    cover_image: 'https://covers.openlibrary.org/b/isbn/9780747532743-L.jpg',
    floor: 'Floor 2',
    section: 'Fiction & Mystery Pavilion',
    shelf: 'Shelf FM-01',
    rack: 'Rack 01',
    total_copies: 4,
    available_copies: 4
  },
  {
    title: 'The Adventures of Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    isbn: '9780141034355',
    publisher: 'Penguin Classics',
    publication_year: 1892,
    category: 'Fiction & Mystery',
    language: 'English',
    edition: 'Classic Edition',
    description: 'The Adventures of Sherlock Holmes is a collection of twelve short stories by Arthur Conan Doyle, first published on 14 October 1892. It contains the earliest short stories featuring the consulting detective Sherlock Holmes, that had been published in twelve monthly issues of The Strand Magazine from July 1891 to June 1892.',
    cover_image: 'https://covers.openlibrary.org/b/isbn/9780141034355-L.jpg',
    floor: 'Floor 2',
    section: 'Fiction & Mystery Pavilion',
    shelf: 'Shelf FM-02',
    rack: 'Rack 02',
    total_copies: 3,
    available_copies: 3
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    isbn: '9780061122415',
    publisher: 'HarperOne',
    publication_year: 1988,
    category: 'Fiction & Mystery',
    language: 'English',
    edition: '25th Anniversary Edition',
    description: 'Paulo Coelho\'s masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure. His quest will lead him to riches far different—and far more satisfying—than he ever imagined.',
    cover_image: 'https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg',
    floor: 'Floor 2',
    section: 'Fiction & Mystery Pavilion',
    shelf: 'Shelf FM-03',
    rack: 'Rack 01',
    total_copies: 3,
    available_copies: 3
  },
  {
    title: 'Murder on the Orient Express',
    author: 'Agatha Christie',
    isbn: '9780062693662',
    publisher: 'William Morrow',
    publication_year: 1934,
    category: 'Fiction & Mystery',
    language: 'English',
    edition: 'Collector Edition',
    description: 'Just after midnight, the famous Orient Express is stopped in its tracks by a snowdrift. By morning, the millionaire Samuel Edward Ratchett lies dead in his compartment, stabbed a dozen times, his door locked from the inside. Without a shred of doubt, one of his fellow passengers is the murderer.',
    cover_image: 'https://covers.openlibrary.org/b/isbn/9780062693662-L.jpg',
    floor: 'Floor 2',
    section: 'Fiction & Mystery Pavilion',
    shelf: 'Shelf FM-04',
    rack: 'Rack 02',
    total_copies: 3,
    available_copies: 3
  },

  // --- Indian Literature ---
  {
    title: 'Wings of Fire: An Autobiography',
    author: 'A. P. J. Abdul Kalam, Arun Tiwari',
    isbn: '9788173711466',
    publisher: 'Universities Press',
    publication_year: 1999,
    category: 'Indian Literature',
    language: 'English',
    edition: '1st Edition',
    description: 'An inspiring autobiography of Dr. A.P.J. Abdul Kalam, former President of India and renowned aerospace scientist. The book chronicles his humble childhood in Rameswaram, his journey in establishing India\'s space research and missile programs, and his vision for empowering Indian youth.',
    cover_image: 'https://covers.openlibrary.org/b/isbn/9788173711466-L.jpg',
    floor: 'Floor 1',
    section: 'Indian Literature & Heritage',
    shelf: 'Shelf IL-01',
    rack: 'Rack 01',
    total_copies: 4,
    available_copies: 4
  },
  {
    title: 'The Discovery of India',
    author: 'Jawaharlal Nehru',
    isbn: '9780195623598',
    publisher: 'Oxford University Press',
    publication_year: 1946,
    category: 'Indian Literature',
    language: 'English',
    edition: 'Centenary Edition',
    description: 'Written during his four-year imprisonment at Ahmednagar Fort, Jawaharlal Nehru\'s classic work is an impassioned and panoramic exploration of India\'s rich history, philosophy, culture, and art from the Indus Valley Civilization to the freedom struggle.',
    cover_image: 'https://covers.openlibrary.org/b/isbn/9780195623598-L.jpg',
    floor: 'Floor 1',
    section: 'Indian Literature & Heritage',
    shelf: 'Shelf IL-02',
    rack: 'Rack 02',
    total_copies: 3,
    available_copies: 3
  },
  {
    title: 'The Bhagavad Gita',
    author: 'Translated by Eknath Easwaran',
    isbn: '9781586380199',
    publisher: 'Nilgiri Press',
    publication_year: 2007,
    category: 'Indian Literature',
    language: 'English',
    edition: '2nd Edition',
    description: 'The Bhagavad Gita is the best known of all the Indian scriptures, and Eknath Easwaran\'s reliable and poetic translation has introduced hundreds of thousands of readers to its timeless spiritual guidance on duty, meditation, selflessness, and the purpose of life.',
    cover_image: 'https://covers.openlibrary.org/b/isbn/9781586380199-L.jpg',
    floor: 'Floor 1',
    section: 'Indian Literature & Heritage',
    shelf: 'Shelf IL-03',
    rack: 'Rack 01',
    total_copies: 4,
    available_copies: 4
  },
  {
    title: 'The Guide',
    author: 'R. K. Narayan',
    isbn: '9780143039648',
    publisher: 'Penguin Classics',
    publication_year: 1958,
    category: 'Indian Literature',
    language: 'English',
    edition: 'Sahitya Akademi Edition',
    description: 'Set in the fictional South Indian town of Malgudi, The Guide tells the captivating story of Raju, a corrupt tour guide who undergoes an unexpected moral transformation and becomes revered as a holy man during a severe drought.',
    cover_image: 'https://covers.openlibrary.org/b/isbn/9780143039648-L.jpg',
    floor: 'Floor 1',
    section: 'Indian Literature & Heritage',
    shelf: 'Shelf IL-04',
    rack: 'Rack 02',
    total_copies: 3,
    available_copies: 3
  }
];

function seedCurated() {
  console.log('Synchronizing curated library collection into database...');

  const insertBookStmt = db.prepare(`
    INSERT INTO books (
      title, author, isbn, publisher, publication_year,
      category, language, edition, description, cover_image,
      floor, section, shelf, rack, total_copies, available_copies
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const updateBookStmt = db.prepare(`
    UPDATE books
    SET cover_image = ?,
        category = COALESCE(NULLIF(category, ''), ?),
        description = COALESCE(NULLIF(description, ''), ?),
        edition = COALESCE(NULLIF(edition, ''), ?)
    WHERE isbn = ? OR title LIKE ?
  `);

  const insertCopyStmt = db.prepare(`
    INSERT INTO book_copies (book_id, copy_code, status, condition)
    VALUES (?, ?, 'available', 'New')
  `);

  let addedCount = 0;
  let updatedCount = 0;

  for (const b of curatedBooks) {
    const existing = db.prepare('SELECT id, isbn, title, total_copies FROM books WHERE isbn = ? OR title LIKE ?').get(b.isbn, `%${b.title.split(':')[0].trim()}%`);

    if (existing) {
      updateBookStmt.run(b.cover_image, b.category, b.description, b.edition, b.isbn, `%${b.title.split(':')[0].trim()}%`);
      updatedCount++;
    } else {
      const res = insertBookStmt.run(
        b.title, b.author, b.isbn, b.publisher, b.publication_year,
        b.category, b.language, b.edition, b.description, b.cover_image,
        b.floor, b.section, b.shelf, b.rack, b.total_copies, b.available_copies
      );
      const bookId = res.lastInsertRowid;
      const catCode = b.category.split(' ')[0].substring(0, 2).toUpperCase();

      for (let i = 1; i <= b.total_copies; i++) {
        const copyCode = `LM-${catCode}-${bookId}-C${i}`;
        try {
          insertCopyStmt.run(bookId, copyCode);
        } catch (e) {
          // Ignore copy conflict if already generated
        }
      }
      addedCount++;
    }
  }

  // Also upgrade remaining classic books to authentic Open Library cover images by ISBN
  const allBooks = db.prepare('SELECT id, isbn, title, cover_image FROM books').all();
  let coversUpdated = 0;
  const updateCoverStmt = db.prepare('UPDATE books SET cover_image = ? WHERE id = ?');

  for (const bk of allBooks) {
    if (bk.cover_image && bk.cover_image.includes('images.unsplash.com') && bk.isbn) {
      const cleanIsbn = bk.isbn.replace(/[^0-9X]/gi, '');
      if (cleanIsbn.length >= 10) {
        const openLibUrl = `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg`;
        updateCoverStmt.run(openLibUrl, bk.id);
        coversUpdated++;
      }
    }
  }

  console.log(`Curated sync complete: ${addedCount} new books added, ${updatedCount} updated, ${coversUpdated} cover URLs upgraded to authentic covers.`);
}

seedCurated();
