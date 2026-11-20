import fitz
import os
import re

with open('offline_blueprints/01_LibraMind_Landing_Sanctuary_Blueprint.svg', 'r', encoding='utf-8') as f:
    svg_text = f.read()

# Replace width="100%" height="auto" with width="920" height="1520"
fixed_svg = re.sub(r'width="100%"\s+height="auto"', 'width="920" height="1520"', svg_text)

doc = fitz.open(stream=fixed_svg.encode('utf-8'), filetype='svg')
page = doc[0]
print('Page rect:', page.rect)

pdf_bytes = doc.convert_to_pdf()
pdf_doc = fitz.open('pdf', pdf_bytes)
print('PDF rect:', pdf_doc[0].rect)

pix = pdf_doc[0].get_pixmap()
print('Pix size:', pix.width, pix.height)

non_white = sum(1 for b in pix.samples if b < 240)
print('Non-white count:', non_white)

pix.save('scratch/fixed_svg_test.png')
print('Saved! Size:', os.path.getsize('scratch/fixed_svg_test.png'))

