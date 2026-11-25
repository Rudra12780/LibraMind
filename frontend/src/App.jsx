import React, { useState, useEffect, lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import LibrarianNavbar from './components/LibrarianNavbar';
import AdminNavbar from './components/AdminNavbar';
import UserNavbar from './components/UserNavbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import VisualBlueprintModal from './components/VisualBlueprintModal';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import BookDetails from './pages/BookDetails';
import AiBookFinder from './pages/AiBookFinder';
import SeatAvailability from './pages/SeatAvailability';
import BookCompare from './pages/BookCompare';
import VisitPlanner from './pages/VisitPlanner';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import About from './pages/About';
import HelpContact from './pages/HelpContact';
import TermsPolicies from './pages/TermsPolicies';
import NotificationsPage from './pages/NotificationsPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ReservationsPage from './pages/ReservationsPage';
import ProfileCompletion from './pages/ProfileCompletion';
import NotFound from './pages/NotFound';
import { api, getCleanPathname, getPortalGatewayKind, getActiveAuthToken } from './api';

// Code-split heavy dashboard pages to optimize initial bundle size
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const LibrarianDashboard = lazy(() => import('./pages/LibrarianDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const BlueprintsPage = lazy(() => import('./pages/BlueprintsPage'));

function AppContent() {
  const { user, loading, adminVerified, login, logout, forceResetToGateway, reloadProfile } = useAuth();
  const [activePage, setActivePage] = useState(() => {
    try {
      const cleanPath = getCleanPathname();
      const gw = getPortalGatewayKind(cleanPath);
      if (gw === 'admin') return 'admin-login';
      if (gw === 'librarian') return 'librarian';
      if (gw === 'student') return cleanPath === 'register' ? 'register' : 'login';
    } catch (e) {}
    return 'login';
  });
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [catalogQuery, setCatalogQuery] = useState('');
  const [catalogCategory, setCatalogCategory] = useState('All');
  const [bookNavigationOrigin, setBookNavigationOrigin] = useState({ page: 'catalog', category: 'All' });
  const [compareBookIds, setCompareBookIds] = useState([]);
  const [librarianTab, setLibrarianTab] = useState('issue');
  const [adminTab, setAdminTab] = useState('overview');
  const [userTab, setUserTab] = useState('all');
  const [userStats, setUserStats] = useState({ loanCount: 0, holdCount: 0, seatCount: 0, wishlistCount: 0 });
  const [blueprintPageId, setBlueprintPageId] = useState('home');
  const [visualBlueprintModal, setVisualBlueprintModal] = useState({ isOpen: false, pageId: 'home' });
  const [showPenaltyModal, setShowPenaltyModal] = useState(true);
  const [payingPenalty, setPayingPenalty] = useState(false);

  const handleDownloadPresentation = () => {
    const link = document.createElement('a');
    link.href = '/LibraMind_Design_Thinking_Presentation.pptx';
    link.setAttribute('download', 'LibraMind_Design_Thinking_Presentation.pptx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePayPenalty = async () => {
    setPayingPenalty(true);
    try {
      await api.payPenaltyQr();
      if (reloadProfile) {
        await reloadProfile();
      }
      setShowPenaltyModal(false);
    } catch (err) {
      alert(err.message || 'Payment simulation failed');
    } finally {
      setPayingPenalty(false);
    }
  };

  const handleOpenBlueprints = (pageId = 'home') => {
    setVisualBlueprintModal({ isOpen: true, pageId: pageId || 'home' });
  };

  // Role-based protection: non-authenticated or unauthorized roles cannot enter restricted pages
  useEffect(() => {
    const gw = getPortalGatewayKind(getCleanPathname());
    if (gw === 'admin' && activePage === 'admin-login') {
      if (user && user.role !== 'admin') {
        forceResetToGateway();
      }
      return;
    }
    if (gw === 'librarian' && activePage === 'librarian') {
      if (user && user.role !== 'librarian' && user.role !== 'admin') {
        forceResetToGateway();
      }
      return;
    }

    if (!loading && !user) {
      if (activePage === 'admin' || activePage === 'analytics') {
        setActivePage('admin-login');
      } else if (activePage === 'dashboard' || activePage === 'home') {
        setActivePage('login');
      }
    } else if (user?.role === 'student') {
      if (['admin', 'admin-login', 'librarian', 'analytics'].includes(activePage)) {
        setActivePage('dashboard');
      }
    } else if (user?.role === 'librarian') {
      if (['admin', 'admin-login', 'analytics'].includes(activePage)) {
        setActivePage('librarian');
      }
    } else if (user?.role === 'admin') {
      if ((activePage === 'admin' || activePage === 'analytics') && !adminVerified) {
        setActivePage('admin-login');
      }
    }
  }, [user, loading, activePage, adminVerified, forceResetToGateway]);

  // Synchronize route with browser URL & history
  useEffect(() => {
    const syncRouteFromLocation = () => {
      const rawPath = window.location.pathname.toLowerCase();
      const cleanPath = decodeURIComponent(rawPath).replace(/^\/+|\/+$/g, '');
      const searchParams = new URLSearchParams(window.location.search);
      const urlId = searchParams.get('id');

      // Check for deep book IDs e.g. /books/4 or /book-details/4 or /book-details?id=4
      if (urlId) {
        setSelectedBookId(/^\d+$/.test(String(urlId)) ? parseInt(urlId, 10) : String(urlId));
      } else {
        const booksMatch = cleanPath.match(/^(?:books|book-details)\/([a-zA-Z0-9_-]+)$/);
        if (booksMatch && booksMatch[1]) {
          const rawId = booksMatch[1];
          setSelectedBookId(/^\d+$/.test(rawId) ? parseInt(rawId, 10) : rawId);
        }
      }

      if (cleanPath === 'presentation' || cleanPath === 'ppt' || cleanPath === 'download-ppt' || cleanPath === 'slides') {
        // disabled per user request
        setActivePage(user ? 'dashboard' : 'login');
      } else if (cleanPath.startsWith('books/') || cleanPath.startsWith('book-details/') || cleanPath === 'book-details') {
        setActivePage('book-details');
      } else if (cleanPath === '') {
        // Entry portal http://localhost:5000/ ALWAYS opens Sign In / Register directly first
        setActivePage('login');
      } else if (cleanPath === 'home') {
        if (loading) return;
        if (!user) {
          window.history.replaceState(null, '', '/');
          setActivePage('login');
        } else if (user.role === 'admin' && adminVerified) {
          setActivePage('admin');
        } else if (user.role === 'librarian') {
          setActivePage('librarian');
        } else {
          setActivePage('home');
        }
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
        if (loading) return;
        if (!user) {
          window.history.replaceState(null, '', '/');
          setActivePage('login');
          return;
        }
        if (user.role === 'librarian') {
          setActivePage('librarian');
        } else if (user.role === 'admin') {
          setActivePage('admin');
        } else {
          setActivePage('dashboard');
        }
      } else if (getPortalGatewayKind(cleanPath) === 'librarian') {
        // Librarian gateway entry URLs (/lib@123, /lib@1234, /lib, /librarian, etc.) ALWAYS show Sign In / Register first
        setActivePage('librarian');
      } else if (cleanPath.startsWith('librarian/') || cleanPath.startsWith('lib/')) {
        if (loading) return;
        if (!user || (user.role !== 'librarian' && user.role !== 'admin')) {
          window.history.replaceState(null, '', '/lib@1234');
          setActivePage('librarian');
          return;
        }
        const parts = cleanPath.split('/');
        if (parts.length > 1 && ['issue', 'return', 'inventory', 'reservations', 'seats', 'announcements', 'adminmsg'].includes(parts[1])) {
          setLibrarianTab(parts[1]);
        }
        setActivePage('librarian');
      } else if (getPortalGatewayKind(cleanPath) === 'admin') {
        // Admin gateway entry URLs (/admin@1234, /admin@123, /admin, /admin-login, etc.) ALWAYS show Admin Sign In / Register first
        setActivePage('admin-login');
      } else if (cleanPath.startsWith('admin/')) {
        if (loading) return;
        if (!user || user.role !== 'admin' || !adminVerified) {
          window.history.replaceState(null, '', '/admin@1234');
          setActivePage('admin-login');
          return;
        }
        const parts = cleanPath.split('/');
        if (parts.length > 1 && ['overview', 'users', 'inventory', 'messages', 'audit'].includes(parts[1])) {
          setAdminTab(parts[1]);
        }
        setActivePage('admin');
      } else if (cleanPath === 'analytics' || cleanPath === 'circulation-analytics') {
        if (loading) return;
        if (!user || !adminVerified) {
          window.history.replaceState(null, '', '/admin@1234');
          setActivePage('admin-login');
          return;
        }
        if (user.role === 'student') {
          window.history.replaceState(null, '', '/student/dashboard');
          setActivePage('dashboard');
          return;
        }
        if (user.role === 'librarian') {
          window.history.replaceState(null, '', '/librarian/dashboard');
          setActivePage('librarian');
          return;
        }
        if (user.role !== 'admin') {
          window.history.replaceState(null, '', '/admin@1234');
          setActivePage('admin-login');
          return;
        }
        setActivePage('analytics');
      } else if (cleanPath === 'blueprints' || cleanPath === 'blueprint' || cleanPath === 'wireframes' || cleanPath === 'wireframe') {
        const pageParam = searchParams.get('page') || searchParams.get('id');
        if (pageParam) setBlueprintPageId(pageParam);
        setActivePage('blueprints');
      } else if (cleanPath === 'about') {
        setActivePage('about');
      } else if (cleanPath === 'help' || cleanPath === 'contact' || cleanPath === 'support') {
        setActivePage('contact');
      } else if (cleanPath === 'complete-profile' || cleanPath === 'profile-completion') {
        setActivePage('complete-profile');
      } else if (cleanPath === 'terms' || cleanPath === 'policies' || cleanPath === 'borrowing-rules') {
        setActivePage('terms');
      } else if (cleanPath === 'reservations' || cleanPath === 'my-reservations' || cleanPath === 'holds' || cleanPath === 'waiting-list') {
        setActivePage('reservations');
      } else if (cleanPath === 'forgot-password' || cleanPath === 'forgot') {
        setActivePage('forgot-password');
      } else if (cleanPath === 'reset-password' || cleanPath === 'reset') {
        setActivePage('reset-password');
      } else if (cleanPath === 'notifications') {
        setActivePage('notifications');
      } else if (cleanPath === 'login') {
        setActivePage('login');
      } else if (cleanPath === 'register') {
        setActivePage('register');
      } else {
        // Unknown route -> 404 page
        setActivePage('not-found');
      }
    };

    const handlePopState = () => {
      const cleanPath = getCleanPathname();
      if (getPortalGatewayKind(cleanPath) !== null) {
        forceResetToGateway();
      }
      syncRouteFromLocation();
    };

    syncRouteFromLocation();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user, loading, adminVerified, forceResetToGateway]);

  const navigate = (page, params = {}) => {
    let cleanPage = (page || 'home').toString().replace(/^\/+/, '') || 'home';
    
    // Direct Blueprint page routing
    if (cleanPage === 'blueprints' || cleanPage === 'blueprint' || cleanPage === 'wireframes' || cleanPage === 'visual-blueprints') {
      cleanPage = 'blueprints';
      if (params.page || params.pageId) {
        setBlueprintPageId(params.page || params.pageId);
      }
    }

    // Direct Presentation download interception
    if (cleanPage === 'presentation' || cleanPage === 'ppt' || cleanPage === 'download-ppt' || cleanPage === 'slides') {
      handleDownloadPresentation();
      return;
    }
    
    // Normalize aliases
    if (cleanPage === 'books') cleanPage = 'catalog';
    if (cleanPage === 'ai-book-finder') cleanPage = 'ai-finder';
    if (cleanPage === 'student/dashboard') cleanPage = 'dashboard';
    if (cleanPage === 'help') cleanPage = 'contact';
    if (cleanPage === 'policies') cleanPage = 'terms';

    // Explicit gateway login transitions always reset to clean Sign In / Register screen
    if (
      cleanPage === 'lib@1234' ||
      cleanPage === 'lib@123' ||
      cleanPage === 'librarian-login' ||
      cleanPage === 'lib1234' ||
      cleanPage === 'lib123' ||
      cleanPage.startsWith('lib@') ||
      cleanPage.startsWith('librarian@')
    ) {
      forceResetToGateway();
      setActivePage('librarian');
      try { window.history.pushState(null, '', '/lib@1234'); } catch (_) {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (
      cleanPage === 'admin-login' ||
      cleanPage === 'admin@1234' ||
      cleanPage === 'admin@123' ||
      cleanPage === 'admin1234' ||
      cleanPage === 'admin123' ||
      cleanPage.startsWith('admin@')
    ) {
      forceResetToGateway();
      setActivePage('admin-login');
      try { window.history.pushState(null, '', '/admin@1234'); } catch (_) {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (cleanPage === 'login' || cleanPage === 'register') {
      forceResetToGateway();
      setActivePage(cleanPage);
      try { window.history.pushState(null, '', cleanPage === 'login' ? '/' : '/register'); } catch (_) {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Strict role-based navigation protection
    const effectiveUser = params.user || user || null;

    if (!effectiveUser) {
      if (cleanPage === 'admin' || cleanPage === 'admin-login') {
        cleanPage = 'admin-login';
      } else if (['librarian', 'dashboard', 'analytics', 'home'].includes(cleanPage)) {
        cleanPage = cleanPage === 'librarian' ? 'librarian' : 'login';
      }
    } else if (effectiveUser.role === 'student') {
      if (['admin', 'admin-login', 'librarian', 'analytics'].includes(cleanPage)) {
        cleanPage = 'dashboard';
      }
    } else if (effectiveUser.role === 'librarian') {
      if (['admin', 'admin-login', 'analytics'].includes(cleanPage)) {
        cleanPage = 'librarian';
      }
    }
    // Admin has access to all pages (admin, analytics, librarian, and all public pages)

    // Logged-in users navigating to root/home default to their hub unless scrolling to landing section
    if (effectiveUser && cleanPage === 'home' && !params.scrollTo) {
      if (effectiveUser.role === 'admin' && (adminVerified || params.adminVerified)) cleanPage = 'admin';
      else if (effectiveUser.role === 'librarian') cleanPage = 'librarian';
      else cleanPage = 'dashboard';
    }

    if (params.q !== undefined) {
      setCatalogQuery(params.q);
    }
    if (params.category !== undefined) {
      setCatalogCategory(params.category);
    }
    if (params.bookId !== undefined) {
      setSelectedBookId(params.bookId);
    }
    if (params.pageId !== undefined) {
      setBlueprintPageId(params.pageId);
    } else if (params.page !== undefined && cleanPage === 'blueprints') {
      setBlueprintPageId(params.page);
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

    if (params.scrollTo) {
      setTimeout(() => {
        const el = document.getElementById(params.scrollTo);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    } else if (params.section === 'wishlist') {
      setTimeout(() => {
        const el = document.getElementById('wishlist-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }

    try {
      let targetUrl = '/';
      if (cleanPage === 'login') targetUrl = '/';
      else if (cleanPage === 'register') targetUrl = '/register';
      else if (cleanPage === 'home') targetUrl = effectiveUser ? '/home' : '/';
      else if (cleanPage === 'catalog') targetUrl = '/books';
      else if (cleanPage === 'ai-finder') targetUrl = '/ai-book-finder';
      else if (cleanPage === 'dashboard') targetUrl = '/student/dashboard';
      else if (cleanPage === 'analytics') targetUrl = '/analytics';
      else if (cleanPage === 'librarian') {
        const currentTab = params.tab || librarianTab || 'issue';
        targetUrl = (effectiveUser?.role === 'librarian' || effectiveUser?.role === 'admin')
          ? (currentTab !== 'issue' ? `/librarian/${currentTab}` : '/librarian/dashboard')
          : '/lib@1234';
      }
      else if (cleanPage === 'admin-login') targetUrl = '/admin@1234';
      else if (cleanPage === 'admin') {
        const currentTab = params.tab || adminTab || 'overview';
        targetUrl = (effectiveUser?.role === 'admin' && (adminVerified || params.adminVerified))
          ? (currentTab !== 'overview' ? `/admin/${currentTab}` : '/admin/dashboard')
          : '/admin@1234';
      }
      else if (cleanPage === 'book-details') targetUrl = selectedBookId ? `/books/${selectedBookId}` : '/books';
      else if (cleanPage === 'reservations') targetUrl = '/reservations';
      else if (cleanPage === 'forgot-password') targetUrl = '/forgot-password';
      else if (cleanPage === 'reset-password') targetUrl = '/reset-password';
      else targetUrl = `/${cleanPage}`;

      window.history.pushState(null, '', targetUrl);
    } catch (e) {
      // Ignore in iframe / test sandbox
    }

    if (!params.scrollTo && params.section !== 'wishlist') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const viewBookDetails = (bookId, context = {}) => {
    const validId = /^\d+$/.test(String(bookId)) ? parseInt(bookId, 10) : String(bookId);
    setSelectedBookId(validId);
    const origin = {
      page: context.fromPage || activePage || 'catalog',
      category: context.fromCategory || (activePage === 'catalog' ? catalogCategory : 'All'),
      ...context
    };
    setBookNavigationOrigin(origin);
    setActivePage('book-details');
    try {
      window.history.pushState(null, '', `/books/${validId}`);
    } catch (e) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleCompare = (bookId) => {
    setCompareBookIds((prev) => {
      const normalizedId = /^\d+$/.test(String(bookId)) ? parseInt(bookId, 10) : String(bookId);
      if (prev.some(id => String(id) === String(normalizedId))) {
        return prev.filter((id) => String(id) !== String(normalizedId));
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), normalizedId];
      }
      return [...prev, normalizedId];
    });
  };

  const handleRemoveCompareBook = (bookId) => {
    const normalizedId = /^\d+$/.test(String(bookId)) ? parseInt(bookId, 10) : String(bookId);
    setCompareBookIds((prev) => prev.filter((id) => String(id) !== String(normalizedId)));
  };

  const handleClearCompare = () => {
    setCompareBookIds([]);
  };

  const handleAddCompareBookById = (bookId) => {
    const normalizedId = /^\d+$/.test(String(bookId)) ? parseInt(bookId, 10) : String(bookId);
    setCompareBookIds((prev) => {
      if (prev.some(id => String(id) === String(normalizedId))) return prev;
      if (prev.length >= 3) return [...prev.slice(1), normalizedId];
      return [...prev, normalizedId];
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

  const isAuthPageWithoutNav =
    activePage === 'login' ||
    activePage === 'register' ||
    activePage === 'admin-login' ||
    activePage === 'forgot-password' ||
    activePage === 'reset-password' ||
    (activePage === 'librarian' && (!user || (user.role !== 'librarian' && user.role !== 'admin')));
  const isLibrarianPortal = activePage === 'librarian' && user && (user.role === 'librarian' || user.role === 'admin');
  const isAdminPortal = (activePage === 'admin' || activePage === 'analytics') && user && user.role === 'admin' && adminVerified;
  const isUserPortal = user?.role === 'student' && !isAuthPageWithoutNav;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      {/* 4 Distinct Navigation Portals: Hidden on Auth, Librarian Desk, Admin Portal, Member Hub, or Public Sanctuary */}
      {isAuthPageWithoutNav ? null : isLibrarianPortal ? (
        <LibrarianNavbar
          activePage={activePage}
          activeTab={librarianTab}
          onSelectTab={setLibrarianTab}
          onNavigate={navigate}
          onOpenBlueprints={handleOpenBlueprints}
          onOpenPresentation={handleDownloadPresentation}
        />
      ) : isAdminPortal ? (
        <AdminNavbar
          activePage={activePage}
          activeTab={activePage === 'analytics' ? 'analytics' : adminTab}
          onSelectTab={setAdminTab}
          onNavigate={navigate}
          onOpenBlueprints={handleOpenBlueprints}
          onOpenPresentation={handleDownloadPresentation}
        />
      ) : isUserPortal ? (
        <UserNavbar
          activePage={activePage}
          activeTab={userTab}
          onSelectTab={setUserTab}
          onNavigate={navigate}
          onOpenBlueprints={handleOpenBlueprints}
          onOpenPresentation={handleDownloadPresentation}
          loanCount={userStats.loanCount}
          holdCount={userStats.holdCount}
          seatCount={userStats.seatCount}
          wishlistCount={userStats.wishlistCount}
          compareCount={compareBookIds.length}
        />
      ) : (
        <Navbar
          activePage={activePage}
          onNavigate={navigate}
          onOpenBlueprints={handleOpenBlueprints}
          onOpenPresentation={handleDownloadPresentation}
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
            onOpenBlueprints={handleOpenBlueprints}
          />
        )}

        {activePage === 'catalog' && (
          <Catalog
            initialQuery={catalogQuery}
            initialCategory={catalogCategory}
            onCategoryChange={(cat) => setCatalogCategory(cat)}
            onViewBookDetails={viewBookDetails}
            onNavigate={navigate}
            onAddToCompare={handleToggleCompare}
            compareBookIds={compareBookIds}
          />
        )}

        {activePage === 'book-details' && (
          <BookDetails
            bookId={selectedBookId}
            originCategory={bookNavigationOrigin?.category || catalogCategory}
            originPage={bookNavigationOrigin?.page || 'catalog'}
            onBack={() => {
              const targetPage = bookNavigationOrigin?.page || 'catalog';
              const targetCategory = bookNavigationOrigin?.category || catalogCategory || 'All';
              if (targetPage === 'catalog') {
                setCatalogCategory(targetCategory);
                navigate('catalog', { category: targetCategory });
              } else if (targetPage === 'home') {
                navigate('home', { category: targetCategory });
              } else {
                navigate(targetPage, { category: targetCategory });
              }
            }}
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
            compareBookIds={compareBookIds}
            onAddToCompare={handleToggleCompare}
            onRemoveCompareBook={handleRemoveCompareBook}
            onClearCompare={handleClearCompare}
          />
        )}

        {activePage === 'librarian' && (
          <LibrarianDashboard initialTab={librarianTab} onNavigate={navigate} />
        )}

        {activePage === 'admin-login' && (
          <AdminLogin onNavigate={navigate} />
        )}

        {activePage === 'admin' && (
          (user?.role === 'admin' && adminVerified) ? (
            <AdminDashboard initialTab={adminTab} onNavigate={navigate} />
          ) : (
            <AdminLogin onNavigate={navigate} />
          )
        )}

        {activePage === 'analytics' && (
          (user?.role === 'admin' && adminVerified) ? (
            <AnalyticsPage onNavigate={navigate} />
          ) : (
            <AdminLogin onNavigate={navigate} />
          )
        )}

        {activePage === 'blueprints' && (
          <BlueprintsPage
            onNavigate={navigate}
            initialPageId={blueprintPageId}
            onOpenPresentation={handleDownloadPresentation}
          />
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

        {activePage === 'reservations' && (
          <ReservationsPage
            onNavigate={navigate}
            onSelectBook={viewBookDetails}
          />
        )}

        {activePage === 'forgot-password' && (
          <ForgotPassword onNavigate={navigate} />
        )}

        {activePage === 'reset-password' && (
          <ResetPassword onNavigate={navigate} />
        )}

        {activePage === 'login' && (
          <Login onNavigate={navigate} />
        )}

        {activePage === 'register' && (
          <Register onNavigate={navigate} />
        )}

        {activePage === 'complete-profile' && (
          <ProfileCompletion onNavigate={navigate} />
        )}

        {activePage === 'not-found' && (
          <NotFound onNavigate={navigate} />
        )}
        </Suspense>
      </main>

      {/* Persistent Student Penalty QR Code Enforcement Modal */}
      {user && user.role === 'student' && user.penalty_status === 'pending' && user.penalty_qr_code && showPenaltyModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(37, 40, 32, 0.75)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            className="bio-card"
            style={{
              width: '460px',
              maxWidth: '100%',
              backgroundColor: '#FFF8E9',
              borderRadius: 'var(--radius-sm)',
              padding: '32px 28px',
              border: '2px solid #DC2626',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                fontSize: '1.5rem',
                fontWeight: 700
              }}
            >
              ⚠️
            </div>

            <span className="editorial-kicker" style={{ color: '#DC2626', letterSpacing: '0.08em' }}>
              CIRCULATION PENALTY ACTIVE
            </span>

            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.45rem',
                color: 'var(--editorial-text)',
                margin: '4px 0 8px',
                fontWeight: 700
              }}
            >
              Loan Overdue Penalty Notice
            </h3>

            <p style={{ fontSize: '0.86rem', color: 'var(--editorial-text-muted)', lineHeight: 1.5, marginBottom: '18px' }}>
              Your borrowed volume reached 15 days without return. A circulation fine of{' '}
              <strong style={{ color: '#DC2626', fontSize: '1rem' }}>${(user.penalty_amount || 15.0).toFixed(2)}</strong> has been issued.
              Book borrowing is temporarily blocked until this fine is paid.
            </p>

            {/* Pure SVG QR Code */}
            <div
              style={{
                padding: '12px',
                backgroundColor: '#F9FAFB',
                borderRadius: '8px',
                border: '1px solid var(--retro-brown)',
                display: 'inline-block',
                marginBottom: '16px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <img
                src={user.penalty_qr_code}
                alt="Penalty QR Code"
                style={{ width: '210px', height: '210px', display: 'block', margin: '0 auto' }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--editorial-text-muted)', marginTop: '6px', display: 'block', fontWeight: 600 }}>
                Scan with any UPI / Scholar Wallet app
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={handlePayPenalty}
                disabled={payingPenalty}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#16A34A',
                  borderColor: '#16A34A',
                  fontSize: '0.92rem',
                  fontWeight: 700
                }}
              >
                {payingPenalty ? 'Processing Payment...' : `💳 Simulate Scan & Pay Fine ($${(user.penalty_amount || 15.0).toFixed(2)})`}
              </button>

              <button
                type="button"
                onClick={() => setShowPenaltyModal(false)}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.78rem', padding: '8px' }}
              >
                Dismiss &amp; Browse Site / Study Pods
              </button>
            </div>

            <p style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)', marginTop: '12px', marginBottom: 0 }}>
              * You may continue browsing the library catalog and reserving study pods freely. Book borrowing privileges will restore immediately upon fine payment.
            </p>
          </div>
        </div>
      )}

      {/* Main Website Footer (Hidden inside Auth portals, Librarian and Admin Portals for dedicated workspace feel) */}
      {!isAuthPageWithoutNav && !isLibrarianPortal && !isAdminPortal && (
        <Footer
          onNavigate={navigate}
          onOpenBlueprints={handleOpenBlueprints}
        />
      )}

      {/* Global Visual Blueprint Specification Modal (Available from entire website) */}
      <VisualBlueprintModal
        isOpen={visualBlueprintModal.isOpen}
        onClose={() => setVisualBlueprintModal(prev => ({ ...prev, isOpen: false }))}
        initialPage={visualBlueprintModal.pageId}
      />
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
