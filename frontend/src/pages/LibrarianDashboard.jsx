import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import DemoAccounts, { DEMO_ACCOUNTS } from '../components/DemoAccounts';
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
  User,
  Key,
  Zap,
  Monitor,
  UserCheck,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getOfflineBookCover, handleBookCoverError } from '../utils/offlineCovers';

export function resolveBookCoverUrl(url, title = 'Classical Book', author = 'Author', category = 'Archival') {
  if (!url) return getOfflineBookCover(title, author, category);
  return url;
}

export default function LibrarianDashboard({ onNavigate, initialTab = 'issue' }) {
  const { user, login, register, loginWithGithub, logout } = useAuth();
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
  const [returnSubTab, setReturnSubTab] = useState('active'); // 'active' | 'history'
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [selectedReturnDate, setSelectedReturnDate] = useState(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });
  const [showAllReturnHistory, setShowAllReturnHistory] = useState(false);
  const [seatFloorFilter, setSeatFloorFilter] = useState('All');
  const [seatSectionFilter, setSeatSectionFilter] = useState('All');
  const [seatStatusFilter, setSeatStatusFilter] = useState('All');

  // Librarian Portal Gateway Sign-in state
  const [libEmail, setLibEmail] = useState('');
  const [libPassword, setLibPassword] = useState('');
  const [libLoginError, setLibLoginError] = useState('');
  const [loggingInLib, setLoggingInLib] = useState(false);
  const [demoLoading, setDemoLoading] = useState('');

  // GitHub Staff SSO state
  const [showLibGithubModal, setShowLibGithubModal] = useState(false);
  const [libGithubUsername, setLibGithubUsername] = useState('marcus-thorne');
  const [libGithubName, setLibGithubName] = useState('Marcus Thorne');
  const [libGithubEmail, setLibGithubEmail] = useState('librarian@libramind.edu');
  const [libGithubLoading, setLibGithubLoading] = useState(false);

  // Form states
  // 1. Issue
  const [issueMemberId, setIssueMemberId] = useState('');
  const [issueCopyCode, setIssueCopyCode] = useState('');
  const [issueDays, setIssueDays] = useState('14');
  const [issueSearch, setIssueSearch] = useState('');
  const [barcodeLookupInfo, setBarcodeLookupInfo] = useState(null);
  const [barcodeLookingUp, setBarcodeLookingUp] = useState(false);

  // Auto-detect user and title when barcode is typed or selected
  useEffect(() => {
    if (!issueCopyCode || issueCopyCode.trim().length < 3) {
      setBarcodeLookupInfo(null);
      return;
    }
    const timer = setTimeout(async () => {
      setBarcodeLookingUp(true);
      try {
        const data = await api.lookupCopyBarcode(issueCopyCode.trim());
        setBarcodeLookupInfo(data);
        if (data.assignedUser && !issueMemberId) {
          setIssueMemberId(data.assignedUser.membership_id);
        }
      } catch (err) {
        setBarcodeLookupInfo(null);
      } finally {
        setBarcodeLookingUp(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [issueCopyCode, issueMemberId]);

  // 2. Add Book & Device Image Upload
  const [newBook, setNewBook] = useState({
    title: '', author: '', isbn: '', publisher: '', publication_year: 2024,
    category: 'Classic Novels', edition: '1st Edition', language: 'English',
    floor: 'Floor 1', section: 'Classic Literature Gallery', shelf: 'Shelf CL-01', rack: 'Rack 01',
    total_copies: 1, description: '', cover_image: ''
  });
  const [imagePreview, setImagePreview] = useState(null);

  // 3. Add More Copies to Existing Book (Typeable & Searchable with Verification)
  const [copyBookId, setCopyBookId] = useState('');
  const [copySearchQuery, setCopySearchQuery] = useState('');
  const [selectedCopyBook, setSelectedCopyBook] = useState(null);
  const [copyBookError, setCopyBookError] = useState('');
  const [copySearchOpen, setCopySearchOpen] = useState(false);
  const [copyCount, setCopyCount] = useState(1);
  const [copyCondition, setCopyCondition] = useState('New');
  const [addingCopies, setAddingCopies] = useState(false);

  // 4. Unified Administrative Messenger (Librarian -> Admin Direct Hotline & Restock Dispatch)
  const [adminMsgCategory, setAdminMsgCategory] = useState('Book Restock / Procurement Request');
  const [adminMsgTitle, setAdminMsgTitle] = useState('');
  const [adminMsgBookDetails, setAdminMsgBookDetails] = useState('');
  const [adminMsgPriority, setAdminMsgPriority] = useState('Standard');
  const [adminMsgBody, setAdminMsgBody] = useState('');
  const [sendingAdminMsg, setSendingAdminMsg] = useState(false);

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

  const fetchLibrarianData = useCallback(async (forcedUser = null) => {
    const activeUser = forcedUser || user;
    const token = sessionStorage.getItem('libramind_librarian_token') || sessionStorage.getItem('libramind_session_token');
    if (!activeUser && !token) {
      setLoading(false);
      return;
    }
    if (activeUser && activeUser.role !== 'librarian' && activeUser.role !== 'admin') {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [overviewData, loansData, resData, booksData, seatsData] = await Promise.all([
        api.getAnalyticsOverview().catch(() => ({})),
        api.getLoans().catch(() => []),
        api.getReservations().catch(() => []),
        api.getBooks({ limit: 500 }).catch(() => ({ books: [] })),
        api.getSeats().catch(() => [])
      ]);
      setOverview(overviewData || {});
      setLoans(Array.isArray(loansData) ? loansData : []);
      setReservations(Array.isArray(resData) ? resData : []);
      const loadedBooks = Array.isArray(booksData) ? booksData : (booksData?.books || []);
      setBooks(loadedBooks);
      const loadedSeats = Array.isArray(seatsData) ? seatsData : (seatsData?.seats || []);
      setSeats(loadedSeats);
    } catch (err) {
      console.error('Failed to load librarian data', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLibrarianData();

    const handleUpdate = () => {
      fetchLibrarianData();
    };
    window.addEventListener('libramind:data-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    let bc = null;
    try {
      bc = new BroadcastChannel('libramind_sync');
      bc.onmessage = () => fetchLibrarianData();
    } catch (_) {}

    const interval = setInterval(() => {
      fetchLibrarianData();
    }, 4000);

    return () => {
      window.removeEventListener('libramind:data-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      if (bc) bc.close();
      clearInterval(interval);
    };
  }, [fetchLibrarianData, user]);

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
      window.dispatchEvent(new CustomEvent('libramind:data-updated'));
      try {
        const bc = new BroadcastChannel('libramind_sync');
        bc.postMessage({ type: 'book_returned', loanId });
        bc.close();
      } catch (e) {}
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

  // Add Copies to Existing Book Handler (Enforce that book MUST exist in catalog)
  const handleAddCopiesToExisting = async (e) => {
    e.preventDefault();

    // Verify that the book exists in the library catalog
    let targetBook = selectedCopyBook;
    if (!targetBook && copyBookId) {
      targetBook = books.find(b => String(b.id || b._id) === String(copyBookId));
    }
    if (!targetBook && copySearchQuery.trim()) {
      const q = copySearchQuery.trim().toLowerCase();
      targetBook = books.find(b => b.title.toLowerCase() === q || (b.isbn && b.isbn.toLowerCase() === q));
    }

    if (!targetBook) {
      setCopyBookError('⚠️ Cannot add copies: This book does not exist in the library catalog. You can only add copies to existing cataloged books. Please register this title in "Catalog New Book Title" below first.');
      showToast('Cannot add copies: This book does not exist in the library catalog!', true);
      return;
    }

    setAddingCopies(true);
    setCopyBookError('');
    try {
      const res = await api.addBookCopy(targetBook.id || targetBook._id, { count: copyCount, condition: copyCondition });
      showToast(res.message || `Successfully added ${copyCount} copies to "${targetBook.title}"!`);
      setCopyCount(1);
      setSelectedCopyBook(null);
      setCopySearchQuery('');
      setCopyBookId('');
      fetchLibrarianData();
      window.dispatchEvent(new CustomEvent('libramind:data-updated'));
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setAddingCopies(false);
    }
  };

  // Unified Message Administrator & Restock Dispatch Handler
  const handleSendMessageToAdmin = async (e) => {
    e.preventDefault();
    if (!adminMsgTitle.trim() || !adminMsgBody.trim()) {
      showToast('Subject and message content are required', true);
      return;
    }
    setSendingAdminMsg(true);
    try {
      const fullMessage = [
        `[Category: ${adminMsgCategory}] [Priority: ${adminMsgPriority}]`,
        adminMsgBookDetails.trim() ? `Target Volumes / Restock Details:\n${adminMsgBookDetails.trim()}\n` : '',
        `Dispatch Content:\n${adminMsgBody.trim()}`,
        '',
        `Dispatched by Desk Librarian: ${user?.name || 'Librarian'} (${user?.email || ''})`
      ].filter(Boolean).join('\n');

      const title = `[${adminMsgCategory.includes('Restock') ? 'RESTOCK DISPATCH' : 'ADMIN DISPATCH'}] ${adminMsgTitle.trim()}`;
      const res = await api.messageAdmin({ title, message: fullMessage });
      showToast(res.message || 'Direct dispatch securely sent to Library Administration!');
      setAdminMsgTitle('');
      setAdminMsgBookDetails('');
      setAdminMsgBody('');
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setSendingAdminMsg(false);
    }
  };

  // Seat toggle
  const handleToggleSeat = async (seatId, nextStatus) => {
    try {
      await api.updateSeatStatus(seatId, { status: nextStatus });
      showToast(`Study Pod status updated to ${nextStatus}`);
      fetchLibrarianData();
      window.dispatchEvent(new CustomEvent('libramind:data-updated'));
      try {
        const bc = new BroadcastChannel('libramind_sync');
        bc.postMessage({ type: 'seat_updated', seatId });
        bc.close();
      } catch (e) {}
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
    if (!inventoryPhotoPreview) {
      showToast('Please choose an original photo directly from your device', true);
      return;
    }
    setInventoryPhotoUploading(true);
    try {
      const targetBookId = inventoryPhotoBookId || (books && books.length > 0 ? books[0].id : null);
      if (targetBookId) {
        await api.updateBook(targetBookId, { cover_image: inventoryPhotoPreview });
        const selectedBook = books.find(b => String(b.id) === String(targetBookId));
        showToast(`Success: Photo uploaded directly from device for "${selectedBook?.title || 'Catalog Book'}"!`);
      } else {
        showToast('Photo uploaded directly from device!');
      }
      setInventoryPhotoPreview(null);
      fetchLibrarianData();
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setInventoryPhotoUploading(false);
    }
  };

  const handleIssuePenaltyQR = async (loanId) => {
    try {
      const res = await api.issuePenaltyQr(loanId);
      showToast(res.message || 'Penalty fine of $15.00 issued & QR sent to student account!');
      fetchLibrarianData();
    } catch (err) {
      showToast(err.message || 'Failed to issue penalty QR code', true);
    }
  };

  const handleSendReturnWarning = async (loanId) => {
    try {
      const res = await api.sendReturnWarning(loanId);
      showToast(res.message || 'Book Return Warning sent! Warning banner will appear when student opens account.');
      fetchLibrarianData();
    } catch (err) {
      showToast(err.message || 'Failed to send return warning', true);
    }
  };

  const handleCancelPenalty = async (loanId) => {
    try {
      const res = await api.cancelPenalty(loanId);
      showToast(res.message || 'Penalty successfully cancelled and borrowing privileges restored!');
      fetchLibrarianData();
    } catch (err) {
      showToast(err.message || 'Failed to cancel penalty', true);
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
        queryEmail.toLowerCase() === 'lib' ||
        queryEmail.toLowerCase() === 'lib@1234' ||
        queryEmail.toLowerCase() === 'lib1234' ||
        queryEmail.toLowerCase() === 'librarian@1234' ||
        queryEmail.toLowerCase() === 'librarian1234'
      ) {
        queryEmail = 'librarian@libramind.edu';
      }
      const res = await login(queryEmail, libPassword, false);
      if (res.user.role !== 'librarian' && res.user.role !== 'admin') {
        setLibLoginError('Access Denied: This account is not authorized as library circulation staff.');
      } else {
        if (onNavigate) onNavigate('librarian', { user: res.user, tab: 'issue' });
        fetchLibrarianData(res.user);
      }
    } catch (err) {
      setLibLoginError(err.message || 'Invalid librarian credentials');
    } finally {
      setLoggingInLib(false);
    }
  };

  const handleDemoLogin = async (roleKey) => {
    const account = DEMO_ACCOUNTS[roleKey];
    if (!account || loggingInLib || demoLoading) return;

    setLibLoginError('');
    setLibEmail(account.email);
    setLibPassword(account.password);
    setDemoLoading(roleKey);

    try {
      const res = await login(account.email, account.password, false);
      if (!res.user || (res.user.role !== 'librarian' && res.user.role !== 'admin')) {
        setLibLoginError('Access Denied: This account is not authorized as library circulation staff.');
        return;
      }
      if (onNavigate) onNavigate('librarian', { user: res.user, tab: 'issue' });
      fetchLibrarianData(res.user);
    } catch (err) {
      setLibLoginError(err.message || 'Demo staff sign-in failed. Please try again.');
    } finally {
      setDemoLoading('');
    }
  };

  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'
  const [libRegName, setLibRegName] = useState('');
  const [libRegEmail, setLibRegEmail] = useState('');
  const [libRegPassword, setLibRegPassword] = useState('');
  const [libRegConfirmPassword, setLibRegConfirmPassword] = useState('');
  const [registeringLib, setRegisteringLib] = useState(false);

  const handleLibrarianRegister = async (e) => {
    e.preventDefault();
    setLibLoginError('');
    if (!libRegName.trim() || !libRegEmail.trim() || !libRegPassword) {
      setLibLoginError('Full name, email address, and password are required.');
      return;
    }
    if (libRegPassword.length < 6) {
      setLibLoginError('Password must be at least 6 characters long.');
      return;
    }
    if (libRegPassword !== libRegConfirmPassword) {
      setLibLoginError('Password and Confirm Password do not match.');
      return;
    }
    setRegisteringLib(true);
    try {
      const res = await register(
        libRegName.trim(),
        libRegEmail.trim(),
        libRegPassword,
        'Circulation Desk, Book Curation, Library Operations',
        '',
        'librarian'
      );
      if (res.user) {
        if (onNavigate) onNavigate('librarian', { user: res.user, tab: 'issue' });
        fetchLibrarianData(res.user);
      }
    } catch (err) {
      setLibLoginError(err.message || 'Librarian registration failed');
    } finally {
      setRegisteringLib(false);
    }
  };

  const activeLoans = loans.filter(l => (l.status === 'active' || l.status === 'borrowed' || l.status === 'overdue' || l.is_active) && l.status !== 'returned');
  const returnedLoans = useMemo(() => {
    return loans
      .filter(l => l.status === 'returned')
      .sort((a, b) => {
        const da = new Date(a.return_date || a.updated_at || a.created_at || 0);
        const db = new Date(b.return_date || b.updated_at || b.created_at || 0);
        return db - da;
      });
  }, [loans]);

  const getLoanDateKey = (loan) => {
    const raw = loan.return_date || loan.updated_at || loan.created_at;
    if (!raw) return '';
    const d = new Date(raw);
    if (isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const returnsByDate = useMemo(() => {
    const map = {};
    returnedLoans.forEach(loan => {
      const key = getLoanDateKey(loan);
      if (key) {
        if (!map[key]) map[key] = [];
        map[key].push(loan);
      }
    });
    return map;
  }, [returnedLoans]);

  const datesWithReturns = useMemo(() => {
    return Object.keys(returnsByDate).sort().reverse();
  }, [returnsByDate]);

  const todayDate = new Date();
  const todayDateKey = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;

  // If selected return date has no records, auto-select the latest date that has returns
  useEffect(() => {
    if (returnedLoans.length > 0) {
      if (!returnsByDate[todayDateKey] && (!selectedReturnDate || !returnsByDate[selectedReturnDate])) {
        if (datesWithReturns.length > 0) {
          setSelectedReturnDate(datesWithReturns[0]);
          const [y, m] = datesWithReturns[0].split('-').map(Number);
          setCalendarMonth(new Date(y, m - 1, 1));
        }
      }
    }
  }, [returnsByDate, datesWithReturns, returnedLoans.length, selectedReturnDate, todayDateKey]);

  const handlePrevMonth = () => {
    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setCalendarMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedReturnDate(todayDateKey);
    setShowAllReturnHistory(false);
  };

  const calYear = calendarMonth.getFullYear();
  const calMonth = calendarMonth.getMonth();
  const calMonthName = calendarMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
  const daysInCurrentMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(calYear, calMonth, 0).getDate();

  const prevMonthOverflow = [];
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    prevMonthOverflow.push({
      dayNum: daysInPrevMonth - i,
      isCurrentMonth: false,
      dateKey: null
    });
  }

  const currentMonthDays = [];
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const dateKey = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    currentMonthDays.push({
      dayNum: d,
      isCurrentMonth: true,
      dateKey,
      returnCount: returnsByDate[dateKey]?.length || 0
    });
  }

  const totalRendered = prevMonthOverflow.length + currentMonthDays.length;
  const totalGridCells = totalRendered <= 35 ? 35 : 42;
  const nextMonthOverflow = [];
  for (let d = 1; d <= (totalGridCells - totalRendered); d++) {
    nextMonthOverflow.push({
      dayNum: d,
      isCurrentMonth: false,
      dateKey: null
    });
  }

  const allCalendarCells = [...prevMonthOverflow, ...currentMonthDays, ...nextMonthOverflow];

  const displayedLoans = showAllReturnHistory
    ? returnedLoans
    : (selectedReturnDate ? (returnsByDate[selectedReturnDate] || []) : []);

  const selectedDateLabel = useMemo(() => {
    if (!selectedReturnDate) return '';
    const [y, m, d] = selectedReturnDate.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, [selectedReturnDate]);

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
                onNavigate('lib@1234');
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
    const handleLibGithubAuth = async (e) => {
      if (e) e.preventDefault();
      setLibLoginError('');
      setLibGithubLoading(true);
      try {
        const res = await loginWithGithub({
          githubUsername: libGithubUsername.trim() || 'marcus-librarian',
          name: libGithubName.trim() || 'Marcus Thorne (Librarian)',
          email: libGithubEmail.trim() || 'librarian@libramind.edu'
        }, 'librarian');
        setShowLibGithubModal(false);
        if (res?.user && onNavigate) onNavigate('librarian', { user: res.user, tab: 'issue' });
        fetchLibrarianData(res?.user);
      } catch (err) {
        setLibLoginError(err.message || 'GitHub staff SSO failed');
      } finally {
        setLibGithubLoading(false);
      }
    };

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          backgroundColor: 'var(--editorial-bg)'
        }}
      >
        <div
          style={{
            width: '440px',
            maxWidth: '100%',
            backgroundColor: '#FFFFFF',
            padding: '36px 32px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--editorial-border)',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2
              style={{
                fontSize: '1.5rem',
                fontFamily: 'var(--font-serif)',
                color: 'var(--editorial-text)',
                fontWeight: 700,
                margin: '0 0 6px'
              }}
            >
              Librarian Portal
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--editorial-text-muted)', margin: 0, lineHeight: 1.45 }}>
              {authMode === 'signin'
                ? 'Sign in to access the library circulation desk.'
                : 'Create a new staff account to manage circulation.'}
            </p>
          </div>

          {/* Clean Segmented Tab Toggle: Sign In vs Sign Up */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--editorial-bg)',
              padding: '4px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '20px',
              border: '1px solid var(--editorial-border)'
            }}
          >
            <button
              type="button"
              onClick={() => { setAuthMode('signin'); setLibLoginError(''); }}
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: '0.86rem',
                fontWeight: 600,
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: authMode === 'signin' ? '#FFFFFF' : 'transparent',
                color: authMode === 'signin' ? 'var(--editorial-green)' : 'var(--editorial-text-muted)',
                boxShadow: authMode === 'signin' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('signup'); setLibLoginError(''); }}
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: '0.86rem',
                fontWeight: 600,
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: authMode === 'signup' ? '#FFFFFF' : 'transparent',
                color: authMode === 'signup' ? 'var(--editorial-green)' : 'var(--editorial-text-muted)',
                boxShadow: authMode === 'signup' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Register (Sign Up)
            </button>
          </div>

          {libLoginError && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--status-danger-bg)',
                color: 'var(--status-danger-text)',
                border: '1px solid rgba(150, 49, 36, 0.2)',
                fontSize: '0.84rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '18px'
              }}
            >
              <AlertCircle size={16} />
              <span>{libLoginError}</span>
            </div>
          )}

          {authMode === 'signin' ? (
            <>
              <form onSubmit={handleLibrarianLogin}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--editorial-text)', marginBottom: '6px' }}>
                    Email or Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="librarian@libramind.edu or lib@1234"
                    value={libEmail}
                    onChange={(e) => setLibEmail(e.target.value)}
                    autoComplete="username"
                    required
                    style={{
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px 12px',
                      fontSize: '0.90rem',
                      border: '1px solid var(--editorial-border)'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--editorial-text)', marginBottom: '6px' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={libPassword}
                    onChange={(e) => setLibPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    style={{
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px 12px',
                      fontSize: '0.90rem',
                      border: '1px solid var(--editorial-border)'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loggingInLib}
                  style={{
                    width: '100%',
                    padding: '11px',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  {loggingInLib ? 'Signing in...' : 'Sign In as Librarian'}
                </button>
              </form>

              <DemoAccounts
                roles={['librarian', 'admin']}
                onLogin={handleDemoLogin}
                loadingRole={demoLoading}
                title="Demo Staff Accounts"
                subtitle="Instant access to the circulation desk with the seeded librarian (admin also allowed)."
                dense
              />

              <div
                style={{
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--editorial-border)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--editorial-text-muted)', marginBottom: '6px' }}>
                  Looking for the other demo portals?
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('login')}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.74rem', padding: '5px 10px' }}
                  >
                    Student Demo →
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('admin@1234')}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.74rem', padding: '5px 10px' }}
                  >
                    Admin Demo →
                  </button>
                </div>
              </div>
            </>
          ) : (
            <form onSubmit={handleLibrarianRegister}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--editorial-text)', marginBottom: '5px' }}>
                  Full Staff Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Marcus Thorne"
                  value={libRegName}
                  onChange={(e) => setLibRegName(e.target.value)}
                  required
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    fontSize: '0.90rem',
                    border: '1px solid var(--editorial-border)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--editorial-text)', marginBottom: '5px' }}>
                  Staff Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="e.g. librarian@libramind.edu"
                  value={libRegEmail}
                  onChange={(e) => setLibRegEmail(e.target.value)}
                  autoComplete="email"
                  required
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    fontSize: '0.90rem',
                    border: '1px solid var(--editorial-border)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--editorial-text)', marginBottom: '5px' }}>
                  Create Password (min. 6 characters)
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter secure password"
                  value={libRegPassword}
                  onChange={(e) => setLibRegPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    fontSize: '0.90rem',
                    border: '1px solid var(--editorial-border)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--editorial-text)', marginBottom: '5px' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm password"
                  value={libRegConfirmPassword}
                  onChange={(e) => setLibRegConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    fontSize: '0.90rem',
                    border: '1px solid var(--editorial-border)'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={registeringLib}
                style={{
                  width: '100%',
                  padding: '11px',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                {registeringLib ? 'Creating Account...' : 'Create Librarian Account →'}
              </button>
            </form>
          )}
        </div>

        {/* Return to Public Home */}
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--editorial-text-muted)',
              fontSize: '0.82rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            ← Back to Library Home
          </button>
        </div>

        {/* Librarian GitHub Staff SSO Modal */}
        {showLibGithubModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(43, 33, 24, 0.55)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px'
            }}
            onClick={() => setShowLibGithubModal(false)}
          >
            <div
              className="bio-card"
              style={{
                width: '460px',
                maxWidth: '100%',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-xl)',
                padding: '32px',
                boxShadow: 'var(--shadow-xl)',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowLibGithubModal(false)}
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted-text)',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    backgroundColor: '#24292F',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(36, 41, 47, 0.25)'
                  }}
                >
                  <svg height="28" width="28" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--editorial-border)' }}>
                  <span style={{ fontSize: '1.2rem' }}>🌿</span>
                  <span style={{ height: '2px', width: '30px', backgroundColor: 'var(--editorial-border)' }} />
                  <span style={{ fontSize: '1.2rem' }}>🏛️</span>
                </div>

                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, var(--editorial-green), var(--editorial-border))',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(96, 108, 56, 0.25)'
                  }}
                >
                  <Layers size={24} />
                </div>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '22px' }}>
                <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-serif)', margin: '0 0 6px', color: 'var(--editorial-text)' }}>
                  Librarian Staff SSO (GitHub)
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', margin: 0 }}>
                  Authenticate your staff access to the Circulation Desk and Book Catalog.
                </p>
              </div>

              <form onSubmit={handleLibGithubAuth}>
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ fontSize: '0.80rem' }}>
                    Staff GitHub Username
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--muted-text)', fontWeight: 600 }}>@</span>
                    <input
                      type="text"
                      className="form-control"
                      style={{ paddingLeft: '28px' }}
                      value={libGithubUsername}
                      onChange={(e) => setLibGithubUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ fontSize: '0.80rem' }}>
                    Staff Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={libGithubName}
                    onChange={(e) => setLibGithubName(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ fontSize: '0.80rem' }}>
                    Staff Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={libGithubEmail}
                    onChange={(e) => setLibGithubEmail(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={libGithubLoading}
                  className="btn btn-botanical"
                  style={{ width: '100%', padding: '12px', fontSize: '0.94rem' }}
                >
                  {libGithubLoading ? 'Verifying Staff Access...' : 'Authorize Staff Desk →'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '14px' }}>
                  <button
                    type="button"
                    onClick={() => setShowLibGithubModal(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--muted-text)', fontSize: '0.82rem', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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
          Manage physical book copies, execute checkouts & returns, process hold pickup queues, and catalog inventory.
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

        </div>
      )}

      {/* TAB 1: Check Out (Issue Book & Borrow Options) */}
      {activeTab === 'issue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', alignItems: 'start' }}>
            {/* Left: Issue Book Form */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--editorial-border)',
                padding: '28px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <span className="editorial-kicker" style={{ color: 'var(--editorial-accent)' }}>
                DESK CIRCULATION
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--editorial-text)', margin: '4px 0 8px' }}>
                Issue Physical Book Copy
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--editorial-text-muted)', marginBottom: '22px', lineHeight: 1.5 }}>
                Enter the student's ID/email and book copy barcode. Database constraints will automatically check for student holds and copy availability.
              </p>

              <form onSubmit={handleIssueBook}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontSize: '0.80rem', fontWeight: 700 }}>
                    Student Membership ID or Email *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. STU-1001 or student@libramind.edu"
                    value={issueMemberId}
                    onChange={(e) => setIssueMemberId(e.target.value)}
                    required
                  />
                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setIssueMemberId('STU-1001')}
                      style={{ fontSize: '0.72rem', background: 'none', border: 'none', color: 'var(--editorial-accent)', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                    >
                      Fill Aarav Sharma (STU-1001)
                    </button>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontSize: '0.80rem', fontWeight: 700 }}>
                    Book Copy Barcode Identifier *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. LM-CS-1-C1 or click any available copy below"
                    value={issueCopyCode}
                    onChange={(e) => setIssueCopyCode(e.target.value)}
                    required
                  />

                  {/* Auto-detected Assigned User / Patron Card below Barcode */}
                  {barcodeLookingUp && (
                    <div style={{ fontSize: '0.74rem', color: 'var(--editorial-accent)', marginTop: '4px' }}>
                      Checking barcode in library database...
                    </div>
                  )}

                  {barcodeLookupInfo && (
                    <div
                      style={{
                        marginTop: '8px',
                        padding: '10px 14px',
                        backgroundColor: 'var(--editorial-bg-subtle)',
                        border: '1px solid var(--editorial-border)',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                        <div>
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--editorial-accent)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>
                            Matched Patron Details:
                          </span>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--editorial-text)' }}>
                            {barcodeLookupInfo.assignedUser
                              ? `${barcodeLookupInfo.assignedUser.name} (${barcodeLookupInfo.assignedUser.membership_id})`
                              : 'No patron assigned yet (Available on stack)'}
                          </div>
                          {barcodeLookupInfo.assignedUser?.relation && (
                            <span style={{ fontSize: '0.72rem', color: 'var(--editorial-green)', fontWeight: 600 }}>
                              Status: {barcodeLookupInfo.assignedUser.relation}
                            </span>
                          )}
                          {barcodeLookupInfo.book && (
                            <div style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)', marginTop: '2px' }}>
                              Volume: <em>{barcodeLookupInfo.book.title}</em>
                            </div>
                          )}
                        </div>

                        {barcodeLookupInfo.assignedUser && (
                          <button
                            type="button"
                            onClick={() => setIssueMemberId(barcodeLookupInfo.assignedUser.membership_id)}
                            className="btn btn-outline btn-sm"
                            style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                          >
                            ⚡ Auto-Fill Member ID
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-group" style={{ marginBottom: '22px' }}>
                  <label className="form-label" style={{ fontSize: '0.80rem', fontWeight: 700 }}>
                    Loan Duration
                  </label>
                  <select
                    className="form-control"
                    value={issueDays}
                    onChange={(e) => setIssueDays(e.target.value)}
                  >
                    <option value="7">7 Days (Short Research Loan)</option>
                    <option value="14">14 Days (Standard Student Loan)</option>
                    <option value="28">28 Days (Faculty / Extended Study)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '0.88rem' }}
                >
                  Authorize Checkout & Issue Copy
                </button>
              </form>
            </div>

            {/* Right: Quick Specimen of Currently Available Copies */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--editorial-border)',
                padding: '24px 28px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
                <div>
                  <span className="editorial-kicker" style={{ color: 'var(--editorial-accent)' }}>
                    READY IN STACKS
                  </span>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--editorial-text)', margin: '2px 0 0' }}>
                    Available Copies to Issue
                  </h4>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--editorial-text-muted)' }}>
                  1-Click Barcode Insert
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--editorial-text-muted)', marginBottom: '16px' }}>
                Click any specimen below to automatically populate the barcode input for checkout:
              </p>

              <div style={{ maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {books.filter(b => b.available_copies > 0).map(b => (
                  <div
                    key={b.id}
                    onClick={() => {
                      // Look for actual available copy code or book ID
                      const code = b.sample_copy_code || b.copy_code || String(b.id);
                      setIssueCopyCode(code);
                      showToast(`Selected "${b.title}" (Barcode: ${code}) for checkout`);
                    }}
                    style={{
                      padding: '10px 12px',
                      border: '1px solid var(--editorial-border)',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--editorial-bg)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--editorial-bg-subtle)';
                      e.currentTarget.style.borderColor = 'var(--editorial-green)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--editorial-bg)';
                      e.currentTarget.style.borderColor = 'var(--editorial-border)';
                    }}
                  >
                    <div style={{ minWidth: 0, paddingRight: '8px' }}>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.88rem', fontWeight: 700, color: 'var(--editorial-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {b.title}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)' }}>
                        {b.author} • {b.category} • Shelf {b.location_shelf || b.shelf || 'Main'}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ padding: '3px 9px', fontSize: '0.72rem', flexShrink: 0 }}
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom: Complete Currently Borrowed Books Table (Borrow Options) */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--editorial-border)',
              padding: '28px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
              <div>
                <span className="editorial-kicker" style={{ color: 'var(--editorial-accent)' }}>
                  ACTIVE CIRCULATION LEDGER
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: 'var(--editorial-text)', margin: '4px 0 0' }}>
                  Currently Borrowed Books ({activeLoans.length})
                </h3>
              </div>

              <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter by title, student, barcode..."
                  value={issueSearch}
                  onChange={(e) => setIssueSearch(e.target.value)}
                  style={{ fontSize: '0.82rem', padding: '7px 12px' }}
                />
              </div>
            </div>

            {activeLoans.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--editorial-text-muted)' }}>
                No active loans currently in circulation.
              </div>
            ) : (
              <div style={{
                maxHeight: '480px',
                overflowY: 'auto',
                overflowX: 'auto',
                border: '1px solid var(--editorial-border)',
                borderRadius: 'var(--radius-sm)',
                scrollbarWidth: 'thin',
                WebkitOverflowScrolling: 'touch'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--editorial-bg-subtle)' }}>
                    <tr style={{ backgroundColor: 'var(--editorial-bg-subtle)', borderBottom: '1px solid var(--editorial-border)' }}>
                      <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Borrower</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Book Title</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Barcode</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Due Date</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Circulation Status</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--editorial-text)' }}>Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeLoans
                      .filter(l => {
                        if (!issueSearch.trim()) return true;
                        const q = issueSearch.toLowerCase();
                        return (
                          (l.student_name && l.student_name.toLowerCase().includes(q)) ||
                          (l.membership_id && l.membership_id.toLowerCase().includes(q)) ||
                          (l.book_title && l.book_title.toLowerCase().includes(q)) ||
                          (l.copy_code && l.copy_code.toLowerCase().includes(q))
                        );
                      })
                      .map(loan => {
                        const dueDate = new Date(loan.due_date);
                        const isOverdue = loan.status === 'overdue' || new Date() > dueDate;
                        const daysLeft = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));

                        return (
                          <tr key={loan.id} style={{ borderBottom: '1px solid var(--editorial-border)' }}>
                            <td style={{ padding: '12px 14px' }}>
                              <strong style={{ color: 'var(--editorial-text)' }}>{loan.student_name}</strong>
                              <div style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)' }}>
                                {loan.membership_id || loan.student_email}
                              </div>
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--editorial-text)' }}>
                                {loan.book_title}
                              </span>
                            </td>
                            <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--editorial-text)' }}>
                              {loan.copy_code}
                            </td>
                            <td style={{ padding: '12px 14px', color: 'var(--editorial-text)' }}>
                              {dueDate.toLocaleDateString()}
                              <div style={{ fontSize: '0.72rem', color: isOverdue ? '#C5221F' : 'var(--editorial-text-muted)' }}>
                                {isOverdue ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days remaining`}
                              </div>
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                              {loan.penalty_status === 'pending' || Boolean(loan.penalty_qr_code) ? (
                                <span style={{ fontSize: '0.70rem', fontWeight: 700, color: '#DC2626', backgroundColor: '#FEE2E2', padding: '2px 8px', borderRadius: '2px', border: '1px solid #FCA5A5' }}>
                                  ● PENALTY QR SENT (${loan.penalty_amount ? Number(loan.penalty_amount).toFixed(2) : (loan.fine_amount ? Number(loan.fine_amount).toFixed(2) : '15.00')})
                                </span>
                              ) : (loan.warning_sent || loan.return_warning_active) ? (
                                <span style={{ fontSize: '0.70rem', fontWeight: 700, color: '#D97706', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '2px', border: '1px solid #FCD34D' }}>
                                  ● RETURN WARNING SENT
                                </span>
                              ) : isOverdue ? (
                                <span style={{ fontSize: '0.70rem', fontWeight: 700, color: '#C5221F', backgroundColor: '#FDECE7', padding: '2px 8px', borderRadius: '2px', border: '1px solid #FCA5A5' }}>
                                  ● OVERDUE (Fine: ${loan.fine_amount ? loan.fine_amount.toFixed(2) : '1.00'})
                                </span>
                              ) : (
                                <span style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--editorial-green)', backgroundColor: 'var(--editorial-bg-subtle)', padding: '2px 8px', borderRadius: '2px', border: '1px solid var(--editorial-border)' }}>
                                  ● On Loan in Good Standing
                                </span>
                              )}
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                {loan.penalty_status === 'pending' || Boolean(loan.penalty_qr_code) ? (
                                  <button
                                    type="button"
                                    onClick={() => handleCancelPenalty(loan.id)}
                                    className="btn btn-sm"
                                    style={{
                                      padding: '4px 10px',
                                      fontSize: '0.74rem',
                                      backgroundColor: '#374151',
                                      color: '#FFFFFF',
                                      border: 'none',
                                      fontWeight: 700,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                    title="Cancel and waive penalty; clears QR lock and restores borrowing privileges"
                                  >
                                    <X size={12} />
                                    Cancel Penalty
                                  </button>
                                ) : (isOverdue || (loan.borrow_date && Math.floor((new Date() - new Date(loan.borrow_date)) / (1000 * 60 * 60 * 24)) >= 14)) ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleSendReturnWarning(loan.id)}
                                      className="btn btn-sm"
                                      style={{
                                        padding: '4px 9px',
                                        fontSize: '0.73rem',
                                        backgroundColor: '#D97706',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        fontWeight: 600,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                      }}
                                      title="Notify user that return date has passed. Warning banner appears upon user sign-in."
                                    >
                                      <AlertCircle size={12} />
                                      {loan.warning_sent ? 'Re-send Return Warning' : 'Send Book Return Warning'}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleIssuePenaltyQR(loan.id)}
                                      className="btn btn-sm"
                                      style={{
                                        padding: '4px 9px',
                                        fontSize: '0.73rem',
                                        backgroundColor: '#B91C1C',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        fontWeight: 700,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                      }}
                                      title="Send penalty payment request and QR code to user; blocks book borrowing until paid"
                                    >
                                      <AlertTriangle size={12} />
                                      Send Penalty Payment Request
                                    </button>
                                  </>
                                ) : null}
                                <button
                                  type="button"
                                  onClick={() => handleReturnBook(loan.id)}
                                  className="btn btn-outline btn-sm"
                                  style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                                >
                                  Process Return
                                </button>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    try {
                                      await api.renewLoan(loan.id);
                                      showToast(`Renewed "${loan.book_title}" +14 days`);
                                      fetchLibrarianData();
                                    } catch (e) {
                                      showToast(e.message, true);
                                    }
                                  }}
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                                >
                                  Renew
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Process Returns & Overdue Fines */}
      {activeTab === 'return' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--editorial-border)', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
          <span className="editorial-kicker" style={{ color: 'var(--editorial-accent)' }}>
            CIRCULATION CHECK-IN &amp; RETURNS
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', margin: '4px 0 16px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: 'var(--editorial-text)', margin: 0 }}>
              Book Returns &amp; Circulation Ledger
            </h3>

            {/* Subtab Switcher */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setReturnSubTab('active')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid var(--editorial-border)',
                  backgroundColor: returnSubTab === 'active' ? 'var(--editorial-text)' : '#FFFFFF',
                  color: returnSubTab === 'active' ? '#FFFFFF' : 'var(--editorial-text)'
                }}
              >
                Pending Returns ({activeLoans.length})
              </button>
              <button
                type="button"
                onClick={() => setReturnSubTab('history')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid var(--editorial-border)',
                  backgroundColor: returnSubTab === 'history' ? 'var(--editorial-text)' : '#FFFFFF',
                  color: returnSubTab === 'history' ? '#FFFFFF' : 'var(--editorial-text)'
                }}
              >
                Returned History ({returnedLoans.length})
              </button>
            </div>
          </div>

          <p style={{ fontSize: '0.86rem', color: 'var(--editorial-text-muted)', marginBottom: '22px', lineHeight: 1.5 }}>
            Process book check-ins. If overdue, fine is computed automatically. Completed returns are archived in the circulation history ledger below.
          </p>

          {returnSubTab === 'active' ? (
            activeLoans.length === 0 ? (
              <div style={{ padding: '36px 20px', textAlign: 'center', backgroundColor: 'var(--editorial-bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--editorial-border)' }}>
                <CheckCircle size={32} color="var(--editorial-green)" style={{ margin: '0 auto 8px' }} />
                <h4 style={{ fontFamily: 'var(--font-serif)', margin: '0 0 4px', color: 'var(--editorial-text)' }}>All Volumes Checked In</h4>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--editorial-text-muted)' }}>There are no active loans currently pending check-in.</p>
              </div>
            ) : (
              <div style={{
                maxHeight: '480px',
                overflowY: 'auto',
                overflowX: 'auto',
                scrollbarWidth: 'thin',
                WebkitOverflowScrolling: 'touch'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 5, backgroundColor: 'var(--editorial-bg-subtle)' }}>
                    <tr style={{ backgroundColor: 'var(--editorial-bg-subtle)', borderBottom: '1px solid var(--editorial-border)' }}>
                      <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Borrower</th>
                      <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Book Title</th>
                      <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Copy Barcode</th>
                      <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Due Date</th>
                      <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Circulation Status</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--editorial-text)' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeLoans.map(loan => {
                      const dueDate = new Date(loan.due_date);
                      const isOverdue = loan.status === 'overdue' || new Date() > dueDate;

                      return (
                        <tr key={loan.id} style={{ borderBottom: '1px solid var(--editorial-border)' }}>
                          <td style={{ padding: '12px 14px' }}>
                            <strong style={{ color: 'var(--editorial-text)' }}>{loan.student_name}</strong>
                            <div style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)' }}>{loan.membership_id}</div>
                          </td>
                          <td style={{ padding: '12px 14px', fontFamily: 'var(--font-serif)', color: 'var(--editorial-text)', fontWeight: 700 }}>
                            {loan.book_title}
                          </td>
                          <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--editorial-text)' }}>
                            {loan.copy_code}
                          </td>
                          <td style={{ padding: '12px 14px', color: isOverdue ? '#C5221F' : 'var(--editorial-text)' }}>
                            {dueDate.toLocaleDateString()}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            {loan.penalty_status === 'pending' || Boolean(loan.penalty_qr_code) ? (
                              <span style={{ fontSize: '0.70rem', fontWeight: 800, color: '#991B1B', backgroundColor: '#FEE2E2', padding: '2px 8px', borderRadius: '2px', border: '1px solid #F87171' }}>
                                ● PENALTY QR SENT (${loan.penalty_amount ? Number(loan.penalty_amount).toFixed(2) : (loan.fine_amount ? Number(loan.fine_amount).toFixed(2) : '15.00')})
                              </span>
                            ) : (loan.warning_sent || loan.return_warning_active) ? (
                              <span style={{ fontSize: '0.70rem', fontWeight: 700, color: '#D97706', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '2px', border: '1px solid #FCD34D' }}>
                                ● RETURN WARNING SENT
                              </span>
                            ) : isOverdue ? (
                              <span style={{ fontSize: '0.70rem', fontWeight: 700, color: '#C5221F', backgroundColor: '#FDECE7', padding: '2px 8px', borderRadius: '2px', border: '1px solid #FCA5A5' }}>
                                ● Overdue (${loan.fine_amount ? loan.fine_amount.toFixed(2) : '1.00'})
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--editorial-green)', backgroundColor: 'var(--editorial-bg-subtle)', padding: '2px 8px', borderRadius: '2px', border: '1px solid var(--editorial-border)' }}>
                                Active Loan
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
                              {(isOverdue || (loan.borrow_date && Math.floor((new Date() - new Date(loan.borrow_date)) / (1000 * 60 * 60 * 24)) >= 14)) && (
                                loan.penalty_status === 'pending' || Boolean(loan.penalty_qr_code) ? (
                                  <button
                                    type="button"
                                    onClick={() => handleCancelPenalty(loan.id)}
                                    className="btn btn-sm"
                                    style={{
                                      padding: '5px 10px',
                                      fontSize: '0.74rem',
                                      backgroundColor: '#374151',
                                      color: '#FFFFFF',
                                      border: 'none',
                                      fontWeight: 700,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                    title="Cancel / waive penalty fine and restore member privileges immediately"
                                  >
                                    ❌ Cancel Penalty
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleSendReturnWarning(loan.id)}
                                      className="btn btn-sm"
                                      style={{
                                        padding: '5px 9px',
                                        fontSize: '0.73rem',
                                        backgroundColor: '#D97706',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        fontWeight: 600,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                      }}
                                      title="Notify user that return date has passed. Warning banner appears upon user sign-in."
                                    >
                                      <AlertCircle size={13} />
                                      {loan.warning_sent ? 'Re-send Return Warning' : 'Send Book Return Warning'}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleIssuePenaltyQR(loan.id)}
                                      className="btn btn-sm"
                                      style={{
                                        padding: '5px 10px',
                                        fontSize: '0.74rem',
                                        backgroundColor: '#B91C1C',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        fontWeight: 700,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                      }}
                                      title="Send penalty payment request and QR code to user"
                                    >
                                      <AlertTriangle size={13} />
                                      Send Penalty Payment Request
                                    </button>
                                  </>
                                )
                              )}
                              <button
                                onClick={() => handleReturnBook(loan.id)}
                                className="btn btn-primary btn-sm"
                                style={{ padding: '5px 12px', fontSize: '0.76rem' }}
                              >
                                Process Return
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            returnedLoans.length === 0 ? (
              <div style={{ padding: '36px 20px', textAlign: 'center', backgroundColor: 'var(--editorial-bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--editorial-border)' }}>
                <RotateCcw size={32} color="var(--editorial-accent)" style={{ margin: '0 auto 8px' }} />
                <h4 style={{ fontFamily: 'var(--font-serif)', margin: '0 0 4px', color: 'var(--editorial-text)' }}>No Returned Records Yet</h4>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--editorial-text-muted)' }}>Completed return transactions will be archived here upon desk check-in.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}>
                {/* Left Column: Interactive Calendar Card */}
                <div style={{
                  flex: '0 0 340px',
                  maxWidth: '380px',
                  width: '100%',
                  backgroundColor: 'var(--editorial-bg-subtle)',
                  border: '1px solid var(--editorial-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {/* Calendar Navigation Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={18} color="var(--editorial-accent)" />
                      <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.02rem', color: 'var(--editorial-text)' }}>
                        {calMonthName}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        style={{
                          padding: '4px 7px',
                          border: '1px solid var(--editorial-border)',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--editorial-text)'
                        }}
                        title="Previous Month"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={handleJumpToToday}
                        style={{
                          padding: '4px 8px',
                          border: '1px solid var(--editorial-border)',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: '#FFFFFF',
                          cursor: 'pointer',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          color: 'var(--editorial-text)'
                        }}
                        title="Jump to Today"
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={handleNextMonth}
                        style={{
                          padding: '4px 7px',
                          border: '1px solid var(--editorial-border)',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--editorial-text)'
                        }}
                        title="Next Month"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Day of Week Headers */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px' }}>
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, idx) => (
                      <div key={idx} style={{ fontSize: '0.70rem', fontWeight: 800, color: 'var(--editorial-text-muted)', textTransform: 'uppercase' }}>
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                    {allCalendarCells.map((cell, idx) => {
                      if (!cell.isCurrentMonth) {
                        return (
                          <div
                            key={`overflow-${idx}`}
                            style={{
                              minHeight: '46px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.76rem',
                              color: '#CBD5E1',
                              borderRadius: 'var(--radius-sm)'
                            }}
                          >
                            {cell.dayNum}
                          </div>
                        );
                      }

                      const isSelected = selectedReturnDate === cell.dateKey && !showAllReturnHistory;
                      const isToday = cell.dateKey === todayDateKey;
                      const hasReturns = cell.returnCount > 0;

                      return (
                        <button
                          key={cell.dateKey}
                          type="button"
                          onClick={() => {
                            setSelectedReturnDate(cell.dateKey);
                            setShowAllReturnHistory(false);
                          }}
                          style={{
                            minHeight: '46px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '2px',
                            padding: '4px 1px',
                            border: isSelected
                              ? '2px solid var(--editorial-text)'
                              : isToday
                                ? '2px solid var(--editorial-accent)'
                                : hasReturns
                                  ? '1px solid #86EFAC'
                                  : '1px solid transparent',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: isSelected
                              ? 'var(--editorial-text)'
                              : hasReturns
                                ? '#F0FDF4'
                                : '#FFFFFF',
                            color: isSelected
                              ? '#FFFFFF'
                              : 'var(--editorial-text)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            position: 'relative'
                          }}
                          title={hasReturns ? `${cell.returnCount} volume(s) returned on this date` : 'No returns recorded'}
                        >
                          <span style={{ fontSize: '0.80rem', fontWeight: (isSelected || hasReturns || isToday) ? 800 : 500 }}>
                            {cell.dayNum}
                          </span>
                          {hasReturns && (
                            <span style={{
                              fontSize: '0.60rem',
                              fontWeight: 800,
                              padding: '1px 4px',
                              borderRadius: '6px',
                              backgroundColor: isSelected ? 'rgba(255,255,255,0.3)' : '#16A34A',
                              color: '#FFFFFF',
                              lineHeight: '1.1'
                            }}>
                              {cell.returnCount}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Calendar Legend & View All Toggle */}
                  <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--editorial-border)', fontSize: '0.74rem', color: 'var(--editorial-text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16A34A', display: 'inline-block' }} />
                      <span>Dates with return records ({datesWithReturns.length} active days)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ width: '8px', height: '8px', border: '2px solid var(--editorial-accent)', borderRadius: '2px', display: 'inline-block' }} />
                      <span>Current date (Today)</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAllReturnHistory(prev => !prev)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--editorial-border)',
                        backgroundColor: showAllReturnHistory ? 'var(--editorial-text)' : '#FFFFFF',
                        color: showAllReturnHistory ? '#FFFFFF' : 'var(--editorial-text)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <RotateCcw size={14} />
                      {showAllReturnHistory ? 'Filter by Calendar Date' : `Show All Return History (${returnedLoans.length})`}
                    </button>
                  </div>
                </div>

                {/* Right Column: Daily Returns Ledger */}
                <div style={{
                  flex: '1 1 540px',
                  minWidth: '320px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--editorial-border)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {/* Header of Daily Ledger */}
                  <div style={{
                    padding: '16px 20px',
                    backgroundColor: 'var(--editorial-bg-subtle)',
                    borderBottom: '1px solid var(--editorial-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={18} color="var(--editorial-accent)" />
                        <h4 style={{ margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--editorial-text)', fontSize: '1.02rem' }}>
                          {showAllReturnHistory ? 'All Archived Circulation Returns' : `Returns on ${selectedDateLabel}`}
                        </h4>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '10px',
                          backgroundColor: displayedLoans.length > 0 ? '#DCFCE7' : '#F3F4F6',
                          color: displayedLoans.length > 0 ? '#15803D' : '#6B7280',
                          border: displayedLoans.length > 0 ? '1px solid #86EFAC' : '1px solid #E5E7EB'
                        }}>
                          {displayedLoans.length} {displayedLoans.length === 1 ? 'Volume' : 'Volumes'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--editorial-text-muted)', marginTop: '2px' }}>
                        {showAllReturnHistory
                          ? `Displaying all ${returnedLoans.length} returned volumes across all recorded dates.`
                          : `Displaying volumes returned to stacks on ${selectedReturnDate}.`}
                      </div>
                    </div>

                    {showAllReturnHistory && (
                      <button
                        type="button"
                        onClick={() => setShowAllReturnHistory(false)}
                        style={{
                          padding: '5px 12px',
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--editorial-border)',
                          backgroundColor: '#FFFFFF',
                          color: 'var(--editorial-text)',
                          cursor: 'pointer'
                        }}
                      >
                        ← Return to Selected Date
                      </button>
                    )}
                  </div>

                  {/* Ledger Table / Empty State */}
                  {displayedLoans.length === 0 ? (
                    <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                      <Calendar size={36} color="var(--editorial-accent)" style={{ margin: '0 auto 12px', opacity: 0.7 }} />
                      <h5 style={{ fontFamily: 'var(--font-serif)', margin: '0 0 6px', color: 'var(--editorial-text)', fontSize: '1.05rem' }}>
                        No Books Returned on this Date
                      </h5>
                      <p style={{ margin: '0 0 16px', fontSize: '0.84rem', color: 'var(--editorial-text-muted)', maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>
                        No return transactions were archived for <strong>{selectedDateLabel}</strong>. Click any date with a green return badge on the calendar to view return logs.
                      </p>
                      {datesWithReturns.length > 0 && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--editorial-text-muted)' }}>Quick jump:</span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedReturnDate(datesWithReturns[0]);
                              const [y, m] = datesWithReturns[0].split('-').map(Number);
                              setCalendarMonth(new Date(y, m - 1, 1));
                              setShowAllReturnHistory(false);
                            }}
                            style={{
                              padding: '5px 12px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid #86EFAC',
                              backgroundColor: '#F0FDF4',
                              color: '#15803D',
                              cursor: 'pointer'
                            }}
                          >
                            View Latest Returns ({datesWithReturns[0]})
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{
                      maxHeight: '450px',
                      overflowY: 'auto',
                      overflowX: 'auto',
                      scrollbarWidth: 'thin',
                      WebkitOverflowScrolling: 'touch'
                    }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                        <thead style={{ position: 'sticky', top: 0, zIndex: 5, backgroundColor: 'var(--editorial-bg-subtle)' }}>
                          <tr style={{ backgroundColor: 'var(--editorial-bg-subtle)', borderBottom: '1px solid var(--editorial-border)' }}>
                            <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Borrower</th>
                            <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Book Title</th>
                            <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Barcode</th>
                            <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Borrow Date</th>
                            <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Return Date</th>
                            <th style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--editorial-text)' }}>Circulation Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayedLoans.map(loan => (
                            <tr key={loan.id} style={{ borderBottom: '1px solid var(--editorial-border)' }}>
                              <td style={{ padding: '12px 14px' }}>
                                <strong style={{ color: 'var(--editorial-text)' }}>{loan.student_name || 'Member'}</strong>
                                <div style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)' }}>{loan.membership_id}</div>
                              </td>
                              <td style={{ padding: '12px 14px', fontFamily: 'var(--font-serif)', color: 'var(--editorial-text)', fontWeight: 700 }}>
                                {loan.book_title}
                              </td>
                              <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--editorial-text)' }}>
                                {loan.copy_code}
                              </td>
                              <td style={{ padding: '12px 14px', color: 'var(--editorial-text-muted)', fontSize: '0.82rem' }}>
                                {loan.borrow_date ? new Date(loan.borrow_date).toLocaleDateString() : '—'}
                              </td>
                              <td style={{ padding: '12px 14px', color: 'var(--editorial-text)', fontWeight: 600 }}>
                                {loan.return_date ? new Date(loan.return_date).toLocaleDateString() : new Date().toLocaleDateString()}
                              </td>
                              <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--editorial-green)', backgroundColor: 'var(--editorial-bg-subtle)', padding: '3px 8px', borderRadius: '2px', border: '1px solid var(--editorial-border)' }}>
                                  ✓ Returned to Stacks
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* TAB 3: Waiting Users & Hold Queues */}
      {activeTab === 'reservations' && (
        <div className="bio-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Bookmark size={22} color="var(--editorial-accent)" />
            <h3 style={{ fontSize: '1.35rem', color: 'var(--forest-dark)', margin: 0, fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
              Waiting Users &amp; Hold Queue Desk
            </h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', marginBottom: '20px' }}>
            Display of library patrons who have placed books on hold or are waiting for books (Waiting List). Confirm book pickup when copies arrive at the desk.
          </p>

          <div style={{
            maxHeight: '480px',
            overflowY: 'auto',
            overflowX: 'auto',
            border: '1px solid var(--editorial-border)',
            borderRadius: 'var(--radius-sm)',
            scrollbarWidth: 'thin',
            WebkitOverflowScrolling: 'touch'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--cream)' }}>
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
                          border: '1.5px solid var(--editorial-border)',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                        }}>
                          <img
                            src={resolveBookCoverUrl(r.cover_image, r.book_title, 'Archivist', 'Archival')}
                            alt={r.book_title}
                            onError={(e) => handleBookCoverError(e, r.book_title, 'Archivist', 'Archival')}
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
              <div className="form-group" style={{ gridColumn: 'span 2', position: 'relative' }}>
                <label className="form-label" style={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Type / Search Existing Book in Catalog *</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', fontWeight: 500 }}>
                    {books.length} titles in catalog
                  </span>
                </label>
                
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type book title, author, or ISBN (e.g. The Alchemist, Paulo Coelho)..."
                    value={copySearchQuery}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCopySearchQuery(val);
                      setCopySearchOpen(true);
                      setCopyBookError('');
                      if (!val.trim()) {
                        setSelectedCopyBook(null);
                        setCopyBookId('');
                        return;
                      }
                      const exact = books.find(b => b.title.toLowerCase() === val.trim().toLowerCase() || (b.isbn && b.isbn.toLowerCase() === val.trim().toLowerCase()));
                      if (exact) {
                        setSelectedCopyBook(exact);
                        setCopyBookId(exact.id || exact._id);
                      } else {
                        setSelectedCopyBook(null);
                        setCopyBookId('');
                      }
                    }}
                    onFocus={() => setCopySearchOpen(true)}
                    required={!selectedCopyBook}
                    style={{
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px 14px',
                      fontSize: '0.90rem',
                      border: copyBookError ? '1px solid #DC2626' : selectedCopyBook ? '1px solid #16A34A' : '1px solid var(--editorial-border)'
                    }}
                  />
                  {copySearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setCopySearchQuery('');
                        setSelectedCopyBook(null);
                        setCopyBookId('');
                        setCopyBookError('');
                        setCopySearchOpen(false);
                      }}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--muted-text)',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Auto-suggest dropdown when typing */}
                {copySearchOpen && copySearchQuery.trim().length > 0 && !selectedCopyBook && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      zIndex: 50,
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--editorial-border)',
                      borderRadius: '4px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      maxHeight: '260px',
                      overflowY: 'auto',
                      marginTop: '4px'
                    }}
                  >
                    {(() => {
                      const q = copySearchQuery.trim().toLowerCase();
                      const matches = books.filter(b =>
                        b.title.toLowerCase().includes(q) ||
                        (b.author && b.author.toLowerCase().includes(q)) ||
                        (b.isbn && b.isbn.toLowerCase().includes(q))
                      ).slice(0, 8);

                      if (matches.length === 0) {
                        return (
                          <div style={{ padding: '14px 16px', color: '#DC2626', fontSize: '0.84rem', fontWeight: 600 }}>
                            ⚠️ No book found matching "{copySearchQuery}".
                            <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)', marginTop: '4px', fontWeight: 400 }}>
                              This book does not exist in the library catalog. You cannot add copies until it is cataloged below.
                            </div>
                          </div>
                        );
                      }

                      return matches.map(b => (
                        <div
                          key={b.id || b._id}
                          onClick={() => {
                            setSelectedCopyBook(b);
                            setCopyBookId(b.id || b._id);
                            setCopySearchQuery(b.title);
                            setCopySearchOpen(false);
                            setCopyBookError('');
                          }}
                          style={{
                            padding: '10px 14px',
                            cursor: 'pointer',
                            borderBottom: '1px solid var(--editorial-border)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'background-color 0.1s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--editorial-bg)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                        >
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--editorial-text)' }}>
                              {b.title}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>
                              by {b.author} • ISBN: {b.isbn || 'N/A'} • {b.category}
                            </div>
                          </div>
                          <span style={{ fontSize: '0.74rem', fontWeight: 700, padding: '3px 8px', borderRadius: '3px', backgroundColor: '#E0F2FE', color: '#0369A1' }}>
                            {b.available_copies}/{b.total_copies} in stacks
                          </span>
                        </div>
                      ));
                    })()}
                  </div>
                )}

                {/* Validation Error: Book not in catalog */}
                {copyBookError && (
                  <div style={{ marginTop: '8px', padding: '10px 12px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '4px', color: '#991B1B', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={16} />
                    <span>{copyBookError}</span>
                  </div>
                )}

                {/* Verified Book Preview Card */}
                {selectedCopyBook && (
                  <div
                    style={{
                      marginTop: '10px',
                      padding: '12px 14px',
                      backgroundColor: '#F0FDF4',
                      border: '1px solid #86EFAC',
                      borderRadius: '4px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          ✓ Catalog Book Verified
                        </span>
                      </div>
                      <div style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--forest-dark)', marginTop: '2px' }}>
                        {selectedCopyBook.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>
                        Author: {selectedCopyBook.author} • Location: {selectedCopyBook.floor || 'Floor 1'}, {selectedCopyBook.section || 'General'} (Shelf {selectedCopyBook.shelf || 'Main'})
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#15803D' }}>
                        Current Stock: {selectedCopyBook.available_copies}/{selectedCopyBook.total_copies}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCopyBook(null);
                          setCopyBookId('');
                          setCopySearchQuery('');
                          setCopySearchOpen(false);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#DC2626',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          marginTop: '4px',
                          padding: 0
                        }}
                      >
                        Change Book
                      </button>
                    </div>
                  </div>
                )}
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
                    style={{ width: '56px', height: '72px', objectFit: 'cover', borderRadius: '6px', border: '1.5px solid var(--editorial-border)' }}
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

          {/* Section C: Upload Photo of the Book Directly from Device */}
          <div className="bio-card" style={{ padding: '28px', backgroundColor: '#FFFFFF', borderLeft: '5px solid #2A6F97' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Camera size={22} color="#2A6F97" />
              <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)', margin: 0 }}>
                Upload Photo of the Book
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', marginBottom: '20px' }}>
              Upload authentic original photos of the book directly from your device. Uploaded photos are stored locally on the server and viewable offline without internet.
            </p>

            <form onSubmit={handleSaveInventoryPhoto}>
              <div className="form-group" style={{ maxWidth: '480px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Upload size={14} color="#2A6F97" />
                  Choose Photo Directly from Device *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleInventoryPhotoSelect}
                  required
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--sage)', marginTop: '4px', display: 'block' }}>
                  Supports JPG, PNG, WebP up to 8MB. Stored locally in library archive.
                </span>
              </div>

              {inventoryPhotoPreview && (
                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '16px', padding: '14px', backgroundColor: 'var(--editorial-bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--editorial-border)', maxWidth: '480px' }}>
                  <div style={{ width: '70px', height: '96px', borderRadius: '4px', overflow: 'hidden', border: '2px solid var(--editorial-green)', backgroundColor: '#FFF', flexShrink: 0 }}>
                    <img
                      src={inventoryPhotoPreview}
                      alt="Device upload preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--editorial-green)', display: 'block' }}>
                      ✓ Photo Selected from Device
                    </span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)', display: 'block', marginTop: '2px' }}>
                      Ready to upload and store into library archive.
                    </span>
                  </div>
                </div>
              )}

              <div style={{ marginTop: '20px' }}>
                <button
                  type="submit"
                  disabled={inventoryPhotoUploading || !inventoryPhotoPreview}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', backgroundColor: '#2A6F97', borderColor: '#2A6F97' }}
                >
                  <Upload size={16} />
                  {inventoryPhotoUploading ? 'Saving Photo Locally...' : 'Upload Photo from Device'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB: Study Pods & Carrels Live Schedule (Read-Only Monitor) */}
      {activeTab === 'seats' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--editorial-border)', padding: '24px 28px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--editorial-accent)', marginBottom: '4px' }}>
              <Armchair size={18} />
              <span className="editorial-kicker" style={{ color: 'var(--editorial-accent)' }}>
                ARCHITECTURAL CARRELS &amp; DESKS
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: 'var(--editorial-text)', margin: '4px 0 6px' }}>
                  Study Pods Live Schedule &amp; Timings ({seats.length})
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--editorial-text-muted)', margin: 0 }}>
                  Real-time read-only monitor of student study pod reservations and booked time slots. Reservations automatically confirm upon student booking and automatically release when time slot ends.
                </p>
              </div>

              {/* Status summary pill indicators */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '4px 10px', borderRadius: '4px', backgroundColor: 'var(--editorial-bg-subtle)', border: '1px solid var(--editorial-border)', color: 'var(--editorial-green)' }}>
                  ● {seats.filter(s => s.effective_status === 'available').length} Available
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '4px 10px', borderRadius: '4px', backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', color: '#B45309' }}>
                  ● {seats.filter(s => s.effective_status === 'occupied').length} Booked / Occupied
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '4px 10px', borderRadius: '4px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B' }}>
                  ● {seats.filter(s => s.effective_status === 'maintenance').length} Maintenance
                </span>
              </div>
            </div>

            {/* Filter controls */}
            <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', alignItems: 'center', marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--editorial-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--editorial-text)', textTransform: 'uppercase' }}>Floor:</span>
                {['All', 'Floor 1', 'Floor 2'].map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setSeatFloorFilter(f)}
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      borderRadius: '2px',
                      border: '1px solid var(--editorial-border)',
                      backgroundColor: seatFloorFilter === f ? 'var(--editorial-text)' : '#FFFFFF',
                      color: seatFloorFilter === f ? '#FFFFFF' : 'var(--editorial-text)'
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--editorial-text)', textTransform: 'uppercase' }}>Status:</span>
                {['All', 'Available', 'Occupied'].map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSeatStatusFilter(st)}
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      borderRadius: '2px',
                      border: '1px solid var(--editorial-border)',
                      backgroundColor: seatStatusFilter.toLowerCase() === st.toLowerCase() ? 'var(--editorial-text)' : '#FFFFFF',
                      color: seatStatusFilter.toLowerCase() === st.toLowerCase() ? '#FFFFFF' : 'var(--editorial-text)'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Seat Cards Grid - Pure Read-Only Monitor */}
          {(() => {
            const filteredSeats = seats
              .filter(s => {
                if (seatFloorFilter === 'All') return true;
                const sf = String(s.floor || '').toLowerCase();
                const tf = seatFloorFilter.toLowerCase();
                return sf.includes(tf) || (tf.includes('1') && sf.includes('1')) || (tf.includes('2') && sf.includes('2'));
              })
              .filter(s => {
                if (seatStatusFilter === 'All') return true;
                const eff = String(s.effective_status || 'available').toLowerCase();
                return eff === seatStatusFilter.toLowerCase();
              });

            if (filteredSeats.length === 0) {
              return (
                <div
                  style={{
                    padding: '48px 24px',
                    textAlign: 'center',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--editorial-border)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <Armchair size={36} color="var(--editorial-accent)" style={{ margin: '0 auto 12px' }} />
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--editorial-text)', margin: '0 0 8px' }}>
                    No Study Pods Found
                  </h4>
                  <p style={{ fontSize: '0.86rem', color: 'var(--editorial-text-muted)', maxWidth: '440px', margin: '0 auto 18px' }}>
                    No study pods match the selected filters.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSeatFloorFilter('All'); setSeatStatusFilter('All'); fetchLibrarianData(); }}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '7px 16px', fontSize: '0.82rem' }}
                  >
                    Reset Pod Filters &amp; Show All →
                  </button>
                </div>
              );
            }

            return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '18px' }}>
                {filteredSeats.map(seat => {
                  const effStatus = seat.effective_status || 'available';
                  const isAvail = effStatus === 'available';
                  const isOccupied = effStatus === 'occupied';
                  const isMaint = effStatus === 'maintenance';

                  return (
                    <div
                      key={seat.id || seat._id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--editorial-border)',
                        borderTop: isAvail
                          ? '3px solid var(--editorial-green)'
                          : isOccupied
                            ? '3px solid #D97706'
                            : '3px solid #EF4444',
                        borderRadius: 'var(--radius-sm)',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '14px',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <div>
                        {/* Top: Floor, Section & Status */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <span style={{ fontSize: '0.70rem', color: 'var(--editorial-accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                              {seat.floor} • {seat.section}
                            </span>
                            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--editorial-text)', margin: '2px 0 0' }}>
                              Study Pod {seat.seat_number}
                            </h4>
                          </div>

                          {isAvail && (
                            <span className="badge badge-available">● Available</span>
                          )}
                          {isOccupied && (
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#B45309', backgroundColor: '#FEF3C7', padding: '3px 8px', borderRadius: '4px', border: '1px solid #FCD34D' }}>
                              ● Booked
                            </span>
                          )}
                          {isMaint && (
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#991B1B', backgroundColor: '#FEE2E2', padding: '3px 8px', borderRadius: '4px', border: '1px solid #FCA5A5' }}>
                              ● Maintenance
                            </span>
                          )}
                        </div>

                        {/* Features */}
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                          {seat.has_power === 1 && (
                            <span style={{ fontSize: '0.68rem', color: 'var(--editorial-green)', backgroundColor: 'var(--editorial-bg-subtle)', padding: '2px 6px', borderRadius: '2px', border: '1px solid var(--editorial-border)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              <Zap size={10} /> Power
                            </span>
                          )}
                          {seat.has_monitor === 1 && (
                            <span style={{ fontSize: '0.68rem', color: 'var(--editorial-green)', backgroundColor: 'var(--editorial-bg-subtle)', padding: '2px 6px', borderRadius: '2px', border: '1px solid var(--editorial-border)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              <Monitor size={10} /> Screen
                            </span>
                          )}
                        </div>

                        {/* LIVE BOOKING DETAILS: STUDENT NAME & TIMING */}
                        {isOccupied ? (
                          <div
                            style={{
                              backgroundColor: '#FFFBEB',
                              border: '1px solid #FDE68A',
                              borderRadius: '4px',
                              padding: '12px 14px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px'
                            }}
                          >
                            <div style={{ fontSize: '0.82rem', color: '#92400E', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <UserCheck size={14} color="#B45309" />
                              <span>Booked by: <strong>{seat.current_user_name || 'Library Patron'}</strong></span>
                            </div>
                            <div style={{ fontSize: '0.80rem', color: '#B45309', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Clock size={14} color="#B45309" />
                              <span>Timing: <strong>{seat.booking_timing || 'Active Time Slot'}</strong></span>
                            </div>
                            {seat.booking_date && (
                              <div style={{ fontSize: '0.72rem', color: '#92400E', opacity: 0.85, paddingLeft: '20px' }}>
                                Date: {seat.booking_date}
                              </div>
                            )}

                            {/* Additional bookings today if any */}
                            {Array.isArray(seat.all_bookings_today) && seat.all_bookings_today.length > 1 && (
                              <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed #FCD34D', fontSize: '0.72rem', color: '#78350F' }}>
                                <span style={{ fontWeight: 700 }}>Other Slots Today ({seat.all_bookings_today.length - 1}):</span>
                                <ul style={{ margin: '3px 0 0 16px', padding: 0 }}>
                                  {seat.all_bookings_today.slice(1).map((b, bIdx) => (
                                    <li key={bIdx}>
                                      {b.time_slot} ({b.student_name})
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ) : isAvail ? (
                          <div
                            style={{
                              backgroundColor: 'var(--editorial-bg-subtle)',
                              border: '1px solid var(--editorial-border)',
                              borderRadius: '4px',
                              padding: '10px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '0.78rem',
                              color: 'var(--editorial-green)',
                              fontWeight: 600
                            }}
                          >
                            <CheckCircle2 size={15} />
                            <span>Available for booking • Self-service reservation active</span>
                          </div>
                        ) : (
                          <div
                            style={{
                              backgroundColor: '#FEE2E2',
                              border: '1px solid #FCA5A5',
                              borderRadius: '4px',
                              padding: '10px 12px',
                              fontSize: '0.78rem',
                              color: '#991B1B',
                              fontWeight: 600
                            }}
                          >
                            Under scheduled acoustic / technical maintenance
                          </div>
                        )}
                      </div>

                      {/* Footer notice: Read-only automated system */}
                      <div style={{ fontSize: '0.70rem', color: 'var(--editorial-text-muted)', paddingTop: '10px', borderTop: '1px solid var(--editorial-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>⚡ Automated release on slot expiration</span>
                        <span style={{ fontWeight: 700, color: 'var(--editorial-text)' }}>Read-Only Monitor</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB: Unified Message Admin & Restock Messenger */}
      {activeTab === 'adminmsg' && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="bio-card" style={{ padding: '32px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--editorial-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--editorial-accent)', marginBottom: '8px' }}>
              <Send size={18} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Direct Staff Dispatch</span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: 'var(--editorial-text)', marginBottom: '6px' }}>
              Administrative Messenger & Restock Dispatch
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--editorial-text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>
              Send restock requests for books, operational updates, or official notices directly to the system administrator. You can manually specify book titles, required quantities, and notes below.
            </p>

            <form onSubmit={handleSendMessageToAdmin}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.82rem' }}>Dispatch Category *</label>
                  <select
                    className="form-control"
                    value={adminMsgCategory}
                    onChange={(e) => setAdminMsgCategory(e.target.value)}
                    style={{ fontSize: '0.86rem' }}
                  >
                    <option value="Book Restock / Procurement Request">Book Restock / Procurement Request</option>
                    <option value="Circulation & Patron Alert">Circulation & Patron Alert</option>
                    <option value="Inventory Audit / Barcode Issue">Inventory Audit / Barcode Issue</option>
                    <option value="Facilities & IT Support">Facilities & IT Support</option>
                    <option value="General Administrative Note">General Administrative Note</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.82rem' }}>Priority Level</label>
                  <select
                    className="form-control"
                    value={adminMsgPriority}
                    onChange={(e) => setAdminMsgPriority(e.target.value)}
                    style={{ fontSize: '0.86rem' }}
                  >
                    <option value="Standard">Standard</option>
                    <option value="High Priority">High Priority</option>
                    <option value="Urgent / Immediate Attention">Urgent / Immediate Attention</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.82rem' }}>Subject / Dispatch Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Restock request for 1984 and Clean Code, or Shelf Repair Notice"
                  value={adminMsgTitle}
                  onChange={(e) => setAdminMsgTitle(e.target.value)}
                  style={{ fontSize: '0.86rem' }}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.82rem' }}>
                  Books to Restock / Volume Details (Title, Author, ISBN, Quantity)
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 1984 by George Orwell (ISBN: 978-0451524935) - 5 copies; Clean Code - 3 copies"
                  value={adminMsgBookDetails}
                  onChange={(e) => setAdminMsgBookDetails(e.target.value)}
                  style={{ fontSize: '0.86rem' }}
                />
                <span style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)', marginTop: '4px', display: 'block' }}>
                  You can freely type any book name, author, edition, or copy count you want the administrator to restock.
                </span>
              </div>

              <div className="form-group" style={{ marginBottom: '22px' }}>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.82rem' }}>Message Details & Operational Notes *</label>
                <textarea
                  className="form-control"
                  rows={5}
                  placeholder="Type your complete message to the administration here..."
                  value={adminMsgBody}
                  onChange={(e) => setAdminMsgBody(e.target.value)}
                  style={{ fontSize: '0.86rem', lineHeight: 1.5 }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={sendingAdminMsg}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600 }}
              >
                <Send size={16} />
                {sendingAdminMsg ? 'Dispatching to Administration...' : 'Send Administrative Dispatch'}
              </button>
            </form>

            <div style={{ marginTop: '18px', padding: '12px 14px', backgroundColor: 'var(--editorial-bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--editorial-border)', fontSize: '0.78rem', color: 'var(--editorial-text-muted)', lineHeight: 1.5 }}>
              <strong>Official Record:</strong> Dispatches are logged with cryptographic timestamps in system audit logs and transmitted directly to the library administration inbox.
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
            border: '1.5px solid var(--editorial-border)',
            boxShadow: 'var(--shadow-xl)',
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
                <div style={{ width: '60px', height: '80px', borderRadius: '6px', overflow: 'hidden', border: '1.5px solid var(--editorial-border)', backgroundColor: '#FFF' }}>
                  <img
                    src={resolveBookCoverUrl(photoModalBook.cover_image, photoModalBook.title, photoModalBook.author, photoModalBook.category)}
                    alt={photoModalBook.title}
                    onError={(e) => handleBookCoverError(e, photoModalBook.title, photoModalBook.author, photoModalBook.category)}
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
