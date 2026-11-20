import pathlib
import re

standard = "linear-gradient(90deg, var(--bh-red) 0 84px, var(--bh-ink) 84px 100%)"
files = [
    'frontend/src/pages/About.jsx',
    'frontend/src/pages/LibrarianDashboard.jsx',
    'frontend/src/pages/Login.jsx',
    'frontend/src/pages/ProfileCompletion.jsx',
    'frontend/src/pages/Register.jsx',
    'frontend/src/pages/ResetPassword.jsx',
]

pattern = re.compile(r"linear-gradient\(90deg,[^)]*\)")
for f in files:
    p = pathlib.Path(f)
    text = p.read_text(encoding='utf-8')
    new, count = pattern.subn(standard, text)
    p.write_text(new, encoding='utf-8', newline='\n')
    print(f, count)
