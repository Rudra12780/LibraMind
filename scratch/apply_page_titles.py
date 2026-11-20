from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1] / 'frontend' / 'src' / 'pages'
FILES = [
    'BookDetails.jsx', 'AiBookFinder.jsx', 'About.jsx', 'HelpContact.jsx',
    'TermsPolicies.jsx', 'StudentDashboard.jsx', 'LibrarianDashboard.jsx',
    'AdminDashboard.jsx', 'AnalyticsPage.jsx'
]

for name in FILES:
    path = ROOT / name
    text = path.read_text(encoding='utf-8')
    if 'className="bh-page-title"' in text:
        continue
    new, count = re.subn(r'<h1(?=\s|>)', '<h1 className="bh-page-title"', text)
    if count:
        path.write_text(new, encoding='utf-8')
        print(f'{name}: {count} h1 updated')
