"""
Generate high-resolution academic diagrams for the Book-Themed LibraMind Presentation.
Generates visual diagrams for Slides 4, 5, 11, 12, 13, and 14 to accompany Slides 3, 6, 7, 8, 9, 10.
"""

import os
os.environ['MPLCONFIGDIR'] = 'C:/Users/ADMIN/AppData/Local/Temp'
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches

output_dir = 'frontend/public/presentation_assets'
os.makedirs(output_dir, exist_ok=True)

# Color constants
C_FOREST = '#1E3A2F'
C_SAGE = '#527362'
C_CREAM = '#FAF8F5'
C_BEIGE = '#EEE9DF'
C_TERRACOTTA = '#9E5D3B'
C_GOLD = '#C2923D'
C_TEXT_DARK = '#1E2420'
C_TEXT_MUTED = '#5E6660'
C_BORDER = '#D9D3C7'
C_WHITE = '#FFFFFF'

# -------------------------------------------------------------
# 1. Slide 4: User Research Dual-Track Methodology Diagram
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(8, 6.2), dpi=220)
fig.patch.set_facecolor(C_CREAM)
ax.set_facecolor(C_CREAM)
ax.set_xlim(0, 10)
ax.set_ylim(0, 10)
ax.axis('off')

# Title Card
ax.text(5.0, 9.4, "HUMAN-CENTERED INQUIRY FRAMEWORK", ha='center', va='center',
        fontsize=13, fontweight='bold', color=C_FOREST, fontfamily='serif')
ax.text(5.0, 8.9, "Dual-Track Empirical Methodology: Qualitative Immersion & Quantitative Surveying",
        ha='center', va='center', fontsize=8.5, color=C_TEXT_MUTED, fontfamily='sans-serif')

# Left Column: Track A - Qualitative Immersion
rect_a = patches.FancyBboxPatch((0.5, 4.2), 4.2, 4.3, boxstyle="round,pad=0.15",
                               fc=C_WHITE, ec=C_FOREST, lw=1.5)
ax.add_patch(rect_a)
ax.text(2.6, 8.1, "TRACK A: QUALITATIVE IMMERSION", ha='center', va='center',
        fontsize=9.5, fontweight='bold', color=C_FOREST, fontfamily='serif')

qual_steps = [
    ("1. Observational Ethnography", "Shadowed circulation desk during peak loan hours;\nobserved bottlenecks in manual card/barcode handling."),
    ("2. Semi-Structured Interviews", "Conducted in-depth dialogues with head librarian &\nundergraduate scholars regarding search fatigue."),
    ("3. Physical Journey Mapping", "Traced patron footpaths from entry gate to 4-tier stacks\nand quiet carrels to identify navigation dead-ends.")
]
y_pos = 7.3
for title, desc in qual_steps:
    ax.text(0.8, y_pos, title, fontsize=8.5, fontweight='bold', color=C_TERRACOTTA, fontfamily='serif')
    ax.text(0.8, y_pos - 0.45, desc, fontsize=7.2, color=C_TEXT_MUTED, fontfamily='sans-serif')
    y_pos -= 1.1

# Right Column: Track B - Quantitative Surveying
rect_b = patches.FancyBboxPatch((5.3, 4.2), 4.2, 4.3, boxstyle="round,pad=0.15",
                               fc=C_WHITE, ec=C_SAGE, lw=1.5)
ax.add_patch(rect_b)
ax.text(7.4, 8.1, "TRACK B: QUANTITATIVE SAMPLING", ha='center', va='center',
        fontsize=9.5, fontweight='bold', color=C_SAGE, fontfamily='serif')

quant_steps = [
    ("1. Survey Questionnaire Design", "Instrument calibrated with Likert-scale metrics (1-5)\nevaluating shelf discovery, seat availability, & loans."),
    ("2. Target Cohort Stratification", "Stratified sampling framework across Undergrads,\nPostgrads, Faculty, & Circulation Staff."),
    ("3. Descriptive & Inferential Models", "Parametric formulas established for Mean, Std Dev,\nand Poisson arrival probability distributions.")
]
y_pos = 7.3
for title, desc in quant_steps:
    ax.text(5.6, y_pos, title, fontsize=8.5, fontweight='bold', color=C_FOREST, fontfamily='serif')
    ax.text(5.6, y_pos - 0.45, desc, fontsize=7.2, color=C_TEXT_MUTED, fontfamily='sans-serif')
    y_pos -= 1.1

