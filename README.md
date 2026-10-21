# LibraMind — AI-Powered Smart Library Management System 🍃📚

**LibraMind** is an intelligent, full-stack library management ecosystem built with a serene **Biophilic Reading Space** aesthetic. It solves three critical challenges for students:
1. **Shelf Stacks Navigation:** Instantly locates the exact floor, section, shelf code, and rack unit for every book.
2. **Real-time Inventory & Study Pods:** Displays live copy availability, waiting list queues, and interactive floor-by-floor seat vacancy maps with reservation time slots.
3. **AI Discovery & Personalized Recommendations:** Natural language catalog search driven by TF-IDF & Cosine Similarity vector matching, alongside content-based personalized book recommendations.

---

## 📁 Clean Architectural Separation

This repository strictly separates frontend and backend codebases into dedicated standalone directories:

```
smartlib/
├── backend/                  # Strictly backend code
│   ├── package.json          # Express, SQLite (better-sqlite3), JWT, bcryptjs
│   ├── server.js             # Main API server (Port 5000)
│   ├── libramind.db          # Persistent SQLite database (ACID & WAL enabled)
│   ├── db/
│   │   ├── database.js       # Database schema & tables
│   │   └── seed.js           # Realistic library dataset & demo profiles
│   ├── middleware/
│   │   └── auth.js           # JWT verification, Role-based access control & Audit logger
│   └── routes/
│       ├── auth.js           # Student/Librarian/Admin auth & profile management
│       ├── books.js          # Catalog search, shelf mapping, physical copy barcode tracking
│       ├── loans.js          # Checkouts, returns, automated overdue fines ($1/day), renewals
│       ├── reservations.js   # Waitlist queue positions, pickup desk workflows
│       ├── seats.js          # Interactive study pod map, slot booking & librarian status toggle
│       ├── notifications.js  # In-website notification center & librarian broadcasts
│       ├── ai.js             # NLP Book Finder (TF-IDF), Content recommendations, AI assistant
│       ├── analytics.js      # Monthly trends, seat density, predictive demand forecast & CSV export
│       └── wishlist.js       # Student favorite books wishlist
│
├── frontend/                 # Strictly frontend code
│   ├── package.json          # React, Vite, Lucide-react
│   ├── vite.config.js        # Vite configuration (Port 5173)
│   ├── index.html            # Biophilic typography (Outfit & Newsreader) and metadata
│   └── src/
│       ├── main.jsx          # React DOM entry point
│       ├── App.jsx           # Master application coordinator and router
│       ├── index.css         # Biophilic CSS Design System tokens & styling
│       ├── api.js            # Centralized API client connecting to backend
│       ├── context/
│       │   ├── AuthContext.jsx         # User session, JWT handling & demo switcher
│       │   └── NotificationContext.jsx # Polling notification tray & unread counts
│       ├── components/
│       │   ├── Navbar.jsx              # Navigation, unread bell badge, role indicator
│       │   ├── Footer.jsx              # Library directory, policy, and biophilic philosophy
│       │   ├── BookCard.jsx            # Book cover, status badge, exact shelf tag
│       │   ├── NotificationDropdown.jsx# In-website notification center drawer
│       │   └── AiAssistantModal.jsx    # Conversational library chatbot
│       └── pages/
│           ├── Home.jsx                # Hero search, solution pillars, live seat glance
│           ├── Catalog.jsx             # Category filters, availability toggle, sorting
│           ├── BookDetails.jsx         # Physical copy barcode breakdown, shelf tag, checkout
│           ├── SeatAvailability.jsx    # Interactive floor/section seat map & slot booking
│           ├── AiBookFinder.jsx        # NLP query vector matcher with similarity explanations
│           ├── StudentDashboard.jsx    # Active loans, due date countdowns, hold queue, recommendations
│           ├── LibrarianDashboard.jsx  # Desk checkouts, returns, hold queue management, announcements
│           ├── AdminDashboard.jsx      # Role permissions, system integrity, CSV catalog export
│           ├── AnalyticsPage.jsx       # Real database charts & 30-day demand forecast
│           ├── Login.jsx               # 1-Click demo logins (Student, Librarian, Admin)
│           └── Register.jsx            # Student registration with research interests onboarding
│
└── README.md
```

---

## 🎨 Biophilic Color Palette

The interface implements a nature-inspired palette:
- **Deep Forest Green:** `#344E41`
- **Sage Green:** `#829779`
- **Botanical Green:** `#52734D`
- **Soft Sage:** `#DCE5D5`
- **Warm Beige:** `#F3EBDD`
- **Cream Background:** `#FAF8F1`
- **Dark Text:** `#26352B`

---

## ⚡ Quick Start Instructions

### 1. Start the Backend API Server
```powershell
cd backend
npm install
npm run seed     # Seeds realistic catalog, study pods, and user accounts
npm start        # Runs on http://localhost:5000
```

### 2. Start the Frontend Web App
```powershell
cd frontend
npm install
npm run dev      # Runs on http://localhost:5173
```

---

## 👥 Demo Accounts (1-Click Login on `/login`)

| Role | Name | Email | Password |
|---|---|---|---|
| **Student** | Aarav Sharma | `student@libramind.edu` | `Student@123` |
| **Librarian** | Marcus Thorne | `librarian@libramind.edu` | `Librarian@123` |
| **Admin** | Dr. Eleanor Vance | `admin@libramind.edu` | `Admin@123` |
