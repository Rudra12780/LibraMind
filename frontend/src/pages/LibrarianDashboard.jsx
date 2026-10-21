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
  Layers
} from 'lucide-react';

export default function LibrarianDashboard({ onNavigate }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('issue'); // 'issue', 'return', 'reservations', 'inventory', 'seats', 'announcement'
  const [overview, setOverview] = useState(null);
  const [loans, setLoans] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [books, setBooks] = useState([]);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Form states
  // 1. Issue
  const [issueMemberId, setIssueMemberId] = useState('');
  const [issueCopyCode, setIssueCopyCode] = useState('');
  const [issueDays, setIssueDays] = useState('14');

  // 2. Add Book
  const [newBook, setNewBook] = useState({
    title: '', author: '', isbn: '', publisher: '', publication_year: 2024,
    category: 'Computer Science', edition: '1st Edition', language: 'English',
    floor: 'Floor 1', section: 'Tech & Engineering', shelf: 'Shelf CS-01', rack: 'Rack 01',
    total_copies: 1, description: '', cover_image: ''
  });

  // 3. Announcement
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');

  const fetchLibrarianData = useCallback(async () => {
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

  // Add Book Handler
  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await api.createBook(newBook);
      showToast(`Added "${newBook.title}" to catalog with ${newBook.total_copies} physical copies!`);
      setNewBook({
        title: '', author: '', isbn: '', publisher: '', publication_year: 2024,
        category: 'Computer Science', edition: '1st Edition', language: 'English',
        floor: 'Floor 1', section: 'Tech & Engineering', shelf: 'Shelf CS-01', rack: 'Rack 01',
        total_copies: 1, description: '', cover_image: ''
      });
      fetchLibrarianData();
    } catch (err) {
      showToast(err.message, true);
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

  const activeLoans = loans.filter(l => l.status === 'active' || l.status === 'overdue');

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

      {/* Operation Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          borderBottom: '2px solid var(--subtle-border)',
          marginBottom: '32px',
          paddingBottom: '2px'
        }}
      >
        {[
          { id: 'issue', label: 'Check Out (Issue)', icon: ArrowRightLeft },
          { id: 'return', label: `Returns & Overdue (${activeLoans.length})`, icon: RotateCcw },
          { id: 'reservations', label: `Hold Queues (${reservations.length})`, icon: Bookmark },
          { id: 'inventory', label: 'Add New Book', icon: Plus },
          { id: 'seats', label: 'Live Pod Status', icon: Armchair },
          { id: 'announcement', label: 'Send Announcement', icon: Megaphone }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === t.id ? '3px solid var(--forest)' : '3px solid transparent',
              color: activeTab === t.id ? 'var(--forest-dark)' : 'var(--muted-text)',
              fontSize: '0.92rem',
              fontWeight: activeTab === t.id ? 700 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

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
                    <td style={{ padding: '12px 14px', fontWeight: 600 }}>{r.book_title}</td>
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

      {/* TAB 4: Add New Book to Catalog */}
      {activeTab === 'inventory' && (
        <div style={{ maxWidth: '800px' }}>
          <div className="bio-card" style={{ padding: '30px', backgroundColor: '#FFFFFF' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--forest-dark)', marginBottom: '8px' }}>
              Catalog New Book & Physical Stacks
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', marginBottom: '24px' }}>
              Add a new book with precise shelf and rack coordinates. Physical copy records will be created automatically.
            </p>

            <form onSubmit={handleAddBook}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Book Title *</label>
                  <input
                    type="text"
                    className="form-control"
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
                    <option value="Emotional Fiction">Emotional Fiction</option>
                    <option value="Inspirational & Positivity">Inspirational & Positivity</option>
                    <option value="Classic Literature">Classic Literature</option>
                    <option value="Personal Growth & Positivity">Personal Growth & Positivity</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Programming">Programming</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Web Development">Web Development</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Publisher</label>
                  <input
                    type="text"
                    className="form-control"
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
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Section</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newBook.section}
                    onChange={(e) => setNewBook({ ...newBook, section: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Shelf Code</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Shelf CS-01"
                    value={newBook.shelf}
                    onChange={(e) => setNewBook({ ...newBook, shelf: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Rack Unit</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rack 02"
                    value={newBook.rack}
                    onChange={(e) => setNewBook({ ...newBook, rack: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Physical Copies</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={newBook.total_copies}
                    onChange={(e) => setNewBook({ ...newBook, total_copies: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cover Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://..."
                    value={newBook.cover_image}
                    onChange={(e) => setNewBook({ ...newBook, cover_image: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '10px' }}>
                <label className="form-label">Description / Summary</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={newBook.description}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginTop: '20px', padding: '12px 24px' }}
              >
                Catalog Book & Generate Barcodes
              </button>
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
    </div>
  );
}
