from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1] / 'frontend' / 'src'
NATIVE = {'A', 'Abbr', 'Address', 'Area', 'Article', 'Aside', 'B', 'Base', 'Bdi', 'Bdo', 'Blockquote', 'Br', 'Button', 'Canvas', 'Caption', 'Cite', 'Code', 'Col', 'Colgroup', 'Data', 'Datalist', 'Dd', 'Del', 'Details', 'Dfn', 'Dialog', 'Div', 'Dl', 'Dt', 'Em', 'Embed', 'Fieldset', 'Figcaption', 'Figure', 'Footer', 'Form', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Head', 'Header', 'Hgroup', 'Hr', 'Html', 'I', 'Iframe', 'Img', 'Input', 'Ins', 'Kbd', 'Label', 'Legend', 'Li', 'Link', 'Main', 'Map', 'Mark', 'Menu', 'Meta', 'Meter', 'Nav', 'Noscript', 'Object', 'Ol', 'Optgroup', 'Option', 'Output', 'P', 'Param', 'Picture', 'Pre', 'Progress', 'Q', 'Rp', 'Rt', 'Ruby', 'S', 'Samp', 'Script', 'Section', 'Select', 'Slot', 'Small', 'Source', 'Span', 'Strong', 'Style', 'Sub', 'Summary', 'Sup', 'Table', 'Tbody', 'Td', 'Template', 'Textarea', 'Tfoot', 'Th', 'Thead', 'Time', 'Title', 'Tr', 'Track', 'U', 'Ul', 'Var', 'Video', 'Wbr', 'React', 'Fragment', 'Suspense'}

for path in ROOT.rglob('*.jsx'):
    text = path.read_text(encoding='utf-8')
    imports = set()
    for m in re.finditer(r'import\s+(.+?)\s+from\s+[\'\"]', text, re.S):
        clause = m.group(1)
        for name in re.findall(r'\b([A-Z][A-Za-z0-9_]*)\b', clause):
            imports.add(name)
    # Local declarations
    decls = set(re.findall(r'\b(?:function|const|class)\s+([A-Z][A-Za-z0-9_]*)', text))
    used = set(re.findall(r'<([A-Z][A-Za-z0-9_]*)[\s/>]', text))
    missing = sorted(used - imports - decls - NATIVE)
    if missing:
        print(f'{path.relative_to(ROOT)}: {", ".join(missing)}')
