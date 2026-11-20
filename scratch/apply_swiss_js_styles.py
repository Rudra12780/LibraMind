import pathlib
import re

root = pathlib.Path('frontend/src')
files = sorted(root.rglob('*.jsx'))

color_map = {
    '#FFF8E9': '#FFFFFF',
    '#F5EBD7': '#F7F7F5',
    '#D9A52E': '#E53935',
    '#C76535': '#E53935',
    '#A94332': '#E53935',
    '#527C78': '#244A73',
    '#74794C': '#292929',
    '#34271F': '#171717',
    '#80634D': '#292929',
    '#F8EDCE': '#EEEEEE',
    '#E3D5BC': '#EEEEEE',
    '#D9C8AE': '#BDBDBD',
    '#EFE3CD': '#EEEEEE',
    '#EADFC9': '#EEEEEE',
    '#6B5848': '#6B6B6B',
    '#8A6516': '#C62828',
    '#3D615D': '#1B3554',
    '#8E3427': '#C62828',
    '#F3DCD4': '#EEEEEE',
    '#E2EFEC': '#EEEEEE',
    '#E8E9D8': '#EEEEEE',
    '#B9841F': '#C62828',
}

rgba_map = {
    'rgba(52, 39, 31': 'rgba(23, 23, 23',
    'rgba(128, 99, 77': 'rgba(23, 23, 23',
    'rgba(169, 67, 50': 'rgba(229, 57, 53',
    'rgba(82, 124, 120': 'rgba(36, 74, 115',
    'rgba(217, 165, 46': 'rgba(229, 57, 53',
    'rgba(116, 121, 76': 'rgba(41, 41, 41',
    'rgba(82, 115, 77': 'rgba(36, 74, 115',
    'rgba(255, 248, 233': 'rgba(255, 255, 255',
    'rgba(245, 235, 215': 'rgba(247, 247, 245',
}

geometry_map = {
    "boxShadow: '2px 2px 0px var(--bauhaus-charcoal)'": "boxShadow: 'none'",
    "boxShadow: '2px 0px 0px var(--editorial-text)'": "boxShadow: 'none'",
    "boxShadow: '1px 1px 0px var(--editorial-text)'": "boxShadow: 'none'",
    "borderRadius: '6px'": "borderRadius: '0px'",
    "borderRadius: '8px'": "borderRadius: '0px'",
    "borderRadius: '12px'": "borderRadius: '0px'",
    "borderRadius: '16px'": "borderRadius: '0px'",
    "borderRadius: '999px'": "borderRadius: '0px'",
}

changed = []
for path in files:
    text = path.read_text(encoding='utf-8')
    original = text

    for old, new in color_map.items():
        text = re.sub(re.escape(old), new, text, flags=re.IGNORECASE)
    for old, new in rgba_map.items():
        text = re.sub(re.escape(old), new, text, flags=re.IGNORECASE)
    for old, new in geometry_map.items():
        text = text.replace(old, new)

    # Remaining retro-era label copy in comments that appears in the UI layer.
    text = text.replace('{/* Bauhaus Brand Logo */}', '{/* Swiss Brand Mark */}')
    text = text.replace('{/* Col 1: Brand & Bauhaus Monogram */}', '{/* Col 1: Brand & Swiss Mark */}')
    text = text.replace('{/* Bauhaus Geometric Primary Stripe */}', '{/* Swiss Primary Stripe */}')
    text = text.replace('{/* Brand Logo with Bauhaus Monogram */}', '{/* Brand Logo with Swiss Mark */}')
    text = text.replace('{/* 1. BAUHAUS HERO', '{/* 1. SWISS HERO')
    text = text.replace('Editorial cover composition for the Bauhaus hero', 'Editorial cover composition for the Swiss hero')
    text = text.replace('* dedicated Bauhaus "control panel"', '* dedicated Swiss "control panel"')
    text = text.replace('{/* Custom Vintage Administrative Confirmation Modal */}', '{/* Custom Swiss Administrative Confirmation Modal */}')
    text = text.replace('{/* Custom Vintage Hold Cancellation Modal */}', '{/* Custom Swiss Hold Cancellation Modal */}')
    text = text.replace('{/* Filter Tabs (Ukiyo-e Deck) */}', '{/* Filter Tabs (Swiss Deck) */}')

    if text != original:
        path.write_text(text, encoding='utf-8', newline='\n')
        changed.append(str(path))

print(f'updated {len(changed)} files')
for item in changed:
    print(item)