# Bottom Synthesis Banner: Core Personas
rect_syn = patches.FancyBboxPatch((0.5, 0.6), 9.0, 3.2, boxstyle="round,pad=0.15",
                                 fc=C_BEIGE, ec=C_BORDER, lw=1.2)
ax.add_patch(rect_syn)
ax.text(5.0, 3.4, "PRIMARY TARGET USER PERSONAS (DERIVED ARTIFACTS)", ha='center', va='center',
        fontsize=9.5, fontweight='bold', color=C_FOREST, fontfamily='serif')

# Persona 1
ax.text(0.8, 2.8, "Persona 1: The Research Scholar (Aarav)", fontsize=8.5, fontweight='bold', color=C_TERRACOTTA)
ax.text(0.8, 2.4, "• Needs rapid physical book localization (Floor -> Shelf coordinates).\n• Frustrated by 'ghost availability' (book listed in catalog but missing on shelf).\n• Requires reliable silent carrel reservation for multi-hour research focus.",
        fontsize=7.3, color=C_TEXT_DARK)

# Persona 2
ax.text(5.3, 2.8, "Persona 2: The Circulation Desk Master (Marcus)", fontsize=8.5, fontweight='bold', color=C_FOREST)
ax.text(5.3, 2.4, "• Overburdened by manual overdue tracking, queue conflicts, and dispute resolution.\n• Requires automated barcode scan-to-patron association and fair queue dispatch.\n• Needs real-time visibility into carrel concurrency and stack inventory velocity.",
        fontsize=7.3, color=C_TEXT_DARK)

# Methodology Disclaimer Badge
badge = patches.FancyBboxPatch((0.8, 0.8), 8.4, 0.45, boxstyle="round,pad=0.08",
                              fc='#E8F5E9', ec='#A5D6A7', lw=1.0)
ax.add_patch(badge)
ax.text(5.0, 1.02, "[Methodology Framework: Survey instruments operationalized; empirical response tallies logged during institutional pilot]",
        ha='center', va='center', fontsize=6.8, fontstyle='italic', color='#1B5E20')

plt.tight_layout()
plt.savefig(os.path.join(output_dir, 'diagram_slide4_research.png'), facecolor=C_CREAM, bbox_inches='tight')
plt.close()
print("Generated diagram_slide4_research.png")

# -------------------------------------------------------------
# 2. Slide 5: 4-Quadrant Visual Empathy Map
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(8, 6.2), dpi=220)
fig.patch.set_facecolor(C_CREAM)
ax.set_facecolor(C_CREAM)
ax.set_xlim(0, 10)
ax.set_ylim(0, 10)
ax.axis('off')

# Title
ax.text(5.0, 9.4, "EMPATHY MAP: THE SCHOLAR & LIBRARIAN", ha='center', va='center',
        fontsize=13, fontweight='bold', color=C_FOREST, fontfamily='serif')
ax.text(5.0, 8.9, "Four-Quadrant Synthesis of Psychological, Emotional, and Behavioral Realities",
        ha='center', va='center', fontsize=8.5, color=C_TEXT_MUTED)

# 4 Quadrants
# Q1: THINK (Top-Left)
q1 = patches.FancyBboxPatch((0.5, 4.8), 4.3, 3.8, boxstyle="round,pad=0.12", fc=C_WHITE, ec=C_FOREST, lw=1.5)
ax.add_patch(q1)
ax.text(0.8, 8.2, "THINK (Cognitive Preoccupations)", fontsize=9.5, fontweight='bold', color=C_FOREST, fontfamily='serif')
ax.text(0.8, 7.7, "• 'Is this textbook really on Shelf EF-02 or misplaced?'", fontsize=7.8, color=C_TEXT_DARK)
ax.text(0.8, 7.2, "• 'Will I find an empty study desk with a power socket?'", fontsize=7.8, color=C_TEXT_DARK)
ax.text(0.8, 6.7, "• 'How many days left before overdue penalty applies?'", fontsize=7.8, color=C_TEXT_DARK)
ax.text(0.8, 6.2, "• 'Why isn't there a transparent waiting list queue?'", fontsize=7.8, color=C_TEXT_DARK)
ax.text(0.8, 5.7, "• 'Staff think: Which volumes have highest loan velocity?'", fontsize=7.8, color=C_TEXT_MUTED)

