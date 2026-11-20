import pathlib
import unicodedata

root = pathlib.Path('frontend/src')
for p in sorted(root.rglob('*.jsx')):
    for i, line in enumerate(p.read_text(encoding='utf-8').splitlines(), 1):
        chars = [c for c in line if ord(c) >= 0x2600]
        if chars:
            names = ', '.join(f'U+{ord(c):04X} {unicodedata.name(c, "?")}' for c in chars)
            print(f'{p}:{i}:{"".join(chars)}:{names}')
