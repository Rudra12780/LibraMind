import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, MapPin, Clock, ShieldCheck, Heart, Layers, Shield, Sparkles, ArrowRight } from 'lucide-react';

export default function Footer({ onNavigate, onOpenBlueprints }) {
  const { user } = useAuth();

  return (
    <footer
      style={{
        backgroundColor: 'var(--editorial-bg-subtle)',
        borderTop: '1px solid var(--editorial-border)',
        marginTop: 'auto',
        color: 'var(--editorial-text)',
        position: 'relative'
      }}
    >
      <div className="container" style={{ padding: '56px 24px 36px', maxWidth: '1360px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '40px',
            marginBottom: '44px'
          }}
        >
          {/* Col 1: Brand & Editorial Colophon */}
          <div>
            <div
              onClick={() => onNavigate('home')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '14px', cursor: 'pointer' }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--editorial-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <BookOpen size={18} strokeWidth={2.2} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: 'var(--editorial-text)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1
                }}
              >
                LibraMind
              </span>
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--editorial-text-muted)', lineHeight: 1.65, marginBottom: '16px' }}>
              The Literary Review &amp; Modern Smart Library Platform. Combining historic archival curation, biophilic study carrels, physical shelf mapping, and intelligent literary discovery.
            </p>

            <div style={{ display: 'flex', gap: '8px', fontSize: '0.72rem', color: 'var(--editorial-accent)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              <span>Estd. 1892</span>
              <span>•</span>
              <span>Archival Collections</span>
              <span>•</span>
              <span>Athenaeum Edition</span>
            </div>
          </div>

          {/* Col 2: Navigation Links (Role-Adaptive) */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--editorial-accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px' }}>
              {user?.role === 'admin'
                ? 'Master Governance'
                : user?.role === 'librarian'
                ? 'Circulation Suite'
                : 'Library Chambers'}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '0.86rem' }}>
              {user?.role === 'admin' ? (
                <>
                  <li>
                    <button
                      onClick={() => onNavigate('admin', { tab: 'overview' })}
                      style={{ background: 'none', border: 'none', color: 'var(--editorial-text)', cursor: 'pointer', padding: 0, fontSize: '0.86rem' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--editorial-accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--editorial-text)'}
                    >
                      → Admin Console Overview
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('admin', { tab: 'users' })}
                      style={{ background: 'none', border: 'none', color: 'var(--editorial-text)', cursor: 'pointer', padding: 0, fontSize: '0.86rem' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--editorial-accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--editorial-text)'}
                    >
                      → Patron &amp; Staff Records
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('analytics')}
                      style={{ background: 'none', border: 'none', color: 'var(--editorial-text)', cursor: 'pointer', padding: 0, fontSize: '0.86rem' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--editorial-accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--editorial-text)'}
                    >
                      → Circulation Analytics
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('dashboard')}
                      style={{ background: 'none', border: 'none', color: 'var(--editorial-text)', cursor: 'pointer', padding: 0, fontSize: '0.86rem' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--editorial-accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--editorial-text)'}
                    >
                      → Patron Reading Room View
                    </button>
                  </li>
                </>
              ) : user?.role === 'librarian' ? (
                <>
                  <li>
                    <button
                      onClick={() => onNavigate('librarian', { tab: 'issue' })}
                      style={{ background: 'none', border: 'none', color: 'var(--editorial-text)', cursor: 'pointer', padding: 0, fontSize: '0.86rem' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--editorial-accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--editorial-text)'}
                    >
                      → Circulation Issue Desk
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('librarian', { tab: 'return' })}
                      style={{ background: 'none', border: 'none', color: 'var(--editorial-text)', cursor: 'pointer', padding: 0, fontSize: '0.86rem' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--editorial-accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--editorial-text)'}
                    >
                      → Return &amp; Overdue Ledger
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('librarian', { tab: 'inventory' })}
                      style={{ background: 'none', border: 'none', color: 'var(--editorial-text)', cursor: 'pointer', padding: 0, fontSize: '0.86rem' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--editorial-accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--editorial-text)'}
                    >
                      → Physical Stacks Inventory
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button
                      onClick={() => onNavigate('catalog')}
                      style={{ background: 'none', border: 'none', color: 'var(--editorial-text)', cursor: 'pointer', padding: 0, fontSize: '0.86rem' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--editorial-accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--editorial-text)'}
                    >
                      Explore Library Stacks
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('ai-finder')}
                      style={{ background: 'none', border: 'none', color: 'var(--editorial-text)', cursor: 'pointer', padding: 0, fontSize: '0.86rem' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--editorial-accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--editorial-text)'}
                    >
                      AI Literary Oracle
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('seats')}
                      style={{ background: 'none', border: 'none', color: 'var(--editorial-text)', cursor: 'pointer', padding: 0, fontSize: '0.86rem' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--editorial-accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--editorial-text)'}
                    >
                      Reserve Study Carrels
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('visit-planner')}
                      style={{ background: 'none', border: 'none', color: 'var(--editorial-text)', cursor: 'pointer', padding: 0, fontSize: '0.86rem' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--editorial-accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--editorial-text)'}
                    >
                      Plan Stacks Itinerary
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate(user ? 'dashboard' : 'login')}
                      style={{ background: 'none', border: 'none', color: 'var(--editorial-text)', cursor: 'pointer', padding: 0, fontSize: '0.86rem' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--editorial-accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--editorial-text)'}
                    >
                      Personal Reading Room
                    </button>
                  </li>
                </>
              )}
              <li>
                <button
                  onClick={() => onOpenBlueprints ? onOpenBlueprints('home') : onNavigate('home')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--editorial-accent)',
                    cursor: 'pointer',
                    padding: 0,
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--editorial-green)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--editorial-accent)'}
                  title="View all 21 website architectural wireframe blueprints"
                >
                  <Layers size={13} />
                  <span>📐 Website Blueprints (21 Pages)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Sanctuary Hours & Desk */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--editorial-accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px' }}>
              Sanctuary Hours
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.86rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <Clock size={16} color="var(--editorial-accent)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--editorial-text)' }}>Mon – Fri: 08:00 – 22:00</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--editorial-text-muted)' }}>Sat – Sun: 09:00 – 20:00</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={16} color="var(--editorial-accent)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--editorial-text)' }}>Athenaeum Central Quadrangle</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--editorial-text-muted)' }}>Building 4, Humanities Courtyard</div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Archival Guarantee Box */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--editorial-accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px' }}>
              Archival Standards
            </div>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--editorial-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px 18px',
                fontSize: '0.84rem',
                lineHeight: 1.6,
                color: 'var(--editorial-text-muted)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              Every physical volume in our classical stacks is preserved under controlled climate conditions and cataloged with floor, section, shelf, and barcode accession stamps.
            </div>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div
          style={{
            borderTop: '1px solid var(--editorial-border)',
            paddingTop: '22px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            fontSize: '0.80rem',
            color: 'var(--editorial-text-muted)'
          }}
        >
          <div>
            © 1892 – 2026 LibraMind Athenaeum &amp; Literary Review. All literary rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onOpenBlueprints ? onOpenBlueprints('home') : onNavigate('home')}
              style={{ background: 'none', border: 'none', color: 'var(--editorial-accent)', cursor: 'pointer', fontSize: '0.80rem', padding: 0, fontWeight: 700 }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--editorial-green)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--editorial-accent)'}
            >
              📐 All 21 Blueprints
            </button>
            <button
              onClick={() => onNavigate('terms')}
              style={{ background: 'none', border: 'none', color: 'var(--editorial-text-muted)', cursor: 'pointer', fontSize: '0.80rem', padding: 0 }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--editorial-accent)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--editorial-text-muted)'}
            >
              Circulation Policies
            </button>
            <button
              onClick={() => onNavigate('contact')}
              style={{ background: 'none', border: 'none', color: 'var(--editorial-text-muted)', cursor: 'pointer', fontSize: '0.80rem', padding: 0 }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--editorial-accent)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--editorial-text-muted)'}
            >
              Reference Desk Help
            </button>
            <button
              onClick={() => onNavigate('about')}
              style={{ background: 'none', border: 'none', color: 'var(--editorial-text-muted)', cursor: 'pointer', fontSize: '0.80rem', padding: 0 }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--editorial-accent)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--editorial-text-muted)'}
            >
              About the Athenaeum
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