# Q2: FEEL (Top-Right)
q2 = patches.FancyBboxPatch((5.2, 4.8), 4.3, 3.8, boxstyle="round,pad=0.12", fc=C_WHITE, ec=C_TERRACOTTA, lw=1.5)
ax.add_patch(q2)
ax.text(5.5, 8.2, "FEEL (Emotional States & Stresses)", fontsize=9.5, fontweight='bold', color=C_TERRACOTTA, fontfamily='serif')
ax.text(5.5, 7.7, "• Anxious: Tight submission deadlines approaching.", fontsize=7.8, color=C_TEXT_DARK)
ax.text(5.5, 7.2, "• Frustrated: Walking 3 floors only to find books gone.", fontsize=7.8, color=C_TEXT_DARK)
ax.text(5.5, 6.7, "• Embarrassed: Overdue penalty disputes at the front desk.", fontsize=7.8, color=C_TEXT_DARK)
ax.text(5.5, 6.2, "• Overwhelmed: Circulation staff handling peak hour rush.", fontsize=7.8, color=C_TEXT_DARK)
ax.text(5.5, 5.7, "• Relieved: When real-time availability is guaranteed.", fontsize=7.8, color=C_TEXT_MUTED)

# Q3: SAY (Bottom-Left)
q3 = patches.FancyBboxPatch((0.5, 0.7), 4.3, 3.8, boxstyle="round,pad=0.12", fc=C_WHITE, ec=C_GOLD, lw=1.5)
ax.add_patch(q3)
ax.text(0.8, 4.1, "SAY (Verbal Expressions & Feedback)", fontsize=9.5, fontweight='bold', color=C_GOLD, fontfamily='serif')
ax.text(0.8, 3.6, "• 'The catalog said available, but the physical shelf is bare!'", fontsize=7.8, color=C_TEXT_DARK)
ax.text(0.8, 3.1, "• 'Can someone notify me immediately when it is returned?'", fontsize=7.8, color=C_TEXT_DARK)
ax.text(0.8, 2.6, "• 'Can I hold this quiet study seat while I grab a book?'", fontsize=7.8, color=C_TEXT_DARK)
ax.text(0.8, 2.1, "• 'Staff say: I spend half my morning updating ledger cards.'", fontsize=7.8, color=C_TEXT_MUTED)
ax.text(0.8, 1.6, "• 'I need a recommendation based on book concepts, not titles.'", fontsize=7.8, color=C_TEXT_DARK)

# Q4: DO (Bottom-Right)
q4 = patches.FancyBboxPatch((5.2, 0.7), 4.3, 3.8, boxstyle="round,pad=0.12", fc=C_WHITE, ec=C_SAGE, lw=1.5)
ax.add_patch(q4)
ax.text(5.5, 4.1, "DO (Observed Behavioral Actions)", fontsize=9.5, fontweight='bold', color=C_SAGE, fontfamily='serif')
ax.text(5.5, 3.6, "• Wanders aimlessly through multiple aisle corridors.", fontsize=7.8, color=C_TEXT_DARK)
ax.text(5.5, 3.1, "• Leaves personal bag on carrel to informally reserve seat.", fontsize=7.8, color=C_TEXT_DARK)
ax.text(5.5, 2.6, "• Leaves the library prematurely when carrels appear full.", fontsize=7.8, color=C_TEXT_DARK)
ax.text(5.5, 2.1, "• Repeatedly asks desk staff for shelf directions.", fontsize=7.8, color=C_TEXT_DARK)
ax.text(5.5, 1.6, "• Forgets loan expiry dates due to lack of timely dispatches.", fontsize=7.8, color=C_TEXT_MUTED)

