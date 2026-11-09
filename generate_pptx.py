"""
LibraMind - Professional 15-Slide Design Thinking Presentation Generator (Revised)
Generates an academically rigorous, 16:9 widescreen presentation using python-pptx.
Preserves the exact 15-slide sequence, eliminates unsupported/fictional statistics,
and provides genuine mathematical frameworks, system architecture, and development iterations.
"""

import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

os.makedirs('frontend/public', exist_ok=True)
os.makedirs('backend/uploads', exist_ok=True)

# Color Palette Constants (Biophilic Editorial Academic Theme)
C_FOREST_DARK = RGBColor(0x1A, 0x30, 0x24)   # #1A3024 Deep forest
C_FOREST_MED  = RGBColor(0x26, 0x44, 0x35)   # #264435 Primary forest
C_SAGE        = RGBColor(0x52, 0x73, 0x62)   # #527362 Muted botanical sage
C_SAGE_LIGHT  = RGBColor(0x8C, 0xA8, 0x99)   # #8CA899 Light sage
C_CREAM       = RGBColor(0xFA, 0xF8, 0xF5)   # #FAF8F5 Warm editorial cream
C_BEIGE       = RGBColor(0xEE, 0xE9, 0xDF)   # #EEE9DF Card background
C_BEIGE_LIGHT = RGBColor(0xF5, 0xF2, 0xEB)   # #F5F2EB Soft container
C_TERRACOTTA  = RGBColor(0x9E, 0x5D, 0x3B)   # #9E5D3B Accent brown/terracotta
C_GOLD        = RGBColor(0xC2, 0x92, 0x3D)   # #C2923D Academic gold
C_TEXT_DARK   = RGBColor(0x1E, 0x24, 0x20)   # #1E2420 Primary reading text
C_TEXT_MUTED  = RGBColor(0x5E, 0x66, 0x60)   # #5E6660 Secondary text
C_WHITE       = RGBColor(0xFF, 0xFF, 0xFF)   # #FFFFFF Clean white
C_BORDER      = RGBColor(0xD9, 0xD3, 0xC7)   # #D9D3C7 Subtle border

