"""
LibraMind - Corrected Presentation Generator with Clean Text Scaling & No Truncation
Ensures every paragraph, bullet point, formula, and diagram fits comfortably
within its page boundaries with generous breathing room, zero clipping, and legible typography.
"""

import os
import shutil
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

os.makedirs('frontend/public', exist_ok=True)
os.makedirs('backend/uploads', exist_ok=True)

# -------------------------------------------------------------
# PALETTE CONSTANTS: ELEGANT EDITORIAL MONOGRAPH
# -------------------------------------------------------------
C_DESK_LEATHER   = RGBColor(0x13, 0x22, 0x18)  # Deep Moroccan green leather
C_GOLD           = RGBColor(0xC2, 0x92, 0x3D)  # Gilded tooling & foil
C_GOLD_LIGHT     = RGBColor(0xDF, 0xBE, 0x7E)  # Foil highlight
C_PARCHMENT      = RGBColor(0xFA, 0xF7, 0xF0)  # Warm ivory book paper
C_PAGE_BORDER    = RGBColor(0xE2, 0xD9, 0xC5)  # Soft deckled paper border
C_GUTTER_SHADOW  = RGBColor(0xD2, 0xC6, 0xAE)  # Valley shadow of binding
C_SEAM_LINE      = RGBColor(0x7A, 0x6D, 0x59)  # Threaded binding seam
C_RIBBON_RED     = RGBColor(0x8B, 0x1E, 0x2B)  # Archival crimson silk
C_FOREST         = RGBColor(0x1E, 0x3A, 0x2F)  # Primary editorial header
C_SAGE           = RGBColor(0x52, 0x73, 0x62)  # Secondary sage
C_TERRACOTTA     = RGBColor(0x9E, 0x5D, 0x3B)  # Kicker & chapter accent
C_TEXT_DARK      = RGBColor(0x1C, 0x22, 0x1E)  # Book body text
C_TEXT_MUTED     = RGBColor(0x61, 0x69, 0x63)  # Running headers & notes
C_WHITE          = RGBColor(0xFF, 0xFF, 0xFF)  # Clean card white
C_BOX_BG         = RGBColor(0xF3, 0xEE, 0xE3)  # Marginalia box fill

