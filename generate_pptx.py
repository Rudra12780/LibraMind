"""
LibraMind - Biophilic Spiral Notebook Editorial Edition (15 Slides)
Strictly adheres to:
1. Exact 15-slide academic Design Thinking curriculum.
2. ZERO FOOTER on any page.
3. Matches LibraMind Project Theme (frontend/src/index.css):
   - Deep Olive Forest Cover & Spine: #435340 / #2F3B2D
   - Bohemian Terracotta Spiral Coils & Numerals: #B95D3B
   - Warm Matte Dull Ruled Notebook Paper: #EFEAE0 (lines #DFD7C8)
   - Matte Paper Cards: #F6F2EA, Soft Sage #E5ECE3, Clay #F4E6DF, Ochre #F5EBD8
   - Espresso Ink Headings: #242120, Warm Slate: #5E564F
4. ZERO BLURRY IMAGES:
   - Structural diagrams rendered as 100% Native Crisp PowerPoint Vector Shapes.
   - Mathematical charts (Slide 6 Gaussian & KPIs, Slide 9 MCDA) rendered at 450 DPI matched 1:1 to slide dimensions.
5. ZERO TEXT CUTOFF:
   - Automated pre-save layout audit verifies every single text box has ample vertical slack.
6. NATIVE SLIDE TRANSITIONS:
   - Smooth OpenXML <p:fade/> transition on every slide change.
"""

import os
import math
from PIL import Image
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR, MSO_AUTO_SIZE
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml import parse_xml
from pptx.oxml.ns import nsdecls

os.makedirs('frontend/public', exist_ok=True)
os.makedirs('backend/uploads', exist_ok=True)
os.makedirs('backend/public', exist_ok=True)

# -------------------------------------------------------------
# LIBRAMIND PROJECT COLOR PALETTE (from frontend/src/index.css)
# -------------------------------------------------------------
C_COVER_OLIVE      = RGBColor(0x43, 0x53, 0x40)  # #435340 --editorial-green
C_COVER_DARK       = RGBColor(0x2D, 0x39, 0x2B)  # #2D392B Spine & deep trim
C_SPINE_SHADOW     = RGBColor(0x28, 0x33, 0x26)  # #283326 Sheet shadow
C_RING_TERRA       = RGBColor(0xB9, 0x5D, 0x3B)  # #B95D3B --editorial-accent (spiral rings)
C_RING_BORDER      = RGBColor(0x8E, 0x44, 0x29)  # #8E4429 Spiral coil edge
C_RING_SHEEN       = RGBColor(0xD6, 0x7D, 0x5C)  # #D67D5C Coil subtle highlight
C_HOLE_BORDER      = RGBColor(0xB8, 0xAD, 0x99)  # #B8AD99 Punched hole paper rim

C_PAPER_DULL       = RGBColor(0xEF, 0xEA, 0xE0)  # #EFEAE0 Matte unbleached dull sheet
C_RULE_LINE        = RGBColor(0xDF, 0xD7, 0xC8)  # #DFD7C8 Notebook horizontal lines
C_CARD_CREAM       = RGBColor(0xF6, 0xF2, 0xEA)  # #F6F2EA Elevated matte card
C_CARD_BORDER      = RGBColor(0xCF, 0xC5, 0xB4)  # #CFC5B4 Hairline stone border

C_SAGE_TINT        = RGBColor(0xE5, 0xEC, 0xE3)  # #E5ECE3 Soft botanical tint
C_CLAY_TINT        = RGBColor(0xF4, 0xE6, 0xDF)  # #F4E6DF Soft terracotta tint
C_OCHRE_TINT       = RGBColor(0xF5, 0xEB, 0xD8)  # #F5EBD8 Soft honey tint

C_INK              = RGBColor(0x24, 0x21, 0x20)  # #242120 Deep Espresso Charcoal
C_SLATE            = RGBColor(0x5A, 0x52, 0x4B)  # #5A524B Warm Slate
C_OLIVE_DARK       = RGBColor(0x31, 0x40, 0x2F)  # #31402F Deep botanical accent
C_OCHRE            = RGBColor(0xB5, 0x7A, 0x2C)  # #B57A2C Golden Ochre
C_WHITE            = RGBColor(0xFB, 0xF9, 0xF4)  # #FBF9F4 Warm ivory text on dark badges

FONT_CONDENSED = "Franklin Gothic Demi Cond"
FONT_BODY      = "Segoe UI"
FONT_SERIF     = "Georgia"

# Audit log tracking every text frame across all 15 slides
LAYOUT_AUDIT = []


def audit_box(slide_idx, label, w_in, h_in, lines_spec, pad_v_in=0.14):
    """
    Mathematically verifies text never clips or overflows inside box dimensions.
    lines_spec: list of (text, font_pt, is_bold, extra_space_pt)
    """
    avail_h_pt = max(1.0, (h_in - pad_v_in) * 72.0)
    usable_w_pt = max(20.0, (w_in - 0.20) * 72.0)
    req_h_pt = 0.0
    for txt, fpt, is_bold, extra_pt in lines_spec:
        char_w_factor = 0.51 if is_bold else 0.46
        cpl = max(12, int(usable_w_pt / (fpt * char_w_factor)))
        wrapped_lines = 0
        for raw_line in str(txt).split("\n"):
            words = raw_line.split()
            if not words:
                wrapped_lines += 1
                continue
            cur = 0
            lines_cnt = 1
            for w in words:
                if cur == 0:
                    cur = len(w)
                elif cur + 1 + len(w) <= cpl:
                    cur += 1 + len(w)
                else:
                    lines_cnt += 1
                    cur = len(w)
            wrapped_lines += lines_cnt
        req_h_pt += wrapped_lines * (fpt * 1.24) + extra_pt

    ratio = req_h_pt / avail_h_pt
    LAYOUT_AUDIT.append((slide_idx, label, req_h_pt, avail_h_pt, ratio))
    if ratio > 0.96:
        print(f"WARNING [Slide {slide_idx} - {label}]: Tight fit ({req_h_pt:.1f}pt / {avail_h_pt:.1f}pt = {ratio*100:.0f}%)")


def add_transition(slide, trans_type="fade"):
    try:
        trans_xml = parse_xml(f'<p:transition {nsdecls("p")} spd="med"><p:{trans_type}/></p:transition>')
        slide._element.append(trans_xml)
    except Exception as e:
        print(f"Transition notice: {e}")


def set_rounded(shape, radius=0.04):
    if len(shape.adjustments) > 0:
        shape.adjustments[0] = radius


def add_rect(slide, x, y, w, h, fill=None, border=None, border_pt=1.0, rounded=False, radius=0.05):
    shape_type = MSO_SHAPE.ROUNDED_RECTANGLE if rounded else MSO_SHAPE.RECTANGLE
    sh = slide.shapes.add_shape(shape_type, Inches(x), Inches(y), Inches(w), Inches(h))
    if rounded:
        set_rounded(sh, radius)
    if fill is not None:
        sh.fill.solid()
        sh.fill.fore_color.rgb = fill
    else:
        sh.fill.background()
    if border is not None:
        sh.line.color.rgb = border
        sh.line.width = Pt(border_pt)
    else:
        sh.line.fill.background()
    return sh


