import pathlib
import re

root = pathlib.Path('frontend/src')

replacements = {
    '☀️ Member & Student Sanctuary': 'Member & Student Sanctuary',
    '💳 Card / Email': 'Card / Email',
    '📱 Mobile OTP': 'Mobile OTP',
    '🌿 1-Click Instant Demo Accounts:': '1-Click Instant Demo Accounts:',
    '🌿 Free Sanctuary Enrollment': 'Free Membership Enrollment',
    '⚠️ Passwords do not match.': 'Passwords do not match.',
    '🔑 Security & Key Update': 'Security & Key Update',
    '⚡ 1-Click Admin Demo Access:': '1-Click Admin Demo Access:',
    '📢 Library Announcement': 'Library Announcement',
    '⚠️ Important Notice / Policy Warning': 'Important Notice / Policy Warning',
    '⏰ Overdue Loan Reminder': 'Overdue Loan Reminder',
    'ℹ️ General Information': 'General Information',
    "{adminConfirmModal.isDanger ? '⚠️' : '🛡️'}": "{adminConfirmModal.isDanger ? '!' : 'i'}",
    '🌿 Circulation Desk • Staff Gateway': 'Circulation Desk • Staff Gateway',
    '⚡ 1-Click Staff Demo Access:': '1-Click Staff Demo Access:',
    '⚡ Auto-Fill Member ID': 'Auto-Fill Member ID',
    '📅': '',
    '📍': '',
    '🔒': '',
    '💡': '',
    '📐': '',
    '⚠️': '!',
    '💳 ': '',
    '🌐 ': '',
    '📄 ': '',
    '📊 ': '',
    '📈 ': '',
    '🌳 ': '',
    '🧠 ': '',
    '🎯 ': '',
    '💻 ': '',
}

allowed = {0x2605, 0x2713, 0x2715, 0x2726, 0x2794, 0xFE0F}
emoji_ranges = [(0x1F000, 0x1FAFF), (0x2600, 0x27BF)]

for path in sorted(root.rglob('*.jsx')):
    text = path.read_text(encoding='utf-8')
    original = text

    for old, new in replacements.items():
        text = text.replace(old, new)

    # Remove decorative icon spans that are now empty.
    text = re.sub(r"\s*<span style=\{\{ fontSize: '1(?:\.2|\.0|rem)?rem'[^}]*\}\}>\s*</span>", '', text)
    text = re.sub(r"\s*<span style=\{\{ fontSize: '1\.2rem' \}\}>\s*</span>", '', text)

    chars = []
    for ch in text:
        cp = ord(ch)
        drop = False
        if cp not in allowed:
            for lo, hi in emoji_ranges:
                if lo <= cp <= hi:
                    drop = True
                    break
        if not drop:
            chars.append(ch)
    text = ''.join(chars)

    # Tidy spacing left behind by removed emoji.
    text = text.replace('>  ', '> ').replace('  <', ' <')

    if text != original:
        path.write_text(text, encoding='utf-8', newline='\n')
        print(path)
