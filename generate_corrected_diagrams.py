import os
os.environ['MPLCONFIGDIR'] = 'C:/Users/ADMIN/AppData/Local/Temp'
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

os.makedirs('frontend/public/presentation_assets', exist_ok=True)
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['Segoe UI', 'DejaVu Sans', 'Arial']

# -------------------------------------------------------------
# DIAGRAM 1: Statistical Modeling & Formulas (Slide 6)
# -------------------------------------------------------------
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11.5, 4.4), dpi=220)
fig.patch.set_facecolor('#FAF8F5')

# Left: Theoretical Probability Distribution Model
x = np.linspace(0, 40, 300)
mu_param = 18.0
sigma_param = 6.0
y = (1 / (sigma_param * np.sqrt(2 * np.pi))) * np.exp(-0.5 * ((x - mu_param) / sigma_param) ** 2)

ax1.set_facecolor('#FAF8F5')
ax1.plot(x, y, color='#1E3A2F', lw=2.5, label=r'Probability Density $f(x)$')
ax1.fill_between(x, y, color='#527362', alpha=0.25, label=r'$\mu \pm 1\sigma$ Interval (68.2%)')
ax1.axvline(mu_param, color='#9E5D3B', linestyle='--', lw=2, label=r'Mean $\mu = \frac{1}{N}\sum x_i$')
ax1.axvline(mu_param - 2.0, color='#C2923D', linestyle=':', lw=1.8, label=r'Median $Q_2$ (50th percentile)')
ax1.axvline(mu_param - 3.0, color='#264435', linestyle='-.', lw=1.5, label='Mode (Peak Frequency)')

ax1.set_title('Mathematical Model: Retrieval Latency Distribution\nGaussian PDF: $f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}$',
              fontsize=9.5, fontweight='bold', color='#1E3A2F', pad=10)
ax1.set_xlabel('Retrieval Duration $X$ (Minutes)', fontsize=8.5, color='#1E3A2F')
ax1.set_ylabel('Probability Density $f(x)$', fontsize=8.5, color='#1E3A2F')
ax1.grid(True, linestyle=':', alpha=0.4, color='#8CA899')
ax1.legend(loc='upper right', fontsize=7.5, framealpha=0.92)
for spine in ax1.spines.values():
    spine.set_color('#D9D3C7')

# Methodology disclaimer badge on left plot
ax1.text(20, -0.016, '[Theoretical Gaussian Framework for Physical Retrieval Latency]',
         ha='center', fontsize=7.2, color='#7A6250', style='italic')

# Right: Statistical Measurement Framework & Variable Operationalization
ax2.set_facecolor('#FAF8F5')
ax2.set_xlim(0, 10)
ax2.set_ylim(0, 10)
ax2.axis('off')
ax2.set_title('Empirical Measurement Variables & Statistical Formulas', fontsize=9.5, fontweight='bold', color='#1E3A2F', pad=10)

stat_boxes = [
    ("1. Retrieval Time (Continuous Variable)",
     r"$\mu = \frac{1}{n}\sum_{i=1}^n x_i$  |  $s = \sqrt{\frac{1}{n-1}\sum (x_i - \bar{x})^2}$",
     "Measures physical navigation latency across multi-floor stacks.",
     8.0, '#EBF2ED', '#1E3A2F'),

    ("2. Peak Seat Occupancy Probability",
     r"$P(K = k) = \frac{\lambda^k e^{-\lambda}}{k!}$  |  $P(\text{Full}) = \frac{\text{Occupied Carrels}}{\text{Total Capacity}}$",
     "Models arrival rates and queue congestion during examination hours.",
     5.5, '#FAF3E8', '#C2923D'),

    ("3. Catalog Discovery Failure Rate",
     r"$P(\text{Zero Matches}) = \frac{\text{Failed Queries}}{\text{Total Search Queries}}$",
     "Quantifies keyword search rigidity versus TF-IDF semantic recall.",
     3.0, '#FBEBE8', '#9E5D3B'),

    ("4. Data Collection Status Note",
     "Methodology Established: Formulas & frameworks ready for campus deployment.",
     "Institutional survey administration protocol prepared for empirical logging.",
     0.5, '#F5F2EB', '#5E6660')
]

