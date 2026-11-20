from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / 'frontend' / 'src'

REPLACEMENTS = {
    'linear-gradient(90deg, var(--editorial-accent) 0% 33.3%, var(--editorial-green) 33.3% 66.6%, var(--editorial-border) 66.6% 100%)':
        'linear-gradient(90deg, var(--bh-red) 0% 33.3%, var(--bh-yellow) 33.3% 66.6%, var(--bh-blue) 66.6% 100%)',
    'linear-gradient(90deg, var(--editorial-green) 0%, var(--editorial-border) 50%, var(--editorial-accent) 100%)':
        'linear-gradient(90deg, var(--bh-red) 0% 55%, var(--bh-blue) 55% 100%)',
    'linear-gradient(135deg, var(--editorial-green), var(--editorial-border))':
        'var(--bh-blue)',
    'linear-gradient(90deg, var(--editorial-accent) 0%, var(--editorial-green) 100%)':
        'linear-gradient(90deg, var(--bh-red), var(--bh-yellow))',
}

for path in ROOT.rglob('*.jsx'):
    text = path.read_text(encoding='utf-8')
    original = text
    for old, new in REPLACEMENTS.items():
        text = text.replace(old, new)
    if text != original:
        path.write_text(text, encoding='utf-8')
        print(path.relative_to(ROOT))