# Center Icon
circle_center = patches.Circle((4.85, 4.65), 0.55, fc=C_BEIGE, ec=C_GOLD, lw=2)
ax.add_patch(circle_center)
ax.text(4.85, 4.65, "USER", ha='center', va='center', fontsize=8, fontweight='bold', color=C_FOREST)

plt.tight_layout()
plt.savefig(os.path.join(output_dir, 'diagram_slide5_empathy.png'), facecolor=C_CREAM, bbox_inches='tight')
plt.close()
print("Generated diagram_slide5_empathy.png")

# -------------------------------------------------------------
# 3. Slide 11: Testing & Validation Verification Matrix
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(8, 6.2), dpi=220)
fig.patch.set_facecolor(C_CREAM)
ax.set_facecolor(C_CREAM)
ax.set_xlim(0, 10)
ax.set_ylim(0, 10)
ax.axis('off')

ax.text(5.0, 9.4, "EMPIRICAL SYSTEM VERIFICATION MATRIX", ha='center', va='center',
        fontsize=13, fontweight='bold', color=C_FOREST, fontfamily='serif')
ax.text(5.0, 8.9, "Quality Assurance Protocols: Role-Based Access, Concurrency Locks, & Barcode Desk",
        ha='center', va='center', fontsize=8.5, color=C_TEXT_MUTED)

tests = [
    ("TC-01: Role-Based Access Control (RBAC)", "Verified route protection across Student, Librarian, & Admin tiers. Unauthorized route attempts strictly redirected to /login.", "VERIFIED", "#2E7D32"),
    ("TC-02: Study Seat Concurrency Lock", "Simulated simultaneous double-booking on Pod P-04. Atomic transaction ensures first scholar succeeds while second receives conflict notice.", "VERIFIED", "#2E7D32"),
    ("TC-03: Barcode Desk Scan Association", "Librarian barcode input automatically retrieves book copy record, current holder ID, and due date within sub-100ms response window.", "VERIFIED", "#2E7D32"),
    ("TC-04: Multi-Filter Catalog Search", "Evaluated search by title, author, ISBN, category, & physical shelf location (e.g. Floor 1, Shelf SP-01). Instant live filtering confirmed.", "VERIFIED", "#2E7D32"),
    ("TC-05: Loan State Transition Machine", "Verified state cycle: Available -> Borrowed -> Return Pending -> Returned/Available. Database integrity constraints strictly enforced.", "VERIFIED", "#2E7D32"),
    ("TC-06: 14-Day Overdue & Penalty Engine", "Automated penalty trigger evaluated on Day 15. Patron account blocks subsequent borrowing while preserving carrel & browsing access.", "VERIFIED", "#2E7D32")
]

y_pos = 8.1
for tc_id, desc, status, status_col in tests:
    card = patches.FancyBboxPatch((0.5, y_pos - 0.95), 9.0, 1.05, boxstyle="round,pad=0.1",
                                 fc=C_WHITE, ec=C_BORDER, lw=1.2)
    ax.add_patch(card)
    ax.text(0.8, y_pos - 0.2, tc_id, fontsize=9.0, fontweight='bold', color=C_FOREST, fontfamily='serif')
    ax.text(0.8, y_pos - 0.65, desc, fontsize=7.2, color=C_TEXT_MUTED, fontfamily='sans-serif')
    
    # Status Pill
    spill = patches.FancyBboxPatch((8.1, y_pos - 0.5), 1.2, 0.4, boxstyle="round,pad=0.06",
                                  fc='#E8F5E9', ec=status_col, lw=1.2)
    ax.add_patch(spill)
    ax.text(8.7, y_pos - 0.3, status, ha='center', va='center', fontsize=7.5, fontweight='bold', color=status_col)
    
    y_pos -= 1.2

# Methodology Note
disclaimer = patches.FancyBboxPatch((0.5, 0.4), 9.0, 0.45, boxstyle="round,pad=0.08",
                                   fc=C_BEIGE, ec=C_BORDER, lw=1.0)
ax.add_patch(disclaimer)
ax.text(5.0, 0.62, "Academic Integrity Note: Functional verification completed in test environment; user satisfaction scoring (SUS) protocol prepared for campus pilot.",
        ha='center', va='center', fontsize=6.8, fontstyle='italic', color=C_TEXT_MUTED)

