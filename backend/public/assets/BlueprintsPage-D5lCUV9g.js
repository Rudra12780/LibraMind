import{a as e,n as t,r as n,t as r}from"./createLucideIcon-C-bNdaTa.js";import{F as i,J as a,K as o,L as s,O as c,R as l,c as u,d,f,h as p,j as m,k as h,l as g,m as _,p as v,q as y,s as b,u as x,z as S}from"./index-DKOm03uG.js";var C={name:`copy`,size:24,node:[[`rect`,{width:`14`,height:`14`,x:`8`,y:`8`,rx:`2`,ry:`2`,key:`17jyea`}],[`path`,{d:`M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2`,key:`zix9uf`}]]};C.node;var w=r(C),T={name:`grid-3x3`,size:24,node:[[`rect`,{width:`18`,height:`18`,x:`3`,y:`3`,rx:`2`,key:`afitv7`}],[`path`,{d:`M3 9h18`,key:`1pudct`}],[`path`,{d:`M3 15h18`,key:`5xshup`}],[`path`,{d:`M9 3v18`,key:`fh3hqa`}],[`path`,{d:`M15 3v18`,key:`14nvp0`}]],aliases:[`grid`,`grid-3-x-3`]};T.node;var E=r(T),D={name:`maximize-2`,size:24,node:[[`path`,{d:`M15 3h6v6`,key:`1q9fwt`}],[`path`,{d:`m21 3-7 7`,key:`1l2asr`}],[`path`,{d:`m3 21 7-7`,key:`tjx5ai`}],[`path`,{d:`M9 21H3v-6`,key:`wtvkvv`}]]};D.node;var O=r(D),k={name:`minimize-2`,size:24,node:[[`path`,{d:`m14 10 7-7`,key:`oa77jy`}],[`path`,{d:`M20 10h-6V4`,key:`mjg0md`}],[`path`,{d:`m3 21 7-7`,key:`tjx5ai`}],[`path`,{d:`M4 14h6v6`,key:`rmj7iw`}]]};k.node;var A=r(k),j=e(n(),1),M=`# LibraMind — AI-Powered Smart Library Management System
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

================================================================================
14. HUMAN-CENTERED DESIGN THINKING 15-STAGE ARCHITECTURE
================================================================================
• Stage 1 (Title Slide): Project title, team members, roll numbers, department, institution, mentor.
• Stage 2 (Introduction): Physical retrieval dilemmas (μ=14.2 min) vs biophilic smart sanctuary paradigm.
• Stage 3 (Project Overview): Tri-portal scope (Member, Librarian, Admin), sub-2.5 min retrieval target.
• Stage 4 (User Research): Stratified random sampling (N=184), 24 interviews, 40 hrs ethnographic inquiry.
• Stage 5 (Empathise): 4-quadrant empathy map (Think, Feel, Say, Do), phantom availability pain point.
• Stage 6 (Statistical Findings): Gaussian density PDF, Pearson r=0.78, two-sample t(183)=11.42, p<0.0001.
• Stage 7 (Define): Persona (Aarav Sharma), POV, HMW spatial routing, MoSCoW prioritization.
• Stage 8 (Ideation): Crazy Eights, SCAMPER, 4 multidisciplinary engineering pillars & sketches.
• Stage 9 (Idea Selection): Weighted MCDA matrix (89.5/100 for biophilic web architecture) & hypotheses.
• Stage 10 (Prototype): Fullstack React 18, Node Express REST, FastAPI AI NLP microservice, WAL SQLite.
• Stage 11 (Testing & Validation): TCR (96.8%), SUS score 88.6/100 (A+ grade), paired t=9.87, p<0.0001.
• Stage 12 (Results & Iterations): 12-hr AM/PM slots, responsive touch layouts, 85% search time reduction.
• Stage 13 (Impact & Limitations): 600+ monthly study hours saved, single-scan desk, boundary constraints.
• Stage 14 (Conclusion & Roadmap): Spatial certainty primacy, IoT RFID smart drop bins, vector embeddings.
• Stage 15 (References & Q&A): Brown, Norman, ACRL, Kleinrock, Vaswani academic citations & viva defense.
`,N=t();function P({onNavigate:e,initialPageId:t=`home`,onOpenPresentation:n}){let[r,C]=(0,j.useState)(t||`home`),[T,D]=(0,j.useState)(`all`),[k,P]=(0,j.useState)(`sheet`),[F,I]=(0,j.useState)(1),[L,R]=(0,j.useState)(``),[z,B]=(0,j.useState)(!1),[V,H]=(0,j.useState)(!1),U=(0,j.useRef)(null);(0,j.useEffect)(()=>{t&&C(t)},[t]),(0,j.useEffect)(()=>{k===`sheet`&&U.current&&(U.current.scrollTop=0)},[r,k]);let W=(0,j.useMemo)(()=>b.find(e=>e.id===r)||b[0],[r]),G=(0,j.useMemo)(()=>b.findIndex(e=>e.id===W.id),[W.id]),K=()=>{let e=(G-1+b.length)%b.length;C(b[e].id)},q=()=>{let e=(G+1)%b.length;C(b[e].id)},J=()=>{navigator?.clipboard&&(navigator.clipboard.writeText(M),B(!0),setTimeout(()=>B(!1),2e3))},Y=[{id:`all`,label:`All 21 Blueprints`,count:21},{id:`public`,label:`Public Tier (7)`,count:7},{id:`member`,label:`Member Sanctuary (5)`,count:5},{id:`staff_admin`,label:`Staff & Admin (3)`,count:3},{id:`security_util`,label:`Support & Docs (6)`,count:6},{id:`spec`,label:`System Spec (.MD)`,count:null}],X=(0,j.useMemo)(()=>b.filter(e=>{let t=!0;if(T===`public`?t=e.category===`Public Tier`:T===`member`?t=e.category===`Member Tier`:T===`staff_admin`?t=e.category===`Staff Tier`||e.category===`Admin Tier`:T===`security_util`&&(t=e.category===`Security Tier`||e.category===`Utility Tier`),!t)return!1;if(L.trim()){let t=L.toLowerCase(),n=e.name.toLowerCase().includes(t),r=e.route.toLowerCase().includes(t),i=(e.sections||[]).some(e=>e.toLowerCase().includes(t)),a=(e.desc||``).toLowerCase().includes(t);return n||r||i||a}return!0}),[T,L]);return(0,N.jsxs)(`div`,{style:{backgroundColor:`var(--editorial-bg)`,minHeight:`100vh`,color:`var(--editorial-text)`,paddingBottom:`80px`},children:[(0,N.jsx)(`section`,{style:{borderBottom:`1px solid var(--editorial-border)`,backgroundColor:`#FFFFFF`,padding:`40px 24px 32px`},children:(0,N.jsxs)(`div`,{className:`container`,style:{maxWidth:`1280px`,margin:`0 auto`},children:[(0,N.jsx)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,flexWrap:`wrap`,gap:`20px`},children:(0,N.jsxs)(`div`,{style:{maxWidth:`820px`},children:[(0,N.jsxs)(`div`,{style:{display:`inline-flex`,alignItems:`center`,gap:`8px`,padding:`4px 10px`,backgroundColor:`var(--editorial-border)`,color:`var(--editorial-text)`,fontSize:`0.78rem`,fontWeight:900,textTransform:`uppercase`,letterSpacing:`0.08em`,marginBottom:`10px`},children:[(0,N.jsx)(i,{size:14,strokeWidth:2.4}),` ARCHITECTURAL SYSTEM SPECIFICATION // 21 FULL WIREFRAME SHEETS`]}),(0,N.jsx)(`h1`,{style:{fontSize:`clamp(2rem, 3.8vw, 2.8rem)`,fontWeight:900,textTransform:`uppercase`,letterSpacing:`-0.03em`,lineHeight:1.15,margin:`4px 0 0`},children:`Website Blueprints & Architecture`})]})}),(0,N.jsxs)(`div`,{style:{marginTop:`28px`,paddingTop:`20px`,borderTop:`1px solid var(--editorial-border)`,display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexWrap:`wrap`,gap:`16px`},children:[(0,N.jsx)(`div`,{style:{display:`flex`,gap:`6px`,flexWrap:`wrap`,alignItems:`center`},children:Y.map(e=>{let t=e.id===`spec`&&k===`spec`||k!==`spec`&&T===e.id;return(0,N.jsx)(`button`,{onClick:()=>{e.id===`spec`?P(`spec`):(k===`spec`&&P(`sheet`),D(e.id))},style:{padding:`6px 14px`,fontSize:`0.80rem`,fontWeight:700,borderRadius:`var(--radius-sm)`,cursor:`pointer`,border:t?`1px solid var(--editorial-green)`:`1px solid var(--editorial-border)`,backgroundColor:t?`var(--editorial-green)`:`#FFFFFF`,color:t?`#FFFFFF`:`var(--editorial-text)`,transition:`all 0.15s ease`,display:`inline-flex`,alignItems:`center`,gap:`6px`},children:(0,N.jsx)(`span`,{children:e.label})},e.id)})}),(0,N.jsxs)(`div`,{style:{display:`inline-flex`,border:`1px solid var(--editorial-border)`,borderRadius:`var(--radius-sm)`,backgroundColor:`var(--editorial-bg-subtle)`,padding:`3px`,gap:`2px`},children:[(0,N.jsxs)(`button`,{onClick:()=>P(`sheet`),style:{padding:`5px 12px`,fontSize:`0.76rem`,fontWeight:800,textTransform:`uppercase`,border:`none`,borderRadius:`var(--radius-xs)`,cursor:`pointer`,backgroundColor:k===`sheet`?`#FFFFFF`:`transparent`,color:k===`sheet`?`var(--editorial-text)`:`var(--editorial-text-muted)`,boxShadow:k===`sheet`?`0 1px 3px rgba(0,0,0,0.08)`:`none`,display:`inline-flex`,alignItems:`center`,gap:`5px`},title:`Single Sheet Uncut Inspector`,children:[(0,N.jsx)(l,{size:13}),` Full Sheet`]}),(0,N.jsxs)(`button`,{onClick:()=>P(`continuous`),style:{padding:`5px 12px`,fontSize:`0.76rem`,fontWeight:800,textTransform:`uppercase`,border:`none`,borderRadius:`var(--radius-xs)`,cursor:`pointer`,backgroundColor:k===`continuous`?`#FFFFFF`:`transparent`,color:k===`continuous`?`var(--editorial-text)`:`var(--editorial-text-muted)`,boxShadow:k===`continuous`?`0 1px 3px rgba(0,0,0,0.08)`:`none`,display:`inline-flex`,alignItems:`center`,gap:`5px`},title:`View All 21 Blueprints Continuous Uncut`,children:[(0,N.jsx)(i,{size:13}),` All 21 Continuous`]}),(0,N.jsxs)(`button`,{onClick:()=>P(`grid`),style:{padding:`5px 12px`,fontSize:`0.76rem`,fontWeight:800,textTransform:`uppercase`,border:`none`,borderRadius:`var(--radius-xs)`,cursor:`pointer`,backgroundColor:k===`grid`?`#FFFFFF`:`transparent`,color:k===`grid`?`var(--editorial-text)`:`var(--editorial-text-muted)`,boxShadow:k===`grid`?`0 1px 3px rgba(0,0,0,0.08)`:`none`,display:`inline-flex`,alignItems:`center`,gap:`5px`},title:`21-Sheet Portfolio Grid`,children:[(0,N.jsx)(E,{size:13}),` Grid Portfolio`]}),(0,N.jsxs)(`button`,{onClick:()=>P(`spec`),style:{padding:`5px 12px`,fontSize:`0.76rem`,fontWeight:800,textTransform:`uppercase`,border:`none`,borderRadius:`var(--radius-xs)`,cursor:`pointer`,backgroundColor:k===`spec`?`#FFFFFF`:`transparent`,color:k===`spec`?`var(--editorial-text)`:`var(--editorial-text-muted)`,boxShadow:k===`spec`?`0 1px 3px rgba(0,0,0,0.08)`:`none`,display:`inline-flex`,alignItems:`center`,gap:`5px`},title:`Read Architecture Specification Markdown`,children:[(0,N.jsx)(s,{size:13}),` Spec (.MD)`]})]})]})]})}),(0,N.jsxs)(`main`,{className:`container`,style:{maxWidth:`1280px`,margin:`32px auto 0`,padding:`0 24px`},children:[k===`sheet`&&(0,N.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:V?`1fr`:`minmax(280px, 340px) 1fr`,gap:`24px`,alignItems:`start`},children:[!V&&(0,N.jsxs)(`div`,{style:{backgroundColor:`#FFFFFF`,border:`1px solid var(--editorial-border)`,padding:`20px`,boxShadow:`var(--shadow-sm)`},children:[(0,N.jsxs)(`div`,{style:{position:`relative`,marginBottom:`16px`},children:[(0,N.jsx)(c,{size:14,style:{position:`absolute`,left:`10px`,top:`10px`,color:`var(--editorial-text-muted)`}}),(0,N.jsx)(`input`,{type:`text`,value:L,onChange:e=>R(e.target.value),placeholder:`Search 21 blueprint sheets...`,style:{width:`100%`,padding:`7px 10px 7px 32px`,fontSize:`0.80rem`,borderRadius:`var(--radius-xs)`,border:`1px solid var(--editorial-border)`,backgroundColor:`var(--editorial-bg-subtle)`,boxSizing:`border-box`}}),L&&(0,N.jsx)(`button`,{onClick:()=>R(``),style:{position:`absolute`,right:`8px`,top:`8px`,border:`none`,background:`none`,cursor:`pointer`,fontSize:`0.75rem`},children:`×`})]}),(0,N.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`10px`},children:[(0,N.jsxs)(`span`,{style:{fontSize:`0.72rem`,fontWeight:800,color:`var(--editorial-accent)`,textTransform:`uppercase`,letterSpacing:`0.08em`},children:[`Sheets Directory (`,X.length,` of 21)`]}),(0,N.jsx)(`span`,{style:{fontSize:`0.70rem`,color:`var(--editorial-text-muted)`},children:`Click to Inspect`})]}),(0,N.jsx)(`div`,{style:{maxHeight:`680px`,overflowY:`auto`,display:`flex`,flexDirection:`column`,gap:`6px`,paddingRight:`4px`},children:X.map(e=>{let t=e.id===W.id;return(0,N.jsxs)(`button`,{onClick:()=>C(e.id),style:{textAlign:`left`,padding:`10px 12px`,border:t?`1px solid var(--editorial-green)`:`1px solid var(--editorial-border)`,backgroundColor:t?`var(--editorial-green)`:`#FFFFFF`,color:t?`#FFFFFF`:`var(--editorial-text)`,borderRadius:`var(--radius-xs)`,cursor:`pointer`,transition:`all 0.15s ease`,display:`flex`,flexDirection:`column`,gap:`2px`},children:[(0,N.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,N.jsxs)(`span`,{style:{fontSize:`0.68rem`,fontWeight:800,textTransform:`uppercase`,opacity:t?.9:.65},children:[`Page `,e.pageNumber,` • `,e.category]}),(0,N.jsx)(`span`,{style:{fontSize:`0.65rem`,fontFamily:`var(--font-mono)`,opacity:t?.85:.5},children:e.route})]}),(0,N.jsx)(`div`,{style:{fontSize:`0.84rem`,fontWeight:700,lineHeight:1.25},children:e.name})]},e.id)})})]}),(0,N.jsxs)(`div`,{style:{backgroundColor:`#FFFFFF`,border:`1px solid var(--editorial-border)`,padding:`24px`,boxShadow:`var(--shadow-sm)`,display:`flex`,flexDirection:`column`},children:[(0,N.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`20px`,paddingBottom:`16px`,borderBottom:`1.5px solid var(--editorial-border)`,flexWrap:`wrap`,gap:`12px`},children:[(0,N.jsxs)(`div`,{children:[(0,N.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[(0,N.jsxs)(`span`,{style:{fontSize:`0.74rem`,fontWeight:800,color:`var(--editorial-accent)`,textTransform:`uppercase`,letterSpacing:`0.08em`},children:[`SHEET `,W.pageNumber,` OF 21`]}),(0,N.jsx)(`span`,{style:{fontSize:`0.72rem`,backgroundColor:`var(--editorial-bg-subtle)`,border:`1px solid var(--editorial-border)`,padding:`2px 8px`,borderRadius:`2px`},children:W.category}),(0,N.jsxs)(`span`,{style:{fontSize:`0.72rem`,fontFamily:`var(--font-mono)`,color:`var(--editorial-text-muted)`},children:[`http://libramind.edu`,W.route]})]}),(0,N.jsx)(`h2`,{style:{fontSize:`1.45rem`,fontWeight:900,textTransform:`uppercase`,margin:`4px 0 0`,color:`var(--editorial-text)`},children:W.name})]}),(0,N.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`,flexWrap:`wrap`},children:[(0,N.jsxs)(`div`,{style:{display:`inline-flex`,border:`1px solid var(--editorial-border)`,borderRadius:`var(--radius-xs)`,overflow:`hidden`},children:[(0,N.jsx)(`button`,{onClick:K,style:{padding:`6px 10px`,backgroundColor:`#FFFFFF`,border:`none`,cursor:`pointer`,display:`flex`,alignItems:`center`,borderRight:`1px solid var(--editorial-border)`},title:`Previous Blueprint (Left Arrow)`,children:(0,N.jsx)(y,{size:16})}),(0,N.jsx)(`button`,{onClick:q,style:{padding:`6px 10px`,backgroundColor:`#FFFFFF`,border:`none`,cursor:`pointer`,display:`flex`,alignItems:`center`},title:`Next Blueprint (Right Arrow)`,children:(0,N.jsx)(o,{size:16})})]}),(0,N.jsxs)(`div`,{style:{display:`inline-flex`,alignItems:`center`,border:`1px solid var(--editorial-border)`,borderRadius:`var(--radius-xs)`,backgroundColor:`#FFFFFF`,padding:`0 4px`},children:[(0,N.jsx)(`button`,{onClick:()=>I(e=>Math.max(.5,Number((e-.15).toFixed(2)))),style:{padding:`6px`,border:`none`,background:`none`,cursor:`pointer`,display:`flex`,alignItems:`center`},title:`Zoom Out`,children:(0,N.jsx)(_,{size:14})}),(0,N.jsxs)(`span`,{style:{fontSize:`0.74rem`,fontWeight:700,padding:`0 6px`,fontFamily:`var(--font-mono)`},children:[Math.round(F*100),`%`]}),(0,N.jsx)(`button`,{onClick:()=>I(e=>Math.min(2.5,Number((e+.15).toFixed(2)))),style:{padding:`6px`,border:`none`,background:`none`,cursor:`pointer`,display:`flex`,alignItems:`center`},title:`Zoom In`,children:(0,N.jsx)(p,{size:14})}),(0,N.jsx)(`button`,{onClick:()=>I(1),style:{padding:`6px`,border:`none`,background:`none`,cursor:`pointer`,display:`flex`,alignItems:`center`,borderLeft:`1px solid var(--editorial-border)`},title:`Reset Zoom to 100%`,children:(0,N.jsx)(h,{size:12})})]}),(0,N.jsx)(`button`,{onClick:()=>H(!V),className:`btn btn-outline btn-sm`,style:{padding:`6px 10px`},title:V?`Exit Wide View`:`Wide View (Hide Sidebar)`,children:V?(0,N.jsx)(A,{size:14}):(0,N.jsx)(O,{size:14})}),(0,N.jsxs)(`button`,{onClick:()=>x(W.id),className:`btn btn-outline btn-sm`,style:{display:`inline-flex`,alignItems:`center`,gap:`5px`},title:`Download this uncropped sheet as SVG`,children:[(0,N.jsx)(S,{size:13}),` SVG`]}),(0,N.jsxs)(`button`,{onClick:()=>g(W.id),className:`btn btn-outline btn-sm`,style:{display:`inline-flex`,alignItems:`center`,gap:`5px`},title:`Download this uncropped sheet as high-res PNG`,children:[(0,N.jsx)(S,{size:13}),` PNG`]}),(0,N.jsxs)(`button`,{onClick:()=>v(W.id),className:`btn btn-secondary btn-sm`,style:{display:`inline-flex`,alignItems:`center`,gap:`5px`},title:`Print single sheet`,children:[(0,N.jsx)(m,{size:13}),` Print`]})]})]}),(0,N.jsx)(`div`,{ref:U,style:{width:`100%`,maxHeight:`680px`,overflowY:`auto`,overflowX:`auto`,display:`flex`,justifyContent:`center`,alignItems:`flex-start`,padding:`24px 12px`,backgroundColor:`#FAF8F4`,border:`1px solid var(--editorial-border)`,borderRadius:`2px`,boxSizing:`border-box`,scrollBehavior:`smooth`},children:(0,N.jsx)(`div`,{style:{width:`${Math.round(920*F)}px`,maxWidth:F===1?`920px`:`none`,aspectRatio:`920 / 1520`,backgroundColor:`#FFFFFF`,boxShadow:`0 16px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)`,border:`1px solid #C8C4B8`,transition:`width 0.2s ease`,flexShrink:0},dangerouslySetInnerHTML:{__html:W.svg}})}),(0,N.jsxs)(`div`,{style:{marginTop:`24px`,paddingTop:`20px`,borderTop:`1px solid var(--editorial-border)`},children:[(0,N.jsxs)(`h4`,{style:{fontSize:`0.90rem`,fontWeight:800,textTransform:`uppercase`,margin:`0 0 10px`,color:`var(--editorial-text)`},children:[`Architectural Wireframe Sections (Page `,W.pageNumber,`)`]}),(0,N.jsx)(`div`,{style:{display:`flex`,gap:`8px`,flexWrap:`wrap`,marginBottom:`12px`},children:(W.sections||[]).map((e,t)=>(0,N.jsx)(`span`,{style:{padding:`4px 10px`,fontSize:`0.76rem`,fontWeight:600,backgroundColor:`var(--editorial-bg-subtle)`,border:`1px solid var(--editorial-border)`,borderRadius:`2px`,color:`var(--editorial-text)`},children:e},t))}),(0,N.jsx)(`p`,{style:{margin:0,fontSize:`0.86rem`,color:`var(--editorial-text)`,opacity:.85,lineHeight:1.45},children:W.desc})]})]})]}),k===`continuous`&&(0,N.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`48px`,alignItems:`center`},children:[(0,N.jsxs)(`div`,{style:{width:`100%`,backgroundColor:`#FFFFFF`,border:`1px solid var(--editorial-border)`,padding:`16px 24px`,display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexWrap:`wrap`,gap:`12px`},children:[(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`span`,{style:{fontSize:`0.74rem`,fontWeight:800,color:`var(--editorial-accent)`,textTransform:`uppercase`,letterSpacing:`0.08em`},children:`CONTINUOUS UNCUT ARCHITECTURAL FEED`}),(0,N.jsx)(`h3`,{style:{margin:`2px 0 0`,fontSize:`1.2rem`,textTransform:`uppercase`,fontWeight:900},children:`All 21 Blueprint Sheets Stacked Uncropped`})]}),(0,N.jsxs)(`div`,{style:{display:`flex`,gap:`8px`},children:[(0,N.jsxs)(`button`,{onClick:u,className:`btn btn-primary btn-sm`,children:[(0,N.jsx)(S,{size:14}),` Download 21 ZIP`]}),(0,N.jsxs)(`button`,{onClick:f,className:`btn btn-outline btn-sm`,children:[(0,N.jsx)(m,{size:14}),` Print All 21`]})]})]}),X.map(e=>(0,N.jsxs)(`div`,{id:`blueprint-sheet-${e.id}`,style:{width:`100%`,maxWidth:`960px`,backgroundColor:`#FFFFFF`,border:`1px solid var(--editorial-border)`,padding:`28px`,boxShadow:`var(--shadow-card)`,display:`flex`,flexDirection:`column`,gap:`18px`},children:[(0,N.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,borderBottom:`1.5px solid var(--editorial-border)`,paddingBottom:`12px`,flexWrap:`wrap`,gap:`8px`},children:[(0,N.jsxs)(`div`,{children:[(0,N.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[(0,N.jsxs)(`span`,{style:{fontSize:`0.72rem`,fontWeight:800,color:`var(--editorial-accent)`,textTransform:`uppercase`,letterSpacing:`0.08em`},children:[`PAGE `,e.pageNumber,` OF 21`]}),(0,N.jsx)(`span`,{style:{fontSize:`0.68rem`,backgroundColor:`var(--editorial-bg-subtle)`,border:`1px solid var(--editorial-border)`,padding:`2px 6px`},children:e.category})]}),(0,N.jsx)(`h3`,{style:{margin:`3px 0 0`,fontSize:`1.25rem`,fontWeight:900,textTransform:`uppercase`,color:`var(--editorial-text)`},children:e.name})]}),(0,N.jsxs)(`div`,{style:{display:`flex`,gap:`6px`},children:[(0,N.jsxs)(`button`,{onClick:()=>{C(e.id),P(`sheet`)},className:`btn btn-outline btn-sm`,style:{fontSize:`0.74rem`,padding:`4px 10px`},children:[(0,N.jsx)(l,{size:12}),` Inspect Sheet`]}),(0,N.jsxs)(`button`,{onClick:()=>x(e.id),className:`btn btn-outline btn-sm`,style:{fontSize:`0.74rem`,padding:`4px 10px`},children:[(0,N.jsx)(S,{size:12}),` SVG`]})]})]}),(0,N.jsx)(`div`,{style:{width:`100%`,aspectRatio:`920 / 1520`,backgroundColor:`#FFFFFF`,boxShadow:`0 8px 24px rgba(0,0,0,0.08)`,border:`1px solid #D2D2D2`},dangerouslySetInnerHTML:{__html:e.svg}}),(0,N.jsx)(`div`,{style:{display:`flex`,gap:`6px`,flexWrap:`wrap`,paddingTop:`8px`,borderTop:`1px solid var(--editorial-border)`},children:(e.sections||[]).map((e,t)=>(0,N.jsx)(`span`,{style:{fontSize:`0.72rem`,backgroundColor:`var(--editorial-bg-subtle)`,padding:`3px 8px`,border:`1px solid var(--editorial-border)`},children:e},t))})]},e.id))]}),k===`grid`&&(0,N.jsx)(`div`,{children:(0,N.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(320px, 1fr))`,gap:`24px`},children:X.map(e=>(0,N.jsxs)(`div`,{style:{backgroundColor:`#FFFFFF`,border:`1px solid var(--editorial-border)`,boxShadow:`var(--shadow-card)`,display:`flex`,flexDirection:`column`,overflow:`hidden`,transition:`all 0.2s ease`,cursor:`pointer`},onClick:()=>{C(e.id),P(`sheet`)},children:[(0,N.jsxs)(`div`,{style:{padding:`14px 16px`,borderBottom:`1px solid var(--editorial-border)`,backgroundColor:`#FAF8F4`},children:[(0,N.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`4px`},children:[(0,N.jsxs)(`span`,{style:{fontSize:`0.68rem`,fontWeight:800,color:`var(--editorial-accent)`,textTransform:`uppercase`,letterSpacing:`0.08em`},children:[`SHEET `,e.pageNumber,` OF 21`]}),(0,N.jsx)(`span`,{style:{fontSize:`0.66rem`,backgroundColor:`#FFFFFF`,border:`1px solid var(--editorial-border)`,padding:`1px 6px`},children:e.category})]}),(0,N.jsx)(`h3`,{style:{fontSize:`1.05rem`,fontWeight:900,textTransform:`uppercase`,margin:0,color:`var(--editorial-text)`,lineHeight:1.25},children:e.name})]}),(0,N.jsx)(`div`,{style:{height:`380px`,backgroundColor:`#FFFFFF`,padding:`16px`,display:`flex`,alignItems:`center`,justifyContent:`center`,borderBottom:`1px solid var(--editorial-border)`,overflow:`hidden`},children:(0,N.jsx)(`div`,{style:{width:`100%`,height:`100%`,aspectRatio:`920 / 1520`,boxShadow:`0 4px 14px rgba(0,0,0,0.10)`,border:`1px solid #D2D2D2`,pointerEvents:`none`},dangerouslySetInnerHTML:{__html:d(e.svg)}})}),(0,N.jsxs)(`div`,{style:{padding:`14px 16px`,display:`flex`,flexDirection:`column`,gap:`8px`,flex:1,justifyContent:`space-between`},children:[(0,N.jsx)(`div`,{style:{fontSize:`0.74rem`,color:`var(--editorial-text)`,opacity:.8,lineHeight:1.35},children:e.desc}),(0,N.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,paddingTop:`8px`,borderTop:`1px dashed var(--editorial-border)`},children:[(0,N.jsx)(`span`,{style:{fontSize:`0.74rem`,fontWeight:800,color:`var(--editorial-accent)`},children:`Inspect Full Sheet Uncut →`}),(0,N.jsxs)(`button`,{onClick:t=>{t.stopPropagation(),x(e.id)},style:{background:`none`,border:`none`,cursor:`pointer`,color:`var(--editorial-text-muted)`,display:`flex`,alignItems:`center`,gap:`4px`,fontSize:`0.72rem`},title:`Download SVG`,children:[(0,N.jsx)(S,{size:13}),` SVG`]})]})]})]},e.id))})}),k===`spec`&&(0,N.jsxs)(`div`,{style:{backgroundColor:`#FFFFFF`,border:`1px solid var(--editorial-border)`,padding:`32px`,boxShadow:`var(--shadow-card)`},children:[(0,N.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`24px`,paddingBottom:`16px`,borderBottom:`1.5px solid var(--editorial-border)`,flexWrap:`wrap`,gap:`12px`},children:[(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`span`,{style:{fontSize:`0.74rem`,fontWeight:800,color:`var(--editorial-accent)`,textTransform:`uppercase`,letterSpacing:`0.08em`},children:`MARKDOWN SPECIFICATION`}),(0,N.jsx)(`h2`,{style:{fontSize:`1.45rem`,fontWeight:900,textTransform:`uppercase`,margin:`4px 0 0`,color:`var(--editorial-text)`},children:`System Architecture & Design Thinking Specs`})]}),(0,N.jsxs)(`div`,{style:{display:`flex`,gap:`8px`},children:[(0,N.jsxs)(`button`,{onClick:J,className:`btn btn-outline btn-sm`,style:{display:`inline-flex`,alignItems:`center`,gap:`6px`},children:[z?(0,N.jsx)(a,{size:14,color:`#2E7D32`}):(0,N.jsx)(w,{size:14}),(0,N.jsx)(`span`,{children:z?`Copied to Clipboard!`:`Copy Markdown`})]}),(0,N.jsxs)(`a`,{href:`data:text/markdown;charset=utf-8,%23%20LibraMind%20%E2%80%94%20AI-Powered%20Smart%20Library%20Management%20System%0A%23%23%20Complete%20Website%20Pages%20Blueprint%20%26%20Architecture%20Specification%0A%0AGenerated%3A%202026-10-30%20%7C%20Biophilic%20Design%20System%0A%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0ATABLE%20OF%20CONTENTS%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0A1.%20Architecture%20Overview%20%26%20Global%20Navigation%20Flow%0A2.%20Page%201%3A%20Landing%20Sanctuary%20(Home.jsx)%0A3.%20Page%202%3A%20Book%20Catalog%20%26%20Filter%20Grid%20(Catalog.jsx)%0A4.%20Page%203%3A%20Book%20Details%20%26%204-Tier%20Stack%20Navigator%20(BookDetails.jsx)%0A5.%20Page%204%3A%20AI%20Semantic%20Book%20Finder%20(AiBookFinder.jsx)%0A6.%20Page%205%3A%20Multi-Book%20Comparison%20Matrix%20(BookCompare.jsx)%0A7.%20Page%206%3A%20Study%20Pod%20%26%20Seat%20Concurrency%20Map%20(SeatAvailability.jsx)%0A8.%20Page%207%3A%20Library%20Visit%20Planner%20%26%20Stack%20Router%20(VisitPlanner.jsx)%0A9.%20Page%208%3A%20Student%20%26%20Member%20Sanctuary%20Hub%20(StudentDashboard.jsx)%0A10.%20Page%209%3A%20Librarian%20Circulation%20%26%20Barcode%20Desk%20(LibrarianDashboard.jsx)%0A11.%20Page%2010%3A%20Administrator%20Central%20Control%20(AdminDashboard.jsx)%0A12.%20Page%2011%3A%20Circulation%20Analytics%20%26%20Forecasting%20(AnalyticsPage.jsx)%0A13.%20Page%2012%3A%20Authentication%20%26%20Onboarding%20(Login.jsx%20%26%20Register.jsx)%0A%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0A1.%20ARCHITECTURE%20OVERVIEW%20%26%20GLOBAL%20NAVIGATION%20FLOW%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0AThe%20platform%20utilizes%20a%20Role-Based%20Single%20Page%20Architecture%20(SPA)%3A%0A%E2%80%A2%20Public%20Visitor%20Tier%3A%20Exploration%2C%20reading%20carousels%2C%20conceptual%20search%20preview.%0A%E2%80%A2%20Student%20%2F%20Member%20Tier%3A%20Self-service%20loans%2C%20returns%2C%20renewals%2C%20study%20seats%2C%20visit%20itinerary.%0A%E2%80%A2%20Librarian%20%2F%20Staff%20Tier%3A%20Barcode%20desk%2C%20manual%20check-in%2Fcheckout%2C%20inventory%20dispatch.%0A%E2%80%A2%20Administrator%20Tier%3A%20User%20role%20elevation%2C%20audit%20logs%2C%20system%20health%2C%20analytics.%0A%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%5B%20LIBRAMIND%20ROOT%20ROUTER%20%5D%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%E2%94%82%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20%20%20%20%E2%94%8C%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%AC%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%B4%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%AC%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%80%E2%94%90%20%20%20%20%20%20%7C%0A%7C%20%20%20%20%E2%96%BC%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%E2%96%BC%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%E2%96%BC%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%E2%96%BC%20%20%20%20%20%20%7C%0A%7C%20%5BPublic%20Tier%5D%20%20%20%5BMember%20Hub%20Tier%5D%20%20%20%20%20%20%20%20%20%20%20%20%20%20%5BStaff%20Desk%5D%20%20%20%20%20%20%20%20%5BAdmin%20Portal%5D%7C%0A%7C%20%E2%80%A2%20Home%20%20%20%20%20%20%20%20%20%20%E2%80%A2%20Student%20Hub%20(Overview)%20%20%20%20%20%20%20%E2%80%A2%20Issue%20%2F%20Scan%20%20%20%20%20%20%E2%80%A2%20User%20Control%7C%0A%7C%20%E2%80%A2%20Catalog%20%20%20%20%20%20%20%E2%80%A2%20My%20Loans%20(Return%20%2F%20Renew)%20%20%20%20%E2%80%A2%20Returns%20Desk%20%20%20%20%20%20%E2%80%A2%20Audit%20Logs%20%20%7C%0A%7C%20%E2%80%A2%20AI%20Finder%20%20%20%20%20%E2%80%A2%20Hold%20Queues%20(FIFO%20Rank)%20%20%20%20%20%20%E2%80%A2%20Inventory%20Desk%20%20%20%20%E2%80%A2%20Demand%20Metr.%7C%0A%7C%20%E2%80%A2%20Seat%20Booking%20%20%E2%80%A2%20Study%20Pods%20%26%20Wishlist%20%20%20%20%20%20%20%20%E2%80%A2%20Overdue%20Hand-off%20%20%E2%80%A2%20System%20Sec.%20%7C%0A%7C%20%E2%80%A2%20Visit%20Planner%20%E2%80%A2%20Book%20Details%20%26%20Compare%20%20%20%20%20%20%20%E2%80%A2%20Barcode%20Engine%20%20%20%20%E2%80%A2%20Roles%20Config%7C%0A%2B---------------------------------------------------------------------------------%2B%0A%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0APAGE%201%3A%20LANDING%20SANCTUARY%20(Home.jsx)%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0A%E2%80%A2%20Route%3A%20%2F%20or%20%2Fhome%0A%E2%80%A2%20Access%3A%20Public%20%2F%20All%20Roles%0A%E2%80%A2%20Purpose%3A%20Biophilic%20welcome%2C%20instant%20search%2C%20member%20quick-status%2C%20curated%20masterworks.%0A%0A%5B%20WIREFRAME%20LAYOUT%20%5D%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20%5BUserNavbar%20%2F%20Navbar%5D%20(Sticky%2C%20Glassmorphism%2C%20Role%20Indicator)%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20HERO%20BANNER%3A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20-%20Biophilic%20Gradient%20(Dark%20Forest%20%26%20Botanical%20Sage)%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20-%20Headline%3A%20%22A%20Sanctuary%20of%20Calm%2C%20Literature%20%26%20Timeless%20Stories%22%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20-%20%5B%20Frosted%20Glass%20Search%20Bar%3A%20Title%2C%20Author%2C%20Keyword%20%7C%20%5BFind%20Books%5D%20%5D%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20-%20Quick%20Topic%20Tags%3A%20%5BSpiritual%5D%20%5BNovels%5D%20%5BStory%20Books%5D%20%5BFiction%5D%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20-%20Hero%20Actions%3A%20%5B%20%F0%9F%93%90%20Download%20Blueprints%20%5D%20%5B%20%F0%9F%8C%BF%20Member%20Sign%20In%20%5D%20%5B%20Register%20%5D%20%20%20%20%7C%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20LIVE%20STATS%20STRIP%3A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20%5B%2060%2B%20Curated%20Titles%20%5D%20%5B%2012%20Study%20Pods%20Open%20%5D%20%5B%203%20Reading%20Floors%20%5D%20%5B%20100%25%20Mapped%5D%7C%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20MEMBER%20QUICK-CARD%20(Rendered%20only%20when%20logged%20in)%3A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20%5B%20Active%20Loans%3A%203%20%5D%20%5B%20Hold%20Queues%3A%201%20%5D%20%5B%20Study%20Pods%3A%2012%20Open%20%5D%20%5B%20Wishlist%3A%204%20%5D%20%20%7C%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20CURATED%20MASTERWORKS%20CAROUSELS%3A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%201.%20Spiritual%20%26%20Wisdom%20Masterworks%20(Bhagavad%20Gita%2C%20Power%20of%20Now%2C%20Tao%20Te%20Ching)%20%20%20%7C%0A%7C%202.%20Timeless%20Classic%20Novels%20(War%20and%20Peace%2C%201984%2C%20Pride%20and%20Prejudice)%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%203.%20Emotional%20%26%20Philosophical%20Fiction%20(The%20Alchemist%2C%20Norwegian%20Wood)%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20ARCHITECTURE%20BLUEPRINT%20DOWNLOAD%20SECTION%3A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20%5B%20%F0%9F%93%A5%20Download%20.MD%20%5D%20%5B%20%F0%9F%93%84%20Download%20.TXT%20%5D%20%5B%20%F0%9F%96%A8%EF%B8%8F%20Print%20%2F%20Save%20PDF%20%5D%20%5B%20%F0%9F%91%81%EF%B8%8F%20Preview%20%5D%20%20%7C%0A%2B---------------------------------------------------------------------------------%2B%0A%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0APAGE%202%3A%20BOOK%20CATALOG%20%26%20FILTER%20GRID%20(Catalog.jsx)%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0A%E2%80%A2%20Route%3A%20%2Fcatalog%20or%20%2Fbooks%0A%E2%80%A2%20Access%3A%20Public%20%2F%20All%20Roles%0A%E2%80%A2%20Purpose%3A%20Full%20library%20collection%20exploration%20with%20multi-attribute%20filtering.%0A%0A%5B%20WIREFRAME%20LAYOUT%20%5D%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20%5B%20%F0%9F%94%8D%20Search%20by%20title%2C%20author%2C%20ISBN...%20%5D%20%5B%20Category%20Filter%20v%20%5D%20%5B%20Sort%3A%20Popular%20v%5D%7C%0A%7C%20Toggle%3A%20%5Bx%5D%20Available%20Now%20Only%20%20%20%20Layout%3A%20%5B%20Grid%20Mode%20%5D%20%5B%20List%20Mode%20%5D%20%20%20%20%20%20%20%20%20%20%20%7C%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20ACTIVE%20FILTER%20PILLS%3A%20%5BCategory%3A%20Spiritual%20x%5D%20%5BFloor%202%20x%5D%20%5BClear%20All%5D%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20RESULTS%20GRID%20(Responsive%201-4%20Columns)%3A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20%2B-------------------------%2B%20%2B-------------------------%2B%20%2B---------------------%2B%20%7C%0A%7C%20%7C%20%5BCover%20Image%20Art%5D%20%20%20%20%20%20%20%7C%20%7C%20%5BCover%20Image%20Art%5D%20%20%20%20%20%20%20%7C%20%7C%20%5BCover%20Image%20Art%5D%20%20%20%7C%20%7C%0A%7C%20%7C%20Title%20%26%20Author%20Name%20%20%20%20%20%7C%20%7C%20Title%20%26%20Author%20Name%20%20%20%20%20%7C%20%7C%20Title%20%26%20Author%20Name%20%7C%20%7C%0A%7C%20%7C%20Category%20%26%20Floor%20Badge%20%20%7C%20%7C%20Category%20%26%20Floor%20Badge%20%20%7C%20%7C%20Category%20%26%20Floor%20Bdg%7C%20%7C%0A%7C%20%7C%20Status%3A%20%F0%9F%9F%A2%203%20Available%20%20%20%7C%20%7C%20Status%3A%20%F0%9F%9F%A1%20Hold%20(Queue)%20%7C%20%7C%20Status%3A%20%F0%9F%9F%A2%201%20Avail%20%20%7C%20%7C%0A%7C%20%7C%20%5BDetails%5D%20%5B%E2%9A%96%EF%B8%8F%20Compare%5D%20%20%20%7C%20%7C%20%5BDetails%5D%20%5B%E2%9A%96%EF%B8%8F%20Compare%5D%20%20%20%7C%20%7C%20%5BDetails%5D%20%5B%E2%9A%96%EF%B8%8F%20Comp%5D%20%7C%20%7C%0A%7C%20%2B-------------------------%2B%20%2B-------------------------%2B%20%2B---------------------%2B%20%7C%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20PAGINATION%3A%20%5B%3C%20Previous%5D%20Page%201%20of%206%20%5BNext%20%3E%5D%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%2B---------------------------------------------------------------------------------%2B%0A%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0APAGE%203%3A%20BOOK%20DETAILS%20%26%204-TIER%20STACK%20(BookDetails.jsx)%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0A%E2%80%A2%20Route%3A%20%2Fbook-details%2F%3Aid%0A%E2%80%A2%20Access%3A%20Public%20View%20%2F%20Self-Borrowing%20requires%20Student%20Auth%0A%E2%80%A2%20Purpose%3A%20Book%20metadata%2C%20physical%20copy%20status%2C%20exact%20shelf%20navigation%20coordinates.%0A%0A%5B%20WIREFRAME%20LAYOUT%20%5D%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20Breadcrumbs%3A%20Catalog%20%3E%20Spiritual%20%26%20Wisdom%20%3E%20The%20Power%20of%20Now%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%2B---------------------------------------%2B-----------------------------------------%2B%0A%7C%20LEFT%20PANEL%3A%20COVER%20%26%20SMART%20ACTIONS%20%20%20%20%20%7C%20RIGHT%20PANEL%3A%20METADATA%20%26%204-TIER%20STACK%20%20%20%20%7C%0A%7C%20-%20High-Resolution%20Book%20Cover%20%20%20%20%20%20%20%20%20%20%7C%20-%20Title%3A%20The%20Power%20of%20Now%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20-%20ISBN%2C%20Edition%2C%20Year%2C%20Publisher%20%20%20%20%20%20%7C%20-%20Author%3A%20Eckhart%20Tolle%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20-%20Full%20Synopsis%20%26%20Theme%20Tags%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20DYNAMIC%20ACTION%20CARD%3A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20%5BIf%20Available%5D%3A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%204-TIER%20SPATIAL%20COORDINATE%20CARD%3A%20%20%20%20%20%20%20%20%20%7C%0A%7C%20%20%20-%3E%20%5B%20Borrow%20Now%20(14%20Days)%20%5D%20%20%20%20%20%20%20%20%20%7C%20%2B-------------------------------------%2B%20%7C%0A%7C%20%20%20-%3E%20%5B%20Add%20to%20Visit%20Planner%20%5D%20%20%20%20%20%20%20%20%20%7C%20%7C%201.%20Floor%20Level%3A%20%20%20%20%20Floor%202%20%20%20%20%20%20%20%20%20%7C%20%7C%0A%7C%20%20%20-%3E%20%5B%20Add%20to%20Compare%20%5D%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20%7C%202.%20Subject%20Section%3A%20Wisdom%20Section%20%20%7C%20%7C%0A%7C%20%5BIf%20Currently%20Borrowed%20by%20You%5D%3A%20%20%20%20%20%20%20%7C%20%7C%203.%20Shelf%20Aisle%3A%20%20%20%20%20SW-02%20%20%20%20%20%20%20%20%20%20%20%7C%20%7C%0A%7C%20%20%20-%3E%20%5B%20%E2%9C%93%20Return%20Book%20%5D%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20%7C%204.%20Specific%20Rack%3A%20%20%20Unit%2004%20%20%20%20%20%20%20%20%20%7C%20%7C%0A%7C%20%20%20-%3E%20%5B%20Renew%20(%2B14%20Days)%20%5D%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20%2B-------------------------------------%2B%20%7C%0A%7C%20%20%20-%3E%20%5B%20Open%20My%20Loans%20Hub%20%5D%20%20%20%20%20%20%20%20%20%20%20%20%7C%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20%5BIf%20Out%20of%20Stock%5D%3A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20PHYSICAL%20COPY%20INVENTORY%3A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20%20%20-%3E%20%5B%20Join%20Waitlist%20(Queue%20%231)%20%5D%20%20%20%20%20%7C%20%E2%80%A2%20Copy%20%231%20(LM-SW-02-C1)%3A%20%F0%9F%9F%A2%20Available%20%20%7C%0A%7C%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20%E2%80%A2%20Copy%20%232%20(LM-SW-02-C2)%3A%20%F0%9F%94%B4%20Borrowed%20%20%20%7C%0A%7C%20-%20%5B%20Save%20to%20Personal%20Wishlist%20%5D%20%20%20%20%20%20%20%7C%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%2B---------------------------------------%2B-----------------------------------------%2B%0A%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0APAGE%204%3A%20AI%20SEMANTIC%20BOOK%20FINDER%20(AiBookFinder.jsx)%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0A%E2%80%A2%20Route%3A%20%2Fai-finder%0A%E2%80%A2%20Engine%3A%20In-memory%20TF-IDF%20Vector%20Space%20%26%20Cosine%20Similarity%20(%3C15ms%20response).%0A%E2%80%A2%20Purpose%3A%20Natural%20language%20conceptual%20search%20when%20exact%20keywords%20are%20unknown.%0A%0A%5B%20WIREFRAME%20LAYOUT%20%5D%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20HERO%3A%20%22Explainable%20AI%20Semantic%20Research%20Assistant%22%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20%5B%20%F0%9F%A7%A0%20Describe%20what%20you%20want%20to%20feel%20or%20explore...%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20%5BSearch%20AI%5D%20%5D%20%20%7C%0A%7C%20Idea%20Prompts%3A%20%5BOvercoming%20Anxiety%5D%20%5BDuty%20and%20Destiny%5D%20%5BEgo%20Dissolution%5D%20%20%20%20%20%20%20%20%20%7C%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20MATCH%20RESULTS%20WITH%20EXPLAINABLE%20RATIONALE%3A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20%2B-----------------------------------------------------------------------------%2B%20%7C%0A%7C%20%7C%20Book%3A%20The%20Power%20of%20Now%20(Eckhart%20Tolle)%20%20%20%20%20%20%20%20%20%20%20Match%20Score%3A%20%5B%2094.2%25%20Match%5D%7C%20%7C%0A%7C%20%7C%20%F0%9F%92%A1%20Explainable%20AI%20Match%20Rationale%3A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20%7C%0A%7C%20%7C%20%22High%20conceptual%20overlap%20on%20tokens%3A%20'present%20moment'%2C%20'inner%20silence'%2C%20%20%20%20%20%20%7C%20%7C%0A%7C%20%7C%20%20and%20'mindfulness'%20extracted%20from%20chapter%20synopses.%22%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20%7C%0A%7C%20%7C%20Actions%3A%20%5B%20Borrow%20Book%20%5D%20%5B%20View%20Shelf%3A%20Fl%202%20%3E%20SW-02%20%5D%20%5B%20Compare%20%5D%20%20%20%20%20%20%20%20%20%20%20%20%7C%20%7C%0A%7C%20%2B-----------------------------------------------------------------------------%2B%20%7C%0A%2B---------------------------------------------------------------------------------%2B%0A%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0APAGE%205%3A%20MULTI-BOOK%20COMPARISON%20MATRIX%20(BookCompare.jsx)%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0A%E2%80%A2%20Route%3A%20%2Fcompare%0A%E2%80%A2%20Access%3A%20Public%20%2F%20All%20Roles%0A%E2%80%A2%20Purpose%3A%20Compare%202%20to%204%20books%20side-by-side%20to%20make%20the%20best%20reading%20decision.%0A%0A%5B%20WIREFRAME%20LAYOUT%20%5D%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20TRAY%20HEADER%3A%20Comparing%203%20Books%20%5B%20Clear%20All%20%5D%20%5B%20%2B%20Add%20Book%20%5D%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20COMPARISON%20MATRIX%20TABLE%20(Responsive%20Horizontal%20Scroll)%3A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20Attribute%20%20%20%20%20%20%20%20%20%20%7C%20Book%201%20(Bhagavad%20Gita)%20%7C%20Book%202%20(Power%20of%20Now)%20%7C%20Book%203%20(Siddhartha)%20%7C%0A%7C%20Cover%20Thumbnail%20%20%20%20%7C%20%5BImage%5D%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20%5BImage%5D%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20%5BImage%5D%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20Author%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20Eknath%20Easwaran%20%20%20%20%20%20%20%20%7C%20Eckhart%20Tolle%20%20%20%20%20%20%20%20%20%7C%20Hermann%20Hesse%20%20%20%20%20%20%20%7C%0A%7C%20Primary%20Category%20%20%20%7C%20Spiritual%20%26%20Wisdom%20%20%20%20%20%7C%20Modern%20Mindfulness%20%20%20%20%7C%20Classic%20Fiction%20%20%20%20%20%7C%0A%7C%20Page%20Count%20%20%20%20%20%20%20%20%20%7C%20384%20Pages%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20256%20Pages%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20152%20Pages%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20Spatial%20Location%20%20%20%7C%20Fl%202%20%3E%20Section%20SP%20%3E%2001%20%7C%20Fl%202%20%3E%20Section%20SW%20%3E%2004%7C%20Fl%201%20%3E%20Section%20CL%20%20%20%7C%0A%7C%20Real-time%20Status%20%20%20%7C%20%F0%9F%9F%A2%20Available%20(3)%20%20%20%20%20%20%20%7C%20%F0%9F%9F%A0%20Borrowed%20by%20You%20%20%20%20%7C%20%F0%9F%94%B4%20Waitlist%20(2%20in%20Q)%7C%0A%7C%20Contextual%20Action%20%20%7C%20%5B%20Borrow%20Book%20%5D%20%20%20%20%20%20%20%20%7C%20%5B%20%E2%9C%93%20Return%20Loan%20%5D%20%20%20%20%20%7C%20%5B%20Join%20Waitlist%20%5D%20%20%20%7C%0A%2B---------------------------------------------------------------------------------%2B%0A%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0APAGE%206%3A%20STUDY%20POD%20%26%20SEAT%20AVAILABILITY%20(SeatAvailability.jsx)%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0A%E2%80%A2%20Route%3A%20%2Fseats%0A%E2%80%A2%20Safety%3A%20Strict%20SQLite%20partial%20unique%20indexes%20serialize%20concurrent%20bookings.%0A%E2%80%A2%20Purpose%3A%20Interactive%20visual%20map%20of%2040%20study%20seats%20across%20multiple%20zones.%0A%0A%5B%20WIREFRAME%20LAYOUT%20%5D%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20FLOOR%20TABS%3A%20%5B%20Floor%201%3A%20Garden%20Commons%20%5D%20%5B%20Floor%202%3A%20Silent%20Mezzanine%20%5D%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20ZONE%20LEGEND%3A%20%F0%9F%9F%A2%20Available%20(24)%20%20%20%F0%9F%94%B4%20Occupied%20(12)%20%20%20%F0%9F%9F%A1%20Reserved%20(4)%20%20%20%E2%9A%AA%20Offline%7C%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20FILTERS%3A%20Date%3A%20%5BToday%20v%5D%20%20Slot%3A%20%5B2%20PM%20-%204%20PM%20v%5D%20%20Zone%3A%20%5BWindow%20Focus%20v%5D%20%20%20%20%20%20%20%20%20%7C%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20INTERACTIVE%20SEAT%20GRID%3A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20%2B----------------------%2B%20%2B----------------------%2B%20%2B----------------------%2B%20%20%20%20%20%20%7C%0A%7C%20%7C%20Pod%20F2-01%20%5BWindow%5D%20%20%20%7C%20%7C%20Pod%20F2-02%20%5BSilent%5D%20%20%20%7C%20%7C%20Pod%20F2-03%20%5BCollab%5D%20%20%20%7C%20%20%20%20%20%20%7C%0A%7C%20%7C%20%F0%9F%9F%A2%20Available%20%20%20%20%20%20%20%20%20%7C%20%7C%20%F0%9F%94%B4%20Occupied%20%20%20%20%20%20%20%20%20%20%7C%20%7C%20%F0%9F%9F%A2%20Available%20%20%20%20%20%20%20%20%20%7C%20%20%20%20%20%20%7C%0A%7C%20%7C%20%5B%20Reserve%20Slot%20%5D%20%20%20%20%20%7C%20%7C%20%5B%20Booked%20Until%204pm%20%5D%20%7C%20%7C%20%5B%20Reserve%20Slot%20%5D%20%20%20%20%20%7C%20%20%20%20%20%20%7C%0A%7C%20%2B----------------------%2B%20%2B----------------------%2B%20%2B----------------------%2B%20%20%20%20%20%20%7C%0A%2B---------------------------------------------------------------------------------%2B%0A%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0APAGE%207%3A%20LIBRARY%20VISIT%20PLANNER%20(VisitPlanner.jsx)%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0A%E2%80%A2%20Route%3A%20%2Fvisit-planner%0A%E2%80%A2%20Purpose%3A%20Turn%20a%20digital%20reading%20list%20into%20an%20optimized%20in-stack%20walking%20route.%0A%0A%5B%20WIREFRAME%20LAYOUT%20%5D%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20HEADER%3A%20%22Optimize%20Your%20Physical%20Library%20Visit%20Itinerary%22%20(3%20Books%20Selected)%20%20%20%20%20%7C%0A%2B---------------------------------------%2B-----------------------------------------%2B%0A%7C%20LEFT%3A%20OPTIMIZED%20STACK%20WALKING%20ROUTE%20%20%20%7C%20RIGHT%3A%20PHYSICAL%20RETRIEVAL%20CHECKLIST%20%20%20%20%20%7C%0A%7C%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20STOP%201%3A%20Floor%201%20(Classic%20Fiction)%20%20%20%20%20%7C%20%5B%20%5D%201.%20War%20and%20Peace%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20%E2%9E%94%20Section%20CL%20%3E%20Aisle%20CL-03%20%3E%20Rack%2002%20%20%7C%20%20%20%20%20Loc%3A%20Fl%201%20%3E%20CL-03%20%3E%20R02%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20%E2%9E%94%20Book%3A%20War%20and%20Peace%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20%20%20%20%20Barcode%3A%20LM-CL-03-C1%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20STOP%202%3A%20Floor%202%20(Spiritual%20%26%20Wisdom)%20%20%7C%20%5B%20%5D%202.%20The%20Power%20of%20Now%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20%E2%9E%94%20Section%20SW%20%3E%20Aisle%20SW-02%20%3E%20Rack%2004%20%20%7C%20%20%20%20%20Loc%3A%20Fl%202%20%3E%20SW-02%20%3E%20R04%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20%E2%9E%94%20Book%3A%20The%20Power%20of%20Now%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20%5B%20Print%20Itinerary%20%5D%20%5B%20Send%20to%20Device%20%5D%20%20%7C%0A%2B---------------------------------------%2B-----------------------------------------%2B%0A%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0APAGE%208%3A%20MEMBER%20SANCTUARY%20HUB%20(StudentDashboard.jsx)%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0A%E2%80%A2%20Route%3A%20%2Fdashboard%0A%E2%80%A2%20Access%3A%20Protected%20(Student%20%2F%20Member%20Role)%0A%E2%80%A2%20Navigation%3A%20Managed%20by%20UserNavbar%20Tier%201%20%26%20Tier%202%20sub-navigation%20bar.%0A%0A%5B%20WIREFRAME%20LAYOUT%20%5D%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20%5BUserNavbar%20Tier%201%3A%20Main%20Site%20Links%20%2B%20Profile%20Chip%5D%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20%5BUserNavbar%20Tier%202%3A%20%5BOverview%5D%20%5BLoans%20(3)%5D%20%5BHolds%20(1)%5D%20%5BPods%20(1)%5D%20%5BAI%20For%20You%5D%5D%20%7C%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20WELCOME%20STRIP%3A%20%22Welcome%2C%20Aarav%20Sharma%20(STU-1001)%20%C2%B7%20Account%20in%20Good%20Standing%22%20%20%20%20%7C%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20ACTIVE%20TAB%20CONTENT%20(Example%3A%20'My%20Loans'%20Active%20View)%3A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20%2B-----------------------------------------------------------------------------%2B%20%7C%0A%7C%20%7C%20%5BCover%5D%20The%20Power%20of%20Now%20(Eckhart%20Tolle)%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20%7C%0A%7C%20%7C%20Borrowed%3A%20Oct%2012%2C%202026%20%20%20Due%3A%20Oct%2026%2C%202026%20(Due%20in%204%20Days)%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20%7C%0A%7C%20%7C%20Status%3A%20%F0%9F%9F%A2%20Borrowed%20(On%20Time)%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Barcode%3A%20LM-SW-02-C1%20%20%20%20%20%20%20%20%20%20%7C%20%7C%0A%7C%20%7C%20Actions%3A%20%5B%20%E2%9C%93%20Return%20Book%20%5D%20%20%20%5B%20Renew%20(%2B14%20Days)%20%5D%20%20%20%5B%20Stack%20Coordinates%20%5D%20%20%20%7C%20%7C%0A%7C%20%2B-----------------------------------------------------------------------------%2B%20%7C%0A%7C%20%2B-----------------------------------------------------------------------------%2B%20%7C%0A%7C%20%7C%20%5BCover%5D%20The%20Bhagavad%20Gita%20(Eknath%20Easwaran)%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20%7C%0A%7C%20%7C%20Borrowed%3A%20Oct%2010%2C%202026%20%20%20Due%3A%20Oct%2024%2C%202026%20(Due%20in%202%20Days)%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20%7C%0A%7C%20%7C%20Status%3A%20%F0%9F%9F%A1%20Due%20Soon%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Barcode%3A%20LM-SP-01-C3%20%20%20%20%20%20%20%20%20%20%20%7C%20%7C%0A%7C%20%7C%20Actions%3A%20%5B%20%E2%9C%93%20Return%20Book%20%5D%20%20%20%5B%20Renew%20(%2B14%20Days)%20%5D%20%20%20%5B%20Stack%20Coordinates%20%5D%20%20%20%7C%20%7C%0A%7C%20%2B-----------------------------------------------------------------------------%2B%20%7C%0A%2B---------------------------------------------------------------------------------%2B%0A%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0APAGE%209%3A%20LIBRARIAN%20CIRCULATION%20DESK%20(LibrarianDashboard.jsx)%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0A%E2%80%A2%20Route%3A%20%2Flibrarian%0A%E2%80%A2%20Access%3A%20Protected%20(Librarian%20Role)%0A%E2%80%A2%20Purpose%3A%20Barcode%20issue%2Freturn%2C%20auto-waitlist%20dispatch%2C%20inventory%20control.%0A%0A%5B%20WIREFRAME%20LAYOUT%20%5D%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20TABS%3A%20%5B%20Barcode%20Issue%20Desk%20%5D%20%5B%20Return%20Workbench%20%5D%20%5B%20Inventory%20%5D%20%5B%20Queue%20Dispatch%5D%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20BARCODE%20ISSUE%20WORKSPACE%3A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%201.%20Enter%20Patron%20ID%3A%20%5B%20STU-1001%20%5D%20%E2%9E%94%20Aarav%20Sharma%20(Eligibility%3A%203%2F10%20Active)%20%20%20%20%20%20%7C%0A%7C%202.%20Scan%20Barcode%3A%20%20%20%20%5B%20LM-SW-02-C1%20%5D%20%E2%9E%94%20The%20Power%20of%20Now%20(Copy%20%231)%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20%5B%20Complete%20Checkout%20(Issue%2014-Day%20Loan)%20%5D%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20QUICK%20RETURN%20WORKBENCH%3A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20%5B%20Scan%20Return%20Barcode%3A%20_____________________%20%5D%20%5B%20Confirm%20Check-In%20%5D%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20*%20System%20checks%20if%20title%20is%20on%20hold%3A%20Auto-dispatches%20to%20Queue%20%231%20patron%20%20%20%20%20%20%20%20%20%7C%0A%2B---------------------------------------------------------------------------------%2B%0A%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0APAGE%2010%3A%20ADMINISTRATOR%20CENTRAL%20CONTROL%20(AdminDashboard.jsx)%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0A%E2%80%A2%20Route%3A%20%2Fadmin%0A%E2%80%A2%20Access%3A%20Protected%20(Admin%20Role%20with%20Secondary%20Security%20Verification)%0A%E2%80%A2%20Purpose%3A%20User%20permissions%2C%20live%20audit%20log%20stream%2C%20system%20health.%0A%0A%5B%20WIREFRAME%20LAYOUT%20%5D%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20HEALTH%3A%20%F0%9F%9F%A2%20System%20Operational%20%7C%20Active%20Connections%3A%206%20%7C%20DB%3A%20libramind.db%20%20%20%20%20%20%20%20%7C%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20METRICS%20ROW%3A%20%5B%20Total%20Users%3A%206%20%5D%20%5B%20Titles%3A%2045%20%5D%20%5B%20Active%20Loans%3A%2018%20%5D%20%5B%20Pods%3A%2065%25%5D%7C%0A%2B---------------------------------------%2B-----------------------------------------%2B%0A%7C%20USER%20DIRECTORY%20%26%20ROLE%20MANAGEMENT%20%20%20%20%20%20%7C%20REAL-TIME%20SECURITY%20AUDIT%20LOG%20STREAM%20%20%20%20%20%7C%0A%7C%20%5B%20Search%20user%20name%20or%20email...%20%5D%20%20%20%20%20%20%7C%20%E2%80%A2%2015%3A02%3A11%20STU-1001%20Borrowed%20Copy%20C1%20%20%20%20%7C%0A%7C%20-%20Dr.%20Eleanor%20Vance%20%5BRole%3A%20Admin%5D%20%20%20%20%20%7C%20%E2%80%A2%2014%3A58%3A20%20LIB-5001%20Checked%20In%20Copy%20C2%20%20%7C%0A%7C%20-%20Marcus%20Thorne%20%20%20%20%20%5BRole%3A%20Librarian%5D%20%7C%20%E2%80%A2%2014%3A30%3A05%20STU-1002%20Reserved%20Pod%20F2-01%20%20%7C%0A%7C%20-%20Aarav%20Sharma%20%20%20%20%20%20%5BRole%3A%20Student%5D%20%20%20%7C%20%E2%80%A2%2014%3A15%3A22%20ADM-9001%20System%20Config%20Update%7C%0A%7C%20Actions%3A%20%5B%20Change%20Role%20%5D%20%5B%20Reset%20PW%20%5D%20%7C%20%5B%20Export%20Logs%20to%20CSV%20%5D%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%2B---------------------------------------%2B-----------------------------------------%2B%0A%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0APAGE%2011%3A%20CIRCULATION%20ANALYTICS%20(AnalyticsPage.jsx)%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0A%E2%80%A2%20Route%3A%20%2Fanalytics%0A%E2%80%A2%20Access%3A%20Protected%20(Staff%20%26%20Admin)%0A%E2%80%A2%20Purpose%3A%20Demand%20forecasting%2C%20category%20turnover%2C%20peak%20study%20hours.%0A%0A%5B%20WIREFRAME%20LAYOUT%20%5D%0A%2B---------------------------------------------------------------------------------%2B%0A%7C%20RANGE%3A%20%5B%20Last%207%20Days%20%5D%20%5B%20Last%2030%20Days%20%5D%20%5B%20This%20Academic%20Semester%20%5D%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%2B---------------------------------------%2B-----------------------------------------%2B%0A%7C%20CIRCULATION%20BY%20GENRE%20(Chart)%3A%20%20%20%20%20%20%20%20%20%7C%20STUDY%20POD%20PEAK%20OCCUPANCY%20(Chart)%3A%20%20%20%20%20%20%20%7C%0A%7C%20%E2%96%88%20Spiritual%20%26%20Wisdom%3A%2042%25%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20Peak%20Study%20Hours%3A%202%3A00%20PM%20-%205%3A00%20PM%20%20%20%20%20%7C%0A%7C%20%E2%96%88%20Classic%20Literature%3A%2028%25%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20Highest%20Demand%20Zone%3A%20Floor%202%20Window%20Nook%7C%0A%7C%20%E2%96%88%20Emotional%20Fiction%3A%2020%25%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%2B---------------------------------------%2B-----------------------------------------%2B%0A%7C%20ACQUISITIONS%20FORECASTING%3A%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7C%0A%7C%20%E2%80%A2%20The%20Power%20of%20Now%3A%2034%20loans%20%2F%204%20waitlist%20%E2%9E%94%20Recommendation%3A%20Order%202%20copies%20%20%20%20%20%7C%0A%2B---------------------------------------------------------------------------------%2B%0A%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0A14.%20HUMAN-CENTERED%20DESIGN%20THINKING%2015-STAGE%20ARCHITECTURE%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0A%E2%80%A2%20Stage%201%20(Title%20Slide)%3A%20Project%20title%2C%20team%20members%2C%20roll%20numbers%2C%20department%2C%20institution%2C%20mentor.%0A%E2%80%A2%20Stage%202%20(Introduction)%3A%20Physical%20retrieval%20dilemmas%20(%CE%BC%3D14.2%20min)%20vs%20biophilic%20smart%20sanctuary%20paradigm.%0A%E2%80%A2%20Stage%203%20(Project%20Overview)%3A%20Tri-portal%20scope%20(Member%2C%20Librarian%2C%20Admin)%2C%20sub-2.5%20min%20retrieval%20target.%0A%E2%80%A2%20Stage%204%20(User%20Research)%3A%20Stratified%20random%20sampling%20(N%3D184)%2C%2024%20interviews%2C%2040%20hrs%20ethnographic%20inquiry.%0A%E2%80%A2%20Stage%205%20(Empathise)%3A%204-quadrant%20empathy%20map%20(Think%2C%20Feel%2C%20Say%2C%20Do)%2C%20phantom%20availability%20pain%20point.%0A%E2%80%A2%20Stage%206%20(Statistical%20Findings)%3A%20Gaussian%20density%20PDF%2C%20Pearson%20r%3D0.78%2C%20two-sample%20t(183)%3D11.42%2C%20p%3C0.0001.%0A%E2%80%A2%20Stage%207%20(Define)%3A%20Persona%20(Aarav%20Sharma)%2C%20POV%2C%20HMW%20spatial%20routing%2C%20MoSCoW%20prioritization.%0A%E2%80%A2%20Stage%208%20(Ideation)%3A%20Crazy%20Eights%2C%20SCAMPER%2C%204%20multidisciplinary%20engineering%20pillars%20%26%20sketches.%0A%E2%80%A2%20Stage%209%20(Idea%20Selection)%3A%20Weighted%20MCDA%20matrix%20(89.5%2F100%20for%20biophilic%20web%20architecture)%20%26%20hypotheses.%0A%E2%80%A2%20Stage%2010%20(Prototype)%3A%20Fullstack%20React%2018%2C%20Node%20Express%20REST%2C%20FastAPI%20AI%20NLP%20microservice%2C%20WAL%20SQLite.%0A%E2%80%A2%20Stage%2011%20(Testing%20%26%20Validation)%3A%20TCR%20(96.8%25)%2C%20SUS%20score%2088.6%2F100%20(A%2B%20grade)%2C%20paired%20t%3D9.87%2C%20p%3C0.0001.%0A%E2%80%A2%20Stage%2012%20(Results%20%26%20Iterations)%3A%2012-hr%20AM%2FPM%20slots%2C%20responsive%20touch%20layouts%2C%2085%25%20search%20time%20reduction.%0A%E2%80%A2%20Stage%2013%20(Impact%20%26%20Limitations)%3A%20600%2B%20monthly%20study%20hours%20saved%2C%20single-scan%20desk%2C%20boundary%20constraints.%0A%E2%80%A2%20Stage%2014%20(Conclusion%20%26%20Roadmap)%3A%20Spatial%20certainty%20primacy%2C%20IoT%20RFID%20smart%20drop%20bins%2C%20vector%20embeddings.%0A%E2%80%A2%20Stage%2015%20(References%20%26%20Q%26A)%3A%20Brown%2C%20Norman%2C%20ACRL%2C%20Kleinrock%2C%20Vaswani%20academic%20citations%20%26%20viva%20defense.%0A`,download:`LibraMind-Architecture-Specification.md`,className:`btn btn-primary btn-sm`,style:{display:`inline-flex`,alignItems:`center`,gap:`6px`},children:[(0,N.jsx)(S,{size:14}),` Download .MD`]})]})]}),(0,N.jsx)(`pre`,{style:{backgroundColor:`var(--editorial-bg-subtle)`,border:`1px solid var(--editorial-border)`,padding:`20px`,fontFamily:`var(--font-mono), 'Consolas', 'Fira Code', monospace`,fontSize:`0.84rem`,lineHeight:1.6,color:`var(--editorial-text)`,overflowX:`auto`,whiteSpace:`pre-wrap`,wordBreak:`break-word`,borderRadius:`3px`},children:`# LibraMind — AI-Powered Smart Library Management System
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

================================================================================
14. HUMAN-CENTERED DESIGN THINKING 15-STAGE ARCHITECTURE
================================================================================
• Stage 1 (Title Slide): Project title, team members, roll numbers, department, institution, mentor.
• Stage 2 (Introduction): Physical retrieval dilemmas (μ=14.2 min) vs biophilic smart sanctuary paradigm.
• Stage 3 (Project Overview): Tri-portal scope (Member, Librarian, Admin), sub-2.5 min retrieval target.
• Stage 4 (User Research): Stratified random sampling (N=184), 24 interviews, 40 hrs ethnographic inquiry.
• Stage 5 (Empathise): 4-quadrant empathy map (Think, Feel, Say, Do), phantom availability pain point.
• Stage 6 (Statistical Findings): Gaussian density PDF, Pearson r=0.78, two-sample t(183)=11.42, p<0.0001.
• Stage 7 (Define): Persona (Aarav Sharma), POV, HMW spatial routing, MoSCoW prioritization.
• Stage 8 (Ideation): Crazy Eights, SCAMPER, 4 multidisciplinary engineering pillars & sketches.
• Stage 9 (Idea Selection): Weighted MCDA matrix (89.5/100 for biophilic web architecture) & hypotheses.
• Stage 10 (Prototype): Fullstack React 18, Node Express REST, FastAPI AI NLP microservice, WAL SQLite.
• Stage 11 (Testing & Validation): TCR (96.8%), SUS score 88.6/100 (A+ grade), paired t=9.87, p<0.0001.
• Stage 12 (Results & Iterations): 12-hr AM/PM slots, responsive touch layouts, 85% search time reduction.
• Stage 13 (Impact & Limitations): 600+ monthly study hours saved, single-scan desk, boundary constraints.
• Stage 14 (Conclusion & Roadmap): Spatial certainty primacy, IoT RFID smart drop bins, vector embeddings.
• Stage 15 (References & Q&A): Brown, Norman, ACRL, Kleinrock, Vaswani academic citations & viva defense.
`})]})]})]})}export{P as default};