FONT_SERIF = "Georgia"
FONT_SANS  = "Segoe UI"

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    def set_slide_background(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_header(slide, kicker_text, title_text, subtitle_text, dark_mode=False):
        kbox = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.35))
        ktf = kbox.text_frame
        ktf.word_wrap = True
        ktf.margin_left = ktf.margin_top = ktf.margin_right = ktf.margin_bottom = 0
        kp = ktf.paragraphs[0]
        kp.text = kicker_text.upper()
        kp.font.name = FONT_SANS
        kp.font.size = Pt(8.5)
        kp.font.bold = True
        kp.font.color.rgb = C_GOLD if dark_mode else C_TERRACOTTA

        tbox = slide.shapes.add_textbox(Inches(0.8), Inches(0.72), Inches(11.7), Inches(0.55))
        ttf = tbox.text_frame
        ttf.word_wrap = True
        ttf.margin_left = ttf.margin_top = ttf.margin_right = ttf.margin_bottom = 0
        tp = ttf.paragraphs[0]
        tp.text = title_text
        tp.font.name = FONT_SERIF
        tp.font.size = Pt(21)
        tp.font.bold = True
        tp.font.color.rgb = C_WHITE if dark_mode else C_FOREST_DARK

        sbox = slide.shapes.add_textbox(Inches(0.8), Inches(1.25), Inches(11.7), Inches(0.4))
        stf = sbox.text_frame
        stf.word_wrap = True
        stf.margin_left = stf.margin_top = stf.margin_right = stf.margin_bottom = 0
        sp = stf.paragraphs[0]
        sp.text = subtitle_text
        sp.font.name = FONT_SANS
        sp.font.size = Pt(10)
        sp.font.color.rgb = C_SAGE_LIGHT if dark_mode else C_TEXT_MUTED

        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.68), Inches(11.733), Inches(0.015))
        line.fill.solid()
        line.fill.fore_color.rgb = RGBColor(0x38, 0x55, 0x44) if dark_mode else C_BORDER
        line.line.fill.background()

    def add_footer(slide, slide_num, total_slides=15, dark_mode=False):
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(7.02), Inches(11.733), Inches(0.012))
        line.fill.solid()
        line.fill.fore_color.rgb = RGBColor(0x38, 0x55, 0x44) if dark_mode else C_BORDER
        line.line.fill.background()

        lbox = slide.shapes.add_textbox(Inches(0.8), Inches(7.08), Inches(5.0), Inches(0.3))
        ltf = lbox.text_frame
        ltf.word_wrap = True
        ltf.margin_left = ltf.margin_top = ltf.margin_right = ltf.margin_bottom = 0
        lp = ltf.paragraphs[0]
        lp.text = "LibraMind — AI-Powered Smart Library Management System"
        lp.font.name = FONT_SANS
        lp.font.size = Pt(8.5)
        lp.font.color.rgb = C_SAGE_LIGHT if dark_mode else C_TEXT_MUTED

        cbox = slide.shapes.add_textbox(Inches(4.8), Inches(7.08), Inches(4.0), Inches(0.3))
        ctf = cbox.text_frame
        ctf.word_wrap = True
        ctf.margin_left = ctf.margin_top = ctf.margin_right = ctf.margin_bottom = 0
        cp = ctf.paragraphs[0]
        cp.alignment = PP_ALIGN.CENTER
        cp.text = "Human-Centered Design Thinking Project"
        cp.font.name = FONT_SANS
        cp.font.size = Pt(8.5)
        cp.font.color.rgb = C_SAGE_LIGHT if dark_mode else C_TEXT_MUTED

        rbox = slide.shapes.add_textbox(Inches(10.533), Inches(7.08), Inches(2.0), Inches(0.3))
        rtf = rbox.text_frame
        rtf.word_wrap = True
        rtf.margin_left = rtf.margin_top = rtf.margin_right = rtf.margin_bottom = 0
        rp = rtf.paragraphs[0]
        rp.alignment = PP_ALIGN.RIGHT
        rp.text = f"Slide {slide_num} of {total_slides}"
        rp.font.name = FONT_SANS
        rp.font.size = Pt(8.5)
        rp.font.bold = True
        rp.font.color.rgb = C_GOLD if dark_mode else C_FOREST_MED

    def add_card(slide, x, y, w, h, bg_color=C_WHITE, border_color=C_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        if border_color:
            card.line.color.rgb = border_color
            card.line.width = Pt(1)
        else:
            card.line.fill.background()
        return card

    # =========================================================
    # SLIDE 1: Title Slide
    # =========================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1, C_FOREST_DARK)

    frame = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.6), Inches(0.6), Inches(12.133), Inches(6.3))
    frame.fill.background()
    frame.line.color.rgb = RGBColor(0x3A, 0x5B, 0x49)
    frame.line.width = Pt(1)

    pill = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.1), Inches(1.1), Inches(4.3), Inches(0.36))
    pill.fill.solid()
    pill.fill.fore_color.rgb = RGBColor(0x24, 0x43, 0x33)
    pill.line.color.rgb = C_GOLD
    pill.line.width = Pt(1)
    ptf = pill.text_frame
    ptf.vertical_anchor = MSO_ANCHOR.MIDDLE
    pp = ptf.paragraphs[0]
    pp.alignment = PP_ALIGN.CENTER
    pp.text = "ACADEMIC DESIGN THINKING PORTFOLIO • VIVA 2026"
    pp.font.name = FONT_SANS
    pp.font.size = Pt(8)
    pp.font.bold = True
    pp.font.color.rgb = C_GOLD

    t1 = s1.shapes.add_textbox(Inches(1.1), Inches(1.65), Inches(11.0), Inches(1.2))
    t1_tf = t1.text_frame
    t1_tf.word_wrap = True
    p1 = t1_tf.paragraphs[0]
    p1.text = "LibraMind"
    p1.font.name = FONT_SERIF
    p1.font.size = Pt(44)
    p1.font.bold = True
    p1.font.color.rgb = C_CREAM

    p1_sub = t1_tf.add_paragraph()
    p1_sub.text = "AI-Powered Smart Library Management System"
    p1_sub.font.name = FONT_SERIF
    p1_sub.font.size = Pt(22)
    p1_sub.font.bold = True
    p1_sub.font.color.rgb = C_SAGE_LIGHT

    t2 = s1.shapes.add_textbox(Inches(1.1), Inches(2.95), Inches(11.0), Inches(0.6))
    t2_tf = t2.text_frame
    t2_tf.word_wrap = True
    p2 = t2_tf.paragraphs[0]
    p2.text = "A Human-Centered Design Thinking Approach to Modern Academic Sanctuaries"
    p2.font.name = FONT_SANS
    p2.font.size = Pt(14)
    p2.font.color.rgb = C_GOLD

    d_bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.1), Inches(3.6), Inches(11.0), Inches(0.02))
    d_bar.fill.solid()
    d_bar.fill.fore_color.rgb = RGBColor(0x3A, 0x5B, 0x49)
    d_bar.line.fill.background()

    meta_cards = [
        ("CANDIDATE & PRESENTER", ["[Insert Student Name]", "Role: Lead Full-Stack Architect", "[Insert Candidate Enrollment / ID]"], 1.1, 3.85, 3.4),
        ("PROJECT TEAM MEMBERS", ["[Insert Team Member 1 – Research & UI]", "[Insert Team Member 2 – Backend & Concurrency]", "[Insert Team Member 3 – Python AI & Data]"], 4.9, 3.85, 3.4),
        ("ACADEMIC INSTITUTION", ["Department of Computer Science & Engineering", "[Insert College / University Name]", "Academic Year: 2025–2026 • Semester [VI / VII]"], 8.7, 3.85, 3.4)
    ]
    for m_label, lines, mx, my, mw in meta_cards:
        c = add_card(s1, mx, my, mw, 2.3, bg_color=RGBColor(0x22, 0x3D, 0x2E), border_color=RGBColor(0x38, 0x5A, 0x47))
        tb = s1.shapes.add_textbox(Inches(mx + 0.15), Inches(my + 0.15), Inches(mw - 0.3), Inches(2.0))
        tf = tb.text_frame
        tf.word_wrap = True
        lp = tf.paragraphs[0]
        lp.text = m_label
        lp.font.name = FONT_SANS
        lp.font.size = Pt(8.5)
        lp.font.bold = True
        lp.font.color.rgb = C_GOLD

        for line_txt in lines:
            lp_i = tf.add_paragraph()
            lp_i.text = f"• {line_txt}"
            lp_i.font.name = FONT_SANS
            lp_i.font.size = Pt(9.5)
            lp_i.font.color.rgb = C_CREAM
            lp_i.space_before = Pt(4)

    add_footer(s1, 1, 15, dark_mode=True)

    # =========================================================
    # SLIDE 2: Introduction
    # =========================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2, C_CREAM)
    add_header(s2, "STAGE 0: CONTEXT & MOTIVATION", "Introduction to Modern Academic Libraries",
               "Analyzing the structural shift from static book archives to digital academic learning sanctuaries.")
    add_footer(s2, 2, 15)

    intro_cards = [
        ("1. Traditional Academic Libraries",
         "The Historical Knowledge Repository",
         ["• Relies on manual Dewey Decimal classification and static call number tags.",
          "• OPAC terminals provide basic metadata without micro-spatial physical coordinates.",
          "• Physical card registries and paper logs create significant administrative overhead.",
          "• Lacks real-time coordination between digital catalogs and physical stacks."],
         0.8, 1.9, 5.7, 2.35),

        ("2. Need for Digital Transformation",
         "Evolving Research Habits & Challenges",
         ["• Students require instantaneous, mobile-accessible catalog discovery.",
          "• Exam weeks create severe competition and disputes over quiet study desks.",
          "• Wandering multi-floor buildings searching for misplaced books wastes critical study time.",
          "• Manual circulation checkouts lead to counter congestion and fee tracking friction."],
         6.8, 1.9, 5.7, 2.35),

        ("3. Smart Library Systems (SLMS)",
         "Bridging Digital Intelligence & Physical Space",
         ["• Integrates micro-spatial coordinates: Floor, Section, Shelf Code, and Rack Unit.",
          "• Employs atomic database concurrency to prevent study seat double-bookings.",
          "• Leverages Natural Language Processing for concept-based research discovery.",
          "• Automates circulation lifecycles with transparent waitlists and return notifications."],
         0.8, 4.45, 5.7, 2.35),

        ("4. LibraMind Project Purpose",
         "A Human-Centered Library Sanctuary",
         ["• Designed following rigorous Human-Centered Design Thinking principles.",
          "• Built with React 19, Node.js/Express 5, SQLite (WAL mode), and Python AI.",
          "• Focuses on three primary friction points: physical retrieval, seat contention, and search rigidity.",
          "• Creates a calm, biophilic digital environment that reduces academic stress."],
         6.8, 4.45, 5.7, 2.35)
    ]
    for kicker, title, points, cx, cy, cw, ch in intro_cards:
        add_card(s2, cx, cy, cw, ch, bg_color=C_WHITE, border_color=C_BORDER)
        tb = s2.shapes.add_textbox(Inches(cx + 0.2), Inches(cy + 0.18), Inches(cw - 0.4), Inches(ch - 0.3))
        tf = tb.text_frame
        tf.word_wrap = True
        
        kp = tf.paragraphs[0]
        kp.text = kicker.upper()
        kp.font.name = FONT_SANS
        kp.font.size = Pt(8.5)
        kp.font.bold = True
        kp.font.color.rgb = C_TERRACOTTA

        tp = tf.add_paragraph()
        tp.text = title
        tp.font.name = FONT_SERIF
        tp.font.size = Pt(13)
        tp.font.bold = True
        tp.font.color.rgb = C_FOREST_DARK
        tp.space_before = Pt(2)

        for p_txt in points:
            pp = tf.add_paragraph()
            pp.text = p_txt
            pp.font.name = FONT_SANS
            pp.font.size = Pt(9)
            pp.font.color.rgb = C_TEXT_DARK
            pp.space_before = Pt(3)

    # =========================================================
    # SLIDE 3: Project Overview
    # =========================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3, C_CREAM)
    add_header(s3, "SYSTEM ARCHITECTURE & CORE PILLARS", "LibraMind Project Overview",
               "High-performance full-stack architecture uniting physical stack navigation, atomic seat locks, and AI discovery.")
    add_footer(s3, 3, 15)

    add_card(s3, 0.8, 1.9, 4.8, 4.9, bg_color=C_WHITE, border_color=C_BORDER)
    tb_p = s3.shapes.add_textbox(Inches(1.0), Inches(2.05), Inches(4.4), Inches(4.6))
    tf_p = tb_p.text_frame
    tf_p.word_wrap = True

    p0 = tf_p.paragraphs[0]
    p0.text = "CORE SYSTEM MODULES & CAPABILITIES"
    p0.font.name = FONT_SANS
    p0.font.size = Pt(9)
    p0.font.bold = True
    p0.font.color.rgb = C_TERRACOTTA

    pillars_text = [
        ("Smart Book Search [Implemented]", "Natural language semantic discovery matching concepts over exact keywords."),
        ("Real-Time Availability [Implemented]", "Barcode-level tracking (Available in Stacks, Reserved, or Checked Out)."),
        ("FIFO Hold Queue [Implemented]", "Automated waitlists with 48h pickup window & instant patron alerts."),
        ("4-Tier Spatial Guidance [Implemented]", "Pinpoint coordinates: Floor Level → Section → Shelf Code → Rack Unit."),
        ("Study Pod Booking [Implemented]", "40 biophilic desk carrels with atomic partial unique index concurrency locks."),
        ("Explainable AI Matches [Implemented]", "Personalized research recommendations with transparent keyword highlights."),
        ("Tripartite Portals [Implemented]", "Dedicated environments for Students (Folio), Librarians (Desk), and Admins.")
    ]
    for p_title, p_desc in pillars_text:
        pt = tf_p.add_paragraph()
        pt.text = f"✔ {p_title}: "
        pt.font.name = FONT_SANS
        pt.font.size = Pt(8.8)
        pt.font.bold = True
        pt.font.color.rgb = C_FOREST_MED
        pt.space_before = Pt(5)

        run = pt.add_run()
        run.text = p_desc
        run.font.bold = False
        run.font.color.rgb = C_TEXT_DARK

    add_card(s3, 5.8, 1.9, 6.733, 4.9, bg_color=C_WHITE, border_color=C_BORDER)
    diag3_path = 'frontend/public/presentation_assets/diagram_slide3_system_overview.png'
    if os.path.exists(diag3_path):
        s3.shapes.add_picture(diag3_path, Inches(5.95), Inches(2.05), width=Inches(6.433))

    # =========================================================
    # SLIDE 4: User Research
    # =========================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4, C_CREAM)
    add_header(s4, "HUMAN-CENTERED INQUIRY", "User Research Methodology & Target Personas",
               "Investigating physical library friction through structured surveys, contextual interviews, and stack observation.")
    add_footer(s4, 4, 15)

    steps = [
        ("1. User Surveys & Questionnaires", "Structured quantitative inquiry on study frequency, retrieval difficulty, and peak hours."),
        ("2. Semi-Structured Interviews", "One-on-one sessions with student researchers and circulation desk archivists."),
        ("3. Contextual Observation", "Shadowing patrons in multi-floor stacks and observing carrel allocation dynamics."),
        ("4. Requirements Synthesis", "Affinity mapping to translate qualitative frustrations into engineering specifications.")
    ]
    for i, (stitle, sdesc) in enumerate(steps):
        sx = 0.8 + i * 2.98
        add_card(s4, sx, 1.9, 2.78, 1.35, bg_color=C_BEIGE, border_color=C_BORDER)
        tb_s = s4.shapes.add_textbox(Inches(sx + 0.12), Inches(2.0), Inches(2.54), Inches(1.15))
        tfs = tb_s.text_frame
        tfs.word_wrap = True
        sp0 = tfs.paragraphs[0]
        sp0.text = stitle
        sp0.font.name = FONT_SANS
        sp0.font.size = Pt(9.5)
        sp0.font.bold = True
        sp0.font.color.rgb = C_FOREST_DARK

        sp1 = tfs.add_paragraph()
        sp1.text = sdesc
        sp1.font.name = FONT_SANS
        sp1.font.size = Pt(8.2)
        sp1.font.color.rgb = C_TEXT_DARK
        sp1.space_before = Pt(3)

    personas = [
        ("TARGET PERSONA 1: THE ACADEMIC SCHOLAR / STUDENT",
         "Illustrative Design Persona: Undergrad & Postgraduate Researchers",
         ["• Academic Objectives: Fast textbook retrieval during exams; reserving uninterrupted quiet study carrels.",
          "• Common Behaviors: Searches by research topics or concepts rather than exact call number strings.",
          "• Core Pain Points: Wanders between aisles searching for misfiled books; discovers study seats occupied despite online listings; misses return deadlines without notices.",
          "• Target Research Metrics: [Institutional Survey Cohort: N = Target Sample Size; Average Visits/Week: 3–5]."],
         0.8, 3.45, 5.7, 3.35, C_WHITE),

        ("TARGET PERSONA 2: THE CIRCULATION LIBRARIAN",
         "Illustrative Design Persona: Circulation Desk & Archival Staff",
         ["• Operational Objectives: Efficient book check-ins/returns; zero seat disputes; accurate stack audits.",
          "• Common Behaviors: Scans barcodes; manages hold reservations; manually reconciles overdue loan fines.",
          "• Core Pain Points: Manual barcode entry errors; friction with students over overdue fees; lack of automated notifications when returned volumes match waiting students.",
          "• Target Research Metrics: [Circulation Counter Transactions/Day: Target Institutional Baseline]."],
         6.8, 3.45, 5.7, 3.35, C_WHITE)
    ]
    for p_head, p_sub, points, px, py, pw, ph, pbg in personas:
        add_card(s4, px, py, pw, ph, bg_color=pbg, border_color=C_BORDER)
        tb_pr = s4.shapes.add_textbox(Inches(px + 0.2), Inches(py + 0.2), Inches(pw - 0.4), Inches(ph - 0.35))
        tf_pr = tb_pr.text_frame
        tf_pr.word_wrap = True

        p0 = tf_pr.paragraphs[0]
        p0.text = p_head
        p0.font.name = FONT_SANS
        p0.font.size = Pt(9)
        p0.font.bold = True
        p0.font.color.rgb = C_TERRACOTTA

        p1 = tf_pr.add_paragraph()
        p1.text = p_sub
        p1.font.name = FONT_SERIF
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = C_FOREST_DARK
        p1.space_before = Pt(2)

        for pt_txt in points:
            pp = tf_pr.add_paragraph()
            pp.text = pt_txt
            pp.font.name = FONT_SANS
            pp.font.size = Pt(8.5)
            pp.font.color.rgb = C_TEXT_DARK
            pp.space_before = Pt(3)

    # =========================================================
    # SLIDE 5: Empathize
    # =========================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5, C_CREAM)
    add_header(s5, "DESIGN THINKING • STAGE 1: EMPATHIZE", "Empathy Mapping: Student & Staff Experiences",
               "Capturing the cognitive doubts, emotional states, verbalized friction, and observable behaviors of library patrons.")
    add_footer(s5, 5, 15)

    empathy_quads = [
        ("THINK (Cognitive World)",
         "Internal Doubts & Unspoken Frustrations",
         ["• 'Where is this book physically shelved in this multi-floor library?'",
          "• 'Will I find an empty study desk during peak exam weeks, or will I waste time walking between floors?'",
          "• 'Did the librarian actually hold my reserved volume, or will someone else grab it from the desk?'",
          "• 'I hope my overdue fine isn't huge—I never received a return warning reminder.'"],
         0.8, 1.9, 5.7, 2.35, C_WHITE, C_FOREST_MED),

        ("FEEL (Emotional Landscape)",
         "Stress, Anxiety & Anticipation",
         ["• Stressed & rushed during midterm exam deadlines when study seats are scarce.",
          "• Annoyed when walking across three floors only to find reserved carrels occupied.",
          "• Embarrassed when arguing with staff over unnotified overdue loan fines.",
          "• Relieved when book shelf coordinates and seat bookings are guaranteed."],
         6.8, 1.9, 5.7, 2.35, C_WHITE, C_TERRACOTTA),

        ("SAY (Representative User Statements)",
         "Expressed Friction During Initial Elicitation",
         ["• 'The catalog says Available, but I searched the entire shelf and couldn't find the volume.'",
          "• 'Students leave bags on study desks for hours without actually sitting there.'",
          "• 'I know the topic I want, but I can't remember the author or exact keywords.'",
          "• 'Librarians spend significant time answering repetitive shelf location questions.'"],
         0.8, 4.45, 5.7, 2.35, C_WHITE, C_GOLD),

        ("DO (Observable Behaviors)",
         "Coping Habits & Inefficient Workarounds",
         ["• Taking smartphone photos of desktop catalog screens to remember call numbers.",
          "• Wandering between physical aisles squinting at tiny spine call number tags.",
          "• Asking circulation librarians repetitive directional questions about shelf aisles.",
          "• Arriving early at library opening solely to race for a quiet window carrel."],
         6.8, 4.45, 5.7, 2.35, C_WHITE, C_SAGE)
    ]
    for q_title, q_sub, points, qx, qy, qw, qh, qbg, qborder in empathy_quads:
        add_card(s5, qx, qy, qw, qh, bg_color=qbg, border_color=qborder)
        tb_q = s5.shapes.add_textbox(Inches(qx + 0.2), Inches(qy + 0.18), Inches(qw - 0.4), Inches(qh - 0.3))
        tf_q = tb_q.text_frame
        tf_q.word_wrap = True

        p0 = tf_q.paragraphs[0]
        p0.text = q_title
        p0.font.name = FONT_SANS
        p0.font.size = Pt(9)
        p0.font.bold = True
        p0.font.color.rgb = qborder

        p1 = tf_q.add_paragraph()
        p1.text = q_sub
        p1.font.name = FONT_SERIF
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = C_FOREST_DARK
        p1.space_before = Pt(2)

        for p_txt in points:
            pp = tf_q.add_paragraph()
            pp.text = p_txt
            pp.font.name = FONT_SANS
            pp.font.size = Pt(8.5)
            pp.font.color.rgb = C_TEXT_DARK
            pp.space_before = Pt(3)

    # =========================================================
    # SLIDE 6: Statistical Findings
    # =========================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6, C_CREAM)
    add_header(s6, "EMPIRICAL ANALYSIS & PROBABILITY", "Statistical Methodology & Mathematical Modeling",
               "Mathematical formulation of physical book retrieval latency, probability of carrel availability, and statistical metrics.")
    add_footer(s6, 6, 15)

    add_card(s6, 0.8, 1.9, 4.3, 4.9, bg_color=C_WHITE, border_color=C_BORDER)
    tb_m = s6.shapes.add_textbox(Inches(1.0), Inches(2.05), Inches(3.9), Inches(4.6))
    tf_m = tb_m.text_frame
    tf_m.word_wrap = True

    mp0 = tf_m.paragraphs[0]
    mp0.text = "STATISTICAL MEASURES & FORMULAS"
    mp0.font.name = FONT_SANS
    mp0.font.size = Pt(9)
    mp0.font.bold = True
    mp0.font.color.rgb = C_TERRACOTTA

    math_points = [
        ("Mean Retrieval Time (μ)", "Calculates average time spent locating physical volumes: μ = (1/n) Σ x_i."),
        ("Median (Q2) & Mode", "Robust central tendency indicators to evaluate typical search duration resistant to outliers."),
        ("Standard Deviation (s)", "Measures variability and dispersion in physical stack search: s = sqrt(Σ(x_i - x̄)² / (n - 1))."),
        ("Probability Modeling P(Occ)", "Poisson distribution modeling peak carrel arrival rates and probability of full occupancy."),
        ("Frequency Distribution", "Binned frequency histograms categorizing retrieval durations into discrete intervals."),
        ("Empirical Status Note", "[Methodology Framework: Mathematical models established; parameters to be logged during campus pilot].")
    ]
    for m_head, m_desc in math_points:
        mp = tf_m.add_paragraph()
        mp.text = f"• {m_head}: "
        mp.font.name = FONT_SANS
        mp.font.size = Pt(8.6)
        mp.font.bold = True
        mp.font.color.rgb = C_FOREST_MED
        mp.space_before = Pt(5)

        run = mp.add_run()
        run.text = m_desc
        run.font.bold = False
        run.font.color.rgb = C_TEXT_DARK

    add_card(s6, 5.3, 1.9, 7.233, 4.9, bg_color=C_WHITE, border_color=C_BORDER)
    chart6_path = 'frontend/public/presentation_assets/chart_slide6_stats.png'
    if os.path.exists(chart6_path):
        s6.shapes.add_picture(chart6_path, Inches(5.45), Inches(2.05), width=Inches(6.933))

    # =========================================================
    # SLIDE 7: Define
    # =========================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7, C_CREAM)
    add_header(s7, "DESIGN THINKING • STAGE 2: DEFINE", "Problem Definition & Problem Tree Analysis",
               "Deconstructing systemic root causes, core operational friction, and downstream academic consequences.")
    add_footer(s7, 7, 15)

    add_card(s7, 0.8, 1.85, 11.733, 0.95, bg_color=C_FOREST_MED, border_color=C_GOLD)
    tb_ps = s7.shapes.add_textbox(Inches(1.0), Inches(1.9), Inches(11.333), Inches(0.85))
    tf_ps = tb_ps.text_frame
    tf_ps.word_wrap = True

    psp0 = tf_ps.paragraphs[0]
    psp0.text = "CORE PROBLEM STATEMENT (POV)"
    psp0.font.name = FONT_SANS
    psp0.font.size = Pt(8.5)
    psp0.font.bold = True
    psp0.font.color.rgb = C_GOLD

    psp1 = tf_ps.add_paragraph()
    psp1.text = "“Academic library patrons and staff face severe retrieval delays, frequent study carrel allocation disputes, and rigid keyword search barriers because existing systems lack micro-spatial coordinates, atomic concurrency controls, and conceptual discovery mechanisms.”"
    psp1.font.name = FONT_SERIF
    psp1.font.size = Pt(11)
    psp1.font.color.rgb = C_WHITE
    psp1.space_before = Pt(2)

    add_card(s7, 0.8, 2.9, 11.733, 3.95, bg_color=C_WHITE, border_color=C_BORDER)
    diag7_path = 'frontend/public/presentation_assets/diagram_slide7_problem_tree.png'
    if os.path.exists(diag7_path):
        s7.shapes.add_picture(diag7_path, Inches(0.95), Inches(3.0), width=Inches(11.433))

    # =========================================================
    # SLIDE 8: Ideation
    # =========================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8, C_CREAM)
    add_header(s8, "DESIGN THINKING • STAGE 3: IDEATION", "Multidisciplinary Engineering & Solution Space",
               "Brainstorming and integrating Computer Science, AI, Discrete Math, and Spatial Algorithms.")
    add_footer(s8, 8, 15)

    add_card(s8, 0.8, 1.9, 11.733, 4.95, bg_color=C_WHITE, border_color=C_BORDER)
    diag8_path = 'frontend/public/presentation_assets/diagram_slide8_ideation.png'
    if os.path.exists(diag8_path):
        s8.shapes.add_picture(diag8_path, Inches(0.95), Inches(2.0), width=Inches(11.433))

    # =========================================================
    # SLIDE 9: Idea Selection
    # =========================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9, C_CREAM)
    add_header(s9, "DESIGN THINKING • STAGE 4: SELECTION", "Prioritization Matrix & Comprehensive SWOT Analysis",
               "Evaluating proposed innovations across technical feasibility, patron impact, and operational resilience.")
    add_footer(s9, 9, 15)

    add_card(s9, 0.8, 1.9, 11.733, 4.95, bg_color=C_WHITE, border_color=C_BORDER)
    diag9_path = 'frontend/public/presentation_assets/diagram_slide9_selection.png'
    if os.path.exists(diag9_path):
        s8.shapes.add_picture(diag9_path, Inches(0.95), Inches(2.0), width=Inches(11.433))

    # =========================================================
    # SLIDE 10: Prototype
    # =========================================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10, C_CREAM)
    add_header(s10, "DESIGN THINKING • STAGE 5: PROTOTYPE", "The LibraMind Full-Stack Operational Platform",
               "Translating human-centered requirements into an operational React 19, Express 5, and SQLite web system.")
    add_footer(s10, 10, 15)

    add_card(s10, 0.8, 1.9, 11.733, 4.95, bg_color=C_WHITE, border_color=C_BORDER)
    diag10_path = 'frontend/public/presentation_assets/diagram_slide10_prototype.png'
    if os.path.exists(diag10_path):
        s10.shapes.add_picture(diag10_path, Inches(0.95), Inches(2.0), width=Inches(11.433))

    # =========================================================
    # SLIDE 11: Testing & Validation
    # =========================================================
    s11 = prs.slides.add_slide(blank_layout)
    set_slide_background(s11, C_CREAM)
    add_header(s11, "VERIFICATION & VALIDATION", "Testing Scenarios & Concurrency Verification",
               "Empirical verification covering REST endpoints, concurrency integrity, and user workflow validation.")
    add_footer(s11, 11, 15)

    add_card(s11, 0.8, 1.9, 4.2, 4.9, bg_color=C_WHITE, border_color=C_BORDER)
    tb_t = s11.shapes.add_textbox(Inches(1.0), Inches(2.05), Inches(3.8), Inches(4.6))
    tf_t = tb_t.text_frame
    tf_t.word_wrap = True

    tp0 = tf_t.paragraphs[0]
    tp0.text = "TESTING PROTOCOL & RIGOR"
    tp0.font.name = FONT_SANS
    tp0.font.size = Pt(9)
    tp0.font.bold = True
    tp0.font.color.rgb = C_TERRACOTTA

    test_bullets = [
        ("Concurrency Verification (0 Double-Bookings)", "Executed simultaneous booking requests on the same study seat; SQLite Partial Unique Indexes successfully serialize transactions."),
        ("RESTful Route Verification", "Verified core route domains: Auth & JWT, Books, Loans, Seats, Wishlist, Notifications, Penalties."),
        ("Role-Based Access Enforcement", "Students strictly prevented from accessing staff circulation desks or administrative governance consoles."),
        ("Usability Evaluation Plan", "[Proposed Usability Testing Protocol: System Usability Scale (SUS) 10-item framework; Benchmark Target: SUS > 80].")
    ]
    for thead, tdesc in test_bullets:
        tp = tf_t.add_paragraph()
        tp.text = f"✔ {thead}: "
        tp.font.name = FONT_SANS
        tp.font.size = Pt(8.8)
        tp.font.bold = True
        tp.font.color.rgb = C_FOREST_MED
        tp.space_before = Pt(6)

        run = tp.add_run()
        run.text = tdesc
        run.font.bold = False
        run.font.color.rgb = C_TEXT_DARK

    add_card(s11, 5.2, 1.9, 7.333, 4.9, bg_color=C_WHITE, border_color=C_BORDER)
    
    table_shape = s11.shapes.add_table(6, 4, Inches(5.35), Inches(2.05), Inches(7.033), Inches(4.6))
    tbl = table_shape.table
    tbl.columns[0].width = Inches(1.3)
    tbl.columns[1].width = Inches(2.4)
    tbl.columns[2].width = Inches(2.3)
    tbl.columns[3].width = Inches(1.033)

    test_rows = [
        ("MODULE", "TEST SCENARIO", "VERIFIED OUTCOME", "STATUS"),
        ("Auth & OTP", "Student enters mobile & 6-digit OTP", "Validates code & opens Profile Setup", "VERIFIED"),
        ("Spatial Search", "Query 'Cloud Backend' for shelf tags", "Returns Floor 2, Shelf CS-03, Rack 01", "VERIFIED"),
        ("Seat Booking", "Simultaneous requests on Study Pod #5", "1 seat locked; race attempts serialized", "VERIFIED"),
        ("Borrow & Return", "Borrow copy, return, and re-borrow", "Clean loan reset; 2nd borrow allowed", "VERIFIED"),
        ("Two-Tier Penalty", "Overdue book > 14 days circulation", "Shows return warning -> issues QR fine", "VERIFIED")
    ]
    for r_idx, row in enumerate(test_rows):
        for c_idx, val in enumerate(row):
            cell = tbl.cell(r_idx, c_idx)
            cell.text = val
            p = cell.text_frame.paragraphs[0]
            p.font.name = FONT_SANS
            if r_idx == 0:
                p.font.size = Pt(8.5)
                p.font.bold = True
                p.font.color.rgb = C_WHITE
                cell.fill.solid()
                cell.fill.fore_color.rgb = C_FOREST_DARK
            else:
                p.font.size = Pt(8)
                p.font.color.rgb = C_TEXT_DARK
                if c_idx == 3:
                    p.font.bold = True
                    p.font.color.rgb = C_FOREST_MED
                cell.fill.solid()
                cell.fill.fore_color.rgb = C_CREAM if r_idx % 2 == 1 else C_WHITE

    # =========================================================
    # SLIDE 12: Results & Iterations
    # =========================================================
    s12 = prs.slides.add_slide(blank_layout)
    set_slide_background(s12, C_CREAM)
    add_header(s12, "DESIGN THINKING REFINEMENT", "Design Iterations & Feedback-Driven Evolution",
               "Demonstrating how user feedback directly transformed interface density, borrowing cycles, and penalty management.")
    add_footer(s12, 12, 15)

    iterations = [
        ("Iteration 1: Navigation System & Single-Line Flow",
         "Initial Issue: Header text clipped; rigid container squeezed tabs.",
         "User Feedback: 'I can't see the Check Out or Return buttons on my 14-inch laptop.'",
         "Design Evolution: Re-architected headers with fluid clamped padding and responsive flexbox. Added mobile drawers for small screens.",
         0.8, 1.9, 3.75),

        ("Iteration 2: Book Card Action Re-organization",
         "Initial Issue: Floating overlay icons (♡, ⇄, 🧭) covered book artwork in catalog.",
         "User Feedback: 'Wishlist buttons clutter the book covers; let me click on the book first.'",
         "Design Evolution: Removed floating icons from cards. Centralized Wishlist, Compare, and Planner into a dedicated 'My Shelf' suite.",
         4.78, 1.9, 3.75),

        ("Iteration 3: Multi-Borrow & Polite Return Notice",
         "Initial Issue: Returned books blocked 2nd-time checkout; fines issued bluntly.",
         "User Feedback: 'If I return a book, I should be able to borrow it again immediately.'",
         "Design Evolution: Added return_date IS NULL filter for instant re-borrowing. Split penalties into polite Return Warning then QR fine.",
         8.76, 1.9, 3.75)
    ]
    for ititle, iissue, ifeed, isol, ix, iy, iw in iterations:
        add_card(s12, ix, iy, iw, 3.4, bg_color=C_WHITE, border_color=C_BORDER)
        tb_it = s12.shapes.add_textbox(Inches(ix + 0.15), Inches(iy + 0.15), Inches(iw - 0.3), Inches(3.1))
        tf_it = tb_it.text_frame
        tf_it.word_wrap = True

        p0 = tf_it.paragraphs[0]
        p0.text = ititle
        p0.font.name = FONT_SERIF
        p0.font.size = Pt(11)
        p0.font.bold = True
        p0.font.color.rgb = C_FOREST_DARK

        for label, txt, col in [("Initial Issue", iissue, C_TERRACOTTA), ("Feedback", ifeed, C_GOLD), ("Refinement", isol, C_FOREST_MED)]:
            pp = tf_it.add_paragraph()
            pp.text = f"{label}: "
            pp.font.name = FONT_SANS
            pp.font.size = Pt(8.2)
            pp.font.bold = True
            pp.font.color.rgb = col
            pp.space_before = Pt(4)

            run = pp.add_run()
            run.text = txt
            run.font.bold = False
            run.font.color.rgb = C_TEXT_DARK

    add_card(s12, 0.8, 5.45, 11.733, 1.45, bg_color=C_BEIGE, border_color=C_BORDER)
    tb_stat = s12.shapes.add_textbox(Inches(1.0), Inches(5.55), Inches(11.333), Inches(1.25))
    tf_stat = tb_stat.text_frame
    tf_stat.word_wrap = True

    p_s0 = tf_stat.paragraphs[0]
    p_s0.text = "FEATURE VERIFICATION & STATUS BREAKDOWN"
    p_s0.font.name = FONT_SANS
    p_s0.font.size = Pt(8.5)
    p_s0.font.bold = True
    p_s0.font.color.rgb = C_FOREST_DARK

    p_s1 = tf_stat.add_paragraph()
    p_s1.text = "✔ COMPLETED & LIVE: 4-Tier Spatial Stack Guidance | Real-Time Copy Tracking | Atomic Concurrency Study Pods | FIFO Waitlists | Mobile OTP Registration | Two-Tier Polite Return Warnings & Penalty QR Codes | Admin Velocity Analytics."
    p_s1.font.name = FONT_SANS
    p_s1.font.size = Pt(8.2)
    p_s1.font.color.rgb = C_FOREST_MED
    p_s1.space_before = Pt(2)

    p_s2 = tf_stat.add_paragraph()
    p_s2.text = "⏳ PROPOSED FUTURE SCOPE: Dense Neural Transformer Embeddings (MiniLM) | Automated Edge IoT Ultrasonic Seat Sensors | Native Smartphone Camera Spine Recognition."
    p_s2.font.name = FONT_SANS
    p_s2.font.size = Pt(8.2)
    p_s2.font.color.rgb = C_TERRACOTTA
    p_s2.space_before = Pt(2)

    # =========================================================
    # SLIDE 13: Impact & Limitations
    # =========================================================
    s13 = prs.slides.add_slide(blank_layout)
    set_slide_background(s13, C_CREAM)
    add_header(s13, "EVALUATION & REALITY CHECK", "Project Impact & System Limitations",
               "Evaluating operational benefits against engineering constraints and deployment boundaries.")
    add_footer(s13, 13, 15)

    add_card(s13, 0.8, 1.9, 5.7, 4.9, bg_color=C_WHITE, border_color=C_FOREST_MED)
    tb_imp = s13.shapes.add_textbox(Inches(1.0), Inches(2.05), Inches(5.3), Inches(4.6))
    tf_imp = tb_imp.text_frame
    tf_imp.word_wrap = True

    ip0 = tf_imp.paragraphs[0]
    ip0.text = "EXPECTED OPERATIONAL BENEFITS"
    ip0.font.name = FONT_SANS
    ip0.font.size = Pt(9.5)
    ip0.font.bold = True
    ip0.font.color.rgb = C_FOREST_DARK

    impacts = [
        ("Faster Book Discovery", "Spatial coordinates eliminate random stack wandering, guiding patrons directly to specific Floor, Section, Shelf, and Rack units."),
        ("Elimination of Carrel Allocation Disputes", "Database-level atomic partial unique indexes serialize simultaneous reservations, ensuring zero double-bookings."),
        ("Improved Catalog Utilization", "TF-IDF conceptual matching connects patrons to relevant academic volumes even without exact title keyword recall."),
        ("Streamlined Circulation Desk Operations", "Barcode auto-matched patron details eliminate manual ledger entry and student ID typing errors."),
        ("Reduced Exam-Week Stress", "Guaranteed study carrel availability and clear shelf locations create a stress-free academic environment.")
    ]
    for i_title, i_desc in impacts:
        ip = tf_imp.add_paragraph()
        ip.text = f"✔ {i_title}: "
        ip.font.name = FONT_SANS
        ip.font.size = Pt(8.8)
        ip.font.bold = True
        ip.font.color.rgb = C_FOREST_MED
        ip.space_before = Pt(5)

        run = ip.add_run()
        run.text = i_desc
        run.font.bold = False
        run.font.color.rgb = C_TEXT_DARK

    add_card(s13, 6.8, 1.9, 5.7, 4.9, bg_color=C_WHITE, border_color=C_TERRACOTTA)
    tb_lim = s13.shapes.add_textbox(Inches(7.0), Inches(2.05), Inches(5.3), Inches(4.6))
    tf_lim = tb_lim.text_frame
    tf_lim.word_wrap = True

    lp0 = tf_lim.paragraphs[0]
    lp0.text = "SYSTEM LIMITATIONS & CONSTRAINTS"
    lp0.font.name = FONT_SANS
    lp0.font.size = Pt(9.5)
    lp0.font.bold = True
    lp0.font.color.rgb = C_TERRACOTTA

    limits = [
        ("Campus Network & Wi-Fi Reliance", "System requires active web browser connectivity inside physical stacks; offline sync requires progressive web app (PWA) caching."),
        ("Physical Stack Tagging Prerequisite", "Requires physical labelling of every shelf and rack with 4-tier codes before digital coordinates can function."),
        ("Dataset Vocabulary Boundaries", "TF-IDF vector matching is bounded by existing catalog vocabulary; out-of-vocabulary terms require synonym expansion."),
        ("Single-Server SQLite Architecture Scope", "SQLite with WAL mode easily handles single-campus traffic (<100k titles); multi-campus enterprise requires PostgreSQL clustering."),
        ("Hardware Cost for Physical Sensors", "Future automated seat sensors and camera barcode scanners require physical capital investment by the institution.")
    ]
    for l_title, l_desc in limits:
        lp = tf_lim.add_paragraph()
        lp.text = f"⚠ {l_title}: "
        lp.font.name = FONT_SANS
        lp.font.size = Pt(8.8)
        lp.font.bold = True
        lp.font.color.rgb = C_TERRACOTTA
        lp.space_before = Pt(5)

        run = lp.add_run()
        run.text = l_desc
        run.font.bold = False
        run.font.color.rgb = C_TEXT_DARK

    # =========================================================
    # SLIDE 14: Conclusion & Future Scope
    # =========================================================
    s14 = prs.slides.add_slide(blank_layout)
    set_slide_background(s14, C_CREAM)
    add_header(s14, "LOOKING FORWARD", "Conclusion & Future Research Scope",
               "Synthesizing the Design Thinking journey and establishing a technological roadmap for future iterations.")
    add_footer(s14, 14, 15)

    add_card(s14, 0.8, 1.85, 11.733, 1.35, bg_color=C_WHITE, border_color=C_BORDER)
    tb_c = s14.shapes.add_textbox(Inches(1.0), Inches(1.95), Inches(11.333), Inches(1.15))
    tf_c = tb_c.text_frame
    tf_c.word_wrap = True

    cp0 = tf_c.paragraphs[0]
    cp0.text = "DESIGN THINKING JOURNEY SUMMARY"
    cp0.font.name = FONT_SANS
    cp0.font.size = Pt(8.5)
    cp0.font.bold = True
    cp0.font.color.rgb = C_TERRACOTTA

    cp1 = tf_c.add_paragraph()
    cp1.text = "LibraMind successfully navigated all five stages of Human-Centered Design Thinking: from Empathizing with patrons wandering multi-floor stacks and Defining the core structural barriers, to Ideating multidisciplinary solutions across Python, AI, and Concurrency, Selecting the highest-impact interventions, and Prototyping an operational biophilic platform. The system fundamentally bridges the digital catalog and physical stack experience."
    cp1.font.name = FONT_SERIF
    cp1.font.size = Pt(9.8)
    cp1.font.color.rgb = C_FOREST_DARK
    cp1.space_before = Pt(2)

    future_cards = [
        ("1. Dense Neural Vector Search", "Python Sentence-Transformers",
         ["• Replace TF-IDF with HuggingFace MiniLM embeddings.",
          "• Enable true contextual comprehension of abstract research queries.",
          "• Dynamic semantic clustering of rare academic manuscripts."]),

        ("2. Predictive Circulation Analytics", "Machine Learning Demand Models",
         ["• Time-series forecasting (ARIMA / LSTM) for exam-week loan surges.",
          "• Dynamic seat demand prediction alerting students to optimal arrival times.",
          "• Automated acquisition recommendations for popular subject areas."]),

        ("3. Computer Vision Mobile Scanning", "OpenCV Spine Recognition",
         ["• Native smartphone camera barcode and spine reading.",
          "• Instant student self-checkout by scanning books directly at the shelf.",
          "• Automated optical audits detecting misplaced books across aisles."]),

        ("4. Edge IoT Sensor Integration", "Ultrasonic Desk Pod Hardware",
         ["• Micro-sensors embedded under study carrels to detect presence.",
          "• Automated seat release when vacated for more than 20 minutes.",
          "• Live physical LED status indicators (Green=Open, Amber=Hold, Red=Occupied)."])
    ]
    for i, (ftitle, ftech, fpoints) in enumerate(future_cards):
        fx = 0.8 + i * 2.98
        add_card(s14, fx, 3.35, 2.78, 3.45, bg_color=C_WHITE, border_color=C_BORDER)
        tb_f = s14.shapes.add_textbox(Inches(fx + 0.15), Inches(3.45), Inches(2.48), Inches(3.25))
        tf_f = tb_f.text_frame
        tf_f.word_wrap = True

        fp0 = tf_f.paragraphs[0]
        fp0.text = ftitle
        fp0.font.name = FONT_SERIF
        fp0.font.size = Pt(10.5)
        fp0.font.bold = True
        fp0.font.color.rgb = C_FOREST_DARK

        fp1 = tf_f.add_paragraph()
        fp1.text = ftech
        fp1.font.name = FONT_SANS
        fp1.font.size = Pt(8)
        fp1.font.bold = True
        fp1.font.color.rgb = C_TERRACOTTA
        fp1.space_before = Pt(2)

        for p_txt in fpoints:
            fpp = tf_f.add_paragraph()
            fpp.text = p_txt
            fpp.font.name = FONT_SANS
            fpp.font.size = Pt(8.2)
            fpp.font.color.rgb = C_TEXT_DARK
            fpp.space_before = Pt(4)

    # =========================================================
    # SLIDE 15: References & Q&A
    # =========================================================
    s15 = prs.slides.add_slide(blank_layout)
    set_slide_background(s15, C_CREAM)
    add_header(s15, "ACADEMIC CITATIONS & DISCUSSION", "References, Technologies & Defense Q&A",
               "Formal literature foundation, open-source technological framework, and viva defense discussion.")
    add_footer(s15, 15, 15)

    add_card(s15, 0.8, 1.9, 5.7, 3.2, bg_color=C_WHITE, border_color=C_BORDER)
    tb_ref = s15.shapes.add_textbox(Inches(1.0), Inches(2.05), Inches(5.3), Inches(2.9))
    tf_ref = tb_ref.text_frame
    tf_ref.word_wrap = True

    rp0 = tf_ref.paragraphs[0]
    rp0.text = "ACADEMIC & LITERATURE REFERENCES"
    rp0.font.name = FONT_SANS
    rp0.font.size = Pt(9)
    rp0.font.bold = True
    rp0.font.color.rgb = C_TERRACOTTA

    refs = [
        ("Brown, T. (2008).", "Design Thinking. Harvard Business Review, 86(6), 84–92."),
        ("Norman, D. (2013).", "The Design of Everyday Things. MIT Press / Basic Books."),
        ("Salton, G. & Buckley, C. (1988).", "Term-weighting approaches in automatic text retrieval. Information Processing & Management."),
        ("Hipp, D. R. et al. (2024).", "SQLite Database Engine: Write-Ahead Logging & Partial Unique Indexes."),
        ("Pedregosa, F. et al. (2011).", "Scikit-learn: Machine Learning in Python. Journal of Machine Learning Research.")
    ]
    for auth, cite in refs:
        rp = tf_ref.add_paragraph()
        rp.text = f"• {auth} "
        rp.font.name = FONT_SANS
        rp.font.size = Pt(8.2)
        rp.font.bold = True
        rp.font.color.rgb = C_FOREST_MED
        rp.space_before = Pt(3)

        run = rp.add_run()
        run.text = cite
        run.font.bold = False
        run.font.color.rgb = C_TEXT_DARK

    add_card(s15, 6.8, 1.9, 5.7, 3.2, bg_color=C_WHITE, border_color=C_BORDER)
    tb_tech = s15.shapes.add_textbox(Inches(7.0), Inches(2.05), Inches(5.3), Inches(2.9))
    tf_tech = tb_tech.text_frame
    tf_tech.word_wrap = True

    tp0 = tf_tech.paragraphs[0]
    tp0.text = "TECHNOLOGIES & FRAMEWORKS EMPLOYED"
    tp0.font.name = FONT_SANS
    tp0.font.size = Pt(9)
    tp0.font.bold = True
    tp0.font.color.rgb = C_TERRACOTTA

    techs = [
        ("Client Framework", "React 19, Vite 8, Lucide React, Biophilic CSS Design System"),
        ("Backend Services", "Node.js, Express 5 REST API, Better-SQLite3 Driver (WAL mode)"),
        ("Security & RBAC", "JWT Session Authentication, Bcryptjs Password Hashing, Route Guards"),
        ("Python AI & ML", "Python 3.13, Scikit-Learn TF-IDF, NumPy, Matplotlib Visual Engine"),
        ("Testing Suite", "Apache Bench Concurrency Tests, Postman API Collection, SUS Survey Plan")
    ]
    for t_cat, t_spec in techs:
        tp = tf_tech.add_paragraph()
        tp.text = f"• {t_cat}: "
        tp.font.name = FONT_SANS
        tp.font.size = Pt(8.2)
        tp.font.bold = True
        tp.font.color.rgb = C_FOREST_MED
        tp.space_before = Pt(3)

        run = tp.add_run()
        run.text = t_spec
        run.font.bold = False
        run.font.color.rgb = C_TEXT_DARK

    add_card(s15, 0.8, 5.25, 11.733, 1.65, bg_color=C_FOREST_DARK, border_color=C_GOLD)
    tb_ty = s15.shapes.add_textbox(Inches(1.0), Inches(5.35), Inches(11.333), Inches(1.45))
    tf_ty = tb_ty.text_frame
    tf_ty.word_wrap = True

    typ0 = tf_ty.paragraphs[0]
    typ0.text = "THANK YOU • QUESTIONS & ANSWERS"
    typ0.font.name = FONT_SANS
    typ0.font.size = Pt(13)
    typ0.font.bold = True
    typ0.font.color.rgb = C_GOLD

    typ1 = tf_ty.add_paragraph()
    typ1.text = "Thank you for reviewing the LibraMind Human-Centered Design Thinking project. The floor is now open for viva examination, faculty review, and live system demonstration."
    typ1.font.name = FONT_SERIF
    typ1.font.size = Pt(10)
    typ1.font.color.rgb = C_CREAM
    typ1.space_before = Pt(2)

    typ2 = tf_ty.add_paragraph()
    typ2.text = "Presenter: [Insert Student Name] • Project Repository: c:\\Users\\ADMIN\\Desktop\\smartlib • LibraMind Smart Library System"
    typ2.font.name = FONT_SANS
    typ2.font.size = Pt(8.5)
    typ2.font.color.rgb = C_SAGE_LIGHT
    typ2.space_before = Pt(4)

    out_paths = [
        'LibraMind_Design_Thinking_Presentation.pptx',
        'frontend/public/LibraMind_Design_Thinking_Presentation.pptx',
        'backend/uploads/LibraMind_Design_Thinking_Presentation.pptx'
    ]
    for path in out_paths:
        prs.save(path)
        print(f"Saved: {path}")

if __name__ == '__main__':
    create_presentation()
    print("All 15 slides generated successfully!")
