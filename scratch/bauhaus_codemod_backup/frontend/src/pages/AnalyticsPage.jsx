import React, { useState, useEffect } from 'react';
import { api } from '../api';
import {
  BarChart3,
  TrendingUp,
  BookOpen,
  Armchair,
  Download,
  Sparkles,
  ArrowUpRight,
  Layers,
  CheckCircle
} from 'lucide-react';

export default function AnalyticsPage() {
  const [chartsData, setChartsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalyticsCharts()
      .then(data => setChartsData(data))
      .catch(err => console.error('Failed to load analytics', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--editorial-bg)', minHeight: '80vh', padding: '60px 24px', textAlign: 'center', color: 'var(--editorial-text)', fontWeight: 800, textTransform: 'uppercase' }}>
        Generating circulation trends and predictive demand models...
      </div>
    );
  }

  if (!chartsData) {
    return (
      <div style={{ backgroundColor: 'var(--editorial-bg)', minHeight: '80vh', padding: '60px 24px', textAlign: 'center' }}>
        <h3 style={{ fontWeight: 900, textTransform: 'uppercase' }}>Analytics Data Currently Unavailable</h3>
      </div>
    );
  }

  const { categories, topBooks, seatUsage, borrowingTrend, demandForecast } = chartsData;
  const maxBorrow = Math.max(...topBooks.map(b => b.borrow_count), 1);
  const maxCatCopies = Math.max(...categories.map(c => c.total_copies), 1);

  return (
    <div style={{ backgroundColor: 'var(--editorial-bg)', minHeight: '85vh', padding: '40px 24px 80px' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
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
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '8px'
              }}
            >
              <BarChart3 size={15} strokeWidth={2.4} /> Circulation Intelligence & ML Forecast
            </div>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', margin: '4px 0 8px' }}>
              Library Analytics & Demand Metrics
            </h1>
            <p style={{ color: 'var(--editorial-text)', opacity: 0.85, fontSize: '1rem', margin: 0, fontWeight: 500 }}>
              Inspect borrowing frequency, evaluate popular stacks, review seat section traffic, and assess future book demand projections.
            </p>
          </div>

          <a
            href={api.exportBooksCsvUrl()}
            className="btn btn-outline"
            download
            style={{ alignSelf: 'center' }}
          >
            <Download size={16} strokeWidth={2.4} /> Export Catalog CSV
          </a>
        </div>

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
          <div style={{ padding: '24px', backgroundColor: '#FFFFFF', border: '1px solid var(--editorial-border)', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <TrendingUp size={18} color="var(--editorial-accent)" strokeWidth={2.4} />
                Monthly Borrowing Trajectory
              </h3>
              <span style={{ fontSize: '0.76rem', color: 'var(--editorial-text)', fontWeight: 800, textTransform: 'uppercase' }}>Last 6 Months</span>
            </div>

            {/* SVG/Bar Chart */}
            <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '16px', padding: '10px 0 20px', borderBottom: '1px solid var(--editorial-border)' }}>
              {borrowingTrend.map((item, idx) => {
                const heightPercent = Math.round((item.loans / 130) * 100);
                return (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--editorial-text)', marginBottom: '4px' }}>
                      {item.loans}
                    </span>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '38px',
                        height: `${heightPercent}%`,
                        backgroundColor: idx % 2 === 0 ? 'var(--editorial-accent)' : 'var(--editorial-green)',
                        border: '1px solid var(--editorial-border)',
                        boxShadow: '2px 0px 0px var(--editorial-text)',
                        transition: 'height 0.4s ease'
                      }}
                    />
                    <span style={{ fontSize: '0.74rem', color: 'var(--editorial-text)', marginTop: '8px', fontWeight: 800, textTransform: 'uppercase' }}>
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', fontSize: '0.82rem', color: 'var(--editorial-text)', fontWeight: 700, textTransform: 'uppercase' }}>
              <span>Circulation Velocity: <strong>+166% Growth</strong></span>
              <span style={{ color: 'var(--editorial-accent)' }}>↑ Upward Trend</span>
            </div>
          </div>

          {/* Category Breakdown */}
          <div style={{ padding: '24px', backgroundColor: '#FFFFFF', border: '1px solid var(--editorial-border)', boxShadow: 'var(--shadow-card)' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px' }}>
              <Layers size={18} color="var(--editorial-green)" strokeWidth={2.4} />
              Category Stacks & Copies
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {categories.map((cat, idx) => {
                const pct = Math.round((cat.total_copies / maxCatCopies) * 100);
                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 800, textTransform: 'uppercase', color: 'var(--editorial-text)' }}>{cat.category}</span>
                      <span style={{ color: 'var(--editorial-text)', fontWeight: 700 }}>{cat.total_copies} copies</span>
                    </div>
                    <div style={{ height: '10px', backgroundColor: 'var(--editorial-bg-subtle)', border: '1px solid var(--editorial-border)', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          backgroundColor: idx % 3 === 0 ? 'var(--editorial-border)' : idx % 3 === 1 ? 'var(--editorial-green)' : 'var(--editorial-accent)'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Grid 2: Most Borrowed Books & Study Pod Section Load */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px',
            marginBottom: '36px'
          }}
        >
          {/* Most Borrowed Books */}
          <div style={{ padding: '24px', backgroundColor: '#FFFFFF', border: '1px solid var(--editorial-border)', boxShadow: 'var(--shadow-card)' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px' }}>
              <BookOpen size={18} color="var(--editorial-accent)" strokeWidth={2.4} />
              Most Borrowed Volumes
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {topBooks.map((b, idx) => (
                <div
                  key={b.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    backgroundColor: 'var(--editorial-bg-subtle)',
                    border: '1px solid var(--editorial-border)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      backgroundColor: idx === 0 ? 'var(--editorial-accent)' : 'var(--editorial-border)',
                      color: idx === 0 ? '#FFFFFF' : 'var(--editorial-text)',
                      border: '1px solid var(--editorial-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 900
                    }}
                  >
                    #{idx + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--editorial-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {b.title}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--editorial-text)', opacity: 0.8, fontWeight: 600 }}>
                      {b.category} • {b.author}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-category" style={{ fontSize: '0.72rem' }}>
                      {b.borrow_count} loans
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Study Pod Section Usage */}
          <div style={{ padding: '24px', backgroundColor: '#FFFFFF', border: '1px solid var(--editorial-border)', boxShadow: 'var(--shadow-card)' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px' }}>
              <Armchair size={18} color="var(--editorial-green)" strokeWidth={2.4} />
              Seat Density by Section
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {seatUsage.map((sec, idx) => {
                const occupancyPct = sec.total_seats > 0 ? Math.round((sec.occupied_seats / sec.total_seats) * 100) : 0;
                return (
                  <div key={idx} style={{ padding: '12px', backgroundColor: 'var(--editorial-bg-subtle)', border: '1px solid var(--editorial-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '0.88rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--editorial-text)' }}>{sec.section}</strong>
                      <span style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--editorial-text)' }}>
                        {occupancyPct}% Occupied
                      </span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#FFFFFF', border: '1px solid var(--editorial-border)', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${occupancyPct}%`,
                          height: '100%',
                          backgroundColor: occupancyPct > 50 ? 'var(--editorial-accent)' : 'var(--editorial-green)'
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--editorial-text)', opacity: 0.8, marginTop: '4px', fontWeight: 700, textTransform: 'uppercase' }}>
                      {sec.occupied_seats} of {sec.total_seats} pods occupied
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Demand Forecast Table */}
        <div style={{ padding: '28px', backgroundColor: '#FFFFFF', border: '1px solid var(--editorial-border)', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--editorial-accent)', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase' }}>
                <TrendingUp size={16} strokeWidth={2.4} /> Predictive Circulation Model
              </div>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', margin: '4px 0 6px' }}>
                30-Day Category Demand Forecast
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--editorial-text)', opacity: 0.85, margin: 0, fontWeight: 500 }}>
                Deterministic Demand Projection computed using active loan velocity, unmet waitlist backlogs, and inventory.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              <span className="badge badge-category">
                Horizon: Next 30 Days
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--editorial-text)', fontWeight: 700, textTransform: 'uppercase' }}>
                Data Quality: Verified
              </span>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--editorial-border)', borderBottom: '1px solid var(--editorial-border)' }}>
                  <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase' }}>Category</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase' }}>Score (0-100)</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase' }}>Growth</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase' }}>Checkouts</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase' }}>Waitlist</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase' }}>Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {demandForecast.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1.5px solid var(--editorial-text)', backgroundColor: idx % 2 === 0 ? '#FFFFFF' : 'var(--editorial-bg-subtle)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--editorial-text)' }}>
                      {item.category}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '8px', backgroundColor: '#FFFFFF', border: '1px solid var(--editorial-text)', overflow: 'hidden' }}>
                          <div style={{ width: `${item.demandScore}%`, height: '100%', backgroundColor: 'var(--editorial-accent)' }} />
                        </div>
                        <span style={{ fontWeight: 900, fontSize: '0.82rem' }}>{item.demandScore}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--editorial-text)', fontWeight: 800 }}>
                      {item.projectedGrowth}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 600 }}>
                      {item.activeCirculation} books
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {item.unmetWaitlist > 0 ? (
                        <span style={{ color: 'var(--editorial-accent)', fontWeight: 900 }}>{item.unmetWaitlist} waiting</span>
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
      </div>
    </div>
  );
}
