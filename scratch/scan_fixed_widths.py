from pathlib import Path
import collections
import re

ROOT = Path(__file__).resolve().parents[1] / 'frontend' / 'src'
c = collections.Counter()
pat = re.compile(r"(?:width|minWidth|maxWidth):\s*['\"]([0-9]{3,4})px")
for f in ROOT.rglob('*.jsx'):
    c.update(pat.findall(f.read_text(encoding='utf-8')))
print(c.most_common(40))