for title, formula, desc, y_pos, bg, border_col in stat_boxes:
    box = patches.FancyBboxPatch((0.2, y_pos), 9.6, 2.0, boxstyle='round,pad=0.08', facecolor=bg, edgecolor=border_col, lw=1.2)
    ax2.add_patch(box)
    ax2.text(0.45, y_pos + 1.5, title, fontsize=8.2, fontweight='bold', color=border_col)
    ax2.text(0.45, y_pos + 0.95, formula, fontsize=7.8, fontweight='bold', color='#1E3A2F')
    ax2.text(0.45, y_pos + 0.35, desc, fontsize=7.2, color='#4A3B32')

plt.tight_layout()
plt.savefig('frontend/public/presentation_assets/chart_slide6_stats.png', facecolor=fig.get_facecolor(), bbox_inches='tight')
plt.close()
print('Chart 6 (Corrected Statistical Formulas & Framework) generated')

# -------------------------------------------------------------
# DIAGRAM 2: Problem Tree Analysis (Slide 7)
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(11.5, 4.4), dpi=220)
fig.patch.set_facecolor('#FAF8F5')
ax.set_facecolor('#FAF8F5')
ax.set_xlim(0, 11)
ax.set_ylim(0, 4.4)
ax.axis('off')

# Section Labels
ax.text(0.3, 3.85, 'EFFECTS (Canopy & Consequences)', fontsize=9.5, fontweight='bold', color='#9E5D3B')
ax.text(0.3, 2.25, 'CORE PROBLEM (Trunk)', fontsize=9.5, fontweight='bold', color='#1E3A2F')
ax.text(0.3, 0.65, 'ROOT CAUSES (Roots)', fontsize=9.5, fontweight='bold', color='#527362')

effects = [
    ('Unproductive Search', 'Students waste study time\nsearching empty shelves'),
    ('Seat Disputes', 'Conflicts over ghost-saved\nand unreserved carrels'),
    ('Catalog Inefficiency', 'Archival titles underutilized\ndue to keyword rigidity'),
    ('Staff Fatigue', 'Circulation staff burdened\nwith manual inquiries')
]
for i, (title, desc) in enumerate(effects):
    x = 1.9 + i * 2.25
    rect = patches.FancyBboxPatch((x, 3.1), 2.05, 1.05, boxstyle='round,pad=0.08', facecolor='#FBEBE8', edgecolor='#E0AFA0', lw=1.4)
    ax.add_patch(rect)
    ax.text(x + 1.02, 3.85, title, fontsize=8.5, fontweight='bold', color='#9E5D3B', ha='center', va='center')
    ax.text(x + 1.02, 3.45, desc, fontsize=7.3, color='#4A3B32', ha='center', va='center')
    ax.annotate('', xy=(x + 1.02, 3.08), xytext=(5.5, 2.5),
                arrowprops=dict(arrowstyle='->', color='#C2923D', lw=1.2, linestyle='--'))

core_rect = patches.FancyBboxPatch((2.0, 1.8), 7.0, 0.85, boxstyle='round,pad=0.1', facecolor='#1E3A2F', edgecolor='#13241D', lw=2)
ax.add_patch(core_rect)
ax.text(5.5, 2.32, 'CORE PROBLEM: Disjointed Physical-to-Digital Library Navigation', fontsize=10.5, fontweight='bold', color='#FFFFFF', ha='center', va='center')
ax.text(5.5, 2.0, 'Traditional library software lacks spatial coordinates, concurrency controls, and conceptual discovery.', fontsize=7.8, color='#DCE4DC', ha='center', va='center')

