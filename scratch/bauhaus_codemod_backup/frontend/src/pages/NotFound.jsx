import React from 'react';
import { Compass, BookOpen, Armchair, Home, ArrowLeft } from 'lucide-react';

export default function NotFound({ onNavigate }) {
  return (
    <div style={{ backgroundColor: 'var(--editorial-bg)', minHeight: '80vh', padding: '80px 0 120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          textAlign: 'center',
          maxWidth: '560px',
          padding: '48px 36px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--editorial-border)',
          boxShadow: 'var(--shadow-xl)'
        }}
      >
        <div
          style={{
            width: '84px',
            height: '84px',
            backgroundColor: 'var(--editorial-accent)',
            border: '1px solid var(--editorial-border)',
            boxShadow: 'var(--shadow-md)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}
        >
          <Compass size={44} strokeWidth={2.4} />
        </div>

        <div style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--editorial-text)', lineHeight: 1, marginBottom: '8px', letterSpacing: '-0.04em' }}>
          404
        </div>

        <h1 style={{ fontSize: '1.8rem', color: 'var(--editorial-text)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '14px' }}>
          Uncharted Shelf Coordinate
        </h1>

        <p style={{ color: 'var(--editorial-text)', opacity: 0.85, fontSize: '1rem', lineHeight: 1.6, marginBottom: '32px', fontWeight: 500 }}>
          The library section or page you are looking for has been moved, re-indexed, or does not exist in our catalog.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate('home')}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Home size={16} strokeWidth={2.4} />
            Home
          </button>

          <button
            onClick={() => onNavigate('catalog')}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <BookOpen size={16} strokeWidth={2.4} />
            Explore Catalog
          </button>

          <button
            onClick={() => onNavigate('seats')}
            className="btn btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Armchair size={16} strokeWidth={2.4} />
            Study Seats
          </button>
        </div>
      </div>
    </div>
  );
}
