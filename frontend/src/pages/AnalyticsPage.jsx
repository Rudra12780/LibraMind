import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import {
  BarChart3,
  TrendingUp,
  BookOpen,
  Armchair,
  Download,
  Layers,
  CheckCircle2,
  Bookmark,
  Users,
  RefreshCw,
  Library,
  ArrowRightLeft
} from 'lucide-react';

export default function AnalyticsPage() {
  const [chartsData, setChartsData] = useState(null);
  const [bookStats, setBookStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setRefreshing(true);
      const [chartsRes, statsRes] = await Promise.allSettled([
        api.getAnalyticsCharts(),
        api.getBookStatistics()
      ]);

      if (chartsRes.status === 'fulfilled') {
        setChartsData(chartsRes.value);
      } else {
        console.warn('Charts analytics fetch failed:', chartsRes.reason);
      }

      if (statsRes.status === 'fulfilled') {
        setBookStats(statsRes.value);
      } else {
        console.warn('Book statistics fetch failed:', statsRes.reason);
      }
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--editorial-bg)', minHeight: '80vh', padding: '60px 24px', textAlign: 'center', color: 'var(--editorial-text)', fontWeight: 700, textTransform: 'uppercase' }}>
        Calculating live copy statistics & circulation models...
      </div>
    );
  }

  // 5 Core Statistics extracted dynamically from MongoDB (with fallback if needed)
  const totalCopies = bookStats?.totalCopies ?? 0;
  const borrowedCopies = bookStats?.borrowedCopies ?? 0;
  const reservedCopies = bookStats?.reservedCopies ?? 0;
  const waitingCopies = bookStats?.waitingCopies ?? 0;
  const availableCopies = bookStats?.availableCopies ?? bookStats?.currentAvailableCopies ?? 0;

  const physicalSum = availableCopies + borrowedCopies + reservedCopies;
  const isBalanced = totalCopies === physicalSum;

  const categories = chartsData?.categories || [];
  const topBooks = chartsData?.topBooks || [];
  const seatUsage = chartsData?.seatUsage || [];
  const borrowingTrend = chartsData?.borrowingTrend || [];
  const demandForecast = chartsData?.demandForecast || [];

  return (
    <div style={{ backgroundColor: 'var(--editorial-bg)', minHeight: '85vh', padding: '40px 24px 80px' }}>
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px',
                backgroundColor: 'var(--editorial-border)',
                color: 'var(--editorial-text)',
                border: '1px solid var(--editorial-border)',
                boxShadow: 'var(--shadow-sm)',
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '8px'
              }}
            >
              <BarChart3 size={15} strokeWidth={2.4} /> Administrator Circulation Intelligence
            </div>
            <h1 style={{ fontSize: '2.4rem', color: 'var(--editorial-text)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.03em', margin: '4px 0 8px' }}>
              Library Inventory & Analytics
            </h1>
            <p style={{ color: 'var(--editorial-text)', opacity: 0.85, fontSize: '0.98rem', margin: 0, fontWeight: 500 }}>
              Real-time physical copy counts, circulation velocity, demand queues, and predictive models extracted from active MongoDB transactions.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={fetchData}
              disabled={refreshing}
              className="btn btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              title="Refresh statistics dynamically from database"
            >
              <RefreshCw size={15} className={refreshing ? 'spin' : ''} />
              <span>{refreshing ? 'Updating Counts...' : 'Refresh Statistics'}</span>
            </button>

            <a
              href={api.exportBooksCsvUrl()}
              className="btn btn-primary"
              download
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={15} strokeWidth={2.4} /> Export Catalog CSV
            </a>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 5 CORE DYNAMIC STATISTICS CARDS (Admin Requirement)         */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em', margin: 0, color: 'var(--editorial-text)' }}>
                Physical Copy Status & Demand Breakdown
              </h2>
              <span style={{ fontSize: '0.80rem', color: 'var(--editorial-text)', opacity: 0.75 }}>
                Categorized by active physical state. Categories are mutually exclusive.
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--editorial-text)', opacity: 0.7 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2E7D32', display: 'inline-block' }} />
              Live DB: {bookStats?.dataSource || 'MongoDB Atlas'} {lastRefreshed ? `• Updated ${lastRefreshed.toLocaleTimeString()}` : ''}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '16px',
              marginBottom: '16px'
            }}
          >
            {/* 1. Total Copies */}
            <div
              style={{
                backgroundColor: '#FFF8E9',
                border: '1px solid var(--editorial-border)',
                borderLeft: '5px solid var(--editorial-green)',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '6px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--editorial-accent)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    1. Total Copies
                  </span>
                  <div style={{ width: '30px', height: '30px', borderRadius: '8px', backgroundColor: 'var(--editorial-bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Layers size={16} color="var(--editorial-green)" />
                  </div>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--editorial-text)', lineHeight: 1 }}>
                  {totalCopies}
                </div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--editorial-text)', marginTop: '8px' }}>
                  Total Physical Copies
                </div>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '0.74rem', color: 'var(--editorial-text)', opacity: 0.75, lineHeight: 1.35 }}>
                All physical copies across all catalog volumes in the library collection.
              </p>
            </div>

            {/* 2. Borrowed Copies */}
            <div
              style={{
                backgroundColor: '#FFF8E9',
                border: '1px solid var(--editorial-border)',
                borderLeft: '5px solid #B25E1A',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '6px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#B25E1A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    2. Borrowed Copies
                  </span>
                  <div style={{ width: '30px', height: '30px', borderRadius: '8px', backgroundColor: 'rgba(178, 94, 26, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={16} color="#B25E1A" />
                  </div>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#B25E1A', lineHeight: 1 }}>
                  {borrowedCopies}
                </div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--editorial-text)', marginTop: '8px' }}>
                  Currently Borrowed
                </div>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '0.74rem', color: 'var(--editorial-text)', opacity: 0.75, lineHeight: 1.35 }}>
                Copies currently checked out and in the possession of library patrons.
              </p>
            </div>

            {/* 3. Reserved Copies */}
            <div
              style={{
                backgroundColor: '#FFF8E9',
                border: '1px solid var(--editorial-border)',
                borderLeft: '5px solid #C88719',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '6px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#C88719', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    3. Reserved Copies
                  </span>
                  <div style={{ width: '30px', height: '30px', borderRadius: '8px', backgroundColor: 'rgba(200, 135, 25, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bookmark size={16} color="#C88719" />
                  </div>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#C88719', lineHeight: 1 }}>
                  {reservedCopies}
                </div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--editorial-text)', marginTop: '8px' }}>
                  Reserved for Pickup
                </div>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '0.74rem', color: 'var(--editorial-text)', opacity: 0.75, lineHeight: 1.35 }}>
                Copies set aside and staged at the desk for members awaiting collection.
              </p>
            </div>

            {/* 4. Waiting Copies */}
            <div
              style={{
                backgroundColor: '#FFF8E9',
                border: '1px solid var(--editorial-border)',
                borderLeft: '5px solid #4A5568',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '6px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#4A5568', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    4. Waiting Copies
                  </span>
                  <div style={{ width: '30px', height: '30px', borderRadius: '8px', backgroundColor: 'rgba(74, 85, 104, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={16} color="#4A5568" />
                  </div>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#4A5568', lineHeight: 1 }}>
                  {waitingCopies}
                </div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--editorial-text)', marginTop: '8px' }}>
                  Active Waiting Requests
                </div>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '0.74rem', color: 'var(--editorial-text)', opacity: 0.75, lineHeight: 1.35 }}>
                Patrons in hold queue for out-of-stock items. Kept separate from copy counts.
              </p>
            </div>

            {/* 5. Current Available Copies */}
            <div
              style={{
                backgroundColor: '#FFF8E9',
                border: '1px solid var(--editorial-border)',
                borderLeft: '5px solid #2E7D32',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '6px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2E7D32', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    5. Available Copies
                  </span>
                  <div style={{ width: '30px', height: '30px', borderRadius: '8px', backgroundColor: 'rgba(46, 125, 50, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={16} color="#2E7D32" />
                  </div>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#2E7D32', lineHeight: 1 }}>
                  {availableCopies}
                </div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--editorial-text)', marginTop: '8px' }}>
                  Current Available Copies
                </div>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '0.74rem', color: 'var(--editorial-text)', opacity: 0.75, lineHeight: 1.35 }}>
                Copies resting on library shelves immediately ready for member checkout.
              </p>
            </div>
          </div>

          {/* Formula Audit & Mutual Exclusivity Verification Banner */}
          <div
            style={{
              backgroundColor: '#FFF8E9',
              border: '1px solid var(--editorial-border)',
              padding: '14px 20px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <CheckCircle2 size={18} color="#2E7D32" />
              <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--editorial-text)', textTransform: 'uppercase' }}>
                Inventory Audit Formula:
              </span>
              <code style={{ backgroundColor: 'var(--editorial-bg-subtle)', border: '1px solid var(--editorial-border)', padding: '3px 10px', borderRadius: '3px', fontSize: '0.86rem', fontWeight: 700, color: 'var(--editorial-green)' }}>
                Total Copies ({totalCopies}) = Available ({availableCopies}) + Borrowed ({borrowedCopies}) + Reserved ({reservedCopies})
              </code>
              {isBalanced ? (
                <span style={{ fontSize: '0.74rem', backgroundColor: 'rgba(46, 125, 50, 0.12)', color: '#2E7D32', border: '1px solid rgba(46, 125, 50, 0.25)', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                  ✓ 100% Status Balanced
                </span>
              ) : (
                <span style={{ fontSize: '0.74rem', backgroundColor: 'rgba(197, 34, 31, 0.12)', color: '#C5221F', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                  Audit Sum: {physicalSum}
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--editorial-text)', opacity: 0.75 }}>
              * Active waiting-list requests ({waitingCopies}) are queued patrons and kept strictly separate from physical inventory counts.
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* CIRCULATION CHARTS & PREDICTIVE FORECASTING                 */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {chartsData ? (
          <>
            {/* Grid 1: Monthly Borrowing Trends & Category Breakdown */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '24px',
                marginBottom: '36px'
              }}
            >
              {/* Monthly Trend Chart */}
              <div style={{ padding: '24px', backgroundColor: '#FFF8E9', border: '1px solid var(--editorial-border)', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--editorial-text)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <TrendingUp size={18} color="var(--editorial-accent)" strokeWidth={2.4} />
                    Monthly Borrowing Trajectory
                  </h3>
                  <span style={{ fontSize: '0.76rem', color: 'var(--editorial-text)', fontWeight: 700, textTransform: 'uppercase' }}>Last 6 Months</span>
                </div>

                {/* SVG/Bar Chart */}
                <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '16px', padding: '10px 0 20px', borderBottom: '1px solid var(--editorial-border)' }}>
                  {borrowingTrend.map((item, idx) => {
                    const maxTrendVal = Math.max(...borrowingTrend.map(b => b.loans), 10);
                    const heightPercent = Math.max(8, Math.round((item.loans / maxTrendVal) * 100));
                    return (
                      <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--editorial-text)', marginBottom: '4px' }}>
                          {item.loans}
                        </span>
                        <div
                          style={{
                            width: '100%',
                            maxWidth: '38px',
                            height: `${heightPercent}%`,
                            backgroundColor: 'var(--editorial-green)',
                            border: '1px solid var(--editorial-border)',
                            transition: 'height 0.4s ease'
                          }}
                          title={`${item.loans} loans in ${item.month}`}
                        />
                        <span style={{ fontSize: '0.72rem', color: 'var(--editorial-text)', fontWeight: 700, marginTop: '8px', textTransform: 'uppercase' }}>
                          {item.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.80rem', color: 'var(--editorial-text)', opacity: 0.75 }}>
                  <span>Direct checkout records</span>
                  <span>MongoDB Atlas Transactions</span>
                </div>
              </div>

              {/* Category Volume Distribution */}
              <div style={{ padding: '24px', backgroundColor: '#FFF8E9', border: '1px solid var(--editorial-border)', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--editorial-text)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <BookOpen size={18} color="var(--editorial-accent)" strokeWidth={2.4} />
                    Category Stacks Inventory
                  </h3>
                  <span style={{ fontSize: '0.76rem', color: 'var(--editorial-text)', fontWeight: 700, textTransform: 'uppercase' }}>{categories.length} Chambers</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {categories.slice(0, 6).map((cat, idx) => {
                    const maxCatCopies = Math.max(...categories.map(c => c.total_copies), 1);
                    const percent = Math.round((cat.total_copies / maxCatCopies) * 100);
                    return (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.84rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--editorial-text)', textTransform: 'uppercase' }}>{cat.category}</span>
                          <span style={{ fontWeight: 700, color: 'var(--editorial-text)' }}>{cat.total_copies} copies <span style={{ opacity: 0.6, fontSize: '0.75rem' }}>({cat.book_count} titles)</span></span>
                        </div>
                        <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--editorial-bg-subtle)', border: '1px solid var(--editorial-border)', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${percent}%`,
                              height: '100%',
                              backgroundColor: idx === 0 ? 'var(--editorial-green)' : (idx === 1 ? 'var(--editorial-accent)' : '#4A5568'),
                              transition: 'width 0.4s ease'
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Grid 2: Most Borrowed Volumes & Seat Section Traffic */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '24px',
                marginBottom: '36px'
              }}
            >
              {/* Top 5 Most Borrowed Books */}
              <div style={{ padding: '24px', backgroundColor: '#FFF8E9', border: '1px solid var(--editorial-border)', boxShadow: 'var(--shadow-card)' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--editorial-text)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px' }}>
                  <Library size={18} color="var(--editorial-accent)" strokeWidth={2.4} />
                  Top Circulation Volumes
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {topBooks.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--editorial-text)', opacity: 0.6 }}>No checkout records found.</div>
                  ) : (
                    topBooks.map((book, idx) => {
                      const maxBorrow = Math.max(...topBooks.map(b => b.borrow_count), 1);
                      const percent = Math.round((book.borrow_count / maxBorrow) * 100);
                      return (
                        <div key={idx} style={{ padding: '10px 12px', border: '1px solid var(--editorial-border)', backgroundColor: 'var(--editorial-bg-subtle)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--editorial-text)' }}>
                              #{idx + 1} {book.title}
                            </span>
                            <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--editorial-accent)' }}>
                              {book.borrow_count} loans
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--editorial-text)', opacity: 0.7, marginBottom: '6px' }}>
                            <span>by {book.author}</span>
                            <span>{book.category}</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', backgroundColor: '#FFF8E9', border: '1px solid var(--editorial-border)', overflow: 'hidden' }}>
                            <div style={{ width: `${percent}%`, height: '100%', backgroundColor: 'var(--editorial-green)' }} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Study Section Seat Traffic */}
              <div style={{ padding: '24px', backgroundColor: '#FFF8E9', border: '1px solid var(--editorial-border)', boxShadow: 'var(--shadow-card)' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--editorial-text)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px' }}>
                  <Armchair size={18} color="var(--editorial-accent)" strokeWidth={2.4} />
                  Sanctuary Seat Pod Traffic
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {seatUsage.map((s, idx) => {
                    const occPct = s.total_seats > 0 ? Math.round((s.occupied_seats / s.total_seats) * 100) : 0;
                    return (
                      <div key={idx} style={{ padding: '12px 14px', border: '1px solid var(--editorial-border)', backgroundColor: 'var(--editorial-bg-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--editorial-text)', textTransform: 'uppercase' }}>
                            {s.section}
                          </span>
                          <span style={{ fontWeight: 700, fontSize: '0.82rem', color: occPct > 75 ? '#C5221F' : 'var(--editorial-green)' }}>
                            {s.occupied_seats} / {s.total_seats} seats ({occPct}%)
                          </span>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: '#FFF8E9', border: '1px solid var(--editorial-border)', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${occPct}%`,
                              height: '100%',
                              backgroundColor: occPct > 75 ? '#C5221F' : 'var(--editorial-green)',
                              transition: 'width 0.4s ease'
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Demand Forecasting Table */}
            {demandForecast.length > 0 && (
              <div style={{ padding: '24px', backgroundColor: '#FFF8E9', border: '1px solid var(--editorial-border)', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--editorial-text)', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>
                      Predictive Demand & Replenishment Recommendations
                    </h3>
                    <span style={{ fontSize: '0.80rem', color: 'var(--editorial-text)', opacity: 0.75 }}>
                      Algorithmic projections based on checkout velocity and unfulfilled hold queues.
                    </span>
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--editorial-border)', borderBottom: '1px solid var(--editorial-border)' }}>
                        <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--editorial-text)', fontWeight: 700, textTransform: 'uppercase' }}>Category</th>
                        <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--editorial-text)', fontWeight: 700, textTransform: 'uppercase' }}>Demand Score</th>
                        <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--editorial-text)', fontWeight: 700, textTransform: 'uppercase' }}>Projected Growth</th>
                        <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--editorial-text)', fontWeight: 700, textTransform: 'uppercase' }}>Active Circ.</th>
                        <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--editorial-text)', fontWeight: 700, textTransform: 'uppercase' }}>Waitlist</th>
                        <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--editorial-text)', fontWeight: 700, textTransform: 'uppercase' }}>Recommendation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demandForecast.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1.5px solid var(--editorial-text)', backgroundColor: idx % 2 === 0 ? '#FFF8E9' : 'var(--editorial-bg-subtle)' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--editorial-text)' }}>
                            {item.category}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '60px', height: '8px', backgroundColor: '#FFF8E9', border: '1px solid var(--editorial-text)', overflow: 'hidden' }}>
                                <div style={{ width: `${item.demandScore}%`, height: '100%', backgroundColor: 'var(--editorial-accent)' }} />
                              </div>
                              <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>{item.demandScore}</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px', color: 'var(--editorial-text)', fontWeight: 700 }}>
                            {item.projectedGrowth}
                          </td>
                          <td style={{ padding: '12px 14px', fontWeight: 600 }}>
                            {item.activeCirculation} books
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            {item.unmetWaitlist > 0 ? (
                              <span style={{ color: 'var(--editorial-accent)', fontWeight: 700 }}>{item.unmetWaitlist} waiting</span>
                            ) : (
                              <span style={{ color: 'var(--editorial-text)', opacity: 0.6 }}>0</span>
                            )}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span className={`badge ${item.demandScore > 50 ? 'badge-borrowed' : 'badge-available'}`}>
                              {item.recommendation}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ padding: '40px', backgroundColor: '#FFF8E9', border: '1px solid var(--editorial-border)', textAlign: 'center' }}>
            <h4 style={{ margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>Circulation Charts Updating</h4>
            <p style={{ margin: '8px 0 0', opacity: 0.75 }}>Circulation trends and predictive demand models will refresh automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
}