roots = [
    ('Macro-Level Dewey Only', 'No micro-spatial shelf,\naisle, or rack coordinates'),
    ('No Concurrency Locks', 'Asynchronous seat reservation\ncauses race conditions'),
    ('Exact-Match SQL Search', 'Query engine fails when\nexact title is unknown'),
    ('Disconnected Ledgers', 'Siloed circulation logs\nand manual paper tracking')
]
for i, (title, desc) in enumerate(roots):
    x = 1.9 + i * 2.25
    rect = patches.FancyBboxPatch((x, 0.15), 2.05, 1.05, boxstyle='round,pad=0.08', facecolor='#EBF2ED', edgecolor='#A3C1AD', lw=1.4)
    ax.add_patch(rect)
    ax.text(x + 1.02, 0.9, title, fontsize=8.5, fontweight='bold', color='#1E3A2F', ha='center', va='center')
    ax.text(x + 1.02, 0.5, desc, fontsize=7.3, color='#2B3D33', ha='center', va='center')
    ax.annotate('', xy=(5.5, 1.78), xytext=(x + 1.02, 1.22),
                arrowprops=dict(arrowstyle='->', color='#527362', lw=1.2, linestyle='--'))

plt.tight_layout()
plt.savefig('frontend/public/presentation_assets/diagram_slide7_problem_tree.png', facecolor=fig.get_facecolor(), bbox_inches='tight')
plt.close()
print('Diagram 7 (Problem Tree) generated')

# -------------------------------------------------------------
# DIAGRAM 3: System Architecture Overview (Slide 3)
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(11.5, 4.4), dpi=220)
fig.patch.set_facecolor('#FAF8F5')
ax.set_facecolor('#FAF8F5')
ax.set_xlim(0, 11)
ax.set_ylim(0, 4.4)
ax.axis('off')

# Tier 1
t1_bg = patches.FancyBboxPatch((0.4, 3.0), 10.2, 1.15, boxstyle='round,pad=0.08', facecolor='#FFFFFF', edgecolor='#D9D3C7', lw=1.5)
ax.add_patch(t1_bg)
ax.text(0.7, 3.88, 'TIER 1: CLIENT PRESENTATION LAYER (React 19 + Vite 8 SPA)', fontsize=8.5, fontweight='bold', color='#1E3A2F')
clients = [
    ('Public Sanctuary', 'Catalog Search & Coordinates'),
    ('Patron Folio', 'Loans, Wishlists & Returns'),
    ('Circulation Desk', 'Barcode Lookup & Hold Queues'),
    ('Admin Console', 'System Governance & Audits')
]
for i, (title, sub) in enumerate(clients):
    x = 0.7 + i * 2.45
    r = patches.FancyBboxPatch((x, 3.12), 2.25, 0.65, boxstyle='round,pad=0.06', facecolor='#FAF8F5', edgecolor='#8CA899', lw=1.2)
    ax.add_patch(r)
    ax.text(x + 1.12, 3.55, title, fontsize=8, fontweight='bold', color='#1E3A2F', ha='center')
    ax.text(x + 1.12, 3.28, sub, fontsize=6.8, color='#5E6660', ha='center')

for x_arr in [1.8, 4.25, 6.7, 9.15]:
    ax.annotate('', xy=(x_arr, 2.76), xytext=(x_arr, 2.98),
                arrowprops=dict(arrowstyle='<->', color='#C2923D', lw=1.5))

# Tier 2
t2_bg = patches.FancyBboxPatch((0.4, 1.55), 10.2, 1.15, boxstyle='round,pad=0.08', facecolor='#FAF8F5', edgecolor='#1E3A2F', lw=1.5)
ax.add_patch(t2_bg)
ax.text(0.7, 2.43, 'TIER 2: APPLICATION & SERVICE CONTROLLERS (Node.js + Express 5 REST API)', fontsize=8.5, fontweight='bold', color='#1E3A2F')
services = [
    ('Spatial Navigator', '4-Tier Floor/Aisle Engine'),
    ('Atomic Pod Locker', 'Partial Unique Index Locks'),
    ('FIFO Waitlist Engine', 'Automated 48h Pickup Queue'),
    ('Two-Tier Penalty', 'Polite Warning & QR Fines')
]
for i, (title, sub) in enumerate(services):
    x = 0.7 + i * 2.45
    r = patches.FancyBboxPatch((x, 1.67), 2.25, 0.65, boxstyle='round,pad=0.06', facecolor='#FFFFFF', edgecolor='#1E3A2F', lw=1.2)
    ax.add_patch(r)
    ax.text(x + 1.12, 2.1, title, fontsize=8, fontweight='bold', color='#1E3A2F', ha='center')
    ax.text(x + 1.12, 1.83, sub, fontsize=6.8, color='#5E6660', ha='center')