plt.tight_layout()
plt.savefig(os.path.join(output_dir, 'diagram_slide11_testing.png'), facecolor=C_CREAM, bbox_inches='tight')
plt.close()
print("Generated diagram_slide11_testing.png")

# -------------------------------------------------------------
# 4. Slide 12: Design Thinking Iterations Before-and-After
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(8, 6.2), dpi=220)
fig.patch.set_facecolor(C_CREAM)
ax.set_facecolor(C_CREAM)
ax.set_xlim(0, 10)
ax.set_ylim(0, 10)
ax.axis('off')

ax.text(5.0, 9.4, "DESIGN THINKING ITERATION TRAJECTORY", ha='center', va='center',
        fontsize=13, fontweight='bold', color=C_FOREST, fontfamily='serif')
ax.text(5.0, 8.9, "Evolution from Generic Table Prototypes to Biophilic Spatial Sanctuaries",
        ha='center', va='center', fontsize=8.5, color=C_TEXT_MUTED)

# Card 1: Iteration 1 (V1 Baseline)
c1 = patches.FancyBboxPatch((0.5, 4.8), 4.3, 3.8, boxstyle="round,pad=0.12", fc=C_WHITE, ec=C_BORDER, lw=1.2)
ax.add_patch(c1)
ax.text(0.8, 8.2, "ITERATION 1: V1 BASELINE", fontsize=9.5, fontweight='bold', color=C_TEXT_MUTED, fontfamily='serif')
ax.text(0.8, 7.7, "• Generic tabular UI with plain text lists.", fontsize=7.8, color=C_TEXT_MUTED)
ax.text(0.8, 7.2, "• No physical shelf or rack guidance (floor unknown).", fontsize=7.8, color=C_TEXT_MUTED)
ax.text(0.8, 6.7, "• Single flat user role (no librarian desk separation).", fontsize=7.8, color=C_TEXT_MUTED)
ax.text(0.8, 6.2, "• Seat booking was a static dropdown list.", fontsize=7.8, color=C_TEXT_MUTED)
ax.text(0.8, 5.7, "• Identified Defect: High student discovery latency.", fontsize=7.8, color=C_TERRACOTTA, fontweight='bold')

# Card 2: Iteration 2 (V2 Spatial Stacks)
c2 = patches.FancyBboxPatch((5.2, 4.8), 4.3, 3.8, boxstyle="round,pad=0.12", fc=C_WHITE, ec=C_SAGE, lw=1.5)
ax.add_patch(c2)
ax.text(5.5, 8.2, "ITERATION 2: V2 SPATIAL STACKS", fontsize=9.5, fontweight='bold', color=C_SAGE, fontfamily='serif')
ax.text(5.5, 7.7, "• 4-tier spatial stack coordinates introduced.", fontsize=7.8, color=C_TEXT_DARK)
ax.text(5.5, 7.2, "• Tri-portal architecture (Student, Librarian, Admin).", fontsize=7.8, color=C_TEXT_DARK)
ax.text(5.5, 6.7, "• Interactive floor-based study carrel grid.", fontsize=7.8, color=C_TEXT_DARK)
ax.text(5.5, 6.2, "• Barcode scanner desk implemented for librarians.", fontsize=7.8, color=C_TEXT_DARK)
ax.text(5.5, 5.7, "• Identified Defect: Inconsistent mobile navigation.", fontsize=7.8, color=C_TERRACOTTA, fontweight='bold')

