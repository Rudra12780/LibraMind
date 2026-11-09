import os
os.environ['MPLCONFIGDIR'] = 'C:/Users/ADMIN/AppData/Local/Temp'
import matplotlib.pyplot as plt
import matplotlib.patches as patches

fig, (ax_ui, ax_ai) = plt.subplots(1, 2, figsize=(11, 4.3), dpi=220)
fig.patch.set_facecolor('#FAF8F5')

# Left: 4 Core Prototype Portals
ax_ui.set_facecolor('#FAF8F5')
ax_ui.set_xlim(0, 10)
ax_ui.set_ylim(10)
ax_ui.axis('off')
ax_ui.set_title('LibraMind Operational Full-Stack Prototype Modules', fontsize=9.5, fontweight='bold', color='#1E3A2F', pad=8)

ui_cards = [
    ('1. PUBLIC EDITORIAL SANCTUARY', ['• Dynamic randomized book showcase', '• 4-Tier shelf coordinates (Floor/Aisle)', '• Real-time stack inventory availability'], 0.2, 5.1, '#FFFFFF', '#1E3A2F'),
    ('2. PATRON FOLIO (STUDENT)', ['• Active borrowed copy barcodes', '• Saved Desiderata & Reading Wishlist', '• 2-way polite return notice banners'], 5.1, 5.1, '#FFFFFF', '#527362'),
    ('3. CIRCULATION DESK (LIBRARIAN)', ['• Copy barcode auto-matched patron', '• Waiting users & FIFO hold queues', '• Two-tier penalty & QR issue controls'], 0.2, 0.2, '#FFFFFF', '#9E5D3B'),
    ('4. STUDY POD CONCURRENCY MATRIX', ['• 40 biophilic desk carrels across 3 floors', '• Atomic SQLite partial unique indexes', '• Zero double-booking concurrency guarantee'], 5.1, 0.2, '#FFFFFF', '#C2923D')
]
for title, points, x, y, bg_col, border_col in ui_cards:
    r = patches.FancyBboxPatch((x, y), 4.7, 4.6, boxstyle='round,pad=0.1', facecolor=bg_col, edgecolor=border_col, lw=1.3)
    ax_ui.add_patch(r)
    ax_ui.text(x + 0.25, y + 4.15, title, fontsize=7.8, fontweight='bold', color=border_col)
    for p_idx, p in enumerate(points):
        ax_ui.text(x + 0.25, y + 3.4 - p_idx * 1.0, p, fontsize=7.1, color='#222824')

# Right: Proposed Python AI Module Architecture
ax_ai.set_facecolor('#FAF8F5')
ax_ai.set_xlim(0, 10)
ax_ai.set_ylim(0, 10)
ax_ai.axis('off')
ax_ai.set_title('Proposed Python AI Engine Architecture', fontsize=9.5, fontweight='bold', color='#1E3A2F', pad=8)

ai_steps = [
    ('INPUT LAYER', 'Natural Language User Query (e.g. "scalable cloud backend")', 8.2, '#EBF2ED', '#1E3A2F'),
    ('PREPROCESSING', 'NLTK Tokenizer, Stopword Removal, Lemmatization', 6.2, '#FAF3E8', '#C2923D'),
    ('VECTORIZATION', 'Scikit-Learn TF-IDF In-Memory Matrix (N-Grams 1-2)', 4.2, '#EBF2ED', '#1E3A2F'),
    ('SIMILARITY ENGINE', 'Cosine Similarity Calculation vs. 120k Book Corpus', 2.2, '#FAF3E8', '#C2923D'),
    ('EXPLAINABLE AI OUTPUT', 'Top Ranked Titles + Matched Keyword Token Highlights', 0.2, '#1E3A2F', '#FFFFFF')
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
os.makedirs('frontend/public/presentation_assets', exist_ok=True)
plt.savefig('frontend/public/presentation_assets/diagram_slide10_prototype.png', facecolor=fig.get_facecolor(), bbox_inches='tight')
plt.close()
print('Diagram 10 (Prototype & Python AI) generated')

