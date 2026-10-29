import React from 'react';
import { Compass, BookOpen, Armchair, Home, ArrowLeft } from 'lucide-react';

export default function NotFound({ onNavigate }) {
  return (
    <div style={{ padding: '80px 0 120px' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
        <div
          style={{
            width: '84px',
            height: '84px',
            borderRadius: '24px',
            backgroundColor: 'var(--soft-sage-light)',
            color: 'var(--forest)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}
        >
          <Compass size={44} />
        </div>

        <div style={{ fontSize: '4.5rem', fontWeight: 800, color: 'var(--forest-dark)', lineHeight: 1, marginBottom: '12px', fontFamily: 'var(--font-serif)' }}>
          404
        </div>

        <h1 style={{ fontSize: '1.8rem', color: 'var(--forest-dark)', marginBottom: '14px' }}>
          Uncharted Shelf
        </h1>

        <p style={{ color: 'var(--muted-text)', fontSize: '1.02rem', lineHeight: 1.6, marginBottom: '32px' }}>
          The library section or page you are looking for has been moved, re-indexed, or does not exist in our physical catalog.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate('home')}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Home size={18} />
            Back to Public Home
          </button>

          <button
            onClick={() => onNavigate('catalog')}
            className="btn btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <BookOpen size={18} />
            Explore Catalog
          </button>

          <button
            onClick={() => onNavigate('seats')}
            className="btn btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Armchair size={18} />
            Study Seats
          </button>
        </div>
      </div>
    </div>
  );
}