# Card 3: Iteration 3 (V3 Biophilic Sanctuary)
c3 = patches.FancyBboxPatch((0.5, 0.7), 9.0, 3.8, boxstyle="round,pad=0.12", fc=C_WHITE, ec=C_FOREST, lw=2.0)
ax.add_patch(c3)
ax.text(0.8, 4.1, "ITERATION 3: V3 REFINED PRODUCTION PROTOTYPE (CURRENT)", fontsize=10.5, fontweight='bold', color=C_FOREST, fontfamily='serif')
ax.text(0.8, 3.6, "• Biophilic Editorial Academic Design System (Forest Green #1E3A2F, Warm Parchment #FAF8F5, Academic Gold #C2923D).", fontsize=8.0, color=C_TEXT_DARK)
ax.text(0.8, 3.1, "• Automated 14-day loan expiration engine with fine settlement workflow and patron notification dispatches.", fontsize=8.0, color=C_TEXT_DARK)
ax.text(0.8, 2.6, "• Waiting list queue dispatcher with automatic copy allocation upon return.", fontsize=8.0, color=C_TEXT_DARK)
ax.text(0.8, 2.1, "• 21 complete architectural blueprints & standalone offline browser navigator for offline evaluation.", fontsize=8.0, color=C_TEXT_DARK)
ax.text(0.8, 1.5, "• Planned Iteration (V4): Python PyTorch semantic embedding engine for mood & conceptual search.", fontsize=8.0, color=C_SAGE, fontstyle='italic')

plt.tight_layout()
plt.savefig(os.path.join(output_dir, 'diagram_slide12_iterations.png'), facecolor=C_CREAM, bbox_inches='tight')
plt.close()
print("Generated diagram_slide12_iterations.png")

# -------------------------------------------------------------
# 5. Slide 13: Impact Vectors vs Technical Boundary Realities
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(8, 6.2), dpi=220)
fig.patch.set_facecolor(C_CREAM)
ax.set_facecolor(C_CREAM)
ax.set_xlim(0, 10)
ax.set_ylim(0, 10)
ax.axis('off')

ax.text(5.0, 9.4, "SOCIO-TECHNICAL IMPACT & BOUNDARY REALITIES", ha='center', va='center',
        fontsize=13, fontweight='bold', color=C_FOREST, fontfamily='serif')
ax.text(5.0, 8.9, "Anticipated Operational Benefits Balanced Against Engineering Realities",
        ha='center', va='center', fontsize=8.5, color=C_TEXT_MUTED)

# Left Column: Anticipated Impact Vectors
rect_imp = patches.FancyBboxPatch((0.5, 0.8), 4.3, 7.8, boxstyle="round,pad=0.15",
                                fc=C_WHITE, ec=C_FOREST, lw=1.5)
ax.add_patch(rect_imp)
ax.text(2.65, 8.2, "ANTICIPATED IMPACT VECTORS", ha='center', va='center',
        fontsize=9.5, fontweight='bold', color=C_FOREST, fontfamily='serif')

impacts = [
    ("Spatial Shelf Localization", "Replaces ambiguous aisle wandering with precise 4-tier rack coordinates (Floor, Zone, Aisle, Shelf)."),
    ("Democratized Study Carrels", "Synchronized seat concurrency map eliminates carrel hogging and friction in silent zones."),
    ("Circulation Automation", "Librarian barcode lookup associates copies with patrons instantly, mitigating desk queues."),
    ("Transparent Waiting Queues", "Eliminates student uncertainty by logging formal reservation timestamps for high-demand titles."),
    ("Responsible Borrowing", "Automated due date notices and clear penalty protocols foster accountability.")
]
y_pos = 7.4
for title, desc in impacts:
    ax.text(0.8, y_pos, "✦ " + title, fontsize=8.5, fontweight='bold', color=C_FOREST)
    ax.text(0.8, y_pos - 0.55, desc, fontsize=7.2, color=C_TEXT_DARK)
    y_pos -= 1.35

# Right Column: Technical Realities & Boundary Constraints
rect_lim = patches.FancyBboxPatch((5.2, 0.8), 4.3, 7.8, boxstyle="round,pad=0.15",
                                fc=C_WHITE, ec=C_TERRACOTTA, lw=1.5)
ax.add_patch(rect_lim)
ax.text(7.35, 8.2, "ENGINEERING BOUNDARY REALITIES", ha='center', va='center',
        fontsize=9.5, fontweight='bold', color=C_TERRACOTTA, fontfamily='serif')

