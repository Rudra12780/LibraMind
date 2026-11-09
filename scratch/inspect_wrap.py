import re

with open('frontend/src/data/visualBlueprints.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace wrapPageSVG implementation
old_wrap_pattern = r'function wrapPageSVG\(\{[\s\S]*?return `<svg xmlns="http://www.w3.org/2000/svg"[\s\S]*?<text x="490" y="26" font-size="10.5" fill="#555555">PAGE \$\{pageNumber\} OF \$\{pageTotal\}: \$\{pageTitle\.toUpperCase\(\)\} · PORTRAIT<\/text>'

# Let's inspect exact start of wrapPageSVG
start_marker = "function wrapPageSVG({"
end_marker = "return `<svg xmlns=\"http://www.w3.org/2000/svg\""

print("Found start_marker:", start_marker in text)
print("Found end_marker:", end_marker in text)

