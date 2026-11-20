import os
import glob
import re
import fitz

blueprints_dir = "offline_blueprints"
svg_files = sorted(glob.glob(os.path.join(blueprints_dir, "*_Blueprint.svg")))

print(f"Generating All-in-One Composite Blueprint for {len(svg_files)} files...")

cols = 3
rows = 7
page_w = 920
page_h = 1520
gap_x = 40
gap_y = 60
margin_top = 160
margin_side = 50
margin_bottom = 80

total_w = margin_side * 2 + cols * page_w + (cols - 1) * gap_x
total_h = margin_top + rows * page_h + (rows - 1) * gap_y + margin_bottom

single_page_doc = fitz.open()
page = single_page_doc.new_page(width=total_w, height=total_h)

# Header banner
header_rect = fitz.Rect(margin_side, 30, total_w - margin_side, 120)
page.draw_rect(header_rect, color=(0.08, 0.14, 0.11), fill=(0.08, 0.14, 0.11))

page.insert_text(
    fitz.Point(margin_side + 30, 70),
    "LIBRAMIND LMS — COMPLETE 21-PAGE ARCHITECTURAL UI WIREFRAME BLUEPRINT",
    fontsize=28,
    fontname="helv",
    color=(1, 1, 1)
)
page.insert_text(
    fitz.Point(margin_side + 30, 102),
    "ALL 21 SYSTEM PAGES ON ONE MASTER SHEET · DESIGN THINKING ARCHITECTURE SPECIFICATION",
    fontsize=16,
    fontname="helv",
    color=(0.76, 0.57, 0.24)
)

for idx, svg_path in enumerate(svg_files):
    r = idx // cols
    c = idx % cols
    
    x0 = margin_side + c * (page_w + gap_x)
    y0 = margin_top + r * (page_h + gap_y)
    x1 = x0 + page_w
    y1 = y0 + page_h
    rect = fitz.Rect(x0, y0, x1, y1)
    
    with open(svg_path, 'r', encoding='utf-8') as f:
        svg_content = f.read()
    fixed_svg = re.sub(r'width="100%"\s+height="auto"', 'width="920" height="1520"', svg_content)
    
    svg_doc = fitz.open(stream=fixed_svg.encode('utf-8'), filetype='svg')
    pdf_bytes = svg_doc.convert_to_pdf()
    svg_doc.close()
    
    temp_pdf = fitz.open("pdf", pdf_bytes)
    page.show_pdf_page(rect, temp_pdf, 0)
    temp_pdf.close()
    print(f"Placed item {idx + 1}/21: {os.path.basename(svg_path)} at ({x0}, {y0})")

output_composite = "LibraMind_All_In_One_Page_Composite_Blueprint.pdf"
single_page_doc.save(output_composite)
single_page_doc.close()
print(f"Saved {output_composite}")

# Verify pixel data of composite
doc_check = fitz.open(output_composite)
p = doc_check[0]
# Use zoom to check pixmap
matrix = fitz.Matrix(0.2, 0.2) # scale down for memory check
pix = p.get_pixmap(matrix=matrix)
non_white = sum(1 for b in pix.samples if b < 240)
print(f"Composite check: {pix.width}x{pix.height}, non_white={non_white}")
pix.save("scratch/composite_check.png")
doc_check.close()

