import React from 'react';
import { MapPin, BookOpen, Heart, GitCompare, Compass, ArrowRight } from 'lucide-react';

export function getOfflineBookCover(title = 'Book', author = 'Author', category = 'Library') {
  const safeTitle = (title || 'Book').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').substring(0, 36);
  const safeAuthor = (author || 'Author').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').substring(0, 26);
  const safeCat = (category || 'Library').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').substring(0, 22);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
    <defs>
      <linearGradient id="bg_${safeCat.replace(/\W/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2D4A3E"/>
        <stop offset="100%" stop-color="#1B2B24"/>
      </linearGradient>
    </defs>
    <rect width="400" height="600" fill="url(#bg_${safeCat.replace(/\W/g, '')})"/>
    <rect x="20" y="20" width="360" height="560" rx="8" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
    <rect x="35" y="35" width="330" height="530" rx="4" fill="none" stroke="rgba(212,163,115,0.3)" stroke-width="1"/>
    <text x="200" y="80" text-anchor="middle" fill="#829779" font-family="sans-serif" font-size="12" letter-spacing="3" font-weight="700">${safeCat.toUpperCase()}</text>
    <line x1="160" y1="100" x2="240" y2="100" stroke="#E8C547" stroke-width="2"/>
    <text x="200" y="220" text-anchor="middle" fill="#FAF8F1" font-family="Georgia, serif" font-size="22" font-weight="bold">
      ${safeTitle}
    </text>
    <text x="200" y="320" text-anchor="middle" fill="#DCE5D5" font-family="sans-serif" font-size="15" font-style="italic">by ${safeAuthor}</text>
    <circle cx="200" cy="430" r="28" fill="rgba(255,255,255,0.06)" stroke="#829779" stroke-width="1.5"/>
    <text x="200" y="438" text-anchor="middle" fill="#FAF8F1" font-size="22">📖</text>
    <text x="200" y="520" text-anchor="middle" fill="#829779" font-family="sans-serif" font-size="11" letter-spacing="2">LIBRAMIND ARCHIVE</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function BookCard({
  book,
  onViewDetails,
  onReserve,
  onToggleWishlist,
  isWishlisted,
  onToggleCompare,
  isCompared,
  onAddToPlanner
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
    <div
      className="bio-card"
      onClick={() => onViewDetails && onViewDetails(book.id)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
    >
      {/* Cover Image & Badges */}
      <div
        style={{
          position: 'relative',
          height: '200px',
          backgroundColor: 'var(--warm-beige)',
          overflow: 'hidden',
          cursor: 'pointer'
        }}
      >
        <img
          src={imgSrc}
          alt={book.title}
          onError={() => setImgSrc(offlineFallback)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          loading="lazy"
        />

        {/* Availability Badge */}
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          {isAvailable ? (
            <span className="badge badge-available">
              ● {book.available_copies} of {book.total_copies} Available
            </span>
          ) : (
            <span className="badge badge-borrowed">
              ● Waitlist Queue
            </span>
          )}
        </div>

        {/* Quick action buttons on top right */}
        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {/* Wishlist Button */}
          {onToggleWishlist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(book.id);
              }}
              title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
              aria-label="Save to Wishlist"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(4px)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
            >
              <Heart size={15} fill={isWishlisted ? '#C5221F' : 'none'} color={isWishlisted ? '#C5221F' : '#5A6D5E'} />
            </button>
          )}

          {/* Compare Button */}
          {onToggleCompare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(book.id);
              }}
              title={isCompared ? "In Comparison" : "Add to Compare"}
              aria-label="Add to Compare"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isCompared ? 'var(--forest)' : 'rgba(255, 255, 255, 0.92)',
                color: isCompared ? '#FFFFFF' : 'var(--forest)',
                backdropFilter: 'blur(4px)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
            >
              <GitCompare size={15} />
            </button>
          )}

          {/* Visit Planner Button */}
          {onAddToPlanner && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToPlanner(book.id);
              }}
              title="Add to Visit Planner"
              aria-label="Add to Visit Planner"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                color: 'var(--botanical)',
                backdropFilter: 'blur(4px)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
            >
              <Compass size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span className="badge badge-category">
            {book.category}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--muted-text)' }}>
            {book.publication_year}
          </span>
        </div>

        <h3
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.35,
            marginBottom: '6px',
            color: 'var(--forest-dark)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            cursor: 'pointer'
          }}
          onClick={() => onViewDetails(book.id)}
          title={book.title}
        >
          {book.title}
        </h3>

        <p style={{ fontSize: '0.85rem', color: 'var(--muted-text)', marginBottom: '14px' }}>
          by <span style={{ color: 'var(--dark-text)', fontWeight: 500 }}>{book.author}</span>
        </p>

        {/* Shelf & Rack Location Tag */}
        <div
          style={{
            marginTop: 'auto',
            padding: '8px 10px',
            backgroundColor: 'var(--warm-beige-light)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(52, 78, 65, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            color: 'var(--forest-dark)',
            marginBottom: '14px'
          }}
        >
          <MapPin size={14} color="var(--botanical)" />
          <span style={{ fontWeight: 600 }}>{book.floor}</span> • {book.shelf} ({book.rack})
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails && onViewDetails(book.id);
            }}
            className="btn btn-secondary btn-sm"
            style={{ flex: 1 }}
          >
            Details
          </button>

          {!isAvailable && onReserve ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReserve && onReserve(book.id);
              }}
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
            >
              Reserve Hold
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails && onViewDetails(book.id);
              }}
              className="btn btn-botanical btn-sm"
              style={{ flex: 1 }}
            >
              Locate & Borrow
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
