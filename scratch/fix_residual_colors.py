from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / 'frontend' / 'src'
EXCLUDED = {'visualBlueprints.js', 'ThemeToggle.jsx', 'VisualBlueprintModal.jsx', 'BlueprintModal.jsx', 'PresentationModal.jsx'}

MAP = {
    '#FCA5A5': 'var(--bauhaus-red)',
    '#FFEBEE': 'var(--bauhaus-red-light)',
    '#78350F': 'var(--bauhaus-yellow-dark)',
    '#6C7A71': 'var(--editorial-text-muted, #666666)',
    '#999999': 'var(--bauhaus-grey)',
    '#666666': 'var(--bauhaus-charcoal)',
    '#4A4A4A': 'var(--bauhaus-charcoal)',
    '#FEEFE6': 'var(--bauhaus-red-light)',
    '#3B72C7': 'var(--bauhaus-blue)',
    '#1A3E7A': 'var(--bauhaus-blue-dark)',
    '#52734D': 'var(--bauhaus-blue)',
    '#344E41': 'var(--bauhaus-blue-dark)',
    '#D4A017': 'var(--bauhaus-yellow-dark)',
    '#8C6200': 'var(--bauhaus-yellow-dark)',
    '#946C00': 'var(--bauhaus-yellow-dark)',
    '#23342B': 'var(--bauhaus-charcoal)',
    '#DCE5D5': 'var(--bauhaus-blue-light)',
    '#D5CBBB': 'var(--bauhaus-grey)',
    '#EBF1E6': 'var(--bauhaus-blue-light)',
    '#FAF8F1': 'var(--bauhaus-offwhite)',
    '#FAF5EC': 'var(--bauhaus-offwhite)',
}

changed = 0
for path in list(ROOT.rglob('*.jsx')) + list(ROOT.rglob('*.js')):
    if path.name in EXCLUDED:
        continue
    text = path.read_text(encoding='utf-8')
    new = text
    for src, dst in MAP.items():
        new = new.replace(src, dst).replace(src.lower(), dst)
    if new != text:
        path.write_text(new, encoding='utf-8')
        changed += 1
        print(f'updated {path.relative_to(ROOT)}')

print(f'\n{changed} files updated')
