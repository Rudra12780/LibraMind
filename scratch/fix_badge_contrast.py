import pathlib

for name in ['Navbar', 'UserNavbar', 'AdminNavbar', 'LibrarianNavbar']:
    p = pathlib.Path('frontend/src/components') / f'{name}.jsx'
    t = p.read_text(encoding='utf-8')
    old = "backgroundColor: 'var(--bauhaus-yellow)',\n                  color: 'var(--bauhaus-charcoal)',"
    new = "backgroundColor: 'var(--bauhaus-red)',\n                  color: '#FFFFFF',"
    count = t.count(old)
    if count == 0:
        # fallback: replace the charcoal colour only in the badge block
        old2 = "backgroundColor: 'var(--bauhaus-yellow)'"
        idx = t.find(old2)
        if idx != -1:
            seg = t[idx:idx + 220]
            t = t[:idx] + seg.replace("color: 'var(--bauhaus-charcoal)'", "color: '#FFFFFF'", 1) + t[idx + 220:]
            count = 1
    else:
        t = t.replace(old, new)
    p.write_text(t, encoding='utf-8', newline='\n')
    print(name, count)
