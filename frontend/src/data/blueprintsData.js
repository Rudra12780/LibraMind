// Complete Website Blueprint and Wireframe Specifications for LibraMind
export const BLUEPRINT_MARKDOWN = `# LibraMind — AI-Powered Smart Library Management System
## Complete Website Pages Blueprint & Architecture Specification

Generated: 2026-10-30 | Biophilic Design System

================================================================================
TABLE OF CONTENTS
================================================================================
1. Architecture Overview & Global Navigation Flow
2. Page 1: Landing Sanctuary (Home.jsx)
3. Page 2: Book Catalog & Filter Grid (Catalog.jsx)
4. Page 3: Book Details & 4-Tier Stack Navigator (BookDetails.jsx)
5. Page 4: AI Semantic Book Finder (AiBookFinder.jsx)
6. Page 5: Multi-Book Comparison Matrix (BookCompare.jsx)
7. Page 6: Study Pod & Seat Concurrency Map (SeatAvailability.jsx)
8. Page 7: Library Visit Planner & Stack Router (VisitPlanner.jsx)
9. Page 8: Student & Member Sanctuary Hub (StudentDashboard.jsx)
10. Page 9: Librarian Circulation & Barcode Desk (LibrarianDashboard.jsx)
11. Page 10: Administrator Central Control (AdminDashboard.jsx)
12. Page 11: Circulation Analytics & Forecasting (AnalyticsPage.jsx)
13. Page 12: Authentication & Onboarding (Login.jsx & Register.jsx)

================================================================================
1. ARCHITECTURE OVERVIEW & GLOBAL NAVIGATION FLOW
================================================================================
The platform utilizes a Role-Based Single Page Architecture (SPA):
• Public Visitor Tier: Exploration, reading carousels, conceptual search preview.
• Student / Member Tier: Self-service loans, returns, renewals, study seats, visit itinerary.
• Librarian / Staff Tier: Barcode desk, manual check-in/checkout, inventory dispatch.
• Administrator Tier: User role elevation, audit logs, system health, analytics.

+---------------------------------------------------------------------------------+
|                           [ LIBRAMIND ROOT ROUTER ]                             |
|                                       │                                         |
|    ┌──────────────────┬───────────────┴───────────────┬──────────────────┐      |
|    ▼                  ▼                               ▼                  ▼      |
| [Public Tier]   [Member Hub Tier]              [Staff Desk]        [Admin Portal]|
| • Home          • Student Hub (Overview)       • Issue / Scan      • User Control|
| • Catalog       • My Loans (Return / Renew)    • Returns Desk      • Audit Logs  |
| • AI Finder     • Hold Queues (FIFO Rank)      • Inventory Desk    • Demand Metr.|
| • Seat Booking  • Study Pods & Wishlist        • Overdue Hand-off  • System Sec. |
| • Visit Planner • Book Details & Compare       • Barcode Engine    • Roles Config|
+---------------------------------------------------------------------------------+

================================================================================
PAGE 1: LANDING SANCTUARY (Home.jsx)
================================================================================
• Route: / or /home
• Access: Public / All Roles
• Purpose: Biophilic welcome, instant search, member quick-status, curated masterworks.

[ WIREFRAME LAYOUT ]
+---------------------------------------------------------------------------------+
| [UserNavbar / Navbar] (Sticky, Glassmorphism, Role Indicator)                   |
+---------------------------------------------------------------------------------+
| HERO BANNER:                                                                    |
| - Biophilic Gradient (Dark Forest & Botanical Sage)                             |
| - Headline: "A Sanctuary of Calm, Literature & Timeless Stories"                |
| - [ Frosted Glass Search Bar: Title, Author, Keyword | [Find Books] ]           |
| - Quick Topic Tags: [Spiritual] [Novels] [Story Books] [Fiction]                |
| - Hero Actions: [ 📐 Download Blueprints ] [ 🌿 Member Sign In ] [ Register ]    |
+---------------------------------------------------------------------------------+
| LIVE STATS STRIP:                                                               |
| [ 60+ Curated Titles ] [ 12 Study Pods Open ] [ 3 Reading Floors ] [ 100% Mapped]|
+---------------------------------------------------------------------------------+
| MEMBER QUICK-CARD (Rendered only when logged in):                               |
| [ Active Loans: 3 ] [ Hold Queues: 1 ] [ Study Pods: 12 Open ] [ Wishlist: 4 ]  |
+---------------------------------------------------------------------------------+
| CURATED MASTERWORKS CAROUSELS:                                                  |
| 1. Spiritual & Wisdom Masterworks (Bhagavad Gita, Power of Now, Tao Te Ching)   |
| 2. Timeless Classic Novels (War and Peace, 1984, Pride and Prejudice)           |
| 3. Emotional & Philosophical Fiction (The Alchemist, Norwegian Wood)            |
+---------------------------------------------------------------------------------+
| ARCHITECTURE BLUEPRINT DOWNLOAD SECTION:                                        |
| [ 📥 Download .MD ] [ 📄 Download .TXT ] [ 🖨️ Print / Save PDF ] [ 👁️ Preview ]  |
+---------------------------------------------------------------------------------+

================================================================================
PAGE 2: BOOK CATALOG & FILTER GRID (Catalog.jsx)
================================================================================
• Route: /catalog or /books
• Access: Public / All Roles
• Purpose: Full library collection exploration with multi-attribute filtering.

[ WIREFRAME LAYOUT ]
+---------------------------------------------------------------------------------+
| [ 🔍 Search by title, author, ISBN... ] [ Category Filter v ] [ Sort: Popular v]|
| Toggle: [x] Available Now Only    Layout: [ Grid Mode ] [ List Mode ]           |
+---------------------------------------------------------------------------------+
| ACTIVE FILTER PILLS: [Category: Spiritual x] [Floor 2 x] [Clear All]            |
+---------------------------------------------------------------------------------+
| RESULTS GRID (Responsive 1-4 Columns):                                          |
| +-------------------------+ +-------------------------+ +---------------------+ |
| | [Cover Image Art]       | | [Cover Image Art]       | | [Cover Image Art]   | |
| | Title & Author Name     | | Title & Author Name     | | Title & Author Name | |
| | Category & Floor Badge  | | Category & Floor Badge  | | Category & Floor Bdg| |
| | Status: 🟢 3 Available   | | Status: 🟡 Hold (Queue) | | Status: 🟢 1 Avail  | |
| | [Details] [⚖️ Compare]   | | [Details] [⚖️ Compare]   | | [Details] [⚖️ Comp] | |
| +-------------------------+ +-------------------------+ +---------------------+ |
+---------------------------------------------------------------------------------+
| PAGINATION: [< Previous] Page 1 of 6 [Next >]                                   |
+---------------------------------------------------------------------------------+

================================================================================
PAGE 3: BOOK DETAILS & 4-TIER STACK (BookDetails.jsx)
================================================================================
• Route: /book-details/:id
• Access: Public View / Self-Borrowing requires Student Auth
• Purpose: Book metadata, physical copy status, exact shelf navigation coordinates.

[ WIREFRAME LAYOUT ]
+---------------------------------------------------------------------------------+
| Breadcrumbs: Catalog > Spiritual & Wisdom > The Power of Now                    |
+---------------------------------------+-----------------------------------------+
| LEFT PANEL: COVER & SMART ACTIONS     | RIGHT PANEL: METADATA & 4-TIER STACK    |
| - High-Resolution Book Cover          | - Title: The Power of Now               |
| - ISBN, Edition, Year, Publisher      | - Author: Eckhart Tolle                 |
|                                       | - Full Synopsis & Theme Tags            |
| DYNAMIC ACTION CARD:                  |                                         |
| [If Available]:                       | 4-TIER SPATIAL COORDINATE CARD:         |
|   -> [ Borrow Now (14 Days) ]         | +-------------------------------------+ |
|   -> [ Add to Visit Planner ]         | | 1. Floor Level:     Floor 2         | |
|   -> [ Add to Compare ]               | | 2. Subject Section: Wisdom Section  | |
| [If Currently Borrowed by You]:       | | 3. Shelf Aisle:     SW-02           | |
|   -> [ ✓ Return Book ]                | | 4. Specific Rack:   Unit 04         | |
|   -> [ Renew (+14 Days) ]             | +-------------------------------------+ |
|   -> [ Open My Loans Hub ]            |                                         |
| [If Out of Stock]:                    | PHYSICAL COPY INVENTORY:                |
|   -> [ Join Waitlist (Queue #1) ]     | • Copy #1 (LM-SW-02-C1): 🟢 Available  |
|                                       | • Copy #2 (LM-SW-02-C2): 🔴 Borrowed   |
| - [ Save to Personal Wishlist ]       |                                         |
+---------------------------------------+-----------------------------------------+

================================================================================
PAGE 4: AI SEMANTIC BOOK FINDER (AiBookFinder.jsx)
================================================================================
• Route: /ai-finder
• Engine: In-memory TF-IDF Vector Space & Cosine Similarity (<15ms response).
• Purpose: Natural language conceptual search when exact keywords are unknown.

[ WIREFRAME LAYOUT ]
+---------------------------------------------------------------------------------+
| HERO: "Explainable AI Semantic Research Assistant"                              |
| [ 🧠 Describe what you want to feel or explore...              | [Search AI] ]  |
| Idea Prompts: [Overcoming Anxiety] [Duty and Destiny] [Ego Dissolution]         |
+---------------------------------------------------------------------------------+
| MATCH RESULTS WITH EXPLAINABLE RATIONALE:                                       |
| +-----------------------------------------------------------------------------+ |
| | Book: The Power of Now (Eckhart Tolle)           Match Score: [ 94.2% Match]| |
| | 💡 Explainable AI Match Rationale:                                          | |
| | "High conceptual overlap on tokens: 'present moment', 'inner silence',      | |
| |  and 'mindfulness' extracted from chapter synopses."                        | |
| | Actions: [ Borrow Book ] [ View Shelf: Fl 2 > SW-02 ] [ Compare ]            | |
| +-----------------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------+

================================================================================
PAGE 5: MULTI-BOOK COMPARISON MATRIX (BookCompare.jsx)
================================================================================
• Route: /compare
• Access: Public / All Roles
• Purpose: Compare 2 to 4 books side-by-side to make the best reading decision.

[ WIREFRAME LAYOUT ]
+---------------------------------------------------------------------------------+
| TRAY HEADER: Comparing 3 Books [ Clear All ] [ + Add Book ]                     |
+---------------------------------------------------------------------------------+
| COMPARISON MATRIX TABLE (Responsive Horizontal Scroll):                         |
| Attribute          | Book 1 (Bhagavad Gita) | Book 2 (Power of Now) | Book 3 (Siddhartha) |
| Cover Thumbnail    | [Image]                | [Image]               | [Image]             |
| Author             | Eknath Easwaran        | Eckhart Tolle         | Hermann Hesse       |
| Primary Category   | Spiritual & Wisdom     | Modern Mindfulness    | Classic Fiction     |
| Page Count         | 384 Pages              | 256 Pages             | 152 Pages           |
| Spatial Location   | Fl 2 > Section SP > 01 | Fl 2 > Section SW > 04| Fl 1 > Section CL   |
| Real-time Status   | 🟢 Available (3)       | 🟠 Borrowed by You    | 🔴 Waitlist (2 in Q)|
| Contextual Action  | [ Borrow Book ]        | [ ✓ Return Loan ]     | [ Join Waitlist ]   |
+---------------------------------------------------------------------------------+

================================================================================
PAGE 6: STUDY POD & SEAT AVAILABILITY (SeatAvailability.jsx)
================================================================================
• Route: /seats
• Safety: Strict SQLite partial unique indexes serialize concurrent bookings.
• Purpose: Interactive visual map of 40 study seats across multiple zones.

[ WIREFRAME LAYOUT ]
+---------------------------------------------------------------------------------+
| FLOOR TABS: [ Floor 1: Garden Commons ] [ Floor 2: Silent Mezzanine ]           |
| ZONE LEGEND: 🟢 Available (24)   🔴 Occupied (12)   🟡 Reserved (4)   ⚪ Offline|
+---------------------------------------------------------------------------------+
| FILTERS: Date: [Today v]  Slot: [2 PM - 4 PM v]  Zone: [Window Focus v]         |
+---------------------------------------------------------------------------------+
| INTERACTIVE SEAT GRID:                                                          |
| +----------------------+ +----------------------+ +----------------------+      |
| | Pod F2-01 [Window]   | | Pod F2-02 [Silent]   | | Pod F2-03 [Collab]   |      |
| | 🟢 Available         | | 🔴 Occupied          | | 🟢 Available         |      |
| | [ Reserve Slot ]     | | [ Booked Until 4pm ] | | [ Reserve Slot ]     |      |
| +----------------------+ +----------------------+ +----------------------+      |
+---------------------------------------------------------------------------------+

================================================================================
PAGE 7: LIBRARY VISIT PLANNER (VisitPlanner.jsx)
================================================================================
• Route: /visit-planner
• Purpose: Turn a digital reading list into an optimized in-stack walking route.

[ WIREFRAME LAYOUT ]
+---------------------------------------------------------------------------------+
| HEADER: "Optimize Your Physical Library Visit Itinerary" (3 Books Selected)     |
+---------------------------------------+-----------------------------------------+
| LEFT: OPTIMIZED STACK WALKING ROUTE   | RIGHT: PHYSICAL RETRIEVAL CHECKLIST     |
|                                       |                                         |
| STOP 1: Floor 1 (Classic Fiction)     | [ ] 1. War and Peace                    |
| ➔ Section CL > Aisle CL-03 > Rack 02  |     Loc: Fl 1 > CL-03 > R02             |
| ➔ Book: War and Peace                 |     Barcode: LM-CL-03-C1                |
|                                       |                                         |
| STOP 2: Floor 2 (Spiritual & Wisdom)  | [ ] 2. The Power of Now                 |
| ➔ Section SW > Aisle SW-02 > Rack 04  |     Loc: Fl 2 > SW-02 > R04             |
| ➔ Book: The Power of Now              |                                         |
|                                       | [ Print Itinerary ] [ Send to Device ]  |
+---------------------------------------+-----------------------------------------+

================================================================================
PAGE 8: MEMBER SANCTUARY HUB (StudentDashboard.jsx)
================================================================================
• Route: /dashboard
• Access: Protected (Student / Member Role)
• Navigation: Managed by UserNavbar Tier 1 & Tier 2 sub-navigation bar.

[ WIREFRAME LAYOUT ]
+---------------------------------------------------------------------------------+
| [UserNavbar Tier 1: Main Site Links + Profile Chip]                             |
| [UserNavbar Tier 2: [Overview] [Loans (3)] [Holds (1)] [Pods (1)] [AI For You]] |
+---------------------------------------------------------------------------------+
| WELCOME STRIP: "Welcome, Aarav Sharma (STU-1001) · Account in Good Standing"    |
+---------------------------------------------------------------------------------+
| ACTIVE TAB CONTENT (Example: 'My Loans' Active View):                           |
| +-----------------------------------------------------------------------------+ |
| | [Cover] The Power of Now (Eckhart Tolle)                                    | |
| | Borrowed: Oct 12, 2026   Due: Oct 26, 2026 (Due in 4 Days)                  | |
| | Status: 🟢 Borrowed (On Time)                 Barcode: LM-SW-02-C1          | |
| | Actions: [ ✓ Return Book ]   [ Renew (+14 Days) ]   [ Stack Coordinates ]   | |
| +-----------------------------------------------------------------------------+ |
| +-----------------------------------------------------------------------------+ |
| | [Cover] The Bhagavad Gita (Eknath Easwaran)                                 | |
| | Borrowed: Oct 10, 2026   Due: Oct 24, 2026 (Due in 2 Days)                  | |
| | Status: 🟡 Due Soon                          Barcode: LM-SP-01-C3           | |
| | Actions: [ ✓ Return Book ]   [ Renew (+14 Days) ]   [ Stack Coordinates ]   | |
| +-----------------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------+

================================================================================
PAGE 9: LIBRARIAN CIRCULATION DESK (LibrarianDashboard.jsx)
================================================================================
• Route: /librarian
• Access: Protected (Librarian Role)
• Purpose: Barcode issue/return, auto-waitlist dispatch, inventory control.

[ WIREFRAME LAYOUT ]
+---------------------------------------------------------------------------------+
| TABS: [ Barcode Issue Desk ] [ Return Workbench ] [ Inventory ] [ Queue Dispatch]
+---------------------------------------------------------------------------------+
| BARCODE ISSUE WORKSPACE:                                                        |
| 1. Enter Patron ID: [ STU-1001 ] ➔ Aarav Sharma (Eligibility: 3/10 Active)      |
| 2. Scan Barcode:    [ LM-SW-02-C1 ] ➔ The Power of Now (Copy #1)                |
| [ Complete Checkout (Issue 14-Day Loan) ]                                       |
+---------------------------------------------------------------------------------+
| QUICK RETURN WORKBENCH:                                                         |
| [ Scan Return Barcode: _____________________ ] [ Confirm Check-In ]             |
| * System checks if title is on hold: Auto-dispatches to Queue #1 patron         |
+---------------------------------------------------------------------------------+

================================================================================
PAGE 10: ADMINISTRATOR CENTRAL CONTROL (AdminDashboard.jsx)
================================================================================
• Route: /admin
• Access: Protected (Admin Role with Secondary Security Verification)
• Purpose: User permissions, live audit log stream, system health.

[ WIREFRAME LAYOUT ]
+---------------------------------------------------------------------------------+
| HEALTH: 🟢 System Operational | Active Connections: 6 | DB: libramind.db        |
+---------------------------------------------------------------------------------+
| METRICS ROW: [ Total Users: 6 ] [ Titles: 45 ] [ Active Loans: 18 ] [ Pods: 65%]|
+---------------------------------------+-----------------------------------------+
| USER DIRECTORY & ROLE MANAGEMENT      | REAL-TIME SECURITY AUDIT LOG STREAM     |
| [ Search user name or email... ]      | • 15:02:11 STU-1001 Borrowed Copy C1    |
| - Dr. Eleanor Vance [Role: Admin]     | • 14:58:20 LIB-5001 Checked In Copy C2  |
| - Marcus Thorne     [Role: Librarian] | • 14:30:05 STU-1002 Reserved Pod F2-01  |
| - Aarav Sharma      [Role: Student]   | • 14:15:22 ADM-9001 System Config Update|
| Actions: [ Change Role ] [ Reset PW ] | [ Export Logs to CSV ]                  |
+---------------------------------------+-----------------------------------------+

================================================================================
PAGE 11: CIRCULATION ANALYTICS (AnalyticsPage.jsx)
================================================================================
• Route: /analytics
• Access: Protected (Staff & Admin)
• Purpose: Demand forecasting, category turnover, peak study hours.

[ WIREFRAME LAYOUT ]
+---------------------------------------------------------------------------------+
| RANGE: [ Last 7 Days ] [ Last 30 Days ] [ This Academic Semester ]              |
+---------------------------------------+-----------------------------------------+
| CIRCULATION BY GENRE (Chart):         | STUDY POD PEAK OCCUPANCY (Chart):       |
| █ Spiritual & Wisdom: 42%             | Peak Study Hours: 2:00 PM - 5:00 PM     |
| █ Classic Literature: 28%             | Highest Demand Zone: Floor 2 Window Nook|
| █ Emotional Fiction: 20%              |                                         |
+---------------------------------------+-----------------------------------------+
| ACQUISITIONS FORECASTING:             |                                         |
| • The Power of Now: 34 loans / 4 waitlist ➔ Recommendation: Order 2 copies     |
+---------------------------------------------------------------------------------+
`;

