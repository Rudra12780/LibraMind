import re

def remove_ppt_from_navbar(path):
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()

    # Pattern for the desktop PPT button
    pat_desktop = r'\s*\{\/\*\s*Design Thinking PPT Direct[^\n]*\*\/\}\s*<button[\s\S]*?<span>Design Thinking PPT<\/span>\s*<\/button>'
    text = re.sub(pat_desktop, '', text)

    # Pattern for mobile drawer PPT button
    pat_mobile = r'\s*<button[\s\S]*?<span>[^\n]*Design Thinking PPT[^\n]*<\/span>[\s\S]*?<\/button>'
    text = re.sub(pat_mobile, '', text)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"Removed PPT buttons from {path}")

for p in [
    'frontend/src/components/Navbar.jsx',
    'frontend/src/components/UserNavbar.jsx',
    'frontend/src/components/LibrarianNavbar.jsx',
    'frontend/src/components/AdminNavbar.jsx'
]:
    remove_ppt_from_navbar(p)

# Remove Book PPT button from VisualBlueprintModal.jsx
with open('frontend/src/components/VisualBlueprintModal.jsx', 'r', encoding='utf-8') as f:
    vb_text = f.read()

pat_vb = r'\s*\{\/\*\s*Download Presentation\s*\*\/\}[\s\S]*?📖 Book PPT \(\.PPTX\)[\s\S]*?<\/a>'
vb_text = re.sub(pat_vb, '', vb_text)
with open('frontend/src/components/VisualBlueprintModal.jsx', 'w', encoding='utf-8') as f:
    f.write(vb_text)
print("Removed PPT link from VisualBlueprintModal.jsx")

