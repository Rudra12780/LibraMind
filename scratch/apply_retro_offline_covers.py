from pathlib import Path

path = Path(r"C:\Users\ADMIN\Desktop\smartlib\frontend\src\utils\offlineCovers.js")
text = path.read_text(encoding="utf-8")

# Keep this generator literal-colour (raw SVG cannot resolve CSS variables);
# only retint the literals and copy to the Retro library palette.
replacements = {
    "#E53935": "#A94332",
    "#C62828": "#8E3427",
    "#F4C430": "#D9A52E",
    "#2455A4": "#527C78",
    "#1A3E7A": "#3D615D",
    "#F5F0E6": "#F5EBD7",
    "#FAF9F6": "#FFF8E9",
    "#202020": "#34271F",
    "#E5E5E5": "#D9C8AE",
    "#6C7A71": "#74794C",
    "Modern Bauhaus Book Cover Generator": "Retro Editorial Book Cover Generator",
    "Modern Bauhaus geometric art direction: Primary Colors, Circles, Rectangles & Asymmetric Typography.":
        "Retro editorial art direction: warm paper, vintage geometry and expressive bookplate typography.",
    "'Bauhaus Monograph'": "'Vintage Monograph'",
    "// Bauhaus Palette: Red #E53935, Yellow #F4C430, Blue #2455A4, Cream #F5F0E6, Charcoal #202020":
        "// Retro Palette: Terracotta #A94332, Mustard #D9A52E, Teal #527C78, Cream #F5EBD7, Espresso #34271F",
    "// Layout 0: Bauhaus Primary Geometric Circle & Architectural Grid":
        "// Layout 0: Vintage bookplate circle and editorial grid",
    "// Large Geometric Circle (Bauhaus Yellow)": "// Large geometric circle in mustard",
    "// Slicing Bauhaus Blue Rectangle": "// Slicing teal rectangle",
    "// Bauhaus Red Accent Square": "// Terracotta accent square",
    "// Top Bauhaus Monogram": "// Top archive monogram",
    "LIBRAMIND // BAUHAUS ARCHIVES": "LIBRAMIND // VINTAGE ARCHIVES",
    "// Main Title (Oversized Space Grotesk)": "// Main title in expressive serif",
    "DESSAU • WEIMAR • LIBRAMIND EDITIONS": "CLASSIC • ARCHIVE • LIBRAMIND EDITIONS",
    "// Layout 1: Asymmetrical Diagonal Block & Ultramarine Field":
        "// Layout 1: Asymmetrical diagonal block and teal field",
    "// Bold Diagonal Red Sward": "// Bold diagonal terracotta sweep",
    "STATE BAUHAUS SERIES // VOL.": "VINTAGE LIBRARY SERIES // VOL.",
    "// Layout 2: Golden Yellow Field & Constructivist Grid":
        "// Layout 2: Mustard field and editorial medallion",
    "// Stark Charcoal Lower Half": "// Stark espresso lower half",
    "// Slicing Red and Blue Geometry": "// Slicing terracotta and teal geometry",
    "LIBRAMIND GEOMETRIC ARCHIVES": "LIBRAMIND VINTAGE ARCHIVES",
    "// Layout 3: Bauhaus Heavy Grid & Typographic Construct":
        "// Layout 3: Vintage colour blocks and typographic construct",
    "LIBRAMIND ARCHITECTURAL MONOGRAPHS": "LIBRAMIND CLASSIC MONOGRAPHS",
}

for old, new in replacements.items():
    text = text.replace(old, new)

# Raw SVG typography: keep literal fonts, but switch display faces to a
# Cooper-like serif stack that does not depend on app CSS variables.
text = text.replace("'Space Grotesk', 'Archivo', sans-serif", "Fraunces, Georgia, serif")
text = text.replace("'Space Grotesk', sans-serif", "Fraunces, Georgia, serif")
text = text.replace("'Inter', sans-serif", "'DM Sans', Arial, sans-serif")
text = text.replace("font-weight=\"800\"", "font-weight=\"700\"")

path.write_text(text, encoding="utf-8")
print("Updated offlineCovers.js")
