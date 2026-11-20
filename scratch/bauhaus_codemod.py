"""Normalize legacy inline styling to the Bauhaus design tokens.

Only touches frontend page/component source files. Blueprint SVG data and the
blueprint-specific modals are intentionally excluded because their monochrome
wireframe presentation is part of the product specification.
"""
from __future__ import annotations

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "frontend" / "src"
BACKUP = ROOT / "scratch" / "bauhaus_codemod_backup"

EXCLUDED = {
    "VisualBlueprintModal.jsx",
    "BlueprintModal.jsx",
    "PresentationModal.jsx",
    "ThemeToggle.jsx",
}

NEUTRAL_LIGHT = {
    "#FFFFFF", "#FAFAFA", "#F9FAFB", "#FAF8F1", "#FAF5EC", "#FFFDF9",
    "#FCFAF7", "#F8F8F8", "#F5F5F5", "#F4F4F4", "#F9F9F9", "#FDF2E9",
}
NEUTRAL_GREY = {
    "#EDEDED", "#EEEEEE", "#E0E0E0", "#DDDDDD", "#D2D2D2", "#D0D0D0",
    "#D9D3C7", "#D8CABA", "#E8DCBE", "#DCE5D5", "#EBF1E6", "#E8EDE6",
    "#F3F4F6", "#E5E7EB", "#D1D5DB", "#9CA3AF", "#AAAAAA",
}
NEUTRAL_GREY_DARK = {
    "#888888", "#777777", "#666666", "#555555", "#4B5563", "#374151", "#333333",
}
DARK = {"#202020", "#24292F", "#1F2328", "#1F2421", "#111111", "#222222"}
RED = {
    "#C5221F", "#A51D24", "#B91C1C", "#DC2626", "#8C2222", "#8C1D18",
    "#991B1B", "#E53935", "#C62828", "#E07A5F", "#F87171", "#6E1B24", "#8C2A35",
}
RED_LIGHT = {"#FCE8E6", "#FDECE7", "#FEE2E2", "#FFF7F5", "#FAD2CF", "#FFEBEE"}
GREEN = {
    "#15803D", "#2E7D32", "#16A34A", "#52734D", "#2D6A35", "#166534",
    "#14532D", "#2A9D8F", "#74C69D", "#2A6F97", "#344E41", "#24352B",
    "#23342B", "#1E3A2B", "#2A4D3B", "#829779", "#3B72C7", "#2455A4", "#1A3E7A",
}
GREEN_LIGHT = {"#DCFCE7", "#F0FDF4", "#BBF7D0", "#86EFAC", "#EBF2FA", "#DCE5D5"}
YELLOW = {
    "#B45309", "#D97706", "#92400E", "#F59E0B", "#B25E1A", "#9B6548",
    "#F4C430", "#D4A017", "#946C00", "#8C6200",
}
YELLOW_LIGHT = {"#FEF3C7", "#FFFBEB", "#FEF9E7", "#FDE68A", "#FCD34D", "#FEF3C7"}
CYAN = {"#00F0FF", "#FF007F"}

BG_PROPS = ("backgroundcolor", "background", "backgroundimage")
BORDER_PROPS = ("bordercolor", "border", "borderleft", "borderright", "bordertop", "borderbottom", "outline")
TEXT_PROPS = ("color", "fill", "stroke")


def family(hex_color: str) -> str | None:
    for name, group in (
        ("neutral_light", NEUTRAL_LIGHT), ("neutral_grey", NEUTRAL_GREY),
        ("neutral_grey_dark", NEUTRAL_GREY_DARK), ("dark", DARK), ("red", RED), ("red_light", RED_LIGHT),
        ("green", GREEN), ("green_light", GREEN_LIGHT),
        ("yellow", YELLOW), ("yellow_light", YELLOW_LIGHT), ("cyan", CYAN),
    ):
        if hex_color in group:
            return name
    return None


