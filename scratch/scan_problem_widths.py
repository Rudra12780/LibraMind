from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1] / 'frontend' / 'src'
STYLE = re.compile(r'style=\{\{(.*?)\}\}', re.S)
WIDTH = re.compile(r'(?:^|[\s,])(?:width|minWidth):\s*[\'\"]([0-9]{4,})px[\'\"]')

for f in ROOT.rglob('*.jsx'):
    text = f.read_text(encoding='utf-8')
    for i, m in enumerate(STYLE.finditer(text), 1):
        block = m.group(1)
        widths = WIDTH.findall(block)
        if not widths:
            continue
        if 'maxWidth' not in block and 'width: \'100%\'' not in block and 'minWidth: 0' not in block:
            line = text[:m.start()].count('\n') + 1
            print(f'{f.relative_to(ROOT)}:{line} width={widths} :: {block[:180].strip()}')
