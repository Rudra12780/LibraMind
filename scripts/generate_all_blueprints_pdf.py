npm run dev """
LibraMind - Generate All 21 Blueprints as a Single Downloadable PDF
Creates:
1. Multi-page consolidated PDF with all 21 pages (clean vector quality, full UI blueprints).
2. All-in-One single page composite overview PDF (matrix grid of all 21 pages on 1 page).
3. Design Thinking Wireframe Photo PDF (from libramind-design-thinking-wireframe.jpg).
Places outputs in root, backend/uploads, and frontend/public.
"""

import os
import glob
import re
import shutil
import pymupdf
from PIL import Image

def get_fixed_svg_bytes(svg_path):
    with open(svg_path, 'r', encoding='utf-8') as f:
        svg_content = f.read()
    
    # Crucial fix: PyMuPDF treats height="auto" as 0, which previously rendered blank pages!
    # Replace width="100%" height="auto" with explicit dimensions width="920" height="1520"
    fixed_svg = re.sub(r'width="100%"\s+height="auto"', 'width="920" height="1520"', svg_content)
    if 'viewBox="0 0 920 1520"' not in fixed_svg:
        fixed_svg = fixed_svg.replace('<svg ', '<svg viewBox="0 0 920 1520" ')
    
    return fixed_svg.encode('utf-8')

def generate_blueprints_pdf():
    blueprints_dir = "offline_blueprints"
    svg_files = sorted(glob.glob(os.path.join(blueprints_dir, "*_Blueprint.svg")))
    
    print(f"Found {len(svg_files)} blueprint SVG files:")
    for f in svg_files:
        print(f"  - {os.path.basename(f)}")
        
    if len(svg_files) != 21:
        print(f"Warning: Expected 21 SVG files, found {len(svg_files)}")

    # -------------------------------------------------------------
    # 1. Multi-Page Consolidated PDF (All 21 pages in 1 document)
    # -------------------------------------------------------------
    combined_doc = pymupdf.open()
    
    for idx, svg_path in enumerate(svg_files):
        svg_bytes = get_fixed_svg_bytes(svg_path)
        svg_doc = pymupdf.open(stream=svg_bytes, filetype="svg")
        pdf_bytes = svg_doc.convert_to_pdf()
        svg_doc.close()
        
        page_pdf = pymupdf.open("pdf", pdf_bytes)
        combined_doc.insert_pdf(page_pdf)
        page_pdf.close()
        print(f"Appended page {idx + 1}/{len(svg_files)}: {os.path.basename(svg_path)}")
        
    output_multipage = "LibraMind_Complete_21_Architectural_Blueprints.pdf"
    combined_doc.save(output_multipage)
    combined_doc.close()
    print(f"\n[1] Saved 21-page combined PDF: {output_multipage} ({os.path.getsize(output_multipage)} bytes)")

    # -------------------------------------------------------------
    # 2. All-in-One Single Page Composite PDF (All 21 on ONE giant page)
    # -------------------------------------------------------------
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

    single_page_doc = pymupdf.open()
    page = single_page_doc.new_page(width=total_w, height=total_h)

    # Header banner
    header_rect = pymupdf.Rect(margin_side, 30, total_w - margin_side, 120)
    page.draw_rect(header_rect, color=(0.08, 0.14, 0.11), fill=(0.08, 0.14, 0.11))
    
    page.insert_text(
        pymupdf.Point(margin_side + 30, 70),
        "LIBRAMIND LMS — COMPLETE 21-PAGE ARCHITECTURAL UI WIREFRAME BLUEPRINT",
        fontsize=28,
        fontname="helv",
        color=(1, 1, 1)
    )
    page.insert_text(
        pymupdf.Point(margin_side + 30, 102),
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
        rect = pymupdf.Rect(x0, y0, x1, y1)
        
        svg_bytes = get_fixed_svg_bytes(svg_path)
        svg_doc = pymupdf.open(stream=svg_bytes, filetype="svg")
        pdf_bytes = svg_doc.convert_to_pdf()
        svg_doc.close()
        
        temp_pdf = pymupdf.open("pdf", pdf_bytes)
        page.show_pdf_page(rect, temp_pdf, 0)
        temp_pdf.close()
        print(f"Placed grid item {idx + 1}/21 at col {c + 1}, row {r + 1}")

    output_onepage = "LibraMind_All_In_One_Page_Composite_Blueprint.pdf"
    single_page_doc.save(output_onepage)
    single_page_doc.close()
    print(f"\n[2] Saved all-in-one single-page PDF: {output_onepage} ({os.path.getsize(output_onepage)} bytes)")

    # -------------------------------------------------------------
    # 3. Design Thinking Wireframe Photo PDF
    # -------------------------------------------------------------
    output_photo_pdf = "LibraMind_Design_Thinking_Wireframe.pdf"
    jpg_path = "libramind-design-thinking-wireframe.jpg"
    if os.path.exists(jpg_path):
        photo_doc = pymupdf.open()
        img = Image.open(jpg_path)
        img_w, img_h = img.size
        photo_page = photo_doc.new_page(width=img_w, height=img_h)
        photo_rect = pymupdf.Rect(0, 0, img_w, img_h)
        photo_page.insert_image(photo_rect, filename=jpg_path)
        photo_doc.save(output_photo_pdf)
        photo_doc.close()
        print(f"\n[3] Saved Design Thinking Wireframe Photo PDF: {output_photo_pdf} ({os.path.getsize(output_photo_pdf)} bytes)")

    # -------------------------------------------------------------
    # 4. Verify Content & Check for Blank Pages
    # -------------------------------------------------------------
    print("\n--- Verifying Multi-Page PDF Pages ---")
    chk_doc = pymupdf.open(output_multipage)
    for i in range(len(chk_doc)):
        p = chk_doc[i]
        pix = p.get_pixmap()
        non_white = sum(1 for b in pix.samples if b < 240)
        print(f"  Page {i+1}: {pix.width}x{pix.height}, non-white samples={non_white}")
        assert non_white > 10000, f"Page {i+1} is suspiciously blank!"
    chk_doc.close()

    print("\n--- Verifying Composite One-Page PDF ---")
    chk_comp = pymupdf.open(output_onepage)
    p_comp = chk_comp[0]
    pix_comp = p_comp.get_pixmap(matrix=pymupdf.Matrix(0.2, 0.2))
    non_white_comp = sum(1 for b in pix_comp.samples if b < 240)
    print(f"  Composite Page: {p_comp.rect.width}x{p_comp.rect.height}, non-white samples={non_white_comp}")
    assert non_white_comp > 100000, "Composite page is suspiciously blank!"
    chk_comp.close()

    # -------------------------------------------------------------
    # 5. Copy to distribution directories
    # -------------------------------------------------------------
    dest_dirs = ["backend/uploads", "frontend/public"]
    for d in dest_dirs:
        os.makedirs(d, exist_ok=True)
        shutil.copy2(output_multipage, os.path.join(d, output_multipage))
        shutil.copy2(output_onepage, os.path.join(d, output_onepage))
        shutil.copy2(output_multipage, os.path.join(d, "LibraMind_Blueprints.pdf"))
        if os.path.exists(output_photo_pdf):
            shutil.copy2(output_photo_pdf, os.path.join(d, output_photo_pdf))
        print(f"Copied all verified PDFs to {d}/")

    print("\n✅ All PDF files generated, visually verified, and distributed successfully!")

if __name__ == "__main__":
    generate_blueprints_pdf()