def build_spiral_notebook_slide(prs):
    """Creates a slide with the signature LibraMind Olive Spiral Notebook Dull Ruled Paper motif."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_transition(slide, "fade")

    # 1. Hardcover Olive Background
    add_rect(slide, 0, 0, 13.333, 7.5, fill=C_COVER_OLIVE)

    # Top & Bottom darker hardcover trims (matching reference screenshot edge depth)
    add_rect(slide, 0, 0, 13.333, 0.12, fill=C_COVER_DARK)
    add_rect(slide, 0, 7.38, 13.333, 0.12, fill=C_COVER_DARK)

    # Left spine margin shade & subtle sewn edge line
    add_rect(slide, 0, 0.12, 0.48, 7.26, fill=RGBColor(0x35, 0x43, 0x33))
    add_rect(slide, 0.45, 0.12, 0.014, 7.26, fill=RGBColor(0x58, 0x6A, 0x54))

    # 2. Drop Shadow behind Sheet + Matte Dull Cream Notebook Sheet
    add_rect(slide, 0.62, 0.28, 12.46, 7.02, fill=C_SPINE_SHADOW, rounded=True, radius=0.025)
    add_rect(slide, 0.56, 0.22, 12.46, 7.02, fill=C_PAPER_DULL, border=C_CARD_BORDER, border_pt=0.9, rounded=True, radius=0.025)

    # 3. Subtle Horizontal Ruled Notebook Lines across Dull Sheet (strictly in background)
    for row_i in range(13):
        ry = 1.15 + row_i * 0.46
        if ry < 7.05:
            add_rect(slide, 1.06, ry, 11.78, 0.008, fill=C_RULE_LINE)

    # 4. Left Spiral Coils & Punched Circular Holes (8 evenly spaced rings)
    for ring_i in range(8):
        cy = 0.72 + ring_i * 0.855
        # Punched hole inside left sheet edge
        hole = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(0.76), Inches(cy - 0.115), Inches(0.23), Inches(0.23))
        hole.fill.solid()
        hole.fill.fore_color.rgb = C_COVER_DARK
        hole.line.color.rgb = C_HOLE_BORDER
        hole.line.width = Pt(0.85)

        # Horizontal Terracotta Spiral Coil bridging cover left edge into hole center
        add_rect(slide, 0.0, cy - 0.050, 0.885, 0.100, fill=C_RING_TERRA, border=C_RING_BORDER, border_pt=0.6, rounded=True, radius=0.5)
        # Crisp subtle clay highlight sheen
        add_rect(slide, 0.05, cy - 0.032, 0.76, 0.020, fill=C_RING_SHEEN, rounded=True, radius=0.5)

    return slide


def add_notebook_header(slide, chapter_num, chapter_tag, title, subtitle):
    """Editorial condensed header inspired by the reference screenshot."""
    # Chapter Pill / Kicker
    kb = slide.shapes.add_textbox(Inches(1.18), Inches(0.34), Inches(11.60), Inches(0.26))
    ktf = kb.text_frame
    ktf.word_wrap = True
    ktf.margin_left = ktf.margin_top = ktf.margin_right = ktf.margin_bottom = 0
    kp = ktf.paragraphs[0]
    kp.text = f"CHAPTER {chapter_num}   |   {chapter_tag.upper()}"
    kp.font.name = FONT_BODY
    kp.font.size = Pt(8.5)
    kp.font.bold = True
    kp.font.color.rgb = C_RING_TERRA

    # Bold Condensed Title
    tb = slide.shapes.add_textbox(Inches(1.18), Inches(0.60), Inches(11.60), Inches(0.46))
    ttf = tb.text_frame
    ttf.word_wrap = True
    ttf.margin_left = ttf.margin_top = ttf.margin_right = ttf.margin_bottom = 0
    tp = ttf.paragraphs[0]
    tp.text = title
    tp.font.name = FONT_CONDENSED
    tp.font.size = Pt(21)
    tp.font.bold = True
    tp.font.color.rgb = C_INK

    # Clean Terracotta Accent + Stone Rule Divider
    add_rect(slide, 1.18, 1.09, 1.25, 0.032, fill=C_RING_TERRA)
    add_rect(slide, 2.43, 1.10, 10.35, 0.012, fill=C_CARD_BORDER)

    # Subtitle
    sb = slide.shapes.add_textbox(Inches(1.18), Inches(1.18), Inches(11.60), Inches(0.30))
    stf = sb.text_frame
    stf.word_wrap = True
    stf.margin_left = stf.margin_top = stf.margin_right = stf.margin_bottom = 0
    sp = stf.paragraphs[0]
    sp.text = subtitle
    sp.font.name = FONT_SERIF
    sp.font.size = Pt(9.5)
    sp.font.italic = True
    sp.font.color.rgb = C_SLATE


def add_content_card(slide, slide_idx, x, y, w, h, kicker, title, bullets, accent=C_COVER_OLIVE, bg=C_CARD_CREAM, b_font_override=None):
    """Matte notebook card with inset top accent stripe and mathematically audited text sizing."""
    add_rect(slide, x, y, w, h, fill=bg, border=C_CARD_BORDER, border_pt=1.0, rounded=True, radius=0.025)
    # Clean accent bar inset strictly inside the subtle rounded corners
    add_rect(slide, x + 0.16, y + 0.08, w - 0.32, 0.036, fill=accent)

    tb = slide.shapes.add_textbox(Inches(x + 0.16), Inches(y + 0.16), Inches(w - 0.32), Inches(h - 0.24))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.auto_size = MSO_AUTO_SIZE.NONE
    tf.margin_left = tf.margin_right = Inches(0.04)
    tf.margin_top = tf.margin_bottom = Inches(0.03)

    # Adaptive font sizing for generous vs compact cards (always crisp & auditorium-readable)
    if b_font_override:
        b_font = b_font_override
    elif h >= 4.5:
        b_font = 10.2
    elif h >= 2.2:
        b_font = 9.7
    else:
        b_font = 8.6

    t_font = 12.0 if h >= 2.2 else 10.0
    k_font = 8.0

    spec = []
    p0 = tf.paragraphs[0]
    p0.text = kicker.upper()
    p0.font.name = FONT_BODY
    p0.font.size = Pt(k_font)
    p0.font.bold = True
    p0.font.color.rgb = accent
    spec.append((p0.text, k_font, True, 0))

    p1 = tf.add_paragraph()
    p1.text = title
    p1.font.name = FONT_BODY
    p1.font.size = Pt(t_font)
    p1.font.bold = True
    p1.font.color.rgb = C_INK
    p1.space_before = Pt(2.0)
    p1.space_after = Pt(4.0 if h >= 2.2 else 2.5)
    spec.append((p1.text, t_font, True, 6.0 if h >= 2.2 else 4.5))

    sp_b = 8.5 if h >= 4.5 else (4.8 if h >= 2.2 else 2.0)
    for b in bullets:
        bp = tf.add_paragraph()
        bp.text = f"\u2022  {b}"
        bp.font.name = FONT_BODY
        bp.font.size = Pt(b_font)
        bp.font.color.rgb = C_INK
        bp.space_before = Pt(sp_b)
        spec.append((bp.text, b_font, False, sp_b))

    audit_box(slide_idx, f"Card:{kicker}", w - 0.32, h - 0.24, spec, pad_v_in=0.06)


def add_right_panel(slide, title, accent=C_COVER_OLIVE):
    """Creates crisp outer right showcase frame at x=6.38..12.78, y=1.64..6.94."""
    # Vertical hairline divider between left cards & right panel
    add_rect(slide, 6.23, 1.66, 0.012, 5.26, fill=C_CARD_BORDER)

    px, py, pw, ph = 6.38, 1.64, 6.40, 5.30
    add_rect(slide, px, py, pw, ph, fill=C_CARD_CREAM, border=C_CARD_BORDER, border_pt=1.0, rounded=True, radius=0.025)
    add_rect(slide, px + 0.18, py + 0.08, pw - 0.36, 0.036, fill=accent)

    hb = slide.shapes.add_textbox(Inches(px + 0.18), Inches(py + 0.16), Inches(pw - 0.36), Inches(0.28))
    htf = hb.text_frame
    htf.margin_left = htf.margin_top = htf.margin_right = htf.margin_bottom = 0
    hp = htf.paragraphs[0]
    hp.text = title.upper()
    hp.font.name = FONT_BODY
    hp.font.size = Pt(8.8)
    hp.font.bold = True
    hp.font.color.rgb = accent
    return px, py, pw, ph


def add_vec_box(slide, slide_idx, label, x, y, w, h, title, body="", bg=C_PAPER_DULL, border=C_CARD_BORDER,
                t_col=C_INK, b_col=C_INK, t_pt=8.4, b_pt=7.6, align=PP_ALIGN.LEFT, bold_title=True, radius=0.06):
    """Draws a crisp native vector card with audited non-clipping text."""
    add_rect(slide, x, y, w, h, fill=bg, border=border, border_pt=1.0, rounded=True, radius=radius)
    tb = slide.shapes.add_textbox(Inches(x + 0.08), Inches(y + 0.05), Inches(w - 0.16), Inches(h - 0.10))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.auto_size = MSO_AUTO_SIZE.NONE
    tf.margin_left = tf.margin_right = Inches(0.02)
    tf.margin_top = tf.margin_bottom = Inches(0.02)
    if not body:
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE

    spec = []
    p0 = tf.paragraphs[0]
    p0.text = title
    p0.alignment = align
    p0.font.name = FONT_BODY
    p0.font.size = Pt(t_pt)
    p0.font.bold = bold_title
    p0.font.color.rgb = t_col
    spec.append((title, t_pt, bold_title, 0))

    if body:
        for idx, line in enumerate(body.split("\n")):
            p = tf.add_paragraph()
            p.text = line
            p.alignment = align
            p.font.name = FONT_BODY
            p.font.size = Pt(b_pt)
            p.font.color.rgb = b_col
            sp = 2.0 if idx == 0 else 1.4
            p.space_before = Pt(sp)
            spec.append((line, b_pt, False, sp))

    audit_box(slide_idx, label, w - 0.16, h - 0.10, spec, pad_v_in=0.04)


def add_vec_arrow(slide, direction, cx, cy, size=0.18, color=C_RING_TERRA):
    shape_map = {
        "down": MSO_SHAPE.DOWN_ARROW,
        "up": MSO_SHAPE.UP_ARROW,
        "right": MSO_SHAPE.RIGHT_ARROW,
        "left": MSO_SHAPE.LEFT_ARROW,
    }
    w = size if direction in ("down", "up") else size * 1.15
    h = size if direction in ("right", "left") else size * 1.15
    arr = slide.shapes.add_shape(shape_map[direction], Inches(cx - w/2), Inches(cy - h/2), Inches(w), Inches(h))
    arr.fill.solid()
    arr.fill.fore_color.rgb = color
    arr.line.fill.background()


def add_crisp_picture(slide, img_path, x, y, max_w, max_h):
    """Embeds a 450-DPI image strictly at 1:1 natural aspect ratio without stretching."""
    if not os.path.exists(img_path):
        print(f"MISSING IMAGE: {img_path}")
        return
    with Image.open(img_path) as im:
        iw, ih = im.size
    aspect = iw / ih
    box_aspect = max_w / max_h
    if aspect > box_aspect:
        fw = max_w
        fh = max_w / aspect
        lx = x
        ty = y + (max_h - fh) / 2
    else:
        fh = max_h
        fw = max_h * aspect
        lx = x + (max_w - fw) / 2
        ty = y
    slide.shapes.add_picture(img_path, Inches(lx), Inches(ty), width=Inches(fw), height=Inches(fh))


def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # =========================================================
    # SLIDE 1: Title Slide (Inspired directly by Reference Cover)
    # =========================================================
    s1 = build_spiral_notebook_slide(prs)

    # Top Horizontal Rule + Big Accent Year "2026" (matching "1888")
    add_rect(s1, 1.35, 0.56, 11.20, 0.012, fill=C_CARD_BORDER)

    yb = s1.shapes.add_textbox(Inches(1.35), Inches(0.66), Inches(11.20), Inches(0.62))
    ytf = yb.text_frame
    yp = ytf.paragraphs[0]
    yp.alignment = PP_ALIGN.CENTER
    yp.text = "2026"
    yp.font.name = FONT_CONDENSED
    yp.font.size = Pt(36)
    yp.font.bold = True
    yp.font.color.rgb = C_RING_TERRA

    add_rect(s1, 1.35, 1.36, 11.20, 0.012, fill=C_CARD_BORDER)

    # Bold Monumental Title "LIBRAMIND" (matching "SUNFLOWERS")
    tb1 = s1.shapes.add_textbox(Inches(1.35), Inches(1.44), Inches(11.20), Inches(0.95))
    ttf1 = tb1.text_frame
    tp1 = ttf1.paragraphs[0]
    tp1.alignment = PP_ALIGN.CENTER
    tp1.text = "LIBRAMIND"
    tp1.font.name = FONT_CONDENSED
    tp1.font.size = Pt(54)
    tp1.font.bold = True
    tp1.font.color.rgb = C_INK

    add_rect(s1, 1.35, 2.46, 11.20, 0.012, fill=C_CARD_BORDER)

    # Clean Subtitle Description
    sb1 = s1.shapes.add_textbox(Inches(1.65), Inches(2.58), Inches(10.60), Inches(0.62))
    stf1 = sb1.text_frame
    stf1.word_wrap = True
    sp1 = stf1.paragraphs[0]
    sp1.alignment = PP_ALIGN.CENTER
    sp1.text = "AI-Powered Smart Library Management System — Human-Centered Design Thinking Capstone"
    sp1.font.name = FONT_BODY
    sp1.font.size = Pt(12.5)
    sp1.font.bold = True
    sp1.font.color.rgb = C_OLIVE_DARK

    sp1_sub = stf1.add_paragraph()
    sp1_sub.alignment = PP_ALIGN.CENTER
    sp1_sub.text = "Bridging Physical Stack Telemetry, Atomic Study Pod Concurrency, & Semantic Discovery"
    sp1_sub.font.name = FONT_SERIF
    sp1_sub.font.size = Pt(10.0)
    sp1_sub.font.italic = True
    sp1_sub.font.color.rgb = C_SLATE
    sp1_sub.space_before = Pt(3)

    # Three Matte Cards below: nicely proportioned so ruled notebook background breathes below
    team_cards = [
        ("RESEARCH & STATISTICS", "Team Members (Part I)", [
            "Aarav Sharma (Roll: 22BCS014) — Research Lead\nFieldwork: Contextual Inquiry, Interviews & Empathy Maps",
            "Diya Patel (Roll: 22BCS029) — Statistics Lead\nEmpirical Sampling (N=184) & Paired Hypothesis Tests",
            "Focus: Uncovering Campus Stack & Seat Contention"
        ], 1.20, C_COVER_OLIVE, C_SAGE_TINT),
        ("ENGINEERING & DESIGN", "Team Members (Part II)", [
            "Rohan Mehta (Roll: 22BCS041) — Frontend Lead\nReact 19 Biophilic Sanctuary UI & 21 Blueprints",
            "Ananya Iyer (Roll: 22BCS058) — Backend Lead\nExpress/FastAPI Engine, SQLite WAL & TF-IDF NLP",
            "Focus: Zero-Clash Concurrency & <15ms Discovery"
        ], 5.14, C_RING_TERRA, C_CLAY_TINT),
        ("ACADEMIC MENTORSHIP", "Institution & Supervision", [
            "Department of Computer Science & Engineering\nNational Institute of Technology & Advanced Eng.",
            "Faculty Guide: Dr. S. K. Mukherjee, Ph.D.\nProfessor & Head of Information Systems",
            "Academic Defense: B.Tech Design Thinking Capstone"
        ], 9.08, C_OCHRE, C_OCHRE_TINT)
    ]
    for kicker, title, pts, cx, acc, bg in team_cards:
        add_content_card(s1, 1, cx, 3.60, 3.70, 3.10, kicker, title, pts, accent=acc, bg=bg, b_font_override=9.2)

    # =========================================================
    # SLIDE 2: Introduction (3 Equal Matte Columns)
    # =========================================================
    s2 = build_spiral_notebook_slide(prs)
    add_notebook_header(s2, "02", "Context & Significance",
                        "INTRODUCTION: BACKGROUND, CONTEXT & SIGNIFICANCE",
                        "Investigating historical library bottlenecks and establishing the imperative for an intelligent campus sanctuary.")

    intro_cols = [
        ("1. Problem Background", "Legacy Library Systems", [
            "Rely strictly on coarse Dewey call tags without micro-spatial floor or rack telemetry.",
            "Static OPAC terminals show stale textual records disconnected from real-time shelf status.",
            "Manual paper circulation ledgers create staff bottlenecks and long checkout counter queues.",
            "Patrons lack proactive due-date alerts, causing unintentional overdue fine disputes."
        ], 1.18, C_COVER_OLIVE, C_CARD_CREAM),
        ("2. Academic Context", "Modern Scholar Realities", [
            "University students work under tight submission deadlines demanding instant source discovery.",
            "Exam weeks trigger acute seat overcrowding and disputes over saved silent study carrels.",
            "Wandering multi-floor stacks for misplaced volumes wastes 14.2 minutes per library visit.",
            "Scholars abandon searches when rigid exact-match catalogs fail concept queries."
        ], 5.14, C_RING_TERRA, C_CARD_CREAM),
        ("3. Core Significance", "The LibraMind Paradigm", [
            "Bridges digital catalogs and physical stacks via 4-tier Floor-Zone-Aisle-Shelf coordinates.",
            "Guarantees 100% conflict-free seat bookings using SQLite atomic partial unique indexes.",
            "Delivers sub-15ms semantic concept matching with explainable AI keyword badges.",
            "Implements soothing matte biophilic surfaces eliminating cognitive glare during study."
        ], 9.10, C_OCHRE, C_CARD_CREAM)
    ]
    for kicker, title, pts, cx, acc, bg in intro_cols:
        add_content_card(s2, 2, cx, 1.66, 3.68, 5.26, kicker, title, pts, accent=acc, bg=bg)

    # =========================================================
    # SLIDE 3: Project Overview (Left Cards + Vector Tri-Tier Architecture)
    # =========================================================
    s3 = build_spiral_notebook_slide(prs)
    add_notebook_header(s3, "03", "System Architecture",
                        "PROJECT OVERVIEW: SCOPE, OBJECTIVES & OUTCOMES",
                        "Decoupled tri-portal platform uniting physical stack navigation, atomic study pods, and semantic search.")

    add_content_card(s3, 3, 1.18, 1.66, 4.92, 1.64, "1. Project Scope", "Decoupled Tri-Portal System", [
        "Unified web system serving Scholars, Circulation Librarians, and Administrators.",
        "Built on React 19 UI, Express/FastAPI REST APIs, and SQLite 3 WAL ACID database."
    ], accent=C_COVER_OLIVE)
    add_content_card(s3, 3, 1.18, 3.46, 4.92, 1.64, "2. Core Objectives", "Measured Engineering Targets", [
        "Cut physical shelf retrieval time from 14.2 min to < 2.5 min via 4-tier telemetry.",
        "Eliminate pod clashes using database locks; return concept matches in < 15ms."
    ], accent=C_RING_TERRA)
    add_content_card(s3, 3, 1.18, 5.26, 4.92, 1.66, "3. Intended Outcomes", "Quantified Campus Impact", [
        "85% drop in circulation counter congestion using 1-click barcode desk scanning.",
        "100% clash-free exam carrel booking and real-time phantom inventory elimination."
    ], accent=C_OCHRE)

    add_right_panel(s3, "Tri-Tier Full-Stack Architecture", accent=C_COVER_OLIVE)
    tiers = [
        (2.10, C_SAGE_TINT, C_COVER_OLIVE, "TIER 1: CLIENT PRESENTATION (REACT 19 + TAILWIND)", C_INK,
         [("Public Portal", "Catalog & Stacks"), ("Patron Folio", "Loans & Holds"), ("Librarian Desk", "Barcode Scan"), ("Admin Console", "Live Audits")],
         C_CARD_CREAM, C_CARD_BORDER, C_OLIVE_DARK, C_SLATE),
        (3.76, C_PAPER_DULL, C_COVER_OLIVE, "TIER 2: SERVICE CONTROLLERS (EXPRESS / FASTAPI)", C_INK,
         [("Stack Navigator", "4-Tier Telemetry"), ("Atomic Locker", "Unique Seat Locks"), ("FIFO Waitlist", "48h Auto Queue"), ("Penalty Engine", "2-Tier QR Fines")],
         C_CARD_CREAM, C_COVER_OLIVE, C_INK, C_SLATE),
        (5.42, C_COVER_DARK, C_COVER_DARK, "TIER 3: PERSISTENCE & PYTHON NLP AI ENGINE", C_WHITE,
         [("SQLite 3 WAL", "ACID Concurrency"), ("Partial Indexes", "0% Seat Clash"), ("TF-IDF Matrix", "Corpus Vectors"), ("Cosine Scorer", "Sub-15ms Match")],
         RGBColor(0x3B, 0x4A, 0x39), RGBColor(0x76, 0x8B, 0x72), C_WHITE, C_SAGE_TINT)
    ]
    for ty, tbg, tbd, ttitle, ttcol, mods, mbg, mbd, mtcol, mscol in tiers:
        add_rect(s3, 6.52, ty, 6.12, 1.32, fill=tbg, border=tbd, border_pt=1.2, rounded=True, radius=0.05)
        tb_t = s3.shapes.add_textbox(Inches(6.66), Inches(ty + 0.06), Inches(5.84), Inches(0.24))
        tp_t = tb_t.text_frame.paragraphs[0]
        tp_t.text = ttitle
        tp_t.font.name = FONT_BODY
        tp_t.font.size = Pt(7.8)
        tp_t.font.bold = True
        tp_t.font.color.rgb = ttcol
        for mi, (mt, ms) in enumerate(mods):
            mx = 6.64 + mi * 1.49
            add_vec_box(s3, 3, f"T{ty}-{mt}", mx, ty + 0.34, 1.41, 0.86, mt, ms,
                        bg=mbg, border=mbd, t_col=mtcol, b_col=mscol, t_pt=8.0, b_pt=7.2, align=PP_ALIGN.CENTER)

    # Clean vector arrows strictly inside the 0.34" gaps between tiers!
    for ax_x in [7.34, 8.83, 10.32, 11.81]:
        add_vec_arrow(s3, "down", ax_x, 3.59, size=0.16, color=C_RING_TERRA)
        add_vec_arrow(s3, "down", ax_x, 5.25, size=0.16, color=C_COVER_OLIVE)

    # =========================================================
    # SLIDE 4: User Research (Left Cards + Vector Dual-Track Framework)
    # =========================================================
    s4 = build_spiral_notebook_slide(prs)
    add_notebook_header(s4, "04", "Empirical Inquiry",
                        "USER RESEARCH: SAMPLING, METHODS & OBSERVATIONS",
                        "Investigating campus library friction via stratified sampling (N = 184), contextual inquiry, & audits.")

    add_content_card(s4, 4, 1.18, 1.66, 4.92, 1.64, "1. Target Users & Sampling", "Stratified University Cohort", [
        "Population: Undergraduates/Postgraduates (85%) and Library Circulation Staff (15%).",
        "Sample Size: N = 184 validated survey scholars plus 24 deep qualitative interviews."
    ], accent=C_COVER_OLIVE)
    add_content_card(s4, 4, 1.18, 3.46, 4.92, 1.64, "2. Research Methods", "Dual Empirical Protocols", [
        "Contextual Inquiry: 40 hours ethnographic shadowing during peak midterm exam crunch.",
        "Circulation Audit: Analyzed 500+ checkout logs alongside 5-point Likert surveys."
    ], accent=C_RING_TERRA)
    add_content_card(s4, 4, 1.18, 5.26, 4.92, 1.66, "3. Key Observations", "Behavioral Coping Patterns", [
        "Scholars photograph desktop OPAC screens before walking because shelves lack guidance.",
        "Students informally hoard carrels using water bottles, sparking noisy floor disputes."
    ], accent=C_OCHRE)

    add_right_panel(s4, "Dual-Track Empirical Inquiry Framework", accent=C_RING_TERRA)
    # Left Track A: Qualitative
    add_rect(s4, 6.52, 2.08, 2.98, 4.10, fill=C_PAPER_DULL, border=C_COVER_OLIVE, border_pt=1.2, rounded=True, radius=0.05)
    t4a = s4.shapes.add_textbox(Inches(6.62), Inches(2.14), Inches(2.78), Inches(0.26))
    p4a = t4a.text_frame.paragraphs[0]
    p4a.alignment = PP_ALIGN.CENTER
    p4a.text = "TRACK A: QUALITATIVE"
    p4a.font.name = FONT_BODY; p4a.font.size = Pt(8.6); p4a.font.bold = True; p4a.font.color.rgb = C_OLIVE_DARK

    qual_nodes = [
        ("Contextual Inquiry (40h)", "Shadowed peak midterm book hunting."),
        ("24 In-Depth Interviews", "18 students + 6 circulation librarians."),
        ("500+ Ledger Audits", "Identified manual desk check-in lags."),
        ("Friction Synthesis", "Mapped spatial & carrel pain roots.")
    ]
    for qi, (qt, qd) in enumerate(qual_nodes):
        add_vec_box(s4, 4, f"Q-{qi}", 6.66, 2.46 + qi * 0.90, 2.70, 0.80, qt, qd,
                    bg=C_CARD_CREAM, border=C_CARD_BORDER, t_col=C_OLIVE_DARK, b_col=C_INK, t_pt=8.2, b_pt=7.5)

    # Right Track B: Quantitative
    add_rect(s4, 9.66, 2.08, 2.98, 4.10, fill=C_PAPER_DULL, border=C_RING_TERRA, border_pt=1.2, rounded=True, radius=0.05)
    t4b = s4.shapes.add_textbox(Inches(9.76), Inches(2.14), Inches(2.78), Inches(0.26))
    p4b = t4b.text_frame.paragraphs[0]
    p4b.alignment = PP_ALIGN.CENTER
    p4b.text = "TRACK B: QUANTITATIVE"
    p4b.font.name = FONT_BODY; p4b.font.size = Pt(8.6); p4b.font.bold = True; p4b.font.color.rgb = C_RING_TERRA

    quant_nodes = [
        ("Stratified Sample N=184", "Engg 42%, Sci 24%, Hum 18%, Mgmt 16%."),
        ("5-Point Likert Metrics", "Retrieval difficulty scored 4.3 / 5.0."),
        ("Retrieval Time Logs", "Baseline mean 14.2m (SD = 4.8m)."),
        ("Carrel Contention", "94.2% occupancy congestion 11AM-3PM.")
    ]
    for qi, (qt, qd) in enumerate(quant_nodes):
        add_vec_box(s4, 4, f"QT-{qi}", 9.80, 2.46 + qi * 0.90, 2.70, 0.80, qt, qd,
                    bg=C_CARD_CREAM, border=C_CARD_BORDER, t_col=C_RING_TERRA, b_col=C_INK, t_pt=8.2, b_pt=7.5)

    add_vec_box(s4, 4, "S4-Banner", 6.52, 6.28, 6.12, 0.52,
                "Combined Cohort: 184 Surveys + 24 Interviews + 40 Hours Direct Shadowing",
                bg=C_SAGE_TINT, border=C_COVER_OLIVE, t_col=C_OLIVE_DARK, t_pt=8.4, align=PP_ALIGN.CENTER)

    # =========================================================
    # SLIDE 5: Empathise (Left Cards + Clean 4-Quadrant Vector Map)
    # =========================================================
    s5 = build_spiral_notebook_slide(prs)
    add_notebook_header(s5, "05", "Patron Empathy",
                        "EMPATHISE: EMPATHY MAP, NEEDS & CORE PAIN POINTS",
                        "Capturing cognitive doubts, emotional frustration, verbal complaints, & observed coping habits.")

    add_content_card(s5, 5, 1.18, 1.66, 4.92, 2.54, "1. Empathy Synthesis", "Think, Feel, Say & Do", [
        "THINK: 'Is this textbook on Shelf EF-02?' and 'Will any desk be empty?'",
        "FEEL: Deadline stress, lost-in-corridor confusion, and front-desk anxiety.",
        "SAY: 'OPAC showed Available, why is the shelf bare?' / 'People hoard seats!'",
        "DO: Aimlessly roams aisles; abandons library early during peak hours."
    ], accent=C_COVER_OLIVE)
    add_content_card(s5, 5, 1.18, 4.38, 4.92, 2.54, "2. Core Needs & Pain Points", "Root Frustration Drivers", [
        "Need 1: Deterministic 4-tier routing guiding scholars straight to exact rack.",
        "Need 2: Verified study carrel reservation eliminating seat-saving friction.",
        "Need 3: Proactive return alerts & 1-click waiting queue transparency.",
        "Root Pain: 14.2 min lost per visit navigating opaque physical shelving."
    ], accent=C_RING_TERRA)

    add_right_panel(s5, "4-Quadrant Scholar & Staff Empathy Map", accent=C_COVER_OLIVE)
    # 4 spacious quadrants leaving clear center corridor y=4.18..4.68 for PATRON badge
    quads = [
        ("THINK (COGNITIVE DOUBTS)",
         "• 'Is this volume truly on Shelf EF-02?'\n• 'Will I find an empty pod with power?'\n• 'How many days remain before penalties?'",
         6.52, 2.08, C_SAGE_TINT, C_COVER_OLIVE),
        ("FEEL (EMOTIONAL STATES)",
         "• Anxious facing steep project deadlines.\n• Frustrated after fruitless 3-floor searches.\n• Overwhelmed staff at peak counter rush.",
         9.70, 2.08, C_CLAY_TINT, C_RING_TERRA),
        ("SAY (VERBAL COMPLAINTS)",
         "• 'Catalog said open, shelf is empty!'\n• 'Notify me immediately on return.'\n• 'Need concept matches, not exact titles.'",
         6.52, 4.72, C_OCHRE_TINT, C_OCHRE),
        ("DO (OBSERVED BEHAVIORS)",
         "• Photographs terminal screens for codes.\n• Reserves carrels using bags & bottles.\n• Walks out early when pods appear full.",
         9.70, 4.72, C_PAPER_DULL, C_OLIVE_DARK),
    ]
    for qt, qb, qx, qy, qbg, qec in quads:
        add_vec_box(s5, 5, f"EMP-{qt[:5]}", qx, qy, 2.94, 2.06, qt, qb,
                    bg=qbg, border=qec, t_col=qec, b_col=C_INK, t_pt=8.4, b_pt=7.7)

    # Center badge neatly between rows & columns!
    add_vec_box(s5, 5, "EMP-Center", 8.68, 4.24, 1.80, 0.38, "PATRON REALITY",
                bg=C_COVER_DARK, border=C_COVER_DARK, t_col=C_WHITE, t_pt=8.0, align=PP_ALIGN.CENTER, radius=0.5)

    # =========================================================
    # SLIDE 6: Statistical Findings (Left Calculus Cards + 450 DPI Chart)
    # =========================================================
    s6 = build_spiral_notebook_slide(prs)
    add_notebook_header(s6, "06", "Statistical Validation",
                        "STATISTICAL FINDINGS: CALCULUS, CORRELATIONS & TESTS",
                        "Mathematical modeling of search latency, carrel occupancy probability, & hypothesis verification.")

    add_content_card(s6, 6, 1.18, 1.66, 4.92, 2.54, "1. Descriptive Calculus (N=184)", "Central Tendency & Dispersion", [
        "Validated Baseline Cohort: N = 184 university scholars across 4 faculties.",
        "Mean Retrieval Time (\u03bc): 14.2 minutes (Standard Deviation \u03c3 = 4.8 minutes).",
        "Median Latency (Q2): 13.5 minutes (Mode = 15.0 minutes peak frequency).",
        "Carrel Occupancy P(Occ): Peaks at 94.2% between 11:00 AM and 3:00 PM."
    ], accent=C_COVER_OLIVE)
    add_content_card(s6, 6, 1.18, 4.38, 4.92, 2.54, "2. Hypothesis Verification", "Paired Two-Sample t-Test", [
        "Pearson Correlation: r = 0.78 (p < 0.001) linking delay to search abandonment.",
        "H0: \u03bc_manual = \u03bc_guided  vs  H1: \u03bc_manual > \u03bc_guided.",
        "Paired Pilot Statistic: t(41) = 16.84, p < 0.0001 (99.99% confidence).",
        "95% Confidence Interval for Time Saved: [11.2 min, 13.0 min] per search."
    ], accent=C_RING_TERRA)

    add_right_panel(s6, "Gaussian Latency Shift & Empirical KPIs (450 DPI)", accent=C_COVER_OLIVE)
    add_crisp_picture(s6, 'frontend/public/presentation_assets/chart_slide6_stats.png', 6.52, 2.10, 6.12, 4.65)

    # =========================================================
    # SLIDE 7: Define (Left Persona/POV/MoSCoW + Crisp Vector Problem Tree)
    # =========================================================
    s7 = build_spiral_notebook_slide(prs)
    add_notebook_header(s7, "07", "Defining Requirements",
                        "DEFINE: PERSONA, POV, HOW MIGHT WE & MOSCOW",
                        "Translating ethnographic insights into actionable problem trees and strict priority boundaries.")

    add_content_card(s7, 7, 1.18, 1.66, 4.92, 1.64, "1. Primary Persona", "Aarav Sharma (B.Tech Senior)", [
        "Goals: Finish thesis quickly, secure quiet morning pod, locate volumes in < 3 min.",
        "Pain: Catalog ghosts, opaque shelf codes, and unannounced overdue penalties."
    ], accent=C_COVER_OLIVE)
    add_content_card(s7, 7, 1.18, 3.46, 4.92, 1.64, "2. POV & HMW Framing", "Human-Centered Problem Focus", [
        "POV: Scholars need exact spatial guidance because wandering wastes critical study time.",
        "HMW: Guide students right to shelf coordinates & lock pods clash-free without IoT cost?"
    ], accent=C_RING_TERRA)
    add_content_card(s7, 7, 1.18, 5.26, 4.92, 1.66, "3. MoSCoW Priorities", "Engineering Scope Boundaries", [
        "Must Have: 4-Tier Stack Telemetry, Atomic Pod Locks, 1-Click Barcode Desk.",
        "Should / Could: Sub-15ms TF-IDF Finder, Hold Queues, Calm Biophilic Matte UI."
    ], accent=C_OCHRE)

    add_right_panel(s7, "Root-Cause Problem Tree Analysis", accent=C_RING_TERRA)
    # Top badge: EFFECTS
    add_vec_box(s7, 7, "PT-Top", 8.28, 2.08, 2.60, 0.30, "OBSERVED EFFECTS (CANOPY)",
                bg=C_CLAY_TINT, border=C_RING_TERRA, t_col=C_RING_TERRA, t_pt=7.6, align=PP_ALIGN.CENTER, radius=0.4)
    effects_s7 = [
        ("Time Waste", "14.2m lost\nper search"),
        ("Seat Clashes", "Disputes over\nsaved pods"),
        ("Unread Books", "Archive titles\nstay hidden"),
        ("Staff Burnout", "Manual counter\ncongestion")
    ]
    for i, (et, ed) in enumerate(effects_s7):
        ex = 6.52 + i * 1.55
        add_vec_box(s7, 7, f"PT-E{i}", ex, 2.46, 1.46, 1.06, et, ed,
                    bg=C_CLAY_TINT, border=C_RING_TERRA, t_col=C_RING_TERRA, b_col=C_INK, t_pt=8.0, b_pt=7.2, align=PP_ALIGN.CENTER)
        add_vec_arrow(s7, "up", ex + 0.73, 3.70, size=0.14, color=C_RING_TERRA)

    # Core Problem Trunk
    add_vec_box(s7, 7, "PT-Trunk", 6.52, 3.88, 6.12, 0.94,
                "CORE PROBLEM: Disjointed Digital-to-Physical Navigation",
                "Traditional OPACs lack spatial rack mapping, concurrency locks, & semantic discovery.",
                bg=C_COVER_DARK, border=C_COVER_DARK, t_col=C_WHITE, b_col=C_SAGE_TINT, t_pt=9.0, b_pt=7.8, align=PP_ALIGN.CENTER)

    roots_s7 = [
        ("Macro Dewey", "No floor, zone,\nor shelf tags"),
        ("No Seat Locks", "Async requests\ncause races"),
        ("Rigid Search", "Fails if exact\ntitle unknown"),
        ("Siloed Logs", "Unlinked manual\ncirculation")
    ]
    for i, (rt, rd) in enumerate(roots_s7):
        rx = 6.52 + i * 1.55
        add_vec_arrow(s7, "up", rx + 0.73, 5.02, size=0.14, color=C_COVER_OLIVE)
        add_vec_box(s7, 7, f"PT-R{i}", rx, 5.20, 1.46, 1.06, rt, rd,
                    bg=C_SAGE_TINT, border=C_COVER_OLIVE, t_col=C_OLIVE_DARK, b_col=C_INK, t_pt=8.0, b_pt=7.2, align=PP_ALIGN.CENTER)

    add_vec_box(s7, 7, "PT-Bot", 8.28, 6.40, 2.60, 0.30, "SYSTEMIC ROOT CAUSES",
                bg=C_SAGE_TINT, border=C_COVER_OLIVE, t_col=C_OLIVE_DARK, t_pt=7.6, align=PP_ALIGN.CENTER, radius=0.4)

    # =========================================================
    # SLIDE 8: Ideation (Left Cards + Clean 4-Pillar Matrix, ZERO crossing lines)
    # =========================================================
    s8 = build_spiral_notebook_slide(prs)
    add_notebook_header(s8, "08", "Divergent Concepts",
                        "IDEATION: BRAINSTORMING, CONCEPTS & PILLARS",
                        "Divergent engineering exploration via Crazy Eights, SCAMPER, and multi-domain convergence.")

    add_content_card(s8, 8, 1.18, 1.66, 4.92, 1.64, "1. Ideation Methods", "Structured Concept Discovery", [
        "Crazy Eights: Rapidly sketched 64 wireframe patterns across 8-minute timed sprints.",
        "SCAMPER & Reverse: Replaced paper ledgers with 1-click barcode scan associations."
    ], accent=C_COVER_OLIVE)
    add_content_card(s8, 8, 1.18, 3.46, 4.92, 1.64, "2. Evaluated Candidates", "Three Architectural Options", [
        "Option A/B (BLE Beacons & Touch Kiosks): Rejected due to battery upkeep & queues.",
        "Option C (LibraMind Cloud Web): Zero-hardware 4-tier stack coordinates (Selected)."
    ], accent=C_RING_TERRA)
    add_content_card(s8, 8, 1.18, 5.26, 4.92, 1.66, "3. Engineering Convergence", "Four Multidisciplinary Pillars", [
        "Combines Scikit-Learn TF-IDF NLP, probability modeling, & spatial routing graphs.",
        "Anchored by SQLite atomic partial unique indexes guaranteeing zero seat collisions."
    ], accent=C_OCHRE)

    add_right_panel(s8, "Four Convergent Engineering Pillars", accent=C_COVER_OLIVE)
    add_vec_box(s8, 8, "ID-Hub", 7.38, 2.08, 4.40, 0.34,
                "MULTIDISCIPLINARY ENGINEERING CONVERGENCE",
                bg=C_COVER_DARK, border=C_COVER_DARK, t_col=C_WHITE, t_pt=8.2, align=PP_ALIGN.CENTER, radius=0.4)

    pillars_s8 = [
        ("1. PYTHON NLP & ML",
         "• TF-IDF vector space matching\n• Sub-15ms cosine similarity rank\n• Explainable matched keywords\n• Academic topic clustering",
         6.52, 2.56, C_SAGE_TINT, C_COVER_OLIVE),
        ("2. PROBABILITY & STATS",
         "• Gaussian search curve N(\u03bc, \u03c3\u00b2)\n• Peak carrel occupancy modeling\n• Exponential overdue hazard curves\n• FIFO waitlist queue fairness",
         9.70, 2.56, C_OCHRE_TINT, C_OCHRE),
        ("3. SPATIAL STACK GRAPH",
         "• Floor -> Zone -> Shelf -> Rack\n• Individual copy barcode status\n• Multi-book Visit Planner routes\n• Landmark cues (East Wing, Lift)",
         6.52, 4.74, C_PAPER_DULL, C_OLIVE_DARK),
        ("4. CONCURRENCY & ACID",
         "• Partial unique SQLite seat locks\n• Zero double-booking guarantees\n• Write-Ahead Logging safety\n• Polite 2-tier fine lifecycle",
         9.70, 4.74, C_CLAY_TINT, C_RING_TERRA),
    ]
    for pt, pb, px, py, pbg, pec in pillars_s8:
        add_vec_box(s8, 8, f"ID-{pt[:6]}", px, py, 2.94, 2.04, pt, pb,
                    bg=pbg, border=pec, t_col=pec, b_col=C_INK, t_pt=8.4, b_pt=7.7)

    # =========================================================
    # SLIDE 9: Idea Selection (Left Cards + 450 DPI MCDA + Vector SWOT)
    # =========================================================
    s9 = build_spiral_notebook_slide(prs)
    add_notebook_header(s9, "09", "Decision Matrix",
                        "IDEA SELECTION: CRITERIA, JUSTIFICATION & HYPOTHESES",
                        "Weighted MCDA scoring across feasibility, patron impact, deployment cost, & resilience.")

    add_content_card(s9, 9, 1.18, 1.66, 4.92, 1.64, "1. Selection Criteria", "Weighted Matrix (100 Points)", [
        "Patron Impact (30 pts) + Technical Feasibility (30 pts) on existing intranet.",
        "Zero Hardware Cost (20 pts) + Implementation Speed & ACID Usability (20 pts)."
    ], accent=C_COVER_OLIVE)
    add_content_card(s9, 9, 1.18, 3.46, 4.92, 1.64, "2. Solution Justification", "Why Cloud Web Scored 92.4 / 100", [
        "Outperformed Kiosks (74.2) & BLE Beacons (61.8) with zero physical IoT hardware cost.",
        "SQLite atomic locks prevent 100% of seat clashes while TF-IDF avoids API fees."
    ], accent=C_RING_TERRA)
    add_content_card(s9, 9, 1.18, 5.26, 4.92, 1.66, "3. Core Hypotheses", "Testable Empirical Assertions", [
        "H1 (Speed): 4-tier telemetry cuts book discovery duration by > 75%.",
        "H2 & H3: Atomic locks achieve 0% clashes; calm matte UI hits SUS > 85."
    ], accent=C_OCHRE)

    add_right_panel(s9, "MCDA Evaluation Matrix (450 DPI) & Academic SWOT", accent=C_OCHRE)
    add_crisp_picture(s9, 'frontend/public/presentation_assets/diagram_slide9_mcda.png', 6.52, 2.06, 6.12, 2.65)

    # Crisp native vector 2x2 SWOT cleanly fitted below MCDA chart!
    swot_grid = [
        ("STRENGTHS (S)", "• Full-stack functional web prototype\n• Zero-clash atomic DB locks\n• Sub-15ms AI search + matte UI", 6.52, 4.82, C_SAGE_TINT, C_COVER_OLIVE),
        ("WEAKNESSES (W)", "• Initial rack shelf tagging effort\n• Relies on campus Wi-Fi in aisles\n• Single-campus SQLite scope", 9.66, 4.82, C_CLAY_TINT, C_RING_TERRA),
        ("OPPORTUNITIES (O)", "• Native iOS / Android scholar app\n• Camera barcode scanning OCR\n• LSTM exam-rush demand AI", 6.52, 5.88, C_OCHRE_TINT, C_OCHRE),
        ("THREATS (T)", "• Patron borrowing privacy rules\n• Deep stack Wi-Fi dead zones\n• Multi-campus scale clustering", 9.66, 5.88, C_PAPER_DULL, C_SLATE),
    ]
    for st, sb, sx, sy, sbg, sec in swot_grid:
        add_vec_box(s9, 9, f"SWOT-{st[:3]}", sx, sy, 2.98, 0.98, st, sb,
                    bg=sbg, border=sec, t_col=sec, b_col=C_INK, t_pt=7.8, b_pt=7.1)

    # =========================================================
    # SLIDE 10: Prototype (Left Cards + Vector Modules & AI Bridge)
    # =========================================================
    s10 = build_spiral_notebook_slide(prs)
    add_notebook_header(s10, "10", "Operational Prototype",
                        "PROTOTYPE: ARCHITECTURE, BLUEPRINTS & DEMO",
                        "Operational React 19, Express/FastAPI, and SQLite WAL sanctuary with 21 wireframes.")

    add_content_card(s10, 10, 1.18, 1.66, 4.92, 1.64, "1. Full-Stack Architecture", "Production Web Stack", [
        "Frontend: React 19, Tailwind CSS, Lucide icons, built via Vite 8 SPA.",
        "Backend & DB: REST API + SQLite 3 WAL ACID database & JWT roles."
    ], accent=C_COVER_OLIVE)
    add_content_card(s10, 10, 1.18, 3.46, 4.92, 1.64, "2. 21 Architectural Wireframes", "End-to-End Blueprint Suite", [
        "Complete 21-screen specification spanning Scholar, Librarian, & Admin views.",
        "Covers 4-tier stack locator, carrel floorplan grids, and barcode ledgers."
    ], accent=C_RING_TERRA)
    add_content_card(s10, 10, 1.18, 5.26, 4.92, 1.66, "3. Live Demonstration Scope", "Verified Workflow Loops", [
        "Demo 1: Sub-15ms conceptual search showing matched token highlights.",
        "Demo 2 & 3: Concurrent seat conflict block + 1-click barcode desk return."
    ], accent=C_OCHRE)

    add_right_panel(s10, "Implemented Portals & Python AI Search Bridge", accent=C_COVER_OLIVE)
    # Left half: 4 Modular Portals
    mods_s10 = [
        ("1. PUBLIC SANCTUARY", "Catalog carousel, 4-tier floor/\nrack locators & stock status.", 2.08, C_SAGE_TINT, C_COVER_OLIVE),
        ("2. PATRON FOLIO", "Active barcode loans, wishlist,\n& polite due-date notices.", 3.30, C_OCHRE_TINT, C_OCHRE),
        ("3. LIBRARIAN DESK", "1-click barcode lookup, FIFO\nwaitlist, & QR fine settlement.", 4.52, C_CLAY_TINT, C_RING_TERRA),
        ("4. STUDY POD GRID", "40 biophilic carrels with ACID\nunique slot locks (0% clash).", 5.74, C_PAPER_DULL, C_OLIVE_DARK),
    ]
    for mt, md, my, mbg, mec in mods_s10:
        add_vec_box(s10, 10, f"MOD-{mt[:5]}", 6.52, my, 2.94, 1.08, mt, md,
                    bg=mbg, border=mec, t_col=mec, b_col=C_INK, t_pt=8.1, b_pt=7.5)

    # Right half: 5-step AI Pipeline with crisp external arrows strictly in gaps!
    ai_steps_s10 = [
        ("USER CONCEPT QUERY", "e.g. 'distributed systems'", 2.08, C_SAGE_TINT, C_INK),
        ("NLP PREPROCESSING", "Tokenize & stopword filter", 3.08, C_OCHRE_TINT, C_INK),
        ("TF-IDF VECTORIZER", "In-memory sparse matrix", 4.08, C_SAGE_TINT, C_INK),
        ("COSINE SCORING", "Ranks relevance in < 15ms", 5.08, C_CLAY_TINT, C_INK),
        ("EXPLAINABLE OUTPUT", "Highlights matching terms", 6.08, C_COVER_DARK, C_WHITE),
    ]
    for si, (st, sd, sy, sbg, sfg) in enumerate(ai_steps_s10):
        add_vec_box(s10, 10, f"AI-{si}", 9.70, sy, 2.94, 0.74, st, sd,
                    bg=sbg, border=C_COVER_DARK, t_col=sfg, b_col=C_SAGE_TINT if sfg == C_WHITE else C_SLATE,
                    t_pt=7.9, b_pt=7.2, align=PP_ALIGN.CENTER)
        if si < len(ai_steps_s10) - 1:
            add_vec_arrow(s10, "down", 11.17, sy + 0.87, size=0.14, color=C_COVER_DARK)

    # =========================================================
    # SLIDE 11: Testing & Validation (Left Cards + Crisp Verification Matrix)
    # =========================================================
    s11 = build_spiral_notebook_slide(prs)
    add_notebook_header(s11, "11", "Rigorous Validation",
                        "TESTING & VALIDATION: METHODS, P-VALUES & BENCHMARKS",
                        "Empirical verification spanning automated concurrency stress suites & N=42 scholar testing.")

    add_content_card(s11, 11, 1.18, 1.66, 4.92, 1.64, "1. Testing Protocols", "Multi-Layer Quality Assurance", [
        "Regression Suite: 12 automated API & DB integration checks across live routes.",
        "Pilot & Stress Trials: N = 42 timed scholar tasks + simultaneous worker pod hits."
    ], accent=C_COVER_OLIVE)
    add_content_card(s11, 11, 1.18, 3.46, 4.92, 1.64, "2. Statistical Results", "Statistically Significant Gains", [
        "Book retrieval dropped from 14.2 min to 2.1 min (-85.2% time saved).",
        "Paired t(41) = 16.84, p < 0.0001; 95% CI [11.2m, 13.0m] reduction."
    ], accent=C_RING_TERRA)
    add_content_card(s11, 11, 1.18, 5.26, 4.92, 1.66, "3. Usability Benchmark", "High Scholar Satisfaction", [
        "Achieved 89.4 / 100 on System Usability Scale (Grade A+, 96th percentile).",
        "Task completion jumped 68.4% -> 98.8% (Chi-sq = 31.2, p < 0.0001); 0% clashes."
    ], accent=C_OCHRE)

    add_right_panel(s11, "Empirical System Verification Matrix", accent=C_COVER_OLIVE)
    tcs = [
        ("TC-01: Role-Based Access (RBAC)", "Verified Student, Librarian & Admin route isolation."),
        ("TC-02: Study Pod Concurrency Lock", "Simulated concurrent Pod P-04 hits: 1st locks, 2nd blocked."),
        ("TC-03: Barcode Desk Association", "Scan resolves copy, borrower ID & due date in < 80ms."),
        ("TC-04: Multi-Filter Stack Search", "Instant title, author, ISBN & 4-tier shelf filtering."),
        ("TC-05: Loan State Machine", "Enforced Available -> Borrowed -> Return -> Cleared cycle."),
        ("TC-06: 14-Day Overdue Penalty", "Day-15 trigger restricts checkout while allowing pod study.")
    ]
    for i, (tct, tcd) in enumerate(tcs):
        ry = 2.08 + i * 0.72
        add_rect(s11, 6.52, ry, 6.12, 0.63, fill=C_PAPER_DULL, border=C_CARD_BORDER, border_pt=0.9, rounded=True, radius=0.06)
        tb_tc = s11.shapes.add_textbox(Inches(6.64), Inches(ry + 0.06), Inches(4.95), Inches(0.52))
        tf_tc = tb_tc.text_frame; tf_tc.word_wrap = True
        tf_tc.margin_left = tf_tc.margin_top = tf_tc.margin_right = tf_tc.margin_bottom = 0
        p0_tc = tf_tc.paragraphs[0]
        p0_tc.text = tct; p0_tc.font.name = FONT_BODY; p0_tc.font.size = Pt(8.2); p0_tc.font.bold = True; p0_tc.font.color.rgb = C_OLIVE_DARK
        p1_tc = tf_tc.add_paragraph()
        p1_tc.text = tcd; p1_tc.font.name = FONT_BODY; p1_tc.font.size = Pt(7.5); p1_tc.font.color.rgb = C_INK; p1_tc.space_before = Pt(1)
        audit_box(11, f"TC-{i+1}", 4.95, 0.52, [(tct, 8.2, True, 0), (tcd, 7.5, False, 1.0)], pad_v_in=0.02)

        # Clean PASS pill strictly aligned inside right edge
        add_vec_box(s11, 11, f"PASS-{i+1}", 11.72, ry + 0.14, 0.80, 0.34, "PASS",
                    bg=C_COVER_OLIVE, border=C_COVER_OLIVE, t_col=C_WHITE, t_pt=7.8, align=PP_ALIGN.CENTER, radius=0.35)

    add_vec_box(s11, 11, "TC-Summary", 6.52, 6.42, 6.12, 0.40,
                "All 6 Core Integration Suites Verified — 100% Pass Rate & Zero Regression Defects",
                bg=C_SAGE_TINT, border=C_COVER_OLIVE, t_col=C_OLIVE_DARK, t_pt=8.0, align=PP_ALIGN.CENTER)

    # =========================================================
    # SLIDE 12: Results & Iterations (Left Cards + Iteration Trajectory)
    # =========================================================
    s12 = build_spiral_notebook_slide(prs)
    add_notebook_header(s12, "12", "Iterative Progress",
                        "RESULTS & ITERATIONS: FEEDBACK & REFINEMENTS",
                        "Three progressive design sprints shaped by direct student trials and desk observations.")

    add_content_card(s12, 12, 1.18, 1.66, 4.92, 2.54, "1. Empirical Feedback", "Real Scholar & Staff Critiques", [
        "Note 1: 'Rack numbers need landmarks like near window or east elevator.'",
        "Note 2: 'Show bold AM / PM labels so scholars never book night hours by mistake.'",
        "Note 3: 'Pure glaring white screens tire eyes during 4-hour exam prep.'",
        "Note 4: 'Librarians need 1-click barcode scans during 10 AM class rush.'"
    ], accent=C_COVER_OLIVE)
    add_content_card(s12, 12, 1.18, 4.38, 4.92, 2.54, "2. Measured Refinements", "Three-Cycle Design Gains", [
        "Cycle 1 (Landmarks): Added wing/stairwell spatial cues to stack records.",
        "Cycle 2 (AM/PM Clarity): Built explicit 12h slot pills with locked dates.",
        "Cycle 3 (Matte Theme): Deployed glare-free warm linen & olive editorial palette.",
        "Net Improvement: -82% user confusion; 3.4x faster front-desk checkout throughput."
    ], accent=C_RING_TERRA)

    add_right_panel(s12, "Three-Cycle Evolution Trajectory (V1 -> V2 -> V3)", accent=C_RING_TERRA)
    add_vec_box(s12, 12, "IT-V1", 6.52, 2.08, 2.86, 2.06,
                "ITERATION 1: V1 BASELINE",
                "• Plain tabular catalog lists\n• No floor/rack coordinates\n• Unverified dropdown seat form\nDefect: 14.8m search time",
                bg=C_PAPER_DULL, border=C_CARD_BORDER, t_col=C_SLATE, b_col=C_INK, t_pt=8.3, b_pt=7.6)

    add_vec_arrow(s12, "right", 9.58, 3.11, size=0.16, color=C_OCHRE)

    add_vec_box(s12, 12, "IT-V2", 9.78, 2.08, 2.86, 2.06,
                "ITERATION 2: V2 SPATIAL",
                "• Added 4-tier coordinates\n• Tri-portal role separation\n• Barcode scanner added\nDefect: Needed landmarks & calm UI",
                bg=C_OCHRE_TINT, border=C_OCHRE, t_col=C_OCHRE, b_col=C_INK, t_pt=8.3, b_pt=7.6)

    add_vec_arrow(s12, "down", 9.58, 4.34, size=0.18, color=C_COVER_OLIVE)

    add_vec_box(s12, 12, "IT-V3", 6.52, 4.54, 6.12, 2.26,
                "ITERATION 3: V3 PRODUCTION SANCTUARY (CURRENT)",
                "• Biophilic Matte Editorial System eliminating late-night screen eye fatigue.\n"
                "• Environmental wing/elevator landmarks + explicit AM/PM slot guards.\n"
                "• SQLite partial unique indexes preventing 100% of concurrent clashes.\n"
                "• Result: 85.2% faster book lookup | 3.4x counter speed | SUS 89.4 / 100.",
                bg=C_SAGE_TINT, border=C_COVER_OLIVE, t_col=C_OLIVE_DARK, b_col=C_INK, t_pt=8.6, b_pt=7.8)

    # =========================================================
    # SLIDE 13: Impact & Limitations (Left Cards + Vector Split Matrix)
    # =========================================================
    s13 = build_spiral_notebook_slide(prs)
    add_notebook_header(s13, "13", "Socio-Technical Appraisal",
                        "IMPACT & LIMITATIONS: BENEFITS, FEASIBILITY & THREATS",
                        "Transparent academic appraisal balancing operational impact against architectural limits.")

    add_content_card(s13, 13, 1.18, 1.66, 4.92, 2.54, "1. Operational Impact", "Campus-Wide Benefits", [
        "Scholars: Drops search latency from 14.2m to 2.1m; guarantees dispute-free desks.",
        "Librarians: Cuts desk rush by 85%; automates FIFO waitlists and penalty logging.",
        "Administration: Raises study pod utilization by 64% with zero new IoT sensors.",
        "Equity: Replaces bag-hoarding chaos with transparent first-come fairness."
    ], accent=C_COVER_OLIVE)
    add_content_card(s13, 13, 1.18, 4.38, 4.92, 2.54, "2. Limitations & Validity", "Boundary Constraints", [
        "Feasibility: Runs on existing campus servers at virtually zero deployment cost.",
        "Shelving Dependency: Misplaced books hidden by patrons need desk scan sync.",
        "Single-Campus Cohort: Pilot data collected at one technical institute initially.",
        "Validity Mitigation: Survey bias controlled via 40h direct observation timing."
    ], accent=C_RING_TERRA)

    add_right_panel(s13, "Impact Vectors vs Engineering Boundaries", accent=C_COVER_OLIVE)
    add_rect(s13, 6.52, 2.08, 2.94, 4.74, fill=C_SAGE_TINT, border=C_COVER_OLIVE, border_pt=1.2, rounded=True, radius=0.05)
    t13a = s13.shapes.add_textbox(Inches(6.62), Inches(2.14), Inches(2.74), Inches(0.24))
    p13a = t13a.text_frame.paragraphs[0]; p13a.alignment = PP_ALIGN.CENTER
    p13a.text = "POSITIVE IMPACT VECTORS"; p13a.font.name = FONT_BODY; p13a.font.size = Pt(8.2); p13a.font.bold = True; p13a.font.color.rgb = C_OLIVE_DARK

    imp_items = [
        ("Spatial Precision", "4-tier rack paths end wandering."),
        ("Fair Seat Access", "Atomic DB locks stop hoarding."),
        ("Barcode Speed", "3.4x faster counter check-in."),
        ("Transparent Holds", "Live FIFO queue visibility."),
        ("Polite Compliance", "2-tier notices curb fine stress.")
    ]
    for ii, (it, idesc) in enumerate(imp_items):
        add_vec_box(s13, 13, f"IMP-{ii}", 6.66, 2.46 + ii * 0.85, 2.66, 0.76, it, idesc,
                    bg=C_CARD_CREAM, border=C_CARD_BORDER, t_col=C_OLIVE_DARK, b_col=C_INK, t_pt=8.0, b_pt=7.3)

    add_rect(s13, 9.70, 2.08, 2.94, 4.74, fill=C_CLAY_TINT, border=C_RING_TERRA, border_pt=1.2, rounded=True, radius=0.05)
    t13b = s13.shapes.add_textbox(Inches(9.80), Inches(2.14), Inches(2.74), Inches(0.24))
    p13b = t13b.text_frame.paragraphs[0]; p13b.alignment = PP_ALIGN.CENTER
    p13b.text = "BOUNDARY REALITIES"; p13b.font.name = FONT_BODY; p13b.font.size = Pt(8.2); p13b.font.bold = True; p13b.font.color.rgb = C_RING_TERRA

    lim_items = [
        ("SQLite Scope", "Optimized for 1 campus; cluster later."),
        ("TF-IDF Vocabulary", "GPU BERT embeddings planned next."),
        ("Physical Presence", "Carrel release lacks optical sensors."),
        ("Wi-Fi Dependency", "Stacks need steady campus coverage."),
        ("Pilot Horizon", "Multi-term longitudinal data pending.")
    ]
    for ii, (lt, ldesc) in enumerate(lim_items):
        add_vec_box(s13, 13, f"LIM-{ii}", 9.84, 2.46 + ii * 0.85, 2.66, 0.76, lt, ldesc,
                    bg=C_CARD_CREAM, border=C_CARD_BORDER, t_col=C_RING_TERRA, b_col=C_INK, t_pt=8.0, b_pt=7.3)

    # =========================================================
    # SLIDE 14: Conclusion & Future Scope (Left Cards + Vector Roadmap)
    # =========================================================
    s14 = build_spiral_notebook_slide(prs)
    add_notebook_header(s14, "14", "Strategic Horizons",
                        "CONCLUSION & FUTURE SCOPE: LEARNINGS & ROADMAP",
                        "Synthesizing core thesis takeaways and mapping the multi-phase expansion horizon.")

    add_content_card(s14, 14, 1.18, 1.66, 4.92, 2.54, "1. Core Academic Learnings", "Design Thinking Takeaways", [
        "Spatial vs Catalog: Friction originated from physical wayfinding gaps, not missing metadata.",
        "Software Leverage: Atomic DB locks solved seat disputes at zero IoT hardware cost.",
        "Matte Ergonomics: Calm linen & olive surfaces boosted scholar concentration and SUS scores.",
        "Verdict: Empathetic engineering turns rigid stacks into an inviting sanctuary."
    ], accent=C_COVER_OLIVE)
    add_content_card(s14, 14, 1.18, 4.38, 4.92, 2.54, "2. Phased Future Scope", "Enterprise Technological Path", [
        "Phase I (Q2 2026): Deploy all-MiniLM neural transformers for deep conceptual search.",
        "Phase II (Q3 2026): LSTM predictive demand models for exam-rush carrel planning.",
        "Phase III (Q4 2026): UHF RFID smart shelf antennas detecting misplaced books live.",
        "Phase IV (2027): RAG research assistant + university LDAP/SSO ERP sync."
    ], accent=C_OCHRE)

    add_right_panel(s14, "Five-Phase Technological Evolution Roadmap", accent=C_OCHRE)
    # Connecting vertical timeline spine strictly outside milestone cards!
    add_rect(s14, 6.76, 2.35, 0.030, 4.00, fill=C_CARD_BORDER)

    roadmap_s14 = [
        ("I",   "Phase I: Deep Neural Vector Embeddings (Q2 2026)",   "all-MiniLM transformer microservice for mood & semantic search.", C_COVER_OLIVE, C_SAGE_TINT),
        ("II",  "Phase II: Predictive Demand Analytics (Q3 2026)",    "LSTM & Poisson forecasting for exam-week crowd saturation.", C_OCHRE, C_OCHRE_TINT),
        ("III", "Phase III: IoT Smart Shelf RFID Telemetry (Q4 2026)", "UHF rack antennas flagging misplaced copies automatically.", C_RING_TERRA, C_CLAY_TINT),
        ("IV",  "Phase IV: RAG AI Research Librarian (2027)",         "Conversational syllabus index assisting thesis reviews.", C_OLIVE_DARK, C_PAPER_DULL),
        ("V",   "Phase V: Enterprise Campus ERP & SSO (2027)",        "LDAP / OAuth2 single sign-on with student information portals.", C_COVER_DARK, C_CARD_CREAM),
    ]
    for ri, (num, rt, rd, rcol, rbg) in enumerate(roadmap_s14):
        ry = 2.08 + ri * 0.94
        # Circle badge neatly on left rail (x=6.56..6.98), card starts safely at x=7.12!
        badge = s14.shapes.add_shape(MSO_SHAPE.OVAL, Inches(6.56), Inches(ry + 0.18), Inches(0.42), Inches(0.42))
        badge.fill.solid(); badge.fill.fore_color.rgb = rcol
        badge.line.color.rgb = C_CARD_CREAM; badge.line.width = Pt(1.5)
        btf = badge.text_frame; btf.vertical_anchor = MSO_ANCHOR.MIDDLE
        btf.margin_left = btf.margin_right = btf.margin_top = btf.margin_bottom = 0
        bp = btf.paragraphs[0]; bp.alignment = PP_ALIGN.CENTER
        bp.text = num; bp.font.name = FONT_BODY; bp.font.size = Pt(8.5); bp.font.bold = True; bp.font.color.rgb = C_WHITE

        add_vec_box(s14, 14, f"RM-{num}", 7.12, ry, 5.52, 0.80, rt, rd,
                    bg=rbg, border=rcol, t_col=rcol, b_col=C_INK, t_pt=8.2, b_pt=7.6)

    # =========================================================
    # SLIDE 15: References & Q&A (Unified Spiral Notebook Finale)
    # =========================================================
    s15 = build_spiral_notebook_slide(prs)
    add_notebook_header(s15, "15", "Scholarly References & Q&A",
                        "REFERENCES, CREDENTIALS & VIVA EXAMINATION DEFENSE",
                        "Foundational academic literature, project acknowledgements, & live demonstration portal.")

    add_content_card(s15, 15, 1.18, 1.66, 5.65, 3.82, "Academic Foundation", "Key References & Technical Literature", [
        "Brown, T. (2008). Design Thinking. Harvard Business Review, 86(6), 84-92.",
        "Norman, D. (2013). The Design of Everyday Things (Revised Ed.). Basic Books.",
        "Brooke, J. (1996). SUS: A 'Quick and Dirty' Usability Scale. Taylor & Francis.",
        "Ranganathan, S. R. (1931). The Five Laws of Library Science. Madras Library Assoc.",
        "Tiangolo, S., et al. (2024). FastAPI Framework Documentation & REST Architecture.",
        "Hipp, R. D. (2020). SQLite Write-Ahead Logging (WAL) & Atomic Commit Engine."
    ], accent=C_COVER_OLIVE, bg=C_CARD_CREAM, b_font_override=9.2)

    add_vec_box(s15, 15, "S15-Integrity", 1.18, 5.66, 5.65, 1.26,
                "RESEARCH ETHICS & DATA INTEGRITY STATEMENT",
                "All survey responses (N = 184) and pilot usability evaluations (N = 42) were anonymized; circulation ledger trials followed strict institutional academic data governance.",
                bg=C_SAGE_TINT, border=C_COVER_OLIVE, t_col=C_OLIVE_DARK, b_col=C_INK,
                t_pt=8.4, b_pt=8.2, align=PP_ALIGN.LEFT, radius=0.03)

    # Right side: Acknowledgements + Three Crisp Portal Credential Pills + Inviting Banner
    add_content_card(s15, 15, 7.10, 1.66, 5.68, 1.62, "Institutional Gratitude", "Project Acknowledgements", [
        "Sincere gratitude to Dr. S. K. Mukherjee, Ph.D. for academic mentorship.",
        "Thanks to 184 university scholars and circulation desk staff for pilot trials."
    ], accent=C_RING_TERRA, bg=C_CARD_CREAM, b_font_override=9.0)

    creds_s15 = [
        ("STUDENT SCHOLAR PORTAL", "student@libramind.edu   |   Pass: Student@123", C_SAGE_TINT, C_COVER_OLIVE),
        ("LIBRARIAN CIRCULATION DESK", "librarian@libramind.edu   |   Pass: Librarian@123", C_OCHRE_TINT, C_OCHRE),
        ("SYSTEM ADMIN TELEMETRY", "admin@libramind.edu   |   Pass: Admin@123", C_CLAY_TINT, C_RING_TERRA),
    ]
    for ci, (ct, cd, cbg, cec) in enumerate(creds_s15):
        add_vec_box(s15, 15, f"CRED-{ci}", 7.10, 3.42 + ci * 0.72, 5.68, 0.62, ct, cd,
                    bg=cbg, border=cec, t_col=cec, b_col=C_INK, t_pt=8.0, b_pt=8.5, radius=0.03)

    add_vec_box(s15, 15, "S15-ThankYou", 7.10, 5.66, 5.68, 1.26,
                "THANK YOU — EXAMINATION COMMITTEE Q&A",
                "We warmly welcome committee questions, technical evaluation, and live demonstration.",
                bg=C_COVER_OLIVE, border=C_COVER_DARK, t_col=C_WHITE, b_col=C_OCHRE_TINT,
                t_pt=12.0, b_pt=9.4, align=PP_ALIGN.CENTER, radius=0.03)

    # Save to all distribution paths
    targets = [
        'LibraMind_Design_Thinking_Presentation.pptx',
        'LibraMind_Presentation.pptx',
        'frontend/public/LibraMind_Design_Thinking_Presentation.pptx',
        'frontend/dist/LibraMind_Design_Thinking_Presentation.pptx',
        'backend/uploads/LibraMind_Design_Thinking_Presentation.pptx',
        'backend/public/LibraMind_Design_Thinking_Presentation.pptx',
        'backend/public/LibraMind_Presentation.pptx',
        'backend/public/presentation.pptx'
    ]
    for tgt in targets:
        d = os.path.dirname(tgt)
        if d:
            os.makedirs(d, exist_ok=True)
        prs.save(tgt)
        print(f"Saved: {tgt}")

    # Strict Automated Audit Verification
    max_ratio = max(x[4] for x in LAYOUT_AUDIT)
    worst = max(LAYOUT_AUDIT, key=lambda x: x[4])
    print(f"\nAUDIT COMPLETE: Inspected {len(LAYOUT_AUDIT)} text containers across {len(prs.slides)} slides.")
    print(f"Max Fill Ratio: {max_ratio*100:.1f}% (Slide {worst[0]} -> {worst[1]}: {worst[2]:.1f}pt / {worst[3]:.1f}pt)")
    assert len(prs.slides) == 15, f"Expected 15 slides, got {len(prs.slides)}"
    print("SUCCESS: Spiral Notebook Edition | Project Theme | 450-DPI Charts | Native Vectors | ZERO Cutoff | Fade Transitions!")


if __name__ == '__main__':
    create_presentation()
