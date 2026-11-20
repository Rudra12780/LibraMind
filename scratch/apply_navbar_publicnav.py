from pathlib import Path

path = Path(__file__).resolve().parents[1] / 'frontend' / 'src' / 'components' / 'Navbar.jsx'
text = path.read_text(encoding='utf-8')

replacements = [
    (
        "    if (id === 'reservations' && activePage === 'reservations') return true;\n    return false;\n  };",
        "    if (id === 'reservations' && activePage === 'reservations') return true;\n"
        "    if (id === 'about' && activePage === 'about') return true;\n"
        "    if (id === 'contact' && activePage === 'contact') return true;\n"
        "    if (id === 'terms' && activePage === 'terms') return true;\n"
        "    if (id === 'explore' && (activePage === 'catalog' || activePage === 'book-details')) return true;\n"
        "    return false;\n  };",
    ),
    (
        "    { id: 'reservations', label: 'Waiting Lists', action: () => { setMobileOpen(false); onNavigate('reservations'); } }\n  ];\n\n  const userInitial",
        "    { id: 'reservations', label: 'Waiting Lists', action: () => { setMobileOpen(false); onNavigate('reservations'); } }\n  ];\n\n"
        "  // Guests get a clear horizontal public navigation instead of an empty bar.\n"
        "  const scrollToExplore = () => {\n"
        "    setMobileOpen(false);\n"
        "    if (activePage !== 'home') {\n"
        "      onNavigate('home');\n"
        "      window.setTimeout(() => document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' }), 180);\n"
        "    } else {\n"
        "      document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });\n"
        "    }\n"
        "  };\n\n"
        "  const publicNavItems = [\n"
        "    { id: 'home', label: 'Home', action: () => { setMobileOpen(false); onNavigate('home'); } },\n"
        "    { id: 'explore', label: 'Explore Books', action: scrollToExplore },\n"
        "    { id: 'about', label: 'About', action: () => { setMobileOpen(false); onNavigate('about'); } },\n"
        "    { id: 'contact', label: 'Help', action: () => { setMobileOpen(false); onNavigate('contact'); } },\n"
        "    { id: 'terms', label: 'Policies', action: () => { setMobileOpen(false); onNavigate('terms'); } }\n"
        "  ];\n\n  const userInitial",
    ),
    (
        "        {/* Desktop Navigation Links - Shown only when signed in; completely blank for unauthenticated visitors */}\n"
        "        {user ? (\n"
        "          <nav\n"
        "            style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 1.3vw, 18px)' }}\n"
        "            className=\"desktop-nav\"\n"
        "          >\n"
        "            {navItems.map(item => {",
        "        {/* Desktop navigation — member workspace links or public site links */}\n"
        "        {(\n"
        "          <nav\n"
        "            style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 1.3vw, 18px)' }}\n"
        "            className=\"desktop-nav\"\n"
        "          >\n"
        "            {(user ? navItems : publicNavItems).map(item => {",
    ),
    (
        "          </nav>\n        ) : (\n          /* Blank navigation area for guests */\n          <div className=\"desktop-nav\" style={{ flex: 1 }} />\n        )}",
        "          </nav>\n        )}",
    ),
    (
        "              Intelligent Library &amp; Research Sanctuary",
        "              Bauhaus Digital Library &amp; Research System",
    ),
    (
        "              <div style={{ padding: '8px 0', textAlign: 'center' }}>\n"
        "                <p style={{ fontSize: '0.86rem', color: 'var(--editorial-text-muted)', margin: '0 0 12px', lineHeight: 1.5 }}>\n"
        "                  Welcome to LibraMind Sanctuary. Please sign in or join the library to access internal collections and member services.\n"
        "                </p>\n"
        "              </div>",
        "              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>\n"
        "                {publicNavItems.map(item => {\n"
        "                  const active = isItemActive(item.id);\n"
        "                  return (\n"
        "                    <button\n"
        "                      key={item.id}\n"
        "                      onClick={item.action}\n"
        "                      style={{\n"
        "                        background: active ? 'var(--bauhaus-yellow-light)' : 'var(--bauhaus-offwhite)',\n"
        "                        border: '2px solid var(--bauhaus-charcoal)',\n"
        "                        borderRadius: '2px',\n"
        "                        padding: '12px 16px',\n"
        "                        fontSize: '0.9rem',\n"
        "                        fontWeight: active ? 800 : 600,\n"
        "                        color: 'var(--bauhaus-charcoal)',\n"
        "                        display: 'flex',\n"
        "                        alignItems: 'center',\n"
        "                        justifyContent: 'space-between',\n"
        "                        cursor: 'pointer',\n"
        "                        textAlign: 'left'\n"
        "                      }}\n"
        "                    >\n"
        "                      <span>{item.label}</span>\n"
        "                      <ArrowRight size={14} />\n"
        "                    </button>\n"
        "                  );\n"
        "                })}\n"
        "              </div>",
    ),
]

for old, new in replacements:
    if old not in text:
        raise SystemExit(f'Pattern not found:\n{old[:160]}')
    text = text.replace(old, new, 1)

path.write_text(text, encoding='utf-8')
print('Navbar public navigation reapplied')
