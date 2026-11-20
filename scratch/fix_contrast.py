"""Fix contrast regressions from the design-token codemod.

Any element using a yellow or grey background with off-white text is invisible;
switch the text to charcoal. Red/blue backgrounds keep off-white text.
"""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1] / 'frontend' / 'src'

BAD_BG = ('var(--bauhaus-yellow)', 'var(--bauhaus-yellow-light)', 'var(--bauhaus-grey)')

# Match a JS style object body (brace-delimited) and rewrite only inside it.
STYLE_RE = re.compile(r"style=\{\{(.*?)\}\}", re.S)

def fix_block(block: str) -> tuple[str, bool]:
    if not any(bg in block for bg in BAD_BG):
        return block, False
    # Replace text colors anywhere in the same style object.
    new = re.sub(r"(color:\s*')var\(--bauhaus-offwhite\)(')", r"\1var(--bauhaus-charcoal)\2", block)
    return new, new != block

changed_files = 0
for path in ROOT.rglob('*.jsx'):
    text = path.read_text(encoding='utf-8')
    count = [0]
    def repl(m: re.Match) -> str:
        new, did = fix_block(m.group(1))
        if did:
            count[0] += 1
        return 'style={{' + new + '}}'
    new_text = STYLE_RE.sub(repl, text)
    if new_text != text:
        path.write_text(new_text, encoding='utf-8')
        changed_files += 1
        print(f'{path.relative_to(ROOT)}: {count[0]} style objects fixed')

print(f'\n{changed_files} files updated')
