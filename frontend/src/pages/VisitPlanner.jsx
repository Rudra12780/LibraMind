import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  CheckCircle2,
  Circle,
  MapPin,
  Armchair,
  Trash2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Bookmark,
  Check,
  AlertCircle
} from 'lucide-react';

export default function VisitPlanner({ onViewBookDetails, onNavigate }) {
  const { user } = useAuth();
  const [plannerData, setPlannerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchPlanner = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.getVisitPlanner();
      setPlannerData(data);
    } catch (err) {
      console.error('Failed to fetch visit planner', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPlanner();
  }, [fetchPlanner]);

  const showToast = (msg, isError = false) => {
    setToastMessage({ msg, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggle = async (bookId) => {
    try {
      await api.toggleVisitPlannerItem(bookId);
      fetchPlanner();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleRemove = async (bookId) => {
    try {
      await api.removeFromVisitPlanner(bookId);
      showToast('Removed from your visit planner');
      fetchPlanner();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleClear = async () => {
    try {
      await api.clearVisitPlanner();
      showToast('Visit planner cleared');
      fetchPlanner();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleReserve = async (bookId) => {
    try {
      const res = await api.placeReservation(bookId);
      showToast(res.message || 'Hold placed successfully!');
      fetchPlanner();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div className="empty-state">
          <div className="empty-state-icon">
            <Compass size={32} />
          </div>
          <h3>Sign in to plan your library visit</h3>
          <p style={{ maxWidth: '440px', margin: '0 auto 20px', fontSize: '0.92rem' }}>
            My Library Visit Planner lets you save a checklist of books, view shelf coordinates by floor, and verify study-pod seats before walking into the stacks.
          </p>
          <button onClick={() => onNavigate('login')} className="btn btn-primary">
            Sign In to Account
          </button>
        </div>
      </div>
    );
  }

  const items = plannerData?.items || [];
  const groupedByFloorMap = plannerData?.groupedByFloorMap || (Array.isArray(plannerData?.groupedByFloor)
    ? plannerData.groupedByFloor.reduce((acc, fg) => {
        acc[fg.floor] = {};
        (fg.sections || []).forEach(sec => {
          acc[fg.floor][sec.section] = sec.books || [];
        });
        return acc;
      }, {})
    : (plannerData?.groupedByFloor || {}));
  const seatSummary = plannerData?.seatSummary || plannerData?.floorSeatsGlance || [];
  const totalCount = plannerData?.totalCount || 0;
  const visitedCount = plannerData?.visitedCount || 0;
  const progressPercent = totalCount > 0 ? Math.round((visitedCount / totalCount) * 100) : 0;

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
          {toastMessage.isError ? <AlertCircle size={18} /> : <Check size={18} />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--botanical)', fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <Compass size={16} /> Physical Stacks Navigation & Preparation
          </div>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--forest-dark)', marginTop: '4px', marginBottom: '8px' }}>
            My Library Visit Planner
          </h1>
          <p style={{ color: 'var(--muted-text)', fontSize: '1rem', margin: 0, maxWidth: '640px' }}>
            Prepare your physical visit with an organized checklist grouped by Floor and Section. Verify whether a book must be reserved and check study seat vacancies in advance.
          </p>
        </div>

        {totalCount > 0 && (
          <button
            onClick={handleClear}
            className="btn btn-outline btn-sm"
          >
            Clear Checklist
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted-text)' }}>
          Loading your visit checklist and floor seat vacancy maps...
        </div>
      ) : totalCount === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Compass size={32} />
          </div>
          <h3>Your visit list is empty</h3>
          <p style={{ maxWidth: '440px', margin: '0 auto 20px', fontSize: '0.92rem' }}>
            Add books to your visit planner from the Catalog or AI Book Finder to organize your trip through the library stacks.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => onNavigate('catalog')} className="btn btn-primary btn-sm">
              Explore Catalog
            </button>
            <button onClick={() => onNavigate('ai-finder')} className="btn btn-outline btn-sm">
              Use AI Book Finder
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Progress & Seat Summary Glance */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '36px'
            }}
          >
            {/* Checklist Progress */}
            <div className="bio-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: 700, color: 'var(--forest-dark)', fontSize: '1rem' }}>
                  Visit Progress: {visitedCount} of {totalCount} Books Found
                </span>
                <span style={{ fontWeight: 800, color: 'var(--botanical)', fontSize: '1.1rem' }}>
                  {progressPercent}%
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: 'var(--cream)',
                  borderRadius: '999px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    backgroundColor: 'var(--botanical)',
                    borderRadius: '999px',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted-text)', marginTop: '8px', marginBottom: 0 }}>
                Check off items as you locate them on the physical racks.
              </p>
            </div>

            {/* Floor Seat Availability for your visit */}
            <div className="bio-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Armchair size={18} color="var(--forest)" />
                <span style={{ fontWeight: 700, color: 'var(--forest-dark)', fontSize: '1rem' }}>
                  Floor Study Seats for Your Visit
                </span>
              </div>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {seatSummary.map((s, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--soft-sage-light)',
                      border: '1px solid var(--soft-sage)',
                      fontSize: '0.84rem'
                    }}
                  >
                    <strong style={{ color: 'var(--forest-dark)' }}>{s.floor}: </strong>
                    <span style={{ color: 'var(--botanical)', fontWeight: 600 }}>
                      {s.available_seats} of {s.total_seats} open
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onNavigate('seats')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--forest)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: '10px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Reserve study pod for your visit <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Grouped by Floor and Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {Object.keys(groupedByFloorMap).map(floorName => (
              <div key={floorName}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    paddingBottom: '12px',
                    borderBottom: '2px solid var(--forest)',
                    marginBottom: '20px'
                  }}
                >
                  <MapPin size={22} color="var(--forest)" />
                  <h2 style={{ fontSize: '1.5rem', color: 'var(--forest-dark)', margin: 0 }}>
                    {floorName}
                  </h2>
                </div>

                {Object.keys(groupedByFloorMap[floorName]).map(sectionName => {
                  const sectionBooks = groupedByFloorMap[floorName][sectionName];
                  return (
                    <div key={sectionName} style={{ marginBottom: '24px' }}>
                      <div
                        style={{
                          fontSize: '0.92rem',
                          fontWeight: 700,
                          color: 'var(--botanical)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          marginBottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>Section: {sectionName}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--muted-text)', textTransform: 'none' }}>
                          ({sectionBooks.length} book{sectionBooks.length > 1 ? 's' : ''})
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                        {sectionBooks.map(book => (
                          <div
                            key={book.book_id}
                            className="bio-card"
                            style={{
                              padding: '18px',
                              backgroundColor: book.visited ? 'rgba(243, 235, 221, 0.4)' : '#FFFFFF',
                              display: 'flex',
                              gap: '16px',
                              alignItems: 'flex-start',
                              borderLeft: book.visited ? '4px solid var(--botanical)' : '4px solid var(--sage)'
                            }}
                          >
                            {/* Checkbox */}
                            <button
                              onClick={() => handleToggle(book.book_id)}
                              title={book.visited ? 'Mark unvisited' : 'Mark found'}
                              aria-label={book.visited ? 'Mark unvisited' : 'Mark found'}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '2px',
                                color: book.visited ? 'var(--botanical)' : 'var(--muted-text)',
                                flexShrink: 0
                              }}
                            >
                              {book.visited ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                            </button>

                            {/* Book Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <h4
                                style={{
                                  fontSize: '1.02rem',
                                  color: 'var(--forest-dark)',
                                  marginBottom: '4px',
                                  textDecoration: book.visited ? 'line-through' : 'none',
                                  lineHeight: 1.3
                                }}
                              >
                                {book.title}
                              </h4>
                              <p style={{ fontSize: '0.84rem', color: 'var(--muted-text)', marginBottom: '8px' }}>
                                by {book.author}
                              </p>

                              {/* Shelf Coordinates Pill */}
                              <div
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  backgroundColor: 'var(--soft-sage-light)',
                                  fontSize: '0.8rem',
                                  fontWeight: 700,
                                  color: 'var(--forest-dark)',
                                  marginBottom: '8px'
                                }}
                              >
                                <MapPin size={13} color="var(--botanical)" />
                                <span>{book.shelf} • {book.rack}</span>
                              </div>

                              {/* Availability & Reservation Alert */}
                              <div style={{ marginBottom: '10px' }}>
                                {book.available_copies > 0 ? (
                                  <span className="badge badge-available">
                                    ● {book.available_copies} of {book.total_copies} Available on Shelf
                                  </span>
                                ) : (
                                  <div>
                                    <span className="badge badge-borrowed" style={{ marginBottom: '6px', display: 'inline-block' }}>
                                      ● All Copies On Loan
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#C5221F', fontSize: '0.78rem' }}>
                                      <AlertTriangle size={13} />
                                      <span>Must be reserved before visit</span>
                                      <button
                                        onClick={() => handleReserve(book.book_id)}
                                        style={{
                                          background: 'none',
                                          border: 'none',
                                          color: 'var(--forest)',
                                          fontWeight: 700,
                                          textDecoration: 'underline',
                                          cursor: 'pointer',
                                          padding: 0,
                                          fontSize: '0.78rem'
                                        }}
                                      >
                                        Place Hold Now
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <button
                                  onClick={() => onViewBookDetails(book.book_id)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--forest)',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    padding: 0
                                  }}
                                >
                                  View Details
                                </button>
                                <span style={{ color: 'var(--subtle-border)' }}>•</span>
                                <button
                                  onClick={() => handleRemove(book.book_id)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#C5221F',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                  }}
                                >
                                  <Trash2 size={13} /> Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