for x_arr in [1.8, 4.25, 6.7, 9.15]:
    ax.annotate('', xy=(x_arr, 1.32), xytext=(x_arr, 1.53),
                arrowprops=dict(arrowstyle='<->', color='#527362', lw=1.5))

# Tier 3
t3_bg = patches.FancyBboxPatch((0.4, 0.12), 10.2, 1.15, boxstyle='round,pad=0.08', facecolor='#1E3A2F', edgecolor='#13241D', lw=1.5)
ax.add_patch(t3_bg)
ax.text(0.7, 1.02, 'TIER 3: PERSISTENCE LAYER & PROPOSED PYTHON AI SERVICE', fontsize=8.5, fontweight='bold', color='#DCE4DC')
data_engines = [
    ('SQLite Database (WAL)', 'High-concurrency ACID store'),
    ('TF-IDF Vector Space', 'In-memory NLP embedding'),
    ('Cosine Similarity Match', 'Sub-15ms conceptual scoring'),
    ('Python AI Service Bridge', 'Proposed ML recommendation worker')
]
for i, (title, sub) in enumerate(data_engines):
    x = 0.7 + i * 2.45
    r = patches.FancyBboxPatch((x, 0.24), 2.25, 0.65, boxstyle='round,pad=0.06', facecolor='#264435', edgecolor='#8CA899', lw=1.2)
    ax.add_patch(r)
    ax.text(x + 1.12, 0.67, title, fontsize=8, fontweight='bold', color='#FFFFFF', ha='center')
    ax.text(x + 1.12, 0.4, sub, fontsize=6.8, color='#DCE4DC', ha='center')

plt.tight_layout()
plt.savefig('frontend/public/presentation_assets/diagram_slide3_system_overview.png', facecolor=fig.get_facecolor(), bbox_inches='tight')
plt.close()
print('Diagram 3 (System Overview) generated')

# -------------------------------------------------------------
# DIAGRAM 4: Idea Selection & Feasibility Matrix (Slide 9)
# -------------------------------------------------------------
fig, (ax_matrix, ax_swot) = plt.subplots(1, 2, figsize=(11.5, 4.4), dpi=220)
fig.patch.set_facecolor('#FAF8F5')

# Left: 2x2 Feasibility vs Impact Matrix
ax_matrix.set_facecolor('#FAF8F5')
ax_matrix.set_xlim(0, 10)
ax_matrix.set_ylim(0, 10)
ax_matrix.axhline(5, color='#D9D3C7', linestyle='--', lw=1.5)
ax_matrix.axvline(5, color='#D9D3C7', linestyle='--', lw=1.5)

ax_matrix.text(7.5, 9.4, 'HIGH IMPACT / HIGH FEASIBILITY', fontsize=7.5, fontweight='bold', color='#1E3A2F', ha='center')
ax_matrix.text(7.5, 9.0, '★ Selected & Implemented in Core System', fontsize=7, fontweight='bold', color='#9E5D3B', ha='center')
ax_matrix.text(2.5, 9.4, 'HIGH IMPACT / LOWER FEASIBILITY', fontsize=7.5, fontweight='bold', color='#5E6660', ha='center')
ax_matrix.text(2.5, 9.0, '► Proposed Future Research Scope', fontsize=7, color='#5E6660', ha='center')

