navbar_path = r'c:\Users\ADMIN\Desktop\smartlib\frontend\src\components\Navbar.jsx'

with open(navbar_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update isItemActive
old_active = """    if (id === 'visit-planner' && activePage === 'visit-planner') return true;
    if (id === 'reservations' && activePage === 'reservations') return true;
    return false;"""

new_active = """    if (id === 'visit-planner' && activePage === 'visit-planner') return true;
    if (id === 'reservations' && activePage === 'reservations') return true;
    if (id === 'terms' && activePage === 'terms') return true;
    if (id === 'about' && activePage === 'about') return true;
    if (id === 'contact' && activePage === 'contact') return true;
    return false;"""

code = code.replace(old_active, new_active)

# 2. Add publicNavItems
old_nav_items = """    { id: 'visit-planner', label: 'Plan Visit', action: () => { setMobileOpen(false); onNavigate('visit-planner'); } },
    { id: 'reservations', label: 'Hold Queues', action: () => { setMobileOpen(false); onNavigate('reservations'); } }
  ];"""

new_nav_items = """    { id: 'visit-planner', label: 'Plan Visit', action: () => { setMobileOpen(false); onNavigate('visit-planner'); } },
    { id: 'reservations', label: 'Hold Queues', action: () => { setMobileOpen(false); onNavigate('reservations'); } }
  ];

  const publicNavItems = [
    { id: 'home', label: 'Home', action: () => { setMobileOpen(false); onNavigate('home'); } },
    { id: 'catalog', label: 'Books', action: () => { setMobileOpen(false); onNavigate('catalog'); } },
    { id: 'terms', label: 'Rules & Policies', action: () => { setMobileOpen(false); onNavigate('terms'); } },
    { id: 'about', label: 'About', action: () => { setMobileOpen(false); onNavigate('about'); } },
    { id: 'contact', label: 'Help Desk', action: () => { setMobileOpen(false); onNavigate('contact'); } }
  ];"""

code = code.replace(old_nav_items, new_nav_items)

# 3. Update desktop nav mapping
code = code.replace(
    "{navItems.map(item => {",
    "{(user ? navItems : publicNavItems).map(item => {"
)

with open(navbar_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated Navbar.jsx successfully")
