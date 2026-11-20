import os
import glob
import re
import fitz

blueprints_dir = "offline_blueprints"
svg_files = sorted(glob.glob(os.path.join(blueprints_dir, "*_Blueprint.svg")))

print(f"Found {len(svg_files)} blueprint SVG files.")

# 1. Multi-page document
combined_doc = fitz.open()

for idx, svg_path in enumerate(svg_files):
    with open(svg_path, 'r', encoding='utf-8') as f:
        svg_content = f.read()
    
    # Fix viewBox / width / height so PyMuPDF renders the full 920x1520 canvas
    fixed_svg = re.sub(r'width="100%"\s+height="auto"', 'width="920" height="1520"', svg_content)
    
    # Also ensure viewBox is present
    if 'viewBox="0 0 920 1520"' not in fixed_svg:
        fixed_svg = fixed_svg.replace('<svg ', '<svg viewBox="0 0 920 1520" ')
        
    svg_doc = fitz.open(stream=fixed_svg.encode('utf-8'), filetype='svg')
    pdf_bytes = svg_doc.convert_to_pdf()
    svg_doc.close()
    
    page_pdf = fitz.open("pdf", pdf_bytes)
    combined_doc.insert_pdf(page_pdf)
    page_pdf.close()

output_multipage = "LibraMind_Complete_21_Architectural_Blueprints.pdf"
combined_doc.save(output_multipage)
combined_doc.close()
print(f"Saved {output_multipage}")

# Verify every page of combined_doc has actual content!
doc_check = fitz.open(output_multipage)
print(f"Checking {len(doc_check)} pages of {output_multipage}...")
for i, page in enumerate(doc_check):
    pix = page.get_pixmap()
    non_white = sum(1 for b in pix.samples if b < 240)
    print(f"  Page {i+1} ({os.path.basename(svg_files[i])}): {pix.width}x{pix.height}, non_white={non_white}")
    if non_white < 5000:
        print(f"  --> WARNING: Page {i+1} appears empty!")
doc_check.close()