points = [
    (8.2, 8.2, '4-Tier Spatial Coordinates', '#1E3A2F', True),
    (7.8, 7.3, 'Atomic Seat Concurrency Locks', '#1E3A2F', True),
    (7.0, 6.2, 'TF-IDF Vector Search Engine', '#1E3A2F', True),
    (6.5, 5.4, 'Two-Tier Return Notice & QR Fines', '#1E3A2F', True),
    (2.8, 8.5, 'Dense Neural Transformers (BERT)', '#527362', False),
    (2.2, 7.0, 'Physical IoT Seat Sensors', '#527362', False),
    (7.5, 2.8, 'Email/SMS OTP Gateway', '#6B705C', False),
    (2.0, 2.0, 'Robotic Stack Retrievers (Discarded)', '#9E5D3B', False)
]
for px, py, plabel, pcol, is_sel in points:
    pmarker = 'o' if is_sel else 's'
    ax_matrix.scatter(px, py, color=pcol, s=70, zorder=5, marker=pmarker, edgecolors='#FFFFFF', linewidth=1)
    ax_matrix.text(px + 0.25, py - 0.15, plabel, fontsize=7.2, fontweight='bold' if is_sel else 'normal', color=pcol)

ax_matrix.set_xlabel('Technical Feasibility (Ease of Implementation) →', fontsize=8.2, color='#1E3A2F')
ax_matrix.set_ylabel('Patron & Operational Impact →', fontsize=8.2, color='#1E3A2F')
ax_matrix.set_title('Idea Selection Matrix (MCDA Evaluation)', fontsize=9.5, fontweight='bold', color='#1E3A2F', pad=8)
for spine in ax_matrix.spines.values():
    spine.set_color('#D9D3C7')

# Right: SWOT Grid
ax_swot.set_facecolor('#FAF8F5')
ax_swot.set_xlim(0, 10)
ax_swot.set_ylim(0, 10)
ax_swot.axis('off')
ax_swot.set_title('LibraMind Academic SWOT Analysis', fontsize=9.5, fontweight='bold', color='#1E3A2F', pad=8)

swot_data = [
    ('STRENGTHS (S)', ['Full-stack operational prototype', 'ACID atomic seat locks (zero race conditions)', 'Sub-15ms TF-IDF semantic search latency', 'Human-centered biophilic design tokens'], 0.2, 5.1, '#EBF2ED', '#1E3A2F'),
    ('WEAKNESSES (W)', ['Requires initial physical shelf coordinate tagging', 'Web browser reliance inside stacks', 'TF-IDF vocabulary bounded by catalog corpus', 'Single-server SQLite architecture scope'], 5.1, 5.1, '#FBEBE8', '#9E5D3B'),
    ('OPPORTUNITIES (O)', ['Native Android/iOS mobile application', 'Camera spine barcode recognition via OpenCV', 'Predictive exam-demand ML forecasting', 'University RFID ID card integration'], 0.2, 0.2, '#FAF3E8', '#C2923D'),
    ('THREATS (T)', ['Student loan history privacy regulations', 'Campus Wi-Fi connectivity blackspots in stacks', 'Resistance to mobile fine payments', 'Database concurrency limits across multiple campuses'], 5.1, 0.2, '#F2EFE9', '#5E6660')
]
for title, bullets, x, y, bg_col, text_col in swot_data:
    r = patches.FancyBboxPatch((x, y), 4.7, 4.6, boxstyle='round,pad=0.1', facecolor=bg_col, edgecolor=text_col, lw=1.2)
    ax_swot.add_patch(r)
    ax_swot.text(x + 0.25, y + 4.15, title, fontsize=8.5, fontweight='bold', color=text_col)
    for b_idx, bullet in enumerate(bullets):
        ax_swot.text(x + 0.25, y + 3.4 - b_idx * 0.95, f'• {bullet}', fontsize=7.2, color='#222824')

plt.tight_layout()
plt.savefig('frontend/public/presentation_assets/diagram_slide9_selection.png', facecolor=fig.get_facecolor(), bbox_inches='tight')
plt.close()
print('Diagram 9 (Selection & SWOT) generated')

# -------------------------------------------------------------
# DIAGRAM 5: Ideation Pillars (Slide 8)
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(11.5, 4.4), dpi=220)
fig.patch.set_facecolor('#FAF8F5')
ax.set_facecolor('#FAF8F5')
ax.set_xlim(0, 11)
ax.set_ylim(0, 4.4)
ax.axis('off')

