import React from 'react';
import {
  BookOpen,
  Layers,
  Compass,
  Clock,
  MapPin,
  ShieldCheck,
  Award,
  Users,
  Sparkles,
  ArrowRight,
  Square
} from 'lucide-react';

export default function About({ onNavigate }) {
  const principles = [
    {
      icon: Square,
      title: 'Preserving Living Knowledge',
      desc: 'Every archival volume, reading desk, and oak catalog shelf is crafted for intellectual contemplation and enduring scholarship.'
    },
    {
      icon: Layers,
      title: 'Archival Spatial Cataloging',
      desc: 'Structured across classical stacks, shelf markers, and unique barcode accession codes for seamless physical book discovery.'
    },
    {
      icon: Compass,
      title: 'Classical Reading Sanctuary',
      desc: 'Warm amber banker’s reading illumination, antique vellum surfaces, and quiet study alcoves designed for deep uninterrupted focus.'
    },
    {
      icon: Sparkles,
      title: 'Intelligent Archival Curation',
      desc: 'Harmonizing time-tested library cataloging standards with intelligent recommendation engines to connect patrons to inspiring literature.'
    }
  ];

  const spaces = [
    {
      name: 'Quiet Focus Pods (Level 1)',
      desc: 'Rectilinear workstations with dedicated power conduits and task lamps for uninterrupted research.',
      seats: '24 Pods'
    },
    {
      name: 'Collaborative Studio (Level 1)',
      desc: 'Open layout brainstorming tables with geometric magnetic boards for team inquiry.',
      seats: '16 Pods'
    },
    {
      name: 'Atrium View Desks (Level 2)',
      desc: 'Clean modernist carrels overlooking the architectural courtyard with natural daylight.',
      seats: '12 Pods'
    },
    {
      name: 'Archive & Reference (Level 2)',
      desc: 'Specialized archive benches with direct physical access to rare manuscripts and journals.',
      seats: '8 Desks'
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--editorial-bg)', minHeight: '85vh', padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        {/* Hero Section */}
        <div
          style={{
            padding: '56px 40px',
            backgroundColor: 'var(--editorial-text)',
            color: '#FFFFFF',
            border: '1px solid var(--editorial-border)',
            boxShadow: 'var(--shadow-xl)',
            marginBottom: '48px',
            position: 'relative'
          }}
        >
          {/* Top Accent Stripe */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: 'linear-gradient(90deg, var(--editorial-accent) 0% 33.3%, var(--editorial-green) 33.3% 66.6%, var(--editorial-border) 66.6% 100%)'
            }}
          />

          <div style={{ maxWidth: '720px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 16px',
                backgroundColor: 'var(--vintage-parchment)',
                color: 'var(--vintage-walnut)',
                border: '1px solid var(--vintage-brass)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '20px'
              }}
            >
              <Layers size={14} color="var(--vintage-crimson)" strokeWidth={2} />
              Classical Athenaeum Architecture &amp; Curation
            </div>

            <h1
              style={{
                fontSize: '2.8rem',
                lineHeight: 1.2,
                color: '#FFFFFF',
                marginBottom: '16px',
                fontWeight: 800,
                fontFamily: 'var(--font-serif)',
                letterSpacing: '-0.01em'
              }}
            >
              Where Living Scholarship &amp; Timeless Wisdom Converge
            </h1>

            <p
              style={{
                fontSize: '1.05rem',
                lineHeight: 1.7,
                color: '#E8DCBE',
                marginBottom: '28px',
                fontWeight: 500
              }}
            >
              LibraMind is built on the grand tradition of the classical Athenaeum and European archival libraries (Estd. 1892). Uniting polished mahogany woodwork, warm gaslight ambiance, accession shelf mapping, and modern intelligent book discovery, we create a sanctuary for lifelong scholars.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('catalog')}
                className="btn btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <BookOpen size={18} strokeWidth={2.4} />
                Explore Catalog →
              </button>
              <button
                onClick={() => onNavigate('seats')}
                className="btn btn-outline"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: 'var(--editorial-text)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Compass size={18} strokeWidth={2.4} />
                View Study Pods
              </button>
            </div>
          </div>
        </div>

        {/* 4 Pillars */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px' }}>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              Modernist Design Principles
            </h2>
            <p style={{ color: 'var(--editorial-text)', opacity: 0.85, fontSize: '0.98rem', fontWeight: 500 }}>
              Engineered with zero superfluous ornament to foster deep academic concentration and spatial mastery.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}
          >
            {principles.map((item, idx) => {
              const Icon = item.icon;
              const borderColors = ['var(--editorial-accent)', 'var(--editorial-green)', 'var(--editorial-border)', 'var(--editorial-text)'];
              return (
                <div
                  key={idx}
                  style={{
                    padding: '28px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--editorial-border)',
                    boxShadow: 'var(--shadow-card)',
                    borderTop: `6px solid ${borderColors[idx % 4]}`
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      backgroundColor: 'var(--editorial-border)',
                      border: '1px solid var(--editorial-border)',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '18px'
                    }}
                  >
                    <Icon size={22} color="var(--editorial-text)" strokeWidth={2.4} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--editorial-text)', opacity: 0.85, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Study Pod Spaces */}
        <div
          style={{
            padding: '36px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--editorial-border)',
            boxShadow: 'var(--shadow-lg)',
            marginBottom: '48px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
                Dedicated Academic Environments
              </h2>
              <span style={{ fontSize: '0.88rem', color: 'var(--editorial-text)', opacity: 0.8, fontWeight: 600 }}>
                60 total study seats across quiet, collaborative, and archive pods
              </span>
            </div>
            <button
              onClick={() => onNavigate('seats')}
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              Reserve a Study Seat <ArrowRight size={14} strokeWidth={2.4} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '16px'
            }}
          >
            {spaces.map((s, idx) => (
              <div
                key={idx}
                style={{
                  padding: '20px',
                  backgroundColor: 'var(--editorial-bg-subtle)',
                  border: '1px solid var(--editorial-border)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ color: 'var(--editorial-text)', fontSize: '0.95rem', fontWeight: 900, textTransform: 'uppercase' }}>{s.name}</strong>
                  <span className="badge badge-category" style={{ fontSize: '0.74rem' }}>{s.seats}</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--editorial-text)', opacity: 0.85, lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Operating Hours & Coordinates */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}
        >
          <div style={{ padding: '28px', backgroundColor: '#FFFFFF', border: '1px solid var(--editorial-border)', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Clock size={22} color="var(--editorial-accent)" strokeWidth={2.4} />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
                Library Hours
              </h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', fontWeight: 600 }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1.5px solid var(--editorial-text)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--editorial-text)', opacity: 0.8 }}>Monday – Friday</span>
                <strong>08:00 AM – 10:00 PM</strong>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1.5px solid var(--editorial-text)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--editorial-text)', opacity: 0.8 }}>Saturday – Sunday</span>
                <strong>09:00 AM – 08:00 PM</strong>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--editorial-text)', opacity: 0.8 }}>Quiet Hours (Silent Study)</span>
                <strong>18:00 – 22:00 Daily</strong>
              </li>
            </ul>
          </div>

          <div style={{ padding: '28px', backgroundColor: '#FFFFFF', border: '1px solid var(--editorial-border)', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <MapPin size={22} color="var(--editorial-green)" strokeWidth={2.4} />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
                Campus Coordinates
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--vintage-walnut)', opacity: 0.85, lineHeight: 1.6, marginBottom: '14px', fontWeight: 500 }}>
              Central University Campus, Athenaeum Central Wing.<br />
              Levels 1 &amp; 2 overlooking the Classical Quadrangle.<br />
              Circulation Desk located directly by the main mahogany entry rotunda.
            </p>
            <div style={{ display: 'flex', gap: '8px', fontSize: '0.82rem', color: 'var(--vintage-walnut)', fontWeight: 700, textTransform: 'uppercase' }}>
              <span>■ Classical Athenaeum</span>
              <span>•</span>
              <span>100% Accessible Stacks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