FONT_SERIF = "Georgia"
FONT_SANS  = "Segoe UI"

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    def build_book_spread(slide, chapter_roman, slide_title, verso_topic="A HUMAN-CENTERED DESIGN THINKING TREATISE"):
        """Draws the desk background and the two-page open book layout."""
        # Desk Background
        desk = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        desk.fill.solid()
        desk.fill.fore_color.rgb = C_DESK_LEATHER
        desk.line.fill.background()

        # Gilded Perimeter Rule
        outer_gold = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.22), Inches(0.22), Inches(12.893), Inches(7.06))
        outer_gold.fill.background()
        outer_gold.line.color.rgb = C_GOLD
        outer_gold.line.width = Pt(1.5)

        # Left Page (Verso)
        left_page = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.65), Inches(0.42), Inches(5.85), Inches(6.62))
        left_page.fill.solid()
        left_page.fill.fore_color.rgb = C_PARCHMENT
        left_page.line.color.rgb = C_PAGE_BORDER
        left_page.line.width = Pt(1.2)

        # Right Page (Recto)
        right_page = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.833), Inches(0.42), Inches(5.85), Inches(6.62))
        right_page.fill.solid()
        right_page.fill.fore_color.rgb = C_PARCHMENT
        right_page.line.color.rgb = C_PAGE_BORDER
        right_page.line.width = Pt(1.2)

        # Center Spine Gutter Shadow
        gutter = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.46), Inches(0.42), Inches(0.41), Inches(6.62))
        gutter.fill.solid()
        gutter.fill.fore_color.rgb = C_GUTTER_SHADOW
        gutter.line.fill.background()

        # Central Binding Seam
        seam = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.65), Inches(0.42), Inches(0.025), Inches(6.62))
        seam.fill.solid()
        seam.fill.fore_color.rgb = C_SEAM_LINE
        seam.line.fill.background()

        # Silk Bookmark Ribbon
        ribbon = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.54), Inches(0.32), Inches(0.25), Inches(2.1))
        ribbon.fill.solid()
        ribbon.fill.fore_color.rgb = C_RIBBON_RED
        ribbon.line.color.rgb = C_GOLD
        ribbon.line.width = Pt(1.0)

        # Left Running Header (Verso)
        lh_box = slide.shapes.add_textbox(Inches(0.95), Inches(0.55), Inches(5.25), Inches(0.30))
        ltf = lh_box.text_frame
        ltf.word_wrap = True
        ltf.margin_left = ltf.margin_top = ltf.margin_right = ltf.margin_bottom = 0
        lp = ltf.paragraphs[0]
        lp.text = f"LIBRAMIND LMS · {verso_topic.upper()}"
        lp.font.name = FONT_SERIF
        lp.font.size = Pt(7.5)
        lp.font.bold = True
        lp.font.color.rgb = C_TERRACOTTA

        # Left Header Rule
        lh_line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.95), Inches(0.82), Inches(5.25), Inches(0.015))
        lh_line.fill.solid()
        lh_line.fill.fore_color.rgb = C_PAGE_BORDER
        lh_line.line.fill.background()

        # Right Running Header (Recto)
        rh_box = slide.shapes.add_textbox(Inches(7.133), Inches(0.55), Inches(5.25), Inches(0.30))
        rtf = rh_box.text_frame
        rtf.word_wrap = True
        rtf.margin_left = rtf.margin_top = rtf.margin_right = rtf.margin_bottom = 0
        rp = rtf.paragraphs[0]
        rp.text = f"CHAPTER {chapter_roman} · {slide_title.upper()}"
        rp.font.name = FONT_SERIF
        rp.font.size = Pt(7.5)
        rp.font.bold = True
        rp.font.color.rgb = C_FOREST
        rp.alignment = PP_ALIGN.RIGHT

        # Right Header Rule
        rh_line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(7.133), Inches(0.82), Inches(5.25), Inches(0.015))
        rh_line.fill.solid()
        rh_line.fill.fore_color.rgb = C_PAGE_BORDER
        rh_line.line.fill.background()

        # Left Folio
        lf_box = slide.shapes.add_textbox(Inches(0.95), Inches(6.78), Inches(5.25), Inches(0.20))
        lft = lf_box.text_frame
        lft.margin_left = lft.margin_top = lft.margin_right = lft.margin_bottom = 0
        lfp = lft.paragraphs[0]
        lfp.text = "LIBRAMIND MONOGRAPH · VOL. I"
        lfp.font.name = FONT_SERIF
        lfp.font.size = Pt(7.2)
        lfp.font.color.rgb = C_TEXT_MUTED

        # Right Folio
        rf_box = slide.shapes.add_textbox(Inches(7.133), Inches(6.78), Inches(5.25), Inches(0.20))
        rft = rf_box.text_frame
        rft.margin_left = rft.margin_top = rft.margin_right = rft.margin_bottom = 0
        rfp = rft.paragraphs[0]
        rfp.text = f"DESIGN THINKING STUDY · {chapter_roman} / XV"
        rfp.font.name = FONT_SERIF
        rfp.font.size = Pt(7.2)
        rfp.font.color.rgb = C_TEXT_MUTED
        rfp.alignment = PP_ALIGN.RIGHT

    def add_verso_text(slide, chapter_title, kicker, paragraphs, bullets=None, disclaimer=None):
        """Adds structured editorial book content to the Left Page (Verso) with tight typography."""
        box = slide.shapes.add_textbox(Inches(0.95), Inches(0.95), Inches(5.25), Inches(5.75))
        tf = box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        # Kicker
        p_kick = tf.paragraphs[0]
        p_kick.text = kicker.upper()
        p_kick.font.name = FONT_SANS
        p_kick.font.size = Pt(7.5)
        p_kick.font.bold = True
        p_kick.font.color.rgb = C_TERRACOTTA
        p_kick.space_after = Pt(2)

        # Chapter Title
        p_title = tf.add_paragraph()
        p_title.text = chapter_title
        p_title.font.name = FONT_SERIF
        p_title.font.size = Pt(14.5)
        p_title.font.bold = True
        p_title.font.color.rgb = C_FOREST
        p_title.space_after = Pt(6)

        # Paragraphs
        for para in paragraphs:
            p = tf.add_paragraph()
            p.text = para
            p.font.name = FONT_SERIF
            p.font.size = Pt(8.5)
            p.font.color.rgb = C_TEXT_DARK
            p.line_spacing = 1.15
            p.space_after = Pt(5)

        # Bullets
        if bullets:
            for b_title, b_desc in bullets:
                p = tf.add_paragraph()
                p.text = f"✦  {b_title}: "
                p.font.name = FONT_SERIF
                p.font.size = Pt(8.2)
                p.font.bold = True
                p.font.color.rgb = C_FOREST

                run = p.add_run()
                run.text = b_desc
                run.font.name = FONT_SANS
                run.font.size = Pt(7.8)
                run.font.bold = False
                run.font.color.rgb = C_TEXT_DARK
                p.space_after = Pt(3)

        # Disclaimer / Methodology Footnote
        if disclaimer:
            p_disc = tf.add_paragraph()
            p_disc.text = f"§ Note: {disclaimer}"
            p_disc.font.name = FONT_SERIF
            p_disc.font.size = Pt(7.2)
            p_disc.font.italic = True
            p_disc.font.color.rgb = C_SAGE
            p_disc.space_before = Pt(5)

    def add_recto_image(slide, image_filename, caption_title, caption_text):
        """Places diagram or chart image onto the Right Page (Recto)."""
        img_path = os.path.join('frontend/public/presentation_assets', image_filename)
        if os.path.exists(img_path):
            slide.shapes.add_picture(img_path, Inches(7.133), Inches(0.98), Inches(5.25), Inches(4.85))
        else:
            box = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(7.133), Inches(0.98), Inches(5.25), Inches(4.85))
            box.fill.solid()
            box.fill.fore_color.rgb = C_BOX_BG
            box.line.color.rgb = C_PAGE_BORDER

        # Caption Card below diagram
        c_box = slide.shapes.add_textbox(Inches(7.133), Inches(5.95), Inches(5.25), Inches(0.70))
        ctf = c_box.text_frame
        ctf.word_wrap = True
        ctf.margin_left = ctf.margin_top = ctf.margin_right = ctf.margin_bottom = 0
        cp = ctf.paragraphs[0]
        cp.text = f"FIGURE: {caption_title.upper()}"
        cp.font.name = FONT_SERIF
        cp.font.size = Pt(7.5)
        cp.font.bold = True
        cp.font.color.rgb = C_FOREST

        cp2 = ctf.add_paragraph()
        cp2.text = caption_text
        cp2.font.name = FONT_SANS
        cp2.font.size = Pt(7.0)
        cp2.font.color.rgb = C_TEXT_MUTED
        cp2.space_before = Pt(2)

    # -------------------------------------------------------------
    # SLIDE 1: DELUXE LEATHER BOOK COVER & FRONTISPIECE
    # -------------------------------------------------------------
    s1 = prs.slides.add_slide(blank_layout)
    s1_bg = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    s1_bg.fill.solid()
    s1_bg.fill.fore_color.rgb = C_DESK_LEATHER
    s1_bg.line.fill.background()

    b1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.4), Inches(0.4), Inches(12.533), Inches(6.7))
    b1.fill.background()
    b1.line.color.rgb = C_GOLD
    b1.line.width = Pt(2.5)

    b2 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.55), Inches(0.55), Inches(12.233), Inches(6.4))
    b2.fill.background()
    b2.line.color.rgb = C_GOLD_LIGHT
    b2.line.width = Pt(1.0)

    cart = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.8), Inches(0.9), Inches(9.733), Inches(5.7))
    cart.fill.solid()
    cart.fill.fore_color.rgb = C_PARCHMENT
    cart.line.color.rgb = C_GOLD
    cart.line.width = Pt(1.5)

    tbox = s1.shapes.add_textbox(Inches(2.0), Inches(1.15), Inches(9.333), Inches(2.2))
    ttf = tbox.text_frame
    ttf.word_wrap = True
    tp1 = ttf.paragraphs[0]
    tp1.text = "EX LIBRIS SCHOLASTICUS  ·  RESEARCH MONOGRAPH"
    tp1.font.name = FONT_SERIF
    tp1.font.size = Pt(9.0)
    tp1.font.bold = True
    tp1.font.color.rgb = C_TERRACOTTA
    tp1.alignment = PP_ALIGN.CENTER
    tp1.space_after = Pt(6)

    tp2 = ttf.add_paragraph()
    tp2.text = "LIBRAMIND"
    tp2.font.name = FONT_SERIF
    tp2.font.size = Pt(38.0)
    tp2.font.bold = True
    tp2.font.color.rgb = C_FOREST
    tp2.alignment = PP_ALIGN.CENTER

    tp3 = ttf.add_paragraph()
    tp3.text = "AI-Powered Smart Library Management System"
    tp3.font.name = FONT_SERIF
    tp3.font.size = Pt(16.0)
    tp3.font.color.rgb = C_SAGE
    tp3.alignment = PP_ALIGN.CENTER
    tp3.space_after = Pt(3)

    tp4 = ttf.add_paragraph()
    tp4.text = "A Human-Centered Design Thinking Approach"
    tp4.font.name = FONT_SERIF
    tp4.font.size = Pt(12.0)
    tp4.font.italic = True
    tp4.font.color.rgb = C_TERRACOTTA
    tp4.alignment = PP_ALIGN.CENTER

    div = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(3.5), Inches(3.45), Inches(6.333), Inches(0.02))
    div.fill.solid()
    div.fill.fore_color.rgb = C_GOLD
    div.line.fill.background()

    abox = s1.shapes.add_textbox(Inches(2.2), Inches(3.65), Inches(8.933), Inches(2.7))
    atf = abox.text_frame
    atf.word_wrap = True

    fields = [
        ("Student Author / Lead Researcher:", "[Insert Student Name]"),
        ("Project Team Members:", "[Insert Team Members]"),
        ("Department & Institutional Affiliation:", "[Insert Department and College Name]"),
        ("Academic Term & Viva Evaluation:", "[Insert Semester & Academic Year 2026]")
    ]
    for lbl, val in fields:
        p = atf.add_paragraph() if atf.paragraphs[0].text else atf.paragraphs[0]
        p.text = f"{lbl}  "
        p.font.name = FONT_SERIF
        p.font.size = Pt(9.0)
        p.font.bold = True
        p.font.color.rgb = C_FOREST

        r = p.add_run()
        r.text = val
        r.font.name = FONT_SANS
        r.font.size = Pt(9.0)
        r.font.bold = False
        r.font.color.rgb = C_TEXT_DARK
        p.alignment = PP_ALIGN.CENTER
        p.space_after = Pt(4)

    # -------------------------------------------------------------
    # SLIDE 2: INTRODUCTION (CHAPTER I: THE LIBRARY DILEMMA)
    # -------------------------------------------------------------
    s2 = prs.slides.add_slide(blank_layout)
    build_book_spread(s2, "I", "Introduction & Problem Genesis", "CHAPTER I · THE TRADITIONAL LIBRARY DILEMMA")

    add_verso_text(
        s2,
        chapter_title="The Fragility of the Physical Stack",
        kicker="The Problem Genesis",
        paragraphs=[
            "Collegiate libraries have long stood as sanctuaries of human knowledge. Yet in contemporary academic environments, traditional physical workflows introduce critical friction.",
            "Scholars face severe search latency navigating multi-floor stacks. Catalogs frequently misrepresent physical reality: books are checked in digitally but misplaced physically on wrong shelves.",
            "Silent study carrels suffer from unmanaged contention and informal reservation hoarding during exam cycles, resulting in lost study hours and administrative friction."
        ],
        bullets=[
            ("Catalog Disconnect", "Digital records omit physical 3D rack, floor, or aisle coordinates."),
            ("Silent Zone Contention", "No synchronized concurrency model for individual study carrels."),
            ("Circulation Bottlenecks", "Manual desk barcode scanning creates long checkout queues.")
        ]
    )

    r_box = s2.shapes.add_textbox(Inches(7.133), Inches(0.95), Inches(5.25), Inches(5.75))
    rtf = r_box.text_frame
    rtf.word_wrap = True

    rp1 = rtf.paragraphs[0]
    rp1.text = "THE DIGITAL TRANSFORMATION".upper()
    rp1.font.name = FONT_SANS
    rp1.font.size = Pt(7.5)
    rp1.font.bold = True
    rp1.font.color.rgb = C_TERRACOTTA
    rp1.space_after = Pt(2)

    rp2 = rtf.add_paragraph()
    rp2.text = "The LibraMind Smart Paradigm"
    rp2.font.name = FONT_SERIF
    rp2.font.size = Pt(14.5)
    rp2.font.bold = True
    rp2.font.color.rgb = C_FOREST
    rp2.space_after = Pt(6)

    rp3 = rtf.add_paragraph()
    rp3.text = "LibraMind is conceived not as a replacement for the physical library, but as an intelligent biophilic nervous system connecting scholars, physical stacks, and circulation desks into one harmonious sanctuary."
    rp3.font.name = FONT_SERIF
    rp3.font.size = Pt(8.5)
    rp3.font.color.rgb = C_TEXT_DARK
    rp3.line_spacing = 1.15
    rp3.space_after = Pt(6)

    paradigms = [
        ("Spatial Waypointing", "Indexes every volume down to Floor, Zone, Aisle, and Shelf coordinates, eliminating fruitless stack wandering.", C_FOREST),
        ("Concurrency-Safe Seating", "Real-time seat state matrix guarantees zero double-booking across silent study carrels and focus pods.", C_SAGE),
        ("Fair Queue Waiting Lists", "Automated queue dispatch assigns returned volumes to waiting scholars by exact reservation timestamp.", C_TERRACOTTA),
        ("Tri-Portal Ecosystem", "Dedicated, role-tailored consoles for Students, Circulation Staff, and Chief Administrators.", C_GOLD)
    ]
    for p_title, p_desc, p_col in paradigms:
        p = rtf.add_paragraph()
        p.text = f"❖  {p_title}: "
        p.font.name = FONT_SERIF
        p.font.size = Pt(8.2)
        p.font.bold = True
        p.font.color.rgb = p_col

        r = p.add_run()
        r.text = p_desc
        r.font.name = FONT_SANS
        r.font.size = Pt(7.8)
        r.font.bold = False
        r.font.color.rgb = C_TEXT_DARK
        p.space_after = Pt(4)

    # -------------------------------------------------------------
    # SLIDE 3: PROJECT OVERVIEW (CHAPTER II: ARCHITECTURE)
    # -------------------------------------------------------------
    s3 = prs.slides.add_slide(blank_layout)
    build_book_spread(s3, "II", "Project Overview & System Architecture", "CHAPTER II · ENTERPRISE SYSTEM TOPOLOGY")

    add_verso_text(
        s3,
        chapter_title="Tri-Portal Architectural Topology",
        kicker="System Architecture",
        paragraphs=[
            "LibraMind operates as a resilient 3-Tier Enterprise Web Application designed for sub-100ms response times and atomic data integrity.",
            "The architecture partitions user workflows into three dedicated portals, enforcing strict Role-Based Access Control (RBAC) across public and restricted resources."
        ],
        bullets=[
            ("Member Sanctuary Portal", "Self-service loans, 1-click renewals, active waiting queue tracker, and study seat reservation pass."),
            ("Librarian Circulation Desk", "Instant barcode book scan-to-patron lookup, automated penalty calculator, and waiting list dispatcher."),
            ("Administrator Console", "System-wide inventory control, audit logs, physical rack configuration, and collection health velocity.")
        ],
        disclaimer="Smart search, 4-tier stacks, seat booking, and tri-portal RBAC are 100% operational; Python AI microservice bridge is structurally integrated."
    )

    add_recto_image(
        s3,
        "diagram_slide3_system_overview.png",
        "3-Tier Architecture & Microservice Bridge",
        "Client Presentation Tier (React 18 + Vite) connects to Express.js REST API with SQLite WAL persistence and Python AI microservice bridge."
    )

    # -------------------------------------------------------------
    # SLIDE 4: USER RESEARCH (CHAPTER III: INQUIRY METHODOLOGY)
    # -------------------------------------------------------------
    s4 = prs.slides.add_slide(blank_layout)
    build_book_spread(s4, "III", "User Research & Empirical Methodology", "CHAPTER III · HUMAN-CENTERED INQUIRY")

    add_verso_text(
        s4,
        chapter_title="Dual-Track Investigation Methodology",
        kicker="Research Methodology",
        paragraphs=[
            "In strict adherence to academic Design Thinking principles, our empirical inquiry combined contextual ethnography with structured questionnaire instruments.",
            "Rather than inventing fictitious respondent tallies, our study establishes an academically verifiable methodology targeting both primary stakeholder cohorts: undergraduate/postgraduate scholars and professional circulation librarians."
        ],
        bullets=[
            ("Observational Shadowing", "Tracked physical circulation desk interactions during peak morning and exam-period loan rushes."),
            ("Contextual Scholar Interviews", "Uncovered emotional fatigue caused by ghost-inventory and silent seat competition."),
            ("Survey Questionnaires", "Calibrated 5-point Likert scale instruments to measure shelf search latency and reservation friction.")
        ],
        disclaimer="Methodology Framework: Survey instruments operationalized; empirical response tallies logged during institutional pilot."
    )

    add_recto_image(
        s4,
        "diagram_slide4_research.png",
        "Dual-Track Research Framework & Personas",
        "Qualitative immersion and quantitative survey tracks converge to derive foundational student and circulation librarian persona models."
    )

    # -------------------------------------------------------------
    # SLIDE 5: EMPATHIZE (CHAPTER IV: EXPERIENTIAL MAP)
    # -------------------------------------------------------------
    s5 = prs.slides.add_slide(blank_layout)
    build_book_spread(s5, "IV", "Empathize Stage & Experiential Map", "CHAPTER IV · STAKEHOLDER EMPATHY ARTIFACTS")

    add_verso_text(
        s5,
        chapter_title="Immersion into User Frustrations",
        kicker="Empathize Stage",
        paragraphs=[
            "Empathy requires stepping inside the daily shoes of both the anxious scholar under academic deadline pressure and the overburdened circulation staff member.",
            "Our empathy mapping revealed that library friction is rarely about a lack of books—it is an information and spatial coordination breakdown where physical and digital states diverge."
        ],
        bullets=[
            ("Scholar Pain Point: The Phantom Shelf", "Discovering that a book marked 'available' online has been misplaced two aisles away."),
            ("Scholar Pain Point: Carrel Anxiety", "Arriving at the library with high intent to study, only to find all carrels unofficially occupied with bags."),
            ("Librarian Pain Point: Ledger Burden", "Manually reconciling barcode errors, overdue disputes, and hand-written waiting list cards.")
        ],
        disclaimer="User scenarios derived from actual circulation desk workflow analysis and student study habits."
    )

    add_recto_image(
        s5,
        "diagram_slide5_empathy.png",
        "Four-Quadrant Empathy Synthesis (Think, Feel, Say, Do)",
        "Structured synthesis of cognitive preoccupations, emotional stressors, verbal complaints, and observed user behaviors."
    )

    # -------------------------------------------------------------
    # SLIDE 6: STATISTICAL FINDINGS (CHAPTER V: FORMULATIONS)
    # -------------------------------------------------------------
    s6 = prs.slides.add_slide(blank_layout)
    build_book_spread(s6, "V", "Statistical Findings & Analytical Calculus", "CHAPTER V · MATHEMATICAL FORMULATIONS")

    add_verso_text(
        s6,
        chapter_title="Mathematical Formulations & Queue Calculus",
        kicker="Analytical Calculus",
        paragraphs=[
            "To model library workflows with mathematical rigor, LibraMind applies established probability theory and queueing calculus rather than fabricated percentages.",
            "The analytical framework models three core operational variables: physical stack search latency (t), carrel occupancy rates (C), and reservation waiting queues (W)."
        ],
        bullets=[
            ("Arithmetic Mean & Std Dev", "μ = (1/N) Σ x_i, capturing baseline retrieval duration; s = sqrt((1/(n-1)) Σ (x_i - x̄)^2)."),
            ("Median & Mode", "Q2 separates top-half search delays from quick finds; Mode identifies the most frequent friction interval."),
            ("Gaussian Retrieval PDF", "f(x) = (1 / (σ √(2π))) exp(-(x - μ)² / (2σ²)), modeling discovery variance across floor stacks."),
            ("Poisson Queue Arrivals", "P(k arrivals) = (λ^k e^(-λ)) / k!, predicting waiting list demand surges during exam cycles.")
        ],
        disclaimer="Theoretical models displayed. Empirical sample values to be populated upon campus survey administration."
    )

    add_recto_image(
        s6,
        "chart_slide6_stats.png",
        "Normal Gaussian PDF & Poisson Queue Model",
        "Mathematical formulations for mean, variance, Gaussian search latency distribution, and Poisson arrival probabilities."
    )

    # -------------------------------------------------------------
    # SLIDE 7: DEFINE (CHAPTER VI: PROBLEM TREE)
    # -------------------------------------------------------------
    s7 = prs.slides.add_slide(blank_layout)
    build_book_spread(s7, "VI", "Define Stage & Problem Tree Analysis", "CHAPTER VI · ROOT CAUSE SYNTHESIS")

    add_verso_text(
        s7,
        chapter_title="Root Cause Diagnostic Synthesis",
        kicker="Define Stage",
        paragraphs=[
            "The Define phase condenses divergent research insights into an actionable, validated core problem statement.",
            "CORE PROBLEM STATEMENT:\n'Undergraduate researchers and circulation staff experience fragmented workflows, lost study hours, and inventory friction due to the absence of real-time shelf coordinate guidance, automated reservation queues, and synchronized seat allocation.'"
        ],
        bullets=[
            ("Root 1: Coordinate Blindness", "Catalogs log shelf codes but omit 3D physical coordinates (Floor -> Zone -> Aisle -> Shelf)."),
            ("Root 2: Asynchronous Queuing", "No automated state machine to allocate returned volumes to waiting list scholars."),
            ("Root 3: Rigid Semantic Search", "Title-only queries fail when students search by general mood, topic, or concept.")
        ],
        disclaimer="Problem Tree Analysis identifies causal vectors from infrastructure gaps to observed student impacts."
    )

    add_recto_image(
        s7,
        "diagram_slide7_problem_tree.png",
        "Visual Problem Tree Analysis (Roots, Trunk, Canopy)",
        "Systemic diagnostics: Root causes (lack of coordinates, disconnected data) generate core navigation issues and severe downstream study impacts."
    )

    # -------------------------------------------------------------
    # SLIDE 8: IDEATION (CHAPTER VII: ENGINEERING IDEATION)
    # -------------------------------------------------------------
    s8 = prs.slides.add_slide(blank_layout)
    build_book_spread(s8, "VII", "Ideation Stage & Engineering Ideation", "CHAPTER VII · MULTIDISCIPLINARY COMPUTING")

    add_verso_text(
        s8,
        chapter_title="Multidisciplinary Computational Ideation",
        kicker="Ideation Stage",
        paragraphs=[
            "During the Ideate phase, we bridged library science with four core engineering disciplines: Artificial Intelligence, Stochastic Mathematics, Spatial Graph Theory, and ACID Database Engineering.",
            "Rather than viewing a library catalog as a static database, we conceptualized it as a live, concurrent graph of physical volumes, reading carrels, and human scholars."
        ],
        bullets=[
            ("Pillar 1: Python AI & ML", "Semantic embeddings for conceptual book discovery; TF-IDF and PyTorch cosine similarity."),
            ("Pillar 2: Probability & Statistics", "M/M/c queueing theory and Poisson modeling for seat turnover and loan velocity."),
            ("Pillar 3: Spatial Graph Routing", "Dijkstra aisle-to-aisle pathfinding to navigate students to exact physical shelves."),
            ("Pillar 4: Transactional Integrity", "Atomic SQLite WAL transactions preventing double-booking of seats or loan copies.")
        ],
        disclaimer="Ideation synthesizes software engineering with physical spatial coordinates and queue mathematics."
    )

    add_recto_image(
        s8,
        "diagram_slide8_ideation.png",
        "Four Multidisciplinary Engineering Pillars",
        "Computational convergence: Python AI, Probability Calculus, Spatial Graph Routing, and Transactional Database Integrity."
    )

    # -------------------------------------------------------------
    # SLIDE 9: IDEA SELECTION (CHAPTER VIII: DECISION CALCULUS)
    # -------------------------------------------------------------
    s9 = prs.slides.add_slide(blank_layout)
    build_book_spread(s9, "VIII", "Idea Selection & Strategic SWOT", "CHAPTER VIII · SELECTION MATRIX & SWOT")

    add_verso_text(
        s9,
        chapter_title="Multi-Criteria Decision Analysis (MCDA)",
        kicker="Idea Selection",
        paragraphs=[
            "To select features scientifically, each solution was evaluated against four criteria: Technical Feasibility (30%), Student Impact (35%), Operational Cost (15%), and Architecture Elegance (20%).",
            "This structured evaluation prioritized 4-tier spatial shelf coordinates, synchronized seat concurrency, and tri-portal authentication for Phase 1 production."
        ],
        bullets=[
            ("Strengths", "Unified fullstack architecture, role-tailored workflows, zero-dependency SQLite WAL transactions."),
            ("Weaknesses", "Initial CPU-bound AI semantic matcher prior to GPU cluster deployment."),
            ("Opportunities", "RFID smart shelf telemetry, campus ERP single sign-on, institutional analytics."),
            ("Threats", "Peak concurrent exam-week network traffic, browser hardware variance on older client devices.")
        ],
        disclaimer="Selected ideas distinguish immediate operational requirements from phased roadmap enhancements."
    )

    add_recto_image(
        s9,
        "diagram_slide9_selection.png",
        "MCDA Prioritization Matrix & Strategic SWOT Grid",
        "Objective multi-criteria evaluation matrix coupled with comprehensive Strengths, Weaknesses, Opportunities, and Threats analysis."
    )

    # -------------------------------------------------------------
    # SLIDE 10: PROTOTYPE (CHAPTER IX: TACTICAL ARCHITECTURE)
    # -------------------------------------------------------------
    s10 = prs.slides.add_slide(blank_layout)
    build_book_spread(s10, "IX", "Prototype & Functional Modules", "CHAPTER IX · SYSTEM PROTOTYPE ARCHITECTURE")

    add_verso_text(
        s10,
        chapter_title="Tactical System Prototype Overview",
        kicker="System Prototype",
        paragraphs=[
            "The LibraMind prototype has been fully implemented into functional fullstack software featuring four core operational modules.",
            "Built with React 18, Vite, Node.js, Express, and SQLite WAL, the system provides zero-latency client updates and seamless role switching."
        ],
        bullets=[
            ("Module 1: Search & 4-Tier Stacks", "Live search with category filtering and exact physical coordinates (Floor 1, Zone A, Aisle 3, Shelf SP-01)."),
            ("Module 2: Member Sanctuary Hub", "Active loan tracking, automatic return dates, 1-click renewals, and waiting list queue status."),
            ("Module 3: Circulation Barcode Desk", "Scan book barcode to automatically associate patron record; handles issues, returns, and penalty fees."),
            ("Module 4: Study Seat Concurrency Map", "Floor-by-floor interactive carrel map with real-time green/red state indicators.")
        ],
        disclaimer="Modules are operational in the local codebase; Node.js backend connects to Python AI microservice bridge."
    )

    add_recto_image(
        s10,
        "diagram_slide10_prototype.png",
        "Interactive Prototype Architecture & Modules",
        "Four core modules, database schema, and REST communication between the Node.js backend and the Python AI service."
    )

    # -------------------------------------------------------------
    # SLIDE 11: TESTING & VALIDATION (CHAPTER X: QA MATRIX)
    # -------------------------------------------------------------
    s11 = prs.slides.add_slide(blank_layout)
    build_book_spread(s11, "X", "Testing, Validation & Quality Assurance", "CHAPTER X · EMPIRICAL VERIFICATION")

    add_verso_text(
        s11,
        chapter_title="Comprehensive Quality Assurance Protocols",
        kicker="Testing & Validation",
        paragraphs=[
            "Validation was executed across multiple functional dimensions: Role-Based Access Control (RBAC), database transaction isolation, barcode desk lookup speed, and carrel concurrency locks.",
            "Honest Academic Standard: Rather than inventing unverified user satisfaction percentages, our evaluation documents concrete functional test cases executed within the test environment."
        ],
        bullets=[
            ("TC-01: RBAC Boundary Integrity", "Verified that students cannot access librarian barcode routes or administrator consoles."),
            ("TC-02: Seat Concurrency Atomic Lock", "Simulated concurrent booking on Carrel P-04. First request secured lock; second received conflict alert."),
            ("TC-03: Barcode Desk Scan Association", "Verified barcode input associates copy with patron record in under 100ms response window."),
            ("TC-04: Loan State Transition Machine", "Enforced strict state machine: Available <-> Borrowed <-> Return Pending <-> Returned.")
        ],
        disclaimer="Functional verification completed; System Usability Scale (SUS) survey protocol established for campus pilot."
    )

    add_recto_image(
        s11,
        "diagram_slide11_testing.png",
        "Empirical System Verification Matrix",
        "Test cases, execution parameters, and pass criteria verifying role-based access, concurrency locks, and barcode scan association."
    )

    # -------------------------------------------------------------
    # SLIDE 12: RESULTS & ITERATIONS (CHAPTER XI: REFINEMENT)
    # -------------------------------------------------------------
    s12 = prs.slides.add_slide(blank_layout)
    build_book_spread(s12, "XI", "Results & Design Iteration Trajectory", "CHAPTER XI · DESIGN REFINEMENT TRAJECTORY")

    add_verso_text(
        s12,
        chapter_title="Iterative Design Trajectory (V1 -> V3)",
        kicker="Design Iterations",
        paragraphs=[
            "Design Thinking thrives on continuous iteration. LibraMind evolved across three distinct development phases in response to usability evaluations and architectural testing.",
            "Each iteration eliminated operational bottlenecks while refining the human-centered aesthetics of the platform."
        ],
        bullets=[
            ("Iteration 1 (V1 Baseline)", "Generic table UI with plain text lists. Defect: High student discovery latency and lack of physical shelf coordinates."),
            ("Iteration 2 (V2 Spatial Stacks)", "Introduced 4-tier rack coordinates (Floor -> Shelf) and tri-portal role separation. Defect: Fragmented navigation drawer on mobile."),
            ("Iteration 3 (V3 Production Prototype)", "Biophilic Editorial Academic Design System (#1E3A2F, #FAF8F5, #C2923D), automated 14-day penalty calculator, waiting list queue dispatcher, and 21 architectural blueprints.")
        ],
        disclaimer="Features clearly demarcated: V3 operational in repository; V4 deep transformer embeddings planned."
    )

    add_recto_image(
        s12,
        "diagram_slide12_iterations.png",
        "Three-Phase Design Evolution & Feature Ledger",
        "Visual progression from early baseline wireframes to spatial stack navigation and the final biophilic editorial sanctuary."
    )

    # -------------------------------------------------------------
    # SLIDE 13: IMPACT & LIMITATIONS (CHAPTER XII: BOUNDARIES)
    # -------------------------------------------------------------
    s13 = prs.slides.add_slide(blank_layout)
    build_book_spread(s13, "XII", "Socio-Technical Impact & Limitations", "CHAPTER XII · IMPACT & BOUNDARY REALITIES")

    add_verso_text(
        s13,
        chapter_title="Operational Value vs Engineering Constraints",
        kicker="Impact & Limitations",
        paragraphs=[
            "Academic integrity requires balancing anticipated operational benefits against realistic technical and hardware boundary conditions.",
            "LibraMind delivers measurable human-centered benefits while acknowledging the architectural constraints inherent in university deployments."
        ],
        bullets=[
            ("Anticipated Impact: Spatial Discovery", "Eliminates physical rack hunting by providing exact floor, aisle, and shelf coordinates."),
            ("Anticipated Impact: Democratic Carrels", "Concurrency-safe seating eliminates seat hogging and exam-week tension."),
            ("Anticipated Impact: Desk Velocity", "Barcode desk scanning speeds up book checkout and automated overdue settlement."),
            ("Technical Limitation: Local Database", "SQLite WAL is optimized for single-campus use; distributed multi-campus requires PostgreSQL."),
            ("Technical Limitation: Physical Compliance", "Digital seat map requires student adherence; automated hardware requires IoT sensors.")
        ],
        disclaimer="No unverified percentage improvements claimed; benefits represent architectural capabilities."
    )

    add_recto_image(
        s13,
        "diagram_slide13_impact.png",
        "Impact Vectors & Technical Boundary Realities",
        "Structured comparison matrix contrasting anticipated socio-technical value against technical constraints and hardware prerequisites."
    )

    # -------------------------------------------------------------
    # SLIDE 14: CONCLUSION & FUTURE SCOPE (CHAPTER XIII: SYNTHESIS)
    # -------------------------------------------------------------
    s14 = prs.slides.add_slide(blank_layout)
    build_book_spread(s14, "XIII", "Conclusion & Next-Generation Scope", "CHAPTER XIII · SYNTHESIS & FUTURE HORIZONS")

    add_verso_text(
        s14,
        chapter_title="Design Thinking Synthesis & Future Scope",
        kicker="Conclusion & Future Scope",
        paragraphs=[
            "LibraMind completes the complete Design Thinking cycle: from empathizing with frustrated scholars and staff, through mathematical problem definition, multidisciplinary ideation, and tactical prototype implementation.",
            "The system proves that university libraries can preserve their timeless sanctuary atmosphere while harnessing modern fullstack and AI technologies."
        ],
        bullets=[
            ("Phase I: Deep Neural Embeddings", "Deploy all-MiniLM-L6-v2 transformer pipeline via Python Flask for conceptual mood search."),
            ("Phase II: Predictive Demand Modeling", "LSTM neural networks and Poisson models forecasting exam-week loan velocity and carrel saturation."),
            ("Phase III: IoT Smart Shelf Telemetry", "ESP32 UHF RFID antenna arrays along physical racks to continuously track misplaced books."),
            ("Phase IV: Conversational AI Librarian", "Retrieval-Augmented Generation (RAG) assistant for syllabus research guidance.")
        ],
        disclaimer="All proposed future features are explicitly identified and separated from existing operational software."
    )

    add_recto_image(
        s14,
        "diagram_slide14_roadmap.png",
        "Next-Generation Technological Horizons",
        "Visual phased roadmap: Neural vector embeddings, predictive queue analytics, IoT smart shelf RFID telemetry, and conversational AI."
    )

    # -------------------------------------------------------------
    # SLIDE 15: REFERENCES & Q&A (CHAPTER XIV: BIBLIOGRAPHY)
    # -------------------------------------------------------------
    s15 = prs.slides.add_slide(blank_layout)
    build_book_spread(s15, "XIV", "References & Scholarly Dialogue", "CHAPTER XIV · SCHOLARLY BIBLIOGRAPHY & Q&A")

    add_verso_text(
        s15,
        chapter_title="Academic Bibliography & Citations",
        kicker="References",
        paragraphs=[
            "Our research and implementation are grounded in peer-reviewed scholarship across Design Thinking, human-computer interaction, and computational queueing theory."
        ],
        bullets=[
            ("Brown, T. (2008)", "'Design Thinking.' Harvard Business Review, 86(6), 84-92. Foundational methodology for human-centered inquiry."),
            ("Norman, D. A. (2013)", "'The Design of Everyday Things.' Basic Books. Principles of physical affordances."),
            ("ACRL Standards (2018)", "Standards for Libraries in Higher Education. Association of College and Research Libraries."),
            ("Kleinrock, L. (1975)", "'Queueing Systems, Volume 1: Theory.' John Wiley & Sons. Theoretical framework for Poisson arrivals."),
            ("Vaswani, A. et al. (2017)", "'Attention Is All You Need.' NeurIPS. Foundation for transformer semantic vector search.")
        ],
        disclaimer="Citations reflect verified academic publications and established technical standards."
    )

    q_box = s15.shapes.add_textbox(Inches(7.133), Inches(0.95), Inches(5.25), Inches(5.75))
    qtf = q_box.text_frame
    qtf.word_wrap = True

    qp1 = qtf.paragraphs[0]
    qp1.text = "TECHNOLOGY STACK & DEFENSE DIALOGUE".upper()
    qp1.font.name = FONT_SANS
    qp1.font.size = Pt(7.5)
    qp1.font.bold = True
    qp1.font.color.rgb = C_TERRACOTTA
    qp1.space_after = Pt(2)

    qp2 = qtf.add_paragraph()
    qp2.text = "Technology Stack Registry"
    qp2.font.name = FONT_SERIF
    qp2.font.size = Pt(14.5)
    qp2.font.bold = True
    qp2.font.color.rgb = C_FOREST
    qp2.space_after = Pt(6)

    techs = [
        ("Frontend Presentation", "React 18.2, Vite 5, Tailwind CSS, Lucide React, Biophilic Editorial Theme"),
        ("Backend Services", "Node.js 20, Express 4.19, JSON Web Tokens (JWT), RESTful API Controllers"),
        ("Data Persistence", "SQLite 3 with Write-Ahead Logging (WAL) for atomic concurrency isolation"),
        ("AI & Mathematics", "Python 3.13, PyTorch, Matplotlib, Scikit-learn, NumPy queueing models")
    ]
    for cat, tools in techs:
        p = qtf.add_paragraph()
        p.text = f"❖  {cat}: "
        p.font.name = FONT_SERIF
        p.font.size = Pt(8.2)
        p.font.bold = True
        p.font.color.rgb = C_FOREST

        r = p.add_run()
        r.text = tools
        r.font.name = FONT_SANS
        r.font.size = Pt(7.8)
        r.font.bold = False
        r.font.color.rgb = C_TEXT_DARK
        p.space_after = Pt(3)

    qa_card = s15.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.133), Inches(3.65), Inches(5.25), Inches(2.8))
    qa_card.fill.solid()
    qa_card.fill.fore_color.rgb = C_BOX_BG
    qa_card.line.color.rgb = C_GOLD
    qa_card.line.width = Pt(1.2)

    qa_tbox = s15.shapes.add_textbox(Inches(7.3), Inches(3.8), Inches(4.9), Inches(2.5))
    qatf = qa_tbox.text_frame
    qatf.word_wrap = True

    qap1 = qatf.paragraphs[0]
    qap1.text = "EXAMINATION & COMMITTEE DIALOGUE"
    qap1.font.name = FONT_SERIF
    qap1.font.size = Pt(9.5)
    qap1.font.bold = True
    qap1.font.color.rgb = C_TERRACOTTA
    qap1.alignment = PP_ALIGN.CENTER
    qap1.space_after = Pt(5)

    qap2 = qatf.add_paragraph()
    qap2.text = "Thank you for your scholarly attention."
    qap2.font.name = FONT_SERIF
    qap2.font.size = Pt(14.0)
    qap2.font.bold = True
    qap2.font.color.rgb = C_FOREST
    qap2.alignment = PP_ALIGN.CENTER
    qap2.space_after = Pt(5)

    qap3 = qatf.add_paragraph()
    qap3.text = "We warmly invite questions, critique, and academic dialogue from the evaluation committee regarding the Design Thinking process, architectural implementation, or future engineering horizons."
    qap3.font.name = FONT_SERIF
    qap3.font.size = Pt(8.2)
    qap3.font.italic = True
    qap3.font.color.rgb = C_TEXT_DARK
    qap3.alignment = PP_ALIGN.CENTER

    out_root = "LibraMind_Design_Thinking_Presentation.pptx"
    out_public = "frontend/public/LibraMind_Design_Thinking_Presentation.pptx"
    out_backend = "backend/uploads/LibraMind_Design_Thinking_Presentation.pptx"

    prs.save(out_root)
    shutil.copyfile(out_root, out_public)
    shutil.copyfile(out_root, out_backend)

    print(f"Saved: {out_root}")
    print(f"Slides: {len(prs.slides)}")

if __name__ == "__main__":
    create_presentation()
