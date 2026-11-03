import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, MapPin, Clock, ShieldCheck, Heart, Layers, Shield, Sparkles } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const { user } = useAuth();

  return (
    <footer
      style={{
        backgroundColor: '#1C0F0A',
        color: '#E8DCBE',
        borderTop: '1.5px solid #C29B38',
        marginTop: 'auto',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Classical Stamped Gold Inlay Fillet */}
      <div
        style={{
          height: '3px',
          background: 'linear-gradient(90deg, #8C6615 0%, #D4AF37 50%, #8C6615 100%)',
          width: '100%'
        }}
      />

      <div className="container" style={{ padding: '48px 24px 32px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '36px',
            marginBottom: '40px'
          }}
        >
          {/* Col 1: Brand & Philosophy */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #2A1810 0%, #3D2214 100%)',
                  border: '1.5px solid #C29B38',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)'
                }}
              >
                <BookOpen size={20} color="#D4AF37" strokeWidth={2.2} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.50rem',
                  fontWeight: 800,
                  color: '#FFFDF9',
                  letterSpacing: '-0.01em'
                }}
              >
                LibraMind
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#D4C8B5', lineHeight: 1.7, marginBottom: '16px' }}>
              An authentic Classical Smart Library sanctuary combining vintage archival curation, quiet study pods, accession barcode tracking, and intelligent literary recommendations.
            </p>
            <div style={{ display: 'flex', gap: '8px', fontSize: '0.76rem', color: '#C29B38', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              <span>Estd. 1892</span>
              <span>•</span>
              <span>Athenaeum Archives</span>
              <span>•</span>
              <span>Rare Volumes</span>
            </div>
          </div>

          {/* Col 2: Navigation Links (Role-Based) */}
          <div>
            <h4 style={{ color: '#D4AF37', fontSize: '0.94rem', marginBottom: '14px', fontFamily: 'var(--font-serif)', fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              {user?.role === 'admin'
                ? 'Master Governance'
                : user?.role === 'librarian'
                ? 'Circulation Suite'
                : 'Archival Navigation'}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
              {user?.role === 'admin' ? (
                <>
                  <li>
                    <button
                      onClick={() => onNavigate('admin', { tab: 'overview' })}
                      style={{ background: 'none', border: 'none', color: '#D4C8B5', cursor: 'pointer', padding: 0, fontSize: '0.86rem', transition: 'color 0.15s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#D4C8B5'}
                    >
                      → Console Overview
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('admin', { tab: 'users' })}
                      style={{ background: 'none', border: 'none', color: '#D4C8B5', cursor: 'pointer', padding: 0, fontSize: '0.86rem', transition: 'color 0.15s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#D4C8B5'}
                    >
                      → User Management
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('analytics')}
                      style={{ background: 'none', border: 'none', color: '#D4C8B5', cursor: 'pointer', padding: 0, fontSize: '0.86rem', transition: 'color 0.15s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#D4C8B5'}
                    >
                      → Archival Analytics
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('dashboard')}
                      style={{ background: 'none', border: 'none', color: '#D4C8B5', cursor: 'pointer', padding: 0, fontSize: '0.86rem', transition: 'color 0.15s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#D4C8B5'}
                    >
                      → Patron Reading Sanctuary
                    </button>
                  </li>
                </>
              ) : user?.role === 'librarian' ? (
                <>
                  <li>
                    <button
                      onClick={() => onNavigate('librarian', { tab: 'issue' })}
                      style={{ background: 'none', border: 'none', color: '#D4C8B5', cursor: 'pointer', padding: 0, fontSize: '0.86rem', transition: 'color 0.15s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#D4C8B5'}
                    >
                      → Check Out Desk
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('librarian', { tab: 'return' })}
                      style={{ background: 'none', border: 'none', color: '#D4C8B5', cursor: 'pointer', padding: 0, fontSize: '0.86rem', transition: 'color 0.15s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#D4C8B5'}
                    >
                      → Returns &amp; Overdue Ledger
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('librarian', { tab: 'inventory' })}
                      style={{ background: 'none', border: 'none', color: '#D4C8B5', cursor: 'pointer', padding: 0, fontSize: '0.86rem', transition: 'color 0.15s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#D4C8B5'}
                    >
                      → Catalog Inventory
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('catalog')}
                      style={{ background: 'none', border: 'none', color: '#D4C8B5', cursor: 'pointer', padding: 0, fontSize: '0.86rem', transition: 'color 0.15s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#D4C8B5'}
                    >
                      → Public Stacks
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button
                      onClick={() => onNavigate('catalog')}
                      style={{ background: 'none', border: 'none', color: '#D4C8B5', cursor: 'pointer', padding: 0, fontSize: '0.86rem', transition: 'color 0.15s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#D4C8B5'}
                    >
                      Browse Classical Stacks
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('ai-finder')}
                      style={{ background: 'none', border: 'none', color: '#D4C8B5', cursor: 'pointer', padding: 0, fontSize: '0.86rem', transition: 'color 0.15s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#D4C8B5'}
                    >
                      AI Literary Oracle
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('seats')}
                      style={{ background: 'none', border: 'none', color: '#D4C8B5', cursor: 'pointer', padding: 0, fontSize: '0.86rem', transition: 'color 0.15s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#D4C8B5'}
                    >
                      Reserve Reading Pods
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('visit-planner')}
                      style={{ background: 'none', border: 'none', color: '#D4C8B5', cursor: 'pointer', padding: 0, fontSize: '0.86rem', transition: 'color 0.15s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#D4C8B5'}
                    >
                      Plan Stacks Itinerary
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('dashboard')}
                      style={{ background: 'none', border: 'none', color: '#D4C8B5', cursor: 'pointer', padding: 0, fontSize: '0.86rem', transition: 'color 0.15s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#D4C8B5'}
                    >
                      My Sanctuary Hub
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Col 3: Hours & Location */}
          <div>
            <h4 style={{ color: '#D4AF37', fontSize: '0.94rem', marginBottom: '14px', fontFamily: 'var(--font-serif)', fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              Sanctuary Hours
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: '#D4C8B5' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <Clock size={16} color="#C29B38" style={{ marginTop: '3px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, color: '#FFFDF9' }}>Mon – Fri: 08:00 – 22:00</div>
                  <div style={{ fontSize: '0.80rem', color: '#B3A28E' }}>Sat – Sun: 09:00 – 20:00</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={16} color="#C29B38" style={{ marginTop: '3px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, color: '#FFFDF9' }}>Athenaeum Central Wing</div>
                  <div style={{ fontSize: '0.80rem', color: '#B3A28E' }}>Building 4, University Quadrangle</div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Archival Guarantee */}
          <div>
            <h4 style={{ color: '#D4AF37', fontSize: '0.94rem', marginBottom: '14px', fontFamily: 'var(--font-serif)', fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              Archival Standards
            </h4>
            <div
              style={{
                backgroundColor: 'rgba(42, 24, 16, 0.6)',
                border: '1px solid #C29B38',
                borderRadius: 'var(--radius-sm)',
                padding: '14px',
                fontSize: '0.84rem',
                lineHeight: 1.6,
                color: '#D4C8B5'
              }}
            >
              Every physical volume in our classical stacks is preserved under controlled climate conditions and cataloged with unique barcode accession stamps.
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Policies */}
        <div
          style={{
            borderTop: '1px solid rgba(194, 155, 56, 0.25)',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.80rem',
            color: '#B3A28E'
          }}
        >
          <div>
            © 1892 – 2026 LibraMind Athenaeum Smart Library. All literary rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '18px' }}>
            <button
              onClick={() => onNavigate('terms')}
              style={{ background: 'none', border: 'none', color: '#B3A28E', cursor: 'pointer', fontSize: '0.80rem' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#B3A28E'}
            >
              Circulation Policies
            </button>
            <button
              onClick={() => onNavigate('help')}
              style={{ background: 'none', border: 'none', color: '#B3A28E', cursor: 'pointer', fontSize: '0.80rem' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#B3A28E'}
            >
              Reference Desk Help
            </button>
            <button
              onClick={() => onNavigate('about')}
              style={{ background: 'none', border: 'none', color: '#B3A28E', cursor: 'pointer', fontSize: '0.80rem' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#B3A28E'}
            >
              About the Athenaeum
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
