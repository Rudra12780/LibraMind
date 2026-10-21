const bcrypt = require('bcryptjs');
const db = require('./database');

async function seed() {
  console.log('Seeding LibraMind database...');

  // Clear existing data cleanly
  db.exec(`
    DELETE FROM audit_logs;
    DELETE FROM wishlist;
    DELETE FROM notifications;
    DELETE FROM seat_reservations;
    DELETE FROM seats;
    DELETE FROM reservations;
    DELETE FROM loans;
    DELETE FROM book_copies;
    DELETE FROM books;
    DELETE FROM users;
    DELETE FROM sqlite_sequence;
  `);

  // Hash default password
  const salt = bcrypt.genSaltSync(10);
  const adminPass = bcrypt.hashSync('Admin@123', salt);
  const librarianPass = bcrypt.hashSync('Librarian@123', salt);
  const studentPass = bcrypt.hashSync('Student@123', salt);
  const student2Pass = bcrypt.hashSync('Password@123', salt);

  // 1. Insert Users
  const insertUser = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, membership_id, interests)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const adminId = insertUser.run(
    'Dr. Eleanor Vance',
    'admin@libramind.edu',
    adminPass,
    'admin',
    'ADM-9001',
    'System Administration, AI Ethics, Data Policy'
  ).lastInsertRowid;

  const librarianId = insertUser.run(
    'Marcus Thorne',
    'librarian@libramind.edu',
    librarianPass,
    'librarian',
    'LIB-5001',
    'Archival Science, Cataloging, Digital Humanities'
  ).lastInsertRowid;

  const student1Id = insertUser.run(
    'Aarav Sharma',
    'student@libramind.edu',
    studentPass,
    'student',
    'STU-1001',
    'Emotional Fiction, Inspirational & Positivity, Novels, Artificial Intelligence'
  ).lastInsertRowid;

  const student2Id = insertUser.run(
    'Elena Rostova',
    'student2@libramind.edu',
    student2Pass,
    'student',
    'STU-1002',
    'Biophilic Architecture, Classic Literature, Environmental Science'
  ).lastInsertRowid;

  const student3Id = insertUser.run(
    'Maya Lin',
    'maya@libramind.edu',
    studentPass,
    'student',
    'STU-1003',
    'Emotional Fiction, Inspirational & Positivity, Classic Literature, Personal Growth & Positivity'
  ).lastInsertRowid;

  // 2. Insert Books
  const insertBook = db.prepare(`
    INSERT INTO books (
      title, author, isbn, publisher, publication_year, category, language,
      edition, description, cover_image, floor, section, shelf, rack, total_copies, available_copies
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const booksData = [
    {
      title: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      isbn: '978-1449373320',
      publisher: "O'Reilly Media",
      publication_year: 2017,
      category: 'Computer Science',
      language: 'English',
      edition: '1st Edition',
      description: 'The definitive guide to the architecture of modern data systems, storage engines, distributed transactions, and stream processing.',
      cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Tech & Engineering',
      shelf: 'Shelf CS-01',
      rack: 'Rack 04',
      total_copies: 3,
      available_copies: 2
    },
    {
      title: 'Python Crash Course: A Hands-On Project-Based Intro',
      author: 'Eric Matthes',
      isbn: '978-1593279288',
      publisher: 'No Starch Press',
      publication_year: 2023,
      category: 'Programming',
      language: 'English',
      edition: '3rd Edition',
      description: 'A fast-paced, thorough introduction to programming with Python. Covers data visualization, web applications, and game development fundamentals.',
      cover_image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Tech & Engineering',
      shelf: 'Shelf PY-02',
      rack: 'Rack 02',
      total_copies: 4,
      available_copies: 3
    },
    {
      title: 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow',
      author: 'Aurélien Géron',
      isbn: '978-1098125974',
      publisher: "O'Reilly Media",
      publication_year: 2022,
      category: 'Artificial Intelligence',
      language: 'English',
      edition: '3rd Edition',
      description: 'Through concrete examples, minimal theory, and production-ready Python frameworks, this book helps you gain an intuitive understanding of the concepts and tools for building intelligent systems.',
      cover_image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Tech & Engineering',
      shelf: 'Shelf AI-03',
      rack: 'Rack 05',
      total_copies: 3,
      available_copies: 1
    },
    {
      title: 'Biophilic Design: The Theory, Science and Practice of Bringing Buildings to Life',
      author: 'Stephen R. Kellert, Judith Heerwagen, Martin Mador',
      isbn: '978-0470163344',
      publisher: 'Wiley',
      publication_year: 2011,
      category: 'Architecture',
      language: 'English',
      edition: '1st Edition',
      description: 'An inspiring exploration of how architecture and human health intersect through organic shapes, natural light, living vegetation, and restful natural materials.',
      cover_image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Architecture & Design',
      shelf: 'Shelf AR-01',
      rack: 'Rack 01',
      total_copies: 2,
      available_copies: 2
    },
    {
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin',
      isbn: '978-0132350884',
      publisher: 'Prentice Hall',
      publication_year: 2008,
      category: 'Software Engineering',
      language: 'English',
      edition: '1st Edition',
      description: 'Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees. Master meaningful naming, functions, and unit testing.',
      cover_image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Tech & Engineering',
      shelf: 'Shelf SE-04',
      rack: 'Rack 03',
      total_copies: 3,
      available_copies: 0 // All borrowed to demonstrate waiting queue!
    },
    {
      title: 'Artificial Intelligence: A Modern Approach',
      author: 'Stuart Russell, Peter Norvig',
      isbn: '978-0134610993',
      publisher: 'Pearson',
      publication_year: 2020,
      category: 'Artificial Intelligence',
      language: 'English',
      edition: '4th Global Edition',
      description: 'The standard university textbook on intelligent agents, probabilistic reasoning, machine perception, natural language processing, and deep robotics.',
      cover_image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Tech & Engineering',
      shelf: 'Shelf AI-02',
      rack: 'Rack 01',
      total_copies: 2,
      available_copies: 2
    },
    {
      title: 'The Nature of Space: Architecture as Living Sanctuary',
      author: 'Kengo Kuma',
      isbn: '978-4866070773',
      publisher: 'Thames & Hudson',
      publication_year: 2021,
      category: 'Architecture',
      language: 'English',
      edition: 'Special Edition',
      description: 'Reflections on wood, bamboo, stone, and earth in contemporary architectural spaces that restore mental calm and harmony.',
      cover_image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Architecture & Design',
      shelf: 'Shelf AR-02',
      rack: 'Rack 03',
      total_copies: 2,
      available_copies: 2
    },
    {
      title: 'Full Stack Development with Modern Web Frameworks',
      author: 'David Flanagan',
      isbn: '978-1491952023',
      publisher: "O'Reilly Media",
      publication_year: 2024,
      category: 'Web Development',
      language: 'English',
      edition: '2nd Edition',
      description: 'Master client-side React, server-side APIs, database normalization, state management, and real-time sockets with production best practices.',
      cover_image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Tech & Engineering',
      shelf: 'Shelf WD-01',
      rack: 'Rack 06',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: 'Introduction to Algorithms (CLRS)',
      author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
      isbn: '978-0262046305',
      publisher: 'MIT Press',
      publication_year: 2022,
      category: 'Computer Science',
      language: 'English',
      edition: '4th Edition',
      description: 'The world-renowned comprehensive guide to algorithms, dynamic programming, greedy algorithms, graph search, and complexity classes.',
      cover_image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Tech & Engineering',
      shelf: 'Shelf CS-02',
      rack: 'Rack 05',
      total_copies: 4,
      available_copies: 3
    },
    {
      title: 'Deep Learning',
      author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
      isbn: '978-0262035613',
      publisher: 'MIT Press',
      publication_year: 2016,
      category: 'Artificial Intelligence',
      language: 'English',
      edition: 'Illustrated Edition',
      description: 'The quintessential text on deep learning by pioneering founders. Covers linear algebra, probability, deep feedforward networks, convolutional networks, and generative modeling.',
      cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Tech & Engineering',
      shelf: 'Shelf AI-01',
      rack: 'Rack 02',
      total_copies: 3,
      available_copies: 2
    },
    {
      title: 'Structure and Interpretation of Computer Programs (SICP)',
      author: 'Harold Abelson, Gerald Jay Sussman',
      isbn: '978-0262510875',
      publisher: 'MIT Press',
      publication_year: 1996,
      category: 'Programming',
      language: 'English',
      edition: '2nd Edition',
      description: 'A masterpiece of computer science education exploring functional programming, metalinguistic abstraction, interpreters, and computational processes.',
      cover_image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Tech & Engineering',
      shelf: 'Shelf PR-01',
      rack: 'Rack 03',
      total_copies: 2,
      available_copies: 2
    },
    {
      title: 'The Pragmatic Programmer: Your Journey To Mastery',
      author: 'David Thomas, Andrew Hunt',
      isbn: '978-0135957059',
      publisher: 'Addison-Wesley',
      publication_year: 2019,
      category: 'Software Engineering',
      language: 'English',
      edition: '20th Anniversary Edition',
      description: 'Timeless career advice for programmers: DRY principles, orthogonality, tracer bullets, debugging psychology, and continuous refactoring.',
      cover_image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Tech & Engineering',
      shelf: 'Shelf SE-01',
      rack: 'Rack 04',
      total_copies: 3,
      available_copies: 2
    },
    {
      title: 'Database System Concepts',
      author: 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan',
      isbn: '978-0078022159',
      publisher: 'McGraw-Hill Education',
      publication_year: 2019,
      category: 'Computer Science',
      language: 'English',
      edition: '7th Edition',
      description: 'Foundational concepts of relational databases, SQL algebra, indexing, B-trees, concurrency control, crash recovery, and distributed database designs.',
      cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Tech & Engineering',
      shelf: 'Shelf CS-03',
      rack: 'Rack 01',
      total_copies: 3,
      available_copies: 2
    },
    {
      title: 'Computer Networking: A Top-Down Approach',
      author: 'James F. Kurose, Keith W. Ross',
      isbn: '978-0136681557',
      publisher: 'Pearson',
      publication_year: 2021,
      category: 'Computer Science',
      language: 'English',
      edition: '8th Global Edition',
      description: 'Focuses on the internet and contemporary protocol architectures. Covers application layers (HTTP/DNS), transport (TCP/UDP), routing algorithms, and network security.',
      cover_image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Tech & Engineering',
      shelf: 'Shelf CS-04',
      rack: 'Rack 02',
      total_copies: 2,
      available_copies: 1
    },
    {
      title: 'The Architecture of Community',
      author: 'Leon Krier',
      isbn: '978-1597265799',
      publisher: 'Island Press',
      publication_year: 2009,
      category: 'Architecture',
      language: 'English',
      edition: '1st Edition',
      description: 'A visionary critique of modern urban sprawl in favor of human-scale traditional town planning, biophilic community layouts, and walkable green spaces.',
      cover_image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Architecture & Design',
      shelf: 'Shelf AR-03',
      rack: 'Rack 02',
      total_copies: 2,
      available_copies: 2
    },
    {
      title: 'Pattern Recognition and Machine Learning',
      author: 'Christopher M. Bishop',
      isbn: '978-0387310732',
      publisher: 'Springer',
      publication_year: 2006,
      category: 'Artificial Intelligence',
      language: 'English',
      edition: '1st Edition',
      description: 'The foundational textbook presenting Bayesian methods for machine learning, graphical models, kernel methods, variational inference, and expectation-maximization.',
      cover_image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Tech & Engineering',
      shelf: 'Shelf AI-04',
      rack: 'Rack 06',
      total_copies: 2,
      available_copies: 2
    },
    {
      title: 'Refactoring: Improving the Design of Existing Code',
      author: 'Martin Fowler',
      isbn: '978-0134757599',
      publisher: 'Addison-Wesley',
      publication_year: 2018,
      category: 'Software Engineering',
      language: 'English',
      edition: '2nd Edition',
      description: 'Learn to systematically reshape code without altering observable behavior. Covers code smells, test-driven refactoring catalogs, and clean architecture principles.',
      cover_image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Tech & Engineering',
      shelf: 'Shelf SE-02',
      rack: 'Rack 03',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: 'The Timeless Way of Building',
      author: 'Christopher Alexander',
      isbn: '978-0195024012',
      publisher: 'Oxford University Press',
      publication_year: 1979,
      category: 'Architecture',
      language: 'English',
      edition: 'Classic Edition',
      description: 'A poetic, philosophical thesis establishing pattern languages in spaces, emphasizing living nature, organic structures, and environments that bring humanity peace.',
      cover_image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Architecture & Design',
      shelf: 'Shelf AR-04',
      rack: 'Rack 04',
      total_copies: 2,
      available_copies: 2
    },
    {
      title: 'The Midnight Library',
      author: 'Matt Haig',
      isbn: '978-0525559474',
      publisher: 'Viking',
      publication_year: 2020,
      category: 'Emotional Fiction',
      language: 'English',
      edition: 'Bestseller Edition',
      description: 'Between life and death there is a library where the shelves go on forever. Every book provides a chance to try another life you could have lived. A deeply emotional and uplifting exploration of regret, hope, and self-acceptance.',
      cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Literary Sanctuary',
      shelf: 'Shelf NV-01',
      rack: 'Rack 01',
      total_copies: 4,
      available_copies: 3
    },
    {
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      isbn: '978-0062315007',
      publisher: 'HarperOne',
      publication_year: 2014,
      category: 'Inspirational & Positivity',
      language: 'English',
      edition: '25th Anniversary Edition',
      description: 'A magical and profoundly positive fable about following your dreams, listening to your heart, and reading the omens strewn along life’s path. Has inspired tens of millions around the globe.',
      cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Literary Sanctuary',
      shelf: 'Shelf NV-02',
      rack: 'Rack 02',
      total_copies: 4,
      available_copies: 3
    },
    {
      title: 'A Man Called Ove',
      author: 'Fredrik Backman',
      isbn: '978-1476738024',
      publisher: 'Atria Books',
      publication_year: 2014,
      category: 'Emotional Fiction',
      language: 'English',
      edition: 'First Edition',
      description: 'A heartwarming, tearful, and delightfully funny story of an unexpected friendship, community grief, and the profound impact one lonely life can have on countless others.',
      cover_image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Literary Sanctuary',
      shelf: 'Shelf NV-03',
      rack: 'Rack 03',
      total_copies: 3,
      available_copies: 2
    },
    {
      title: "Tuesdays with Morrie: An Old Man, a Young Man, and Life's Greatest Lesson",
      author: 'Mitch Albom',
      isbn: '978-0767905923',
      publisher: 'Anchor',
      publication_year: 2002,
      category: 'Inspirational & Positivity',
      language: 'English',
      edition: 'Special Edition',
      description: 'A moving chronicle of warmth, wisdom, and life lessons on love, forgiving, and aging with grace. One of the most cherished emotional memoirs ever written.',
      cover_image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Literary Sanctuary',
      shelf: 'Shelf NV-04',
      rack: 'Rack 01',
      total_copies: 3,
      available_copies: 2
    },
    {
      title: 'The Little Prince',
      author: 'Antoine de Saint-Exupéry',
      isbn: '978-0156012195',
      publisher: 'Mariner Books',
      publication_year: 2000,
      category: 'Classic Literature',
      language: 'English',
      edition: 'Illustrated Classics',
      description: '“It is only with the heart that one can see rightly; what is essential is invisible to the eye.” A timeless philosophical fable about love, loss, innocence, and true friendship.',
      cover_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Literary Sanctuary',
      shelf: 'Shelf NV-05',
      rack: 'Rack 02',
      total_copies: 4,
      available_copies: 4
    },
    {
      title: 'Before the Coffee Gets Cold',
      author: 'Toshikazu Kawaguchi',
      isbn: '978-1335430991',
      publisher: 'Hanover Square Press',
      publication_year: 2020,
      category: 'Emotional Fiction',
      language: 'English',
      edition: '1st Edition',
      description: 'In a quiet Tokyo café, customers are granted the mysterious opportunity to travel back in time to say what was left unsaid, so long as they return before their coffee gets cold.',
      cover_image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Literary Sanctuary',
      shelf: 'Shelf NV-06',
      rack: 'Rack 03',
      total_copies: 3,
      available_copies: 2
    },
    {
      title: 'Atomic Habits: Tiny Changes, Remarkable Results',
      author: 'James Clear',
      isbn: '978-0735211292',
      publisher: 'Avery',
      publication_year: 2018,
      category: 'Personal Growth & Positivity',
      language: 'English',
      edition: 'Hardcover',
      description: 'An overwhelmingly positive and empowering guide to mastering small daily behaviors, cultivating quiet self-confidence, and designing an uplifting environment.',
      cover_image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Mind & Growth',
      shelf: 'Shelf PG-01',
      rack: 'Rack 01',
      total_copies: 4,
      available_copies: 3
    },
    {
      title: 'The Kite Runner',
      author: 'Khaled Hosseini',
      isbn: '978-1594631931',
      publisher: 'Riverhead Books',
      publication_year: 2013,
      category: 'Emotional Fiction',
      language: 'English',
      edition: '10th Anniversary',
      description: 'An unforgettable, heart-wrenching story of the unlikely friendship between two boys growing up in Kabul. A monumental tale of guilt, redemption, and the enduring power of love.',
      cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Literary Sanctuary',
      shelf: 'Shelf NV-07',
      rack: 'Rack 04',
      total_copies: 3,
      available_copies: 2
    },
    {
      title: 'Where the Crawdads Sing',
      author: 'Delia Owens',
      isbn: '978-0735219090',
      publisher: 'G.P. Putnam’s Sons',
      publication_year: 2018,
      category: 'Emotional Fiction',
      language: 'English',
      edition: '1st Edition',
      description: 'Painfully beautiful and lyrical coming-of-age story set against the wild coastal marshes of North Carolina. A testament to nature, survival, and deep emotional resilience.',
      cover_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Literary Sanctuary',
      shelf: 'Shelf NV-08',
      rack: 'Rack 02',
      total_copies: 3,
      available_copies: 2
    },
    {
      title: 'The Book Thief',
      author: 'Markus Zusak',
      isbn: '978-0375842207',
      publisher: 'Knopf Books for Young Readers',
      publication_year: 2007,
      category: 'Emotional Fiction',
      language: 'English',
      edition: 'Special Edition',
      description: 'Narrated by Death, this poignant and breathtaking masterpiece portrays how words and shared books sustain humanity through unimaginable darkness.',
      cover_image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Literary Sanctuary',
      shelf: 'Shelf NV-09',
      rack: 'Rack 05',
      total_copies: 3,
      available_copies: 2
    },
    {
      title: 'Norwegian Wood',
      author: 'Haruki Murakami',
      isbn: '978-0307744661',
      publisher: 'Vintage International',
      publication_year: 2010,
      category: 'Classic Literature',
      language: 'English',
      edition: 'Vintage Edition',
      description: 'A magnificent coming-of-age story drenched in nostalgia, music, and quiet melancholy, exploring devotion, loss, and the awakening of young adulthood.',
      cover_image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Literary Sanctuary',
      shelf: 'Shelf NV-10',
      rack: 'Rack 03',
      total_copies: 2,
      available_copies: 2
    },
    {
      title: 'The Boy, the Mole, the Fox and the Horse',
      author: 'Charlie Mackesy',
      isbn: '978-0062976581',
      publisher: 'HarperOne',
      publication_year: 2019,
      category: 'Inspirational & Positivity',
      language: 'English',
      edition: 'Illustrated Gift Edition',
      description: 'A radiant book of universal hope and empathy exploring the shared journey of four unlikely friends in the wild. Filled with gentle reminders of kindness, courage, and self-love.',
      cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Mind & Growth',
      shelf: 'Shelf PG-02',
      rack: 'Rack 01',
      total_copies: 4,
      available_copies: 3
    },
    {
      title: 'The Fault in Our Stars',
      author: 'John Green',
      isbn: '978-0525478812',
      publisher: 'Dutton Books',
      publication_year: 2012,
      category: 'Emotional Fiction',
      language: 'English',
      edition: 'Bestseller Edition',
      description: 'A heart-wrenching, bittersweet, and profoundly witty novel between two teenagers dealing with cancer, exploring love, loss, courage, and the beautiful infinities we find within numbered days.',
      cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Literary Sanctuary',
      shelf: 'Shelf NV-11',
      rack: 'Rack 01',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: 'All the Light We Cannot See',
      author: 'Anthony Doerr',
      isbn: '978-1501173219',
      publisher: 'Scribner',
      publication_year: 2014,
      category: 'Emotional Fiction',
      language: 'English',
      edition: 'Pulitzer Prize Edition',
      description: 'A gorgeously written, emotionally captivating historical novel of a blind French girl and a German orphan boy whose paths intertwine in occupied Saint-Malo, showing how goodness endures through tragedy.',
      cover_image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Literary Sanctuary',
      shelf: 'Shelf NV-12',
      rack: 'Rack 02',
      total_copies: 3,
      available_copies: 2
    },
    {
      title: 'Eleanor Oliphant Is Completely Fine',
      author: 'Gail Honeyman',
      isbn: '978-0735220683',
      publisher: 'Pamela Dorman Books',
      publication_year: 2017,
      category: 'Emotional Fiction',
      language: 'English',
      edition: '1st Edition',
      description: 'A charming, funny, and deeply emotional novel about trauma, loneliness, and the healing miracle of everyday kindness, friendship, and connection in our modern world.',
      cover_image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Literary Sanctuary',
      shelf: 'Shelf NV-13',
      rack: 'Rack 03',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: "Man's Search for Meaning",
      author: 'Viktor E. Frankl',
      isbn: '978-0807014295',
      publisher: 'Beacon Press',
      publication_year: 2006,
      category: 'Inspirational & Positivity',
      language: 'English',
      edition: 'Special Edition',
      description: 'A psychiatric and deeply spiritual masterwork on discovering meaning, resilience, and radiant inner strength even amidst profound suffering and hardship.',
      cover_image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Mind & Growth',
      shelf: 'Shelf PG-03',
      rack: 'Rack 02',
      total_copies: 4,
      available_copies: 3
    },
    {
      title: 'The Forty Rules of Love',
      author: 'Elif Shafak',
      isbn: '978-0143118527',
      publisher: 'Penguin Books',
      publication_year: 2011,
      category: 'Emotional Fiction',
      language: 'English',
      edition: 'Reprint Edition',
      description: 'A lyrical, heart-opening parallel novel interweaving a modern woman’s journey of emotional discovery with the timeless, transcendent 13th-century love and wisdom of Rumi and Shams of Tabriz.',
      cover_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Literary Sanctuary',
      shelf: 'Shelf NV-14',
      rack: 'Rack 04',
      total_copies: 3,
      available_copies: 2
    },
    {
      title: 'The Seven Husbands of Evelyn Hugo',
      author: 'Taylor Jenkins Reid',
      isbn: '978-1501161933',
      publisher: 'Atria Books',
      publication_year: 2017,
      category: 'Emotional Fiction',
      language: 'English',
      edition: 'International Edition',
      description: 'An enthralling, cinematic, and profoundly emotional portrait of an iconic Hollywood legend who unspools the truth behind her glamorous public life and her one genuine, enduring secret love.',
      cover_image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Literary Sanctuary',
      shelf: 'Shelf NV-15',
      rack: 'Rack 01',
      total_copies: 4,
      available_copies: 3
    },
    {
      title: 'Ikigai: The Japanese Secret to a Long and Happy Life',
      author: 'Héctor García, Francesc Miralles',
      isbn: '978-0143130726',
      publisher: 'Penguin Life',
      publication_year: 2017,
      category: 'Inspirational & Positivity',
      language: 'English',
      edition: 'Hardcover Edition',
      description: 'A calming, inspiring, and delightfully positive book exploring the island of Okinawa and the art of staying joyful, fulfilled, purposeful, and harmoniously connected to nature.',
      cover_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Mind & Growth',
      shelf: 'Shelf PG-04',
      rack: 'Rack 02',
      total_copies: 4,
      available_copies: 4
    },
    {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      isbn: '978-0141439518',
      publisher: 'Penguin Classics',
      publication_year: 2003,
      category: 'Classic Literature',
      language: 'English',
      edition: 'Penguin Classics',
      description: 'The sparkling, romantic, and witty classic of Elizabeth Bennet and Mr. Darcy. A joyful, timeless celebration of emotional growth, family, humor, and true affection.',
      cover_image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Literary Sanctuary',
      shelf: 'Shelf CL-01',
      rack: 'Rack 01',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: 'When Breath Becomes Air',
      author: 'Paul Kalanithi',
      isbn: '978-0812988406',
      publisher: 'Random House',
      publication_year: 2016,
      category: 'Emotional Fiction',
      language: 'English',
      edition: 'First Edition',
      description: 'An unforgettable, deeply moving, and inspiring meditation on living with dignity, meaning, and love when faced with mortality, written with immense poise and poetic beauty.',
      cover_image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Literary Sanctuary',
      shelf: 'Shelf NV-16',
      rack: 'Rack 02',
      total_copies: 3,
      available_copies: 2
    },
    {
      title: 'A Thousand Splendid Suns',
      author: 'Khaled Hosseini',
      isbn: '978-1594483851',
      publisher: 'Riverhead Books',
      publication_year: 2008,
      category: 'Emotional Fiction',
      language: 'English',
      edition: 'Special Edition',
      description: 'A breathtaking and heartbreaking chronicle of maternal love, female solidarity, and emotional endurance across three decades of Afghan turmoil. Deeply touching and unforgettable.',
      cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Literary Sanctuary',
      shelf: 'Shelf NV-17',
      rack: 'Rack 03',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: 'The Comfort Book',
      author: 'Matt Haig',
      isbn: '978-0143136667',
      publisher: 'Penguin Life',
      publication_year: 2021,
      category: 'Inspirational & Positivity',
      language: 'English',
      edition: 'Hardcover',
      description: 'A luminous, tender, and comforting collection of short notes, stories, and uplifting truths designed to remind us that things can get tough, but there is always hope and warmth ahead.',
      cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Mind & Growth',
      shelf: 'Shelf PG-05',
      rack: 'Rack 01',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: 'Wonder',
      author: 'R.J. Palacio',
      isbn: '978-0375869020',
      publisher: 'Knopf Books for Young Readers',
      publication_year: 2012,
      category: 'Inspirational & Positivity',
      language: 'English',
      edition: 'Collector Edition',
      description: 'A heartwarming, uplifting, and life-changing novel about kindness, bravery, and acceptance through the eyes of Auggie Pullman. Will restore your faith in human generosity.',
      cover_image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Mind & Growth',
      shelf: 'Shelf PG-06',
      rack: 'Rack 02',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: 'The House in the Cerulean Sea',
      author: 'TJ Klune',
      isbn: '978-1250217288',
      publisher: 'Tor Books',
      publication_year: 2020,
      category: 'Inspirational & Positivity',
      language: 'English',
      edition: '1st Edition',
      description: 'A cozy, joyful, and masterfully wholesome novel about finding your chosen family in the most improbable setting. Radiates warmth, gentleness, humor, and unconditional acceptance.',
      cover_image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Literary Sanctuary',
      shelf: 'Shelf NV-18',
      rack: 'Rack 01',
      total_copies: 3,
      available_copies: 2
    },
    {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '978-0060935467',
      publisher: 'Harper Perennial Modern Classics',
      publication_year: 2002,
      category: 'Classic Literature',
      language: 'English',
      edition: 'Anniversary Edition',
      description: 'A cherished, moving classic of warmth, integrity, family affection, and standing up for human empathy in the face of prejudice and injustice.',
      cover_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Literary Sanctuary',
      shelf: 'Shelf CL-02',
      rack: 'Rack 02',
      total_copies: 3,
      available_copies: 2
    }
  ];

  const insertCopy = db.prepare(`
    INSERT INTO book_copies (book_id, copy_code, status, condition)
    VALUES (?, ?, ?, ?)
  `);

  const createdBooks = [];

  for (const b of booksData) {
    const res = insertBook.run(
      b.title, b.author, b.isbn, b.publisher, b.publication_year,
      b.category, b.language, b.edition, b.description, b.cover_image,
      b.floor, b.section, b.shelf, b.rack, b.total_copies, b.available_copies
    );
    const bookId = res.lastInsertRowid;
    createdBooks.push({ id: bookId, ...b });

    // Generate physical copy records
    for (let c = 1; c <= b.total_copies; c++) {
      const code = `LM-${b.category.substring(0, 2).toUpperCase()}-${bookId}-C${c}`;
      // For Clean Code, both copies are borrowed to test waitlist
      let copyStatus = 'available';
      if (b.title === 'Clean Code: A Handbook of Agile Software Craftsmanship') {
        copyStatus = 'borrowed';
      } else if (b.title === 'Designing Data-Intensive Applications' && c === 1) {
        copyStatus = 'borrowed';
      } else if (b.title === 'Python Crash Course: A Hands-On Project-Based Intro' && c === 1) {
        copyStatus = 'borrowed';
      } else if (b.title === 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow' && (c === 1 || c === 2)) {
        copyStatus = 'borrowed';
      }

      insertCopy.run(bookId, code, copyStatus, c === 1 ? 'New' : 'Good');
    }
  }

  // 3. Insert Loans (Active & Past)
  const insertLoan = db.prepare(`
    INSERT INTO loans (book_id, copy_id, user_id, borrow_date, due_date, return_date, status, renewal_count, fine_amount, fine_paid)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Aarav has:
  // 1 active loan: Python Crash Course, due in 7 days
  const pyBook = createdBooks.find(b => b.title.includes('Python Crash Course'));
  const pyCopy = db.prepare('SELECT id FROM book_copies WHERE book_id = ? AND status = ?').get(pyBook.id, 'borrowed');
  const now = new Date();
  const due7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

  if (pyCopy) {
    insertLoan.run(
      pyBook.id, pyCopy.id, student1Id,
      now.toISOString(), due7Days, null, 'active', 0, 0.0, 0
    );
  }

  // Elena has:
  // 1 active loan: Designing Data-Intensive Applications
  const ddiaBook = createdBooks.find(b => b.title.includes('Designing Data-Intensive'));
  const ddiaCopy = db.prepare('SELECT id FROM book_copies WHERE book_id = ? AND status = ?').get(ddiaBook.id, 'borrowed');
  if (ddiaCopy) {
    insertLoan.run(
      ddiaBook.id, ddiaCopy.id, student2Id,
      now.toISOString(), due7Days, null, 'active', 0, 0.0, 0
    );
  }

  // 1 past loan (returned): ML book returned last month
  const mlBook = createdBooks.find(b => b.title.includes('Hands-On Machine Learning'));
  const mlCopies = db.prepare('SELECT id FROM book_copies WHERE book_id = ?').all(mlBook.id);
  if (mlCopies.length > 0) {
    const pastBorrow = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const pastDue = new Date(now.getTime() - 16 * 24 * 60 * 60 * 1000).toISOString();
    const pastReturn = new Date(now.getTime() - 17 * 24 * 60 * 60 * 1000).toISOString();
    insertLoan.run(
      mlBook.id, mlCopies[0].id, student1Id,
      pastBorrow, pastDue, pastReturn, 'returned', 0, 0.0, 1
    );
  }

  // 4. Insert Reservations
  // Aarav reserved 'Clean Code' which has 0 available copies
  const cleanCodeBook = createdBooks.find(b => b.title.includes('Clean Code'));
  const insertRes = db.prepare(`
    INSERT INTO reservations (book_id, user_id, reservation_date, status, queue_position)
    VALUES (?, ?, CURRENT_TIMESTAMP, 'waiting', 1)
  `);
  insertRes.run(cleanCodeBook.id, student1Id);

  // 5. Insert Seats (Floor 1 & Floor 2 across 4 sections)
  const insertSeat = db.prepare(`
    INSERT INTO seats (seat_number, floor, section, has_power, has_monitor, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const seatConfigs = [
    // Floor 1 - Quiet Study Zone
    { num: 'F1-Q01', floor: 'Floor 1', sec: 'Quiet Study Zone', p: 1, m: 0, s: 'available' },
    { num: 'F1-Q02', floor: 'Floor 1', sec: 'Quiet Study Zone', p: 1, m: 1, s: 'occupied' },
    { num: 'F1-Q03', floor: 'Floor 1', sec: 'Quiet Study Zone', p: 1, m: 0, s: 'available' },
    { num: 'F1-Q04', floor: 'Floor 1', sec: 'Quiet Study Zone', p: 0, m: 0, s: 'available' },
    { num: 'F1-Q05', floor: 'Floor 1', sec: 'Quiet Study Zone', p: 1, m: 1, s: 'available' },

    // Floor 1 - Collaborative Reading Hub
    { num: 'F1-C01', floor: 'Floor 1', sec: 'Collaborative Hub', p: 1, m: 0, s: 'available' },
    { num: 'F1-C02', floor: 'Floor 1', sec: 'Collaborative Hub', p: 1, m: 0, s: 'available' },
    { num: 'F1-C03', floor: 'Floor 1', sec: 'Collaborative Hub', p: 1, m: 1, s: 'occupied' },
    { num: 'F1-C04', floor: 'Floor 1', sec: 'Collaborative Hub', p: 0, m: 0, s: 'available' },

    // Floor 2 - Biophilic Garden Pods
    { num: 'F2-G01', floor: 'Floor 2', sec: 'Garden Window Pods', p: 1, m: 1, s: 'available' },
    { num: 'F2-G02', floor: 'Floor 2', sec: 'Garden Window Pods', p: 1, m: 1, s: 'available' },
    { num: 'F2-G03', floor: 'Floor 2', sec: 'Garden Window Pods', p: 1, m: 0, s: 'occupied' },
    { num: 'F2-G04', floor: 'Floor 2', sec: 'Garden Window Pods', p: 1, m: 0, s: 'available' },

    // Floor 2 - Silent Research Nook
    { num: 'F2-R01', floor: 'Floor 2', sec: 'Research Nook', p: 1, m: 1, s: 'available' },
    { num: 'F2-R02', floor: 'Floor 2', sec: 'Research Nook', p: 1, m: 1, s: 'available' },
    { num: 'F2-R03', floor: 'Floor 2', sec: 'Research Nook', p: 1, m: 0, s: 'maintenance' }
  ];

  for (const s of seatConfigs) {
    insertSeat.run(s.num, s.floor, s.sec, s.p, s.m, s.s);
  }

  // 6. Insert Notifications
  const insertNotif = db.prepare(`
    INSERT INTO notifications (user_id, title, message, type, link, is_read)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertNotif.run(
    student1Id,
    'Welcome to LibraMind',
    'Explore our Biophilic smart library, discover books with AI search, and reserve quiet study pods.',
    'announcement',
    '/catalog',
    0
  );

  insertNotif.run(
    student1Id,
    'Book Loan Confirmed',
    'You borrowed "Python Crash Course". Due on ' + new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString() + '.',
    'borrow',
    '/dashboard',
    0
  );

  insertNotif.run(
    student1Id,
    'Waiting List Position #1',
    'You are in position 1 for "Clean Code: A Handbook of Agile Software Craftsmanship". We will notify you once a copy is returned.',
    'reservation',
    '/dashboard',
    1
  );

  // 7. Insert Wishlist
  const insertWish = db.prepare(`
    INSERT INTO wishlist (user_id, book_id) VALUES (?, ?)
  `);
  insertWish.run(student1Id, ddiaBook.id);

  // 8. Insert Audit Logs
  const insertAudit = db.prepare(`
    INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)
  `);
  insertAudit.run(adminId, 'SYSTEM_INITIALIZATION', 'System initialized with biophilic library database schema.');
  insertAudit.run(librarianId, 'BOOK_CHECKOUT', `Issued Python Crash Course to member STU-1001.`);

  console.log('LibraMind database seeded successfully!');
}

seed().catch(err => {
  console.error('Seeding error:', err);
});
