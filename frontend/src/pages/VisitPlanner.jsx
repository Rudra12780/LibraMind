import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  CheckSquare,
  Square,
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
      <div style={{ backgroundColor: 'var(--editorial-bg)', minHeight: '80vh', padding: '60px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            maxWidth: '500px',
            padding: '40px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--editorial-border)',
            boxShadow: 'var(--shadow-xl)',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              backgroundColor: 'var(--editorial-border)',
              border: '1px solid var(--editorial-border)',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}
          >
            <Compass size={28} color="var(--editorial-text)" strokeWidth={2.4} />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--editorial-text)', marginBottom: '8px' }}>
            Sign In to Plan Your Visit
          </h3>
          <p style={{ margin: '0 auto 20px', fontSize: '0.92rem', color: 'var(--editorial-text)', opacity: 0.85, fontWeight: 500 }}>
            My Library Visit Planner lets you save a checklist of books, view shelf coordinates by floor, and verify study-pod seats before walking into the stacks.
          </p>
          <button onClick={() => onNavigate('login')} className="btn btn-primary">
            Sign In to Account →
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
    <div style={{ backgroundColor: 'var(--editorial-bg)', minHeight: '85vh', padding: '40px 24px 80px' }}>
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Toast Alert */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              bottom: '30px',
              right: '30px',
              backgroundColor: toastMessage.isError ? 'var(--editorial-accent)' : 'var(--editorial-border)',
              color: toastMessage.isError ? '#FFFFFF' : 'var(--editorial-text)',
              border: '1px solid var(--editorial-border)',
              boxShadow: 'var(--shadow-card)',
              padding: '12px 20px',
              zIndex: 3000,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.88rem',
              fontWeight: 800,
              textTransform: 'uppercase'
            }}
          >
            {toastMessage.isError ? <AlertCircle size={18} strokeWidth={2.4} /> : <Check size={18} strokeWidth={2.4} />}
            <span>{toastMessage.msg}</span>
          </div>
        )}

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'var(--editorial-border)',
                color: 'var(--editorial-text)',
                border: '1px solid var(--editorial-border)',
                boxShadow: 'var(--shadow-sm)',
                fontSize: '0.78rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '4px 10px',
                marginBottom: '8px'
              }}
            >
              <Compass size={15} strokeWidth={2.4} /> Physical Stacks Navigation
            </div>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', margin: '4px 0 8px' }}>
              My Library Visit Planner
            </h1>
            <p style={{ color: 'var(--editorial-text)', opacity: 0.85, fontSize: '1rem', margin: 0, maxWidth: '640px', fontWeight: 500 }}>
              Prepare your physical visit with an organized checklist grouped by Floor and Section. Verify whether a book must be reserved and check study seat vacancies in advance.
            </p>
          </div>

          {totalCount > 0 && (
            <button
              onClick={handleClear}
              className="btn btn-outline btn-sm"
              style={{ alignSelf: 'center' }}
            >
              Clear Checklist
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--editorial-text)', fontWeight: 800, textTransform: 'uppercase' }}>
            Loading your visit checklist and floor seat vacancy maps...
          </div>
        ) : totalCount === 0 ? (
          <div
            style={{
              padding: '48px 24px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--editorial-border)',
              boxShadow: 'var(--shadow-lg)',
              textAlign: 'center'
            }}
          >
            <div style={{ marginBottom: '14px' }}>
              <Compass size={36} color="var(--editorial-accent)" strokeWidth={2.4} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--editorial-text)', marginBottom: '8px' }}>
              Your Visit List is Empty
            </h3>
            <p style={{ maxWidth: '440px', margin: '0 auto 20px', fontSize: '0.92rem', color: 'var(--editorial-text)', opacity: 0.85, fontWeight: 500 }}>
              Add books to your visit planner from the Catalog to organize your trip through the library stacks.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => onNavigate('catalog')} className="btn btn-primary">
                Explore Catalog →
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
              <div
                style={{
                  padding: '24px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--editorial-border)',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 900, textTransform: 'uppercase', color: 'var(--editorial-text)', fontSize: '0.95rem' }}>
                    Visit Progress: {visitedCount} of {totalCount} Found
                  </span>
                  <span style={{ fontWeight: 900, color: 'var(--editorial-accent)', fontSize: '1.1rem' }}>
                    {progressPercent}%
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '10px',
                    backgroundColor: 'var(--editorial-bg-subtle)',
                    border: '1px solid var(--editorial-border)',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      width: `${progressPercent}%`,
                      height: '100%',
                      backgroundColor: 'var(--editorial-accent)',
                      transition: 'width 0.2s ease'
                    }}
                  />
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--editorial-text)', opacity: 0.8, marginTop: '8px', marginBottom: 0, fontWeight: 600 }}>
                  Check off items as you locate them on the physical racks.
                </p>
              </div>

              {/* Floor Seat Availability for your visit */}
              <div
                style={{
                  padding: '24px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--editorial-border)',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Armchair size={18} color="var(--editorial-text)" strokeWidth={2.4} />
                  <span style={{ fontWeight: 900, textTransform: 'uppercase', color: 'var(--editorial-text)', fontSize: '0.95rem' }}>
                    Floor Study Seats Glance
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {seatSummary.map((s, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'var(--editorial-bg-subtle)',
                        border: '1px solid var(--editorial-border)',
                        fontSize: '0.82rem',
                        fontWeight: 700
                      }}
                    >
                      <strong style={{ color: 'var(--editorial-text)', textTransform: 'uppercase' }}>{s.floor}: </strong>
                      <span style={{ color: 'var(--editorial-green)', fontWeight: 900 }}>
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
                    color: 'var(--editorial-accent)',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    marginTop: '12px',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  Reserve study pod for your visit →
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
                      paddingBottom: '10px',
                      borderBottom: '1px solid var(--editorial-border)',
                      marginBottom: '20px'
                    }}
                  >
                    <MapPin size={22} color="var(--editorial-accent)" strokeWidth={2.4} />
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
                      {floorName}
                    </h2>
                  </div>

                  {Object.keys(groupedByFloorMap[floorName]).map(sectionName => {
                    const sectionBooks = groupedByFloorMap[floorName][sectionName];
                    return (
                      <div key={sectionName} style={{ marginBottom: '24px' }}>
                        <div
                          style={{
                            fontSize: '0.88rem',
                            fontWeight: 900,
                            color: 'var(--editorial-text)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            marginBottom: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <span>Section: {sectionName}</span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--editorial-text)', opacity: 0.7, textTransform: 'none', fontWeight: 600 }}>
                            ({sectionBooks.length} book{sectionBooks.length > 1 ? 's' : ''})
                          </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                          {sectionBooks.map(book => (
                            <div
                              key={book.book_id}
                              style={{
                                padding: '18px',
                                backgroundColor: book.visited ? 'var(--editorial-bg-subtle)' : '#FFFFFF',
                                display: 'flex',
                                gap: '16px',
                                alignItems: 'flex-start',
                                border: '2.5px solid var(--editorial-text)',
                                boxShadow: book.visited ? '2px 2px 0px var(--editorial-text)' : '4px 4px 0px var(--editorial-text)',
                                borderLeft: book.visited ? '6px solid var(--editorial-border)' : '6px solid var(--editorial-accent)'
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
                                  color: book.visited ? 'var(--editorial-text)' : 'var(--editorial-text)',
                                  flexShrink: 0
                                }}
                              >
                                {book.visited ? <CheckSquare size={24} strokeWidth={2.4} color="var(--editorial-text)" /> : <Square size={24} strokeWidth={2.4} color="var(--editorial-text)" />}
                              </button>

                              {/* Book Info */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <h4
                                  style={{
                                    fontSize: '1.05rem',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    color: 'var(--editorial-text)',
                                    marginBottom: '4px',
                                    textDecoration: book.visited ? 'line-through' : 'none',
                                    lineHeight: 1.3
                                  }}
                                >
                                  {book.title}
                                </h4>
                                <p style={{ fontSize: '0.84rem', color: 'var(--editorial-text)', opacity: 0.85, marginBottom: '8px', fontWeight: 600 }}>
                                  by {book.author}
                                </p>

                                {/* Shelf Coordinates Pill */}
                                <div
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '4px 8px',
                                    backgroundColor: 'var(--editorial-border)',
                                    border: '1px solid var(--editorial-text)',
                                    fontSize: '0.78rem',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    color: 'var(--editorial-text)',
                                    marginBottom: '8px'
                                  }}
                                >
                                  <MapPin size={13} color="var(--editorial-text)" strokeWidth={2.4} />
                                  <span>{book.shelf} • {book.rack}</span>
                                </div>

                                {/* Availability & Reservation Alert */}
                                <div style={{ marginBottom: '10px' }}>
                                  {book.available_copies > 0 ? (
                                    <span className="badge badge-available">
                                      ● {book.available_copies} of {book.total_copies} Available
                                    </span>
                                  ) : (
                                    <div>
                                      <span className="badge badge-borrowed" style={{ marginBottom: '6px', display: 'inline-block' }}>
                                        ● All Copies On Loan
                                      </span>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--editorial-accent)', fontSize: '0.78rem', fontWeight: 700 }}>
                                        <AlertTriangle size={13} strokeWidth={2.4} />
                                        <span>Must be reserved before visit</span>
                                        <button
                                          onClick={() => handleReserve(book.book_id)}
                                          style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--editorial-green)',
                                            fontWeight: 900,
                                            textDecoration: 'underline',
                                            cursor: 'pointer',
                                            padding: 0,
                                            fontSize: '0.78rem'
                                          }}
                                        >
                                          Place Hold
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
                                      color: 'var(--editorial-green)',
                                      fontSize: '0.8rem',
                                      fontWeight: 800,
                                      textTransform: 'uppercase',
                                      cursor: 'pointer',
                                      padding: 0
                                    }}
                                  >
                                    Details →
                                  </button>
                                  <span style={{ color: 'var(--editorial-text)' }}>•</span>
                                  <button
                                    onClick={() => handleRemove(book.book_id)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: 'var(--editorial-accent)',
                                      fontSize: '0.8rem',
                                      fontWeight: 800,
                                      textTransform: 'uppercase',
                                      cursor: 'pointer',
                                      padding: 0,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '3px'
                                    }}
                                  >
                                    <Trash2 size={13} strokeWidth={2.4} /> Remove
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
    </div>
  );
}
