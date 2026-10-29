import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Users,
  FileText,
  Database,
  Check,
  AlertCircle,
  Download,
  Key,
  Trash2,
  MessageSquare,
  Send,
  X,
  AlertTriangle,
  PlusCircle,
  BookPlus,
  BookOpen,
  LogOut,
  ShieldAlert,
  BarChart3,
  UserPlus,
  Lock,
  Layers,
  Search,
  Filter,
  CheckCircle2
} from 'lucide-react';

export default function AdminDashboard({ onNavigate, initialTab = 'overview' }) {
  const { user, login, logout, adminVerified, setAdminVerified, logoutAdminPortal } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Directory Filtering & Search State
  const [userDirectoryFilter, setUserDirectoryFilter] = useState('all'); // 'all' | 'students' | 'librarians' | 'admins'
  const [userSearchQuery, setUserSearchQuery] = useState('');

  const [auditLogs, setAuditLogs] = useState([]);
  const [triggeringCron, setTriggeringCron] = useState(false);

  // Admin Gateway Authentication state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // User Messaging & Actions State
  const [messageModalUser, setMessageModalUser] = useState(null);
  const [msgTitle, setMsgTitle] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [msgType, setMsgType] = useState('announcement');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [sentMessages, setSentMessages] = useState([]);

  // Add Book Modal State
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [addingBook, setAddingBook] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publication_year: 2024,
    category: 'Classic Novels',
    edition: '1st Edition',
    language: 'English',
    floor: 'Floor 1',
    section: 'Spiritual Wisdom Sanctuary',
    shelf: 'Shelf CL-01',
    rack: 'Rack 01',
    total_copies: 1,
    description: '',
    cover_image: ''
  });

  // Daily Reading Velocity & Inventory Intelligence State
  const [overviewData, setOverviewData] = useState(null);
  const [addingCopyId, setAddingCopyId] = useState(null);

  // Add Librarian Modal State
  const [showAddLibrarianModal, setShowAddLibrarianModal] = useState(false);
  const [addingLibrarian, setAddingLibrarian] = useState(false);
  const [newLibrarian, setNewLibrarian] = useState({
    name: '',
    email: '',
    password: '',
    interests: 'Circulation Desk, Book Curation, Library Operations'
  });

  const fetchUsers = useCallback(async () => {
    if (!user || user.role !== 'admin' || !adminVerified) return;
    setLoading(true);
    try {
      const [userData, logsData, ovData] = await Promise.all([
        api.getAllUsers().catch(() => []),
        api.getAuditLogs().catch(() => []),
        api.getAnalyticsOverview().catch(() => null)
      ]);
      setUsers(userData || []);
      setAuditLogs(logsData || []);
      setOverviewData(ovData || null);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  }, [user, adminVerified]);

  const handleAddCopiesToBook = async (bookId, title, count = 1) => {
    setAddingCopyId(bookId);
    try {
      await api.addBookCopy(bookId, { count, condition: 'New' });
      showToast(`Added ${count} physical cop${count > 1 ? 'ies' : 'y'} to "${title}"!`);
      await fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to add copies', true);
    } finally {
      setAddingCopyId(null);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin' && adminVerified) {
      fetchUsers();
    }
  }, [user, adminVerified, fetchUsers]);

  const showToast = (msg, isError = false) => {
    setToastMessage({ msg, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminLoginError('');
    setLoggingIn(true);
    try {
      let queryEmail = (adminEmail || (user?.email && user.role === 'admin' ? user.email : '')).trim();
      if (queryEmail.toLowerCase() === 'admin' || queryEmail.toLowerCase() === 'admin@1234' || queryEmail.toLowerCase() === 'admin1234') {
        queryEmail = 'admin@libramind.edu';
      }
      const res = await login(queryEmail, adminPassword, true);
      if (res.user.role !== 'admin') {
        setAdminLoginError('Access Denied: This account is not an authorized library administrator.');
      } else {
        await fetchUsers();
      }
    } catch (err) {
      setAdminLoginError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoggingIn(false);
    }
  };


  const [updatingRoleId, setUpdatingRoleId] = useState(null);

  const handleDeleteUser = async (u) => {
    if (u.id === user?.id || u.email === user?.email) {
      showToast('You cannot delete your own admin account', true);
      return;
    }

    const confirmText = `Are you sure you want to permanently delete user "${u.name}" (${u.email})?\n\nThis will safely release all borrowed copies and reservations associated with this account.`;
    if (!window.confirm(confirmText)) return;

    setDeletingUserId(u.id);
    try {
      const res = await api.deleteUser(u.id);
      showToast(res.message || `User ${u.name} deleted successfully!`);
      await fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to delete user', true);
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleRoleChange = async (targetUser, newRole) => {
    if (!targetUser || targetUser.role === newRole) return;
    if (targetUser.id === user?.id) {
      showToast('You cannot modify your own administrator role', true);
      return;
    }
    const confirmPrompt = `Change access role for "${targetUser.name}" from "${targetUser.role}" to "${newRole}"?`;
    if (!window.confirm(confirmPrompt)) return;

    setUpdatingRoleId(targetUser.id);
    try {
      const res = await api.updateUserRole(targetUser.id, newRole);
      showToast(res.message || `Role updated to ${newRole}`);
      await fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to update user role', true);
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const handleOpenMessageModal = (u) => {
    setMessageModalUser(u);
    setMsgTitle(`Important Notice from LibraMind Administration`);
    setMsgBody('');
    setMsgType('announcement');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!msgTitle.trim() || !msgBody.trim()) {
      showToast('Title and message content are required', true);
      return;
    }

    setSendingMsg(true);
    try {
      const res = await api.messageUser(messageModalUser.id, {
        title: msgTitle.trim(),
        message: msgBody.trim(),
        type: msgType,
        link: '/dashboard'
      });
      showToast(`Notice delivered to ${messageModalUser.name}'s screen!`);
      setSentMessages(prev => [
        {
          id: Date.now(),
          recipient: messageModalUser.name,
          email: messageModalUser.email,
          title: msgTitle.trim(),
          message: msgBody.trim(),
          type: msgType,
          sentAt: new Date().toLocaleTimeString()
        },
        ...prev
      ]);
      setMessageModalUser(null);
      await fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to send message', true);
    } finally {
      setSendingMsg(false);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    setAddingBook(true);
    try {
      await api.createBook(newBook);
      showToast(`Book "${newBook.title}" added to catalog with ${newBook.total_copies} physical copies!`);
      setNewBook({
        title: '',
        author: '',
        isbn: '',
        publisher: '',
        publication_year: 2024,
        category: 'Computer Science',
        edition: '1st Edition',
        language: 'English',
        floor: 'Floor 1',
        section: 'Tech & Engineering',
        shelf: 'Shelf CS-01',
        rack: 'Rack 01',
        total_copies: 1,
        description: '',
        cover_image: ''
      });
      setShowAddBookModal(false);
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to add book', true);
    } finally {
      setAddingBook(false);
    }
  };

  const handleCreateLibrarian = async (e) => {
    e.preventDefault();
    if (!newLibrarian.name.trim() || !newLibrarian.email.trim() || !newLibrarian.password.trim()) {
      showToast('Name, email, and password are required', true);
      return;
    }
    setAddingLibrarian(true);
    try {
      const res = await api.createLibrarian(newLibrarian);
      showToast(res.message || `Librarian ${newLibrarian.name} created successfully!`);
      setShowAddLibrarianModal(false);
      setNewLibrarian({
        name: '',
        email: '',
        password: '',
        interests: 'Circulation Desk, Book Curation, Library Operations'
      });
      await fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to create librarian', true);
    } finally {
      setAddingLibrarian(false);
    }
  };

  const handleRunScheduler = async () => {
    setTriggeringCron(true);
    try {
      const res = await api.triggerScheduler();
      showToast(res.message || 'Scheduler cycle completed!');
      fetchUsers();
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setTriggeringCron(false);
    }
  };

  // Case 1: Logged-in user is NOT an Admin -> 403 Forbidden Access Denied Screen
  if (user && user.role !== 'admin') {
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
            Master Security Boundary
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--forest-dark)', margin: '4px 0 10px' }}>
            Access Denied: Administrator Privileges Required
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', lineHeight: 1.5, marginBottom: '24px' }}>
            You are currently authenticated as a <strong>{user.role === 'librarian' ? 'Librarian Staff' : 'Student Member'}</strong> ({user.name} • {user.email}). System governance and master controls are restricted exclusively to administrators.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => onNavigate(user.role === 'librarian' ? 'librarian' : 'dashboard')}
              className="btn btn-primary"
              style={{ padding: '11px', width: '100%', fontSize: '0.92rem' }}
            >
              Return to My {user.role === 'librarian' ? 'Librarian Desk' : 'Student Hub'}
            </button>
            <button
              onClick={async () => {
                await logout();
                onNavigate('admin');
              }}
              className="btn btn-outline"
              style={{ padding: '10px', width: '100%', fontSize: '0.88rem' }}
            >
              Sign Out & Sign In with Admin Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Not authenticated through the Admin Portal Gateway -> Secure Admin Sign-in Gateway
  if (!user || !adminVerified) {
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
            border: '1px solid rgba(197, 34, 31, 0.22)'
          }}
        >
          {/* Brand Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#A51D24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
                boxShadow: '0 6px 18px rgba(197, 34, 31, 0.3)'
              }}
            >
              <Shield size={28} color="#FAF8F1" />
            </div>
            <div
              style={{
                display: 'inline-block',
                backgroundColor: '#FCE8E6',
                color: '#C5221F',
                fontSize: '0.72rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '3px 10px',
                borderRadius: '12px',
                marginBottom: '8px'
              }}
            >
              Master Security Boundary
            </div>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--forest-dark)', margin: '4px 0 6px' }}>
              Admin Portal Gateway
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', margin: 0 }}>
              {user && user.role === 'admin'
                ? 'Confirm your master administrator password to unlock the Admin Portal.'
                : 'Sign in with administrator credentials to access governance and user records.'}
            </p>
          </div>

          {/* User Mode Notice if admin logged in through user portal */}
          {user && user.role === 'admin' && !adminVerified && (
            <div
              style={{
                backgroundColor: '#FCE8E6',
                border: '1px solid rgba(197, 34, 31, 0.25)',
                borderRadius: '10px',
                padding: '12px 14px',
                marginBottom: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#A51D24', marginBottom: '4px' }}>
                <ShieldAlert size={15} />
                User Mode Active
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#8C1D18', lineHeight: 1.4 }}>
                You are currently browsing the sanctuary as a regular member (<strong>{user.name}</strong>). To open the master Admin Portal, please verify your administrator credentials.
              </p>
            </div>
          )}

          {adminLoginError && (
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
              {adminLoginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                Administrator Email / ID
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="admin@libramind.edu or admin@1234"
                value={adminEmail || (user?.email && user.role === 'admin' ? user.email : '')}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '22px' }}>
              <label className="form-label" style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                Master Password
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loggingIn}
              style={{ width: '100%', padding: '12px', fontSize: '0.96rem', backgroundColor: '#A51D24', borderColor: '#8C1D18' }}
            >
              {loggingIn ? 'Verifying Administrator Credentials...' : 'Sign In to Admin Portal'}
            </button>

            {user && user.role === 'admin' && !adminVerified && (
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="btn btn-outline"
                style={{ width: '100%', marginTop: '10px', fontSize: '0.88rem' }}
              >
                ← Continue Using Website as Regular User
              </button>
            )}
          </form>

          {/* 1-Click Quick Demo Login for Administrator */}
          <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--subtle-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--forest-dark)', textTransform: 'uppercase' }}>
                ⚡ 1-Click Admin Demo Access:
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--sage)', fontWeight: 600 }}>
                Pass: Admin@123
              </span>
            </div>
            <button
              type="button"
              onClick={async () => {
                setAdminEmail('admin@libramind.edu');
                setAdminPassword('Admin@123');
                setAdminLoginError('');
                setLoggingIn(true);
                try {
                  await login('admin@libramind.edu', 'Admin@123', true);
                  fetchUsers();
                } catch (err) {
                  setAdminLoginError(err.message || 'Login failed');
                } finally {
                  setLoggingIn(false);
                }
              }}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', fontSize: '0.82rem', padding: '9px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <span><strong>Dr. Elena Vance</strong> (Chief Library Administrator)</span>
              <span style={{ fontSize: '0.74rem', color: 'var(--forest)', fontWeight: 700 }}>Auto-fill & Enter →</span>
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

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      {/* Toast */}
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
          {toastMessage.isError ? <AlertCircle size={18} /> : <Check size={18} />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Add New Librarian Staff Modal */}
      {showAddLibrarianModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2500,
            padding: '20px'
          }}
        >
          <div
            className="bio-card"
            style={{
              width: '520px',
              maxWidth: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              padding: '28px',
              boxShadow: 'var(--shadow-xl)',
              position: 'relative',
              border: '1px solid rgba(82, 115, 77, 0.25)'
            }}
          >
            <button
              onClick={() => setShowAddLibrarianModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--muted-text)'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--botanical)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FAF8F1'
                }}
              >
                <UserPlus size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--forest-dark)', margin: 0 }}>
                  Add New Librarian Staff
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--muted-text)' }}>
                  Grants circulation desk, book issue/return, and catalog access privileges.
                </span>
              </div>
            </div>

            <form onSubmit={handleCreateLibrarian}>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label" style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                  Staff Member Full Name *
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Sarah Jenkins"
                  value={newLibrarian.name}
                  onChange={(e) => setNewLibrarian({ ...newLibrarian, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label" style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                  Institutional Email Address *
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="e.g. s.jenkins@libramind.edu"
                  value={newLibrarian.email}
                  onChange={(e) => setNewLibrarian({ ...newLibrarian, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label" style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                  Initial Password / Access Key (min 6 characters) *
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="e.g. Librarian@123"
                  value={newLibrarian.password}
                  onChange={(e) => setNewLibrarian({ ...newLibrarian, password: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '22px' }}>
                <label className="form-label" style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                  Assigned Section / Responsibilities
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Circulation Desk, Novella & Spiritual Curation"
                  value={newLibrarian.interests}
                  onChange={(e) => setNewLibrarian({ ...newLibrarian, interests: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAddLibrarianModal(false)}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '8px 16px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingLibrarian}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <UserPlus size={15} />
                  {addingLibrarian ? 'Creating Account...' : 'Create Librarian'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Book Modal */}
      {showAddBookModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2500,
            padding: '20px'
          }}
        >
          <div
            className="bio-card"
            style={{
              width: '640px',
              maxWidth: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '28px',
              boxShadow: 'var(--shadow-xl)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setShowAddBookModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--muted-text)'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--forest)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FAF8F1'
                }}
              >
                <BookPlus size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--forest-dark)', margin: 0 }}>
                  Add New Book to Catalog
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--muted-text)' }}>
                  Create catalog entry and auto-generate physical shelf barcode copies.
                </span>
              </div>
            </div>

            <form onSubmit={handleAddBook}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Clean Architecture"
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Author *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Robert C. Martin"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '10px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>ISBN *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 978-0134494166"
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Category *</label>
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
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Publication Year</label>
                  <input
                    type="number"
                    min="1800"
                    max="2099"
                    className="form-control"
                    value={newBook.publication_year}
                    onChange={(e) => setNewBook({ ...newBook, publication_year: parseInt(e.target.value) || 2024 })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Copies *</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    className="form-control"
                    value={newBook.total_copies}
                    onChange={(e) => setNewBook({ ...newBook, total_copies: parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '10px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 600 }}>Floor</label>
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
                  <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 600 }}>Section</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Main Hall"
                    value={newBook.section}
                    onChange={(e) => setNewBook({ ...newBook, section: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 600 }}>Shelf Code</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Shelf CS-01"
                    value={newBook.shelf}
                    onChange={(e) => setNewBook({ ...newBook, shelf: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 600 }}>Rack</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rack 01"
                    value={newBook.rack}
                    onChange={(e) => setNewBook({ ...newBook, rack: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '10px' }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Cover Image URL (Optional)</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/..."
                  value={newBook.cover_image}
                  onChange={(e) => setNewBook({ ...newBook, cover_image: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginTop: '10px' }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Book Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Summary of chapters, topics covered, and target audience..."
                  value={newBook.description}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddBookModal(false)}
                  className="btn btn-outline btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingBook}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <PlusCircle size={15} />
                  {addingBook ? 'Adding Book...' : 'Save Book to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Direct Message to User Modal */}
      {messageModalUser && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2500,
            padding: '20px'
          }}
        >
          <div
            className="bio-card"
            style={{
              width: '520px',
              maxWidth: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '28px',
              boxShadow: 'var(--shadow-xl)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setMessageModalUser(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--muted-text)'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--soft-sage-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--forest)'
                }}
              >
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)', margin: 0 }}>
                  Send Message to User
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--muted-text)' }}>
                  Recipient: <strong>{messageModalUser.name}</strong> ({messageModalUser.email} • {messageModalUser.membership_id})
                </span>
              </div>
            </div>

            <form onSubmit={handleSendMessage}>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                  Notification Type
                </label>
                <select
                  className="form-control"
                  value={msgType}
                  onChange={(e) => setMsgType(e.target.value)}
                  style={{ fontSize: '0.88rem' }}
                >
                  <option value="announcement">📢 Library Announcement</option>
                  <option value="warning">⚠️ Important Notice / Policy Warning</option>
                  <option value="due_reminder">⏰ Overdue Loan Reminder</option>
                  <option value="info">ℹ️ General Information</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                  Subject / Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Regarding your active loans or library card status"
                  value={msgTitle}
                  onChange={(e) => setMsgTitle(e.target.value)}
                  required
                  style={{ fontSize: '0.88rem' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                  Message Content
                </label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Write your direct message to this user here. It will immediately appear on their screen and notification inbox."
                  value={msgBody}
                  onChange={(e) => setMsgBody(e.target.value)}
                  required
                  style={{ fontSize: '0.88rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setMessageModalUser(null)}
                  className="btn btn-outline btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingMsg}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Send size={14} />
                  {sendingMsg ? 'Delivering...' : 'Send Message to Screen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--botanical)', fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <Shield size={16} /> Security & System Governance
          </div>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--forest-dark)', marginTop: '4px', marginBottom: '6px' }}>
            Admin Control Center
          </h1>
          <p style={{ color: 'var(--muted-text)', fontSize: '1rem', margin: 0 }}>
            Manage registered members, broadcast notices, add catalog inventory, and inspect audit logs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => setShowAddBookModal(true)}
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <BookPlus size={16} />
            + Add New Book
          </button>
        </div>
      </div>

      {/* System Integrity Cards */}{/* Overview Tab */}
      {(activeTab === 'overview' || !activeTab) && (
        <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '36px'
        }}
      >
        <div className="bio-card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Database size={20} color="var(--forest)" />
            <strong style={{ fontSize: '1rem', color: 'var(--forest-dark)' }}>Database Engine</strong>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', margin: 0 }}>
            SQLite with WAL journal mode. Enforces ACID transactions for all loans, returns, and hold cancellations.
          </p>
        </div>

        <div className="bio-card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Key size={20} color="var(--botanical)" />
            <strong style={{ fontSize: '1rem', color: 'var(--forest-dark)' }}>Role-Based Access Control</strong>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', margin: 0 }}>
            JWT authentication with role validation on all protected endpoints (`student`, `librarian`, `admin`).
          </p>
        </div>

        <div className="bio-card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Download size={20} color="var(--sage)" />
            <strong style={{ fontSize: '1rem', color: 'var(--forest-dark)' }}>Data Export</strong>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', marginBottom: '10px' }}>
            Download complete library catalog with shelf coordinates in CSV format.
          </p>
          <a
            href={api.exportBooksCsvUrl()}
            className="btn btn-outline btn-sm"
            download
          >
            Download Catalog CSV
          </a>
        </div>
      </div>

        {/* 4 Reading Velocity Metrics Cards (Overview) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={{ padding: '16px 20px', borderRadius: '12px', backgroundColor: '#FFFFFF', border: '1px solid var(--subtle-border)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Daily Books Read
            </span>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--forest-dark)', marginTop: '4px' }}>
              {overviewData?.dailyBooksRead || 0} <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--muted-text)' }}>books/day</span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: 'var(--botanical)' }}>
              Total volumes currently read or borrowed by members today
            </p>
          </div>

          <div style={{ padding: '16px 20px', borderRadius: '12px', backgroundColor: '#FFFFFF', border: '1px solid var(--subtle-border)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Est. Reading Velocity
            </span>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--forest-dark)', marginTop: '4px' }}>
              {overviewData?.avgDailyVelocity || 0} <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--muted-text)' }}>daily cap</span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: 'var(--muted-text)' }}>
              Projected daily reader capacity across all physical copies
            </p>
          </div>

          <div style={{ padding: '16px 20px', borderRadius: '12px', backgroundColor: '#FFFFFF', border: '1px solid var(--subtle-border)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Student Readers
            </span>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--forest-dark)', marginTop: '4px' }}>
              {users.filter(u => u.role === 'student').length} <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--muted-text)' }}>students</span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: 'var(--muted-text)' }}>
              Active borrowers and reservation holders registered
            </p>
          </div>

          <div style={{ padding: '16px 20px', borderRadius: '12px', backgroundColor: '#FFFFFF', border: '1px solid var(--subtle-border)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Copies Needing Restock
            </span>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: overviewData?.popularBooks?.some(b => b.available_copies <= 1) ? '#C5221F' : 'var(--forest)', marginTop: '4px' }}>
              {overviewData?.popularBooks?.filter(b => b.available_copies <= 1).length || 0} <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--muted-text)' }}>titles</span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: '#C5221F' }}>
              Popular titles with 0 or 1 copy available for readers
            </p>
          </div>
        </div>

        {/* Quick Jump Shortcuts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div
            onClick={() => { setActiveTab('users'); if (onNavigate) onNavigate('admin', { tab: 'users' }); }}
            className="bio-card"
            style={{ padding: '24px', backgroundColor: '#FFFFFF', cursor: 'pointer', transition: 'all 0.2s ease', borderLeft: '4px solid var(--forest)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--soft-sage-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--forest)' }}>
                <Users size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--forest-dark)' }}>User Management</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted-text)' }}>{users.length} registered members</span>
              </div>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', margin: '0 0 12px' }}>
              View all user accounts, manage security roles, send on-screen messages, or remove accounts.
            </p>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--forest)' }}>Open User Directory →</span>
          </div>

          <div
            onClick={() => { setActiveTab('inventory'); if (onNavigate) onNavigate('admin', { tab: 'inventory' }); }}
            className="bio-card"
            style={{ padding: '24px', backgroundColor: '#FFFFFF', cursor: 'pointer', transition: 'all 0.2s ease', borderLeft: '4px solid var(--botanical)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--soft-sage-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--forest)' }}>
                <Database size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--forest-dark)' }}>Book Inventory & Copies</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted-text)' }}>Fast copy replenishment</span>
              </div>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', margin: '0 0 12px' }}>
              Quickly add 1 or 2 copies to high-demand books, monitor velocity, and add new catalog entries.
            </p>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--botanical)' }}>Manage Inventory Copies →</span>
          </div>

          <div
            onClick={() => { setActiveTab('audit'); if (onNavigate) onNavigate('admin', { tab: 'audit' }); }}
            className="bio-card"
            style={{ padding: '24px', backgroundColor: '#FFFFFF', cursor: 'pointer', transition: 'all 0.2s ease', borderLeft: '4px solid var(--sage)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--soft-sage-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--forest)' }}>
                <Lock size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--forest-dark)' }}>Audit Trail & Governance</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted-text)' }}>{auditLogs.length} audit events logged</span>
              </div>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', margin: '0 0 12px' }}>
              Immutable security logs of all system events, fine calculations, and manual scheduler runs.
            </p>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--forest)' }}>View Security Logs →</span>
          </div>
        </div>
      </div>
      )}

      {/* TAB 2: Inventory & Velocity */}
      {activeTab === 'inventory' && (
      <div className="bio-card" style={{ padding: '28px', backgroundColor: '#FFFFFF', marginBottom: '36px', borderLeft: '5px solid var(--forest)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--botanical)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>
              <BarChart3 size={16} /> Circulation Intelligence & Physical Inventory
            </div>
            <h2 style={{ fontSize: '1.65rem', color: 'var(--forest-dark)', margin: '4px 0 6px' }}>
              Daily Reading Velocity & Popular Book Copies
            </h2>
            <p style={{ fontSize: '0.90rem', color: 'var(--muted-text)', margin: 0, maxWidth: '720px' }}>
              Real-time daily circulation metrics and reading trends. Review high-demand titles and replenish physical book copies directly to prevent queue wait times.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span className="badge badge-available" style={{ padding: '6px 12px', fontSize: '0.84rem' }}>
              ● Live Reading Velocity Active
            </span>
          </div>
        </div>

        {/* 4 Reading Velocity Metrics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ padding: '16px 20px', borderRadius: '12px', backgroundColor: 'var(--cream)', border: '1px solid var(--subtle-border)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Daily Books Read
            </span>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--forest-dark)', marginTop: '4px' }}>
              {overviewData?.dailyBooksRead || 0} <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--muted-text)' }}>books/day</span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: 'var(--botanical)' }}>
              Total volumes currently read or borrowed by members today
            </p>
          </div>

          <div style={{ padding: '16px 20px', borderRadius: '12px', backgroundColor: 'var(--cream)', border: '1px solid var(--subtle-border)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Est. Reading Velocity
            </span>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--forest-dark)', marginTop: '4px' }}>
              {overviewData?.avgDailyVelocity || 0} <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--muted-text)' }}>daily cap</span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: 'var(--muted-text)' }}>
              Projected daily reader capacity across all physical copies
            </p>
          </div>

          <div style={{ padding: '16px 20px', borderRadius: '12px', backgroundColor: 'var(--cream)', border: '1px solid var(--subtle-border)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Student Readers
            </span>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--forest-dark)', marginTop: '4px' }}>
              {users.filter(u => u.role === 'student').length} <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--muted-text)' }}>students</span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: 'var(--muted-text)' }}>
              Active borrowers and reservation holders registered
            </p>
          </div>

          <div style={{ padding: '16px 20px', borderRadius: '12px', backgroundColor: 'var(--cream)', border: '1px solid var(--subtle-border)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Copies Needing Restock
            </span>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: overviewData?.popularBooks?.some(b => b.available_copies <= 1) ? '#C5221F' : 'var(--forest)', marginTop: '4px' }}>
              {overviewData?.popularBooks?.filter(b => b.available_copies <= 1).length || 0} <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--muted-text)' }}>titles</span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: '#C5221F' }}>
              Popular titles with 0 or 1 copy available for readers
            </p>
          </div>
        </div>

        {/* Popular Books Copy Management Table */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--forest-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} color="var(--forest)" />
              Most Popular Titles & Fast Copy Replenishment
            </h4>
            <span style={{ fontSize: '0.80rem', color: 'var(--muted-text)' }}>
              Click "+1 Copy" or "+2 Copies" to instantly expand physical copies for any title.
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--cream)', borderBottom: '1px solid var(--subtle-border)' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--forest-dark)' }}>Title & Author</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--forest-dark)' }}>Category & Shelf</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--forest-dark)' }}>Total Copies</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--forest-dark)' }}>Available</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--forest-dark)' }}>Total Reads</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--forest-dark)' }}>Circulation Status</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--forest-dark)' }}>Manage Copies</th>
                </tr>
              </thead>
              <tbody>
                {(overviewData?.popularBooks || []).map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid rgba(52, 78, 65, 0.08)' }}>
                    <td style={{ padding: '12px' }}>
                      <strong style={{ color: 'var(--forest-dark)' }}>{b.title}</strong>
                      <div style={{ fontSize: '0.76rem', color: 'var(--muted-text)' }}>by {b.author}</div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span className="badge badge-category" style={{ fontSize: '0.72rem' }}>{b.category}</span>
                      <div style={{ fontSize: '0.74rem', color: 'var(--muted-text)', marginTop: '2px' }}>
                        {b.floor} • {b.shelf}
                      </div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 700 }}>
                      {b.total_copies}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span
                        className={`badge ${b.available_copies === 0 ? 'badge-reserved' : b.available_copies === 1 ? 'badge-warning' : 'badge-available'}`}
                        style={{ fontWeight: 700 }}
                      >
                        {b.available_copies} avail
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: 'var(--forest)' }}>
                      {b.total_reads} reads
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          color: b.available_copies === 0 ? '#C5221F' : b.available_copies === 1 ? '#D97706' : 'var(--botanical)',
                          display: 'inline-block'
                        }}
                      >
                        {b.demandStatus}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                        <button
                          onClick={() => handleAddCopiesToBook(b.id, b.title, 1)}
                          disabled={addingCopyId === b.id}
                          className="btn btn-sm"
                          style={{
                            padding: '4px 10px',
                            fontSize: '0.76rem',
                            backgroundColor: 'var(--soft-sage-light)',
                            color: 'var(--forest-dark)',
                            border: '1px solid rgba(82, 115, 77, 0.3)',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                          title={`Add 1 new physical copy of ${b.title}`}
                        >
                          {addingCopyId === b.id ? 'Adding...' : '+1 Copy'}
                        </button>

                        <button
                          onClick={() => handleAddCopiesToBook(b.id, b.title, 2)}
                          disabled={addingCopyId === b.id}
                          className="btn btn-sm"
                          style={{
                            padding: '4px 10px',
                            fontSize: '0.76rem',
                            backgroundColor: '#FFFFFF',
                            color: 'var(--forest)',
                            border: '1px solid var(--subtle-border)',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                          title={`Add 2 new physical copies of ${b.title}`}
                        >
                          +2 Copies
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

      {/* TAB 3: User & Librarian Administration */}
      {activeTab === 'users' && (() => {
        const studentUsers = users.filter(u => u.role === 'student' || (!u.role && u.role !== 'librarian' && u.role !== 'admin'));
        const librarianUsers = users.filter(u => u.role === 'librarian');
        const adminUsers = users.filter(u => u.role === 'admin');
        const totalActiveLoans = users.reduce((sum, u) => sum + (parseInt(u.active_loans) || 0), 0);

        const filteredUsers = users.filter(u => {
          if (userDirectoryFilter === 'students' && u.role !== 'student' && u.role) return false;
          if (userDirectoryFilter === 'librarians' && u.role !== 'librarian') return false;
          if (userDirectoryFilter === 'admins' && u.role !== 'admin') return false;

          if (userSearchQuery.trim()) {
            const q = userSearchQuery.toLowerCase().trim();
            const matchName = u.name && u.name.toLowerCase().includes(q);
            const matchEmail = u.email && u.email.toLowerCase().includes(q);
            const matchId = u.membership_id && u.membership_id.toLowerCase().includes(q);
            const matchInterests = u.interests && u.interests.toLowerCase().includes(q);
            return matchName || matchEmail || matchId || matchInterests;
          }
          return true;
        });

        return (
          <div>
            {/* Top 4 Summary Metrics for Users & Librarians */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
              }}
            >
              {/* Card 1: Student Members */}
              <div
                onClick={() => setUserDirectoryFilter('students')}
                className="bio-card"
                style={{
                  padding: '20px',
                  backgroundColor: '#FFFFFF',
                  borderLeft: '4px solid var(--forest)',
                  cursor: 'pointer',
                  boxShadow: userDirectoryFilter === 'students' ? '0 0 0 2px var(--forest)' : 'var(--shadow-card)'
                }}
                title="Filter by Student Members"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Student Members
                  </span>
                  <Users size={18} color="var(--forest)" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--forest-dark)' }}>
                  {studentUsers.length}
                </div>
                <span style={{ fontSize: '0.74rem', color: 'var(--sage)' }}>Active registered library members</span>
              </div>

              {/* Card 2: Librarian Staff Team */}
              <div
                onClick={() => setUserDirectoryFilter('librarians')}
                className="bio-card"
                style={{
                  padding: '20px',
                  backgroundColor: '#FFFFFF',
                  borderLeft: '4px solid var(--botanical)',
                  cursor: 'pointer',
                  boxShadow: userDirectoryFilter === 'librarians' ? '0 0 0 2px var(--botanical)' : 'var(--shadow-card)'
                }}
                title="Filter by Librarian Staff Team"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Librarian Staff
                  </span>
                  <Layers size={18} color="var(--botanical)" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--forest-dark)' }}>
                  {librarianUsers.length}
                </div>
                <span style={{ fontSize: '0.74rem', color: 'var(--botanical)' }}>Circulation desk & operations team</span>
              </div>

              {/* Card 3: Administrators */}
              <div
                onClick={() => setUserDirectoryFilter('admins')}
                className="bio-card"
                style={{
                  padding: '20px',
                  backgroundColor: '#FFFFFF',
                  borderLeft: '4px solid #C5221F',
                  cursor: 'pointer',
                  boxShadow: userDirectoryFilter === 'admins' ? '0 0 0 2px #C5221F' : 'var(--shadow-card)'
                }}
                title="Filter by System Administrators"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Administrators
                  </span>
                  <Shield size={18} color="#C5221F" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#C5221F' }}>
                  {adminUsers.length}
                </div>
                <span style={{ fontSize: '0.74rem', color: '#8C1D18' }}>Master security & system governance</span>
              </div>

              {/* Card 4: Total Books on Loan */}
              <div className="bio-card" style={{ padding: '20px', backgroundColor: '#FFFFFF', borderLeft: '4px solid #B25E1A' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Active Loans
                  </span>
                  <Database size={18} color="#B25E1A" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#B25E1A' }}>
                  {totalActiveLoans}
                </div>
                <span style={{ fontSize: '0.74rem', color: 'var(--muted-text)' }}>Books currently borrowed by members</span>
              </div>
            </div>

            {/* User & Staff Directory Panel */}
            <div className="bio-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--forest-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={20} color="var(--forest)" />
                    User & Librarian Governance ({filteredUsers.length})
                  </h3>
                  <span style={{ fontSize: '0.84rem', color: 'var(--muted-text)' }}>
                    Monitor user accounts, oversee the librarian team, dispatch official memos, and control security privileges.
                  </span>
                </div>

                <button
                  onClick={() => setShowAddLibrarianModal(true)}
                  className="btn btn-primary btn-sm"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 18px',
                    fontWeight: 600,
                    fontSize: '0.86rem',
                    backgroundColor: '#A51D24',
                    borderColor: '#8C1D18',
                    boxShadow: '0 2px 8px rgba(165, 29, 36, 0.25)'
                  }}
                >
                  <UserPlus size={16} />
                  + Add New Librarian
                </button>
              </div>

              {/* Sub-Filter Tabs & Search Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                {/* Filter Pills */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'all', label: `All Accounts (${users.length})` },
                    { id: 'students', label: `Student Members (${studentUsers.length})` },
                    { id: 'librarians', label: `Librarian Staff (${librarianUsers.length})` },
                    { id: 'admins', label: `Administrators (${adminUsers.length})` }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setUserDirectoryFilter(f.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.82rem',
                        fontWeight: userDirectoryFilter === f.id ? 700 : 500,
                        border: userDirectoryFilter === f.id ? '1px solid var(--forest)' : '1px solid var(--subtle-border)',
                        backgroundColor: userDirectoryFilter === f.id ? 'var(--soft-sage-light)' : '#FFFFFF',
                        color: userDirectoryFilter === f.id ? 'var(--forest-dark)' : 'var(--muted-text)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div style={{ position: 'relative', width: '280px' }}>
                  <Search size={15} color="var(--muted-text)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search by name, email, ID..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '7px 12px 7px 32px',
                      borderRadius: '8px',
                      border: '1px solid var(--subtle-border)',
                      fontSize: '0.84rem'
                    }}
                  />
                  {userSearchQuery && (
                    <button
                      onClick={() => setUserSearchQuery('')}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--muted-text)',
                        padding: 0
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--cream)', borderBottom: '1px solid var(--subtle-border)' }}>
                      <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--forest-dark)' }}>User / Staff Name</th>
                      <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--forest-dark)' }}>Email Address</th>
                      <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--forest-dark)' }}>Membership / Staff ID</th>
                      <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--forest-dark)' }}>Borrowing / Assigned Duties</th>
                      <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--forest-dark)' }}>System Role</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right', color: 'var(--forest-dark)' }}>Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--muted-text)' }}>
                          No accounts found matching the current search or filter.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid rgba(52, 78, 65, 0.08)' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--forest-dark)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div
                                style={{
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '50%',
                                  backgroundColor: u.role === 'admin' ? '#FCE8E6' : u.role === 'librarian' ? 'var(--soft-sage-light)' : 'var(--cream)',
                                  color: u.role === 'admin' ? '#C5221F' : u.role === 'librarian' ? 'var(--forest)' : 'var(--muted-text)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.78rem',
                                  fontWeight: 800
                                }}
                              >
                                {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div>
                                <div>{u.name}</div>
                                {u.created_at && (
                                  <span style={{ fontSize: '0.70rem', color: 'var(--muted-text)', fontWeight: 400 }}>
                                    Registered: {new Date(u.created_at).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px', color: 'var(--muted-text)' }}>
                            {u.email}
                          </td>
                          <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 600 }}>
                            <span style={{
                              backgroundColor: u.role === 'librarian' ? 'var(--soft-sage-light)' : u.role === 'admin' ? '#FCE8E6' : 'var(--cream)',
                              color: u.role === 'librarian' ? 'var(--forest-dark)' : u.role === 'admin' ? '#C5221F' : 'var(--forest-dark)',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.80rem'
                            }}>
                              {u.membership_id}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            {u.role === 'librarian' ? (
                              <div style={{ fontSize: '0.78rem', color: 'var(--forest)' }}>
                                <span style={{ fontWeight: 600 }}>Specialty:</span> {u.interests || 'Circulation Desk, Book Curation'}
                              </div>
                            ) : u.role === 'admin' ? (
                              <span style={{ fontSize: '0.78rem', color: '#C5221F', fontWeight: 600 }}>
                                Master Security Governance
                              </span>
                            ) : (
                              <span style={{
                                fontSize: '0.80rem',
                                fontWeight: u.active_loans > 0 ? 700 : 500,
                                color: u.active_loans > 0 ? 'var(--botanical)' : 'var(--muted-text)'
                              }}>
                                {u.active_loans || 0} book{(u.active_loans || 0) === 1 ? '' : 's'} borrowed
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            {u.id === user?.id ? (
                              <span className="badge badge-danger" style={{ textTransform: 'capitalize', fontWeight: 600 }}>
                                {u.role} (Current)
                              </span>
                            ) : (
                              <select
                                value={u.role}
                                disabled={updatingRoleId === u.id}
                                onChange={(e) => handleRoleChange(u, e.target.value)}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.82rem',
                                  fontWeight: 600,
                                  backgroundColor: u.role === 'admin' ? '#FCE8E6' : u.role === 'librarian' ? 'var(--soft-sage-light)' : 'var(--cream)',
                                  color: u.role === 'admin' ? '#C5221F' : 'var(--forest-dark)',
                                  border: '1px solid var(--subtle-border)',
                                  cursor: updatingRoleId === u.id ? 'wait' : 'pointer'
                                }}
                              >
                                <option value="student">Student Member</option>
                                <option value="librarian">Librarian Staff</option>
                                <option value="admin">Administrator</option>
                              </select>
                            )}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                              {/* Message User/Staff Button */}
                              <button
                                onClick={() => handleOpenMessageModal(u)}
                                className="btn btn-sm"
                                style={{
                                  padding: '5px 12px',
                                  fontSize: '0.80rem',
                                  color: u.role === 'librarian' ? 'var(--botanical)' : 'var(--forest)',
                                  border: '1px solid var(--subtle-border)',
                                  backgroundColor: '#FFFFFF',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  borderRadius: '6px',
                                  cursor: 'pointer'
                                }}
                                title={`Send direct memo or message to ${u.name} (${u.role})`}
                              >
                                <MessageSquare size={13} />
                                {u.role === 'librarian' ? 'Message Staff' : 'Message'}
                              </button>

                              {/* Delete User/Staff Button */}
                              {u.id !== user?.id && u.email !== user?.email ? (
                                <button
                                  onClick={() => handleDeleteUser(u)}
                                  disabled={deletingUserId === u.id}
                                  className="btn btn-sm"
                                  style={{
                                    padding: '5px 12px',
                                    fontSize: '0.80rem',
                                    color: '#C5221F',
                                    border: '1px solid #FAD2CF',
                                    backgroundColor: '#FCE8E6',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    borderRadius: '6px',
                                    cursor: deletingUserId === u.id ? 'not-allowed' : 'pointer'
                                  }}
                                  title={`Permanently delete ${u.role} account ${u.name}`}
                                >
                                  <Trash2 size={13} />
                                  {deletingUserId === u.id ? 'Deleting...' : 'Delete'}
                                </button>
                              ) : (
                                <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', fontStyle: 'italic', paddingRight: '6px' }}>
                                  Current Admin
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 4: Sent Messages Log */}
      {activeTab === 'messages' && (
        sentMessages.length > 0 ? (
        <div className="bio-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', marginTop: '36px' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={20} color="var(--forest)" />
            Messages Sent in this Session ({sentMessages.length})
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {sentMessages.map(msg => (
              <div
                key={msg.id}
                style={{
                  padding: '14px 18px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--cream)',
                  border: '1px solid var(--subtle-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-category" style={{ fontSize: '0.72rem', textTransform: 'capitalize' }}>
                      {msg.type}
                    </span>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--forest-dark)' }}>
                      {msg.title}
                    </strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>
                      → Delivered to {msg.recipient} ({msg.email})
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--dark-text)' }}>
                    {msg.message}
                  </p>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', whiteSpace: 'nowrap' }}>
                  {msg.sentAt}
                </span>
              </div>
            ))}
          </div>
        </div>
        ) : (
        <div className="bio-card" style={{ padding: '36px', backgroundColor: '#FFFFFF', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)', marginBottom: '8px' }}>
            No Broadcast Messages Dispatched
          </h3>
          <p style={{ color: 'var(--muted-text)', fontSize: '0.90rem', marginBottom: '16px' }}>
            No direct messages have been sent in this active administrator session.
          </p>
          <button
            onClick={() => { setActiveTab('users'); if (onNavigate) onNavigate('admin', { tab: 'users' }); }}
            className="btn btn-primary btn-sm"
          >
            Go to User Directory to Message Users →
          </button>
        </div>
        )
      )}

      {/* TAB 5: Audit Trail */}
      {activeTab === 'audit' && (
      <div className="bio-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={20} color="var(--forest)" />
              System Audit Trail & Security Logs ({auditLogs.length})
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--muted-text)' }}>
              Immutable record of borrowing, returns, holds, messages, and role changes.
            </span>
          </div>

          <button
            onClick={handleRunScheduler}
            disabled={triggeringCron}
            className="btn btn-primary btn-sm"
          >
            {triggeringCron ? 'Running Due-Date & Expiry Cycle...' : 'Run Due-Date & Expiry Scheduler Now'}
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--cream)', borderBottom: '1px solid var(--subtle-border)' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--forest-dark)' }}>Timestamp</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--forest-dark)' }}>Action</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--forest-dark)' }}>Initiator</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--forest-dark)' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'var(--muted-text)' }}>
                    No administrative audit logs recorded yet.
                  </td>
                </tr>
              ) : (
                auditLogs.slice(0, 30).map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid rgba(52, 78, 65, 0.06)' }}>
                    <td style={{ padding: '10px 12px', color: 'var(--muted-text)', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--forest-dark)' }}>
                      {log.action}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      {log.user_name ? `${log.user_name} (${log.user_role})` : 'System / Guest'}
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--dark-text)' }}>
                      {log.details || 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
}
