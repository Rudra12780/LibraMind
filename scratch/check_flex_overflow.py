import glob
import re

jsx_files = glob.glob('frontend/src/**/*.jsx', recursive=True)
count = 0
for f in jsx_files:
    with open(f, 'r', encoding='utf-8') as fp:
        lines = fp.readlines()
    for idx, l in enumerate(lines):
        if 'display: \'flex\'' in l:
            block = ''.join(lines[idx:min(len(lines), idx+6)])
            if 'gap:' in block and 'flexWrap' not in block and 'overflow' not in block and 'whiteSpace' in block:
                print(f'{f}:{idx+1} -> {l.strip()[:60]}')
                count += 1

print(f'Total found: {count}')

