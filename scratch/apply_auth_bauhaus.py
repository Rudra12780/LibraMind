from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / 'frontend' / 'src' / 'pages'
FILES = ['Login.jsx', 'Register.jsx', 'ForgotPassword.jsx', 'ResetPassword.jsx', 'About.jsx']

for name in FILES:
    path = ROOT / name
    text = path.read_text(encoding='utf-8')
    original = text

    if name != 'About.jsx':
        text = text.replace('className="bio-card"', 'className="bio-card bh-auth-card"', 1)

    text = text.replace(
        'linear-gradient(90deg, var(--editorial-accent) 0%, var(--editorial-border) 50%, var(--editorial-green) 100%)',
        'linear-gradient(90deg, var(--bh-red) 0% 55%, var(--bh-blue) 55% 100%)'
    )
    text = text.replace(
        'linear-gradient(90deg, var(--editorial-border) 0%, var(--editorial-accent) 50%, var(--editorial-green) 100%)',
        'linear-gradient(90deg, var(--bh-ink) 0% 40%, var(--bh-red) 40% 100%)'
    )
    text = text.replace(
        'linear-gradient(90deg, var(--editorial-accent) 0%, var(--editorial-green) 50%, var(--editorial-border) 100%)',
        'linear-gradient(90deg, var(--bh-red) 0% 55%, var(--bh-ink) 55% 100%)'
    )
    text = text.replace(
        'linear-gradient(135deg, var(--editorial-accent), var(--editorial-border))',
        'var(--bh-blue)'
    )
    text = text.replace(
        'linear-gradient(135deg, var(--editorial-green), var(--editorial-border))',
        'var(--bh-red)'
    )
    text = text.replace(
        'linear-gradient(135deg, var(--editorial-border), var(--editorial-accent))',
        'var(--bh-blue)'
    )
    text = text.replace(
        'linear-gradient(90deg, var(--editorial-accent) 0% 33.3%, var(--editorial-green) 33.3% 66.6%, var(--editorial-border) 66.6% 100%)',
        'linear-gradient(90deg, var(--bh-red) 0% 33.3%, var(--bh-yellow) 33.3% 66.6%, var(--bh-blue) 66.6% 100%)'
    )

    if text != original:
        path.write_text(text, encoding='utf-8')
        print(f'{name}: updated')
