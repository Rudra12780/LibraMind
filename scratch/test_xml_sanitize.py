import os
import re
import xml.etree.ElementTree as ET

def sanitize_svg(svg_text):
    # Ensure XML declaration
    text = svg_text.strip()
    if not text.startswith('<?xml'):
        text = '<?xml version="1.0" encoding="UTF-8"?>\n' + text
    
    # Replace unescaped & with &amp;
    # Regex: & not followed by valid XML entity
    text = re.sub(r'&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)', '&amp;', text)
    return text

# Test on offline_blueprints
d = 'offline_blueprints'
errors = []
successes = []

for f in sorted(os.listdir(d)):
    if f.endswith('.svg'):
        path = os.path.join(d, f)
        raw = open(path, 'r', encoding='utf-8').read()
        sanitized = sanitize_svg(raw)
        
        # Test XML parse
        try:
            ET.fromstring(sanitized)
            successes.append(f)
            # Write back sanitized
            with open(path, 'w', encoding='utf-8') as out:
                out.write(sanitized)
        except ET.ParseError as e:
            errors.append((f, str(e)))

print(f"XML Validation: {len(successes)} succeeded, {len(errors)} failed.")
for f, err in errors:
    print(f"  FAILED {f}: {err}")

