import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  ArrowRightLeft,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Plus,
  Bookmark,
  Armchair,
  Megaphone,
  BarChart3,
  Search,
  Filter,
  Check,
  MapPin,
  Clock,
  Layers,
  Send,
  Upload,
  CopyPlus,
  Camera,
  Image as ImageIcon,
  X,
  ShieldAlert,
  Lock,
  AlertCircle,
  Key
} from 'lucide-react';

export function resolveBookCoverUrl(url) {
  if (!url) return 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
  return url;
}

export default function LibrarianDashboard({ onNavigate, initialTab = 'issue' }) {
  const { user, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [overview, setOverview] = useState(null);
  const [loans, setLoans] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [books, setBooks] = useState([]);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Librarian Portal Gateway Sign-in state
  const [libEmail, setLibEmail] = useState('');
  const [libPassword, setLibPassword] = useState('');
  const [libLoginError, setLibLoginError] = useState('');
  const [loggingInLib, setLoggingInLib] = useState(false);

  // Form states
  // 1. Issue
  const [issueMemberId, setIssueMemberId] = useState('');
  const [issueCopyCode, setIssueCopyCode] = useState('');
  const [issueDays, setIssueDays] = useState('14');

  // 2. Add Book & Device Image Upload
  const [newBook, setNewBook] = useState({
    title: '', author: '', isbn: '', publisher: '', publication_year: 2024,
    category: 'Classic Novels', edition: '1st Edition', language: 'English',
    floor: 'Floor 1', section: 'Classic Literature Gallery', shelf: 'Shelf CL-01', rack: 'Rack 01',
    total_copies: 1, description: '', cover_image: ''
  });
  const [imagePreview, setImagePreview] = useState(null);

  // 3. Add More Copies to Existing Book
  const [copyBookId, setCopyBookId] = useState('');
  const [copyCount, setCopyCount] = useState(1);
  const [copyCondition, setCopyCondition] = useState('New');
  const [addingCopies, setAddingCopies] = useState(false);

  // 4. Message Administration (Librarian -> Admin Direct Hotline)
  const [adminMsgTitle, setAdminMsgTitle] = useState('');
  const [adminMsgBody, setAdminMsgBody] = useState('');
  const [sendingAdminMsg, setSendingAdminMsg] = useState(false);

  // 4b. Inventory Requisition to Admin
  const [restockBookId, setRestockBookId] = useState('');
  const [restockQty, setRestockQty] = useState(2);
  const [restockPriority, setRestockPriority] = useState('Standard');
  const [restockReason, setRestockReason] = useState('Out of stock (0 available copies)');
  const [restockNotes, setRestockNotes] = useState('');
  const [sendingRestock, setSendingRestock] = useState(false);

  // 5. Announcement
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');

  // 6. Upload Original Photo Modal (for Held Books and Quick Desk Actions)
  const [photoModalBook, setPhotoModalBook] = useState(null);
  const [modalPhotoPreview, setModalPhotoPreview] = useState(null);
  const [modalUploading, setModalUploading] = useState(false);

  // 7. Inventory Section: Upload Original Photo for Existing Book
  const [inventoryPhotoBookId, setInventoryPhotoBookId] = useState('');
  const [inventoryPhotoPreview, setInventoryPhotoPreview] = useState(null);
  const [inventoryPhotoUploading, setInventoryPhotoUploading] = useState(false);

  const fetchLibrarianData = useCallback(async () => {
    if (!user || (user.role !== 'librarian' && user.role !== 'admin')) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [overviewData, loansData, resData, booksData, seatsData] = await Promise.all([
        api.getAnalyticsOverview(),
        api.getLoans(),
        api.getReservations(),
        api.getBooks({ limit: 100 }),
        api.getSeats()
      ]);
      setOverview(overviewData);
      setLoans(loansData || []);
      setReservations(resData || []);
      setBooks(booksData.books || []);
      setSeats(seatsData.seats || []);
    } catch (err) {
      console.error('Failed to load librarian data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLibrarianData();
  }, [fetchLibrarianData]);

  const showToast = (msg, isError = false) => {
    setToastMessage({ msg, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Device File Upload Handler (Offline accessible)
  const handleDeviceImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        showToast('Image file exceeds 8MB limit. Please choose a smaller photo.', true);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        setNewBook(prev => ({ ...prev, cover_image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Issue Book Handler
  const handleIssueBook = async (e) => {
    e.preventDefault();
    try {
      const res = await api.issueBook({
        membership_id: issueMemberId.trim(),
        copy_code: issueCopyCode.trim(),
        loan_days: issueDays
      });
      showToast(`Success: Issued ${res.copyCode} to ${res.memberName}!`);
      setIssueMemberId('');
      setIssueCopyCode('');
      fetchLibrarianData();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  // Return Book Handler
  const handleReturnBook = async (loanId) => {
    try {
      const res = await api.returnBook(loanId);
      showToast(`Book returned! ${res.fineAmount > 0 ? `Late fine: $${res.fineAmount.toFixed(2)}` : 'No fine'}`);
      fetchLibrarianData();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  // Reservation Pickup Handler
  const handleMarkPickup = async (resId) => {
    try {
      await api.markReservationPickup(resId);
      showToast('Hold marked ready for pickup! Student has been notified.');
      fetchLibrarianData();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  // Add Book Handler (with duplicate protection)
  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await api.createBook(newBook);
      showToast(`Success: Cataloged "${newBook.title}" with ${newBook.total_copies} physical copies!`);
      setNewBook({
        title: '', author: '', isbn: '', publisher: '', publication_year: 2024,
        category: 'Computer Science', edition: '1st Edition', language: 'English',
        floor: 'Floor 1', section: 'Tech & Engineering', shelf: 'Shelf CS-01', rack: 'Rack 01',
        total_copies: 1, description: '', cover_image: ''
      });
      setImagePreview(null);
      fetchLibrarianData();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  // Add Copies to Existing Book Handler
  const handleAddCopiesToExisting = async (e) => {
    e.preventDefault();
    if (!copyBookId) {
      showToast('Please select an existing book from the catalog first', true);
      return;
    }
    setAddingCopies(true);
    try {
      const res = await api.addBookCopy(copyBookId, { count: copyCount, condition: copyCondition });
      showToast(res.message || `Added ${copyCount} copies to book!`);
      setCopyCount(1);
      fetchLibrarianData();
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setAddingCopies(false);
    }
  };

  // Message Administrator Hotline Handler (Only Librarian can message Admin)
  const handleSendMessageToAdmin = async (e) => {
    e.preventDefault();
    if (!adminMsgTitle.trim() || !adminMsgBody.trim()) {
      showToast('Subject and message content are required', true);
      return;
    }
    setSendingAdminMsg(true);
    try {
      const res = await api.messageAdmin({ title: adminMsgTitle.trim(), message: adminMsgBody.trim() });
      showToast(res.message || 'Direct dispatch securely sent to Library Administration!');
      setAdminMsgTitle('');
      setAdminMsgBody('');
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setSendingAdminMsg(false);
    }
  };

  // Restock Requisition Handler
  const handleSendRestockRequisition = async (e) => {
    e.preventDefault();
    if (!restockBookId) {
      showToast('Please select a catalog book to restock', true);
      return;
    }
    const book = books.find(b => String(b.id) === String(restockBookId));
    if (!book) {
      showToast('Selected book not found', true);
      return;
    }
    setSendingRestock(true);
    try {
      const title = `[RESTOCK REQUISITION] ${book.title} (${restockPriority} Priority)`;
      const message = `INVENTORY REQUISITION:
Book: "${book.title}" (ISBN: ${book.isbn}, ID #${book.id})
Category: ${book.category}
Current Stock: ${book.available_copies} available / ${book.total_copies} total
Requested Copies: ${restockQty}
Priority: ${restockPriority}
Reason: ${restockReason}
${restockNotes ? `Librarian Note: ${restockNotes.trim()}\n` : ''}
Dispatched by Desk Librarian: ${user?.name} (${user?.email})`;

      const res = await api.messageAdmin({ title, message });
      showToast(res.message || `Restock requisition for "${book.title}" sent to Administration!`);
      setRestockBookId('');
      setRestockQty(2);
      setRestockNotes('');
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setSendingRestock(false);
    }
  };

  // Seat toggle
  const handleToggleSeat = async (seatId, currentStatus) => {
    const nextStatus = currentStatus === 'available' ? 'occupied' : 'available';
    try {
      await api.updateSeatStatus(seatId, { status: nextStatus });
      showToast(`Seat marked as ${nextStatus}`);
      fetchLibrarianData();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  // Broadcast announcement
  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      const res = await api.sendAnnouncement({ title: annTitle, message: annMessage });
      showToast(res.message || 'Announcement broadcasted to members!');
      setAnnTitle('');
      setAnnMessage('');
    } catch (err) {
      showToast(err.message, true);
    }
  };

  // Upload Original Photo Modal Handlers (Hold Desk)
  const handleOpenPhotoModal = (book) => {
    setPhotoModalBook(book);
    setModalPhotoPreview(null);
  };

  const handleModalPhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        showToast('Image file exceeds 8MB limit. Please choose a smaller photo.', true);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setModalPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveModalPhoto = async () => {
    if (!photoModalBook || !modalPhotoPreview) {
      showToast('Please choose an image file from your device first', true);
      return;
    }
    setModalUploading(true);
    try {
      await api.updateBook(photoModalBook.id, { cover_image: modalPhotoPreview });
      showToast(`Success: Uploaded original photo for "${photoModalBook.title}"!`);
      setPhotoModalBook(null);
      setModalPhotoPreview(null);
      fetchLibrarianData();
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setModalUploading(false);
    }
  };

  // Inventory Upload Photo Handlers
  const handleInventoryPhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        showToast('Image file exceeds 8MB limit.', true);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setInventoryPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveInventoryPhoto = async (e) => {
    e.preventDefault();
    if (!inventoryPhotoBookId) {
      showToast('Please select a book first', true);
      return;
    }
    if (!inventoryPhotoPreview) {
      showToast('Please choose an original photo from your device', true);
      return;
    }
    setInventoryPhotoUploading(true);
    try {
      const selectedBook = books.find(b => String(b.id) === String(inventoryPhotoBookId));
      await api.updateBook(inventoryPhotoBookId, { cover_image: inventoryPhotoPreview });
      showToast(`Success: Original photo uploaded for "${selectedBook?.title || 'book'}"!`);
      setInventoryPhotoPreview(null);
      fetchLibrarianData();
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setInventoryPhotoUploading(false);
    }
  };

  const handleLibrarianLogin = async (e) => {
    e.preventDefault();
    setLibLoginError('');
    setLoggingInLib(true);
    try {
      let queryEmail = libEmail.trim();
      if (
        queryEmail.toLowerCase() === 'librarian' ||
        queryEmail.toLowerCase() === 'librarian@1234' ||
        queryEmail.toLowerCase() === 'librarian1234'
      ) {
        queryEmail = 'librarian@libramind.edu';
      }
      const res = await login(queryEmail, libPassword, false);
      if (res.user.role !== 'librarian' && res.user.role !== 'admin') {
        setLibLoginError('Access Denied: This account is not authorized as library circulation staff.');
      } else {
        fetchLibrarianData();
      }
    } catch (err) {
      setLibLoginError(err.message || 'Invalid librarian credentials');
    } finally {
      setLoggingInLib(false);
    }
  };

  const activeLoans = loans.filter(l => l.status === 'active' || l.status === 'overdue');

  // Case 1: Logged-in user is NOT a Librarian or Admin -> 403 Forbidden Access Denied Screen
  if (user && user.role !== 'librarian' && user.role !== 'admin') {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '50px 20px',
          backgroundColor: 'var(--cream)'
        }}
      >
        <div
          className="bio-card"
          style={{
            width: '480px',
            maxWidth: '100%',
            backgroundColor: '#FFFFFF',
            padding: '38px',
            borderRadius: '20px',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid rgba(197, 34, 31, 0.25)',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              backgroundColor: '#FCE8E6',
              color: '#C5221F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}
          >
            <ShieldAlert size={30} />
          </div>
          <div
            style={{
              display: 'inline-block',
              backgroundColor: '#FCE8E6',
              color: '#C5221F',
              fontSize: '0.74rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '3px 12px',
              borderRadius: '12px',
              marginBottom: '10px'
            }}
          >
            Restricted Circulation Desk
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--forest-dark)', margin: '4px 0 10px' }}>
            Access Denied: Librarian Privileges Required
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', lineHeight: 1.5, marginBottom: '24px' }}>
            You are currently authenticated as a <strong>Student Member</strong> ({user.name} • {user.membership_id}). This portal is restricted exclusively to authorized library circulation staff.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => onNavigate('dashboard')}
              className="btn btn-primary"
              style={{ padding: '11px', width: '100%', fontSize: '0.92rem' }}
            >
              Return to My Student Hub
            </button>
            <button
              onClick={async () => {
                await logout();
                onNavigate('librarian');
              }}
              className="btn btn-outline"
              style={{ padding: '10px', width: '100%', fontSize: '0.88rem' }}
            >
              Sign Out & Sign In with Staff Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Unauthenticated Visitor -> Dedicated Librarian Portal Gateway Login
  if (!user) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '50px 20px',
          backgroundColor: 'var(--cream)'
        }}
      >
        <div
          className="bio-card"
          style={{
            width: '460px',
            maxWidth: '100%',
            backgroundColor: '#FFFFFF',
            padding: '36px',
            borderRadius: '20px',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid rgba(82, 115, 77, 0.22)'
          }}
        >
          {/* Brand Header */}
          <div style={{ textAlign: 'center', marginBottom: '26px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'var(--botanical)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
                boxShadow: '0 6px 18px rgba(82, 115, 77, 0.25)'
              }}
            >
              <Layers size={28} color="#FAF8F1" />
            </div>
            <div
              style={{
                display: 'inline-block',
                backgroundColor: 'var(--soft-sage)',
                color: 'var(--forest-dark)',
                fontSize: '0.72rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '3px 10px',
                borderRadius: '12px',
                marginBottom: '8px'
              }}
            >
              Circulation Desk • Staff Gateway
            </div>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--forest-dark)', margin: '4px 0 6px' }}>
              Librarian Portal Gateway
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', margin: 0 }}>
              Sign in with your staff credentials to manage book issues, returns, and catalog inventory.
            </p>
          </div>

          {libLoginError && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: 'var(--status-danger-bg)',
                color: 'var(--status-danger-text)',
                fontSize: '0.86rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px'
              }}
            >
              <AlertCircle size={16} />
              {libLoginError}
            </div>
          )}

          <form onSubmit={handleLibrarianLogin}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                Staff Email or Staff ID
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="librarian@libramind.edu or LIB-5001"
                value={libEmail}
                onChange={(e) => setLibEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '22px' }}>
              <label className="form-label" style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                Staff Password / Key
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={libPassword}
                onChange={(e) => setLibPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loggingInLib}
              style={{ width: '100%', padding: '12px', fontSize: '0.96rem' }}
            >
              {loggingInLib ? 'Verifying Staff Credentials...' : 'Sign In to Librarian Desk'}
            </button>
          </form>

          {/* 1-Click Quick Demo Login for Librarian */}
          <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--subtle-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--forest-dark)', textTransform: 'uppercase' }}>
                ⚡ 1-Click Staff Demo Access:
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--sage)', fontWeight: 600 }}>
                Pass: Librarian@123
              </span>
            </div>
            <button
              type="button"
              onClick={async () => {
                setLibEmail('librarian@libramind.edu');
                setLibPassword('Librarian@123');
                setLibLoginError('');
                setLoggingInLib(true);
                try {
                  await login('librarian@libramind.edu', 'Librarian@123', false);
                  fetchLibrarianData();
                } catch (err) {
                  setLibLoginError(err.message || 'Login failed');
                } finally {
                  setLoggingInLib(false);
                }
              }}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', fontSize: '0.82rem', padding: '9px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <span><strong>Marcus Vance</strong> (LIB-5001 • Head Desk)</span>
              <span style={{ fontSize: '0.74rem', color: 'var(--botanical)', fontWeight: 700 }}>Auto-fill & Enter →</span>
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '22px' }}>
            <button
              onClick={() => onNavigate('home')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--botanical)',
                fontSize: '0.84rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              ← Return to Library Public Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Case 3: Authenticated Librarian -> Full Circulation Suite
  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            backgroundColor: toastMessage.isError ? '#C5221F' : 'var(--forest)',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem'
          }}
        >
          {toastMessage.isError ? <AlertTriangle size={18} /> : <Check size={18} />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--botanical)', fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase' }}>
          <span>Circulation & Inventory Operations Desk</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--forest-dark)', marginTop: '4px', marginBottom: '8px' }}>
          Librarian Management Suite
        </h1>
        <p style={{ color: 'var(--muted-text)', fontSize: '1rem', margin: 0 }}>
          Manage physical book copies, execute checkouts & returns, process hold pickup queues, and control study pod availability.
        </p>
      </div>

      {/* Real Live Database Statistics (Phase 1 #9 Requirement) */}
      {overview && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '16px',
            marginBottom: '36px'
          }}
        >
          <div className="bio-card" style={{ padding: '18px', backgroundColor: '#FFFFFF', borderLeft: '4px solid var(--forest)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', textTransform: 'uppercase' }}>Book Titles</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--forest-dark)', marginTop: '2px' }}>
              {overview.totalTitles}
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--sage)' }}>Catalog volumes</span>
          </div>

          <div className="bio-card" style={{ padding: '18px', backgroundColor: '#FFFFFF', borderLeft: '4px solid var(--botanical)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', textTransform: 'uppercase' }}>Physical Copies</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--forest-dark)', marginTop: '2px' }}>
              {overview.totalCopies}
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--botanical)' }}>{overview.availableCopies} available</span>
          </div>

          <div className="bio-card" style={{ padding: '18px', backgroundColor: '#FFFFFF', borderLeft: '4px solid #B25E1A' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', textTransform: 'uppercase' }}>Active Checkouts</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#B25E1A', marginTop: '2px' }}>
              {overview.activeLoans}
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted-text)' }}>In member hands</span>
          </div>

          <div className="bio-card" style={{ padding: '18px', backgroundColor: '#FFFFFF', borderLeft: '4px solid #C5221F' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', textTransform: 'uppercase' }}>Overdue Loans</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#C5221F', marginTop: '2px' }}>
              {overview.overdueLoans}
            </div>
            <span style={{ fontSize: '0.74rem', color: '#C5221F' }}>Fine active ($1.00/day)</span>
          </div>

          <div className="bio-card" style={{ padding: '18px', backgroundColor: '#FFFFFF', borderLeft: '4px solid var(--sage)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', textTransform: 'uppercase' }}>Waiting Holds</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--forest-dark)', marginTop: '2px' }}>
              {overview.pendingReservations}
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--sage)' }}>In queue & pickup</span>
          </div>

          <div className="bio-card" style={{ padding: '18px', backgroundColor: '#FFFFFF', borderLeft: '4px solid var(--forest-dark)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', textTransform: 'uppercase' }}>Seat Occupancy</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--forest-dark)', marginTop: '2px' }}>
              {overview.seatOccupancy?.percentage}%
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted-text)' }}>{overview.seatOccupancy?.occupied}/{overview.seatOccupancy?.total} seats</span>
          </div>
        </div>
      )}

      {/* TAB 1: Check Out (Issue Book) */}
      {activeTab === 'issue' && (
        <div style={{ maxWidth: '640px' }}>
          <div className="bio-card" style={{ padding: '30px', backgroundColor: '#FFFFFF' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--forest-dark)', marginBottom: '8px' }}>
              Issue Physical Book Copy
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', marginBottom: '24px' }}>
              Enter the student's ID and barcode of the book being checked out. Due date is set automatically with real database constraint checks.
            </p>

            <form onSubmit={handleIssueBook}>
              <div className="form-group">
                <label className="form-label">Student Membership ID or Email</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. STU-1001 or student@libramind.edu"
                  value={issueMemberId}
                  onChange={(e) => setIssueMemberId(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Book Copy Barcode Identifier</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. LM-CS-1-C1 or scan barcode"
                  value={issueCopyCode}
                  onChange={(e) => setIssueCopyCode(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Loan Duration (Days)</label>
                <select
                  className="form-control"
                  value={issueDays}
                  onChange={(e) => setIssueDays(e.target.value)}
                >
                  <option value="7">7 Days (Short Loan)</option>
                  <option value="14">14 Days (Standard Student Loan)</option>
                  <option value="28">28 Days (Faculty / Research Extended)</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '16px', padding: '12px' }}
              >
                Complete Checkout & Notify Student
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: Process Returns & Overdue Fines */}
      {activeTab === 'return' && (
        <div className="bio-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--forest-dark)', marginBottom: '8px' }}>
            Active Loans & Book Returns
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', marginBottom: '20px' }}>
            Process book check-ins. If overdue, fine is computed automatically. If students are on the hold waitlist, the book is routed to pickup automatically.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--cream)', borderBottom: '1px solid var(--subtle-border)' }}>
                  <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--forest-dark)' }}>Borrower</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--forest-dark)' }}>Book Title</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--forest-dark)' }}>Copy Barcode</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--forest-dark)' }}>Due Date</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--forest-dark)' }}>Status</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right', color: 'var(--forest-dark)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeLoans.map(loan => {
                  const dueDate = new Date(loan.due_date);
                  const isOverdue = loan.status === 'overdue' || new Date() > dueDate;

                  return (
                    <tr key={loan.id} style={{ borderBottom: '1px solid rgba(52, 78, 65, 0.08)' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <strong>{loan.student_name}</strong>
                        <div style={{ fontSize: '0.74rem', color: 'var(--muted-text)' }}>{loan.membership_id}</div>
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--forest-dark)', fontWeight: 600 }}>
                        {loan.book_title}
                      </td>
                      <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>
                        {loan.copy_code}
                      </td>
                      <td style={{ padding: '12px 14px', color: isOverdue ? '#C5221F' : 'var(--dark-text)' }}>
                        {dueDate.toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        {isOverdue ? (
                          <span className="badge badge-danger">Overdue (${loan.fine_amount ? loan.fine_amount.toFixed(2) : '1.00'})</span>
                        ) : (
                          <span className="badge badge-available">Active</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleReturnBook(loan.id)}
                          className="btn btn-botanical btn-sm"
                        >
                          Process Return
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Hold Queues & Pickup Deadlines */}
      {activeTab === 'reservations' && (
        <div className="bio-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--forest-dark)', marginBottom: '8px' }}>
            Hold Queue & Pickup Desk Management
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', marginBottom: '20px' }}>
            View waiting queues. When books are ready at the circulation desk, confirm student pickup.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--cream)', borderBottom: '1px solid var(--subtle-border)' }}>
                  <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--forest-dark)' }}>Student</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--forest-dark)' }}>Book</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--forest-dark)' }}>Queue Position</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--forest-dark)' }}>Status</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--forest-dark)' }}>Pickup Deadline</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right', color: 'var(--forest-dark)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgba(52, 78, 65, 0.08)' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <strong>{r.student_name}</strong>
                      <div style={{ fontSize: '0.74rem', color: 'var(--muted-text)' }}>{r.membership_id}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '46px',
                          height: '62px',
                          flexShrink: 0,
                          borderRadius: '6px',
                          overflow: 'hidden',
                          backgroundColor: 'var(--warm-beige)',
                          border: '1px solid var(--subtle-border)',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                        }}>
                          <img
                            src={resolveBookCoverUrl(r.cover_image)}
                            alt={r.book_title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--forest-dark)', fontSize: '0.92rem' }}>
                            {r.book_title}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--muted-text)' }}>
                            by {r.book_author || 'Author'}
                          </div>
                          <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            {r.cover_image?.startsWith('/uploads') ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.7rem', color: 'var(--botanical)', fontWeight: 600, backgroundColor: 'rgba(82, 115, 77, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                                <Check size={11} /> Original Photo Active
                              </span>
                            ) : (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.7rem', color: '#B45309', fontWeight: 600, backgroundColor: 'rgba(217, 119, 6, 0.12)', padding: '2px 6px', borderRadius: '4px' }}>
                                Standard Stock Image
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleOpenPhotoModal({ id: r.book_id, title: r.book_title, author: r.book_author, cover_image: r.cover_image })}
                              className="btn btn-sm btn-outline"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.72rem',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                borderColor: 'var(--botanical)',
                                color: 'var(--forest-dark)',
                                backgroundColor: '#FFFFFF'
                              }}
                              title="Upload device photo to replace standard image for this book on hold"
                            >
                              <Upload size={12} color="var(--botanical)" />
                              Upload Original Photo
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>Position #{r.queue_position}</td>
                    <td style={{ padding: '12px 14px' }}>
                      {r.status === 'ready_for_pickup' ? (
                        <span className="badge badge-available">● Ready for Pickup</span>
                      ) : r.status === 'waiting' ? (
                        <span className="badge badge-reserved">● Waiting in line</span>
                      ) : (
                        <span className="badge badge-category">{r.status}</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--muted-text)' }}>
                      {r.pickup_deadline ? new Date(r.pickup_deadline).toLocaleDateString() : 'Pending return'}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      {r.status === 'waiting' && (
                        <button
                          onClick={() => handleMarkPickup(r.id)}
                          className="btn btn-secondary btn-sm"
                        >
                          Mark Ready for Pickup
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Inventory & Add Copies */}
      {activeTab === 'inventory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '850px' }}>
          
          {/* Section A: Add Copies to Existing Book */}
          <div className="bio-card" style={{ padding: '28px', backgroundColor: '#FFFFFF', borderLeft: '5px solid var(--botanical)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <CopyPlus size={22} color="var(--botanical)" />
              <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)', margin: 0 }}>
                Add More Copies to Existing Book
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', marginBottom: '20px' }}>
              Select any existing title in the library to increase available stock without creating duplicate records. Unique copy barcodes are assigned automatically.
            </p>

            <form onSubmit={handleAddCopiesToExisting} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', alignItems: 'end' }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Select Existing Book *</label>
                <select
                  className="form-control"
                  value={copyBookId}
                  onChange={(e) => setCopyBookId(e.target.value)}
                  required
                >
                  <option value="">-- Choose a title from catalog ({books.length} books) --</option>
                  {books.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.title} — by {b.author} (Current: {b.available_copies}/{b.total_copies} available • ISBN: {b.isbn})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Number of Copies to Add</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  className="form-control"
                  value={copyCount}
                  onChange={(e) => setCopyCount(Math.max(1, parseInt(e.target.value) || 1))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Copy Condition</label>
                <select
                  className="form-control"
                  value={copyCondition}
                  onChange={(e) => setCopyCondition(e.target.value)}
                >
                  <option value="New">Brand New</option>
                  <option value="Good">Good Condition</option>
                  <option value="Fair">Fair / Usable</option>
                </select>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <button
                  type="submit"
                  disabled={addingCopies}
                  className="btn btn-botanical"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 22px' }}
                >
                  <CopyPlus size={16} />
                  {addingCopies ? 'Adding Copies...' : `Add ${copyCount} Physical Cop${copyCount > 1 ? 'ies' : 'y'}`}
                </button>
              </div>
            </form>
          </div>

          {/* Section B: Catalog New Book Title (Device Image Upload) */}
          <div className="bio-card" style={{ padding: '30px', backgroundColor: '#FFFFFF', borderLeft: '5px solid var(--forest)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Plus size={22} color="var(--forest)" />
              <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)', margin: 0 }}>
                Catalog New Book Title & Stacks Location
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', marginBottom: '24px' }}>
              Register a brand new book title. Duplicate titles and ISBNs are automatically prevented. Upload cover photos directly from your device to enable full offline viewing.
            </p>

            <form onSubmit={handleAddBook}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Book Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Title of the book"
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Author *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Author name"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ISBN-13 *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="978-XXXXXXXXXX"
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-control"
                    value={newBook.category}
                    onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                  >
                    <option value="Classic Novels">Classic Novels</option>
                    <option value="Emotional Fiction">Emotional Fiction</option>
                    <option value="Spiritual & Wisdom">Spiritual & Wisdom</option>
                    <option value="Modern Novels">Modern Novels</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Publisher</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Publisher name"
                    value={newBook.publisher}
                    onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Publication Year</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newBook.publication_year}
                    onChange={(e) => setNewBook({ ...newBook, publication_year: e.target.value })}
                  />
                </div>

                {/* Shelf & Rack Coordinates */}
                <div className="form-group">
                  <label className="form-label">Floor</label>
                  <select
                    className="form-control"
                    value={newBook.floor}
                    onChange={(e) => setNewBook({ ...newBook, floor: e.target.value })}
                  >
                    <option value="Floor 1">Floor 1</option>
                    <option value="Floor 2">Floor 2</option>
                    <option value="Floor 3">Floor 3</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Section</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Tech & Engineering"
                    value={newBook.section}
                    onChange={(e) => setNewBook({ ...newBook, section: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Shelf Code</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Shelf CS-01"
                    value={newBook.shelf}
                    onChange={(e) => setNewBook({ ...newBook, shelf: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Rack Unit</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Rack 02"
                    value={newBook.rack}
                    onChange={(e) => setNewBook({ ...newBook, rack: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Physical Copies</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    className="form-control"
                    value={newBook.total_copies}
                    onChange={(e) => setNewBook({ ...newBook, total_copies: parseInt(e.target.value) || 1 })}
                  />
                </div>

                {/* Device Image File Upload (Replaces URL upload) */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Upload size={14} color="var(--botanical)" />
                    Upload Cover Photo from Device *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={handleDeviceImageChange}
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--sage)', marginTop: '4px', display: 'block' }}>
                    Saved locally on server. Fully accessible offline without internet.
                  </span>
                </div>
              </div>

              {/* Selected Image Preview */}
              {imagePreview && (
                <div style={{ marginTop: '14px', padding: '12px', backgroundColor: 'var(--warm-beige-light)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img
                    src={imagePreview}
                    alt="Device upload preview"
                    style={{ width: '56px', height: '72px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--subtle-border)' }}
                  />
                  <div>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--forest-dark)' }}>
                      Local Device Photo Loaded
                    </span>
                    <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--muted-text)' }}>
                      Photo will be stored locally in library archive and served offline.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setImagePreview(null); setNewBook(prev => ({ ...prev, cover_image: '' })); }}
                    className="btn btn-sm btn-outline"
                    style={{ marginLeft: 'auto', fontSize: '0.76rem' }}
                  >
                    Clear Photo
                  </button>
                </div>
              )}

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="form-label">Description / Summary</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Key concepts, topics, chapters, and summary of the book..."
                  value={newBook.description}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginTop: '20px', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={16} /> Catalog New Book & Generate Barcodes
              </button>
            </form>
          </div>

          {/* Section C: Upload / Replace Original Photos for Existing Books */}
          <div className="bio-card" style={{ padding: '28px', backgroundColor: '#FFFFFF', borderLeft: '5px solid #2A6F97' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Camera size={22} color="#2A6F97" />
              <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)', margin: 0 }}>
                Upload Original Photo for Existing Book Title
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', marginBottom: '20px' }}>
              Update an existing book or a book on hold with authentic original photos from your device, replacing standard stock images. Uploaded photos are stored locally on the server and viewable offline without internet.
            </p>

            <form onSubmit={handleSaveInventoryPhoto}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', alignItems: 'start' }}>
                <div className="form-group">
                  <label className="form-label">Select Book to Update Photo *</label>
                  <select
                    className="form-control"
                    value={inventoryPhotoBookId}
                    onChange={(e) => {
                      setInventoryPhotoBookId(e.target.value);
                      setInventoryPhotoPreview(null);
                    }}
                    required
                  >
                    <option value="">-- Choose a title ({books.length} books) --</option>
                    {books.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.title} — {b.author} ({b.cover_image?.startsWith('/uploads') ? 'Original Photo' : 'Standard Image'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Upload size={14} color="#2A6F97" />
                    Choose New Original Photo from Device *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={handleInventoryPhotoSelect}
                    disabled={!inventoryPhotoBookId}
                    required
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--sage)', marginTop: '4px', display: 'block' }}>
                    Supports JPG, PNG, WebP up to 8MB. Stored locally in library archive.
                  </span>
                </div>
              </div>

              {/* Current Book Info & Preview Comparison */}
              {inventoryPhotoBookId && (() => {
                const selBook = books.find(b => String(b.id) === String(inventoryPhotoBookId));
                if (!selBook) return null;
                return (
                  <div style={{ marginTop: '20px', padding: '16px', backgroundColor: 'var(--warm-beige-light)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted-text)', textTransform: 'uppercase', marginBottom: '6px' }}>Current Image:</div>
                      <div style={{ width: '64px', height: '88px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--subtle-border)', backgroundColor: '#FFF' }}>
                        <img
                          src={resolveBookCoverUrl(selBook.cover_image)}
                          alt={selBook.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <span style={{ fontSize: '0.68rem', color: selBook.cover_image?.startsWith('/uploads') ? 'var(--botanical)' : '#B45309', fontWeight: 600, display: 'block', marginTop: '4px' }}>
                        {selBook.cover_image?.startsWith('/uploads') ? '● Original Photo' : '● Standard Stock'}
                      </span>
                    </div>

                    {inventoryPhotoPreview && (
                      <>
                        <div style={{ fontSize: '1.2rem', color: 'var(--botanical)' }}>➔</div>
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--botanical)', textTransform: 'uppercase', marginBottom: '6px' }}>New Original Photo Preview:</div>
                          <div style={{ width: '64px', height: '88px', borderRadius: '6px', overflow: 'hidden', border: '2px solid var(--botanical)', backgroundColor: '#FFF' }}>
                            <img
                              src={inventoryPhotoPreview}
                              alt="New device upload"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                          <span style={{ fontSize: '0.68rem', color: 'var(--botanical)', fontWeight: 600, display: 'block', marginTop: '4px' }}>
                            ● Ready to upload
                          </span>
                        </div>
                      </>
                    )}

                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <strong style={{ color: 'var(--forest-dark)', fontSize: '1rem' }}>{selBook.title}</strong>
                      <div style={{ fontSize: '0.82rem', color: 'var(--muted-text)', marginTop: '2px' }}>
                        Author: {selBook.author} • ISBN: {selBook.isbn}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--forest)', marginTop: '2px' }}>
                        Location: {selBook.floor} — {selBook.shelf}
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div style={{ marginTop: '20px' }}>
                <button
                  type="submit"
                  disabled={inventoryPhotoUploading || !inventoryPhotoBookId || !inventoryPhotoPreview}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', backgroundColor: '#2A6F97', borderColor: '#2A6F97' }}
                >
                  <Upload size={16} />
                  {inventoryPhotoUploading ? 'Saving Photo Locally...' : 'Upload Original Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB: Message Administrator (Librarian -> Admin Direct Hotline) */}
      {activeTab === 'adminmsg' && (
        <div style={{ maxWidth: '680px' }}>
          <div className="bio-card" style={{ padding: '30px', backgroundColor: '#FFFFFF', borderLeft: '5px solid #2A9D8F' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Send size={22} color="#2A9D8F" />
              <h3 style={{ fontSize: '1.3rem', color: 'var(--forest-dark)', margin: 0 }}>
                Direct Hotline to Library Administration
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', marginBottom: '24px' }}>
              Send an urgent notice, maintenance alert, or inventory incident report directly to Library Administration. Only Librarian accounts have access to dispatch messages to the Admin console.
            </p>

            <form onSubmit={handleSendMessageToAdmin}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Subject / Alert Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Urgent: Floor 2 Rack 03 Shelf Damaged / High Demand for AI Books"
                  value={adminMsgTitle}
                  onChange={(e) => setAdminMsgTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Message Details for Administration *</label>
                <textarea
                  className="form-control"
                  rows={5}
                  placeholder="Describe the facility issue, inventory replenishment request, or administrative note..."
                  value={adminMsgBody}
                  onChange={(e) => setAdminMsgBody(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--sage)' }}>
                  🔒 Transmitted directly to all logged Admin consoles with [LIBRARIAN NOTICE] tag.
                </span>
                <button
                  type="submit"
                  disabled={sendingAdminMsg}
                  className="btn btn-botanical"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 22px' }}
                >
                  <Send size={16} />
                  {sendingAdminMsg ? 'Dispatching...' : 'Dispatch Message to Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* TAB 5: Live Study Pod Status */}
      {activeTab === 'seats' && (
        <div className="bio-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--forest-dark)', marginBottom: '8px' }}>
            Live Study Seat Occupancy Controller
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', marginBottom: '20px' }}>
            Click any seat to toggle between Available and Occupied. Live updates reflect immediately for students.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '16px'
            }}
          >
            {seats.map(seat => (
              <div
                key={seat.id}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: seat.status === 'available' ? 'var(--status-available-bg)' : '#FEEFE6',
                  border: '1px solid var(--subtle-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--forest-dark)' }}>{seat.seat_number}</strong>
                  <span className={`badge ${seat.status === 'available' ? 'badge-available' : 'badge-borrowed'}`}>
                    {seat.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted-text)' }}>
                  {seat.floor} • {seat.section}
                </div>
                <button
                  onClick={() => handleToggleSeat(seat.id, seat.status)}
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: '6px' }}
                >
                  Set to {seat.status === 'available' ? 'Occupied' : 'Available'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Message Admin & Inventory Requisition */}
      {activeTab === 'adminmsg' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {/* Form 1: Out-of-Stock / Low Stock Book Requisition */}
          <div className="bio-card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--botanical)', marginBottom: '8px' }}>
              <Plus size={18} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Procurement Request</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)', marginBottom: '6px' }}>
              Report Out-of-Stock / Restock Request
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', marginBottom: '20px', lineHeight: 1.45 }}>
              Officially report low or zero-stock books to Administration for physical copy acquisition.
            </p>

            <form onSubmit={handleSendRestockRequisition}>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Select Book from Catalog *</label>
                <select
                  className="form-control"
                  value={restockBookId}
                  onChange={(e) => setRestockBookId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Book to Restock --</option>
                  {books.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.available_copies === 0 ? 'OUT OF STOCK' : `${b.available_copies} avail`}) — ISBN: {b.isbn}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Requested Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    className="form-control"
                    value={restockQty}
                    onChange={(e) => setRestockQty(parseInt(e.target.value) || 1)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-control"
                    value={restockPriority}
                    onChange={(e) => setRestockPriority(e.target.value)}
                  >
                    <option value="Standard">Standard</option>
                    <option value="High">High Priority</option>
                    <option value="Urgent">Urgent / Course Reserve</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Reason for Request</label>
                <select
                  className="form-control"
                  value={restockReason}
                  onChange={(e) => setRestockReason(e.target.value)}
                >
                  <option value="Out of stock (0 available copies)">Out of stock (0 available copies)</option>
                  <option value="High student hold queue depth">High student hold queue depth</option>
                  <option value="Damaged / Worn copies in circulation">Damaged / Worn copies in circulation</option>
                  <option value="Curriculum & exam requirement">Curriculum & exam requirement</option>
                  <option value="Anticipated seasonal demand spike">Anticipated seasonal demand spike</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label className="form-label">Justification / Librarian Notes (Optional)</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="e.g. 4 students currently in hold queue; faculty recommended additional copies..."
                  value={restockNotes}
                  onChange={(e) => setRestockNotes(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={sendingRestock}
                className="btn btn-primary"
                style={{ width: '100%', padding: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Send size={15} />
                {sendingRestock ? 'Dispatching to Administration...' : 'Submit Restock Requisition'}
              </button>
            </form>
          </div>

          {/* Form 2: Direct Administrative Message Hotline */}
          <div className="bio-card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--botanical)', marginBottom: '8px' }}>
              <Send size={18} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Administration Hotline</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)', marginBottom: '6px' }}>
              Direct Message to Administration
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', marginBottom: '20px', lineHeight: 1.45 }}>
              Send an operational inquiry, facilities alert, or administrative message directly to library administrators.
            </p>

            <form onSubmit={handleSendMessageToAdmin}>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Subject / Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Air Conditioning in Garden Window Pods or Shelf Audit"
                  value={adminMsgTitle}
                  onChange={(e) => setAdminMsgTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label className="form-label">Message Details *</label>
                <textarea
                  className="form-control"
                  rows={7}
                  placeholder="Type your official administrative dispatch here..."
                  value={adminMsgBody}
                  onChange={(e) => setAdminMsgBody(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={sendingAdminMsg}
                className="btn btn-primary"
                style={{ width: '100%', padding: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Send size={15} />
                {sendingAdminMsg ? 'Sending to Admin...' : 'Send Administrative Dispatch'}
              </button>
            </form>

            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'var(--warm-beige-light)', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--muted-text)', lineHeight: 1.45 }}>
              <strong>Audit Policy:</strong> All dispatches are recorded with cryptographic timestamps in system audit logs and delivered to administrator notification inboxes. Approving a request does not artificially fabricate inventory; physical copies are only added when received and registered.
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Broadcast Library Announcement */}
      {activeTab === 'announcement' && (
        <div style={{ maxWidth: '640px' }}>
          <div className="bio-card" style={{ padding: '30px', backgroundColor: '#FFFFFF' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--forest-dark)', marginBottom: '8px' }}>
              Broadcast Library Announcement
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', marginBottom: '24px' }}>
              Send an in-website notification to all registered student accounts.
            </p>

            <form onSubmit={handleBroadcast}>
              <div className="form-group">
                <label className="form-label">Announcement Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Extended Library Hours During Midterms"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message Content</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Enter details for students..."
                  value={annMessage}
                  onChange={(e) => setAnnMessage(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '16px', padding: '12px' }}
              >
                Broadcast to All Students
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Upload Original Photo Modal (for Held Books and Circulation Quick Desk Actions) */}
      {photoModalBook && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(27, 43, 36, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 4000,
          padding: '20px'
        }}>
          <div className="bio-card" style={{
            backgroundColor: '#FFFFFF',
            width: '100%',
            maxWidth: '520px',
            padding: '28px',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--botanical)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Circulation & Hold Desk
                </span>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)', margin: '4px 0 0' }}>
                  Upload Original Book Photo
                </h3>
              </div>
              <button
                type="button"
                onClick={() => { setPhotoModalBook(null); setModalPhotoPreview(null); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-text)', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', marginBottom: '18px', lineHeight: 1.45 }}>
              Upload authentic original photos of <strong>"{photoModalBook.title}"</strong> from your device to replace standard generic images. Saved locally for offline use.
            </p>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', padding: '14px', backgroundColor: 'var(--warm-beige-light)', borderRadius: '10px', marginBottom: '18px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted-text)', fontWeight: 600, marginBottom: '4px' }}>CURRENT:</div>
                <div style={{ width: '60px', height: '80px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--subtle-border)', backgroundColor: '#FFF' }}>
                  <img
                    src={resolveBookCoverUrl(photoModalBook.cover_image)}
                    alt={photoModalBook.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>

              <div style={{ fontSize: '1.2rem', color: 'var(--botanical)' }}>➔</div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--botanical)', fontWeight: 700, marginBottom: '4px' }}>NEW ORIGINAL PHOTO:</div>
                <div style={{ width: '60px', height: '80px', borderRadius: '6px', overflow: 'hidden', border: '2px solid var(--botanical)', backgroundColor: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {modalPhotoPreview ? (
                    <img
                      src={modalPhotoPreview}
                      alt="New preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontSize: '0.7rem', color: 'var(--muted-text)', textAlign: 'center', padding: '4px' }}>No photo selected</span>
                  )}
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--forest-dark)' }}>{photoModalBook.title}</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--muted-text)' }}>by {photoModalBook.author || 'Author'}</div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Upload size={14} color="var(--botanical)" />
                Choose Original Photo from Device *
              </label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleModalPhotoSelect}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--sage)', marginTop: '4px', display: 'block' }}>
                Stored locally on the library server. Viewable completely offline.
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => { setPhotoModalBook(null); setModalPhotoPreview(null); }}
                className="btn btn-outline btn-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModalPhoto}
                disabled={!modalPhotoPreview || modalUploading}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px' }}
              >
                <Upload size={14} />
                {modalUploading ? 'Uploading & Saving...' : 'Save & Replace Photo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