def token(hex_color: str, prop: str) -> str:
    fam = family(hex_color)
    if fam is None:
        return hex_color
    if fam == "neutral_light":
        return "var(--bauhaus-offwhite)"
    if fam == "neutral_grey":
        return "var(--bauhaus-grey)"
    if fam == "neutral_grey_dark":
        return "var(--bauhaus-charcoal)" if prop not in BG_PROPS else "var(--bauhaus-grey)"
    if fam == "dark":
        return "var(--bauhaus-charcoal)"
    if fam == "cyan":
        return "var(--bauhaus-red)" if hex_color == "#FF007F" else "var(--bauhaus-blue)"
    if prop in BG_PROPS:
        return {
            "red": "var(--bauhaus-red)",
            "red_light": "var(--bauhaus-red-light)",
            "green": "var(--bauhaus-blue)",
            "green_light": "var(--bauhaus-blue-light)",
            "yellow": "var(--bauhaus-yellow)",
            "yellow_light": "var(--bauhaus-yellow-light)",
        }[fam]
    if prop in BORDER_PROPS:
        return {
            "red": "var(--bauhaus-red)",
            "red_light": "var(--bauhaus-red)",
            "green": "var(--bauhaus-blue)",
            "green_light": "var(--bauhaus-blue)",
            "yellow": "var(--bauhaus-yellow)",
            "yellow_light": "var(--bauhaus-yellow)",
        }[fam]
    return {
        "red": "var(--bauhaus-red)",
        "red_light": "var(--bauhaus-red)",
        "green": "var(--bauhaus-blue)",
        "green_light": "var(--bauhaus-blue-dark)",
        "yellow": "var(--bauhaus-yellow-dark)",
        "yellow_light": "var(--bauhaus-yellow-dark)",
    }[fam]


HEX_RE = re.compile(r"#[0-9A-Fa-f]{6}\b|#[0-9A-Fa-f]{3}\b")
PROP_RE = re.compile(r"([A-Za-z-]+)\s*[:=]\s*['\"]?$")


def replace_hex(text: str) -> str:
    def repl(match: re.Match) -> str:
        hex_color = match.group(0).upper()
        before = text[max(0, match.start() - 120):match.start()]
        prop_match = PROP_RE.search(before)
        prop = (prop_match.group(1).lower() if prop_match else "")
        return token(hex_color, prop)
    return HEX_RE.sub(repl, text)


def normalize(text: str) -> tuple[str, int]:
    original = text
    text = replace_hex(text)
    text = re.sub(r"fontFamily:\s*'monospace'", "fontFamily: 'var(--font-mono)'", text)
    text = re.sub(r"fontFamily:\s*'Consolas[^']*'", "fontFamily: 'var(--font-mono)'", text)
    text = re.sub(r"font-family:\s*monospace", "font-family: var(--font-mono)", text)
    # Sharper Bauhaus geometry for inline radii. Preserve circles/pills.
    def radius_repl(m: re.Match) -> str:
        value = m.group(2)
        if "%" in value or "999" in value:
            return m.group(0)
        try:
            num = float(value.replace("px", "").strip())
        except ValueError:
            return m.group(0)
        return f"{m.group(1)}{'2px' if num <= 6 else '4px'}{m.group(3)}"
    text = re.sub(r"(borderRadius:\s*')([^']+)(')", radius_repl, text)
    text = re.sub(r"(border-radius:\s*)([0-9]+px)", lambda m: f"{m.group(1)}2px" if int(m.group(2)[:-2]) <= 6 else f"{m.group(1)}4px", text)
    # Soft diffuse shadows become architectural offset shadows.
    text = re.sub(r"boxShadow:\s*'0 [^']*rgba\([^']*\)'", "boxShadow: 'var(--shadow-sm)'", text)
    text = re.sub(r"box-shadow:\s*0 [^;]*rgba\([^;]*\);", "box-shadow: var(--shadow-sm);", text)
    return text, 1 if text != original else 0


def main() -> None:
    files = [p for p in SRC.rglob("*.jsx") if p.name not in EXCLUDED]
    changed = 0
    for path in files:
        text = path.read_text(encoding="utf-8")
        new_text, did_change = normalize(text)
        if did_change:
            rel = path.relative_to(ROOT)
            backup = BACKUP / rel
            backup.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(path, backup)
            path.write_text(new_text, encoding="utf-8")
            changed += 1
            print(f"updated {rel}")
    print(f"\n{changed} files updated. Backups in {BACKUP.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