hub = patches.FancyBboxPatch((4.2, 1.65), 2.6, 1.1, boxstyle='round,pad=0.1', facecolor='#1E3A2F', edgecolor='#13241D', lw=2)
ax.add_patch(hub)
ax.text(5.5, 2.35, 'LIBRAMIND IDEATION', fontsize=9.5, fontweight='bold', color='#FFFFFF', ha='center')
ax.text(5.5, 2.05, 'Multidisciplinary\nEngineering Solutions', fontsize=7.8, color='#DCE4DC', ha='center')
ax.text(5.5, 1.77, 'Design Thinking Stage 3', fontsize=6.8, color='#C2923D', ha='center')

pillars = [
    ('1. PYTHON & MACHINE LEARNING',
     ['• TF-IDF Vector Space Embeddings', '• Cosine Similarity Matrix (sub-15ms)', '• Transparent Keyword Token Highlights', '• Scikit-Learn research topic clusters'],
     0.3, 2.35, '#EBF2ED', '#1E3A2F', (4.2, 2.4)),

    ('2. PROBABILITY & STATISTICS',
     ['• Gaussian retrieval distributions N(μ, σ²)', '• Peak carrel occupancy probability P(Occ)', '• Exponential hazard decay for loan durations', '• FIFO waitlist queueing theory modeling'],
     5.9, 2.35, '#FAF3E8', '#C2923D', (6.8, 2.4)),

    ('3. SPATIAL & GRAPH ROUTING',
     ['• 4-Tier Coordinate (Floor-Section-Shelf-Rack)', '• Barcode-level physical copy tracking', '• Stack Visit Planner route grouping', '• Aisle-level spatial orientation cues'],
     0.3, 0.25, '#F2EFE9', '#5E6660', (4.2, 2.0)),

    ('4. CONCURRENCY & INTEGRITY',
     ['• SQLite Partial Unique Indexes for seats', '• Zero double-booking concurrency locks', '• Write-Ahead Logging (WAL) concurrency', '• Two-tier polite return & penalty lifecycle'],
     5.9, 0.25, '#FBEBE8', '#9E5D3B', (6.8, 2.0))
]

for title, bullets, x, y, bg_col, text_col, arrow_target in pillars:
    card = patches.FancyBboxPatch((x, y), 4.8, 1.8, boxstyle='round,pad=0.08', facecolor=bg_col, edgecolor=text_col, lw=1.3)
    ax.add_patch(card)
    ax.text(x + 0.2, y + 1.55, title, fontsize=8.2, fontweight='bold', color=text_col)
    for b_idx, b in enumerate(bullets):
        ax.text(x + 0.25, y + 1.25 - b_idx * 0.34, b, fontsize=7.1, color='#222824')
    ax.annotate('', xy=arrow_target, xytext=(x + (4.8 if x < 4 else 0), y + 0.9),
                arrowprops=dict(arrowstyle='-', color=text_col, lw=1.2, linestyle=':'))

plt.tight_layout()
plt.savefig('frontend/public/presentation_assets/diagram_slide8_ideation.png', facecolor=fig.get_facecolor(), bbox_inches='tight')
plt.close()
print('Diagram 8 (Ideation) generated')

# -------------------------------------------------------------
# DIAGRAM 6: Prototype Modules & Python AI Bridge (Slide 10)
# -------------------------------------------------------------
fig, (ax_ui, ax_ai) = plt.subplots(1, 2, figsize=(11.5, 4.4), dpi=220)
fig.patch.set_facecolor('#FAF8F5')

ax_ui.set_facecolor('#FAF8F5')
ax_ui.set_xlim(0, 10)
ax_ui.set_ylim(0, 10)
ax_ui.axis('off')
ax_ui.set_title('LibraMind Operational Prototype (Implemented Modules)', fontsize=9.5, fontweight='bold', color='#1E3A2F', pad=8)

