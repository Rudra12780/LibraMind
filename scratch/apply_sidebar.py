from pathlib import Path

path = Path(__file__).resolve().parents[1] / 'frontend' / 'src' / 'App.jsx'
text = path.read_text(encoding='utf-8')

old_import = "import UserNavbar from './components/UserNavbar';\n"
new_import = "import UserNavbar from './components/UserNavbar';\nimport DashboardSidebar from './components/DashboardSidebar';\n"
assert old_import in text
text = text.replace(old_import, new_import, 1)

old_open = """      <main className="page-container animate-fade-in" key={activePage}>
"""
new_open = """      <div className={`bh-app-shell ${showSidebar ? 'has-sidebar' : ''}`}>
      {showSidebar && (
        <DashboardSidebar
          role={sidebarRole}
          activePage={activePage}
          activeTab={sidebarTab}
          onNavigate={navigate}
          onSelectTab={sidebarRole === 'student' ? setUserTab : sidebarRole === 'librarian' ? setLibrarianTab : setAdminTab}
        />
      )}

      <main className="page-container animate-fade-in" key={activePage}>
"""
assert old_open in text
text = text.replace(old_open, new_open, 1)

old_close = """        </Suspense>
      </main>

      {/* Persistent Student Penalty QR Code Enforcement Modal */}
"""
new_close = """        </Suspense>
      </main>
      </div>

      {/* Persistent Student Penalty QR Code Enforcement Modal */}
"""
assert old_close in text
text = text.replace(old_close, new_close, 1)

old_flags = """  const isLibrarianPortal = activePage === 'librarian' || (user?.role === 'librarian' && ['librarian', 'home'].includes(activePage));
  const isAdminPortal = (activePage === 'admin' || activePage === 'analytics') && adminVerified;
  const isUserPortal = Boolean(user && user.role !== 'librarian' && !(user.role === 'admin' && adminVerified));
"""
new_flags = old_flags + """  const sidebarRole = isLibrarianPortal ? 'librarian' : isAdminPortal ? 'admin' : isUserPortal ? 'student' : null;
  const showSidebar = Boolean(sidebarRole);
  const sidebarTab = isLibrarianPortal ? librarianTab : isAdminPortal ? (activePage === 'analytics' ? 'analytics' : adminTab) : userTab;
"""
assert old_flags in text
text = text.replace(old_flags, new_flags, 1)

path.write_text(text, encoding='utf-8')
print('DashboardSidebar integrated into App.jsx')