// Helper: Download as Markdown file
export function downloadBlueprintMarkdown() {
  const blob = new Blob([BLUEPRINT_MARKDOWN], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'LibraMind-Website-Blueprints.md';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Helper: Download as Plain Text file
export function downloadBlueprintText() {
  const blob = new Blob([BLUEPRINT_MARKDOWN], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'LibraMind-Website-Blueprints.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Helper: Open Print/PDF-ready View
export function printBlueprintDocument() {
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (!printWindow) {
    alert('Please allow popups to print/save the blueprint document as PDF.');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>LibraMind Website Blueprints & Wireframe Architecture</title>
        <meta charset="utf-8" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=Newsreader:ital,wght@0,600;0,700;1,400&display=swap');
          body {
            font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
            color: #23342B;
            background-color: #FFFFFF;
            padding: 40px;
            max-width: 900px;
            margin: 0 auto;
            line-height: 1.6;
          }
          h1, h2, h3 {
            color: #23342B;
            font-family: 'Newsreader', serif;
            letter-spacing: -0.02em;
          }
          h1 { font-size: 2.2rem; border-bottom: 2px solid #52734D; padding-bottom: 12px; margin-bottom: 8px; }
          h2 { font-size: 1.5rem; margin-top: 36px; border-bottom: 1px solid #DCE5D5; padding-bottom: 6px; color: #344E41; }
          h3 { font-size: 1.15rem; color: #52734D; margin-top: 20px; }
          pre {
            background-color: #FAF8F1;
            border: 1px solid #DCE5D5;
            border-radius: 8px;
            padding: 16px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.82rem;
            line-height: 1.45;
            overflow-x: auto;
            white-space: pre-wrap;
          }
          .badge {
            background: #EBF1E6;
            color: #52734D;
            padding: 3px 10px;
            border-radius: 99px;
            font-size: 0.75rem;
            font-weight: 700;
            display: inline-block;
            margin-bottom: 20px;
          }
          .print-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
            pre { page-break-inside: avoid; }
            h2 { page-break-before: auto; }
          }
        </style>
      </head>
      <body>
        <div class="print-header no-print" style="margin-bottom: 20px; padding: 12px; background: #FAF5EC; border-radius: 8px;">
          <div>
            <strong>Print Instructions:</strong> In the browser print dialog, select <em>Destination: Save as PDF</em> to download this blueprint as a high-quality PDF.
          </div>
          <button onclick="window.print()" style="background: #344E41; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">
            Print / Save as PDF
          </button>
        </div>
        <div>
          <span class="badge">LIBRAMIND ARCHITECTURAL SPECIFICATION</span>
          <h1>LibraMind — Website Page Blueprints & Architecture</h1>
          <p><strong>System:</strong> AI-Powered Smart Library Management System (Biophilic Sanctuary Design)<br/>
          <strong>Date Generated:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <pre>${BLUEPRINT_MARKDOWN.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
        <script>
          setTimeout(() => {
            window.print();
          }, 600);
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

