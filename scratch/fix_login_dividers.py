import pathlib
import re

updates = {
    pathlib.Path('frontend/src/pages/Login.jsx'): (
        re.compile(r"\s*<div style=\{\{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var\(--editorial-border\)' \}\}>\n\s*<span style=\{\{ fontSize: '1\.2rem' \}\}></span>\n\s*<span style=\{\{ height: '2px', width: '30px', backgroundColor: 'var\(--editorial-border\)' \}\} />\n\s*<span style=\{\{ fontSize: '1\.2rem' \}\}>[^<]*</span>\n\s*</div>"),
        "              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--editorial-border)' }}>\n"
        "                <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--editorial-border)' }} />\n"
        "                <span style={{ height: '2px', width: '30px', backgroundColor: 'var(--editorial-border)' }} />\n"
        "                <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--editorial-border)' }} />\n"
        "              </div>",
    ),
    pathlib.Path('frontend/src/pages/LibrarianDashboard.jsx'): (
        re.compile(r"\s*<div style=\{\{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var\(--editorial-border\)' \}\}>\n\s*<span style=\{\{ fontSize: '1\.2rem' \}\}></span>\n\s*<span style=\{\{ height: '2px', width: '30px', backgroundColor: 'var\(--editorial-border\)' \}\} />\n\s*<span style=\{\{ fontSize: '1\.2rem' \}\}>[^<]*</span>\n\s*</div>"),
        "                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--editorial-border)' }}>\n"
        "                  <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--editorial-border)' }} />\n"
        "                  <span style={{ height: '2px', width: '30px', backgroundColor: 'var(--editorial-border)' }} />\n"
        "                  <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--editorial-border)' }} />\n"
        "                </div>",
    ),
}

for path, (pattern, replacement) in updates.items():
    text = path.read_text(encoding='utf-8')
    text, count = pattern.subn(replacement, text)
    path.write_text(text, encoding='utf-8', newline='\n')
    print(path, count)
