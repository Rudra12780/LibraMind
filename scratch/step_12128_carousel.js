import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  const [hoveredKey, setHoveredKey] = useState(null); // 'outer_X' or 'inner_X'
  const [selectedKey, setSelectedKey] = useState('outer_0');
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

  // Chamber pagination: up to 38 books per double-shelf wheel on desktop (22 outer + 16 inner)
  const BOOKS_PER_CHAMBER = isMobile ? 26 : (isTablet ? 34 : 38);

  const totalChambers = Math.ceil(books.length / BOOKS_PER_CHAMBER) || 1;
  const [chamberPage, setChamberPage] = useState(0);

  const currentChamberBooks = useMemo(() => {
    return books.slice(
      chamberPage * BOOKS_PER_CHAMBER,
      (chamberPage + 1) * BOOKS_PER_CHAMBER
    );
  }, [books, chamberPage, BOOKS_PER_CHAMBER]);

  const activeBooks = currentChamberBooks.length > 0 ? currentChamberBooks : books.slice(0, BOOKS_PER_CHAMBER);

  // Divide chamber books into outer shelf tier and inner shelf tier
  const { outerBooks, innerBooks } = useMemo(() => {
    if (activeBooks.length === 0) return { outerBooks: [], innerBooks: [] };
    const maxOuter = isMobile ? 16 : (isTablet ? 20 : 22);
    const outerRatio = 0.58;
    const computedOuter = Math.round(activeBooks.length * outerRatio);
    const outerCount = Math.min(maxOuter, Math.max(1, computedOuter));
    return {
      outerBooks: activeBooks.slice(0, outerCount),
      innerBooks: activeBooks.slice(outerCount)
    };
  }, [activeBooks, isMobile, isTablet]);

  // Dimensions based on screen size (Concentric shelving unit with original front book covers)
  const carouselSize = isMobile ? 360 : (isTablet ? 480 : 580);
  const centerRadius = carouselSize / 2;

  // Shelf tier radii & divider rings
  const outerShelfRadius = isMobile ? 144 : (isTablet ? 196 : 238);
  const innerShelfRadius = isMobile ? 88 : (isTablet ? 122 : 148);
  const middleLedgeRadius = isMobile ? 116 : (isTablet ? 160 : 193);
  const coreHubDiameter = isMobile ? 124 : (isTablet ? 172 : 206);

  // Book front cover dimensions (aspect ratio ~ 1 : 1.43)
  const outerCardW = isMobile ? 30 : (isTablet ? 38 : 46);
  const outerCardH = isMobile ? 44 : (isTablet ? 54 : 66);
  const innerCardW = isMobile ? 24 : (isTablet ? 32 : 38);
  const innerCardH = isMobile ? 34 : (isTablet ? 46 : 54);

  // Auto-rotation timer
  useEffect(() => {
    if (!isAutoRotating || isDragging || hoveredKey !== null) return;
    const interval = setInterval(() => {
      setRotationAngle(prev => (prev + 0.3) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoRotating, isDragging, hoveredKey]);

  // Identify active book from key
  const activeKey = hoveredKey || selectedKey;
  const activeBook = useMemo(() => {
    if (!activeKey) return outerBooks[0] || innerBooks[0] || null;
    const [tier, idxStr] = activeKey.split('_');
    const idx = parseInt(idxStr, 10);
    if (tier === 'outer') return outerBooks[idx] || outerBooks[0] || null;
    if (tier === 'inner') return innerBooks[idx] || innerBooks[0] || null;
    return outerBooks[0] || null;
  }, [activeKey, outerBooks, innerBooks]);

  // Non-passive wheel event listener to rotate wheel smoothly and avoid page jumping
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheelEvent = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      setRotationAngle(prev => prev + (delta > 0 ? 4.5 : -4.5));
    };

    el.addEventListener('wheel', handleWheelEvent, { passive: false });
    return () => el.removeEventListener('wheel', handleWheelEvent);
  }, []);

  // Desktop Pointer drag handlers
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
    setRotationAngle(touchStartRef.current.startAngle + deltaY * 0.28);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Step rotation controls
  const handleStepPrev = () => {
    setRotationAngle(prev => prev - 14);
  };

  const handleStepNext = () => {
    setRotationAngle(prev => prev + 14);
  };

  const handleResetRotation = () => {
    setRotationAngle(0);
    setSelectedKey('outer_0');
    setHoveredKey(null);
  };

  if (!activeBooks || activeBooks.length === 0) {
    return null;
  }

  // Active book status
  const activeBookId = activeBook ? (activeBook.id !== undefined ? activeBook.id : activeBook._id) : null;
  const isAvailable = activeBook?.available_copies !== undefined ? activeBook.available_copies > 0 : true;
  const isWishlisted = activeBookId ? (wishlistIds.has(activeBookId) || wishlistIds.has(String(activeBookId))) : false;
  const activeCoverUrl = activeBook ? (activeBook.cover_image || getOfflineBookCover(activeBook.title, activeBook.author, activeBook.category)) : '';

  // Angular steps for outer and inner shelves
  const outerStep = outerBooks.length > 0 ? 360 / outerBooks.length : 16.36;
  const innerStep = innerBooks.length > 0 ? 360 / innerBooks.length : 22.5;

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
            CIRCULAR BOOKSHELF • CHAMBER {chamberPage + 1}/{totalChambers}
          </span>
          <span style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)' }}>
            ({outerBooks.length + innerBooks.length} Volumes Displayed)
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
            title={isAutoRotating ? 'Pause rotation' : 'Revolve wheel'}
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
            title="Reset position"
          >
            <RotateCcw size={12} />
          </button>

          {totalChambers > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginLeft: '4px', borderLeft: '1px solid var(--editorial-border)', paddingLeft: '6px' }}>
              <button
                onClick={() => setChamberPage(prev => (prev > 0 ? prev - 1 : totalChambers - 1))}
                className="btn btn-outline btn-sm"
                style={{ padding: '3px 6px', fontSize: '0.76rem' }}
                title="Previous Chamber"
              >
                ‹
              </button>
              <button
                onClick={() => setChamberPage(prev => (prev + 1) % totalChambers)}
                className="btn btn-outline btn-sm"
                style={{ padding: '3px 6px', fontSize: '0.76rem' }}
                title="Next Chamber"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* CONCENTRIC CIRCULAR BOOKSHELF WITH ORIGINAL FRONT BOOK COVERS   */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
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
          backgroundColor: '#F5F0E6', // Warm architectural parchment interior
          boxShadow: `
            0 28px 64px -8px rgba(37, 40, 32, 0.28),
            0 12px 28px -4px rgba(37, 40, 32, 0.16),
            inset 0 0 0 12px #FFFFFF,
            inset 0 0 0 16px var(--editorial-border),
            inset 0 20px 40px rgba(37, 40, 32, 0.10)
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
            zIndex: 5
          }}
        />

        {/* Concentric Middle Shelf Divider Ring (Dividing Outer & Inner Shelf Tiers) */}
        <div
          style={{
            position: 'absolute',
            width: `${middleLedgeRadius * 2}px`,
            height: `${middleLedgeRadius * 2}px`,
            borderRadius: '50%',
            border: `${isMobile ? '6px' : '8px'} solid #ECE6D8`,
            boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.10)',
            pointerEvents: 'none',
            zIndex: 6
          }}
        />

        {/* Inner Hub Rim Ring (Dividing Inner Shelf Tier from Central Display Opening) */}
        <div
          style={{
            position: 'absolute',
            width: `${coreHubDiameter + (isMobile ? 18 : 26)}px`,
            height: `${coreHubDiameter + (isMobile ? 18 : 26)}px`,
            borderRadius: '50%',
            border: `${isMobile ? '6px' : '8px'} solid #E5DFD0`,
            boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.10)',
            pointerEvents: 'none',
            zIndex: 7
          }}
        />

        {/* Radial Architectural Shelf Partition Spokes (Quarter Dividers) */}
        {[0, 90, 180, 270].map((deg) => (
          <div
            key={deg}
            style={{
              position: 'absolute',
              left: `${centerRadius}px`,
              top: `${centerRadius}px`,
              width: `${outerShelfRadius - (coreHubDiameter / 2)}px`,
              height: `${isMobile ? '3px' : '4px'}`,
              backgroundColor: '#DFD8C8',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
              transformOrigin: '0 50%',
              transform: `rotate(${deg + rotationAngle}deg)`,
              pointerEvents: 'none',
              zIndex: 4
            }}
          />
        ))}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TIER 1: OUTER SHELF RING OF ORIGINAL FRONT BOOK COVERS      */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {outerBooks.map((book, idx) => {
          const key = `outer_${idx}`;
          const isHovered = hoveredKey === key;
          const isSelected = selectedKey === key && !hoveredKey;
          const isActive = isHovered || isSelected;
          const isBookAvailable = book.available_copies !== undefined ? book.available_copies > 0 : true;
          const coverUrl = book.cover_image || getOfflineBookCover(book.title, book.author, book.category);

          // Radial angle around circle
          const angleDeg = (idx * outerStep + rotationAngle) % 360;
          const angleRad = (angleDeg * Math.PI) / 180;

          // Pull book outward when hovered/selected
          const activeRadius = outerShelfRadius + (isHovered ? 26 : (isSelected ? 12 : 0));
          const posX = centerRadius + activeRadius * Math.cos(angleRad) - outerCardW / 2;
          const posY = centerRadius + activeRadius * Math.sin(angleRad) - outerCardH / 2;

          // Normal radial alignment along circle vs pop upright on interaction
          const normalRotation = angleDeg + 90;
          const shouldPopUpright = isHovered || (isMobile && isSelected);
          const cardRotation = shouldPopUpright ? 0 : normalRotation;
          const cardScale = isHovered ? 1.30 : (isSelected ? 1.14 : 1.0);

          return (
            <div
              key={book.id || book._id || key}
              onMouseEnter={() => {
                setHoveredKey(key);
                setSelectedKey(key);
              }}
              onMouseLeave={() => setHoveredKey(null)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedKey(key);
                if (isSelected && onViewDetails) {
                  onViewDetails(book.id || book._id);
                }
              }}
              style={{
                position: 'absolute',
                left: `${posX}px`,
                top: `${posY}px`,
                width: `${outerCardW}px`,
                height: `${outerCardH}px`,
                transform: `rotate(${cardRotation}deg) scale(${cardScale})`,
                transformOrigin: 'center center',
                zIndex: isHovered ? 60 : (isSelected ? 40 : 15),
                transition: isDragging
                  ? 'none'
                  : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease',
                cursor: 'pointer',
                willChange: 'transform'
              }}
              title={`${book.title} by ${book.author} (Click to inspect)`}
            >
              {/* Front Book Cover Card */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  backgroundColor: '#EDE8DF',
                  border: isHovered
                    ? '2px solid var(--editorial-accent)'
                    : (isSelected ? '2px solid var(--editorial-green)' : '1px solid rgba(0,0,0,0.18)'),
                  boxShadow: isHovered
                    ? '0 16px 36px -4px rgba(0,0,0,0.50), 0 4px 12px rgba(0,0,0,0.25)'
                    : (isSelected
                      ? '0 10px 24px -2px rgba(0,0,0,0.38), 0 2px 8px rgba(0,0,0,0.18)'
                      : '0 3px 8px -1px rgba(0,0,0,0.28), 0 1px 3px rgba(0,0,0,0.15)'),
                  position: 'relative'
                }}
              >
                {/* Original Front Cover Image */}
                <img
                  src={coverUrl}
                  alt={book.title}
                  onError={(e) => handleBookCoverError(e, book.title, book.author, book.category)}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />

                {/* 3D Hardcover Spine Crease & Specular Sheen Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background: 'linear-gradient(to right, rgba(0,0,0,0.35) 0%, rgba(255,255,255,0.18) 4%, transparent 12%, transparent 92%, rgba(0,0,0,0.15) 100%)'
                  }}
                />

                {/* Availability Status Pip (Green for Available, Amber for Borrowed) */}
                <div
                  style={{
                    position: 'absolute',
                    top: '3px',
                    right: '3px',
                    width: isMobile ? '5px' : '6px',
                    height: isMobile ? '5px' : '6px',
                    borderRadius: '50%',
                    backgroundColor: isBookAvailable ? '#2ECC71' : '#E67E22',
                    border: '1px solid #FFFFFF',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                    zIndex: 3
                  }}
                  title={isBookAvailable ? 'Available on Shelf' : 'Currently On Loan'}
                />
              </div>
            </div>
          );
        })}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TIER 2: INNER SHELF RING OF ORIGINAL FRONT BOOK COVERS      */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {innerBooks.map((book, idx) => {
          const key = `inner_${idx}`;
          const isHovered = hoveredKey === key;
          const isSelected = selectedKey === key && !hoveredKey;
          const isActive = isHovered || isSelected;
          const isBookAvailable = book.available_copies !== undefined ? book.available_copies > 0 : true;
          const coverUrl = book.cover_image || getOfflineBookCover(book.title, book.author, book.category);

          // Radial angle around circle
          const angleDeg = (idx * innerStep + rotationAngle) % 360;
          const angleRad = (angleDeg * Math.PI) / 180;

          // Pull book outward when hovered/selected
          const activeRadius = innerShelfRadius + (isHovered ? 20 : (isSelected ? 10 : 0));
          const posX = centerRadius + activeRadius * Math.cos(angleRad) - innerCardW / 2;
          const posY = centerRadius + activeRadius * Math.sin(angleRad) - innerCardH / 2;

          const normalRotation = angleDeg + 90;
          const shouldPopUpright = isHovered || (isMobile && isSelected);
          const cardRotation = shouldPopUpright ? 0 : normalRotation;
          const cardScale = isHovered ? 1.28 : (isSelected ? 1.14 : 1.0);

          return (
            <div
              key={book.id || book._id || key}
              onMouseEnter={() => {
                setHoveredKey(key);
                setSelectedKey(key);
              }}
              onMouseLeave={() => setHoveredKey(null)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedKey(key);
                if (isSelected && onViewDetails) {
                  onViewDetails(book.id || book._id);
                }
              }}
              style={{
                position: 'absolute',
                left: `${posX}px`,
                top: `${posY}px`,
                width: `${innerCardW}px`,
                height: `${innerCardH}px`,
                transform: `rotate(${cardRotation}deg) scale(${cardScale})`,
                transformOrigin: 'center center',
                zIndex: isHovered ? 60 : (isSelected ? 40 : 18),
                transition: isDragging
                  ? 'none'
                  : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease',
                cursor: 'pointer',
                willChange: 'transform'
              }}
              title={`${book.title} by ${book.author} (Click to inspect)`}
            >
              {/* Front Book Cover Card */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  backgroundColor: '#EDE8DF',
                  border: isHovered
                    ? '2px solid var(--editorial-accent)'
                    : (isSelected ? '2px solid var(--editorial-green)' : '1px solid rgba(0,0,0,0.18)'),
                  boxShadow: isHovered
                    ? '0 14px 32px -4px rgba(0,0,0,0.48), 0 3px 10px rgba(0,0,0,0.22)'
                    : (isSelected
                      ? '0 8px 20px -2px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.16)'
                      : '0 2px 7px -1px rgba(0,0,0,0.26), 0 1px 2px rgba(0,0,0,0.14)'),
                  position: 'relative'
                }}
              >
                {/* Original Front Cover Image */}
                <img
                  src={coverUrl}
                  alt={book.title}
                  onError={(e) => handleBookCoverError(e, book.title, book.author, book.category)}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />

                {/* 3D Hardcover Spine Crease & Specular Sheen Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background: 'linear-gradient(to right, rgba(0,0,0,0.35) 0%, rgba(255,255,255,0.18) 4%, transparent 12%, transparent 92%, rgba(0,0,0,0.15) 100%)'
                  }}
                />

                {/* Availability Status Pip (Green for Available, Amber for Borrowed) */}
                <div
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    width: isMobile ? '4.5px' : '5.5px',
                    height: isMobile ? '4.5px' : '5.5px',
                    borderRadius: '50%',
                    backgroundColor: isBookAvailable ? '#2ECC71' : '#E67E22',
                    border: '1px solid #FFFFFF',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                    zIndex: 3
                  }}
                  title={isBookAvailable ? 'Available on Shelf' : 'Currently On Loan'}
                />
              </div>
            </div>
          );
        })}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* CENTER CIRCULAR HUB: ACTIVE SPECIMEN DETAILS & FRONT COVER  */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (activeBookId && onViewDetails) onViewDetails(activeBookId);
          }}
          style={{
            position: 'relative',
            width: `${coreHubDiameter}px`,
            height: `${coreHubDiameter}px`,
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '2px solid var(--editorial-border)',
            boxShadow: `
              0 14px 32px rgba(37, 40, 32, 0.16),
              inset 0 0 0 6px #FAF8F4,
              inset 0 0 0 8px var(--editorial-border)
            `,
            zIndex: 35,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? '6px' : '10px',
            textAlign: 'center',
            boxSizing: 'border-box',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title="Click to examine full book specimen"
        >
          {activeBook ? (
            <>
              {/* Thumbnail of the actual Front Cover */}
              <div
                style={{
                  width: isMobile ? '34px' : (isTablet ? '44px' : '52px'),
                  height: isMobile ? '48px' : (isTablet ? '62px' : '74px'),
                  borderRadius: '3px',
                  overflow: 'hidden',
                  backgroundColor: '#F5F5F0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.22)',
                  marginBottom: isMobile ? '2px' : '4px',
                  flexShrink: 0
                }}
              >
                <img
                  src={activeCoverUrl}
                  alt={activeBook.title}
                  onError={(e) => handleBookCoverError(e, activeBook.title, activeBook.author, activeBook.category)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>

              {/* Category */}
              <div
                style={{
                  fontSize: isMobile ? '0.50rem' : '0.58rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: 'var(--editorial-accent)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: '1px'
                }}
              >
                {activeBook.category ? activeBook.category.split(' ')[0] : 'ATHENAEUM'}
              </div>

              {/* Book Title */}
              <h4
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: isMobile ? '0.68rem' : (isTablet ? '0.78rem' : '0.86rem'),
                  fontWeight: 800,
                  color: 'var(--editorial-text)',
                  lineHeight: 1.15,
                  margin: '0 0 2px 0',
                  maxHeight: isMobile ? '26px' : '32px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  textOverflow: 'ellipsis'
                }}
              >
                {activeBook.title}
              </h4>

              {/* Author */}
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: isMobile ? '0.54rem' : '0.64rem',
                  color: 'var(--editorial-text-muted)',
                  margin: isMobile ? '0 0 4px 0' : '0 0 5px 0',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '90%'
                }}
              >
                By {activeBook.author}
              </p>

              {/* Action Buttons in Center Hub */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  flexWrap: 'nowrap'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onViewDetails(activeBookId)}
                  className="btn btn-primary btn-sm"
                  style={{
                    padding: isMobile ? '2px 5px' : '3px 9px',
                    fontSize: isMobile ? '0.54rem' : '0.64rem',
                    borderRadius: '9999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}
                  title="Inspect book details"
                >
                  <BookOpen size={9} />
                  <span>Examine</span>
                </button>

                {isAvailable ? (
                  <button
                    onClick={() => onBorrow(activeBook)}
                    className="btn btn-outline btn-sm"
                    style={{
                      padding: isMobile ? '2px 5px' : '3px 8px',
                      fontSize: isMobile ? '0.54rem' : '0.64rem',
                      borderRadius: '9999px',
                      backgroundColor: '#FFFFFF'
                    }}
                    title="Quick Checkout"
                  >
                    Borrow
                  </button>
                ) : (
                  <button
                    onClick={() => onReserve(activeBookId)}
                    className="btn btn-outline btn-sm"
                    style={{
                      padding: isMobile ? '2px 5px' : '3px 8px',
                      fontSize: isMobile ? '0.54rem' : '0.64rem',
                      borderRadius: '9999px',
                      backgroundColor: '#FFFFFF'
                    }}
                    title="Place on Hold Queue"
                  >
                    Hold
                  </button>
                )}

                <button
                  onClick={() => onToggleWishlist(activeBookId)}
                  style={{
                    width: isMobile ? '18px' : '22px',
                    height: isMobile ? '18px' : '22px',
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
                  <Heart size={9} fill={isWishlisted ? '#C53030' : 'none'} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--editorial-text-muted)', fontSize: '0.80rem' }}>
              Select a book
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
          <strong>Scroll</strong> or <strong>drag</strong> wheel to rotate • Hover any book to bring its front cover forward • Click Examine to open details
        </span>
      </div>
    </div>
  );
}
