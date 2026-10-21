import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AiAssistantModal from './components/AiAssistantModal';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import BookDetails from './pages/BookDetails';
import SeatAvailability from './pages/SeatAvailability';
import StudentDashboard from './pages/StudentDashboard';
import LibrarianDashboard from './pages/LibrarianDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AnalyticsPage from './pages/AnalyticsPage';
import AiBookFinder from './pages/AiBookFinder';
import BookCompare from './pages/BookCompare';
import VisitPlanner from './pages/VisitPlanner';
import Login from './pages/Login';
import Register from './pages/Register';
import { Sparkles, MessageSquare } from 'lucide-react';

function AppContent() {
  const [activePage, setActivePage] = useState('home');
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [catalogQuery, setCatalogQuery] = useState('');
  const [compareBookIds, setCompareBookIds] = useState([]);
  const [showAiModal, setShowAiModal] = useState(false);

  const navigate = (page, params = {}) => {
    if (params.q !== undefined) {
      setCatalogQuery(params.q);
    }
    if (params.bookId !== undefined) {
      setSelectedBookId(params.bookId);
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewBookDetails = (bookId) => {
    setSelectedBookId(bookId);
    setActivePage('book-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleCompare = (bookId) => {
    setCompareBookIds((prev) => {
      const numId = parseInt(bookId, 10);
      if (prev.includes(numId)) {
        return prev.filter((id) => id !== numId);
      }
      if (prev.length >= 3) {
        // Keep at most 3
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      <Navbar
        activePage={activePage}
        onNavigate={navigate}
        compareCount={compareBookIds.length}
      />

      <main className="page-container animate-fade-in" key={activePage}>
        {activePage === 'home' && (
          <Home
            onNavigate={navigate}
            onViewBookDetails={viewBookDetails}
          />
        )}

        {activePage === 'catalog' && (
          <Catalog
            initialQuery={catalogQuery}
            onViewBookDetails={viewBookDetails}
            onNavigate={navigate}
            onAddToCompare={handleToggleCompare}
            compareBookIds={compareBookIds}
          />
        )}

        {activePage === 'book-details' && (
          <BookDetails
            bookId={selectedBookId}
            onBack={() => setActivePage('catalog')}
            onNavigate={navigate}
            onAddToCompare={handleToggleCompare}
            compareBookIds={compareBookIds}
          />
        )}

        {activePage === 'ai-finder' && (
          <AiBookFinder
            onViewBookDetails={viewBookDetails}
            onNavigate={navigate}
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
            onNavigate={navigate}
            onViewBookDetails={viewBookDetails}
          />
        )}

        {activePage === 'librarian' && (
          <LibrarianDashboard onNavigate={navigate} />
        )}

        {activePage === 'admin' && (
          <AdminDashboard onNavigate={navigate} />
        )}

        {activePage === 'analytics' && (
          <AnalyticsPage onNavigate={navigate} />
        )}

        {activePage === 'login' && (
          <Login onNavigate={navigate} />
        )}

        {activePage === 'register' && (
          <Register onNavigate={navigate} />
        )}
      </main>

      {/* Floating AI Assistant Trigger */}
      <button
        onClick={() => setShowAiModal(true)}
        aria-label="Open AI Assistant"
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          zIndex: 900,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 20px',
          backgroundColor: 'var(--forest)',
          color: '#FAF8F1',
          border: '1.5px solid rgba(220, 229, 213, 0.4)',
          borderRadius: '50px',
          boxShadow: '0 8px 24px rgba(38, 53, 43, 0.3)',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '0.92rem',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(38, 53, 43, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(38, 53, 43, 0.3)';
        }}
      >
        <Sparkles size={18} color="#DCE5D5" />
        <span>Ask LibraMind AI</span>
      </button>

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        onNavigate={navigate}
      />

      <Footer onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}
