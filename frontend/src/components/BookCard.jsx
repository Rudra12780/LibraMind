import React from 'react';
import { MapPin, BookOpen, Heart, GitCompare, Compass, ArrowRight, Bookmark, RotateCcw, Clock } from 'lucide-react';
import { getOfflineBookCover, handleBookCoverError } from '../utils/offlineCovers';
import { useAuth } from '../context/AuthContext';

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
  isBorrowedByUser = false,
  isReservedByUser = false
}) {
  const { user } = useAuth();
  const bookIdentifier = book.id !== undefined ? book.id : book._id;
  const isAvailable = book.available_copies > 0;
  const offlineFallback = React.useMemo(() => getOfflineBookCover(book.title, book.author, book.category), [book.title, book.author, book.category]);
  const [imgSrc, setImgSrc] = React.useState(() => {
    if (!book.cover_image) return offlineFallback;
    return book.cover_image;
  });

  const cardRef = React.useRef(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const [tiltStyle, setTiltStyle] = React.useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)',
    boxShadow: 'var(--shadow-card)',
    glareX: 50,
    glareY: 50,
    glareOpacity: 0
  });

  const handleMouseMove = React.useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle, modern tilt: max 5.5 degrees
    const rotateX = (((centerY - y) / centerY) * 5.5).toFixed(2);
    const rotateY = (((x - centerX) / centerX) * 5.5).toFixed(2);

    // Soft dynamic shadow that shifts realistically with the tilt
    const shadowX = (-rotateY * 1.5).toFixed(1);
    const shadowY = (16 + Math.max(0, rotateX * 1.2)).toFixed(1);

    setTiltStyle({
      transform: `perspective(1000px) translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`,
      boxShadow: `${shadowX}px ${shadowY}px 28px -6px rgba(37, 40, 32, 0.18), 0 10px 16px -4px rgba(37, 40, 32, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)`,
      glareX: Math.round((x / rect.width) * 100),
      glareY: Math.round((y / rect.height) * 100),
      glareOpacity: 0.15
    });
    setIsHovered(true);
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    setIsHovered(false);
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)',
      boxShadow: 'var(--shadow-card)',
      glareX: 50,
      glareY: 50,
      glareOpacity: 0
    });
  }, []);

  React.useEffect(() => {
    if (!book.cover_image) {
      setImgSrc(offlineFallback);
    } else {
      setImgSrc(book.cover_image);
    }
  }, [book.cover_image, offlineFallback]);

  return (
    <article
      ref={cardRef}
      className={`bio-card book-card-3d ${isHovered ? 'is-hovered' : 'is-resting'}`}
      onClick={() => onViewDetails && onViewDetails(bookIdentifier)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        cursor: 'pointer',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-sm)',
        border: isHovered ? '1px solid var(--editorial-border-dark)' : '1px solid var(--editorial-border)',
        transform: tiltStyle.transform,
        boxShadow: tiltStyle.boxShadow,
        transformStyle: 'preserve-3d',
        transition: isHovered
          ? 'transform 0.10s ease-out, box-shadow 0.14s ease-out, border-color 0.2s ease'
          : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease',
        willChange: 'transform, box-shadow'
      }}
    >
      {/* Dynamic 3D Specular Light Sheen Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 15,
          opacity: isHovered ? tiltStyle.glareOpacity : 0,
          background: `radial-gradient(circle at ${tiltStyle.glareX}% ${tiltStyle.glareY}%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 70%)`,
          transition: isHovered ? 'opacity 0.2s ease' : 'opacity 0.45s ease',
          mixBlendMode: 'overlay'
        }}
      />

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
          borderBottom: '1px solid var(--editorial-border)',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Subtle hardcover spine crease depth */}
        <div className="book-card-spine-crease" />

        <img
          src={imgSrc}
          alt={book.title}
          onError={() => setImgSrc(offlineFallback)}
          className="editorial-zoom-img"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isHovered ? 'scale(1.03)' : 'scale(1)',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          loading="lazy"
          decoding="async"
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
          by <span className="author-signature" style={{ fontSize: '1.02rem', fontWeight: 600, color: 'var(--editorial-text)' }}>{book.author}</span>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="blueprint-annotation">
            <MapPin size={13} color="var(--editorial-accent)" />
            <span style={{ fontWeight: 600 }}>{book.floor}</span>
            <span style={{ color: 'var(--editorial-border-dark)' }}>•</span>
            <span style={{ color: 'var(--editorial-text-muted)' }}>{book.shelf}</span>
          </div>
          <ArrowRight size={13} color="var(--editorial-text-muted)" />
        </div>        {/* ── Editorial Action Bar (Explore for Guests / Reserve / Manage for Members) ── */}
        <div style={{ marginTop: '10px' }}>
          {!user ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails && onViewDetails(bookIdentifier);
                }}
                className="btn btn-primary btn-sm"
                style={{
                  fontSize: '0.82rem',
                  padding: '7px 14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  width: '100%'
                }}
              >
                <BookOpen size={14} strokeWidth={2.2} />
                <span>Explore</span>
              </button>
            </div>
          ) : isBorrowedByUser ? (
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
                  title="Return this copy"
                >
                  <RotateCcw size={13} strokeWidth={2.2} />
                  <span>Return Copy</span>
                </button>
              ) : null}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails && onViewDetails(bookIdentifier);
                }}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.76rem', padding: '6px 10px' }}
              >
                Explore →
              </button>
            </div>
          ) : isAvailable ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails && onViewDetails(bookIdentifier);
                }}
                className="btn btn-primary btn-sm"
                style={{
                  fontSize: '0.82rem',
                  padding: '7px 14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  width: '100%'
                }}
              >
                <BookOpen size={14} strokeWidth={2.2} />
                <span>Explore</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: onReserve ? '1fr 1fr' : '1fr', gap: '8px' }}>
              {onReserve && (
                isReservedByUser ? (
                  <button
                    type="button"
                    disabled
                    className="btn btn-outline btn-sm"
                    style={{
                      fontSize: '0.78rem',
                      padding: '6px 12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      cursor: 'not-allowed',
                      opacity: 0.75,
                      backgroundColor: 'var(--editorial-bg-subtle)',
                      borderColor: 'var(--editorial-border)',
                      color: 'var(--editorial-text-muted)'
                    }}
                    title="You have already joined the waiting list for this volume"
                  >
                    <Clock size={12} strokeWidth={2.2} />
                    <span>In Waitlist</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReserve(bookIdentifier);
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
                    <span>Join Waiting List</span>
                  </button>
                )
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails && onViewDetails(bookIdentifier);
                }}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.78rem', padding: '6px 12px', width: '100%' }}
              >
                Explore →
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
