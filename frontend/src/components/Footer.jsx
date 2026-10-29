import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, MapPin, Clock, ShieldCheck, Heart, Layers, Shield } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const { user } = useAuth();

  return (
    <footer
      style={{
        backgroundColor: 'var(--forest-dark)',
        color: 'var(--warm-beige)',
        padding: '50px 0 30px',
        borderTop: '1px solid rgba(220, 229, 213, 0.15)',
        marginTop: 'auto'
      }}
    >
      <div className="container">
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--botanical)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {user?.role === 'admin' ? (
                  <Shield size={20} color="#FAF8F1" />
                ) : user?.role === 'librarian' ? (
                  <Layers size={20} color="#FAF8F1" />
                ) : (
                  <BookOpen size={20} color="#FAF8F1" />
                )}
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: '#FAF8F1'
                }}
              >
                LibraMind
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--soft-sage)', lineHeight: 1.6, marginBottom: '16px' }}>
              Designed around the Biophilic philosophy—integrating natural calm, quiet light, and intelligent catalog indexing to restore focus and curiosity for students and researchers.
            </p>
            <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--sage-light)' }}>
              <span>🍃 Carbon-Neutral Library</span>
              <span>•</span>
              <span>📚 Open Scholarly Access</span>
            </div>
          </div>

          {/* Col 2: Navigation Links (Strictly Role-Based) */}
          <div>
            <h4 style={{ color: '#FAF8F1', fontSize: '1rem', marginBottom: '16px', fontWeight: 600 }}>
              {user?.role === 'admin'
                ? 'Admin Governance'
                : user?.role === 'librarian'
                ? 'Librarian Desk Suite'
                : 'Library Services'}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
              {user?.role === 'admin' ? (
                <>
                  <li>
                    <button
                      onClick={() => onNavigate('admin', { tab: 'overview' })}
                      style={{ background: 'none', border: 'none', color: 'var(--soft-sage)', cursor: 'pointer', padding: 0 }}
                    >
                      Control Center Overview
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('admin', { tab: 'users' })}
                      style={{ background: 'none', border: 'none', color: 'var(--soft-sage)', cursor: 'pointer', padding: 0 }}
                    >
                      User Accounts Directory
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('admin', { tab: 'inventory' })}
                      style={{ background: 'none', border: 'none', color: 'var(--soft-sage)', cursor: 'pointer', padding: 0 }}
                    >
                      Book Inventory & Copies
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('analytics')}
                      style={{ background: 'none', border: 'none', color: 'var(--soft-sage)', cursor: 'pointer', padding: 0 }}
                    >
                      Circulation Analytics
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('admin', { tab: 'audit' })}
                      style={{ background: 'none', border: 'none', color: 'var(--soft-sage)', cursor: 'pointer', padding: 0 }}
                    >
                      System Audit Trail
                    </button>
                  </li>
                </>
              ) : user?.role === 'librarian' ? (
                <>
                  <li>
                    <button
                      onClick={() => onNavigate('librarian', { tab: 'issue' })}
                      style={{ background: 'none', border: 'none', color: 'var(--soft-sage)', cursor: 'pointer', padding: 0 }}
                    >
                      Librarian Desk Overview
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('librarian', { tab: 'issue' })}
                      style={{ background: 'none', border: 'none', color: 'var(--soft-sage)', cursor: 'pointer', padding: 0 }}
                    >
                      Check Out (Issue Book)
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('librarian', { tab: 'return' })}
                      style={{ background: 'none', border: 'none', color: 'var(--soft-sage)', cursor: 'pointer', padding: 0 }}
                    >
                      Returns & Overdue Tracking
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('librarian', { tab: 'reservations' })}
                      style={{ background: 'none', border: 'none', color: 'var(--soft-sage)', cursor: 'pointer', padding: 0 }}
                    >
                      Hold Queues & Pickups
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('librarian', { tab: 'inventory' })}
                      style={{ background: 'none', border: 'none', color: 'var(--soft-sage)', cursor: 'pointer', padding: 0 }}
                    >
                      Add Titles & Physical Copies
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('librarian', { tab: 'seats' })}
                      style={{ background: 'none', border: 'none', color: 'var(--soft-sage)', cursor: 'pointer', padding: 0 }}
                    >
                      Study Pods & Seat Status
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button
                      onClick={() => onNavigate('catalog')}
                      style={{ background: 'none', border: 'none', color: 'var(--soft-sage)', cursor: 'pointer', padding: 0 }}
                    >
                      Explore Book Catalog
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('ai-finder')}
                      style={{ background: 'none', border: 'none', color: 'var(--soft-sage)', cursor: 'pointer', padding: 0 }}
                    >
                      AI Book Finder
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('seats')}
                      style={{ background: 'none', border: 'none', color: 'var(--soft-sage)', cursor: 'pointer', padding: 0 }}
                    >
                      Study Seats & Pods
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('about')}
                      style={{ background: 'none', border: 'none', color: 'var(--soft-sage)', cursor: 'pointer', padding: 0 }}
                    >
                      About Biophilic Space
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('contact')}
                      style={{ background: 'none', border: 'none', color: 'var(--soft-sage)', cursor: 'pointer', padding: 0 }}
                    >
                      Help & Contact Desk
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('terms')}
                      style={{ background: 'none', border: 'none', color: 'var(--soft-sage)', cursor: 'pointer', padding: 0 }}
                    >
                      Terms & Borrowing Rules
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Col 3: Hours & Facility */}
          <div>
            <h4 style={{ color: '#FAF8F1', fontSize: '1rem', marginBottom: '16px', fontWeight: 600 }}>
              Hours & Access
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: 'var(--soft-sage)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="var(--sage-light)" />
                <span>Mon – Fri: 08:00 AM – 10:00 PM</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="var(--sage-light)" />
                <span>Sat – Sun: 09:00 AM – 08:00 PM</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="var(--sage-light)" />
                <span>Central Campus Wing B, Level 1 & 2</span>
              </div>
            </div>
          </div>

          {/* Col 4: Library Policy */}
          <div>
            <h4 style={{ color: '#FAF8F1', fontSize: '1rem', marginBottom: '16px', fontWeight: 600 }}>
              Member Borrowing Policy
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--soft-sage)', lineHeight: 1.5, marginBottom: '12px' }}>
              Standard loan duration is 14 days with up to 2 online renewals. Maximum 5 books at once. All borrowed books are tracked with physical copy barcodes.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--sage-light)' }}>
              <ShieldCheck size={16} color="var(--botanical)" />
              <span>Strict Student Privacy Protected</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(220, 229, 213, 0.1)',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.8rem',
            color: 'var(--sage)'
          }}
        >
          <div>
            © 2026 LibraMind Library Ecosystem. Built with Biophilic Principles.
          </div>
          <div>
            Separated Modular Architecture: Frontend (React) • Backend (Express & SQLite)
          </div>
        </div>
      </div>
    </footer>
  );
}
