with open('frontend/src/data/visualBlueprints.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update wrapPageSVG definition and return statement
old_start = 'function wrapPageSVG({\n  pageNumber,\n  pageTotal = 21,\n  pageTitle,\n  pageRoute,\n  activeNavIndex = 0,\n  content\n}) {\n  return `<svg xmlns="http://www.w3.org/2000/svg"'

new_start = '''function wrapPageSVG({
  pageNumber,
  pageTotal = 21,
  pageTitle,
  pageRoute,
  activeNavIndex = 0,
  content
}) {
  const safeTitle = (pageTitle || '').toUpperCase().replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\\d+;|#x[0-9a-fA-F]+;)/g, '&amp;');
  const rawSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"'''

text = text.replace(old_start, new_start, 1)

# In wrapPageSVG, replace ${pageTitle.toUpperCase()} with ${safeTitle}
old_title_line = '<text x="490" y="26" font-size="10.5" fill="#555555">PAGE ${pageNumber} OF ${pageTotal}: ${pageTitle.toUpperCase()} · PORTRAIT</text>'
new_title_line = '<text x="490" y="26" font-size="10.5" fill="#555555">PAGE ${pageNumber} OF ${pageTotal}: ${safeTitle} · PORTRAIT</text>'
text = text.replace(old_title_line, new_title_line, 1)

# In wrapPageSVG, replace return `<svg ... </svg>`; with return rawSvg.replace(...)
old_end = '      <rect x="330" y="105" width="200" height="7" rx="3" fill="#999999" />\n    </g>\n  </g>\n</svg>`;\n}'
new_end = '''      <rect x="330" y="105" width="200" height="7" rx="3" fill="#999999" />
    </g>
  </g>
</svg>`;
  return rawSvg.replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\\d+;|#x[0-9a-fA-F]+;)/g, '&amp;');
}'''
text = text.replace(old_end, new_end, 1)

with open('frontend/src/data/visualBlueprints.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated wrapPageSVG in visualBlueprints.js successfully!")

