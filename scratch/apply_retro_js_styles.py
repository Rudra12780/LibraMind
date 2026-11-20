from pathlib import Path
import re

ROOT = Path(r"C:\Users\ADMIN\Desktop\smartlib\frontend\src")

# Keep generated SVG/canvas/print artifacts literal-colour. This pass only
# touches JSX UI chrome and inline styles.
FILES = [p for p in ROOT.rglob("*.jsx")]

replacements = [
    # Legacy Bauhaus translucent accents.
    (r"rgba\(\s*229\s*,\s*57\s*,\s*53\s*,", "rgba(169, 67, 50,"),
    (r"rgba\(\s*36\s*,\s*85\s*,\s*164\s*,", "rgba(82, 124, 120,"),
    (r"rgba\(\s*244\s*,\s*196\s*,\s*48\s*,", "rgba(217, 165, 46,"),
    (r"rgba\(\s*32\s*,\s*32\s*,\s*32\s*,", "rgba(52, 39, 31,"),
    (r"rgba\(\s*140\s*,\s*34\s*,\s*34\s*,", "rgba(169, 67, 50,"),
    (r"rgba\(\s*52\s*,\s*78\s*,\s*65\s*,", "rgba(82, 124, 120,"),
    (r"rgba\(\s*38\s*,\s*61\s*,\s*50\s*,", "rgba(52, 39, 31,"),
    (r"rgba\(\s*21\s*,\s*128\s*,\s*61\s*,", "rgba(116, 121, 76,"),
    (r"rgba\(\s*217\s*,\s*119\s*,\s*6\s*,", "rgba(217, 165, 46,"),
    (r"rgba\(\s*155\s*,\s*101\s*,\s*72\s*,", "rgba(128, 99, 77,"),
    (r"rgba\(\s*255\s*,\s*255\s*,\s*255\s*,", "rgba(255, 248, 233,"),
    (r"rgba\(18,\s*18,\s*18,\s*0\.75\)", "rgba(52, 39, 31, 0.78)"),
    (r"rgba\(20,\s*25,\s*22,\s*0\.85\)", "rgba(52, 39, 31, 0.86)"),
    (r"rgba\(27,\s*48,\s*36,\s*0\.75\)", "rgba(52, 39, 31, 0.80)"),
    (r"rgba\(35,\s*52,\s*43,\s*0\.75\)", "rgba(52, 39, 31, 0.80)"),

    # Warm paper/ink literals for UI surfaces (not artifact generators).
    (r"#FFFFFF\b", "#FFF8E9"),
    (r"#FFF\b", "#FFF8E9"),
    (r"#FAF5EC\b", "#F5EBD7"),
    (r"#FAF8F1\b", "#FFF8E9"),
    (r"#FAF8F5\b", "#FFF8E9"),
    (r"#F5F5F5\b", "#F5EBD7"),
    (r"#EEEEEE\b", "#EADFC9"),
    (r"#EDEDED\b", "#EADFC9"),
    (r"#EAEAEA\b", "#E3D5BC"),
    (r"#E0E0E0\b", "#E3D5BC"),
    (r"#DDDDDD\b", "#D9C8AE"),
    (r"#CCCCCC\b", "#D9C8AE"),
    (r"#AAAAAA\b", "#80634D"),
    (r"#666666\b", "#6B5848"),
    (r"#555555\b", "#6B5848"),
    (r"#444444\b", "#6B5848"),
    (r"#333333\b", "#34271F"),
    (r"#222222\b", "#34271F"),
    (r"#111111\b", "#34271F"),
    (r"#1F2421\b", "#34271F"),

    # Softer geometric corners.
    (r"borderRadius:\s*'2px'", "borderRadius: '6px'"),
    (r"borderRadius:\s*'4px'", "borderRadius: '8px'"),

    # Replace hard poster borders/shadows with warm editorial depth.
    (r"'2px solid var\(--bauhaus-charcoal\)'", "'1px solid var(--retro-brown)'"),
    (r"'1\.5px solid var\(--editorial-border\)'", "'1px solid var(--retro-brown)'"),
    (r"boxShadow:\s*'(?:3px 3px 0px|4px 4px 0px|6px 6px 0px) var\(--bauhaus-charcoal\)'", "boxShadow: 'var(--shadow-card)'"),
    (r"boxShadow:\s*'(?:3px 3px 0px|4px 4px 0px|6px 6px 0px) var\(--editorial-text\)'", "boxShadow: 'var(--shadow-card)'"),

    # Calmer editorial weights while preserving semantics.
    (r"fontWeight:\s*900\b", "fontWeight: 700"),
    (r"fontWeight:\s*800\b", "fontWeight: 700"),
]

changed = []
for path in FILES:
    text = path.read_text(encoding="utf-8")
    original = text
    for pattern, replacement in replacements:
        text = re.sub(pattern, replacement, text)
    if text != original:
        path.write_text(text, encoding="utf-8")
        changed.append(str(path.relative_to(ROOT)))

print(f"Updated {len(changed)} JSX files:")
for name in changed:
    print(name)