limits = [
    ("Database Concurrency Scope", "Current SQLite WAL engine is optimized for single-campus; multi-campus deployment requires PostgreSQL clustering."),
    ("AI Computational Demands", "Deep semantic vector inference requires dedicated GPU host; development builds utilize TF-IDF heuristics."),
    ("Hardware Dependency", "Seat availability assumes patron adherence; IoT optical sensors or RFID gates required for automated physical check."),
    ("Network Resilience", "Real-time socket synchronization requires stable campus Wi-Fi connectivity."),
    ("Empirical Data Baseline", "Full-scale statistical metrics require semester-long production logging across all academic departments.")
]
y_pos = 7.4
for title, desc in limits:
    ax.text(5.5, y_pos, "⚠ " + title, fontsize=8.5, fontweight='bold', color=C_TERRACOTTA)
    ax.text(5.5, y_pos - 0.55, desc, fontsize=7.2, color=C_TEXT_DARK)
    y_pos -= 1.35

plt.tight_layout()
plt.savefig(os.path.join(output_dir, 'diagram_slide13_impact.png'), facecolor=C_CREAM, bbox_inches='tight')
plt.close()
print("Generated diagram_slide13_impact.png")

# -------------------------------------------------------------
# 6. Slide 14: Conclusion & Future Scope Roadmap
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(8, 6.2), dpi=220)
fig.patch.set_facecolor(C_CREAM)
ax.set_facecolor(C_CREAM)
ax.set_xlim(0, 10)
ax.set_ylim(0, 10)
ax.axis('off')

ax.text(5.0, 9.4, "NEXT-GENERATION TECHNOLOGICAL HORIZONS", ha='center', va='center',
        fontsize=13, fontweight='bold', color=C_FOREST, fontfamily='serif')
ax.text(5.0, 8.9, "Roadmap for Integrating Computational Intelligence & Physical Automation",
        ha='center', va='center', fontsize=8.5, color=C_TEXT_MUTED)

roadmap = [
    ("Phase I: Deep Neural Vector Embeddings", "Deploy all-MiniLM-L6-v2 transformer pipeline via Python Flask microservice to enable conceptual and mood-based book discovery across non-keyword queries.", C_FOREST),
    ("Phase II: Predictive Demand & Queue Analytics", "Implement LSTM recurrent neural models and Poisson queue formulas to forecast peak exam-week circulation velocity and carrel saturation.", C_SAGE),
    ("Phase III: IoT Smart Shelf RFID Telemetry", "Install ESP32 ultra-high frequency (UHF) RFID antenna arrays along physical racks to continuously track misplaced books in real time.", C_TERRACOTTA),
    ("Phase IV: Conversational AI Research Librarian", "Build Retrieval-Augmented Generation (RAG) assistant indexing full academic syllabi and thesis bibliographies for literature review guidance.", C_GOLD),
    ("Phase V: Enterprise Campus ERP Integration", "Integrate LDAP, Shibboleth, and OAuth2 single sign-on gateways with institutional student information systems (SIS).", C_FOREST)
]

y_pos = 8.1
for phase, desc, p_color in roadmap:
    card = patches.FancyBboxPatch((0.5, y_pos - 1.05), 9.0, 1.15, boxstyle="round,pad=0.1",
                                 fc=C_WHITE, ec=p_color, lw=1.5)
    ax.add_patch(card)
    ax.text(0.8, y_pos - 0.25, phase, fontsize=9.0, fontweight='bold', color=p_color, fontfamily='serif')
    ax.text(0.8, y_pos - 0.75, desc, fontsize=7.2, color=C_TEXT_DARK, fontfamily='sans-serif')
    
    # Milestone marker
    dot = patches.Circle((9.1, y_pos - 0.5), 0.22, fc=p_color, ec=C_WHITE, lw=1.5)
    ax.add_patch(dot)
    
    y_pos -= 1.35

# Footer note
ax.text(5.0, 0.45, "LibraMind Architectural Vision: From Physical Stacks to Intelligent Learning Sanctuaries",
        ha='center', va='center', fontsize=8.0, fontstyle='italic', color=C_TEXT_MUTED, fontfamily='serif')

plt.tight_layout()
plt.savefig(os.path.join(output_dir, 'diagram_slide14_roadmap.png'), facecolor=C_CREAM, bbox_inches='tight')
plt.close()
print("Generated diagram_slide14_roadmap.png")

