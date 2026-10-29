import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import {
  Armchair,
  Zap,
  Monitor,
  Clock,
  Calendar,
  Check,
  AlertCircle,
  Filter,
  Layers,
  ShieldAlert,
  X,
  Lock
} from 'lucide-react';

export default function SeatAvailability({ onNavigate }) {
  const { user } = useAuth();
  const [seats, setSeats] = useState([]);
  const [stats, setStats] = useState({ total: 0, available: 0, occupied: 0, reserved: 0, maintenance: 0 });
  const [selectedFloor, setSelectedFloor] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('All');
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Booking Modal State
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingSlot, setBookingSlot] = useState('08:00 - 11:00 (Morning Focus)');
  const [seatSlots, setSeatSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [myBookings, setMyBookings] = useState([]);

  const timeSlots = [
    '08:00 - 11:00 (Morning Focus)',
    '11:00 - 14:00 (Mid-day Reading)',
    '14:00 - 17:00 (Afternoon Study)',
    '17:00 - 20:00 (Evening Pod)',
    '20:00 - 22:00 (Night Owl)'
  ];

  const fetchSeats = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        floor: selectedFloor,
        section: selectedSection
      };
      if (selectedSlot !== 'All') {
        params.date = selectedDate;
        params.time_slot = selectedSlot;
      }
      const data = await api.getSeats(params);
      const seatsList = Array.isArray(data) ? data : (data.seats || []);
      setSeats(seatsList);
      setStats(data.stats || {
        total: seatsList.length,
        available: seatsList.filter(s => s.effective_status === 'available').length,
        occupied: seatsList.filter(s => s.effective_status === 'occupied').length,
        reserved: seatsList.filter(s => s.effective_status === 'reserved').length,
        maintenance: seatsList.filter(s => s.effective_status === 'maintenance').length
      });
    } catch (err) {
      console.error('Failed to load seats', err);
    } finally {
      setLoading(false);
    }
  }, [selectedFloor, selectedSection, selectedDate, selectedSlot]);

  const fetchMyBookings = useCallback(async () => {
    if (!user) return;
    try {
      const bookings = await api.getMySeatBookings();
      setMyBookings(bookings || []);
    } catch (err) {
      console.error('Bookings load error', err);
    }
  }, [user]);

  useEffect(() => {
    fetchSeats();
  }, [fetchSeats]);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  // Fetch slot availability whenever selected seat or booking date changes
  useEffect(() => {
    if (selectedSeat) {
      setLoadingSlots(true);
      api.getSeatSlots(selectedSeat.id, bookingDate)
        .then(res => {
          const slots = res.slots || [];
          setSeatSlots(slots);
          // If the currently selected slot is not available, default to first available
          const currentSlot = slots.find(s => s.slot === bookingSlot);
          if (!currentSlot || !currentSlot.isAvailable) {
            const firstAvail = slots.find(s => s.isAvailable);
            if (firstAvail) {
              setBookingSlot(firstAvail.slot);
            }
          }
        })
        .catch(err => {
          console.warn('Slot endpoint fallback:', err);
          const fallbackSlots = timeSlots.map(slot => ({
            slot,
            isAvailable: selectedSeat.status !== 'maintenance',
            isMaintenance: selectedSeat.status === 'maintenance',
            isBooked: false
          }));
          setSeatSlots(fallbackSlots);
        })
        .finally(() => {
          setLoadingSlots(false);
        });
    }
  }, [selectedSeat, bookingDate]);

  const showToast = (msg, isError = false) => {
    setToastMessage({ msg, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleBookSeat = async (e) => {
    e.preventDefault();
    if (!user) {
      onNavigate('login');
      return;
    }

    try {
      await api.reserveSeat({
        seat_id: selectedSeat.id,
        date: bookingDate,
        time_slot: bookingSlot
      });
      showToast(`Reserved ${selectedSeat.seat_number} for ${bookingDate} (${bookingSlot})!`);
      setSelectedSeat(null);
      fetchSeats();
      fetchMyBookings();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await api.cancelSeatReservation(bookingId);
      showToast('Study seat reservation successfully released.');
      fetchSeats();
      fetchMyBookings();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleLibrarianToggleStatus = async (seatId, newStatus) => {
    try {
      await api.updateSeatStatus(seatId, { status: newStatus });
      showToast(`Seat status updated to ${newStatus}`);
      fetchSeats();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const isLibrarianOrAdmin = user && (user.role === 'librarian' || user.role === 'admin');

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
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--forest-dark)', marginBottom: '8px' }}>
          Study Pods & Seat Availability
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--muted-text)', maxWidth: '680px' }}>
          Experience nature-infused reading quietude. Check live vacancy across Floor 1 and Floor 2, review power outlet and monitor setups, and reserve your study slot.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}
      >
        <div className="bio-card" style={{ padding: '20px', backgroundColor: '#FFFFFF', borderLeft: '4px solid var(--botanical)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted-text)', textTransform: 'uppercase' }}>Available Seats</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-available-text)', marginTop: '4px' }}>
            {stats.available}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--sage)' }}>Ready for immediate walk-in</span>
        </div>

        <div className="bio-card" style={{ padding: '20px', backgroundColor: '#FFFFFF', borderLeft: '4px solid #B25E1A' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted-text)', textTransform: 'uppercase' }}>Occupied Seats</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-borrowed-text)', marginTop: '4px' }}>
            {stats.occupied}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>Students currently studying</span>
        </div>

        <div className="bio-card" style={{ padding: '20px', backgroundColor: '#FFFFFF', borderLeft: '4px solid var(--forest)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted-text)', textTransform: 'uppercase' }}>Total Capacity</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--forest-dark)', marginTop: '4px' }}>
            {stats.total}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>Across 2 biophilic floors</span>
        </div>

        <div className="bio-card" style={{ padding: '20px', backgroundColor: '#FFFFFF', borderLeft: '4px solid var(--sage)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted-text)', textTransform: 'uppercase' }}>Occupancy Rate</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--forest-dark)', marginTop: '4px' }}>
            {stats.total > 0 ? Math.round((stats.occupied / stats.total) * 100) : 0}%
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>Healthy calm density</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        className="bio-card"
        style={{
          padding: '16px 20px',
          marginBottom: '28px',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        {/* Floor selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--forest-dark)' }}>Floor:</span>
          {['All', 'Floor 1', 'Floor 2'].map(f => (
            <button
              key={f}
              onClick={() => setSelectedFloor(f)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid',
                borderColor: selectedFloor === f ? 'var(--forest)' : 'var(--subtle-border)',
                backgroundColor: selectedFloor === f ? 'var(--forest)' : '#FFFFFF',
                color: selectedFloor === f ? '#FFFFFF' : 'var(--muted-text)',
                fontSize: '0.84rem',
                fontWeight: selectedFloor === f ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Section selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--forest-dark)' }}>Section:</span>
          {[
            { id: 'All', label: 'All Sections' },
            { id: 'Quiet Study Zone', label: 'Quiet Zone' },
            { id: 'Collaborative Hub', label: 'Collaborative Hub' },
            { id: 'Garden Window Pods', label: 'Garden Pods' },
            { id: 'Research Nook', label: 'Research Nook' }
          ].map(sec => (
            <button
              key={sec.id}
              onClick={() => setSelectedSection(sec.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: selectedSection === sec.id ? 'var(--botanical)' : 'var(--subtle-border)',
                backgroundColor: selectedSection === sec.id ? 'var(--soft-sage)' : '#FFFFFF',
                color: selectedSection === sec.id ? 'var(--forest-dark)' : 'var(--muted-text)',
                fontSize: '0.8rem',
                fontWeight: selectedSection === sec.id ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Date and Time Slot specific availability checker */}
        <div
          style={{
            paddingTop: '16px',
            borderTop: '1px solid var(--subtle-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            width: '100%'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} color="var(--forest)" />
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--forest-dark)' }}>Check Slot Vacancy:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid var(--subtle-border)',
                fontSize: '0.84rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
            <Clock size={16} color="var(--botanical)" />
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid var(--subtle-border)',
                fontSize: '0.84rem',
                flex: 1
              }}
            >
              <option value="All">All Time Slots (General Status)</option>
              {timeSlots.map((ts, idx) => (
                <option key={idx} value={ts}>{ts}</option>
              ))}
            </select>
          </div>

          <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>
            *Occupancy reflects confirmed slot reservations and desk status.
          </span>
        </div>
      </div>

      {/* Interactive Visual Seat Map Grid */}
      <div style={{ marginBottom: '48px' }}>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)', marginBottom: '16px' }}>
          Interactive Seat Layout ({seats.length} units displayed) {selectedSlot !== 'All' ? `— Slot: ${selectedSlot} (${selectedDate})` : ''}
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '20px'
          }}
        >
          {seats.map(seat => {
            const effStatus = seat.effective_status || seat.status;
            const isAvailable = effStatus === 'available';
            const isReserved = effStatus === 'reserved';
            const isOccupied = effStatus === 'occupied';
            const isMaintenance = effStatus === 'maintenance';

            return (
              <div
                key={seat.id}
                className="bio-card"
                style={{
                  padding: '20px',
                  backgroundColor: '#FFFFFF',
                  borderTop: `4px solid ${
                    isAvailable ? 'var(--botanical)' : isReserved ? '#D97706' : isOccupied ? '#B25E1A' : '#999999'
                  }`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: isAvailable ? 'var(--status-available-bg)' : isReserved ? '#FEF3C7' : 'var(--status-borrowed-bg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Armchair
                        size={20}
                        color={isAvailable ? 'var(--status-available-text)' : isReserved ? '#92400E' : 'var(--status-borrowed-text)'}
                      />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--forest-dark)' }}>
                        {seat.seat_number}
                      </h4>
                      <span style={{ fontSize: '0.74rem', color: 'var(--muted-text)' }}>
                        {seat.floor}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`badge ${
                      isAvailable ? 'badge-available' : isReserved ? 'badge-borrowed' : isOccupied ? 'badge-borrowed' : 'badge-danger'
                    }`}
                  >
                    ● {isAvailable ? 'Available' : isReserved ? 'Slot Booked' : isOccupied ? 'Occupied' : 'Maintenance'}
                  </span>
                </div>

                <div style={{ fontSize: '0.84rem', color: 'var(--forest-dark)', fontWeight: 600 }}>
                  {seat.section}
                </div>

                {/* Features (Power, Monitor) */}
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.78rem', color: 'var(--muted-text)' }}>
                  {seat.has_power ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--forest-dark)' }}>
                      <Zap size={14} color="var(--botanical)" /> Power Outlet
                    </span>
                  ) : (
                    <span>No Outlet</span>
                  )}
                  {seat.has_monitor ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--forest-dark)' }}>
                      <Monitor size={14} color="var(--forest)" /> Monitor Display
                    </span>
                  ) : null}
                </div>

                {/* Action button */}
                <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                  {isAvailable ? (
                    <button
                      onClick={() => {
                        setSelectedSeat(seat);
                        if (selectedDate) setBookingDate(selectedDate);
                        if (selectedSlot !== 'All') setBookingSlot(selectedSlot);
                      }}
                      className="btn btn-botanical btn-sm"
                      style={{ width: '100%' }}
                    >
                      Reserve This Seat
                    </button>
                  ) : isReserved ? (
                    <button
                      disabled
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', opacity: 0.7, cursor: 'not-allowed' }}
                    >
                      Reserved for Time Slot
                    </button>
                  ) : (
                    <button
                      disabled
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', opacity: 0.7, cursor: 'not-allowed' }}
                    >
                      {isMaintenance ? 'Under Maintenance' : 'Currently In Use'}
                    </button>
                  )}

                  {/* Librarian Override Controls */}
                  {isLibrarianOrAdmin && (
                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                      <button
                        onClick={() => handleLibrarianToggleStatus(seat.id, isAvailable ? 'occupied' : 'available')}
                        style={{
                          flex: 1,
                          fontSize: '0.72rem',
                          padding: '4px',
                          border: '1px solid var(--subtle-border)',
                          borderRadius: '4px',
                          backgroundColor: '#FAF5EC',
                          cursor: 'pointer'
                        }}
                      >
                        Toggle {isAvailable ? 'Occupied' : 'Free'}
                      </button>
                      <button
                        onClick={() => handleLibrarianToggleStatus(seat.id, 'maintenance')}
                        style={{
                          fontSize: '0.72rem',
                          padding: '4px 8px',
                          border: '1px solid var(--subtle-border)',
                          borderRadius: '4px',
                          backgroundColor: '#FFF',
                          cursor: 'pointer'
                        }}
                      >
                        Maint.
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student's Active Seat Bookings */}
      {user && myBookings.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)', marginBottom: '16px' }}>
            Your Upcoming Seat Bookings
          </h3>
          <div
            className="bio-card"
            style={{ backgroundColor: '#FFFFFF', padding: '16px' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {myBookings.map(b => (
                <div
                  key={b.id}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--soft-sage-light)',
                    border: '1px solid var(--soft-sage)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <strong style={{ color: 'var(--forest-dark)', fontSize: '1rem' }}>{b.seat_number}</strong>
                    <span className="badge badge-available">Confirmed</span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--muted-text)', marginBottom: '4px' }}>
                    {b.floor} • {b.section}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--dark-text)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <Clock size={14} color="var(--botanical)" />
                    {b.date} • {b.time_slot}
                  </div>
                  {b.status === 'active' && (
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      className="btn btn-outline btn-sm"
                      style={{
                        color: '#C5221F',
                        borderColor: '#C5221F',
                        fontSize: '0.76rem',
                        padding: '4px 8px',
                        width: '100%',
                        marginTop: '4px'
                      }}
                    >
                      Release / Cancel Booking
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Seat Booking Modal */}
      {selectedSeat && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(35, 52, 43, 0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            overflowY: 'auto'
          }}
          onClick={() => setSelectedSeat(null)}
        >
          <div
            className="bio-card"
            style={{
              width: '540px',
              maxWidth: '94vw',
              maxHeight: '90vh',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.28)',
              overflow: 'hidden',
              margin: 'auto',
              animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--subtle-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                backgroundColor: 'var(--cream)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span
                    style={{
                      backgroundColor: 'var(--forest)',
                      color: '#FFFFFF',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}
                  >
                    POD {selectedSeat.seat_number}
                  </span>
                  <span style={{ fontSize: '0.84rem', color: 'var(--forest-dark)', fontWeight: 600 }}>
                    {selectedSeat.floor} • {selectedSeat.section}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--forest-dark)' }}>
                  Reserve Study Seat
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSeat(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted-text)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px'
                }}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleBookSeat} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                {/* Date Selection */}
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ fontWeight: 600, color: 'var(--forest-dark)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Date of Study</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)', fontWeight: 400 }}>
                      Choose your study day
                    </span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={bookingDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                    style={{ width: '100%', fontSize: '0.95rem', padding: '10px 14px' }}
                  />
                </div>

                {/* Time Slot Selection Menu */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontWeight: 600, color: 'var(--forest-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span>Select Time Slot on {bookingDate}</span>
                    {loadingSlots && (
                      <span style={{ fontSize: '0.76rem', color: 'var(--botanical)' }}>
                        Checking slot availability...
                      </span>
                    )}
                  </label>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {timeSlots.map((ts, idx) => {
                      const slotInfo = seatSlots.find(s => s.slot === ts);
                      const isAvail = slotInfo ? slotInfo.isAvailable : true;
                      const isBooked = slotInfo ? slotInfo.isBooked : false;
                      const isSelected = bookingSlot === ts;

                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            if (isAvail) setBookingSlot(ts);
                          }}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '10px',
                            border: isSelected ? '2px solid var(--forest)' : '1px solid var(--subtle-border)',
                            backgroundColor: isSelected
                              ? 'var(--soft-sage-light)'
                              : isBooked
                              ? '#F5F5F5'
                              : '#FFFFFF',
                            cursor: isAvail ? 'pointer' : 'not-allowed',
                            opacity: isAvail ? 1 : 0.65,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                border: isSelected ? '5px solid var(--forest)' : '2px solid var(--muted-text)',
                                backgroundColor: '#FFFFFF',
                                flexShrink: 0
                              }}
                            />
                            <div>
                              <strong style={{ fontSize: '0.9rem', color: isSelected ? 'var(--forest-dark)' : 'var(--dark-text)', display: 'block' }}>
                                {ts}
                              </strong>
                              <span style={{ fontSize: '0.74rem', color: 'var(--muted-text)' }}>
                                {isBooked ? 'Booked by another student at this time' : isAvail ? 'Available for booking' : 'Slot unavailable'}
                              </span>
                            </div>
                          </div>

                          <div>
                            {isBooked ? (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  color: '#C5221F',
                                  backgroundColor: '#FCE8E6',
                                  padding: '3px 8px',
                                  borderRadius: '6px'
                                }}
                              >
                                <Lock size={12} /> Reserved
                              </span>
                            ) : (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  color: 'var(--botanical)',
                                  backgroundColor: 'var(--soft-sage)',
                                  padding: '3px 8px',
                                  borderRadius: '6px'
                                }}
                              >
                                <Check size={12} /> Available
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Policy Notice Box */}
                <div
                  style={{
                    backgroundColor: 'var(--cream)',
                    border: '1px solid var(--subtle-border)',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: 'var(--dark-text)',
                    lineHeight: 1.45,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}
                >
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>💡</span>
                  <div>
                    <strong>Study Space Policy:</strong> A student can reserve 1 study pod per time slot. You are free to reserve this seat or other seats for different time slots on the same day.
                  </div>
                </div>
              </div>

              {/* Modal Fixed Footer Actions */}
              <div
                style={{
                  padding: '16px 24px',
                  borderTop: '1px solid var(--subtle-border)',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  gap: '12px'
                }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedSeat(null)}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '10px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-botanical"
                  style={{ flex: 2, padding: '10px' }}
                  disabled={loadingSlots || (seatSlots.find(s => s.slot === bookingSlot) && !seatSlots.find(s => s.slot === bookingSlot)?.isAvailable)}
                >
                  Confirm Reservation ({bookingSlot.split(' ')[0]})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
