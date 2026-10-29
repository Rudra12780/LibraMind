import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_slide_layout = prs.slide_layouts[6]

    # Biophilic Color Palette
    C_FOREST_DARK = RGBColor(0x23, 0x33, 0x29)    # #233329
    C_FOREST = RGBColor(0x34, 0x4E, 0x41)         # #344E41
    C_BOTANICAL = RGBColor(0x52, 0x73, 0x4D)      # #52734D
    C_SAGE = RGBColor(0x82, 0x97, 0x79)           # #829779
    C_SOFT_SAGE = RGBColor(0xDC, 0xE5, 0xD5)      # #DCE5D5
    C_CREAM = RGBColor(0xFA, 0xF8, 0xF1)          # #FAF8F1
    C_WARM_BEIGE = RGBColor(0xF3, 0xEB, 0xDD)     # #F3EBDD
    C_TEXT_DARK = RGBColor(0x26, 0x35, 0x2B)      # #26352B
    C_TEXT_MUTED = RGBColor(0x5A, 0x6E, 0x60)     # #5A6E60
    C_WHITE = RGBColor(0xFF, 0xFF, 0xFF)
    C_AMBER = RGBColor(0xD4, 0xA3, 0x73)

    def set_slide_background(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_header(slide, title, category="LIBRAMIND — SMART LIBRARY SYSTEM"):
        # Top pill / category
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.45), Inches(11.7), Inches(0.4))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category.upper()
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = C_BOTANICAL

        # Slide Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.8), Inches(11.7), Inches(0.8))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title
        p_title.font.size = Pt(26)
        p_title.font.bold = True
        p_title.font.color.rgb = C_FOREST_DARK

        # Decorative green line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.55), Inches(11.7), Inches(0.03))
        line.fill.solid()
        line.fill.fore_color.rgb = C_SOFT_SAGE
        line.line.fill.background()

    def add_card(slide, left, top, width, height, title, content_bullets, bg_color=C_WHITE, border_color=C_SOFT_SAGE, title_color=C_FOREST_DARK):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1.5)

        tb = slide.shapes.add_textbox(left + Inches(0.25), top + Inches(0.2), width - Inches(0.5), height - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p_title = tf.paragraphs[0]
        p_title.text = title
        p_title.font.size = Pt(18)
        p_title.font.bold = True
        p_title.font.color.rgb = title_color
        p_title.space_after = Pt(10)

        for bullet in content_bullets:
            p = tf.add_paragraph()
            p.text = f"• {bullet}"
            p.font.size = Pt(13)
            p.font.color.rgb = C_TEXT_DARK
            p.space_after = Pt(6)

        return card

    # ==========================================
    # SLIDE 1: Title Slide (Dark Theme)
    # ==========================================
    s1 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(s1, C_FOREST_DARK)

    # Accent decorative banner
    accent_bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.2), Inches(0.15), Inches(4.8))
    accent_bar.fill.solid()
    accent_bar.fill.fore_color.rgb = C_BOTANICAL
    accent_bar.line.fill.background()

    t_box = s1.shapes.add_textbox(Inches(1.2), Inches(1.4), Inches(11.0), Inches(4.5))
    tf1 = t_box.text_frame
    tf1.word_wrap = True

    p0 = tf1.paragraphs[0]
    p0.text = "ACADEMIC INNOVATION & NEXT-GEN EDTECH"
    p0.font.size = Pt(13)
    p0.font.bold = True
    p0.font.color.rgb = C_SOFT_SAGE
    p0.space_after = Pt(14)

    p1 = tf1.add_paragraph()
    p1.text = "LibraMind"
    p1.font.size = Pt(50)
    p1.font.bold = True
    p1.font.color.rgb = C_CREAM
    p1.space_after = Pt(4)

    p2 = tf1.add_paragraph()
    p2.text = "AI-Powered Smart Library Management System"
    p2.font.size = Pt(24)
    p2.font.color.rgb = C_SAGE
    p2.space_after = Pt(20)

    p3 = tf1.add_paragraph()
    p3.text = "Reimagining Academic Discovery with TF-IDF Vector Search, Real-Time Study Pod Reservations, 3D Shelf Navigation, and Biophilic UX Architecture."
    p3.font.size = Pt(15)
    p3.font.color.rgb = C_SOFT_SAGE
    p3.space_after = Pt(36)

    p4 = tf1.add_paragraph()
    p4.text = "Presented by: LibraMind Engineering Team  |  Status: Production Verified (12/12 Acceptance Scenarios Passed)"
    p4.font.size = Pt(12)
    p4.font.bold = True
    p4.font.color.rgb = C_AMBER

    # ==========================================
    # SLIDE 2: Executive Summary & Project Vision
    # ==========================================
    s2 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(s2, C_CREAM)
    add_header(s2, "Executive Summary: The Modern Library Dilemma", "PROJECT VISION & GOALS")

    add_card(s2, Inches(0.8), Inches(1.8), Inches(3.7), Inches(5.0),
             "1. Physical Navigation",
             ["Students lose 15-25 minutes finding books across multi-floor stacks.",
              "Traditional OPAC systems only provide Dewey call numbers, not physical locations.",
              "LibraMind gives exact Floor, Section, Shelf Code, and Rack number.",
              "Includes a personal 'Visit Planner' with floor-by-floor walking routes."],
             bg_color=C_WHITE, border_color=C_SOFT_SAGE)

    add_card(s2, Inches(4.8), Inches(1.8), Inches(3.7), Inches(5.0),
             "2. Study Space Friction",
             ["Peak exam season causes overcrowded pods and study space anxiety.",
              "Lack of real-time seat status leads to campus crowding and disputes.",
              "LibraMind features interactive floor-by-floor seat maps.",
              "Atomic database indexes prevent race conditions and double-booking."],
             bg_color=C_WHITE, border_color=C_SOFT_SAGE)

    add_card(s2, Inches(8.8), Inches(1.8), Inches(3.7), Inches(5.0),
             "3. Intelligent Discovery",
             ["Keyword search fails when users recall themes rather than exact titles.",
              "LibraMind implements an in-memory TF-IDF NLP semantic engine.",
              "Content-based recommendations tailored to individual student research interests.",
              "Built-in verified catalog AI Assistant to answer shelf availability questions."],
             bg_color=C_WHITE, border_color=C_SOFT_SAGE)

    # ==========================================
    # SLIDE 3: System Architecture & Tech Stack
    # ==========================================
    s3 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(s3, C_CREAM)
    add_header(s3, "Full-Stack Decoupled Architecture", "ENGINEERING & DESIGN")

    add_card(s3, Inches(0.8), Inches(1.8), Inches(3.7), Inches(5.0),
             "Frontend Web Client",
             ["Built with React 19 and Vite for lightning-fast HMR and 400KB bundles.",
              "Custom Biophilic Design System with zero heavy UI framework overhead.",
              "Interactive SVG Seat Maps with live status color coding.",
              "Lucide React icon system and responsive glassmorphic cards.",
              "Context API for global Auth and polling Notification Center."],
             bg_color=C_WHITE, border_color=C_SOFT_SAGE)

    add_card(s3, Inches(4.8), Inches(1.8), Inches(3.7), Inches(5.0),
             "Backend API Services",
             ["Node.js & Express 5 RESTful API modularized across 9 route domains.",
              "Strict Role-Based Access Control (RBAC): Student, Librarian, Admin.",
              "Atomic Transactions with better-sqlite3 Write-Ahead Logging (WAL).",
              "Background Cron Scheduler for fine calculations and queue expirations.",
              "Audit logging on all administrative actions for complete traceability."],
             bg_color=C_WHITE, border_color=C_SOFT_SAGE)

    add_card(s3, Inches(8.8), Inches(1.8), Inches(3.7), Inches(5.0),
             "AI & Data Layer",
             ["SQLite 3 Database with ACID guarantees & partial unique indexes.",
              "TF-IDF Vector Engine & Cosine Similarity for NLP query search.",
              "Circulation velocity forecasting with 30-day predictive models.",
              "50+ comprehensive books, 150+ physical copies, and 40 study pods seeded.",
              "One-click CSV exports for enterprise library management reporting."],
             bg_color=C_WHITE, border_color=C_SOFT_SAGE)

    # ==========================================
    # SLIDE 4: Core Innovation - AI Discovery Engine
    # ==========================================
    s4 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(s4, C_CREAM)
    add_header(s4, "AI Book Finder & Vector-Based Discovery", "NATURAL LANGUAGE PROCESSING")

    add_card(s4, Inches(0.8), Inches(1.8), Inches(5.7), Inches(5.0),
             "TF-IDF & Cosine Similarity Matching",
             ["Tokenizes natural language queries (e.g., 'building scalable fault-tolerant backend systems').",
              "Filters stop words, stems keywords, and computes Term Frequency-Inverse Document Frequency vectors across catalog metadata.",
              "Calculates Cosine Similarity score against pre-indexed book vectors.",
              "Provides transparent match rationale explaining exactly which query terms matched.",
              "Guarantees instant sub-15ms response times without external API dependencies or latency."],
             bg_color=C_WHITE, border_color=C_SOFT_SAGE)

    add_card(s4, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0),
             "Personalized Recommendations & Chatbot",
             ["Student Interest Onboarding: Captures academic disciplines during registration.",
              "Content-based collaborative filtering matches student profile against catalog tags and borrowing patterns.",
              "Curated 'Recommended for You' carousels refreshed dynamically.",
              "LibraMind AI Assistant: Grounded conversational assistant strictly citing verified shelf locations and real-time copy availability.",
              "Eliminates AI hallucinations by cross-verifying catalog database records in real time."],
             bg_color=C_WHITE, border_color=C_SOFT_SAGE)

    # ==========================================
    # SLIDE 5: 3D Shelf Navigation & Visit Planner
    # ==========================================
    s5 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(s5, C_CREAM)
    add_header(s5, "Physical Stacks Navigation & Visit Planner", "SOLVING THE PHYSICAL RETRIEVAL BOTTLENECK")

    add_card(s5, Inches(0.8), Inches(1.8), Inches(3.7), Inches(5.0),
             "Granular Shelf Stacks Hierarchy",
             ["Every book in the catalog is indexed with complete spatial coordinates:",
              "• Floor Level (Floor 1, 2, 3)",
              "• Dedicated Section (e.g., Tech & Engineering, Literature)",
              "• Shelf Code (e.g., Shelf SE-04)",
              "• Rack Unit (e.g., Rack 03)",
              "Direct visual cues guide students directly to the physical shelf."],
             bg_color=C_WHITE, border_color=C_SOFT_SAGE)

    add_card(s5, Inches(4.8), Inches(1.8), Inches(3.7), Inches(5.0),
             "Physical Copy Tracking",
             ["Granular barcode-level tracking (e.g., LM-SE-04-C1, LM-SE-04-C2).",
              "Live status badges: Available, Borrowed, In Maintenance, Lost.",
              "Condition tracking: Excellent, Good, Fair.",
              "Prevents empty-shelf disappointment by displaying real-time shelf status.",
              "Librarians can flag damaged copies and track repair history."],
             bg_color=C_WHITE, border_color=C_SOFT_SAGE)

    add_card(s5, Inches(8.8), Inches(1.8), Inches(3.7), Inches(5.0),
             "My Library Visit Planner",
             ["Students can add target books to their personalized Visit Planner.",
              "Groups reading lists automatically by Floor and Section.",
              "Generates an optimal physical walking path across the library building.",
              "Displays current seat availability on each floor before student arrives.",
              "One-click 'Mark as Found' checklist during library visits."],
             bg_color=C_WHITE, border_color=C_SOFT_SAGE)

    # ==========================================
    # SLIDE 6: Study Pod Reservations & Concurrency
    # ==========================================
    s6 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(s6, C_CREAM)
    add_header(s6, "Smart Study Pods & Anti-Conflict Booking", "STUDY SPACE DISCOVERY & CONCURRENCY")

    add_card(s6, Inches(0.8), Inches(1.8), Inches(5.7), Inches(5.0),
             "Interactive Floor & Zone Seat Map",
             ["40 individual study pods categorized across 3 dedicated environments:",
              "• Silent Focus Pods: Individual acoustic privacy carrels with power outlets.",
              "• Collaborative Team Rooms: Group tables with dual-monitor docks and whiteboards.",
              "• Window Nook Pods: Natural daylight biophilic seating with ergonomic chairs.",
              "Real-time visual seat availability grid with intuitive color-coded occupancy badges.",
              "Filter seats by Floor, Zone, and amenities (Power Outlet, Window, Whiteboard)."],
             bg_color=C_WHITE, border_color=C_SOFT_SAGE)

    add_card(s6, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0),
             "Concurrency Safety & Atomic Reservations",
             ["SQLite Partial Unique Index strictly enforces zero double-bookings:",
              "  CREATE UNIQUE INDEX idx_seat_active_reservation",
              "  ON seat_reservations (seat_id, date, time_slot)",
              "  WHERE status = 'active';",
              "Concurrent race conditions are rejected at the database engine level.",
              "Automated 2-hour reservation windows with 15-minute release grace periods.",
              "Librarian override allows instant seat maintenance lockout when needed."],
             bg_color=C_WHITE, border_color=C_SOFT_SAGE)

    # ==========================================
    # SLIDE 7: Circulation & Waitlist Management
    # ==========================================
    s7 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(s7, C_CREAM)
    add_header(s7, "Circulation Engine & Ordered Hold Queues", "CORE LIBRARY DESK OPERATIONS")

    add_card(s7, Inches(0.8), Inches(1.8), Inches(5.7), Inches(5.0),
             "Lending Rules & Automated Fines",
             ["14-day standard borrowing window with dynamic countdown indicator.",
              "Automated overdue calculation: $1.00/day fine levied per overdue book.",
              "Students can self-renew books up to 2 times if no holds are pending.",
              "Librarian Fast Checkout & Return desk with barcode scanner input.",
              "Real-time email and in-app alert notifications for approaching due dates."],
             bg_color=C_WHITE, border_color=C_SOFT_SAGE)

    add_card(s7, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0),
             "Ordered Waitlist & Automated Hand-off",
             ["When all copies are checked out, students join an ordered FIFO hold queue.",
              "Transparent queue position tracker (e.g., 'You are #1 of 3 in queue').",
              "Automated Hand-off: When a borrower returns a book, the copy is reserved for Queue #1.",
              "The next student receives an instant notification with a 48-hour pickup window.",
              "If unclaimed, the reservation automatically cascades to Queue #2."],
             bg_color=C_WHITE, border_color=C_SOFT_SAGE)

    # ==========================================
    # SLIDE 8: Role-Based Portals & User Experience
    # ==========================================
    s8 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(s8, C_CREAM)
    add_header(s8, "Three Tailored Role-Based Workspaces", "RBAC & COLLABORATION WORKFLOWS")

    add_card(s8, Inches(0.8), Inches(1.8), Inches(3.7), Inches(5.0),
             "Student Workspace",
             ["Track active loans with due date countdown badges.",
              "Monitor hold queue statuses and pickup desk notifications.",
              "Explore personalized recommendations and manage Wishlist.",
              "Book study pods and view library visit walking routes.",
              "Interactive Book Compare tool to evaluate up to 3 titles side-by-side."],
             bg_color=C_WHITE, border_color=C_SOFT_SAGE)

    add_card(s8, Inches(4.8), Inches(1.8), Inches(3.7), Inches(5.0),
             "Librarian Desk",
             ["Fast issue & return station with student membership lookup.",
              "Manage inventory: Add new physical copies, edit barcodes, mark damaged books.",
              "Fulfill reservations and prepare hold books at the front circulation desk.",
              "Broadcast institution-wide announcements and notices directly to student screens.",
              "Manage study pod maintenance statuses and override locks."],
             bg_color=C_WHITE, border_color=C_SOFT_SAGE)

    add_card(s8, Inches(8.8), Inches(1.8), Inches(3.7), Inches(5.0),
             "Admin Console",
             ["User management: Review registered patrons, change roles, or deactivate accounts.",
              "Send targeted administrative direct messages to specific students.",
              "Audit logging: Immutable timestamped audit trails of all system transactions.",
              "Database integrity health check with live disk usage and index metrics.",
              "Full catalog CSV export for compliance and archival backups."],
             bg_color=C_WHITE, border_color=C_SOFT_SAGE)

    # ==========================================
    # SLIDE 9: Library Analytics & Demand Intelligence
    # ==========================================
    s9 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(s9, C_CREAM)
    add_header(s9, "Circulation Analytics & Predictive Demand", "DATA-DRIVEN ACQUISITIONS")

    add_card(s9, Inches(0.8), Inches(1.8), Inches(5.7), Inches(5.0),
             "Circulation Velocity & Seat Heatmaps",
             ["Monthly loan trends tracking circulation spikes across academic semesters.",
              "Category distribution breakdown (Computer Science, Science, Humanities, Business).",
              "Top 10 most borrowed titles highlighting student reading priorities.",
              "Floor and zone study seat utilization density metrics.",
              "Aids administrators in staffing librarian desks during peak study hours."],
             bg_color=C_WHITE, border_color=C_SOFT_SAGE)

    add_card(s9, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0),
             "30-Day Algorithmic Demand Forecasting",
             ["Predictive demand score combining circulation velocity, category hold depth, and active queue sizes.",
              "Highlights books at risk of inventory stockouts (e.g., 'Clean Code', 'Data-Intensive Applications').",
              "Actionable acquisition recommendations for library procurement officers.",
              "Helps librarians budget book purchases based on actual student demand data.",
              "Instant CSV report download for library committee board meetings."],
             bg_color=C_WHITE, border_color=C_SOFT_SAGE)

    # ==========================================
    # SLIDE 10: Verification & Quality Assurance
    # ==========================================
    s10 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(s10, C_CREAM)
    add_header(s10, "Comprehensive Verification: 12/12 Scenarios Passed", "QUALITY ASSURANCE & TESTING")

    add_card(s10, Inches(0.8), Inches(1.8), Inches(5.7), Inches(5.0),
             "Automated Test Suite Highlights (1-6)",
             ["[PASS] Scenario 1: AI Topic Search with Shelf Location & Match Explanation",
              "[PASS] Scenario 2: Book Details & Live Physical Availability Inspection",
              "[PASS] Scenario 3: Concurrent Borrowing Race Condition Prevention",
              "[PASS] Scenario 4: Ordered Hold Queue Sequence on Unavailable Titles",
              "[PASS] Scenario 5: Return Notification and Automatic Queue Hand-off",
              "[PASS] Scenario 6: Seat Double-Booking Prevention via Atomic Index"],
             bg_color=C_WHITE, border_color=C_SOFT_SAGE)

    add_card(s10, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0),
             "Automated Test Suite Highlights (7-12)",
             ["[PASS] Scenario 7: Book Match & Compare Data Fidelity",
              "[PASS] Scenario 8: My Library Visit Planner with Floor Grouping & Walking Route",
              "[PASS] Scenario 9: Contextual AI Assistant with Verified Location & Availability",
              "[PASS] Scenario 10: Backend Role-Based Access Control (RBAC) Enforcement",
              "[PASS] Scenario 11: Trustworthy Analytics & Transparent Demand Forecasting",
              "[PASS] Scenario 12: Regression Verification of All Core Features & Endpoints"],
             bg_color=C_WHITE, border_color=C_SOFT_SAGE)

    # ==========================================
    # SLIDE 11: Biophilic Design & UX Philosophy
    # ==========================================
    s11 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(s11, C_CREAM)
    add_header(s11, "Biophilic Design Philosophy & Aesthetic", "SERENE & MINDFUL DIGITAL EXPERIENCE")

    add_card(s11, Inches(0.8), Inches(1.8), Inches(3.7), Inches(5.0),
             "Nature-Inspired Palette",
             ["Forest Green (#344E41): Grounding foundation color.",
              "Sage Green (#829779): Soft secondary elements.",
              "Botanical Green (#52734D): Engaging CTAs & buttons.",
              "Soft Cream (#FAF8F1): Eye-friendly reading background.",
              "Warm Beige (#F3EBDD): Natural wood finish card borders."],
             bg_color=C_WHITE, border_color=C_SOFT_SAGE)

    add_card(s11, Inches(4.8), Inches(1.8), Inches(3.7), Inches(5.0),
             "Cognitive Ergonomics",
             ["Eliminates high-contrast digital eye strain during late-night study sessions.",
              "Subtle 150-200ms cubic-bezier micro-animations reduce cognitive load.",
              "High accessibility: WCAG AA contrast compliance across all text and buttons.",
              "Generous negative space evoking peaceful botanical gardens.",
              "Card-based layouts provide immediate visual hierarchy."],
             bg_color=C_WHITE, border_color=C_SOFT_SAGE)

    add_card(s11, Inches(8.8), Inches(1.8), Inches(3.7), Inches(5.0),
             "Modern Typography",
             ["Outfit: Clean geometric sans-serif for crystal clear headings, badges, and metrics.",
              "Newsreader: Classic literary editorial serif for book titles and descriptions.",
              "Responsive font scaling seamlessly adapting to mobile, tablet, and desktop viewports.",
              "Clear visual indicators for live availability, queue numbers, and overdue warnings."],
             bg_color=C_WHITE, border_color=C_SOFT_SAGE)

    # ==========================================
    # SLIDE 12: Conclusion, Demo & Q&A (Dark Theme)
    # ==========================================
    s12 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(s12, C_FOREST_DARK)

    # Accent decorative bar
    bar12 = s12.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.0), Inches(0.15), Inches(5.2))
    bar12.fill.solid()
    bar12.fill.fore_color.rgb = C_BOTANICAL
    bar12.line.fill.background()

    t_box12 = s12.shapes.add_textbox(Inches(1.2), Inches(1.0), Inches(11.0), Inches(5.2))
    tf12 = t_box12.text_frame
    tf12.word_wrap = True

    p12_0 = tf12.paragraphs[0]
    p12_0.text = "SUMMARY & LIVE DEMONSTRATION"
    p12_0.font.size = Pt(13)
    p12_0.font.bold = True
    p12_0.font.color.rgb = C_SOFT_SAGE
    p12_0.space_after = Pt(10)

    p12_1 = tf12.add_paragraph()
    p12_1.text = "LibraMind: The Intelligent Library Ecosystem"
    p12_1.font.size = Pt(36)
    p12_1.font.bold = True
    p12_1.font.color.rgb = C_CREAM
    p12_1.space_after = Pt(16)

    p12_2 = tf12.add_paragraph()
    p12_2.text = "Key Takeaways:"
    p12_2.font.size = Pt(18)
    p12_2.font.bold = True
    p12_2.font.color.rgb = C_AMBER
    p12_2.space_after = Pt(6)

    bullets = [
        "Eliminates book retrieval friction with exact floor, shelf, and rack navigation.",
        "Prevents study space anxiety with atomic, conflict-free seat reservation maps.",
        "Enhances academic discovery with TF-IDF vector matching and personalized suggestions.",
        "Fully operational and verified with 12/12 automated integration tests passing.",
        "Ready to run locally: npm run dev starts both backend (5000) and frontend (5174)."
    ]
    for b in bullets:
        p = tf12.add_paragraph()
        p.text = f"✔ {b}"
        p.font.size = Pt(14)
        p.font.color.rgb = C_SOFT_SAGE
        p.space_after = Pt(4)

    p_demo = tf12.add_paragraph()
    p_demo.text = "\nTry Demo Accounts: Student (student@libramind.edu) | Librarian (librarian@libramind.edu) | Admin (admin@libramind.edu)"
    p_demo.font.size = Pt(13)
    p_demo.font.bold = True
    p_demo.font.color.rgb = C_WHITE

    # Save presentation
    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "LibraMind_Presentation.pptx")
    prs.save(output_path)
    print(f"SUCCESS: PowerPoint saved to {output_path}")

if __name__ == "__main__":
    create_presentation()
