import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  RotateCcw,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Heart,
  Sparkles
} from 'lucide-react';
import { getOfflineBookCover, handleBookCoverError } from '../utils/offlineCovers';

export default function CircularBookCarousel({
  books = [],
  onViewDetails,
  onBorrow,
  onReturn,
  onReserve,
  onToggleWishlist,
  wishlistIds = new Set(),
  onToggleCompare,
  compareBookIds = [],
  onAddToPlanner,
  userBorrowedBookIds = new Set()
}) {
  const containerRef = useRef(null);

  const [rotationAngle, setRotationAngle] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null); // No book selected by default!
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef({ centerX: 0, centerY: 0, prevAngle: 0 });
  const touchStartRef = useRef({ y: 0, x: 0, startAngle: 0 });

  const [windowWidth, setWindowWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1200));

  useEffect(() => {
    let timer = null;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setWindowWidth(window.innerWidth), 80);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  // Books per 360-degree rounder wheel for optimal legibility and touch targets
  const BOOKS_PER_CHAMBER = isMobile ? 12 : (isTablet ? 16 : 20);
  const totalChambers = Math.ceil(books.length / BOOKS_PER_CHAMBER) || 1;
  const [chamberPage, setChamberPage] = useState(0);

  const currentChamberBooks = useMemo(() => {
    return books.slice(
      chamberPage * BOOKS_PER_CHAMBER,
      (chamberPage + 1) * BOOKS_PER_CHAMBER
    );
  }, [books, chamberPage, BOOKS_PER_CHAMBER]);

  const activeBooks = currentChamberBooks.length > 0 ? currentChamberBooks : books.slice(0, BOOKS_PER_CHAMBER);
  const bookCount = activeBooks.length;
  const stepAngle = bookCount > 0 ? 360 / bookCount : 18;

  // Dimensions for the 360° Rounder Wheel (matching user's reference design)
  const carouselSize = isMobile ? 360 : (isTablet ? 490 : 600);
  const centerRadius = carouselSize / 2;
  const shelfRadius = isMobile ? 134 : (isTablet ? 182 : 226);
  const innerHubDiameter = isMobile ? 176 : (isTablet ? 236 : 286);

  // Front Book Cover Dimensions (proportional, upright front pages)
  const cardWidth = isMobile ? 42 : (isTablet ? 54 : 66);
  const cardHeight = isMobile ? 62 : (isTablet ? 80 : 98);

  // Auto-rotation timer
  useEffect(() => {
    if (!isAutoRotating || isDragging || hoveredIndex !== null) return;
    const interval = setInterval(() => {
      setRotationAngle(prev => (prev + 0.35) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoRotating, isDragging, hoveredIndex]);

  // Determine active book: ONLY when actively hovered or specifically clicked/selected!
  // No book is selected by default (defaults to null)!
  const activeIndex = hoveredIndex !== null ? hoveredIndex : selectedIndex;
  const activeBook = activeIndex !== null ? (activeBooks[activeIndex] || null) : null;

  // Non-passive wheel event listener to rotate wheel and prevent window jumping
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheelEvent = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      setRotationAngle(prev => prev + (delta > 0 ? 5.0 : -5.0));
    };

    el.addEventListener('wheel', handleWheelEvent, { passive: false });
    return () => el.removeEventListener('wheel', handleWheelEvent);
  }, []);

  // Desktop Pointer drag rotation handlers (Steering wheel angle tracker)
  const handlePointerDown = (e) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    dragStartRef.current = {
      centerX,
      centerY,
      prevAngle: startAngle
    };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const { centerX, centerY, prevAngle } = dragStartRef.current;
    const curAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    let delta = curAngle - prevAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    setRotationAngle(prev => prev + delta);
    dragStartRef.current.prevAngle = curAngle;
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Mobile Touch handlers
  const handleTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    setIsDragging(true);
    const touch = e.touches[0];
    touchStartRef.current = {
      y: touch.clientY,
      x: touch.clientX,
      startAngle: rotationAngle
    };
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const deltaY = touch.clientY - touchStartRef.current.y;
    setRotationAngle(touchStartRef.current.startAngle + deltaY * 0.35);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Step rotation controls
  const handleStepPrev = () => {
    if (bookCount === 0) return;
    setRotationAngle(prev => prev - stepAngle);
  };

  const handleStepNext = () => {
    if (bookCount === 0) return;
    setRotationAngle(prev => prev + stepAngle);
  };

  const handleResetRotation = () => {
    setRotationAngle(0);
    setSelectedIndex(null);
    setHoveredIndex(null);
  };

  if (!activeBooks || activeBooks.length === 0) {
    return null;
  }

  // Active book metadata & status (if any book is chosen)
  const activeBookId = activeBook ? (activeBook.id !== undefined ? activeBook.id : activeBook._id) : null;
  const isAvailable = activeBook?.available_copies !== undefined ? activeBook.available_copies > 0 : true;
  const isWishlisted = activeBookId ? (wishlistIds.has(activeBookId) || wishlistIds.has(String(activeBookId))) : false;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        margin: '0 auto 36px',
        userSelect: 'none'
      }}
    >
      {/* Editorial Chamber Control Ribbon */}
      <div
        style={{
          width: '100%',
          maxWidth: `${carouselSize + 80}px`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '18px',
          padding: '8px 14px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--editorial-border)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '0.70rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              color: 'var(--editorial-accent)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}
          >
            ROUNDER 360° BOOKSHELF • CHAMBER {chamberPage + 1}/{totalChambers}
          </span>
          <span style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)' }}>
            ({activeBooks.length} Volumes on Wheel · {books.length} Total in Stacks)
          </span>
        </div>

        {/* Rotation & Navigation Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <button
            onClick={handleStepPrev}
            className="btn btn-outline btn-sm"
            style={{ padding: '4px 8px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '3px' }}
            title="Rotate wheel clockwise"
          >
            <ChevronLeft size={13} />
            <span>Prev</span>
          </button>

          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className="btn btn-outline btn-sm"
            style={{
              padding: '4px 8px',
              fontSize: '0.76rem',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              backgroundColor: isAutoRotating ? 'var(--editorial-green)' : '#FFFFFF',
              color: isAutoRotating ? '#FFFFFF' : 'var(--editorial-text)'
            }}
            title={isAutoRotating ? 'Pause rotation' : 'Continuous 360° rotation'}
          >
            {isAutoRotating ? <Pause size={12} /> : <Play size={12} />}
            <span>{isAutoRotating ? 'Pause' : 'Revolve'}</span>
          </button>

          <button
            onClick={handleStepNext}
            className="btn btn-outline btn-sm"
            style={{ padding: '4px 8px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '3px' }}
            title="Rotate wheel counter-clockwise"
          >
            <span>Next</span>
            <ChevronRight size={13} />
          </button>

          <button
            onClick={handleResetRotation}
            className="btn btn-outline btn-sm"
            style={{ padding: '4px 7px', fontSize: '0.76rem' }}
            title="Reset position and selection"
          >
            <RotateCcw size={12} />
          </button>

          {totalChambers > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginLeft: '4px', borderLeft: '1px solid var(--editorial-border)', paddingLeft: '6px' }}>
              <button
                onClick={() => {
                  setChamberPage(prev => (prev > 0 ? prev - 1 : totalChambers - 1));
                  setSelectedIndex(null);
                  setHoveredIndex(null);
                }}
                className="btn btn-outline btn-sm"
                style={{ padding: '3px 6px', fontSize: '0.76rem' }}
                title="Previous Chamber of volumes"
              >
                ‹
              </button>
              <button
                onClick={() => {
                  setChamberPage(prev => (prev + 1) % totalChambers);
                  setSelectedIndex(null);
                  setHoveredIndex(null);
                }}
                className="btn btn-outline btn-sm"
                style={{ padding: '3px 6px', fontSize: '0.76rem' }}
                title="Next Chamber of volumes"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 360° ROUNDER BOOKSHELF STAGE (Showing Front Pages on Wheel)    */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div
        ref={containerRef}
        onPointerDown={(e) => {
          // If clicked directly on the stage background (not on a book or button), deselect
          if (e.target === containerRef.current) {
            setSelectedIndex(null);
          }
          handlePointerDown(e);
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative',
          width: `${carouselSize}px`,
          height: `${carouselSize}px`,
          borderRadius: '50%',
          backgroundColor: '#FAF8F4', // Warm architectural parchment interior
          boxShadow: `
            0 28px 64px -8px rgba(37, 40, 32, 0.24),
            0 12px 28px -4px rgba(37, 40, 32, 0.14),
            inset 0 0 0 12px #FFFFFF,
            inset 0 0 0 15px var(--editorial-border),
            inset 0 16px 36px rgba(37, 40, 32, 0.08)
          `,
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible'
        }}
      >
        {/* Outermost Painted White/Cream Shelving Bezel Frame */}
        <div
          style={{
            position: 'absolute',
            inset: '-8px',
            borderRadius: '50%',
            border: `${isMobile ? '10px' : '16px'} solid #FFFFFF`,
            boxShadow: '0 8px 32px rgba(37, 40, 32, 0.15), inset 0 2px 4px rgba(0,0,0,0.06)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        {/* Gold Inlaid Circular Dial Accent */}
        <div
          style={{
            position: 'absolute',
            width: `${carouselSize - (isMobile ? 24 : 32)}px`,
            height: `${carouselSize - (isMobile ? 24 : 32)}px`,
            borderRadius: '50%',
            border: '2px solid rgba(212, 175, 55, 0.35)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        {/* Circular Books Shelf Track Rim */}
        <div
          style={{
            position: 'absolute',
            width: `${innerHubDiameter + (isMobile ? 36 : 56)}px`,
            height: `${innerHubDiameter + (isMobile ? 36 : 56)}px`,
            borderRadius: '50%',
            border: '2px solid #E2DDD0',
            boxShadow: 'inset 0 2px 6px rgba(37, 40, 32, 0.06)',
            pointerEvents: 'none',
            zIndex: 2
          }}
        />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* BOOKS STANDING ALONG THE 360° CIRCLE (FRONT PAGES)          */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeBooks.map((book, idx) => {
          const bId = book.id !== undefined ? book.id : book._id;
          const isHovered = hoveredIndex === idx;
          const isSelected = selectedIndex === idx;

          // Angular position along 360-degree circular rim
          const angleDeg = (idx * stepAngle + rotationAngle) % 360;
          const angleRad = (angleDeg * Math.PI) / 180;

          // Radial expansion on hover: gentle outward step (smooth and glitch-free)
          const activeRadius = shelfRadius + (isHovered ? (isMobile ? 10 : 14) : (isSelected ? 8 : 0));
          const posX = centerRadius + activeRadius * Math.cos(angleRad) - cardWidth / 2;
          const posY = centerRadius + activeRadius * Math.sin(angleRad) - cardHeight / 2;

          // Book keeps its natural shelf rotation: NO abrupt 180° flip that causes hover loops and lag!
          const bookRotation = angleDeg + 90;

          const coverUrl = book.cover_image || getOfflineBookCover(book.title, book.author, book.category);
          const isBookAvailable = book.available_copies !== undefined ? book.available_copies > 0 : true;

          return (
            <div
              key={bId || idx}
              onMouseEnter={() => {
                setHoveredIndex(idx);
              }}
              onMouseLeave={() => {
                setHoveredIndex(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (onViewDetails) {
                  onViewDetails(bId);
                }
              }}
              style={{
                position: 'absolute',
                left: `${posX}px`,
                top: `${posY}px`,
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                transform: `rotate(${bookRotation}deg) scale(${isHovered ? 1.15 : (isSelected ? 1.08 : 1.0)})`,
                transformOrigin: 'center center',
                zIndex: isHovered ? 60 : (isSelected ? 35 : 10),
                transition: isDragging
                  ? 'none'
                  : 'transform 0.16s ease-out, box-shadow 0.16s ease-out',
                cursor: 'pointer',
                willChange: 'transform'
              }}
              title={`${book.title} by ${book.author} (Click to open details)`}
            >
              {/* Full Front Book Cover Card (Showing Front Page, Not Sidebar) */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: isMobile ? '4px' : '5px',
                  backgroundColor: '#FFFFFF',
                  overflow: 'hidden',
                  border: isHovered
                    ? '2px solid var(--editorial-accent)'
                    : (isSelected ? '2px solid var(--editorial-green)' : '1px solid rgba(0, 0, 0, 0.16)'),
                  boxShadow: isHovered
                    ? '0 14px 28px -4px rgba(37, 40, 32, 0.38), 0 6px 12px rgba(37, 40, 32, 0.18)'
                    : (isSelected
                      ? '0 10px 22px -3px rgba(37, 40, 32, 0.30), 0 4px 10px rgba(37, 40, 32, 0.15)'
                      : '0 4px 10px -2px rgba(37, 40, 32, 0.18)'),
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                {/* Original Front Cover Artwork Image */}
                <img
                  src={coverUrl}
                  alt={book.title}
                  onError={(e) => handleBookCoverError(e, book.title, book.author, book.category)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  loading="eager"
                />

                {/* Subtle Hardcover Spine Crease & Surface Light Sheen */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background: 'linear-gradient(to right, rgba(0,0,0,0.32) 0%, rgba(255,255,255,0.18) 4%, transparent 12%, transparent 92%, rgba(0,0,0,0.15) 100%)'
                  }}
                />

                {/* Stock Availability Indicator Pip */}
                <div
                  style={{
                    position: 'absolute',
                    top: isMobile ? '3px' : '4px',
                    right: isMobile ? '3px' : '4px',
                    width: isMobile ? '6px' : '7px',
                    height: isMobile ? '6px' : '7px',
                    borderRadius: '50%',
                    backgroundColor: isBookAvailable ? '#27AE60' : '#C0392B',
                    border: '1px solid #FFFFFF',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.35)',
                    zIndex: 3
                  }}
                  title={isBookAvailable ? 'Available on Shelf' : 'Currently On Loan'}
                />
              </div>
            </div>
          );
        })}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* CENTRAL CIRCLE DISC (Displays details ONLY when chosen; None by default) */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (activeBookId && onViewDetails) onViewDetails(activeBookId);
          }}
          style={{
            position: 'relative',
            width: `${innerHubDiameter}px`,
            height: `${innerHubDiameter}px`,
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '2px solid var(--editorial-border)',
            boxShadow: `
              0 14px 28px -6px rgba(37, 40, 32, 0.14),
              inset 0 0 0 8px #FAF8F4,
              inset 0 0 0 9px var(--editorial-border)
            `,
            zIndex: 25,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? '12px' : '20px',
            textAlign: 'center',
            boxSizing: 'border-box',
            cursor: activeBook ? 'pointer' : 'default',
            transition: 'all 0.2s ease'
          }}
          title={activeBook ? 'Click to examine full book specimen' : 'Hover or click any volume on the wheel'}
        >
          {activeBook ? (
            <>
              {/* Category / Discipline */}
              <div
                style={{
                  fontSize: isMobile ? '0.58rem' : '0.66rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: 'var(--editorial-accent)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '3px'
                }}
              >
                {activeBook.category ? activeBook.category.toUpperCase() : 'ATHENAEUM VOL.'}
              </div>

              {/* BOOK NAME IN CENTER OF CIRCLE (Prominent serif typography) */}
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: isMobile ? '0.84rem' : (isTablet ? '1.04rem' : '1.18rem'),
                  fontWeight: 800,
                  color: 'var(--editorial-text)',
                  lineHeight: 1.20,
                  letterSpacing: '-0.015em',
                  margin: '0 0 3px 0',
                  maxHeight: isMobile ? '36px' : '48px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  textOverflow: 'ellipsis'
                }}
              >
                {activeBook.title}
              </h3>

              {/* Author & Year */}
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: isMobile ? '0.66rem' : '0.74rem',
                  color: 'var(--editorial-text-muted)',
                  margin: '0 0 6px 0',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '92%'
                }}
              >
                By {activeBook.author} {activeBook.publication_year ? `(${activeBook.publication_year})` : ''}
              </p>

              {/* Availability Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: isMobile ? '2px 6px' : '3px 8px',
                  borderRadius: '9999px',
                  backgroundColor: isAvailable ? 'var(--editorial-green-light)' : '#FBECE8',
                  color: isAvailable ? 'var(--editorial-green)' : '#8B3A1C',
                  fontSize: isMobile ? '0.58rem' : '0.66rem',
                  fontWeight: 700,
                  marginBottom: isMobile ? '6px' : '10px'
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: isAvailable ? 'var(--editorial-green)' : '#8B3A1C'
                  }}
                />
                <span>{isAvailable ? `${activeBook.available_copies || 1} In Stacks` : 'Checked Out'}</span>
              </div>

              {/* Central Direct Actions */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '4px' : '6px',
                  flexWrap: 'nowrap'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onViewDetails && onViewDetails(activeBookId)}
                  className="btn btn-primary btn-sm"
                  style={{
                    padding: isMobile ? '3px 8px' : '4px 12px',
                    fontSize: isMobile ? '0.64rem' : '0.74rem',
                    borderRadius: '9999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Examine book details"
                >
                  <BookOpen size={11} />
                  <span>Examine</span>
                </button>

                {isAvailable ? (
                  <button
                    onClick={() => onBorrow && onBorrow(activeBook)}
                    className="btn btn-outline btn-sm"
                    style={{
                      padding: isMobile ? '3px 7px' : '4px 10px',
                      fontSize: isMobile ? '0.64rem' : '0.74rem',
                      borderRadius: '9999px',
                      backgroundColor: '#FFFFFF'
                    }}
                    title="Quick Checkout"
                  >
                    Borrow
                  </button>
                ) : (
                  <button
                    onClick={() => onReserve && onReserve(activeBookId)}
                    className="btn btn-outline btn-sm"
                    style={{
                      padding: isMobile ? '3px 7px' : '4px 10px',
                      fontSize: isMobile ? '0.64rem' : '0.74rem',
                      borderRadius: '9999px',
                      backgroundColor: '#FFFFFF'
                    }}
                    title="Place on Hold Queue"
                  >
                    Hold
                  </button>
                )}

                <button
                  onClick={() => onToggleWishlist && onToggleWishlist(activeBookId)}
                  style={{
                    width: isMobile ? '24px' : '28px',
                    height: isMobile ? '24px' : '28px',
                    borderRadius: '50%',
                    border: '1px solid var(--editorial-border)',
                    backgroundColor: isWishlisted ? '#FDE8E8' : '#FFFFFF',
                    color: isWishlisted ? '#C53030' : 'var(--editorial-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title={isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
                >
                  <Heart size={11} fill={isWishlisted ? '#C53030' : 'none'} />
                </button>
              </div>
            </>
          ) : (
            /* NONE SHOW BY DEFAULT: Neutral Clean Prompt When No Book Is Chosen */
            <div style={{ color: 'var(--editorial-text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: isMobile ? '8px' : '16px' }}>
              <BookOpen size={isMobile ? 22 : 30} style={{ opacity: 0.35, marginBottom: '6px', color: 'var(--editorial-accent)' }} />
              <span style={{ fontSize: isMobile ? '0.62rem' : '0.70rem', fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--editorial-accent)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Athenaeum Stacks
              </span>
              <span style={{ fontSize: isMobile ? '0.82rem' : '0.96rem', fontFamily: 'var(--font-serif)', color: 'var(--editorial-text)', fontWeight: 700, marginBottom: '4px' }}>
                No Book Selected
              </span>
              <span style={{ fontSize: isMobile ? '0.60rem' : '0.68rem', color: 'var(--editorial-text-muted)', lineHeight: 1.35, maxWidth: isMobile ? '130px' : '160px' }}>
                Hover or click any volume on the wheel to view details
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Helpful Interactive Hint */}
      <div
        style={{
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.78rem',
          color: 'var(--editorial-text-muted)',
          textAlign: 'center',
          padding: '0 12px'
        }}
      >
        <Sparkles size={13} color="var(--editorial-accent)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Scroll</strong> or <strong>drag</strong> wheel to rotate 360° • Click any book to open details
        </span>
      </div>
    </div>
  );
}
