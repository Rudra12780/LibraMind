from pathlib import Path

path = Path(__file__).resolve().parents[1] / 'frontend' / 'src' / 'pages' / 'Catalog.jsx'
text = path.read_text(encoding='utf-8')

replacements = [
    (
        "      {/* Header */}\n      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>\n        <div>\n          <h1 style={{ fontSize: '2.4rem', color: 'var(--forest-dark)', marginBottom: '8px' }}>\n            Library Book Catalog\n          </h1>",
        "      {/* Header */}\n      <div className=\"bh-page-head\" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>\n        <div>\n          <span className=\"bh-kicker\">Catalog / Volume Index</span>\n          <h1 className=\"bh-page-title\" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', color: 'var(--forest-dark)', marginBottom: '8px' }}>\n            Library Book Catalog\n          </h1>",
    ),
    (
        "      {/* Search & Filter Toolbar (Ukiyo-e Control Deck) */}\n      <div\n        className=\"bio-card\"",
        "      {/* Search & Filter Toolbar */}\n      <div\n        className=\"bio-card bh-filter-deck\"",
    ),
    (
        "      {/* Results Count & Grid */}\n      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>\n        <span style={{ fontSize: '0.9rem', color: 'var(--muted-text)' }}>\n          Showing <strong>{books.length}</strong> {books.length === 1 ? 'book' : 'books'}\n        </span>\n      </div>",
        "      {/* Results Count & Grid */}\n      <div className=\"bh-results-bar\" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>\n        <span className=\"bh-tag bh-tag--ink\">\n          Showing <strong>{books.length}</strong> {books.length === 1 ? 'book' : 'books'}\n        </span>\n        <span className=\"bh-results-rule\" aria-hidden=\"true\" />\n      </div>",
    ),
    (
        "        <div\n          style={{\n            display: 'grid',\n            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',\n            gap: '24px'\n          }}\n        >\n          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (",
        "        <div\n          className=\"bh-book-grid\"\n          style={{\n            display: 'grid',\n            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',\n            gap: '24px'\n          }}\n        >\n          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (",
    ),
    (
        "        <div\n          style={{\n            display: 'grid',\n            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',\n            gap: '24px'\n          }}\n        >\n          {books.map(book => (",
        "        <div\n          className=\"bh-book-grid\"\n          style={{\n            display: 'grid',\n            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',\n            gap: '24px'\n          }}\n        >\n          {books.map(book => (",
    ),
]

for old, new in replacements:
    if old not in text:
        raise SystemExit('Pattern not found:\n' + old[:200])
    text = text.replace(old, new, 1)

path.write_text(text, encoding='utf-8')
print('Catalog Bauhaus structure applied')
