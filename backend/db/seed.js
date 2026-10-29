const bcrypt = require('bcryptjs');
const db = require('./database');

async function seed() {
  console.log('Seeding LibraMind pure Novels & Spiritual Books catalog...');

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
    'Spiritual Philosophy, Literary Curation, Community Growth'
  ).lastInsertRowid;

  const librarianId = insertUser.run(
    'Marcus Thorne',
    'librarian@libramind.edu',
    librarianPass,
    'librarian',
    'LIB-5001',
    'Classic Novels, Emotional Fiction, Wisdom Literature'
  ).lastInsertRowid;

  const student1Id = insertUser.run(
    'Aarav Sharma',
    'student@libramind.edu',
    studentPass,
    'student',
    'STU-1001',
    'Spiritual & Wisdom, Emotional Fiction, Classic Novels, Mindfulness'
  ).lastInsertRowid;

  const student2Id = insertUser.run(
    'Elena Rostova',
    'student2@libramind.edu',
    student2Pass,
    'student',
    'STU-1002',
    'Classic Novels, Modern Novels, World Classics, Spiritual Growth'
  ).lastInsertRowid;

  const student3Id = insertUser.run(
    'Maya Lin',
    'maya@libramind.edu',
    studentPass,
    'student',
    'STU-1003',
    'Emotional Fiction, Spiritual & Wisdom, Modern Novels'
  ).lastInsertRowid;

  // 2. Insert Pure Novels & Spiritual Books (NO STUDY / TEXTBOOKS)
  const insertBook = db.prepare(`
    INSERT INTO books (
      title, author, isbn, publisher, publication_year, category, language,
      edition, description, cover_image, floor, section, shelf, rack, total_copies, available_copies
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const booksData = [
    // --- SPIRITUAL & WISDOM MASTERWORKS ---
    {
      title: 'The Bhagavad Gita: Walk the Path of Inner Peace',
      author: 'Eknath Easwaran',
      isbn: '978-1586380199',
      publisher: 'Nilgiri Press',
      publication_year: 2007,
      category: 'Spiritual & Wisdom',
      language: 'English',
      edition: '2nd Classic Edition',
      description: 'A timeless spiritual dialogue between Prince Arjuna and Sri Krishna on duty, selfless action, deep meditation, devotion, and supreme tranquility of the soul.',
      cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Spiritual Wisdom Sanctuary',
      shelf: 'Shelf SP-01',
      rack: 'Rack 01',
      total_copies: 4,
      available_copies: 4
    },
    {
      title: 'The Power of Now: A Guide to Spiritual Enlightenment',
      author: 'Eckhart Tolle',
      isbn: '978-1577314806',
      publisher: 'New World Library',
      publication_year: 2004,
      category: 'Spiritual & Wisdom',
      language: 'English',
      edition: 'Hardcover Edition',
      description: 'A world-renowned spiritual handbook for stepping out of incessant mental anxiety and entering the quiet stillness, profound joy, and presence of the eternal Now.',
      cover_image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Spiritual Wisdom Sanctuary',
      shelf: 'Shelf SP-02',
      rack: 'Rack 02',
      total_copies: 4,
      available_copies: 3
    },
    {
      title: 'Siddhartha',
      author: 'Hermann Hesse',
      isbn: '978-0553208849',
      publisher: 'Bantam Books',
      publication_year: 1981,
      category: 'Spiritual & Wisdom',
      language: 'English',
      edition: 'Collector Classic',
      description: 'A sublime spiritual novel following a young seeker in ancient India as he abandons material wealth to discover self-realization, inner stillness, and cosmic unity beside a tranquil river.',
      cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Spiritual Wisdom Sanctuary',
      shelf: 'Shelf SP-03',
      rack: 'Rack 01',
      total_copies: 4,
      available_copies: 3
    },
    {
      title: 'Autobiography of a Yogi',
      author: 'Paramahansa Yogananda',
      isbn: '978-0876120835',
      publisher: 'Self-Realization Fellowship',
      publication_year: 1998,
      category: 'Spiritual & Wisdom',
      language: 'English',
      edition: 'Commemorative Edition',
      description: 'The celebrated spiritual masterpiece introducing Kriya Yoga, mystical encounters with Himalayan saints, and the universal science of God-communion and self-awakening.',
      cover_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Spiritual Wisdom Sanctuary',
      shelf: 'Shelf SP-04',
      rack: 'Rack 03',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: 'Meditations: Thoughts on Stoicism and Inner Peace',
      author: 'Marcus Aurelius',
      isbn: '978-0812968255',
      publisher: 'Modern Library',
      publication_year: 2003,
      category: 'Spiritual & Wisdom',
      language: 'English',
      edition: 'Gregory Hays Translation',
      description: 'Private spiritual reflections of the Roman Emperor on mindfulness, emotional resilience, duty, humility, and keeping the soul untroubled amidst external storms.',
      cover_image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Spiritual Wisdom Sanctuary',
      shelf: 'Shelf SP-05',
      rack: 'Rack 02',
      total_copies: 4,
      available_copies: 4
    },
    {
      title: 'Tao Te Ching: The Book of the Way',
      author: 'Laozi (Stephen Mitchell)',
      isbn: '978-0061142666',
      publisher: 'Harper Perennial Modern Classics',
      publication_year: 2006,
      category: 'Spiritual & Wisdom',
      language: 'English',
      edition: 'Definitive Translation',
      description: 'Eighty-one poetic chapters on living in harmony with the natural flow of life, cultivating simplicity, stillness, compassionate non-contention, and graceful wisdom.',
      cover_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Spiritual Wisdom Sanctuary',
      shelf: 'Shelf SP-06',
      rack: 'Rack 01',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: 'The Prophet',
      author: 'Kahlil Gibran',
      isbn: '978-0394404288',
      publisher: 'Knopf',
      publication_year: 1995,
      category: 'Spiritual & Wisdom',
      language: 'English',
      edition: 'Collector Gift Edition',
      description: 'Poetic, spiritual sermons on love, marriage, joy, sorrow, freedom, pain, friendship, and prayer delivered by the prophet Almustafa before he boards his journey home.',
      cover_image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Spiritual Wisdom Sanctuary',
      shelf: 'Shelf SP-07',
      rack: 'Rack 04',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: 'The Untethered Soul: The Journey Beyond Yourself',
      author: 'Michael A. Singer',
      isbn: '978-1572245372',
      publisher: 'New Harbinger Publications',
      publication_year: 2007,
      category: 'Spiritual & Wisdom',
      language: 'English',
      edition: 'Bestseller Edition',
      description: 'A transformative exploration of consciousness, spiritual awakening, and discovering unconditional happiness by letting go of habitual ego defenses and internal resistance.',
      cover_image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Spiritual Wisdom Sanctuary',
      shelf: 'Shelf SP-08',
      rack: 'Rack 02',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      isbn: '978-0062315007',
      publisher: 'HarperOne',
      publication_year: 2014,
      category: 'Spiritual & Wisdom',
      language: 'English',
      edition: '25th Anniversary Edition',
      description: 'A magical and profoundly positive spiritual fable about following your dreams, listening to your heart, and reading the sacred omens strewn along life’s journey.',
      cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Spiritual Wisdom Sanctuary',
      shelf: 'Shelf SP-09',
      rack: 'Rack 01',
      total_copies: 4,
      available_copies: 3
    },
    {
      title: "Man's Search for Meaning",
      author: 'Viktor E. Frankl',
      isbn: '978-0807014295',
      publisher: 'Beacon Press',
      publication_year: 2006,
      category: 'Spiritual & Wisdom',
      language: 'English',
      edition: 'Special Edition',
      description: 'A psychiatric and deeply spiritual masterwork on discovering meaning, resilience, and radiant inner strength even amidst profound suffering and hardship.',
      cover_image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Spiritual Wisdom Sanctuary',
      shelf: 'Shelf SP-10',
      rack: 'Rack 03',
      total_copies: 4,
      available_copies: 3
    },
    {
      title: 'The Forty Rules of Love',
      author: 'Elif Shafak',
      isbn: '978-0143118527',
      publisher: 'Penguin Books',
      publication_year: 2011,
      category: 'Spiritual & Wisdom',
      language: 'English',
      edition: 'Reprint Edition',
      description: 'A lyrical, heart-opening parallel novel interweaving a modern woman’s spiritual journey of love with the timeless, transcendent 13th-century wisdom of Rumi and Shams of Tabriz.',
      cover_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Spiritual Wisdom Sanctuary',
      shelf: 'Shelf SP-11',
      rack: 'Rack 02',
      total_copies: 3,
      available_copies: 2
    },
    {
      title: 'Inner Engineering: A Yogi’s Guide to Joy',
      author: 'Sadhguru',
      isbn: '978-0143428848',
      publisher: 'Spiegel & Grau',
      publication_year: 2016,
      category: 'Spiritual & Wisdom',
      language: 'English',
      edition: 'International Edition',
      description: 'A sophisticated spiritual guide offering practical yogic tools to align mind, body, and energy, enabling radiant joy, vitality, and deep inner bliss.',
      cover_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Spiritual Wisdom Sanctuary',
      shelf: 'Shelf SP-12',
      rack: 'Rack 04',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: 'Freedom from the Known',
      author: 'Jiddu Krishnamurti',
      isbn: '978-0060648084',
      publisher: 'HarperOne',
      publication_year: 1975,
      category: 'Spiritual & Wisdom',
      language: 'English',
      edition: 'Perennial Library',
      description: 'A radical spiritual guide examining how we can free ourselves from psychological conditioning, fear, and sorrow through direct, choiceless awareness.',
      cover_image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Spiritual Wisdom Sanctuary',
      shelf: 'Shelf SP-13',
      rack: 'Rack 01',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: 'Ikigai: The Japanese Secret to a Long and Happy Life',
      author: 'Héctor García, Francesc Miralles',
      isbn: '978-0143130726',
      publisher: 'Penguin Life',
      publication_year: 2017,
      category: 'Spiritual & Wisdom',
      language: 'English',
      edition: 'Hardcover Edition',
      description: 'A calming, inspiring, and delightfully positive book exploring the island of Okinawa and the spiritual art of staying joyful, fulfilled, purposeful, and harmoniously connected to nature.',
      cover_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Spiritual Wisdom Sanctuary',
      shelf: 'Shelf SP-14',
      rack: 'Rack 02',
      total_copies: 4,
      available_copies: 4
    },
    {
      title: 'When Breath Becomes Air',
      author: 'Paul Kalanithi',
      isbn: '978-0812988406',
      publisher: 'Random House',
      publication_year: 2016,
      category: 'Spiritual & Wisdom',
      language: 'English',
      edition: 'First Edition',
      description: 'An unforgettable, deeply moving, and inspiring meditation on living with dignity, meaning, and love when faced with mortality, written with immense poise and poetic beauty.',
      cover_image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Spiritual Wisdom Sanctuary',
      shelf: 'Shelf SP-15',
      rack: 'Rack 03',
      total_copies: 3,
      available_copies: 2
    },
    {
      title: 'The Comfort Book',
      author: 'Matt Haig',
      isbn: '978-0143136667',
      publisher: 'Penguin Life',
      publication_year: 2021,
      category: 'Spiritual & Wisdom',
      language: 'English',
      edition: 'Hardcover',
      description: 'A luminous, tender, and comforting collection of short notes, spiritual insights, and uplifting truths designed to remind us of gentle hope and warmth.',
      cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Spiritual Wisdom Sanctuary',
      shelf: 'Shelf SP-16',
      rack: 'Rack 01',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: 'The Boy, the Mole, the Fox and the Horse',
      author: 'Charlie Mackesy',
      isbn: '978-0062976581',
      publisher: 'HarperOne',
      publication_year: 2019,
      category: 'Spiritual & Wisdom',
      language: 'English',
      edition: 'Illustrated Gift Edition',
      description: 'A radiant book of universal hope and empathy exploring the shared journey of four unlikely friends in the wild. Filled with gentle reminders of kindness, courage, and self-love.',
      cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Spiritual Wisdom Sanctuary',
      shelf: 'Shelf SP-17',
      rack: 'Rack 02',
      total_copies: 4,
      available_copies: 3
    },
    {
      title: "Tuesdays with Morrie: An Old Man, a Young Man, and Life's Greatest Lesson",
      author: 'Mitch Albom',
      isbn: '978-0767905923',
      publisher: 'Anchor',
      publication_year: 2002,
      category: 'Spiritual & Wisdom',
      language: 'English',
      edition: 'Special Edition',
      description: 'A moving chronicle of warmth, wisdom, and life lessons on love, forgiving, and aging with grace. One of the most cherished emotional memoirs ever written.',
      cover_image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Spiritual Wisdom Sanctuary',
      shelf: 'Shelf SP-18',
      rack: 'Rack 03',
      total_copies: 3,
      available_copies: 2
    },

    // --- CLASSIC NOVELS ---
    {
      title: '1984',
      author: 'George Orwell',
      isbn: '978-0451524935',
      publisher: 'Signet Classic',
      publication_year: 1961,
      category: 'Classic Novels',
      language: 'English',
      edition: 'Centennial Edition',
      description: 'The monumental dystopian classic of Big Brother, thoughtcrime, Winston Smith, and the fierce longing for human truth, memory, and love against totalitarian power.',
      cover_image: '/uploads/book_1984_original.jpg',
      floor: 'Floor 1',
      section: 'Classic Literature Gallery',
      shelf: 'Shelf CL-01',
      rack: 'Rack 01',
      total_copies: 3,
      available_copies: 0 // Reserved for queue testing
    },
    {
      title: 'Crime and Punishment',
      author: 'Fyodor Dostoevsky',
      isbn: '978-0140449136',
      publisher: 'Penguin Classics',
      publication_year: 2003,
      category: 'Classic Novels',
      language: 'English',
      edition: 'Pevear and Volokhonsky Translation',
      description: 'A gripping psychological novel exploring guilt, intellectual pride, redemption, and spiritual rebirth through the impoverished student Raskolnikov in St. Petersburg.',
      cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Classic Literature Gallery',
      shelf: 'Shelf CL-02',
      rack: 'Rack 02',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: 'The Brothers Karamazov',
      author: 'Fyodor Dostoevsky',
      isbn: '978-0374528379',
      publisher: 'Farrar, Straus and Giroux',
      publication_year: 2002,
      category: 'Classic Novels',
      language: 'English',
      edition: 'Special Translation',
      description: 'A passionate philosophical novel that enters deeply into the ethical debates of God, free will, morality, and fraternal love in 19th-century Russia.',
      cover_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Classic Literature Gallery',
      shelf: 'Shelf CL-03',
      rack: 'Rack 03',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: 'The Picture of Dorian Gray',
      author: 'Oscar Wilde',
      isbn: '978-0141439570',
      publisher: 'Penguin Classics',
      publication_year: 2003,
      category: 'Classic Novels',
      language: 'English',
      edition: 'Penguin Classics',
      description: 'Oscar Wilde’s mesmerizing moral fantasy of a handsome young aristocrat whose painted portrait ages and decays with every sin, while he remains eternally youthful.',
      cover_image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Classic Literature Gallery',
      shelf: 'Shelf CL-04',
      rack: 'Rack 01',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      isbn: '978-0141439518',
      publisher: 'Penguin Classics',
      publication_year: 2003,
      category: 'Classic Novels',
      language: 'English',
      edition: 'Penguin Classics',
      description: 'The sparkling, romantic, and witty classic of Elizabeth Bennet and Mr. Darcy. A joyful celebration of emotional maturity, family humor, and genuine affection.',
      cover_image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Classic Literature Gallery',
      shelf: 'Shelf CL-05',
      rack: 'Rack 02',
      total_copies: 4,
      available_copies: 4
    },
    {
      title: 'Jane Eyre',
      author: 'Charlotte Brontë',
      isbn: '978-0141441146',
      publisher: 'Penguin Classics',
      publication_year: 2006,
      category: 'Classic Novels',
      language: 'English',
      edition: 'Deluxe Classic',
      description: 'An orphaned young governess champions moral integrity, fierce independence, and profound passion in the gothic halls of Thornfield and with Mr. Rochester.',
      cover_image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Classic Literature Gallery',
      shelf: 'Shelf CL-06',
      rack: 'Rack 03',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: 'Wuthering Heights',
      author: 'Emily Brontë',
      isbn: '978-0141439556',
      publisher: 'Penguin Classics',
      publication_year: 2003,
      category: 'Classic Novels',
      language: 'English',
      edition: 'Penguin Classics',
      description: 'A dark, tempestuous masterpiece of turbulent passion, vengeance, and spiritual longing set across the haunted Yorkshire moors between Heathcliff and Catherine.',
      cover_image: '/uploads/book_wuthering_heights_original.jpg',
      floor: 'Floor 1',
      section: 'Classic Literature Gallery',
      shelf: 'Shelf CL-07',
      rack: 'Rack 04',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '978-0060935467',
      publisher: 'Harper Perennial Modern Classics',
      publication_year: 2002,
      category: 'Classic Novels',
      language: 'English',
      edition: 'Anniversary Edition',
      description: 'A cherished, moving classic of warmth, integrity, family affection, and standing up for human empathy in the face of prejudice and injustice.',
      cover_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Classic Literature Gallery',
      shelf: 'Shelf CL-08',
      rack: 'Rack 01',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0743273565',
      publisher: 'Scribner',
      publication_year: 2004,
      category: 'Classic Novels',
      language: 'English',
      edition: 'Classic Edition',
      description: 'The supreme novel of the Jazz Age, exploring wealth, yearning, disillusionment, and the elusive nature of the American Dream through Jay Gatsby and Daisy Buchanan.',
      cover_image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Classic Literature Gallery',
      shelf: 'Shelf CL-09',
      rack: 'Rack 02',
      total_copies: 4,
      available_copies: 4
    },
    {
      title: 'The Little Prince',
      author: 'Antoine de Saint-Exupéry',
      isbn: '978-0156012195',
      publisher: 'Mariner Books',
      publication_year: 2000,
      category: 'Classic Novels',
      language: 'English',
      edition: 'Illustrated Classics',
      description: '“It is only with the heart that one can see rightly; what is essential is invisible to the eye.” A timeless philosophical fable about love, loss, innocence, and true friendship.',
      cover_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Classic Literature Gallery',
      shelf: 'Shelf CL-10',
      rack: 'Rack 03',
      total_copies: 4,
      available_copies: 4
    },
    {
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      isbn: '978-0316769488',
      publisher: 'Little, Brown and Company',
      publication_year: 1991,
      category: 'Classic Novels',
      language: 'English',
      edition: 'Classic Paperback',
      description: 'The defining novel of youthful alienation, innocence, and emotional vulnerability through the candid, unforgettable voice of Holden Caulfield in New York City.',
      cover_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Classic Literature Gallery',
      shelf: 'Shelf CL-11',
      rack: 'Rack 04',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: 'One Hundred Years of Solitude',
      author: 'Gabriel García Márquez',
      isbn: '978-0060883287',
      publisher: 'Harper Perennial Modern Classics',
      publication_year: 2006,
      category: 'Classic Novels',
      language: 'English',
      edition: 'Classic Edition',
      description: 'The landmark magical realist novel tracing seven generations of the Buendía family in the mythical Colombian town of Macondo, weaving destiny, passion, and solitude.',
      cover_image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Classic Literature Gallery',
      shelf: 'Shelf CL-12',
      rack: 'Rack 02',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: 'Anne of Green Gables',
      author: 'L.M. Montgomery',
      isbn: '978-0141321592',
      publisher: 'Puffin Classics',
      publication_year: 2008,
      category: 'Classic Novels',
      language: 'English',
      edition: 'Puffin Classics',
      description: 'An uplifting classic novel about the spirited, imaginative orphan Anne Shirley, who brings laughter, love, and vibrant heart to Prince Edward Island.',
      cover_image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Classic Literature Gallery',
      shelf: 'Shelf CL-13',
      rack: 'Rack 01',
      total_copies: 4,
      available_copies: 4
    },
    {
      title: 'Norwegian Wood',
      author: 'Haruki Murakami',
      isbn: '978-0307744661',
      publisher: 'Vintage International',
      publication_year: 2010,
      category: 'Classic Novels',
      language: 'English',
      edition: 'Vintage Edition',
      description: 'A magnificent coming-of-age story drenched in nostalgia, music, and quiet melancholy, exploring devotion, loss, and the bittersweet awakening of young adulthood.',
      cover_image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 1',
      section: 'Classic Literature Gallery',
      shelf: 'Shelf CL-14',
      rack: 'Rack 03',
      total_copies: 3,
      available_copies: 3
    },

    // --- EMOTIONAL FICTION & MODERN NOVELS ---
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
      section: 'Emotional Fiction Pavilion',
      shelf: 'Shelf EF-01',
      rack: 'Rack 01',
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
      section: 'Emotional Fiction Pavilion',
      shelf: 'Shelf EF-02',
      rack: 'Rack 02',
      total_copies: 3,
      available_copies: 2
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
      section: 'Emotional Fiction Pavilion',
      shelf: 'Shelf EF-03',
      rack: 'Rack 03',
      total_copies: 3,
      available_copies: 2
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
      section: 'Emotional Fiction Pavilion',
      shelf: 'Shelf EF-04',
      rack: 'Rack 04',
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
      section: 'Emotional Fiction Pavilion',
      shelf: 'Shelf EF-05',
      rack: 'Rack 03',
      total_copies: 3,
      available_copies: 3
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
      section: 'Emotional Fiction Pavilion',
      shelf: 'Shelf EF-06',
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
      section: 'Emotional Fiction Pavilion',
      shelf: 'Shelf EF-07',
      rack: 'Rack 01',
      total_copies: 3,
      available_copies: 2
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
      description: 'A heart-wrenching, bittersweet, and profoundly witty novel between two teenagers dealing with illness, exploring love, loss, courage, and the beautiful infinities we find within numbered days.',
      cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Emotional Fiction Pavilion',
      shelf: 'Shelf EF-08',
      rack: 'Rack 02',
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
      section: 'Emotional Fiction Pavilion',
      shelf: 'Shelf EF-09',
      rack: 'Rack 03',
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
      section: 'Emotional Fiction Pavilion',
      shelf: 'Shelf EF-10',
      rack: 'Rack 04',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: 'A Monster Calls',
      author: 'Patrick Ness',
      isbn: '978-0763660659',
      publisher: 'Candlewick Press',
      publication_year: 2013,
      category: 'Emotional Fiction',
      language: 'English',
      edition: 'Illustrated Paperback',
      description: 'A breathtakingly poignant novel of grief, healing, and emotional honesty, where an ancient yew tree monster tells a young boy three stories to help him face reality.',
      cover_image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Emotional Fiction Pavilion',
      shelf: 'Shelf EF-11',
      rack: 'Rack 01',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: 'The Seven Husbands of Evelyn Hugo',
      author: 'Taylor Jenkins Reid',
      isbn: '978-1501161933',
      publisher: 'Atria Books',
      publication_year: 2017,
      category: 'Modern Novels',
      language: 'English',
      edition: 'International Edition',
      description: 'An enthralling, cinematic, and profoundly emotional portrait of an iconic Hollywood legend who unspools the truth behind her glamorous public life and her one genuine, enduring secret love.',
      cover_image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Modern Novels Chamber',
      shelf: 'Shelf MN-01',
      rack: 'Rack 01',
      total_copies: 4,
      available_copies: 3
    },
    {
      title: 'Wonder',
      author: 'R.J. Palacio',
      isbn: '978-0375869020',
      publisher: 'Knopf Books for Young Readers',
      publication_year: 2012,
      category: 'Modern Novels',
      language: 'English',
      edition: 'Collector Edition',
      description: 'A heartwarming, uplifting, and life-changing novel about kindness, bravery, and acceptance through the eyes of Auggie Pullman. Restores faith in human generosity.',
      cover_image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Modern Novels Chamber',
      shelf: 'Shelf MN-02',
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
      category: 'Modern Novels',
      language: 'English',
      edition: '1st Edition',
      description: 'A cozy, joyful, and masterfully wholesome novel about finding your chosen family in the most improbable setting. Radiates warmth, gentleness, humor, and unconditional acceptance.',
      cover_image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Modern Novels Chamber',
      shelf: 'Shelf MN-03',
      rack: 'Rack 03',
      total_copies: 3,
      available_copies: 2
    },
    {
      title: "Harry Potter and the Sorcerer's Stone",
      author: 'J.K. Rowling',
      isbn: '978-0590353427',
      publisher: 'Scholastic',
      publication_year: 1998,
      category: 'Modern Novels',
      language: 'English',
      edition: 'Special Edition',
      description: 'The beloved modern fantasy novel that began the legendary saga of Hogwarts School of Witchcraft and Wizardry, friendship, bravery, and destiny.',
      cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Modern Novels Chamber',
      shelf: 'Shelf MN-04',
      rack: 'Rack 02',
      total_copies: 4,
      available_copies: 4
    },
    {
      title: 'The Night Circus',
      author: 'Erin Morgenstern',
      isbn: '978-0307744432',
      publisher: 'Anchor',
      publication_year: 2012,
      category: 'Modern Novels',
      language: 'English',
      edition: 'First Edition',
      description: 'An enchanting, atmospheric novel about Le Cirque des Rêves, a mysterious nocturnal circus that arrives without warning and becomes the stage for a duel between two young illusionists.',
      cover_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Modern Novels Chamber',
      shelf: 'Shelf MN-05',
      rack: 'Rack 04',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: 'The Song of Achilles',
      author: 'Madeline Miller',
      isbn: '978-0062060624',
      publisher: 'Ecco',
      publication_year: 2012,
      category: 'Modern Novels',
      language: 'English',
      edition: 'Orange Prize Winner',
      description: 'A breathtaking retelling of the Trojan War and the tender, legendary bond between Patroclus and the golden hero Achilles.',
      cover_image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Modern Novels Chamber',
      shelf: 'Shelf MN-06',
      rack: 'Rack 03',
      total_copies: 3,
      available_copies: 3
    },
    {
      title: 'Klara and the Sun',
      author: 'Kazuo Ishiguro',
      isbn: '978-0593318171',
      publisher: 'Knopf',
      publication_year: 2021,
      category: 'Modern Novels',
      language: 'English',
      edition: '1st Edition',
      description: 'A magnificent, deeply moving novel examining what it means to love, through the eyes of Klara, an Artificial Friend with extraordinary observation and gentle devotion.',
      cover_image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
      floor: 'Floor 2',
      section: 'Modern Novels Chamber',
      shelf: 'Shelf MN-07',
      rack: 'Rack 01',
      total_copies: 3,
      available_copies: 3
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
      let copyStatus = 'available';
      if (b.title === '1984') {
        // All borrowed to test waiting queues
        copyStatus = 'borrowed';
      } else if (b.title === 'The Alchemist' && c === 1) {
        copyStatus = 'borrowed';
      } else if (b.title === 'The Power of Now: A Guide to Spiritual Enlightenment' && c === 1) {
        copyStatus = 'borrowed';
      } else if (b.title === 'The Midnight Library' && c === 1) {
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

  const now = new Date();
  const due7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

  // Aarav has 1 active loan: The Alchemist
  const alchemistBook = createdBooks.find(b => b.title.includes('The Alchemist'));
  if (alchemistBook) {
    const alchemistCopy = db.prepare('SELECT id FROM book_copies WHERE book_id = ? AND status = ?').get(alchemistBook.id, 'borrowed');
    if (alchemistCopy) {
      insertLoan.run(
        alchemistBook.id, alchemistCopy.id, student1Id,
        now.toISOString(), due7Days, null, 'active', 0, 0.0, 0
      );
    }
  }

  // Elena has 1 active loan: The Power of Now
  const powerOfNowBook = createdBooks.find(b => b.title.includes('The Power of Now'));
  if (powerOfNowBook) {
    const powerCopy = db.prepare('SELECT id FROM book_copies WHERE book_id = ? AND status = ?').get(powerOfNowBook.id, 'borrowed');
    if (powerCopy) {
      insertLoan.run(
        powerOfNowBook.id, powerCopy.id, student2Id,
        now.toISOString(), due7Days, null, 'active', 0, 0.0, 0
      );
    }
  }

  // Past loan: The Little Prince returned last month
  const princeBook = createdBooks.find(b => b.title.includes('The Little Prince'));
  if (princeBook) {
    const princeCopies = db.prepare('SELECT id FROM book_copies WHERE book_id = ?').all(princeBook.id);
    if (princeCopies.length > 0) {
      const pastBorrow = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const pastDue = new Date(now.getTime() - 16 * 24 * 60 * 60 * 1000).toISOString();
      const pastReturn = new Date(now.getTime() - 17 * 24 * 60 * 60 * 1000).toISOString();
      insertLoan.run(
        princeBook.id, princeCopies[0].id, student1Id,
        pastBorrow, pastDue, pastReturn, 'returned', 0, 0.0, 1
      );
    }
  }

  // 4. Insert Reservations
  // Aarav reserved '1984' which has 0 available copies
  const book1984 = createdBooks.find(b => b.title === '1984');
  if (book1984) {
    const insertRes = db.prepare(`
      INSERT INTO reservations (book_id, user_id, reservation_date, status, queue_position)
      VALUES (?, ?, CURRENT_TIMESTAMP, 'waiting', 1)
    `);
    insertRes.run(book1984.id, student1Id);
  }

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
    'Welcome to LibraMind Literary & Spiritual Sanctuary',
    'Explore our curated collection of timeless novels and spiritual wisdom masterworks.',
    'announcement',
    '/catalog',
    0
  );

  insertNotif.run(
    student1Id,
    'Book Loan Confirmed',
    'You borrowed "The Alchemist". Due on ' + new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString() + '.',
    'borrow',
    '/dashboard',
    0
  );

  insertNotif.run(
    student1Id,
    'Waiting List Position #1',
    'You are in position 1 for "1984" by George Orwell. We will notify you as soon as a copy is returned.',
    'reservation',
    '/dashboard',
    1
  );

  // 7. Insert Wishlist
  const insertWish = db.prepare(`
    INSERT INTO wishlist (user_id, book_id) VALUES (?, ?)
  `);
  if (powerOfNowBook) {
    insertWish.run(student1Id, powerOfNowBook.id);
  }

  // 8. Insert Audit Logs
  const insertAudit = db.prepare(`
    INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)
  `);
  insertAudit.run(adminId, 'SYSTEM_INITIALIZATION', 'System initialized with pure Novels & Spiritual Books catalog.');
  insertAudit.run(librarianId, 'BOOK_CHECKOUT', 'Issued The Alchemist to member STU-1001.');

  console.log(`LibraMind database seeded successfully with ${createdBooks.length} Novels & Spiritual books!`);
}

seed().catch(err => {
  console.error('Seeding error:', err);
});
