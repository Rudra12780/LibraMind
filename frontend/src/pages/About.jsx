import React from 'react';
import {
  BookOpen,
  Leaf,
  Sun,
  Wind,
  Compass,
  Clock,
  MapPin,
  ShieldCheck,
  Award,
  Users,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function About({ onNavigate }) {
  const principles = [
    {
      icon: Leaf,
      title: 'Biophilic Reading Spaces',
      desc: 'Infused with living moss walls, indoor flora, and restorative green sightlines to lower cognitive fatigue and elevate academic focus.'
    },
    {
      icon: Sun,
      title: 'Circadian Daylight Architecture',
      desc: 'Floor-to-ceiling high-efficiency glazing that adapts natural light throughout study pods to support natural focus rhythms.'
    },
    {
      icon: Wind,
      title: 'Acoustic Solitude Zones',
      desc: 'Decibel-dampened soundproofing and certified Quiet Study Zones ensure deep work, scholarly research, and undisturbed contemplation.'
    },
    {
      icon: Sparkles,
      title: 'Intelligent Physical Retrieval',
      desc: 'Every volume in our collection is indexed across Floor, Section, Shelf, and Rack coordinates to eliminate search friction.'
    }
  ];

  const spaces = [
    {
      name: 'Quiet Study Zone (Level 1)',
      desc: 'Silent sanctuary with individual carrels, power hubs, and task lighting for intense study sessions.',
      seats: '24 Pods'
    },
    {
      name: 'Collaborative Hub (Level 1)',
      desc: 'Semi-open meeting booths with interactive whiteboards and discussion tables for group projects.',
      seats: '16 Pods'
    },
    {
      name: 'Garden Window Pods (Level 2)',
      desc: 'High-focus study desks facing the botanical atrium courtyard with ergonomic seating and natural views.',
      seats: '12 Pods'
    },
    {
      name: 'Research Nook (Level 2)',
      desc: 'Specialized workstations with access to archive volumes, reference collections, and scholarly journals.',
      seats: '8 Desks'
    }
  ];

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Hero Section */}
        <div
          className="bio-card"
          style={{
            padding: '60px 40px',
            backgroundColor: 'var(--forest)',
            color: '#FFFFFF',
            borderRadius: '24px',
            marginBottom: '48px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ maxWidth: '680px', position: 'relative', zIndex: 2 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: 'var(--soft-sage)',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '20px'
              }}
            >
              <Leaf size={16} />
              Our Architecture & Philosophy
            </div>
            <h1
              style={{
                fontSize: '2.8rem',
                lineHeight: 1.2,
                color: '#FAF8F1',
                marginBottom: '18px',
                fontFamily: 'var(--font-serif)'
              }}
            >
              Where Scholarly Curiosity Meets Natural Calm
            </h1>
            <p
              style={{
                fontSize: '1.1rem',
                lineHeight: 1.7,
                color: 'var(--soft-sage)',
                marginBottom: '28px'
              }}
            >
              LibraMind is designed around the Biophilic Principle—the scientifically demonstrated connection between human cognition and living nature. By pairing organic architecture with intelligent spatial cataloging, we restore tranquility to academic research.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('catalog')}
                className="btn btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <BookOpen size={18} />
                Explore Library Catalog
              </button>
              <button
                onClick={() => onNavigate('seats')}
                className="btn btn-outline"
                style={{
                  borderColor: 'var(--soft-sage)',
                  color: '#FFFFFF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Compass size={18} />
                View Study Pods
              </button>
            </div>
          </div>
        </div>

        {/* 4 Pillars */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--forest-dark)', marginBottom: '8px' }}>
              Our Architectural Pillars
            </h2>
            <p style={{ color: 'var(--muted-text)', fontSize: '0.98rem' }}>
              Every corner of LibraMind is crafted to reduce academic stress and nurture lifelong reading.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px'
            }}
          >
            {principles.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bio-card"
                  style={{
                    padding: '28px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--soft-sage-light)',
                      color: 'var(--forest)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '18px'
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-dark)', marginBottom: '10px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--muted-text)', lineHeight: 1.6, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Study Pod Spaces */}
        <div
          className="bio-card"
          style={{
            padding: '36px',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            marginBottom: '48px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--forest-dark)', margin: 0 }}>
                Dedicated Academic Environments
              </h2>
              <span style={{ fontSize: '0.88rem', color: 'var(--muted-text)' }}>
                60 total study seats across quiet, collaborative, and garden viewing pods
              </span>
            </div>
            <button
              onClick={() => onNavigate('seats')}
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              Reserve a Study Seat <ArrowRight size={14} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px'
            }}
          >
            {spaces.map((s, idx) => (
              <div
                key={idx}
                style={{
                  padding: '20px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--cream)',
                  border: '1px solid var(--subtle-border)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ color: 'var(--forest-dark)', fontSize: '1rem' }}>{s.name}</strong>
                  <span className="badge badge-category" style={{ fontSize: '0.74rem' }}>{s.seats}</span>
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', lineHeight: 1.5, margin: 0 }}>
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
          <div className="bio-card" style={{ padding: '28px', backgroundColor: '#FFFFFF', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Clock size={22} color="var(--forest)" />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-dark)', margin: 0 }}>
                Library Hours
              </h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--subtle-border)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--muted-text)' }}>Monday – Friday</span>
                <strong>08:00 AM – 10:00 PM</strong>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--subtle-border)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--muted-text)' }}>Saturday – Sunday</span>
                <strong>09:00 AM – 08:00 PM</strong>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted-text)' }}>Quiet Hours (Silent Study)</span>
                <strong>18:00 – 22:00 Daily</strong>
              </li>
            </ul>
          </div>

          <div className="bio-card" style={{ padding: '28px', backgroundColor: '#FFFFFF', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <MapPin size={22} color="var(--forest)" />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-dark)', margin: 0 }}>
                Campus Location
              </h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted-text)', lineHeight: 1.6, marginBottom: '14px' }}>
              Central University Campus, Biophilic Wing B.<br />
              Levels 1 & 2 overlooking the Botanical Research Garden.<br />
              Circulation Desk located directly by the main entrance.
            </p>
            <div style={{ display: 'flex', gap: '8px', fontSize: '0.82rem', color: 'var(--botanical)', fontWeight: 600 }}>
              <span>🍃 Eco-Certified Building</span>
              <span>•</span>
              <span>♿ 100% Accessible</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
