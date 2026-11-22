const fs = require('fs');
const path = require('path');
const db = require('./db/database');

const booksToAdd = [
  {
    num: 1,
    hindiTitle: 'श्रीमद्भगवद्गीता',
    englishTitle: 'The Bhagavad Gita',
    fullTitle: 'The Bhagavad Gita: Walk the Path of Inner Peace (श्रीमद्भगवद्गीता)',
    author: 'महर्षि वेदव्यास / Eknath Easwaran',
    existingId: 1
  },
  {
    num: 2,
    hindiTitle: 'रामचरितमानस',
    englishTitle: 'Ramcharitmanas',
    fullTitle: 'रामचरितमानस (Ramcharitmanas)',
    author: 'गोस्वामी तुलसीदास (Goswami Tulsidas)',
    category: 'Spiritual & Wisdom',
    language: 'Awadhi / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1576,
    edition: 'Archival Sacred Edition',
    description: 'The monumental Awadhi epic poem composed by Goswami Tulsidas, narrating the sublime life, ideals, and dharma of Lord Rama through seven divine Kandas.',
    isbn: '978-81-293-0002-1',
    shelf: 'Shelf ST-01',
    rack: 'Rack 01',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 3,
    hindiTitle: 'शिव पुराण',
    englishTitle: 'Shiva Purana',
    fullTitle: 'शिव पुराण (Shiva Purana)',
    author: 'महर्षि वेदव्यास (Maharshi Ved Vyasa)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1954,
    edition: 'Sanskrit-Hindi Translation',
    description: 'One of the eighteen principal Mahapuranas, glorifying Lord Shiva, cosmic dissolution, divine grace, sacred geography, and the path of inner stillness.',
    isbn: '978-81-293-0003-8',
    shelf: 'Shelf ST-01',
    rack: 'Rack 02',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 4,
    hindiTitle: 'विष्णु पुराण',
    englishTitle: 'Vishnu Purana',
    fullTitle: 'विष्णु पुराण (Vishnu Purana)',
    author: 'महर्षि पराशर (Maharshi Parashara)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1956,
    edition: 'Complete Six Amsas',
    description: 'A foundational Vaishnava Purana presented as a dialogue between Sage Parashara and Maitreya, expounding cosmology, the avatars of Vishnu, and universal dharma.',
    isbn: '978-81-293-0004-5',
    shelf: 'Shelf ST-01',
    rack: 'Rack 03',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 5,
    hindiTitle: 'श्रीमद्भागवत महापुराण',
    englishTitle: 'Shrimad Bhagavata Mahapurana',
    fullTitle: 'श्रीमद्भागवत महापुराण (Shrimad Bhagavata Mahapurana)',
    author: 'महर्षि वेदव्यास (Maharshi Ved Vyasa)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1958,
    edition: '12 Skandhas Complete',
    description: 'Revered as the cream of Vedic literature, this Mahapurana illuminates supreme devotion (Prema Bhakti) and the divine play (Lila) of Lord Krishna.',
    isbn: '978-81-293-0005-2',
    shelf: 'Shelf ST-01',
    rack: 'Rack 04',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 6,
    hindiTitle: 'गरुड़ पुराण',
    englishTitle: 'Garuda Purana',
    fullTitle: 'गरुड़ पुराण (Garuda Purana)',
    author: 'महर्षि वेदव्यास (Maharshi Ved Vyasa)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1960,
    edition: 'Saroddhara Edition',
    description: 'A profound dialogue between Lord Vishnu and his celestial vehicle Garuda detailing the law of karma, life after death, the soul’s journey, and liberation (Moksha).',
    isbn: '978-81-293-0006-9',
    shelf: 'Shelf ST-01',
    rack: 'Rack 05',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 7,
    hindiTitle: 'दुर्गा सप्तशती',
    englishTitle: 'Durga Saptashati',
    fullTitle: 'दुर्गा सप्तशती (Durga Saptashati)',
    author: 'महर्षि मार्कंडेय (Maharshi Markandeya)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1962,
    edition: 'Devi Mahatmya 700 Verses',
    description: 'The 700-verse sacred hymn from Markandeya Purana celebrating the supreme divine Mother (Maha Devi) and the triumph of divine truth over dark egoistic forces.',
    isbn: '978-81-293-0007-6',
    shelf: 'Shelf ST-02',
    rack: 'Rack 01',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 8,
    hindiTitle: 'देवी भागवत पुराण',
    englishTitle: 'Devi Bhagavata Purana',
    fullTitle: 'देवी भागवत पुराण (Devi Bhagavata Purana)',
    author: 'महर्षि वेदव्यास (Maharshi Ved Vyasa)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Chaukhamba Sanskrit Pratishthan',
    publication_year: 1965,
    edition: '12 Skandhas Sanskrit-Hindi',
    description: 'The paramount Shakta scripture glorifying Adi Parashakti as the primordial origin, sustainer, and dissolver of the cosmic multiverse.',
    isbn: '978-81-293-0008-3',
    shelf: 'Shelf ST-02',
    rack: 'Rack 02',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 9,
    hindiTitle: 'नारद पुराण',
    englishTitle: 'Narada Purana',
    fullTitle: 'नारद पुराण (Narada Purana)',
    author: 'देवर्षि नारद (Devarshi Narada)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Nag Publishers',
    publication_year: 1968,
    edition: 'Purva & Uttara Bhaga',
    description: 'Imparted by Devarshi Narada to Sanatkumara, this Mahapurana summarizes the Vedic lore, six Vedangas, sacred astronomical cycles, and holy pilgrimage circuits.',
    isbn: '978-81-293-0009-0',
    shelf: 'Shelf ST-02',
    rack: 'Rack 03',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 10,
    hindiTitle: 'पद्म पुराण',
    englishTitle: 'Padma Purana',
    fullTitle: 'पद्म पुराण (Padma Purana)',
    author: 'महर्षि वेदव्यास (Maharshi Ved Vyasa)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1970,
    edition: '5 Major Khandas',
    description: 'One of the most extensive Puranas named after the cosmic lotus, presenting the Srishti, Bhumi, Svarga, Patala, and Uttara Khandas of ancient heritage.',
    isbn: '978-81-293-0010-6',
    shelf: 'Shelf ST-02',
    rack: 'Rack 04',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 11,
    hindiTitle: 'अग्नि पुराण',
    englishTitle: 'Agni Purana',
    fullTitle: 'अग्नि पुराण (Agni Purana)',
    author: 'महर्षि वेदव्यास (Maharshi Ved Vyasa)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Motilal Banarsidass',
    publication_year: 1972,
    edition: 'Encyclopedic Classical Translation',
    description: 'Spoken directly by Agni Deva, this encyclopedic Purana encompasses spiritual metaphysics, Ayurveda, governance, grammar, temple architecture, and weaponry.',
    isbn: '978-81-293-0011-3',
    shelf: 'Shelf ST-02',
    rack: 'Rack 05',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 12,
    hindiTitle: 'स्कंद पुराण',
    englishTitle: 'Skanda Purana',
    fullTitle: 'स्कंद पुराण (Skanda Purana)',
    author: 'महर्षि वेदव्यास (Maharshi Ved Vyasa)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1975,
    edition: 'Seven Khandas Edition',
    description: 'The largest of the 18 Mahapuranas dedicated to Lord Kartikeya (Skanda), containing legendary spiritual treatises like the Kashi Khanda and Utkala Khanda.',
    isbn: '978-81-293-0012-0',
    shelf: 'Shelf ST-03',
    rack: 'Rack 01',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 13,
    hindiTitle: 'ब्रह्म पुराण',
    englishTitle: 'Brahma Purana',
    fullTitle: 'ब्रह्म पुराण (Brahma Purana)',
    author: 'महर्षि वेदव्यास (Maharshi Ved Vyasa)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Nag Publishers',
    publication_year: 1978,
    edition: 'Adi Purana Edition',
    description: 'Known as the Adi Purana (the First Purana), it describes cosmic creation, universal genealogies, solar dynasties, and pilgrimage to sacred coastal temples.',
    isbn: '978-81-293-0013-7',
    shelf: 'Shelf ST-03',
    rack: 'Rack 02',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 14,
    hindiTitle: 'ब्रह्मवैवर्त पुराण',
    englishTitle: 'Brahmavaivarta Purana',
    fullTitle: 'ब्रह्मवैवर्त पुराण (Brahmavaivarta Purana)',
    author: 'महर्षि वेदव्यास (Maharshi Ved Vyasa)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1980,
    edition: 'Brahma, Prakriti, Ganesha, Krishna Khandas',
    description: 'Celebrates the transcendent glory of Radha-Krishna and the spiritual power of Prakriti, detailing celestial creation through four great thematic Khandas.',
    isbn: '978-81-293-0014-4',
    shelf: 'Shelf ST-03',
    rack: 'Rack 03',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 15,
    hindiTitle: 'मार्कंडेय पुराण',
    englishTitle: 'Markandeya Purana',
    fullTitle: 'मार्कंडेय पुराण (Markandeya Purana)',
    author: 'महर्षि मार्कंडेय (Maharshi Markandeya)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Motilal Banarsidass',
    publication_year: 1982,
    edition: 'Complete Canonical Translation',
    description: 'One of the oldest Puranas structured as responses by wise celestial birds to Sage Jaimini, enshrining the timeless Devi Mahatmya within its chapters.',
    isbn: '978-81-293-0015-1',
    shelf: 'Shelf ST-03',
    rack: 'Rack 04',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 16,
    hindiTitle: 'मत्स्य पुराण',
    englishTitle: 'Matsya Purana',
    fullTitle: 'मत्स्य पुराण (Matsya Purana)',
    author: 'महर्षि वेदव्यास (Maharshi Ved Vyasa)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1984,
    edition: 'Pauranic Standard Edition',
    description: 'Narrates Lord Vishnu’s fish avatar Matsya rescuing King Manu and sacred biodiversity during the cosmic deluge, teaching timeless spiritual truths.',
    isbn: '978-81-293-0016-8',
    shelf: 'Shelf ST-03',
    rack: 'Rack 05',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 17,
    hindiTitle: 'वामन पुराण',
    englishTitle: 'Vamana Purana',
    fullTitle: 'वामन पुराण (Vamana Purana)',
    author: 'महर्षि वेदव्यास (Maharshi Ved Vyasa)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'All-India Kashiraj Trust',
    publication_year: 1986,
    edition: 'Critical Sanskrit-Hindi Edition',
    description: 'Chronicles the Vamana avatar of Vishnu measuring the universe in three strides, expounding the deeper philosophy of humility, sacrifice, and dharma.',
    isbn: '978-81-293-0017-5',
    shelf: 'Shelf ST-04',
    rack: 'Rack 01',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 18,
    hindiTitle: 'कूर्म पुराण',
    englishTitle: 'Kurma Purana',
    fullTitle: 'कूर्म पुराण (Kurma Purana)',
    author: 'महर्षि वेदव्यास (Maharshi Ved Vyasa)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Nag Publishers',
    publication_year: 1988,
    edition: 'Including Ishvara Gita',
    description: 'Delivered by Vishnu in the form of the divine tortoise Kurma during the ocean churning, containing the celebrated Ishvara Gita on Jnana and Bhakti.',
    isbn: '978-81-293-0018-2',
    shelf: 'Shelf ST-04',
    rack: 'Rack 02',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 19,
    hindiTitle: 'लिंग पुराण',
    englishTitle: 'Linga Purana',
    fullTitle: 'लिंग पुराण (Linga Purana)',
    author: 'महर्षि वेदव्यास (Maharshi Ved Vyasa)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Motilal Banarsidass',
    publication_year: 1990,
    edition: 'Two Parts Complete',
    description: 'Explores the formless cosmic column of light (Shiva Linga) as the source of all manifestation, offering detailed instructions in yogic dhyana.',
    isbn: '978-81-293-0019-9',
    shelf: 'Shelf ST-04',
    rack: 'Rack 03',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 20,
    hindiTitle: 'वराह पुराण',
    englishTitle: 'Varaha Purana',
    fullTitle: 'वराह पुराण (Varaha Purana)',
    author: 'महर्षि वेदव्यास (Maharshi Ved Vyasa)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1992,
    edition: 'Standard Translation',
    description: 'Lord Varaha imparts wisdom to Mother Earth after lifting her from the cosmic waters, explaining rituals, ethical living, and devotion.',
    isbn: '978-81-293-0020-5',
    shelf: 'Shelf ST-04',
    rack: 'Rack 04',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 21,
    hindiTitle: 'नारद भक्ति सूत्र',
    englishTitle: 'Narada Bhakti Sutra',
    fullTitle: 'नारद भक्ति सूत्र (Narada Bhakti Sutra)',
    author: 'देवर्षि नारद (Devarshi Narada)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Ramakrishna Math',
    publication_year: 1950,
    edition: '84 Aphorisms with Commentary',
    description: 'Eighty-four immortal sutras defining the essence of divine love, selfless devotion (Para Bhakti), and surrender to the Supreme Truth.',
    isbn: '978-81-293-0021-2',
    shelf: 'Shelf ST-04',
    rack: 'Rack 05',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 22,
    hindiTitle: 'पतंजलि योग सूत्र',
    englishTitle: 'Patanjali Yoga Sutra',
    fullTitle: 'पतंजलि योग सूत्र (Patanjali Yoga Sutra)',
    author: 'महर्षि पतंजलि (Maharshi Patanjali)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1960,
    edition: 'Four Padas with Vyasa Bhashya',
    description: 'The foundational classic of Raja Yoga, presenting 196 sutras on mastering the mind, ethical disciplines, meditation, and Samadhi.',
    isbn: '978-81-293-0022-9',
    shelf: 'Shelf ST-05',
    rack: 'Rack 01',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 23,
    hindiTitle: 'अष्टावक्र गीता',
    englishTitle: 'Ashtavakra Gita',
    fullTitle: 'अष्टावक्र गीता (Ashtavakra Gita)',
    author: 'ऋषि अष्टावक्र (Rishi Ashtavakra)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Advaita Ashrama',
    publication_year: 1965,
    edition: 'Classic Non-Dual Translation',
    description: 'An uncompromising masterpiece of pure Advaita Vedanta where Sage Ashtavakra awakens King Janaka to immediate, unconditional Self-realization.',
    isbn: '978-81-293-0023-6',
    shelf: 'Shelf ST-05',
    rack: 'Rack 02',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 24,
    hindiTitle: 'राम गीता',
    englishTitle: 'Rama Gita',
    fullTitle: 'राम गीता (Rama Gita)',
    author: 'महर्षि वाल्मीकि (Maharshi Valmiki)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Ramakrishna Math',
    publication_year: 1970,
    edition: 'Adhyatma Ramayana Excerpt',
    description: 'Lord Rama’s radiant philosophical teachings to Lakshmana from the Uttara Kanda of Adhyatma Ramayana, illuminating the nature of Brahman.',
    isbn: '978-81-293-0024-3',
    shelf: 'Shelf ST-05',
    rack: 'Rack 03',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 25,
    hindiTitle: 'अवधूत गीता',
    englishTitle: 'Avadhuta Gita',
    fullTitle: 'अवधूत गीता (Avadhuta Gita)',
    author: 'भगवान दत्तात्रेय (Lord Dattatreya)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Ramakrishna Math',
    publication_year: 1972,
    edition: 'Seven Chapters Non-Dual Song',
    description: 'The ecstatic hymn of absolute freedom sung by Sage Dattatreya, celebrating the transcendental truth that all is the non-dual Self.',
    isbn: '978-81-293-0025-0',
    shelf: 'Shelf ST-05',
    rack: 'Rack 04',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 26,
    hindiTitle: 'ईशावास्य उपनिषद',
    englishTitle: 'Ishavasya Upanishad',
    fullTitle: 'ईशावास्य उपनिषद (Ishavasya Upanishad)',
    author: 'शुक्ल यजुर्वेद (Shukla Yajurveda)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1955,
    edition: 'With Shankara Bhashya',
    description: 'The sublime opening principal Upanishad establishing that the entire universe is enveloped by the Divine, guiding humanity to live with detachment.',
    isbn: '978-81-293-0026-7',
    shelf: 'Shelf ST-05',
    rack: 'Rack 05',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 27,
    hindiTitle: 'कठोपनिषद',
    englishTitle: 'Katha Upanishad',
    fullTitle: 'कठोपनिषद (Katha Upanishad)',
    author: 'कृष्ण यजुर्वेद (Krishna Yajurveda)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1957,
    edition: 'Dialogues of Nachiketa & Yama',
    description: 'The timeless dialogue between the young seeker Nachiketa and Yama (Lord of Death), revealing the immortal nature of the soul (Atman).',
    isbn: '978-81-293-0027-4',
    shelf: 'Shelf ST-06',
    rack: 'Rack 01',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 28,
    hindiTitle: 'केन उपनिषद',
    englishTitle: 'Kena Upanishad',
    fullTitle: 'केन उपनिषद (Kena Upanishad)',
    author: 'सामवेद (Samaveda)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1958,
    edition: 'Sanskrit-Hindi Exposition',
    description: 'Probes the ultimate source behind sight, speech, and mind, revealing the supreme Brahman beyond the reach of senses and intellect.',
    isbn: '978-81-293-0028-1',
    shelf: 'Shelf ST-06',
    rack: 'Rack 02',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 29,
    hindiTitle: 'मुण्डक उपनिषद',
    englishTitle: 'Mundaka Upanishad',
    fullTitle: 'मुण्डक उपनिषद (Mundaka Upanishad)',
    author: 'अथर्ववेद (Atharvaveda)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1961,
    edition: 'Para & Apara Vidya Discourse',
    description: 'Source of the national motto "Satyameva Jayate", distinguishing higher spiritual knowledge (Para Vidya) from temporary rituals.',
    isbn: '978-81-293-0029-8',
    shelf: 'Shelf ST-06',
    rack: 'Rack 03',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 30,
    hindiTitle: 'मांडूक्य उपनिषद',
    englishTitle: 'Mandukya Upanishad',
    fullTitle: 'मांडूक्य उपनिषद (Mandukya Upanishad)',
    author: 'अथर्ववेद (Atharvaveda)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Advaita Ashrama',
    publication_year: 1963,
    edition: 'With Gaudapada Karika',
    description: 'The concise 12-verse Upanishad mapping human consciousness across waking, dreaming, deep sleep, and the fourth transcendent state (Turiya) through OM.',
    isbn: '978-81-293-0030-4',
    shelf: 'Shelf ST-06',
    rack: 'Rack 04',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 31,
    hindiTitle: 'प्रश्न उपनिषद',
    englishTitle: 'Prashna Upanishad',
    fullTitle: 'प्रश्न उपनिषद (Prashna Upanishad)',
    author: 'अथर्ववेद / पिप्पलाद ऋषि (Sage Pippalada)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1966,
    edition: 'Six Inquiries on Life and Prana',
    description: 'Six spiritual seekers pose six profound existential questions to Sage Pippalada concerning Prana, creation, consciousness, and the Purusha.',
    isbn: '978-81-293-0031-1',
    shelf: 'Shelf ST-06',
    rack: 'Rack 05',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 32,
    hindiTitle: 'तैत्तिरीय उपनिषद',
    englishTitle: 'Taittiriya Upanishad',
    fullTitle: 'तैत्तिरीय उपनिषद (Taittiriya Upanishad)',
    author: 'कृष्ण यजुर्वेद (Krishna Yajurveda)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Ramakrishna Math',
    publication_year: 1968,
    edition: 'Shiksha, Ananda, Bhrigu Valli',
    description: 'Celebrated for its moral guidance ("Satyam Vada, Dharmam Chara") and the profound doctrine of the Five Sheaths (Pancha Kosha) of human existence.',
    isbn: '978-81-293-0032-8',
    shelf: 'Shelf ST-07',
    rack: 'Rack 01',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 33,
    hindiTitle: 'छांदोग्य उपनिषद',
    englishTitle: 'Chandogya Upanishad',
    fullTitle: 'छांदोग्य उपनिषद (Chandogya Upanishad)',
    author: 'सामवेद (Samaveda)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1971,
    edition: 'Eight Prapathakas Complete',
    description: 'One of the oldest and largest Upanishads containing the great Mahavakya "Tat Tvam Asi" (That Thou Art), imparted by Sage Uddalaka to Shvetaketu.',
    isbn: '978-81-293-0033-5',
    shelf: 'Shelf ST-07',
    rack: 'Rack 02',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 34,
    hindiTitle: 'बृहदारण्यक उपनिषद',
    englishTitle: 'Brihadaranyaka Upanishad',
    fullTitle: 'बृहदारण्यक उपनिषद (Brihadaranyaka Upanishad)',
    author: 'शुक्ल यजुर्वेद / याज्ञवल्क्य (Sage Yajnavalkya)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Advaita Ashrama',
    publication_year: 1974,
    edition: 'Dialogues with Gargi & Maitreyi',
    description: 'The monumental "Great Forest Upanishad", birthplace of the universal prayer "Asato Ma Sadgamaya", featuring the debates of Sage Yajnavalkya.',
    isbn: '978-81-293-0034-2',
    shelf: 'Shelf ST-07',
    rack: 'Rack 03',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 35,
    hindiTitle: 'श्वेताश्वतर उपनिषद',
    englishTitle: 'Shvetashvatara Upanishad',
    fullTitle: 'श्वेताश्वतर उपनिषद (Shvetashvatara Upanishad)',
    author: 'कृष्ण यजुर्वेद (Krishna Yajurveda)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Ramakrishna Math',
    publication_year: 1976,
    edition: 'Six Chapters with Commentary',
    description: 'Synthesizes Vedanta, Sankhya, and Yoga with deep devotional theism, praising the supreme Lord (Rudra) as the inner Self of all living beings.',
    isbn: '978-81-293-0035-9',
    shelf: 'Shelf ST-07',
    rack: 'Rack 04',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 36,
    hindiTitle: 'योग वशिष्ठ',
    englishTitle: 'Yoga Vasistha',
    fullTitle: 'योग वशिष्ठ (Yoga Vasistha)',
    author: 'महर्षि वाल्मीकि (Maharshi Valmiki)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1979,
    edition: 'Six Prakaranas Sanskrit-Hindi',
    description: 'A masterpiece of spiritual philosophy where Sage Vasistha instructs young Prince Rama on the illusory nature of worldly sorrow and the path of non-attachment.',
    isbn: '978-81-293-0036-6',
    shelf: 'Shelf ST-07',
    rack: 'Rack 05',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 37,
    hindiTitle: 'विवेकचूडामणि',
    englishTitle: 'Vivekachudamani',
    fullTitle: 'विवेकचूडामणि (Vivekachudamani)',
    author: 'आदि शंकराचार्य (Adi Shankaracharya)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Advaita Ashrama',
    publication_year: 1952,
    edition: 'Crest-Jewel of Discrimination',
    description: 'Adi Shankaracharya’s crowning exposition on Advaita Vedanta, systematically distinguishing between the transient worldly illusion and the immortal Atman.',
    isbn: '978-81-293-0037-3',
    shelf: 'Shelf ST-08',
    rack: 'Rack 01',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 38,
    hindiTitle: 'भज गोविंदम्',
    englishTitle: 'Bhaja Govindam',
    fullTitle: 'भज गोविंदम् (Bhaja Govindam)',
    author: 'आदि शंकराचार्य (Adi Shankaracharya)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Chinmaya Mission',
    publication_year: 1964,
    edition: '31 Lyrical Verses',
    description: 'A sharp, poetic warning composed by Adi Shankara urging seekers to recognize the futility of worldly delusions and seek refuge in the supreme divine.',
    isbn: '978-81-293-0038-0',
    shelf: 'Shelf ST-08',
    rack: 'Rack 02',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 39,
    hindiTitle: 'आत्मबोध',
    englishTitle: 'Atmabodha',
    fullTitle: 'आत्मबोध (Atmabodha: Self-Knowledge)',
    author: 'आदि शंकराचार्य (Adi Shankaracharya)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Ramakrishna Math',
    publication_year: 1967,
    edition: '68 Verses on Self-Realization',
    description: 'A luminous short treatise in 68 verses illustrating how spiritual knowledge instantly dispels cosmic ignorance, like dawn dispels the darkest night.',
    isbn: '978-81-293-0039-7',
    shelf: 'Shelf ST-08',
    rack: 'Rack 03',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 40,
    hindiTitle: 'कबीर के दोहे',
    englishTitle: 'Kabir Ke Dohe',
    fullTitle: 'कबीर के दोहे (Kabir Ke Dohe)',
    author: 'संत कबीर दास (Sant Kabir Das)',
    category: 'Spiritual & Wisdom',
    language: 'Hindi / Braj',
    publisher: 'Lokbharti Prakashan',
    publication_year: 1973,
    edition: 'Comprehensive Collection with Explanations',
    description: 'Immortal couplets of Sant Kabir that challenge dogmatism, emphasize inner truth, loving kindness, humility, and the presence of God in all hearts.',
    isbn: '978-81-293-0040-3',
    shelf: 'Shelf ST-08',
    rack: 'Rack 04',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 41,
    hindiTitle: 'कबीर बीजक',
    englishTitle: 'Kabir Bijak',
    fullTitle: 'कबीर बीजक (Kabir Bijak)',
    author: 'संत कबीर दास (Sant Kabir Das)',
    category: 'Spiritual & Wisdom',
    language: 'Hindi / Sadhu Bhasha',
    publisher: 'Varanasi Kabir Math',
    publication_year: 1975,
    edition: 'Original Bijak Commentary',
    description: 'The definitive sacred scripture of Kabir’s followers containing Ramainis, Shabdas, and Sakhis directly imparting mystical wisdom.',
    isbn: '978-81-293-0041-0',
    shelf: 'Shelf ST-08',
    rack: 'Rack 05',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 42,
    hindiTitle: 'विनय पत्रिका',
    englishTitle: 'Vinaya Patrika',
    fullTitle: 'विनय पत्रिका (Vinaya Patrika)',
    author: 'गोस्वामी तुलसीदास (Goswami Tulsidas)',
    category: 'Spiritual & Wisdom',
    language: 'Braj Bhasha / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1609,
    edition: '279 Devotional Stanzas',
    description: 'A poetic petition submitted to the court of Lord Rama by Tulsidas, expressing absolute humility, yearning for grace, and steadfast devotion.',
    isbn: '978-81-293-0042-7',
    shelf: 'Shelf ST-09',
    rack: 'Rack 01',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 43,
    hindiTitle: 'हनुमान चालीसा',
    englishTitle: 'Hanuman Chalisa',
    fullTitle: 'हनुमान चालीसा (Hanuman Chalisa)',
    author: 'गोस्वामी तुलसीदास (Goswami Tulsidas)',
    category: 'Spiritual & Wisdom',
    language: 'Awadhi / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1575,
    edition: 'Standard Devotional Edition',
    description: 'Forty verses of supreme praise honoring Lord Hanuman’s valor, wisdom, devotion, and protective power, chanted by millions worldwide for courage.',
    isbn: '978-81-293-0043-4',
    shelf: 'Shelf ST-09',
    rack: 'Rack 02',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 44,
    hindiTitle: 'सुंदरकांड',
    englishTitle: 'Sundarkand',
    fullTitle: 'सुंदरकांड (Sundarkand)',
    author: 'गोस्वामी तुलसीदास (Goswami Tulsidas)',
    category: 'Spiritual & Wisdom',
    language: 'Awadhi / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1576,
    edition: 'Ramcharitmanas Fifth Canto',
    description: 'The golden chapter of Ramcharitmanas celebrating Hanuman’s mission to Lanka, embodying faith, intellect, courage, and selfless service.',
    isbn: '978-81-293-0044-1',
    shelf: 'Shelf ST-09',
    rack: 'Rack 03',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 45,
    hindiTitle: 'हनुमान बाहुक',
    englishTitle: 'Hanuman Bahuk',
    fullTitle: 'हनुमान बाहुक (Hanuman Bahuk)',
    author: 'गोस्वामी तुलसीदास (Goswami Tulsidas)',
    category: 'Spiritual & Wisdom',
    language: 'Braj Bhasha / Awadhi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1612,
    edition: '44 Healing Verses',
    description: 'Composed by Tulsidas in his old age while suffering from acute physical pain, praying to Hanuman for physical healing, peace, and spiritual fortitude.',
    isbn: '978-81-293-0045-8',
    shelf: 'Shelf ST-09',
    rack: 'Rack 04',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 46,
    hindiTitle: 'आदित्य हृदय स्तोत्र',
    englishTitle: 'Aditya Hridaya Stotra',
    fullTitle: 'आदित्य हृदय स्तोत्र (Aditya Hridaya Stotra)',
    author: 'अगस्त्य मुनि / महर्षि वाल्मीकि (Sage Agastya)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1968,
    edition: 'Valmiki Ramayana Yuddha Kanda',
    description: 'The sacred solar hymn imparted by Sage Agastya to Lord Rama on the battlefield, invoking the Sun God (Surya) for victory over negative forces.',
    isbn: '978-81-293-0046-5',
    shelf: 'Shelf ST-09',
    rack: 'Rack 05',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 47,
    hindiTitle: 'विष्णु सहस्रनाम',
    englishTitle: 'Vishnu Sahasranama',
    fullTitle: 'विष्णु सहस्रनाम (Vishnu Sahasranama)',
    author: 'भीष्म पितामह / महर्षि वेदव्यास (Bhishma)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1965,
    edition: 'With Adi Shankara Commentary',
    description: 'The thousand divine names of Vishnu recited by Bhishma Pitamah from his bed of arrows to King Yudhishthira in the Mahabharata.',
    isbn: '978-81-293-0047-2',
    shelf: 'Shelf ST-10',
    rack: 'Rack 01',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 48,
    hindiTitle: 'ललिता सहस्रनाम',
    englishTitle: 'Lalita Sahasranama',
    fullTitle: 'ललिता सहस्रनाम (Lalita Sahasranama)',
    author: 'ब्रह्मांड पुराण (Brahmanda Purana)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Ramakrishna Math',
    publication_year: 1970,
    edition: 'With Bhaskararaya Commentary',
    description: 'One thousand sacred names of Goddess Lalita Tripurasundari from the Brahmanda Purana, describing the awakening of Kundalini and non-dual consciousness.',
    isbn: '978-81-293-0048-9',
    shelf: 'Shelf ST-10',
    rack: 'Rack 02',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 49,
    hindiTitle: 'शिव तांडव स्तोत्र',
    englishTitle: 'Shiva Tandava Stotra',
    fullTitle: 'शिव तांडव स्तोत्र (Shiva Tandava Stotra)',
    author: 'रावण (Lankesh Ravana)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1963,
    edition: 'Complete Rhythmic Stanzas',
    description: 'A masterpiece of Sanskrit alliteration and rhythm composed by Ravana praising the cosmic dance (Tandava) and compassionate majesty of Shiva.',
    isbn: '978-81-293-0049-6',
    shelf: 'Shelf ST-10',
    rack: 'Rack 03',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 50,
    hindiTitle: 'रुद्राष्टकम',
    englishTitle: 'Rudrashtakam',
    fullTitle: 'रुद्राष्टकम (Rudrashtakam)',
    author: 'गोस्वामी तुलसीदास (Goswami Tulsidas)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1576,
    edition: 'Ramcharitmanas Uttarkanda',
    description: 'An eight-stanza devotional Sanskrit hymn from Ramcharitmanas praising the infinite, auspicious, and peaceful nature of Lord Rudra-Shiva.',
    isbn: '978-81-293-0050-2',
    shelf: 'Shelf ST-10',
    rack: 'Rack 04',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 51,
    hindiTitle: 'दुर्गा चालीसा',
    englishTitle: 'Durga Chalisa',
    fullTitle: 'दुर्गा चालीसा (Durga Chalisa)',
    author: 'Traditional Devotional Hymn',
    category: 'Spiritual & Wisdom',
    language: 'Hindi / Awadhi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1950,
    edition: 'Standard Devotional Edition',
    description: 'Forty devotional verses honoring Goddess Durga’s divine mercy, grace, and courage, widely recited for family peace and spiritual prosperity.',
    isbn: '978-81-293-0051-9',
    shelf: 'Shelf ST-10',
    rack: 'Rack 05',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 52,
    hindiTitle: 'श्रीराम रक्षा स्तोत्र',
    englishTitle: 'Shri Rama Raksha Stotra',
    fullTitle: 'श्रीराम रक्षा स्तोत्र (Shri Rama Raksha Stotra)',
    author: 'ऋषि बुध कौशिक (Rishi Budha Kaushika)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1955,
    edition: 'Sacred Armor (Kavach) Edition',
    description: 'A powerful prayer of spiritual protection (Kavacha) composed by Sage Budha Kaushika in a dream, invoking Lord Rama for peace and health.',
    isbn: '978-81-293-0052-6',
    shelf: 'Shelf ST-11',
    rack: 'Rack 01',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 53,
    hindiTitle: 'गणेश अथर्वशीर्ष',
    englishTitle: 'Ganesha Atharvashirsha',
    fullTitle: 'गणेश अथर्वशीर्ष (Ganesha Atharvashirsha)',
    author: 'अथर्ववेद / गणक ऋषि (Ganaka Rishi)',
    category: 'Spiritual & Wisdom',
    language: 'Sanskrit / Hindi',
    publisher: 'Gita Press, Gorakhpur',
    publication_year: 1958,
    edition: 'Vedic Upanishad Text',
    description: 'A Vedic Upanishadic hymn identifying Lord Ganesha with the supreme cosmic Brahman, intellect, and the dispeller of all life obstacles.',
    isbn: '978-81-293-0053-3',
    shelf: 'Shelf ST-11',
    rack: 'Rack 02',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 54,
    hindiTitle: 'सुखमनी साहिब',
    englishTitle: 'Sukhmani Sahib',
    fullTitle: 'सुखमनी साहिब (Sukhmani Sahib: The Jewel of Peace)',
    author: 'गुरु अर्जुन देव जी (Guru Arjan Dev Ji)',
    category: 'Spiritual & Wisdom',
    language: 'Punjabi / Gurmukhi / Hindi',
    publisher: 'Shiromani Gurdwara Parbandhak Committee',
    publication_year: 1602,
    edition: 'Complete 24 Ashtpadis',
    description: 'The sublime composition of 24 Ashtpadis from Sri Guru Granth Sahib bringing supreme peace to the mind through contemplation and remembrance of the Divine.',
    isbn: '978-81-293-0054-0',
    shelf: 'Shelf ST-11',
    rack: 'Rack 03',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 55,
    hindiTitle: 'जपुजी साहिब',
    englishTitle: 'Japji Sahib',
    fullTitle: 'जपुजी साहिब (Japji Sahib)',
    author: 'गुरु नानक देव जी (Guru Nanak Dev Ji)',
    category: 'Spiritual & Wisdom',
    language: 'Punjabi / Gurmukhi / Hindi',
    publisher: 'Shiromani Gurdwara Parbandhak Committee',
    publication_year: 1530,
    edition: 'Opening Hymn of Guru Granth Sahib',
    description: 'The foundational spiritual hymn composed by Guru Nanak Dev Ji opening with Ik Onkar, delivering the universal path of truth and divine surrender.',
    isbn: '978-81-293-0055-7',
    shelf: 'Shelf ST-11',
    rack: 'Rack 04',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 56,
    hindiTitle: 'योगी कथामृत',
    englishTitle: 'Autobiography of a Yogi',
    fullTitle: 'Autobiography of a Yogi (योगी कथामृत)',
    author: 'परमहंस योगानन्द (Paramahansa Yogananda)',
    existingId: 4
  },
  {
    num: 57,
    hindiTitle: 'सत्यार्थ प्रकाश',
    englishTitle: 'Satyarth Prakash',
    fullTitle: 'सत्यार्थ प्रकाश (Satyarth Prakash: Light of Truth)',
    author: 'स्वामी दयानंद सरस्वती (Swami Dayanand Saraswati)',
    category: 'Spiritual & Wisdom',
    language: 'Hindi / Sanskrit',
    publisher: 'Arya Samaj Prakashan',
    publication_year: 1875,
    edition: 'Fourteen Samullasas Edition',
    description: 'The magnum opus of Swami Dayanand Saraswati, championing Vedic reform, rational enquiry, education, truth, and universal ethics.',
    isbn: '978-81-293-0057-1',
    shelf: 'Shelf ST-11',
    rack: 'Rack 05',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 58,
    hindiTitle: 'ज्ञानेश्वरी',
    englishTitle: 'Dnyaneshwari',
    fullTitle: 'ज्ञानेश्वरी (Dnyaneshwari: Bhavartha Deepika)',
    author: 'संत ज्ञानेश्वर (Sant Dnyaneshwar)',
    category: 'Spiritual & Wisdom',
    language: 'Marathi / Hindi',
    publisher: 'Gorakhpur / Government of Maharashtra',
    publication_year: 1290,
    edition: '18 Chapters with Ovis',
    description: 'A poetic commentary on the Bhagavad Gita composed by 16-year-old Sant Dnyaneshwar, renowned for its spiritual tenderness and universal compassion.',
    isbn: '978-81-293-0058-8',
    shelf: 'Shelf ST-12',
    rack: 'Rack 01',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 59,
    hindiTitle: 'प्रेम और ध्यान',
    englishTitle: 'Prem Aur Dhyan',
    fullTitle: 'प्रेम और ध्यान (Prem Aur Dhyan: Love and Meditation)',
    author: 'ओशो (Osho / Bhagwan Shree Rajneesh)',
    category: 'Spiritual & Wisdom',
    language: 'Hindi',
    publisher: 'Osho International Foundation',
    publication_year: 1982,
    edition: 'Discourse Series',
    description: 'Illuminating discourses by Osho on how love and meditation are the twin wings that allow human consciousness to take flight into spiritual stillness.',
    isbn: '978-81-293-0059-5',
    shelf: 'Shelf ST-12',
    rack: 'Rack 02',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  },
  {
    num: 60,
    hindiTitle: 'मृत्युंजय',
    englishTitle: 'Mrityunjaya',
    fullTitle: 'मृत्युंजय (Mrityunjaya: The Death Conqueror)',
    author: 'शिवाजी सावंत (Shivaji Sawant)',
    category: 'Indian Literature',
    language: 'Hindi / Marathi',
    publisher: 'Bharatiya Jnanpith',
    publication_year: 1967,
    edition: 'Classic Indian Novel Edition',
    description: 'The monumental Sahitya Akademi and Jnanpith acclaimed novel portraying the tragic nobility, unyielding generosity, and philosophical depth of Karna.',
    isbn: '978-81-293-0060-1',
    shelf: 'Shelf ST-12',
    rack: 'Rack 03',
    floor: 'Floor 1',
    section: 'Sacred Texts & Philosophy Gallery'
  }
];