ui_cards = [
    ('1. PUBLIC CATALOG SANCTUARY', ['• Dynamic randomized book showcase', '• 4-Tier shelf coordinates (Floor/Aisle)', '• Real-time stack inventory availability'], 0.2, 5.1, '#FFFFFF', '#1E3A2F'),
    ('2. PATRON FOLIO (STUDENT)', ['• Active borrowed copy barcodes', '• Saved Desiderata & Reading Wishlist', '• 2-tier polite return notice banners'], 5.1, 5.1, '#FFFFFF', '#527362'),
    ('3. CIRCULATION DESK (LIBRARIAN)', ['• Copy barcode auto-matched patron', '• Waiting users & FIFO hold queues', '• Two-tier penalty & QR issue controls'], 0.2, 0.2, '#FFFFFF', '#9E5D3B'),
    ('4. STUDY POD CONCURRENCY MATRIX', ['• 40 biophilic desk carrels across 3 floors', '• Atomic SQLite partial unique indexes', '• Zero double-booking concurrency guarantee'], 5.1, 0.2, '#FFFFFF', '#C2923D')
]
for title, points, x, y, bg_col, border_col in ui_cards:
    r = patches.FancyBboxPatch((x, y), 4.7, 4.6, boxstyle='round,pad=0.1', facecolor=bg_col, edgecolor=border_col, lw=1.3)
    ax_ui.add_patch(r)
    ax_ui.text(x + 0.25, y + 4.15, title, fontsize=7.8, fontweight='bold', color=border_col)
    for p_idx, p in enumerate(points):
        ax_ui.text(x + 0.25, y + 3.4 - p_idx * 1.0, p, fontsize=7.1, color='#222824')

ax_ai.set_facecolor('#FAF8F5')
ax_ai.set_xlim(0, 10)
ax_ai.set_ylim(0, 10)
ax_ai.axis('off')
ax_ai.set_title('Node.js Backend & Proposed Python AI Bridge', fontsize=9.5, fontweight='bold', color='#1E3A2F', pad=8)

ai_steps = [
    ('NODE.JS CLIENT REQUEST', 'Express API receives search query (e.g. "cloud infrastructure")', 8.2, '#EBF2ED', '#1E3A2F'),
    ('PYTHON AI MICROSERVICE', 'Spawns Python NLP worker / HTTP microservice bridge', 6.2, '#FAF3E8', '#C2923D'),
    ('SCIKIT-LEARN TF-IDF ENGINE', 'Computes in-memory vector embeddings over catalog abstracts', 4.2, '#EBF2ED', '#1E3A2F'),
    ('COSINE SIMILARITY SCORING', 'Ranks book relevance scores in under 15ms', 2.2, '#FAF3E8', '#C2923D'),
    ('EXPLAINABLE OUTPUT TO UI', 'Returns ranked matches with transparent keyword token highlights', 0.2, '#1E3A2F', '#FFFFFF')
]
for step_name, desc, y_pos, bg, fg in ai_steps:
    box = patches.FancyBboxPatch((0.5, y_pos), 9.0, 1.5, boxstyle='round,pad=0.08', facecolor=bg, edgecolor='#1E3A2F', lw=1.2)
    ax_ai.add_patch(box)
    ax_ai.text(5.0, y_pos + 1.05, step_name, fontsize=8.2, fontweight='bold', color=fg if fg != '#FFFFFF' else '#DCE4DC', ha='center')
    ax_ai.text(5.0, y_pos + 0.45, desc, fontsize=7.2, color=fg if fg == '#FFFFFF' else '#222824', ha='center')
    if y_pos > 0.5:
        ax_ai.annotate('', xy=(5.0, y_pos - 0.05), xytext=(5.0, y_pos + 0.1),
                       arrowprops=dict(arrowstyle='->', color='#1E3A2F', lw=1.2))

plt.tight_layout()
plt.savefig('frontend/public/presentation_assets/diagram_slide10_prototype.png', facecolor=fig.get_facecolor(), bbox_inches='tight')
plt.close()
print('Diagram 10 (Prototype & Python AI Bridge) generated')
