import React, { useState, useEffect, lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import LibrarianNavbar from './components/LibrarianNavbar';
import AdminNavbar from './components/AdminNavbar';
import UserNavbar from './components/UserNavbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import BookDetails from './pages/BookDetails';
import AiBookFinder from './pages/AiBookFinder';
import SeatAvailability from './pages/SeatAvailability';
import BookCompare from './pages/BookCompare';
import VisitPlanner from './pages/VisitPlanner';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import HelpContact from './pages/HelpContact';
import TermsPolicies from './pages/TermsPolicies';
import NotificationsPage from './pages/NotificationsPage';
import NotFound from './pages/NotFound';

// Code-split heavy dashboard pages to optimize initial bundle size
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const LibrarianDashboard = lazy(() => import('./pages/LibrarianDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));

function AppContent() {
  const { user, loading, adminVerified } = useAuth();
  const [activePage, setActivePage] = useState('home');
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [catalogQuery, setCatalogQuery] = useState('');
  const [catalogCategory, setCatalogCategory] = useState('All');
  const [compareBookIds, setCompareBookIds] = useState([]);
  const [librarianTab, setLibrarianTab] = useState('issue');
  const [adminTab, setAdminTab] = useState('overview');
  const [userTab, setUserTab] = useState('all');
  const [userStats, setUserStats] = useState({ loanCount: 0, holdCount: 0, seatCount: 0, wishlistCount: 0 });

  // Role-based protection: Students cannot enter staff or admin pages
  useEffect(() => {
    if (user?.role === 'student') {
      if (['admin', 'librarian', 'analytics'].includes(activePage)) {
        setActivePage('dashboard');
      }
    } else if (user?.role === 'librarian') {
      if (['admin', 'analytics'].includes(activePage)) {
        setActivePage('librarian');
      }
    } else if (user?.role === 'admin') {
      if (activePage === 'analytics' && !adminVerified) {
        setActivePage('admin');
      }
    }
  }, [user?.role, activePage, adminVerified]);

  // Synchronize route with browser URL & history
  useEffect(() => {
    const syncRouteFromLocation = () => {
      const rawPath = window.location.pathname.toLowerCase();
      const cleanPath = decodeURIComponent(rawPath).replace(/^\/+|\/+$/g, '');
      const searchParams = new URLSearchParams(window.location.search);
      const urlId = searchParams.get('id');

      // Check for deep book IDs e.g. /books/4 or /book-details/4 or /book-details?id=4
      if (urlId) {
        setSelectedBookId(parseInt(urlId, 10) || urlId);
      } else {
        const booksMatch = cleanPath.match(/^(?:books|book-details)\/(\d+)$/);
        if (booksMatch && booksMatch[1]) {
          setSelectedBookId(parseInt(booksMatch[1], 10));
        }
      }

      if (cleanPath.startsWith('books/') || cleanPath.startsWith('book-details/') || cleanPath === 'book-details') {
        setActivePage('book-details');
      } else if (cleanPath === '' || cleanPath === 'home') {
        // Main landing page opens by default at http://localhost:5000
        setActivePage('home');
      } else if (cleanPath === 'books' || cleanPath === 'catalog') {
        setActivePage('catalog');
      } else if (cleanPath === 'ai-book-finder' || cleanPath === 'ai-finder') {
        setActivePage('ai-finder');
      } else if (cleanPath === 'seats' || cleanPath === 'study-seats' || cleanPath === 'my-seats') {
        setActivePage('seats');
      } else if (cleanPath === 'compare' || cleanPath === 'book-match') {
        setActivePage('compare');
      } else if (cleanPath === 'visit-planner' || cleanPath === 'planner') {
        setActivePage('visit-planner');
      } else if (
        cleanPath === 'student/dashboard' ||
        cleanPath === 'dashboard' ||
        cleanPath === 'student' ||
        cleanPath === 'my-books' ||
        cleanPath === 'my-reservations' ||
        cleanPath === 'wishlist' ||
        cleanPath === 'profile'
      ) {
        if (user && user.role === 'librarian') {
          setActivePage('librarian');
        } else if (user && user.role === 'admin' && adminVerified) {
          setActivePage('admin');
        } else {
          setActivePage('dashboard');
        }
      } else if (
        cleanPath === 'librarian@1234' ||
        cleanPath === 'librarian1234' ||
        cleanPath === 'librarian/dashboard' ||
        cleanPath.startsWith('librarian')
      ) {
        const parts = cleanPath.split('/');
        if (parts.length > 1 && ['issue', 'return', 'inventory', 'reservations', 'seats', 'announcements', 'adminmsg'].includes(parts[1])) {
          setLibrarianTab(parts[1]);
        }
        setActivePage('librarian');
      } else if (
        cleanPath === 'admin@1234' ||
        cleanPath === 'admin1234' ||
        cleanPath === 'admin/dashboard' ||
        cleanPath === 'admin' ||
        cleanPath.startsWith('admin')
      ) {
        const parts = cleanPath.split('/');
        if (parts.length > 1 && ['overview', 'users', 'inventory', 'messages', 'audit'].includes(parts[1])) {
          setAdminTab(parts[1]);
        }
        setActivePage('admin');
      } else if (cleanPath === 'analytics' || cleanPath === 'circulation-analytics') {
        setActivePage('analytics');
      } else if (cleanPath === 'about') {
        setActivePage('about');
      } else if (cleanPath === 'help' || cleanPath === 'contact' || cleanPath === 'support') {
        setActivePage('contact');
      } else if (cleanPath === 'terms' || cleanPath === 'policies' || cleanPath === 'borrowing-rules') {
        setActivePage('terms');
      } else if (cleanPath === 'notifications') {
        setActivePage('notifications');
      } else if (cleanPath === 'login') {
        if (user) {
          if (user.role === 'admin' && adminVerified) setActivePage('admin');
          else if (user.role === 'librarian') setActivePage('librarian');
          else setActivePage('dashboard');
        } else {
          setActivePage('login');
        }
      } else if (cleanPath === 'register') {
        if (user) {
          if (user.role === 'admin' && adminVerified) setActivePage('admin');
          else if (user.role === 'librarian') setActivePage('librarian');
          else setActivePage('dashboard');
        } else {
          setActivePage('register');
        }
      } else {
        // Unknown route -> 404 page
        setActivePage('not-found');
      }
    };

    syncRouteFromLocation();
    window.addEventListener('popstate', syncRouteFromLocation);
    return () => window.removeEventListener('popstate', syncRouteFromLocation);
  }, [user, adminVerified]);

  const navigate = (page, params = {}) => {
    let cleanPage = (page || 'home').toString().replace(/^\/+/, '') || 'home';
    
    // Normalize aliases
    if (cleanPage === 'books') cleanPage = 'catalog';
    if (cleanPage === 'ai-book-finder') cleanPage = 'ai-finder';
    if (cleanPage === 'student/dashboard') cleanPage = 'dashboard';
    if (cleanPage === 'help') cleanPage = 'contact';
    if (cleanPage === 'policies') cleanPage = 'terms';

    // Strict role-based navigation protection
    if (user && user.role === 'student') {
      if (['admin', 'librarian', 'analytics'].includes(cleanPage)) {
        cleanPage = 'dashboard';
      }
    } else if (user && user.role === 'librarian') {
      if (['admin', 'analytics'].includes(cleanPage)) {
        cleanPage = 'librarian';
      }
    }
    // Admin has access to all pages (admin, analytics, librarian, and all public pages)

    if (params.q !== undefined) {
      setCatalogQuery(params.q);
    }
    if (params.category !== undefined) {
      setCatalogCategory(params.category);
    }
    if (params.bookId !== undefined) {
      setSelectedBookId(params.bookId);
    }
    if (params.adminTab !== undefined) {
      setAdminTab(params.adminTab);
    }
    if (params.userTab !== undefined) {
      setUserTab(params.userTab);
    }
    if (params.tab !== undefined) {
      if (cleanPage === 'admin') {
        setAdminTab(params.tab);
      } else if (cleanPage === 'librarian') {
        setLibrarianTab(params.tab);
      } else if (cleanPage === 'dashboard') {
        setUserTab(params.tab);
      }
    }

    setActivePage(cleanPage);

    if (params.section === 'wishlist') {
      setTimeout(() => {
        const el = document.getElementById('wishlist-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }

    try {
      let targetUrl = '/';
      if (cleanPage === 'home') targetUrl = '/';
      else if (cleanPage === 'catalog') targetUrl = '/books';
      else if (cleanPage === 'ai-finder') targetUrl = '/ai-book-finder';
      else if (cleanPage === 'dashboard') targetUrl = '/student/dashboard';
      else if (cleanPage === 'analytics') targetUrl = '/analytics';
      else if (cleanPage === 'librarian' || cleanPage === 'librarian@1234') {
        const currentTab = params.tab || librarianTab || 'issue';
        targetUrl = user?.role === 'librarian' || user?.role === 'admin'
          ? (currentTab !== 'issue' ? `/librarian/${currentTab}` : '/librarian/dashboard')
          : '/librarian@1234';
      }
      else if (cleanPage === 'admin' || cleanPage === 'admin@1234') {
        const currentTab = params.tab || adminTab || 'overview';
        targetUrl = (user?.role === 'admin' && adminVerified)
          ? (currentTab !== 'overview' ? `/admin/${currentTab}` : '/admin/dashboard') 
          : '/admin';
      }
      else if (cleanPage === 'book-details') targetUrl = selectedBookId ? `/books/${selectedBookId}` : '/books';
      else targetUrl = `/${cleanPage}`;

      window.history.pushState(null, '', targetUrl);
    } catch (e) {
      // Ignore in iframe / test sandbox
    }

    if (params.section !== 'wishlist') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const viewBookDetails = (bookId) => {
    const validId = parseInt(bookId, 10) || bookId;
    setSelectedBookId(validId);
    setActivePage('book-details');
    try {
      window.history.pushState(null, '', `/books/${validId}`);
    } catch (e) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleCompare = (bookId) => {
    setCompareBookIds((prev) => {
      const numId = parseInt(bookId, 10);
      if (prev.includes(numId)) {
        return prev.filter((id) => id !== numId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), numId];
      }
      return [...prev, numId];
    });
  };

  const handleRemoveCompareBook = (bookId) => {
    const numId = parseInt(bookId, 10);
    setCompareBookIds((prev) => prev.filter((id) => id !== numId));
  };

  const handleClearCompare = () => {
    setCompareBookIds([]);
  };

  const handleAddCompareBookById = (bookId) => {
    const numId = parseInt(bookId, 10);
    setCompareBookIds((prev) => {
      if (prev.includes(numId)) return prev;
      if (prev.length >= 3) return [...prev.slice(1), numId];
      return [...prev, numId];
    });
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--cream)',
          gap: '16px'
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            border: '3px solid var(--subtle-border)',
            borderTop: '3px solid var(--forest)',
            animation: 'spin 0.8s linear infinite'
          }}
        />
        <span
          style={{
            fontSize: '1.05rem',
            color: 'var(--forest-dark)',
            fontWeight: 700,
            fontFamily: 'var(--font-serif)',
            letterSpacing: '0.02em'
          }}
        >
          LibraMind Sanctuary
        </span>
      </div>
    );
  }

  const isLibrarianPortal = activePage === 'librarian';
  const isAdminPortal = (activePage === 'admin' || activePage === 'analytics') && adminVerified;
  const isUserPortal = activePage === 'dashboard' && user;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      {/* 4 Distinct Navigation Portals: Librarian Desk, Admin Portal, Member Hub, or Public Sanctuary */}
      {isLibrarianPortal ? (
        <LibrarianNavbar
          activePage={activePage}
          activeTab={librarianTab}
          onSelectTab={setLibrarianTab}
          onNavigate={navigate}
        />
      ) : isAdminPortal ? (
        <AdminNavbar
          activePage={activePage}
          activeTab={activePage === 'analytics' ? 'analytics' : adminTab}
          onSelectTab={setAdminTab}
          onNavigate={navigate}
        />
      ) : isUserPortal ? (
        <UserNavbar
          activeTab={userTab}
          onSelectTab={setUserTab}
          onNavigate={navigate}
          loanCount={userStats.loanCount}
          holdCount={userStats.holdCount}
          seatCount={userStats.seatCount}
          wishlistCount={userStats.wishlistCount}
        />
      ) : (
        <Navbar
          activePage={activePage}
          onNavigate={navigate}
          compareCount={compareBookIds.length}
        />
      )}

      <main className="page-container animate-fade-in" key={activePage}>
        <Suspense fallback={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', gap: '12px' }}>
            <div className="spinner" style={{ width: '28px', height: '28px', border: '3px solid var(--subtle-border)', borderTop: '3px solid var(--forest)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ fontSize: '0.92rem', color: 'var(--muted-text)', fontWeight: 500 }}>Loading dashboard modules...</span>
          </div>
        }>
        {activePage === 'home' && (
          <Home
            onNavigate={navigate}
            onViewBookDetails={viewBookDetails}
          />
        )}

        {activePage === 'catalog' && (
          <Catalog
            initialQuery={catalogQuery}
            initialCategory={catalogCategory}
            onViewBookDetails={viewBookDetails}
            onNavigate={navigate}
            onAddToCompare={handleToggleCompare}
            compareBookIds={compareBookIds}
          />
        )}

        {activePage === 'book-details' && (
          <BookDetails
            bookId={selectedBookId}
            onBack={() => navigate('catalog')}
            onNavigate={navigate}
            onAddToCompare={handleToggleCompare}
            compareBookIds={compareBookIds}
          />
        )}

        {activePage === 'ai-finder' && (
          <AiBookFinder
            onNavigate={navigate}
            onViewBookDetails={viewBookDetails}
            onAddToCompare={handleToggleCompare}
            compareBookIds={compareBookIds}
          />
        )}

        {activePage === 'compare' && (
          <BookCompare
            compareBookIds={compareBookIds}
            onRemoveBook={handleRemoveCompareBook}
            onClearCompare={handleClearCompare}
            onAddBookById={handleAddCompareBookById}
            onViewBookDetails={viewBookDetails}
            onNavigate={navigate}
          />
        )}

        {activePage === 'visit-planner' && (
          <VisitPlanner
            onViewBookDetails={viewBookDetails}
            onNavigate={navigate}
          />
        )}

        {activePage === 'seats' && (
          <SeatAvailability onNavigate={navigate} />
        )}

        {activePage === 'dashboard' && (
          <StudentDashboard
            initialTab={userTab}
            onTabChange={setUserTab}
            onUpdateStats={setUserStats}
            onNavigate={navigate}
            onViewBookDetails={viewBookDetails}
          />
        )}

        {activePage === 'librarian' && (
          <LibrarianDashboard initialTab={librarianTab} onNavigate={navigate} />
        )}

        {activePage === 'admin' && (
          <AdminDashboard initialTab={adminTab} onNavigate={navigate} />
        )}

        {activePage === 'analytics' && (
          <AnalyticsPage onNavigate={navigate} />
        )}

        {activePage === 'about' && (
          <About onNavigate={navigate} />
        )}

        {activePage === 'contact' && (
          <HelpContact onNavigate={navigate} />
        )}

        {activePage === 'terms' && (
          <TermsPolicies onNavigate={navigate} />
        )}

        {activePage === 'notifications' && (
          <NotificationsPage onNavigate={navigate} />
        )}

        {activePage === 'login' && (
          <Login onNavigate={navigate} />
        )}

        {activePage === 'register' && (
          <Register onNavigate={navigate} />
        )}

        {activePage === 'not-found' && (
          <NotFound onNavigate={navigate} />
        )}
        </Suspense>
      </main>

      {/* Main Website Footer (Hidden inside Librarian and Admin Portals for dedicated workspace feel) */}
      {!isLibrarianPortal && !isAdminPortal && (
        <Footer onNavigate={navigate} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
