import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Key,
  Calendar
} from 'lucide-react';
import { getOfflineBookCover, handleBookCoverError } from '../utils/offlineCovers';

export function resolveBookCoverUrl(url, title = 'Classical Book', author = 'Author', category = 'Archival') {
  if (!url) return getOfflineBookCover(title, author, category);
  return url;
}

export default function LibrarianDashboard({ onNavigate, initialTab = 'issue' }) {
  const { user, login, loginWithGithub, logout } = useAuth();
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

  // 8. Waiting List & Hold Queue Ledger State
  const [waitingSearch, setWaitingSearch] = useState('');
  const [waitingStatusFilter, setWaitingStatusFilter] = useState('all');
  const [waitingBookFilter, setWaitingBookFilter] = useState('all');
  const [waitingSortBy, setWaitingSortBy] = useState('queue_asc');

  // 9. Circulation History Date Filter State (Requirement 6)
  const [historyDateFilter, setHistoryDateFilter] = useState('all'); // 'all', 'today', 'yesterday', 'week', 'month', 'custom'
  const [historyCustomDate, setHistoryCustomDate] = useState('');
  const [historyTransactionType, setHistoryTransactionType] = useState('all'); // 'all', 'borrowed', 'returned'
  const [historySearch, setHistorySearch] = useState('');

  // 10. Penalty & Return Operation State Locks (Requirements 9 & 10)
  const [returningLoanId, setReturningLoanId] = useState(null);
  const [approvingPenaltyId, setApprovingPenaltyId] = useState(null);
  const [decliningLoan, setDecliningLoan] = useState(null);
  const [declineReasonText, setDeclineReasonText] = useState('');
  const [decliningSubmitting, setDecliningSubmitting] = useState(false);

  const fetchLibrarianData = useCallback(async (isSilent = false) => {
    if (!user || (user.role !== 'librarian' && user.role !== 'admin')) {
      if (!isSilent) setLoading(false);
      return;
    }
    if (!isSilent) setLoading(true);
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
      if (!isSilent) setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLibrarianData();
  }, [fetchLibrarianData]);

  // Real-time synchronization: instant silent re-fetch on data changes, window focus, visibility (debounced 150ms)
  useEffect(() => {
    let debounceTimer = null;
    const handleSync = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        fetchLibrarianData(true);
      }, 150);
    };

    window.addEventListener('libramind:data-updated', handleSync);
    window.addEventListener('focus', handleSync);
    const handleVis = () => {
      if (document.visibilityState === 'visible') handleSync();
    };
    document.addEventListener('visibilitychange', handleVis);

    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener('libramind:data-updated', handleSync);
      window.removeEventListener('focus', handleSync);
      document.removeEventListener('visibilitychange', handleVis);
    };
  }, [fetchLibrarianData]);

  // Helper for Requirement 6: Date matching in patron local timezone
  const isSameLocalDate = (d1, d2) => {
    if (!d1 || !d2) return false;
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) return false;
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const formatExactDateTime = (dateInput) => {
    if (!dateInput) return { dateStr: '—', dayStr: '—', timeStr: '—', fullStr: '—' };
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return { dateStr: '—', dayStr: '—', timeStr: '—', fullStr: '—' };
    const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dateStr = d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    const timeStr = d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    return { dateStr, dayStr, timeStr, fullStr: `${dayStr}, ${dateStr} · ${timeStr}` };
  };

  // Requirement 11: Recently Checked Out Section (Last 24 Hours only, latest first, auto-expiring after 24h, DB records intact)
  const recentlyCheckedOut24h = useMemo(() => {
    const nowMs = Date.now();
    const twentyFourHoursMs = 24 * 60 * 60 * 1000;
    return loans
      .filter(l => {
        if (!l.borrow_date) return false;
        const bMs = new Date(l.borrow_date).getTime();
        const diff = nowMs - bMs;
        return diff >= 0 && diff <= twentyFourHoursMs;
      })
      .sort((a, b) => new Date(b.borrow_date) - new Date(a.borrow_date));
  }, [loans]);

  // Requirement 6: Date-Based Borrowing & Returning History Filters
  const filteredCirculationHistory = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(todayStart.getTime() - 30 * 24 * 60 * 60 * 1000);

    let customTarget = null;
    if (historyCustomDate) {
      const parts = historyCustomDate.split('-');
      if (parts.length === 3) {
        customTarget = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      }
    }

    return loans.filter(loan => {
      const bDate = loan.borrow_date ? new Date(loan.borrow_date) : null;
      const rDate = loan.return_date ? new Date(loan.return_date) : null;

      // Filter by transaction type
      if (historyTransactionType === 'borrowed' && !bDate) return false;
      if (historyTransactionType === 'returned' && !rDate) return false;

      // Filter by date period
      let dateMatches = true;
      if (historyDateFilter === 'today') {
        const bMatches = bDate && isSameLocalDate(bDate, todayStart);
        const rMatches = rDate && isSameLocalDate(rDate, todayStart);
        dateMatches = historyTransactionType === 'borrowed' ? bMatches : historyTransactionType === 'returned' ? rMatches : (bMatches || rMatches);
      } else if (historyDateFilter === 'yesterday') {
        const bMatches = bDate && isSameLocalDate(bDate, yesterdayStart);
        const rMatches = rDate && isSameLocalDate(rDate, yesterdayStart);
        dateMatches = historyTransactionType === 'borrowed' ? bMatches : historyTransactionType === 'returned' ? rMatches : (bMatches || rMatches);
      } else if (historyDateFilter === 'week') {
        const bMatches = bDate && bDate >= weekStart;
        const rMatches = rDate && rDate >= weekStart;
        dateMatches = historyTransactionType === 'borrowed' ? bMatches : historyTransactionType === 'returned' ? rMatches : (bMatches || rMatches);
      } else if (historyDateFilter === 'month') {
        const bMatches = bDate && bDate >= monthStart;
        const rMatches = rDate && rDate >= monthStart;
        dateMatches = historyTransactionType === 'borrowed' ? bMatches : historyTransactionType === 'returned' ? rMatches : (bMatches || rMatches);
      } else if (historyDateFilter === 'custom' && customTarget) {
        const bMatches = bDate && isSameLocalDate(bDate, customTarget);
        const rMatches = rDate && isSameLocalDate(rDate, customTarget);
        dateMatches = historyTransactionType === 'borrowed' ? bMatches : historyTransactionType === 'returned' ? rMatches : (bMatches || rMatches);
      }

      if (!dateMatches) return false;

      // Search query filter
      if (historySearch.trim()) {
        const q = historySearch.toLowerCase().trim();
        const matchesQuery =
          (loan.student_name && loan.student_name.toLowerCase().includes(q)) ||
          (loan.membership_id && loan.membership_id.toLowerCase().includes(q)) ||
          (loan.book_title && loan.book_title.toLowerCase().includes(q)) ||
          (loan.copy_code && loan.copy_code.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      return true;
    }).sort((a, b) => {
      const timeA = new Date(a.return_date || a.borrow_date || 0).getTime();
      const timeB = new Date(b.return_date || b.borrow_date || 0).getTime();
      return timeB - timeA;
    });
  }, [loans, historyDateFilter, historyCustomDate, historyTransactionType, historySearch]);

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

  // Return Book Handler (Requirement 9: Atomic lock prevents duplicate requests & warnings)
  const handleReturnBook = async (loanId) => {
    if (returningLoanId === loanId) return;
    setReturningLoanId(loanId);
    try {
      const res = await api.returnBook(loanId);
      showToast(`Book returned! ${res.fineAmount > 0 ? `Late fine: $${res.fineAmount.toFixed(2)}` : 'No fine'}`);
      fetchLibrarianData();
    } catch (err) {
      showToast(err.message || 'Failed to process book return', true);
    } finally {
      setReturningLoanId(null);
    }
  };

  // Penalty Approval Handler (Requirement 10)
  const handleApprovePenalty = async (loanId, bookTitle, patronName) => {
    if (approvingPenaltyId === loanId) return;
    setApprovingPenaltyId(loanId);
    try {
      const res = await api.approvePenalty(loanId);
      showToast(res.message || `Penalty approved and confirmed for ${patronName || 'patron'} on "${bookTitle}".`);
      fetchLibrarianData();
    } catch (err) {
      showToast(err.message || 'Failed to approve penalty', true);
    } finally {
      setApprovingPenaltyId(null);
    }
  };

  // Penalty Decline Handler (Requirement 10)
  const handleOpenDeclineModal = (loan) => {
    setDecliningLoan(loan);
    setDeclineReasonText('');
  };

  const handleConfirmDeclinePenalty = async (e) => {
    e.preventDefault();
    if (!decliningLoan) return;
    setDecliningSubmitting(true);
    try {
      const reason = declineReasonText.trim() || 'Penalty waived upon librarian administrative review.';
      const res = await api.declinePenalty(decliningLoan.id, { reason });
      showToast(res.message || `Penalty successfully declined and waived for ${decliningLoan.student_name}.`);
      setDecliningLoan(null);
      setDeclineReasonText('');
      fetchLibrarianData();
    } catch (err) {
      showToast(err.message || 'Failed to decline penalty', true);
    } finally {
      setDecliningSubmitting(false);
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

  // Reservation Patron Notification Handler
  const handleNotifyPatron = async (res) => {
    try {
      await api.notifyReservationPatron(res.id);
      showToast(`Notification dispatched to ${res.student_name} (Queue #${res.queue_position}) for "${res.book_title}".`);
    } catch (err) {
      showToast(err.message || 'Failed to dispatch notification', true);
    }
  };

  // Cancel Reservation / Release Queue Position Handler
  const handleCancelReservation = async (resId, bookTitle, studentName) => {
    if (!window.confirm(`Are you sure you want to release the waiting queue hold for ${studentName} on "${bookTitle}"?`)) {
      return;
    }
    try {
      await api.cancelReservation(resId);
      showToast(`Waiting hold for ${studentName} on "${bookTitle}" was successfully cancelled.`);
      fetchLibrarianData();
    } catch (err) {
      showToast(err.message || 'Failed to cancel reservation', true);
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

  const activeLoans = loans.filter(l => (l.status === 'active' || l.status === 'borrowed' || l.status === 'overdue' || l.is_active) && l.status !== 'returned' && !l.return_date);

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
    const handleLibGithubAuth = async (e) => {
      if (e) e.preventDefault();
      setLibLoginError('');
      setLibGithubLoading(true);
      try {
        await loginWithGithub({
          githubUsername: libGithubUsername.trim() || 'marcus-librarian',
          name: libGithubName.trim() || 'Marcus Thorne (Librarian)',
          email: libGithubEmail.trim() || 'librarian@libramind.edu'
        }, 'librarian');
        setShowLibGithubModal(false);
        fetchLibrarianData();
      } catch (err) {
        setLibLoginError(err.message || 'GitHub staff SSO failed');
      } finally {
        setLibGithubLoading(false);
      }
    };

    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '50px 20px',
          backgroundColor: '#FFFFFF'
        }}
      >
        <div
          className="bio-card"
          style={{
            width: '480px',
            maxWidth: '100%',
            backgroundColor: '#FFFFFF',
            padding: '38px',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            border: '1.5px solid var(--editorial-border)',
            position: 'relative'
          }}
        >
          {/* Top Maximalist Organic Accent Ribbon */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '5px',
              borderTopLeftRadius: 'var(--radius-xl)',
              borderTopRightRadius: 'var(--radius-xl)',
              background: 'linear-gradient(90deg, var(--editorial-green) 0%, var(--editorial-border) 50%, var(--editorial-accent) 100%)'
            }}
          />

          {/* Brand Header */}
          <div style={{ textAlign: 'center', marginBottom: '26px', marginTop: '4px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, var(--editorial-green), var(--editorial-border))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
                boxShadow: '0 8px 20px rgba(96, 108, 56, 0.26)'
              }}
            >
              <Layers size={28} color="#FFFFFF" />
            </div>
            <div
              className="pill-badge"
              style={{
                backgroundColor: '#FFFFFF',
                color: 'var(--editorial-green)',
                borderColor: 'rgba(96, 108, 56, 0.3)',
                marginBottom: '10px'
              }}
            >
              🌿 Circulation Desk • Staff Gateway
            </div>
            <h2 style={{ fontSize: '1.9rem', fontFamily: 'var(--font-serif)', color: 'var(--editorial-text)', margin: '4px 0 6px' }}>
              Librarian Portal Gateway
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', margin: 0 }}>
              Sign in with staff credentials or GitHub Staff SSO to manage circulation, loans, and inventory.
            </p>
          </div>

          {libLoginError && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--status-danger-bg)',
                color: 'var(--status-danger-text)',
                border: '1px solid rgba(150, 49, 36, 0.2)',
                fontSize: '0.86rem',
                fontWeight: 600,
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

          {/* Continue with GitHub for Librarian Staff */}
          <button
            type="button"
            onClick={() => setShowLibGithubModal(true)}
            style={{
              width: '100%',
              padding: '12px 18px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#24292F',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '0.92rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(36, 41, 47, 0.2)',
              transition: 'all 0.2s ease',
              marginBottom: '20px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1F2328';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#24292F';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            <span>Continue with GitHub (Staff SSO)</span>
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '14px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--editorial-border)' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              or staff credentials
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--editorial-border)' }} />
          </div>

          <form onSubmit={handleLibrarianLogin}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">
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
              <label className="form-label">
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
              className="btn btn-botanical"
              disabled={loggingInLib}
              style={{ width: '100%', padding: '13px', fontSize: '0.96rem' }}
            >
              {loggingInLib ? 'Verifying Staff Credentials...' : 'Sign In to Librarian Desk'}
            </button>
          </form>

          {/* 1-Click Quick Demo Login for Librarian */}
          <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--editorial-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--editorial-text)' }}>
                ⚡ 1-Click Staff Demo Access:
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--editorial-green)', fontWeight: 600 }}>
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
              className="btn btn-outline btn-sm"
              style={{ width: '100%', fontSize: '0.84rem', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <span><strong>Marcus Thorne</strong> (LIB-5001 • Head Desk)</span>
              <span style={{ fontSize: '0.76rem', color: 'var(--editorial-accent)', fontWeight: 700 }}>Auto-fill & Enter →</span>
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '22px' }}>
            <button
              onClick={() => onNavigate('home')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--editorial-accent)',
                fontSize: '0.84rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              ← Return to Library Public Home
            </button>
          </div>
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

              <div style={{ maxHeight: '310px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {books.filter(b => b.available_copies > 0).slice(0, 10).map(b => (
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
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                  <thead>
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
                        const isReturned = loan.status === 'returned' || Boolean(loan.return_date);
                        const isOverdue = !isReturned && (loan.status === 'overdue' || new Date() > dueDate);
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
                                {isReturned ? 'Returned' : isOverdue ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days remaining`}
                              </div>
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                              {isReturned ? (
                                <span style={{ fontSize: '0.70rem', fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '2px', border: '1px solid #86EFAC' }}>
                                  ● RETURNED
                                </span>
                              ) : loan.penalty_status === 'pending' || Boolean(loan.penalty_qr_code) ? (
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
                                {isReturned ? (
                                  <span style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)', fontStyle: 'italic' }}>
                                    Checked In
                                  </span>
                                ) : loan.penalty_status === 'pending' || Boolean(loan.penalty_qr_code) ? (
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
            CIRCULATION CHECK-IN
          </span>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: 'var(--editorial-text)', margin: '4px 0 8px' }}>
            Active Loans & Book Returns ({activeLoans.length})
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--editorial-text-muted)', marginBottom: '22px', lineHeight: 1.5 }}>
            Process book check-ins. If overdue, fine is computed automatically. If scholars are on the hold waitlist, the book is routed to pickup automatically.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
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
                  const isReturned = loan.status === 'returned' || Boolean(loan.return_date);
                  const isOverdue = !isReturned && (loan.status === 'overdue' || new Date() > dueDate);

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
                        {isReturned ? (
                          <span style={{ fontSize: '0.70rem', fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '2px', border: '1px solid #86EFAC' }}>
                            ● RETURNED
                          </span>
                        ) : loan.penalty_status === 'confirmed' ? (
                          <span style={{ fontSize: '0.70rem', fontWeight: 800, color: '#15803D', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '2px', border: '1px solid #86EFAC' }}>
                            ● PENALTY APPROVED (${Number(loan.fine_amount || loan.penalty_amount || 15).toFixed(2)})
                          </span>
                        ) : loan.penalty_status === 'declined' ? (
                          <span style={{ fontSize: '0.70rem', fontWeight: 700, color: '#4B5563', backgroundColor: '#F3F4F6', padding: '2px 8px', borderRadius: '2px', border: '1px solid #D1D5DB' }}>
                            ● PENALTY DECLINED / WAIVED
                          </span>
                        ) : loan.penalty_status === 'pending' || Boolean(loan.penalty_qr_code) ? (
                          <span style={{ fontSize: '0.70rem', fontWeight: 800, color: '#991B1B', backgroundColor: '#FEE2E2', padding: '2px 8px', borderRadius: '2px', border: '1px solid #F87171' }}>
                            ● PENALTY PENDING (${loan.penalty_amount ? Number(loan.penalty_amount).toFixed(2) : (loan.fine_amount ? Number(loan.fine_amount).toFixed(2) : '15.00')})
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
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleApprovePenalty(loan.id, loan.book_title, loan.student_name)}
                                  disabled={approvingPenaltyId === loan.id}
                                  className="btn btn-sm"
                                  style={{
                                    padding: '5px 10px',
                                    fontSize: '0.74rem',
                                    backgroundColor: '#15803D',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    fontWeight: 700,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                  title="Approve / Confirm this penalty assessment"
                                >
                                  ✓ {approvingPenaltyId === loan.id ? 'Approving...' : 'Approve Penalty'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenDeclineModal(loan)}
                                  className="btn btn-sm"
                                  style={{
                                    padding: '5px 10px',
                                    fontSize: '0.74rem',
                                    backgroundColor: '#4B5563',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    fontWeight: 700,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                  title="Decline penalty with reason and restore patron account"
                                >
                                  ✕ Decline Penalty
                                </button>
                              </div>
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
                            disabled={returningLoanId === loan.id}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '5px 12px', fontSize: '0.76rem', opacity: returningLoanId === loan.id ? 0.7 : 1 }}
                          >
                            {returningLoanId === loan.id ? 'Returning...' : 'Process Return'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* SECTION 2: Date-Based Borrowing & Returning History Filters & Ledger (Requirement 6) */}
          <div style={{ marginTop: '36px', paddingTop: '28px', borderTop: '2px dashed var(--editorial-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
              <div>
                <span className="editorial-kicker" style={{ color: 'var(--editorial-green)' }}>
                  CIRCULATION AUDIT LEDGER · REQUIREMENT 6
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--editorial-text)', margin: '2px 0 0' }}>
                  Date-Based Borrowing &amp; Returning History ({filteredCirculationHistory.length})
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--editorial-text-muted)', margin: '4px 0 0' }}>
                  Filter historical and active circulation records by exact transaction dates using library local timezone.
                </p>
              </div>

              {/* Quick Preset Buttons */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: 'All Records' },
                  { id: 'today', label: 'Today' },
                  { id: 'yesterday', label: 'Previous Day' },
                  { id: 'week', label: 'Previous Week' },
                  { id: 'month', label: 'Previous Month' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setHistoryDateFilter(opt.id);
                      setHistoryCustomDate('');
                    }}
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      borderRadius: 'var(--radius-sm)',
                      border: historyDateFilter === opt.id && !historyCustomDate ? '1px solid var(--editorial-green)' : '1px solid var(--editorial-border)',
                      backgroundColor: historyDateFilter === opt.id && !historyCustomDate ? 'var(--editorial-green)' : '#FFFFFF',
                      color: historyDateFilter === opt.id && !historyCustomDate ? '#FFFFFF' : 'var(--editorial-text)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date-Filter Toolbar: Custom Calendar Date + Transaction Type + Search */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              padding: '14px 16px',
              backgroundColor: 'var(--editorial-bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--editorial-border)',
              marginBottom: '16px',
              alignItems: 'center'
            }}>
              {/* Calendar Date Picker */}
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--editorial-accent)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  📅 Custom Date Selection (Calendar)
                </label>
                <input
                  type="date"
                  value={historyCustomDate}
                  onChange={(e) => {
                    setHistoryCustomDate(e.target.value);
                    setHistoryDateFilter('custom');
                  }}
                  className="form-control"
                  style={{ fontSize: '0.84rem', cursor: 'pointer', backgroundColor: '#FFFFFF' }}
                />
              </div>

              {/* Transaction Type Filter */}
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--editorial-accent)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Transaction Direction
                </label>
                <select
                  value={historyTransactionType}
                  onChange={(e) => setHistoryTransactionType(e.target.value)}
                  className="form-control"
                  style={{ fontSize: '0.84rem', backgroundColor: '#FFFFFF' }}
                >
                  <option value="all">All Transactions (Borrows &amp; Returns)</option>
                  <option value="borrowed">Borrowed on this Date</option>
                  <option value="returned">Returned on this Date</option>
                </select>
              </div>

              {/* Search Patron, ID or Book */}
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--editorial-accent)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Search Patron or Title
                </label>
                <input
                  type="text"
                  placeholder="Filter by borrower, ID, or book..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="form-control"
                  style={{ fontSize: '0.84rem', backgroundColor: '#FFFFFF' }}
                />
              </div>
            </div>

            {/* Filtered History Table */}
            <div style={{ overflowX: 'auto', backgroundColor: '#FFFFFF', border: '1px solid var(--editorial-border)', borderRadius: 'var(--radius-sm)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--editorial-bg-subtle)', borderBottom: '1px solid var(--editorial-border)' }}>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Patron / Borrower</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Book Title</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Copy Barcode</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Borrowing Date &amp; Time</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Actual Return Date &amp; Time</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Transaction Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCirculationHistory.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--editorial-text-muted)' }}>
                        <Calendar size={28} style={{ margin: '0 auto 8px', color: 'var(--editorial-accent)' }} />
                        <div style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--editorial-text)' }}>No circulation records found for this date selection</div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.80rem' }}>Try choosing another date filter or clearing the search box.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredCirculationHistory.map(loan => {
                      const borrowInfo = formatExactDateTime(loan.borrow_date);
                      const returnInfo = formatExactDateTime(loan.return_date);

                      return (
                        <tr key={loan.id} style={{ borderBottom: '1px solid var(--editorial-border)' }}>
                          <td style={{ padding: '12px 14px' }}>
                            <strong style={{ color: 'var(--editorial-text)' }}>{loan.student_name}</strong>
                            <div style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)' }}>
                              ID: {loan.membership_id || 'Pending'} · {loan.student_email}
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px', fontFamily: 'var(--font-serif)', color: 'var(--editorial-text)', fontWeight: 700 }}>
                            {loan.book_title}
                          </td>
                          <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--editorial-text)' }}>
                            {loan.copy_code || '—'}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: 600, color: 'var(--editorial-text)' }}>{borrowInfo.dateStr} ({borrowInfo.dayStr})</div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--editorial-accent)', fontFamily: 'var(--font-mono)' }}>{borrowInfo.timeStr}</div>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            {loan.return_date ? (
                              <>
                                <div style={{ fontWeight: 600, color: '#15803D' }}>{returnInfo.dateStr} ({returnInfo.dayStr})</div>
                                <div style={{ fontSize: '0.74rem', color: '#15803D', fontFamily: 'var(--font-mono)' }}>{returnInfo.timeStr}</div>
                              </>
                            ) : (
                              <span style={{ fontSize: '0.78rem', color: 'var(--editorial-text-muted)', fontStyle: 'italic' }}>
                                Active Loan (Not Returned Yet)
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            {loan.status === 'returned' ? (
                              <span className="badge badge-available" style={{ fontSize: '0.72rem' }}>
                                ✓ Returned {loan.fine_amount > 0 ? `(Fine $${Number(loan.fine_amount).toFixed(2)})` : ''}
                              </span>
                            ) : loan.status === 'overdue' ? (
                              <span className="badge badge-borrowed" style={{ fontSize: '0.72rem', backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #F87171' }}>
                                ● Overdue Loan
                              </span>
                            ) : (
                              <span className="badge badge-category" style={{ fontSize: '0.72rem' }}>
                                ● Active on Loan
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 3: Recently Checked Out (Last 24 Hours Only - Requirement 11) */}
          <div style={{ marginTop: '36px', paddingTop: '28px', borderTop: '2px dashed var(--editorial-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
              <div>
                <span className="editorial-kicker" style={{ color: 'var(--editorial-accent)' }}>
                  ROLLING 24-HOUR CHECKOUT LEDGER · REQUIREMENT 11
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--editorial-text)', margin: '2px 0 0' }}>
                  Recently Checked Out ({recentlyCheckedOut24h.length})
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--editorial-text-muted)', margin: '4px 0 0' }}>
                  Displaying books checked out within the last 24 hours only (ordered latest first). Entries automatically expire after 24 hours while database records remain completely intact.
                </p>
              </div>
              <span className="badge" style={{ backgroundColor: 'var(--editorial-bg-subtle)', color: 'var(--editorial-green)', border: '1px solid var(--editorial-border)', fontWeight: 700, fontSize: '0.72rem' }}>
                ⏱ AUTO-EXPIRES AFTER 24H
              </span>
            </div>

            <div style={{ overflowX: 'auto', backgroundColor: '#FFFFFF', border: '1px solid var(--editorial-border)', borderRadius: 'var(--radius-sm)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--editorial-bg-subtle)', borderBottom: '1px solid var(--editorial-border)' }}>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Book Title</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Borrower Name &amp; ID</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Copy Barcode</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Exact Checkout Timestamp (Hr:Min:Sec)</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Due Date</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Circulation Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentlyCheckedOut24h.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--editorial-text-muted)' }}>
                        <Clock size={28} style={{ margin: '0 auto 8px', color: 'var(--editorial-accent)' }} />
                        <div style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--editorial-text)' }}>No books checked out in the last 24 hours</div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.80rem' }}>Checkouts older than 24 hours have safely rolled off this real-time ledger.</p>
                      </td>
                    </tr>
                  ) : (
                    recentlyCheckedOut24h.map(loan => {
                      const borrowInfo = formatExactDateTime(loan.borrow_date);
                      const dueInfo = loan.due_date ? new Date(loan.due_date).toLocaleDateString() : '—';

                      return (
                        <tr key={loan.id} style={{ borderBottom: '1px solid var(--editorial-border)' }}>
                          <td style={{ padding: '12px 14px', fontFamily: 'var(--font-serif)', color: 'var(--editorial-text)', fontWeight: 700 }}>
                            {loan.book_title}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <strong style={{ color: 'var(--editorial-text)' }}>{loan.student_name}</strong>
                            <div style={{ fontSize: '0.74rem', color: 'var(--editorial-accent)', fontWeight: 600 }}>
                              ID: {loan.membership_id || 'Pending'}
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--editorial-text)' }}>
                            {loan.copy_code || '—'}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: 600, color: 'var(--editorial-text)' }}>{borrowInfo.dateStr}</div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--editorial-accent)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                              ⏱ {borrowInfo.timeStr}
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px', color: 'var(--editorial-text)' }}>
                            {dueInfo}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            {loan.status === 'returned' ? (
                              <span className="badge badge-available" style={{ fontSize: '0.72rem' }}>✓ Returned</span>
                            ) : loan.status === 'overdue' ? (
                              <span className="badge badge-borrowed" style={{ fontSize: '0.72rem' }}>● Overdue</span>
                            ) : (
                              <span className="badge" style={{ backgroundColor: 'var(--editorial-green)', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 700 }}>
                                ● Active Loan
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Dedicated Recently Checked Out Portal (Requirement 11) */}
      {activeTab === 'recent' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--editorial-border)', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
            <div>
              <span className="editorial-kicker" style={{ color: 'var(--editorial-green)' }}>
                ROLLING 24-HOUR CHECKOUT LEDGER · REQUIREMENT 11
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: 'var(--editorial-text)', margin: '2px 0 0' }}>
                Recently Checked Out Volumes ({recentlyCheckedOut24h.length})
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--editorial-text-muted)', margin: '4px 0 0', lineHeight: 1.5 }}>
                Displaying all library volumes checked out in the last 24 hours only (ordered from newest to oldest). After 24 hours, entries automatically disappear from this view while database records remain completely intact.
              </p>
            </div>
            <button
              type="button"
              onClick={fetchLibrarianData}
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <RotateCcw size={13} />
              <span>Refresh Checkouts</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto', backgroundColor: '#FFFFFF', border: '1px solid var(--editorial-border)', borderRadius: 'var(--radius-sm)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--editorial-bg-subtle)', borderBottom: '1px solid var(--editorial-border)' }}>
                  <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Book Title</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Borrower Name &amp; ID</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Copy Barcode</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Exact Checkout Date &amp; Time (Hr:Min:Sec)</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Due Date</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Circulation Status</th>
                </tr>
              </thead>
              <tbody>
                {recentlyCheckedOut24h.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--editorial-text-muted)' }}>
                      <Clock size={36} style={{ margin: '0 auto 12px', color: 'var(--editorial-accent)' }} />
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--editorial-text)' }}>
                        No Checkouts in the Last 24 Hours
                      </div>
                      <p style={{ margin: '6px 0 0', fontSize: '0.84rem' }}>
                        Volumes checked out today or within the last 24 hours appear here automatically in real time.
                      </p>
                    </td>
                  </tr>
                ) : (
                  recentlyCheckedOut24h.map(loan => {
                    const borrowInfo = formatExactDateTime(loan.borrow_date);
                    const dueInfo = loan.due_date ? new Date(loan.due_date).toLocaleDateString() : '—';

                    return (
                      <tr key={loan.id} style={{ borderBottom: '1px solid var(--editorial-border)' }}>
                        <td style={{ padding: '12px 14px', fontFamily: 'var(--font-serif)', color: 'var(--editorial-text)', fontWeight: 700 }}>
                          {loan.book_title}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <strong style={{ color: 'var(--editorial-text)' }}>{loan.student_name}</strong>
                          <div style={{ fontSize: '0.74rem', color: 'var(--editorial-accent)', fontWeight: 600 }}>
                            ID: {loan.membership_id || 'Pending'}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--editorial-text)' }}>
                          {loan.copy_code || '—'}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--editorial-text)' }}>{borrowInfo.dateStr} ({borrowInfo.dayStr})</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--editorial-accent)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                            ⏱ {borrowInfo.timeStr}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px', color: 'var(--editorial-text)' }}>
                          {dueInfo}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          {loan.status === 'returned' ? (
                            <span className="badge badge-available" style={{ fontSize: '0.72rem' }}>✓ Returned</span>
                          ) : loan.status === 'overdue' ? (
                            <span className="badge badge-borrowed" style={{ fontSize: '0.72rem' }}>● Overdue</span>
                          ) : (
                            <span className="badge" style={{ backgroundColor: 'var(--editorial-green)', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 700 }}>
                              ● Active Loan
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Dedicated Penalties Management Desk (Requirement 10) */}
      {activeTab === 'penalties' && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--editorial-border)', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
            <div>
              <span className="editorial-kicker" style={{ color: '#B91C1C' }}>
                STAFF PENALTY DESK · REQUIREMENT 10
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: 'var(--editorial-text)', margin: '2px 0 0' }}>
                Patron Circulation Penalties &amp; QR Fines
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--editorial-text-muted)', margin: '4px 0 0', lineHeight: 1.5 }}>
                Review overdue circulation penalties and QR codes issued to patrons. Librarians can approve/confirm valid fines or decline penalties with a recorded reason, automatically updating user status, audit records, and dispatching patron notices.
              </p>
            </div>
            <button
              type="button"
              onClick={fetchLibrarianData}
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <RotateCcw size={13} />
              <span>Refresh Penalties</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto', backgroundColor: '#FFFFFF', border: '1px solid var(--editorial-border)', borderRadius: 'var(--radius-sm)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--editorial-bg-subtle)', borderBottom: '1px solid var(--editorial-border)' }}>
                  <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Patron / Borrower</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Book Title &amp; Barcode</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Overdue Period</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Penalty Assessment</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--editorial-text)' }}>Status</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--editorial-text)' }}>Librarian Decision</th>
                </tr>
              </thead>
              <tbody>
                {loans.filter(l => l.penalty_status === 'pending' || l.penalty_status === 'confirmed' || l.status === 'overdue' || Boolean(l.penalty_qr_code) || l.fine_amount > 0).length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--editorial-text-muted)' }}>
                      <CheckCircle size={36} style={{ margin: '0 auto 12px', color: 'var(--editorial-green)' }} />
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--editorial-text)' }}>
                        All Patron Accounts in Good Standing
                      </div>
                      <p style={{ margin: '6px 0 0', fontSize: '0.84rem' }}>
                        No pending fines, outstanding penalties, or QR payment holds currently require review.
                      </p>
                    </td>
                  </tr>
                ) : (
                  loans
                    .filter(l => l.penalty_status === 'pending' || l.penalty_status === 'confirmed' || l.status === 'overdue' || Boolean(l.penalty_qr_code) || l.fine_amount > 0)
                    .map(loan => {
                      const borrowDate = loan.borrow_date ? new Date(loan.borrow_date) : null;
                      const daysElapsed = borrowDate ? Math.floor((new Date() - borrowDate) / (1000 * 60 * 60 * 24)) : 0;
                      const fineAmt = loan.penalty_amount || loan.fine_amount || 15.0;

                      return (
                        <tr key={loan.id} style={{ borderBottom: '1px solid var(--editorial-border)' }}>
                          <td style={{ padding: '12px 14px' }}>
                            <strong style={{ color: 'var(--editorial-text)' }}>{loan.student_name}</strong>
                            <div style={{ fontSize: '0.74rem', color: 'var(--editorial-accent)', fontWeight: 600 }}>
                              ID: {loan.membership_id || 'Pending'} · {loan.student_email}
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontFamily: 'var(--font-serif)', color: 'var(--editorial-text)', fontWeight: 700 }}>
                              {loan.book_title}
                            </div>
                            <div style={{ fontSize: '0.74rem', fontFamily: 'monospace', color: 'var(--editorial-text-muted)' }}>
                              Barcode: {loan.copy_code || '—'}
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: 600, color: daysElapsed > 14 ? '#C5221F' : 'var(--editorial-text)' }}>
                              {daysElapsed} Days on Loan
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--editorial-text-muted)' }}>
                              Due: {loan.due_date ? new Date(loan.due_date).toLocaleDateString() : '—'}
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#B91C1C' }}>
                              ${Number(fineAmt).toFixed(2)}
                            </div>
                            <span style={{ fontSize: '0.70rem', color: 'var(--editorial-text-muted)' }}>
                              Circulation Overdue Fine
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            {loan.penalty_status === 'confirmed' ? (
                              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#15803D', backgroundColor: '#DCFCE7', padding: '3px 8px', borderRadius: '3px', border: '1px solid #86EFAC' }}>
                                ● CONFIRMED BY STAFF
                              </span>
                            ) : loan.penalty_status === 'declined' ? (
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#4B5563', backgroundColor: '#F3F4F6', padding: '3px 8px', borderRadius: '3px' }}>
                                ● DECLINED / WAIVED
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#B91C1C', backgroundColor: '#FEE2E2', padding: '3px 8px', borderRadius: '3px', border: '1px solid #FCA5A5' }}>
                                ● PENDING REVIEW
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', flexWrap: 'wrap' }}>
                              <button
                                type="button"
                                onClick={() => handleApprovePenalty(loan.id, loan.book_title, loan.student_name)}
                                disabled={approvingPenaltyId === loan.id || loan.penalty_status === 'confirmed'}
                                className="btn btn-sm"
                                style={{
                                  padding: '5px 10px',
                                  fontSize: '0.74rem',
                                  backgroundColor: loan.penalty_status === 'confirmed' ? '#9CA3AF' : '#15803D',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  fontWeight: 700,
                                  cursor: loan.penalty_status === 'confirmed' ? 'not-allowed' : 'pointer'
                                }}
                                title="Confirm penalty assessment"
                              >
                                {approvingPenaltyId === loan.id ? 'Confirming...' : loan.penalty_status === 'confirmed' ? 'Confirmed' : 'Approve Fine'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenDeclineModal(loan)}
                                className="btn btn-sm"
                                style={{
                                  padding: '5px 10px',
                                  fontSize: '0.74rem',
                                  backgroundColor: '#4B5563',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                                title="Decline fine with recorded justification"
                              >
                                Decline Fine
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Waiting Users & Hold Queues (Dedicated Waiting List Portal) */}
      {(activeTab === 'reservations' || activeTab === 'waiting-list' || activeTab === 'waiting') && (() => {
        // Compute metrics
        const activeList = reservations.filter(r => r.status === 'waiting' || r.status === 'ready_for_pickup');
        const numFirstInLine = activeList.filter(r => (r.queue_position || 1) === 1 && r.status === 'waiting').length;
        const numReadyForPickup = activeList.filter(r => r.status === 'ready_for_pickup').length;
        const distinctBookCount = new Set(activeList.map(r => r.book_id || r.book_title)).size;

        // Unique books for filter dropdown
        const bookOptionsMap = new Map();
        reservations.forEach(r => {
          const key = r.book_id || r.book_title;
          if (key && !bookOptionsMap.has(key)) {
            bookOptionsMap.set(key, { id: key, title: r.book_title || 'Untitled Book' });
          }
        });
        const bookOptions = Array.from(bookOptionsMap.values());

        // Helper to format exact date, day of week, and time with hour, minute, and second (Requirement 4)
        const formatWithExactSeconds = (dateInput) => {
          if (!dateInput) return { dateStr: '—', dayStr: '—', timeStr: '—', fullStr: '—' };
          const d = new Date(dateInput);
          if (isNaN(d.getTime())) return { dateStr: '—', dayStr: '—', timeStr: '—', fullStr: '—' };
          const dayStr = d.toLocaleDateString('en-US', { weekday: 'long' });
          const dateStr = d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
          const timeStr = d.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          });
          return { dateStr, dayStr, timeStr, fullStr: `${dayStr}, ${dateStr} · ${timeStr}` };
        };

        // Requirements 5 & 8: Smart Inventory Allocation Suggestions for Waiting Patrons
        const waitingAllocationSuggestions = [];
        const waitingByBookMap = new Map();
        reservations.forEach(r => {
          if (r.status === 'waiting') {
            const bKey = String(r.book_id || r.book_title);
            if (!waitingByBookMap.has(bKey)) waitingByBookMap.set(bKey, []);
            waitingByBookMap.get(bKey).push(r);
          }
        });

        books.forEach(b => {
          const bKey1 = String(b.id);
          const bKey2 = b.title;
          const waitQueue = waitingByBookMap.get(bKey1) || waitingByBookMap.get(bKey2) || [];
          if (b.available_copies > 0 && waitQueue.length > 0) {
            waitQueue.sort((x, y) => (x.queue_position || 1) - (y.queue_position || 1) || new Date(x.reservation_date || x.created_at) - new Date(y.reservation_date || y.created_at));
            waitingAllocationSuggestions.push({
              book: b,
              availableCopies: b.available_copies,
              waitingCount: waitQueue.length,
              nextPatron: waitQueue[0]
            });
          }
        });

        // Filter and Sort order-wise
        let displayed = [...reservations];
        if (waitingStatusFilter !== 'all') {
          displayed = displayed.filter(r => r.status === waitingStatusFilter);
        }
        if (waitingBookFilter !== 'all') {
          displayed = displayed.filter(r => String(r.book_id) === String(waitingBookFilter) || r.book_title === waitingBookFilter);
        }
        if (waitingSearch.trim()) {
          const q = waitingSearch.toLowerCase().trim();
          displayed = displayed.filter(r =>
            (r.student_name && r.student_name.toLowerCase().includes(q)) ||
            (r.membership_id && r.membership_id.toLowerCase().includes(q)) ||
            (r.student_email && r.student_email.toLowerCase().includes(q)) ||
            (r.book_title && r.book_title.toLowerCase().includes(q)) ||
            (r.book_author && r.book_author.toLowerCase().includes(q))
          );
        }

        displayed.sort((a, b) => {
          if (waitingSortBy === 'book') {
            const cmp = (a.book_title || '').localeCompare(b.book_title || '');
            if (cmp !== 0) return cmp;
            return (a.queue_position || 1) - (b.queue_position || 1);
          }
          if (waitingSortBy === 'time_desc') {
            return new Date(b.reservation_date || b.created_at || 0) - new Date(a.reservation_date || a.created_at || 0);
          }
          if (waitingSortBy === 'time_asc') {
            return new Date(a.reservation_date || a.created_at || 0) - new Date(b.reservation_date || b.created_at || 0);
          }
          // Default: 'queue_asc' - Order-wise Queue Position #1 First & Earliest Timestamp with seconds
          const posA = a.queue_position || 1;
          const posB = b.queue_position || 1;
          if (posA !== posB) return posA - posB;
          return new Date(a.reservation_date || a.created_at || 0) - new Date(b.reservation_date || b.created_at || 0);
        });

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header & Overview Ledger Banner */}
            <div className="bio-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', borderLeft: '5px solid var(--editorial-green)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(44, 74, 55, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--editorial-green)'
                  }}>
                    <Bookmark size={22} strokeWidth={2.4} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--editorial-accent)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                      CIRCULATION DESK · ORDER-WISE HOLD QUEUE
                    </div>
                    <h3 style={{ fontSize: '1.45rem', color: 'var(--forest-dark)', margin: '2px 0 0', fontFamily: 'var(--font-serif)', fontWeight: 800 }}>
                      Patron Waiting List Ledger
                    </h3>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={fetchLibrarianData}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    title="Refresh waiting list records from database"
                  >
                    <RotateCcw size={13} />
                    <span>Sync Waitlist</span>
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', margin: '0 0 20px', lineHeight: 1.5, maxWidth: '820px' }}>
                Patrons who have joined the waiting list for library volumes with zero shelf availability. Entries are sorted order-wise by queue position (<strong style={{ color: 'var(--editorial-green)' }}>#1 First in line</strong>) and precise registration timestamp with hours, minutes, and seconds.
              </p>

              {/* 4 Summary Stat Metrics */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '14px',
                paddingTop: '16px',
                borderTop: '1px solid var(--editorial-border)'
              }}>
                <div style={{ padding: '12px 14px', backgroundColor: 'var(--editorial-bg-subtle)', borderRadius: '6px', border: '1px solid var(--editorial-border)' }}>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--editorial-text-muted)', fontWeight: 700 }}>Total Waiting Patrons</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--editorial-text)', marginTop: '2px' }}>
                    {String(activeList.length).padStart(2, '0')}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--editorial-text-muted)' }}>Active holds in system</span>
                </div>

                <div style={{ padding: '12px 14px', backgroundColor: 'rgba(21, 128, 61, 0.08)', borderRadius: '6px', border: '1px solid rgba(21, 128, 61, 0.25)' }}>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#15803D', fontWeight: 700 }}>#1 Priority in Line</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#15803D', marginTop: '2px' }}>
                    {String(numFirstInLine).padStart(2, '0')}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#15803D' }}>Next to receive returned copies</span>
                </div>

                <div style={{ padding: '12px 14px', backgroundColor: 'rgba(217, 119, 6, 0.08)', borderRadius: '6px', border: '1px solid rgba(217, 119, 6, 0.25)' }}>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#B45309', fontWeight: 700 }}>Ready at Front Desk</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#B45309', marginTop: '2px' }}>
                    {String(numReadyForPickup).padStart(2, '0')}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#B45309' }}>Awaiting student pickup (48h)</span>
                </div>

                <div style={{ padding: '12px 14px', backgroundColor: 'var(--editorial-bg-subtle)', borderRadius: '6px', border: '1px solid var(--editorial-border)' }}>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--editorial-text-muted)', fontWeight: 700 }}>Queued Book Titles</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--editorial-text)', marginTop: '2px' }}>
                    {String(distinctBookCount).padStart(2, '0')}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--editorial-text-muted)' }}>Titles with patron backorders</span>
                </div>
              </div>
            </div>

            {/* Requirements 5 & 8: Smart Inventory Allocation Suggestions for Waiting Patrons */}
            {waitingAllocationSuggestions.length > 0 && (
              <div
                className="bio-card"
                style={{
                  padding: '20px 24px',
                  backgroundColor: '#F0FDF4',
                  border: '1.5px solid #86EFAC',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803D' }}>
                      <AlertCircle size={18} strokeWidth={2.4} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        AUTOMATIC INVENTORY ALLOCATION SUGGESTIONS ({waitingAllocationSuggestions.length})
                      </div>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#14532D', margin: '2px 0 0', fontWeight: 700 }}>
                        Physical Copies Available for Waiting Patrons (FIFO Order)
                      </h4>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#15803D', fontWeight: 600, backgroundColor: '#DCFCE7', padding: '3px 8px', borderRadius: '4px' }}>
                    Requires Librarian Review &amp; Approval
                  </span>
                </div>

                <p style={{ fontSize: '0.84rem', color: '#166534', margin: '0 0 16px', lineHeight: 1.45 }}>
                  The physical inventory for the titles below has available shelf copies while patrons are currently waiting in queue. Review the next eligible patrons according to First Come, First Served (FIFO) order and confirm desk pickup allocations:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {waitingAllocationSuggestions.map(sugg => (
                    <div
                      key={sugg.book.id}
                      style={{
                        padding: '12px 16px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #BBF7D0',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ backgroundColor: '#15803D', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '3px' }}>
                          +{sugg.availableCopies} Available
                        </span>
                        <div>
                          <strong style={{ fontSize: '0.90rem', color: 'var(--editorial-text)' }}>{sugg.book.title}</strong>
                          <div style={{ fontSize: '0.76rem', color: 'var(--editorial-text-muted)', marginTop: '2px' }}>
                            Next in FIFO Line: <strong style={{ color: '#15803D' }}>{sugg.nextPatron.student_name}</strong> ({sugg.nextPatron.membership_id}) · {sugg.waitingCount} total waiting
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleMarkPickup(sugg.nextPatron.id)}
                          className="btn btn-sm"
                          style={{
                            padding: '6px 12px',
                            fontSize: '0.76rem',
                            backgroundColor: '#15803D',
                            color: '#FFFFFF',
                            border: 'none',
                            fontWeight: 700,
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                          title="Allocate physical copy and notify student that volume is ready at front desk (48h pickup)"
                        >
                          ✓ Approve &amp; Allocate Copy for Pickup
                        </button>
                        <button
                          type="button"
                          onClick={() => handleNotifyPatron(sugg.nextPatron)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '5px 10px', fontSize: '0.74rem' }}
                        >
                          Send Queue Notice
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filter and Search Controls Toolbar */}
            <div className="bio-card" style={{ padding: '16px 20px', backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', alignItems: 'center' }}>
                {/* Search Patron or Book */}
                <div style={{ position: 'relative' }}>
                  <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--editorial-text-muted)' }} />
                  <input
                    type="text"
                    value={waitingSearch}
                    onChange={(e) => setWaitingSearch(e.target.value)}
                    placeholder="Search patron, ID, or book..."
                    className="form-control"
                    style={{ paddingLeft: '34px', fontSize: '0.84rem' }}
                  />
                  {waitingSearch && (
                    <button
                      type="button"
                      onClick={() => setWaitingSearch('')}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--editorial-text-muted)' }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Filter by Status */}
                <div>
                  <select
                    value={waitingStatusFilter}
                    onChange={(e) => setWaitingStatusFilter(e.target.value)}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  >
                    <option value="all">All Hold Statuses ({reservations.length})</option>
                    <option value="waiting">Waiting in Line (Awaiting Returns)</option>
                    <option value="ready_for_pickup">Ready for Front Desk Pickup</option>
                  </select>
                </div>

                {/* Filter by Book Title */}
                <div>
                  <select
                    value={waitingBookFilter}
                    onChange={(e) => setWaitingBookFilter(e.target.value)}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  >
                    <option value="all">All Book Titles ({bookOptions.length})</option>
                    {bookOptions.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Order Selector */}
                <div>
                  <select
                    value={waitingSortBy}
                    onChange={(e) => setWaitingSortBy(e.target.value)}
                    className="form-control"
                    style={{ fontSize: '0.84rem', fontWeight: 600 }}
                  >
                    <option value="queue_asc">Order-Wise (#1 First &amp; Exact Time)</option>
                    <option value="book">Group by Book Title</option>
                    <option value="time_desc">Newest Joined First</option>
                    <option value="time_asc">Oldest Joined First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Waiting List Table */}
            <div className="bio-card" style={{ padding: '0', backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--cream)', borderBottom: '1px solid var(--subtle-border)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--forest-dark)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Queue Order
                      </th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--forest-dark)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Patron Details
                      </th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--forest-dark)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Requested Book &amp; Location
                      </th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--forest-dark)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Date &amp; Time (Hour:Min:Sec)
                      </th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--forest-dark)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Status
                      </th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', color: 'var(--forest-dark)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Desk Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayed.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ padding: '48px 24px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', backgroundColor: 'var(--editorial-bg-subtle)', marginBottom: '12px' }}>
                            <Bookmark size={28} color="var(--editorial-accent)" />
                          </div>
                          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--editorial-text)' }}>
                            No Waiting List Records Found
                          </div>
                          <p style={{ fontSize: '0.84rem', color: 'var(--editorial-text-muted)', margin: '4px 0 0' }}>
                            {waitingSearch || waitingStatusFilter !== 'all' || waitingBookFilter !== 'all'
                              ? 'No waitlist records match your current search and filter selections.'
                              : 'All library holds have been fulfilled and all queued patrons have been served.'}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      displayed.map(r => {
                        const dateInfo = formatWithExactSeconds(r.reservation_date || r.created_at);
                        const isFirst = (r.queue_position || 1) === 1;

                        return (
                          <tr
                            key={r.id}
                            style={{
                              borderBottom: '1px solid rgba(52, 78, 65, 0.08)',
                              backgroundColor: isFirst && r.status === 'waiting' ? 'rgba(21, 128, 61, 0.02)' : 'transparent',
                              transition: 'background-color 0.15s ease'
                            }}
                          >
                            {/* 1. Queue Order */}
                            <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                              {isFirst ? (
                                <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '3px', alignItems: 'flex-start' }}>
                                  <span
                                    style={{
                                      backgroundColor: 'var(--editorial-green)',
                                      color: '#FFFFFF',
                                      fontWeight: 800,
                                      fontSize: '0.78rem',
                                      padding: '4px 10px',
                                      borderRadius: '4px',
                                      letterSpacing: '0.02em',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      boxShadow: '0 2px 4px rgba(44, 74, 55, 0.2)'
                                    }}
                                  >
                                    ★ #1 First in Line
                                  </span>
                                  <span style={{ fontSize: '0.70rem', color: 'var(--editorial-green)', fontWeight: 600 }}>
                                    Next for checkout
                                  </span>
                                </div>
                              ) : (
                                <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start' }}>
                                  <span
                                    style={{
                                      backgroundColor: '#F3F4F6',
                                      color: '#374151',
                                      fontWeight: 700,
                                      fontSize: '0.78rem',
                                      padding: '4px 10px',
                                      borderRadius: '4px',
                                      border: '1px solid #E5E7EB'
                                    }}
                                  >
                                    #{r.queue_position} in Queue
                                  </span>
                                  <span style={{ fontSize: '0.70rem', color: 'var(--editorial-text-muted)' }}>
                                    {(r.queue_position || 2) - 1} patron(s) ahead
                                  </span>
                                </div>
                              )}
                            </td>

                            {/* 2. Patron Information */}
                            <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                              <div style={{ fontWeight: 700, color: 'var(--forest-dark)', fontSize: '0.92rem' }}>
                                {r.student_name}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--editorial-accent)', fontWeight: 600, backgroundColor: 'var(--editorial-bg-subtle)', padding: '1px 6px', borderRadius: '3px' }}>
                                  {r.membership_id || 'ID Pending'}
                                </span>
                                {r.student_email && (
                                  <span style={{ fontSize: '0.74rem', color: 'var(--muted-text)' }}>
                                    · {r.student_email}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* 3. Book Details */}
                            <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                  width: '44px',
                                  height: '60px',
                                  flexShrink: 0,
                                  borderRadius: '4px',
                                  overflow: 'hidden',
                                  backgroundColor: 'var(--warm-beige)',
                                  border: '1px solid var(--editorial-border)',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
                                }}>
                                  <img
                                    src={resolveBookCoverUrl(r.cover_image, r.book_title, 'Archivist', 'Archival')}
                                    alt={r.book_title}
                                    onError={(e) => handleBookCoverError(e, r.book_title, 'Archivist', 'Archival')}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    loading="lazy"
                                  />
                                </div>
                                <div>
                                  <div style={{ fontWeight: 700, color: 'var(--forest-dark)', fontSize: '0.90rem', lineHeight: 1.3 }}>
                                    {r.book_title}
                                  </div>
                                  <div style={{ fontSize: '0.76rem', color: 'var(--muted-text)', marginTop: '2px' }}>
                                    by {r.book_author || 'Author'}
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '0.70rem', color: '#92400E', backgroundColor: '#FEF3C7', padding: '2px 6px', borderRadius: '3px', fontWeight: 600 }}>
                                      {r.available_copies ?? 0} of {r.total_copies || 'total'} available
                                    </span>
                                    {r.shelf_location && (
                                      <span style={{ fontSize: '0.70rem', color: 'var(--editorial-text-muted)' }}>
                                        📍 {r.shelf_location}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* 4. Exact Date & Time (Hour, Minute, Second) */}
                            <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <div style={{ fontWeight: 700, color: 'var(--editorial-text)', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                                  <span>📅</span>
                                  <span>{dateInfo.dateStr}</span>
                                  <span style={{ fontSize: '0.74rem', color: 'var(--editorial-accent)', fontWeight: 700 }}>({dateInfo.dayStr})</span>
                                </div>
                                <div style={{
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '0.80rem',
                                  fontWeight: 700,
                                  color: 'var(--editorial-accent)',
                                  backgroundColor: 'var(--editorial-bg-subtle)',
                                  padding: '2px 6px',
                                  borderRadius: '3px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  width: 'fit-content'
                                }}>
                                  <Clock size={12} strokeWidth={2.2} />
                                  <span>{dateInfo.timeStr}</span>
                                </div>
                                <div style={{ fontSize: '0.68rem', color: 'var(--editorial-text-muted)', marginTop: '1px' }}>
                                  Precise queue entry timestamp
                                </div>
                              </div>
                            </td>

                            {/* 5. Status Badge & Pickup Info */}
                            <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                              {r.status === 'ready_for_pickup' ? (
                                <div>
                                  <span className="badge badge-available" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                                    ● Ready for Pickup
                                  </span>
                                  <div style={{ fontSize: '0.72rem', color: '#B45309', fontWeight: 600, marginTop: '4px' }}>
                                    Deadline: {r.pickup_deadline ? formatWithExactSeconds(r.pickup_deadline).fullStr : '48 Hours'}
                                  </div>
                                </div>
                              ) : r.status === 'waiting' ? (
                                <div>
                                  <span className="badge badge-reserved" style={{ fontSize: '0.74rem', fontWeight: 700, backgroundColor: '#FFFBEB', color: '#B45309', border: '1px solid #FCD34D' }}>
                                    ● Waiting in Queue
                                  </span>
                                  <div style={{ fontSize: '0.72rem', color: 'var(--editorial-text-muted)', marginTop: '3px' }}>
                                    Awaiting return of loan
                                  </div>
                                </div>
                              ) : (
                                <span className="badge badge-category">{r.status}</span>
                              )}
                            </td>

                            {/* 6. Desk Actions */}
                            <td style={{ padding: '14px 16px', verticalAlign: 'middle', textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                {r.status === 'waiting' && (
                                  <button
                                    type="button"
                                    onClick={() => handleMarkPickup(r.id)}
                                    className="btn btn-secondary btn-sm"
                                    style={{ fontSize: '0.76rem', padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                    title="Mark this copy ready at the circulation desk and notify the student"
                                  >
                                    <CheckCircle size={13} />
                                    <span>Mark Ready</span>
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleNotifyPatron(r)}
                                  className="btn btn-outline btn-sm"
                                  style={{ fontSize: '0.76rem', padding: '5px 9px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                  title="Dispatch in-app notification to this patron regarding their waiting list position"
                                >
                                  <Send size={12} />
                                  <span>Notify</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleCancelReservation(r.id, r.book_title, r.student_name)}
                                  className="btn btn-outline btn-sm"
                                  style={{ fontSize: '0.76rem', padding: '5px 8px', color: '#991B1B', borderColor: '#FCA5A5' }}
                                  title="Cancel this waiting list request and advance next patrons"
                                >
                                  <X size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

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
                  border: '1.5px solid var(--editorial-border)',
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

      {/* Decline Penalty Justification Modal (Requirement 10) */}
      {decliningLoan && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '16px'
          }}
          onClick={() => setDecliningLoan(null)}
        >
          <div
            className="bio-card"
            style={{
              maxWidth: '500px',
              width: '100%',
              backgroundColor: '#FFFFFF',
              padding: '28px',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B91C1C' }}>
                <AlertTriangle size={20} />
                <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--editorial-text)' }}>
                  Decline / Waive Penalty
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDecliningLoan(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--editorial-text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--editorial-text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
              You are waiving the circulation penalty for patron <strong style={{ color: 'var(--editorial-text)' }}>{decliningLoan.student_name}</strong> on volume <strong style={{ color: 'var(--editorial-text)' }}>"{decliningLoan.book_title}"</strong> (${Number(decliningLoan.penalty_amount || decliningLoan.fine_amount || 15).toFixed(2)}).
            </p>

            <form onSubmit={handleConfirmDeclinePenalty}>
              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label className="form-label">Justification / Reason for Waiver *</label>
                <textarea
                  className="form-control"
                  rows={3}
                  required
                  placeholder="e.g. Patron returned volume in after-hours book drop before due date; verified by desk staff..."
                  value={declineReasonText}
                  onChange={(e) => setDeclineReasonText(e.target.value)}
                  style={{ fontSize: '0.86rem' }}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--editorial-text-muted)', marginTop: '4px', display: 'block' }}>
                  This reason will be recorded in system audit logs and transmitted to the patron in their notification feed.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setDecliningLoan(null)}
                  className="btn btn-outline btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={decliningSubmitting}
                  className="btn btn-primary btn-sm"
                  style={{ backgroundColor: '#B91C1C', borderColor: '#B91C1C' }}
                >
                  {decliningSubmitting ? 'Waiving Penalty...' : 'Confirm Decline & Waive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
