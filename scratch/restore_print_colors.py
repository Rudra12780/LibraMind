from pathlib import Path

p = Path(__file__).resolve().parents[1] / 'frontend' / 'src' / 'data' / 'blueprintsData.js'
t = p.read_text(encoding='utf-8')
reps = [
    ('color: var(--bauhaus-charcoal)', 'color: #23342B'),
    ('border-bottom: 2px solid var(--bauhaus-blue);', 'border-bottom: 2px solid #52734D;'),
    ('border-bottom: 1px solid var(--bauhaus-blue-light);', 'border-bottom: 1px solid #DCE5D5;'),
    ('color: var(--bauhaus-blue-dark);', 'color: #344E41;'),
    ('color: var(--bauhaus-blue);', 'color: #52734D;'),
    ('background-color: var(--bauhaus-offwhite);', 'background-color: #FAF8F1;'),
    ('border: 1px solid var(--bauhaus-blue-light);', 'border: 1px solid #DCE5D5;'),
    ('background: var(--bauhaus-blue-light);', 'background: #EBF1E6;'),
    ('background: var(--bauhaus-offwhite);', 'background: #FAF5EC;'),
    ('background: var(--bauhaus-blue-dark);', 'background: #344E41;'),
]
for k, v in reps:
    print(k, t.count(k))
    t = t.replace(k, v)
p.write_text(t, encoding='utf-8')

cover = Path(__file__).resolve().parents[1] / 'frontend' / 'src' / 'utils' / 'offlineCovers.js'
c = cover.read_text(encoding='utf-8')
old = 'fill="var(--bauhaus-charcoal)" font-family="\'Space Mono\', monospace" font-size="9"'
new = 'fill="#6C7A71" font-family="\'Space Mono\', monospace" font-size="9"'
if old in c:
    c = c.replace(old, new, 1)
    cover.write_text(c, encoding='utf-8')
    print('restored offline cover color')