function generateBookSvg(bookId, title, author, category) {
  const safeTitle = (title || 'Library Volume')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const safeAuthor = (author || 'Scholar')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const safeCat = (category || 'Spiritual & Wisdom')
    .toUpperCase()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Rich palettes suitable for sacred classical works
  const palettes = [
    { bg1: '#6B1724', bg2: '#3D0A14', gold: '#E5C158', accent: '#FFDF9E', border: '#D4AF37' }, // Deep Crimson
    { bg1: '#7A2E12', bg2: '#4A1807', gold: '#F4D06F', accent: '#FFF1D0', border: '#E07A5F' }, // Terracotta
    { bg1: '#14496B', bg2: '#0A2536', gold: '#FFD166', accent: '#E0FAFF', border: '#2A6F97' }, // Royal Blue
    { bg1: '#1F3328', bg2: '#122019', gold: '#E5C158', accent: '#D8F3DC', border: '#D4AF37' }, // Forest Green
    { bg1: '#5C3818', bg2: '#36200C', gold: '#F4D06F', accent: '#FAEDCD', border: '#D4A373' }, // Antique Leather
    { bg1: '#3D201A', bg2: '#24120E', gold: '#DFB15B', accent: '#EAD7AF', border: '#C84B31' }  // Burnt Sienna
  ];
  const p = palettes[bookId % palettes.length];

  // Split title if long
  const words = safeTitle.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length <= 16) {
      cur = (cur + ' ' + w).trim();
    } else {
      if (cur) lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  const displayLines = lines.slice(0, 4);
  const startY = 220 - (displayLines.length - 1) * 16;
  const titleSvg = displayLines.map((line, idx) =>
    `<text x="200" y="${startY + idx * 32}" text-anchor="middle" fill="#FAF8F2" font-family="'Noto Sans Devanagari', 'Lohit Devanagari', Georgia, serif" font-size="20" font-weight="700">${line}</text>`
  ).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
  <defs>
    <linearGradient id="bgGrad_${bookId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.bg1}"/>
      <stop offset="100%" stop-color="${p.bg2}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="600" fill="url(#bgGrad_${bookId})"/>
  <rect x="16" y="16" width="368" height="568" rx="4" fill="none" stroke="${p.border}" stroke-opacity="0.5" stroke-width="1.6"/>
  <rect x="24" y="24" width="352" height="552" rx="2" fill="none" stroke="${p.gold}" stroke-opacity="0.3" stroke-width="0.9"/>
  <circle cx="24" cy="24" r="3" fill="${p.gold}" fill-opacity="0.75"/>
  <circle cx="376" cy="24" r="3" fill="${p.gold}" fill-opacity="0.75"/>
  <circle cx="24" cy="576" r="3" fill="${p.gold}" fill-opacity="0.75"/>
  <circle cx="376" cy="576" r="3" fill="${p.gold}" fill-opacity="0.75"/>
  <text x="200" y="58" text-anchor="middle" fill="${p.gold}" font-family="system-ui, sans-serif" font-size="9" font-weight="700" letter-spacing="3.5">LIBRAMIND ATHENAEUM</text>
  <text x="200" y="78" text-anchor="middle" fill="${p.accent}" font-family="system-ui, sans-serif" font-size="8" font-weight="600" letter-spacing="2">№ ${String(bookId).padStart(3, '0')} • ${safeCat}</text>
  <line x1="130" y1="94" x2="270" y2="94" stroke="${p.gold}" stroke-opacity="0.5" stroke-width="1"/>
  ${titleSvg}
  <line x1="160" y1="${startY + displayLines.length * 32 + 10}" x2="240" y2="${startY + displayLines.length * 32 + 10}" stroke="${p.gold}" stroke-opacity="0.6" stroke-width="1.2"/>
  <text x="200" y="${startY + displayLines.length * 32 + 38}" text-anchor="middle" fill="${p.accent}" font-family="'Noto Sans Devanagari', 'Lohit Devanagari', Georgia, serif" font-size="13" font-style="italic">by ${safeAuthor}</text>
  <circle cx="200" cy="495" r="24" fill="none" stroke="${p.gold}" stroke-opacity="0.5" stroke-width="1.2"/>
  <text x="200" y="501" text-anchor="middle" fill="${p.gold}" font-family="Georgia, serif" font-size="14" font-weight="bold">LM</text>
  <text x="200" y="545" text-anchor="middle" fill="${p.accent}" font-family="system-ui, sans-serif" font-size="8" letter-spacing="2.5" opacity="0.8">SACRED CLASSICAL EDITION</text>
</svg>`;
}

function run() {
  console.log('--- Starting Addition of Spiritual & Classical Books ---');

  // Load covers map
  const mapPath = path.join(__dirname, 'book_covers_map.json');
  let bookCoversMap = {};
  if (fs.existsSync(mapPath)) {
    try {
      bookCoversMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
    } catch (_) {}
  }

  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Check existing books in DB
  const existingBooks = db.prepare('SELECT id, title, author, isbn FROM books').all();
  console.log(`Current books in database: ${existingBooks.length}`);

  let addedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;

  const insertBookStmt = db.prepare(`
    INSERT INTO books (
      title, author, isbn, publisher, publication_year, category, language,
      edition, description, cover_image, floor, section, shelf, rack,
      total_copies, available_copies
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?
    )
  `);

  const insertCopyStmt = db.prepare(`
    INSERT INTO book_copies (book_id, copy_code, status, condition)
    VALUES (?, ?, 'available', 'Good')
  `);

  for (const item of booksToAdd) {
    // Check if already exists
    if (item.existingId) {
      // Book 1 or Book 4
      const existing = existingBooks.find(b => b.id === item.existingId);
      if (existing) {
        console.log(`[DUPLICATE PREVENTED & ALIASED] #${item.num} ${item.hindiTitle} already exists as ID ${existing.id} ("${existing.title}")`);
        // Update title to include Hindi alias if not already included
        if (!existing.title.includes(item.hindiTitle)) {
          const newTitle = item.fullTitle;
          db.prepare('UPDATE books SET title = ? WHERE id = ?').run(newTitle, existing.id);
          console.log(`  -> Updated ID ${existing.id} title to: ${newTitle}`);
          updatedCount++;
        } else {
          skippedCount++;
        }
        continue;
      }
    }

    // Check by exact title or Hindi title match to guarantee no duplicate
    const match = existingBooks.find(b => 
      b.title.toLowerCase().includes(item.hindiTitle.toLowerCase()) ||
      b.title.toLowerCase().includes(item.englishTitle.toLowerCase()) ||
      (b.isbn && b.isbn === item.isbn)
    );

    if (match) {
      console.log(`[DUPLICATE PREVENTED] #${item.num} ${item.hindiTitle} matched existing book ID ${match.id} ("${match.title}"). Skipping insertion.`);
      skippedCount++;
      continue;
    }

    // Insert new book!
    const coverRelPath = `/uploads/book_sacred_${item.num}_cover.svg`;
    const res = insertBookStmt.run(
      item.fullTitle,
      item.author,
      item.isbn,
      item.publisher,
      item.publication_year,
      item.category,
      item.language,
      item.edition,
      item.description,
      coverRelPath,
      item.floor,
      item.section,
      item.shelf,
      item.rack,
      3, // total copies
      3  // available copies
    );

    const newId = res.lastInsertRowid;

    // Create 3 book copies
    for (let c = 1; c <= 3; c++) {
      const copyCode = `CPY-${String(newId).padStart(3, '0')}-${String(c).padStart(2, '0')}`;
      insertCopyStmt.run(newId, copyCode);
    }

    // Generate and write SVG cover file
    const svgContent = generateBookSvg(newId, item.hindiTitle, item.author, item.category);
    const svgFileName = `book_${newId}_cover.svg`;
    const svgPath = path.join(uploadsDir, svgFileName);
    fs.writeFileSync(svgPath, svgContent, 'utf8');

    // Update covers map
    const finalCoverPath = `/uploads/${svgFileName}`;
    bookCoversMap[String(newId)] = finalCoverPath;
    db.prepare('UPDATE books SET cover_image = ? WHERE id = ?').run(finalCoverPath, newId);

    console.log(`[ADDED] ID ${newId}: #${item.num} ${item.hindiTitle} (${item.englishTitle}) by ${item.author}`);
    addedCount++;
  }

  // Save updated book_covers_map.json
  fs.writeFileSync(mapPath, JSON.stringify(bookCoversMap, null, 2), 'utf8');
  console.log(`Updated book_covers_map.json with ${Object.keys(bookCoversMap).length} entries.`);

  const finalTotal = db.prepare('SELECT COUNT(*) as count FROM books').get().count;
  console.log('====================================================');
  console.log(`Summary:`);
  console.log(`  Added: ${addedCount} new books`);
  console.log(`  Updated with Hindi alias: ${updatedCount} books`);
  console.log(`  Duplicates prevented: ${skippedCount} books`);
  console.log(`  Total books in database now: ${finalTotal}`);
  console.log('====================================================');
  return { addedCount, updatedCount, skippedCount, finalTotal };
}

module.exports = run;

if (require.main === module) {
  run();
}
