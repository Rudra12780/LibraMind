import React from 'react';
import { MapPin, BookOpen, Heart, GitCompare, Compass, ArrowRight } from 'lucide-react';

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

  return (
    <div
      className="bio-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative'
      }}
    >
      {/* Cover Image & Badges */}
      <div style={{ position: 'relative', height: '200px', backgroundColor: 'var(--warm-beige)', overflow: 'hidden' }}>
        <img
          src={book.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
          alt={book.title}
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
            onClick={() => onViewDetails(book.id)}
            className="btn btn-secondary btn-sm"
            style={{ flex: 1 }}
          >
            Details
          </button>

          {!isAvailable && onReserve ? (
            <button
              onClick={() => onReserve(book.id)}
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
            >
              Reserve Hold
            </button>
          ) : (
            <button
              onClick={() => onViewDetails(book.id)}
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
