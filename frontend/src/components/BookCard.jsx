import React from 'react';
import { MapPin, BookOpen, Heart, GitCompare, Compass, ArrowRight, Bookmark, RotateCcw } from 'lucide-react';
import { getOfflineBookCover, handleBookCoverError } from '../utils/offlineCovers';

export { getOfflineBookCover, handleBookCoverError };

export default function BookCard({
  book,
  onViewDetails,
  onReserve,
  onBorrow,
  onReturn,
  onToggleWishlist,
  isWishlisted,
  onToggleCompare,
  isCompared,
  onAddToPlanner,
  isBorrowedByUser = false
}) {
  const isAvailable = book.available_copies > 0;
  const offlineFallback = React.useMemo(() => getOfflineBookCover(book.title, book.author, book.category), [book.title, book.author, book.category]);
  const [imgSrc, setImgSrc] = React.useState(() => {
    if (!book.cover_image) return offlineFallback;
    return book.cover_image;
  });

  React.useEffect(() => {
    if (!book.cover_image) {
      setImgSrc(offlineFallback);
    } else {
      setImgSrc(book.cover_image);
    }
  }, [book.cover_image, offlineFallback]);

  return (
    <article
      className="bio-card"
      onClick={() => onViewDetails && onViewDetails(book.id)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        cursor: 'pointer',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--editorial-border)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease'
      }}
    >
      {/* Editorial Cover Canvas */}
      <div
        style={{
          position: 'relative',
          height: '260px',
          backgroundColor: 'var(--editorial-bg-subtle)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid var(--editorial-border)'
        }}
      >
        <img
          src={imgSrc}
          alt={book.title}
          onError={() => setImgSrc(offlineFallback)}
          className="editorial-zoom-img"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          loading="lazy"
        />

        {/* Availability Badge */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start', zIndex: 2 }}>
          {isBorrowedByUser && (
            <span
              style={{
                fontSize: '0.64rem',
                fontWeight: 700,
                backgroundColor: 'var(--editorial-green)',
                color: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: '2px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                boxShadow: '0 2px 4px rgba(37, 40, 32, 0.18)'
              }}
            >
              ★ In Your Folio
            </span>
          )}
          {isAvailable ? (
            <span
              className="badge badge-available"
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                boxShadow: '0 1px 3px rgba(37, 40, 32, 0.12)'
              }}
            >
              ● {book.available_copies} of {book.total_copies} In Stacks
            </span>
          ) : (
            <span
              className="badge badge-borrowed"
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                boxShadow: '0 1px 3px rgba(37, 40, 32, 0.12)'
              }}
            >
              ● All Copies On Loan
            </span>
          )}
        </div>
      </div>

      {/* Editorial Content */}
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span
            className="editorial-kicker"
            style={{ margin: 0, fontSize: '0.68rem', letterSpacing: '0.12em' }}
          >
            {book.category}
          </span>
          <span style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)', fontFamily: 'var(--font-mono)' }}>
            {book.publication_year}
          </span>
        </div>

        <h3
          style={{
            fontSize: '1.18rem',
            lineHeight: 1.3,
            marginBottom: '6px',
            color: 'var(--editorial-text)',
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
          title={book.title}
        >
          {book.title}
        </h3>

        <p style={{ fontSize: '0.86rem', color: 'var(--editorial-text-muted)', marginBottom: '14px', lineHeight: 1.4 }}>
          by <span style={{ fontWeight: 600, color: 'var(--editorial-text)' }}>{book.author}</span>
        </p>

        {/* Shelf & Stack Location */}
        <div
          style={{
            marginTop: 'auto',
            padding: '8px 10px',
            backgroundColor: 'var(--editorial-bg-subtle)',
            border: '1px solid var(--editorial-border)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.76rem',
            color: 'var(--editorial-text)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={13} color="var(--editorial-accent)" />
            <span style={{ fontWeight: 600 }}>{book.floor}</span>
            <span style={{ color: 'var(--editorial-border-dark)' }}>•</span>
            <span style={{ color: 'var(--editorial-text-muted)' }}>{book.shelf}</span>
          </div>
          <ArrowRight size={13} color="var(--editorial-text-muted)" />
        </div>

        {/* ── Editorial Action Bar (Borrow / Reserve / Manage) ── */}
        <div style={{ marginTop: '10px' }}>
          {isBorrowedByUser ? (
            <div style={{ display: 'grid', gridTemplateColumns: onReturn ? '1fr 1fr' : '1fr', gap: '8px' }}>
              {onReturn ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReturn(book);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{
                    fontSize: '0.76rem',
                    padding: '6px 10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px'
                  }}
                  title="Return this copy so you can borrow it again or choose another title"
                >
                  <RotateCcw size={13} strokeWidth={2.2} />
                  <span>Return Copy</span>
                </button>
              ) : null}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails && onViewDetails(book.id);
                }}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.76rem', padding: '6px 10px' }}
              >
                Volume Details →
              </button>
            </div>
          ) : isAvailable ? (
            <div style={{ display: 'grid', gridTemplateColumns: onBorrow ? '1fr auto' : '1fr', gap: '8px' }}>
              {onBorrow && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBorrow(book);
                  }}
                  className="btn btn-primary btn-sm"
                  style={{
                    fontSize: '0.78rem',
                    padding: '6px 12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <BookOpen size={13} strokeWidth={2.2} />
                  <span>Borrow Volume</span>
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails && onViewDetails(book.id);
                }}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.78rem', padding: '6px 12px' }}
              >
                Details →
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: onReserve ? '1fr auto' : '1fr', gap: '8px' }}>
              {onReserve && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReserve(book.id);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{
                    fontSize: '0.78rem',
                    padding: '6px 12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Bookmark size={13} strokeWidth={2.2} />
                  <span>Place Hold</span>
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails && onViewDetails(book.id);
                }}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.78rem', padding: '6px 12px' }}
              >
                Details →
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
