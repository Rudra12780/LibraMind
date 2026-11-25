import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Compass
} from 'lucide-react';
import { getOfflineBookCover, handleBookCoverError } from '../utils/offlineCovers';

const EMPTY_SET = new Set();
const EMPTY_ARRAY = [];

// Deep Archival Library Leather & Bookcloth Palettes for Desktop Hardcover Spines
const ARCHIVAL_LEATHER_PALETTES = [
  { bg: '#2B100C', rib: '#D4AF37', text: '#FFF8E7', border: '#170805' }, // Antique Crimson Leather
  { bg: '#14241B', rib: '#E5C158', text: '#FAF8F0', border: '#0B140F' }, // Oxford Forest Green
  { bg: '#0F1D2C', rib: '#CBB279', text: '#F0F8FF', border: '#070E17' }, // Royal Navy Bookcloth
  { bg: '#25150A', rib: '#D4AF37', text: '#FFF5E6', border: '#140A04' }, // Polished Mahogany
  { bg: '#1F0E24', rib: '#E5C07B', text: '#FDF0FF', border: '#100613' }, // Deep Archival Plum
  { bg: '#181C1A', rib: '#C5A059', text: '#F5F5F0', border: '#0C0E0D' }, // Archival Charcoal
  { bg: '#26080E', rib: '#E5C158', text: '#FFF0D4', border: '#140306' }, // Deep Burgundy Leather
  { bg: '#24140D', rib: '#F4D06F', text: '#FFF5EB', border: '#130905' }  // Antique Tan Morocco
];

function getArchivalSpineTheme(book, index) {
  const titleSum = (book?.title || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const hash = Math.abs(titleSum + index) % ARCHIVAL_LEATHER_PALETTES.length;
  return ARCHIVAL_LEATHER_PALETTES[hash];
}

export default function CircularBookCarousel({
  books = EMPTY_ARRAY,
  category = 'All',
  onViewDetails,
  onBorrow: _onBorrow,
  onReturn: _onReturn,
  onReserve: _onReserve,
  onToggleWishlist: _onToggleWishlist,
  wishlistIds: _wishlistIds = EMPTY_SET,
  onToggleCompare: _onToggleCompare,
  compareBookIds: _compareBookIds = EMPTY_ARRAY,
  onAddToPlanner: _onAddToPlanner,
  userBorrowedBookIds: _userBorrowedBookIds = EMPTY_SET
}) {
  const containerRef = useRef(null);
  const desktopWheelRef = useRef(null);

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  // Default state paused as requested by user
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Rotation angles
  const desktopRotationRef = useRef(0);
  const [mobileScrollAngle, setMobileScrollAngle] = useState(0);
  const mobileScrollAngleRef = useRef(0);
  mobileScrollAngleRef.current = mobileScrollAngle;

  const dragStartRef = useRef({ centerX: 0, centerY: 0, prevAngle: 0, startAngle: 0, startX: 0, startY: 0 });
  const touchStartRef = useRef({ startX: 0, startY: 0, startAngle: 0 });
  const hasDraggedRef = useRef(false);
  const touchStartPosRef = useRef({ x: 0, y: 0, time: 0 });
  const isUserTouchingRef = useRef(false);
  const touchTargetBookRef = useRef(null);

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

  const displayBooks = useMemo(() => {
    return books || EMPTY_ARRAY;
  }, [books]);

  const N = Math.max(1, displayBooks.length);
  const desktopStepAngle = 360 / N;

  // Reset selection when books change
  useEffect(() => {
    setSelectedIndex(null);
    setHoveredIndex(null);
    setMobileScrollAngle(0);
  }, [displayBooks.length, category]);

  // Direct redirection handler: clicking any book immediately opens its details page
  const handleBookClick = useCallback((e, book) => {
    if (e) {
      e.stopPropagation();
      if (hasDraggedRef.current && e.preventDefault) {
        e.preventDefault();
      }
    }
    if (hasDraggedRef.current) {
      return;
    }
    if (!book) return;
    const bId = book.id !== undefined ? book.id : book._id;
    if (onViewDetails && bId) {
      onViewDetails(bId);
    }
  }, [onViewDetails]);

  // ═════════════════════════════════════════════════════════════════
  // DESKTOP: 360-DEGREE CIRCULAR ROTUNDA GEOMETRY (Zero lag)
  // ═════════════════════════════════════════════════════════════════
  const {
    desktopSize,
    desktopRadius,
    desktopHubDiameter,
    desktopCardW,
    desktopCardH
  } = useMemo(() => {
    if (isTablet) {
      const size = 410;
      const r = 148;
      const h = 70;
      const hub = 196;
      let w;
      if (N <= 8) { w = 22; }
      else if (N <= 16) { w = 17; }
      else if (N <= 28) { w = 13; }
      else if (N <= 45) { w = 10; }
      else { w = Math.max(5.5, Math.floor((710 / N) - 2.5)); }
      return { desktopSize: size, desktopRadius: r, desktopHubDiameter: hub, desktopCardW: w, desktopCardH: h };
    }
    const size = 480;
    const r = 176;
    const h = 82;
    const hub = 236;
    let w;
    if (N <= 8) { w = 26; }
    else if (N <= 16) { w = 20; }
    else if (N <= 28) { w = 15; }
    else if (N <= 45) { w = 12; }
    else if (N <= 70) { w = 9.5; }
    else { w = Math.max(6, Math.floor((848.2 / N) - 2.5)); }
    return { desktopSize: size, desktopRadius: r, desktopHubDiameter: hub, desktopCardW: w, desktopCardH: h };
  }, [isTablet, N]);

  // Precomputed 360° Desktop items around the wheel
  const desktopShelfItems = useMemo(() => {
    if (isMobile) return EMPTY_ARRAY;
    const stageCenter = desktopSize / 2;
    return displayBooks.map((book, idx) => {
      const angleDeg = (idx * desktopStepAngle) % 360;
      const angleRad = (angleDeg * Math.PI) / 180;
      const posX = stageCenter + desktopRadius * Math.cos(angleRad) - desktopCardW / 2;
      const posY = stageCenter + desktopRadius * Math.sin(angleRad) - desktopCardH / 2;
      const bookRotation = angleDeg + 90;

      return {
        book,
        idx,
        posX,
        posY,
        bookRotation,
        spineTheme: getArchivalSpineTheme(book, idx),
        coverUrl: book.cover_image || getOfflineBookCover(book.title, book.author, book.category),
        isBookAvailable: book.available_copies !== undefined ? book.available_copies > 0 : true
      };
    });
  }, [isMobile, displayBooks, desktopSize, desktopRadius, desktopCardW, desktopCardH, desktopStepAngle]);

  // GPU transform for desktop 360° wheel (Zero CPU lag)
  const applyDesktopRotation = useCallback((angle) => {
    desktopRotationRef.current = angle % 360;
    if (desktopWheelRef.current) {
      desktopWheelRef.current.style.transform = `rotate(${desktopRotationRef.current}deg)`;
    }
  }, []);

  const rotateDesktopBy = useCallback((delta) => {
    applyDesktopRotation(desktopRotationRef.current + delta);
  }, [applyDesktopRotation]);

  // ═════════════════════════════════════════════════════════════════
  // MOBILE: 180-DEGREE VERTICAL HALF-CIRCLE GEOMETRY (RIGHT SIDE)
  // - "phone version = 180 show vertical"
  // - "in the phone version show the book frontpage instead of spine"
  // - "screen ne adi ne rakh right side ma jethi lage screen ma thi books ave che"
  // ═════════════════════════════════════════════════════════════
  const MOBILE_ARC_START = 95;  // Bottom of the vertical half-circle (degrees)
  const MOBILE_ARC_END = 265;    // Top of the vertical half-circle (degrees)
  const MOBILE_ARC_SPAN = MOBILE_ARC_END - MOBILE_ARC_START; // 170° vertical arc

  const {
    mobileStageWidth,
    mobileStageHeight,
    mobileRadius,
    mobileCenterX,
    mobileCenterY,
    mobileCardW,
    mobileCardH,
    mobileStepAngle,
    mobileTotalSpan
  } = useMemo(() => {
    if (!isMobile) {
      return {
        mobileStageWidth: 320,
        mobileStageHeight: 380,
        mobileRadius: 138,
        mobileCenterX: 320,
        mobileCenterY: 190,
        mobileCardW: 38,
        mobileCardH: 54,
        mobileStepAngle: 25,
        mobileTotalSpan: 180
      };
    }

    const width = Math.min(windowWidth, 420);
    const height = 410;
    const r = Math.min(Math.round(width * 0.44), 154); // Radius of vertical arc
    const cx = width; // Flush against the right edge of the screen
    const cy = height / 2; // Vertically centered
    const w = 38; // Frontpage cover width
    const h = 54; // Frontpage cover height

    // Spacing between books along the vertical arc - generous spacing for comfortable finger touch
    const step = N <= 8 ? (N > 1 ? MOBILE_ARC_SPAN / (N - 1) : 0) : 26;
    const totalSpan = N <= 8 ? MOBILE_ARC_SPAN + step : N * step;

    return {
      mobileStageWidth: width,
      mobileStageHeight: height,
      mobileRadius: r,
      mobileCenterX: cx,
      mobileCenterY: cy,
      mobileCardW: w,
      mobileCardH: h,
      mobileStepAngle: step,
      mobileTotalSpan: totalSpan
    };
  }, [isMobile, windowWidth, N, MOBILE_ARC_SPAN]);

  // Compute items along the 180° vertical arc for mobile
  const mobileVisibleItems = useMemo(() => {
    if (!isMobile || !displayBooks || displayBooks.length === 0) return EMPTY_ARRAY;

    const items = [];
    const isSmallCategory = N <= 12;

    for (let idx = 0; idx < displayBooks.length; idx++) {
      const book = displayBooks[idx];

      let angleDeg;
      if (isSmallCategory && mobileTotalSpan <= MOBILE_ARC_SPAN + 0.1) {
        // Evenly distributed along the vertical 180° arc
        angleDeg = N > 1 ? MOBILE_ARC_START + idx * mobileStepAngle : 180;
      } else {
        // Continuous rolling track along vertical arc
        let rawPos = (idx * mobileStepAngle + mobileScrollAngle) % mobileTotalSpan;
        if (rawPos < 0) rawPos += mobileTotalSpan;
        angleDeg = MOBILE_ARC_START + rawPos;
      }

      // Check if book falls inside the visible vertical arc window
      const buffer = mobileStepAngle * 0.9;
      if (angleDeg < MOBILE_ARC_START - buffer || angleDeg > MOBILE_ARC_END + buffer) {
        continue;
      }

      let opacity = 1;
      if (angleDeg < MOBILE_ARC_START + 8) {
        opacity = Math.max(0, Math.min(1, (angleDeg - (MOBILE_ARC_START - buffer)) / (buffer + 8)));
      } else if (angleDeg > MOBILE_ARC_END - 8) {
        opacity = Math.max(0, Math.min(1, ((MOBILE_ARC_END + buffer) - angleDeg) / (buffer + 8)));
      }

      const angleRad = (angleDeg * Math.PI) / 180;
      const posX = mobileCenterX + mobileRadius * Math.cos(angleRad) - mobileCardW / 2;
      const posY = mobileCenterY + mobileRadius * Math.sin(angleRad) - mobileCardH / 2;

      // Gently fan the front covers along the vertical curve
      const bookRotation = (angleDeg - 180) * 0.62;

      items.push({
        book,
        idx,
        posX,
        posY,
        angleDeg,
        bookRotation,
        opacity,
        coverUrl: book.cover_image || getOfflineBookCover(book.title, book.author, book.category),
        isBookAvailable: book.available_copies !== undefined ? book.available_copies > 0 : true
      });
    }

    return items;
  }, [isMobile, displayBooks, N, mobileStepAngle, mobileScrollAngle, mobileTotalSpan, MOBILE_ARC_START, MOBILE_ARC_END, MOBILE_ARC_SPAN, mobileCenterX, mobileCenterY, mobileRadius, mobileCardW, mobileCardH]);

  const addMobileScrollDelta = useCallback((deltaDeg) => {
    setMobileScrollAngle(prev => {
      let next = prev + deltaDeg;
      if (mobileTotalSpan > 0) {
        next = next % mobileTotalSpan;
      }
      return next;
    });
  }, [mobileTotalSpan]);

  // ═════════════════════════════════════════════════════════════════
  // UNIFIED AUTO-ROTATION (Constant speed, Paused by default)
  // ═════════════════════════════════════════════════════════════════
  const CONSTANT_SPEED_DPS = isMobile ? 8.5 : 12.0;
  const lastFrameTimeRef = useRef(null);

  useEffect(() => {
    if (!isAutoRotating || isDragging || isUserTouchingRef.current) {
      lastFrameTimeRef.current = null;
      return;
    }

    let animId;
    const tick = (now) => {
      if (lastFrameTimeRef.current !== null) {
        const deltaSec = Math.min((now - lastFrameTimeRef.current) / 1000, 0.08);
        if (isMobile) {
          addMobileScrollDelta(CONSTANT_SPEED_DPS * deltaSec);
        } else {
          rotateDesktopBy(CONSTANT_SPEED_DPS * deltaSec);
        }
      }
      lastFrameTimeRef.current = now;
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animId);
      lastFrameTimeRef.current = null;
    };
  }, [isAutoRotating, isDragging, isMobile, addMobileScrollDelta, rotateDesktopBy, CONSTANT_SPEED_DPS]);

  // ═════════════════════════════════════════════════════════════════
  // WHEEL & SCROLL LISTENER
  // ═════════════════════════════════════════════════════════════════
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const rawDelta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (isMobile) {
        const step = Math.sign(rawDelta) * Math.min(Math.max(Math.abs(rawDelta) * 0.08, 1.2), 8.0);
        addMobileScrollDelta(step);
      } else {
        const step = Math.sign(rawDelta) * Math.min(Math.max(Math.abs(rawDelta) * 0.12, 1.5), 14);
        rotateDesktopBy(step);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [isMobile, addMobileScrollDelta, rotateDesktopBy]);

  // Desktop Pointer drag handlers
  const handleDesktopPointerDown = (e) => {
    if (isMobile || !containerRef.current) return;
    setIsDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    const cX = rect.left + rect.width / 2;
    const cY = rect.top + rect.height / 2;
    const startAngle = Math.atan2(e.clientY - cY, e.clientX - cX) * (180 / Math.PI);
    dragStartRef.current = {
      centerX: cX,
      centerY: cY,
      prevAngle: startAngle,
      startAngle: desktopRotationRef.current
    };
  };

  const handleDesktopPointerMove = (e) => {
    if (isMobile || !isDragging) return;
    const { centerX: cX, centerY: cY, prevAngle } = dragStartRef.current;
    const curAngle = Math.atan2(e.clientY - cY, e.clientX - cX) * (180 / Math.PI);
    let delta = curAngle - prevAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    rotateDesktopBy(delta);
    dragStartRef.current.prevAngle = curAngle;
  };

  const handleDesktopPointerUp = () => {
    if (!isMobile) setIsDragging(false);
  };

  // Mobile Touch handlers (Swipe up/down along the vertical half-circle)
  const handleMobileTouchStart = (e) => {
    if (!isMobile || !e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    isUserTouchingRef.current = true;
    hasDraggedRef.current = false;
    touchStartPosRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    touchStartRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startAngle: mobileScrollAngleRef.current
    };
  };

  const handleMobileTouchMove = (e) => {
    if (!isMobile || !e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const dist = Math.hypot(touch.clientX - touchStartPosRef.current.x, touch.clientY - touchStartPosRef.current.y);
    if (dist > 8) {
      hasDraggedRef.current = true;
      setIsDragging(true);
      // Vertical swipe moves the vertical half-circle up/down
      const deltaY = (touch.clientY - touchStartRef.current.startY) * 0.45;
      addMobileScrollDelta(deltaY);
      touchStartRef.current.startY = touch.clientY;
    }
  };

  const handleMobileTouchEnd = () => {
    if (isMobile) {
      setIsDragging(false);
      isUserTouchingRef.current = false;
      if (hasDraggedRef.current) {
        setTimeout(() => {
          hasDraggedRef.current = false;
          touchTargetBookRef.current = null;
        }, 220);
      }
    }
  };

  // Active book determination: ONLY when hovering or selected
  const activeIndex = hoveredIndex !== null ? hoveredIndex : selectedIndex;
  const activeBook = activeIndex !== null ? (displayBooks[activeIndex] || null) : null;
  const activeBookId = activeBook ? (activeBook.id !== undefined ? activeBook.id : activeBook._id) : null;
  const activeCoverUrl = activeBook ? (activeBook.cover_image || getOfflineBookCover(activeBook.title, activeBook.author, activeBook.category)) : '';

  if (!displayBooks || displayBooks.length === 0) {
    return null;
  }

  // ═════════════════════════════════════════════════════════════════
  // RENDER PHONE VERSION: 180-DEGREE VERTICAL HALF-CIRCLE (RIGHT SIDE)
  // ═════════════════════════════════════════════════════════════════
  if (isMobile) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          width: '100%',
          maxWidth: '100vw',
          margin: '0 auto 20px',
          paddingTop: '2px',
          userSelect: 'none',
          overflow: 'hidden'
        }}
      >
        {/* 180° Vertical Half-Circle Stage Flush with Right Edge */}
        <div
          ref={containerRef}
          onTouchStart={handleMobileTouchStart}
          onTouchMove={handleMobileTouchMove}
          onTouchEnd={handleMobileTouchEnd}
          style={{
            position: 'relative',
            width: `${mobileStageWidth}px`,
            maxWidth: '100%',
            height: `${mobileStageHeight}px`,
            marginLeft: 'auto',
            marginRight: 0,
            touchAction: 'none',
            overflow: 'hidden'
          }}
        >
          {/* Vertical Half-Circle Arch Backing Flush with Right Screen Edge */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: `${mobileCenterY - (mobileRadius + mobileCardH / 2 + 10)}px`,
              width: `${mobileRadius + mobileCardW / 2 + 10}px`,
              height: `${(mobileRadius + mobileCardH / 2 + 10) * 2}px`,
              borderTopLeftRadius: `${mobileRadius + mobileCardH / 2 + 10}px`,
              borderBottomLeftRadius: `${mobileRadius + mobileCardH / 2 + 10}px`,
              backgroundColor: '#FAF8F4',
              border: '1.5px solid var(--editorial-border)',
              borderRight: 'none',
              boxShadow: 'inset 0 4px 14px rgba(37, 40, 32, 0.04), -6px 0 20px rgba(37, 40, 32, 0.06)',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />

          {/* SVG Vertical Arched Rails & Brass Mantle along Right Edge */}
          <svg
            width={mobileStageWidth}
            height={mobileStageHeight}
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 2
            }}
          >
            <defs>
              <linearGradient id="mobileBrassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C5A059" stopOpacity="0.3" />
                <stop offset="25%" stopColor="#D4AF37" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#F4D06F" stopOpacity="0.95" />
                <stop offset="75%" stopColor="#D4AF37" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#C5A059" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Outer Vertical Arc Rail curving in from right edge */}
            <path
              d={`M ${mobileCenterX} ${mobileCenterY - (mobileRadius + mobileCardH / 2 + 2)} A ${mobileRadius + mobileCardH / 2 + 2} ${mobileRadius + mobileCardH / 2 + 2} 0 0 0 ${mobileCenterX} ${mobileCenterY + (mobileRadius + mobileCardH / 2 + 2)}`}
              fill="none"
              stroke="url(#mobileBrassGrad)"
              strokeWidth="2.5"
            />

            {/* Inner Vertical Arc Rail */}
            <path
              d={`M ${mobileCenterX} ${mobileCenterY - (mobileRadius - mobileCardH / 2 - 2)} A ${mobileRadius - mobileCardH / 2 - 2} ${mobileRadius - mobileCardH / 2 - 2} 0 0 0 ${mobileCenterX} ${mobileCenterY + (mobileRadius - mobileCardH / 2 - 2)}`}
              fill="none"
              stroke="rgba(212, 175, 55, 0.45)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />

            {/* Vertical Mantle Spine Line along right edge */}
            <line
              x1={mobileCenterX - 1}
              y1={mobileCenterY - (mobileRadius + mobileCardH / 2 + 8)}
              x2={mobileCenterX - 1}
              y2={mobileCenterY + (mobileRadius + mobileCardH / 2 + 8)}
              stroke="#D4AF37"
              strokeWidth="2.5"
            />
          </svg>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* BOOKS ON VERTICAL 180° ARC (ALL SHOW FRONT COVERS)     */}
          {/* ═══════════════════════════════════════════════════════ */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'auto',
              zIndex: 10
            }}
          >
            {mobileVisibleItems.map(({ book, idx, posX, posY, bookRotation, opacity, coverUrl, isBookAvailable }) => {
              const bId = book.id !== undefined ? book.id : book._id;
              const isSelected = selectedIndex === idx;

              return (
                <div
                  key={bId ? `${bId}-${idx}` : idx}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open details for ${book.title}`}
                  onTouchStart={() => {
                    touchTargetBookRef.current = book;
                    setSelectedIndex(idx);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (hasDraggedRef.current) {
                      return;
                    }
                    const target = touchTargetBookRef.current || book;
                    handleBookClick(e, target);
                  }}
                  style={{
                    position: 'absolute',
                    left: `${posX}px`,
                    top: `${posY}px`,
                    width: `${mobileCardW}px`,
                    height: `${mobileCardH}px`,
                    transform: `rotate(${bookRotation}deg)${isSelected ? ' scale(1.15)' : ''}`,
                    transformOrigin: 'center center',
                    zIndex: isSelected ? 120 : 20,
                    opacity,
                    cursor: 'pointer',
                    willChange: 'transform, opacity',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                    transition: 'transform 0.18s ease, opacity 0.18s ease'
                  }}
                  title={`${book.title} by ${book.author} — Tap to view details`}
                >
                  {/* FRONT PAGE OF THE BOOK (ON PHONE) */}
                  <div
                    className="shelf-front-cover-card"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '3.5px',
                      backgroundColor: '#1E1E1E',
                      overflow: 'hidden',
                      border: isSelected
                        ? '2px solid rgba(212, 175, 55, 0.95)'
                        : '1px solid rgba(255, 255, 255, 0.70)',
                      boxShadow: isSelected
                        ? '0 6px 16px rgba(0, 0, 0, 0.45), 0 0 10px rgba(212, 175, 55, 0.70)'
                        : '0 3px 8px rgba(0, 0, 0, 0.28)',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative'
                    }}
                  >
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
                      loading="lazy"
                    />

                    {/* Subtle book sheen */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: 'none',
                        background: 'linear-gradient(to right, rgba(0,0,0,0.18) 0%, rgba(255,255,255,0.15) 6%, transparent 15%, transparent 88%, rgba(0,0,0,0.14) 100%)'
                      }}
                    />

                    {/* Live Availability Status Pip */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        backgroundColor: isBookAvailable ? '#27AE60' : '#C0392B',
                        border: '0.6px solid #FFFFFF',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.4)',
                        zIndex: 3
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* LEFT SIDE DETAILS CARD (Beside Vertical Half-Circle)    */}
          {/* ═══════════════════════════════════════════════════════ */}
          <div
            onClick={(e) => {
              if (activeBook && !hasDraggedRef.current) handleBookClick(e, activeBook);
            }}
            style={{
              position: 'absolute',
              left: '12px',
              top: `${mobileCenterY - 100}px`,
              width: `${Math.min(180, mobileStageWidth - (mobileRadius + 32))}px`,
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              border: '1.5px solid var(--editorial-border)',
              boxShadow: '0 4px 14px rgba(37, 40, 32, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              padding: '12px 10px',
              zIndex: 60,
              cursor: activeBook ? 'pointer' : 'default',
              pointerEvents: 'auto'
            }}
          >
            {activeBook ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '56px',
                      borderRadius: '3px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      boxShadow: '0 3px 8px rgba(0,0,0,0.22)',
                      backgroundColor: '#1E1E1E'
                    }}
                  >
                    <img
                      src={activeCoverUrl}
                      alt={activeBook.title}
                      onError={(e) => handleBookCoverError(e, activeBook.title, activeBook.author, activeBook.category)}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '0.60rem', fontWeight: 700, color: 'var(--editorial-green)', textTransform: 'uppercase' }}>
                      {activeBook.category || category}
                    </div>
                    <div style={{ fontSize: '0.64rem', color: (activeBook.available_copies !== undefined ? activeBook.available_copies > 0 : true) ? '#27AE60' : '#C0392B', fontWeight: 600 }}>
                      {(activeBook.available_copies !== undefined ? activeBook.available_copies > 0 : true) ? '● In Stacks' : '● On Loan'}
                    </div>
                  </div>
                </div>

                <h4
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.80rem',
                    fontWeight: 700,
                    color: 'var(--editorial-text)',
                    lineHeight: 1.25,
                    margin: '0 0 2px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                  title={activeBook.title}
                >
                  {activeBook.title}
                </h4>

                <div style={{ fontSize: '0.68rem', color: 'var(--editorial-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activeBook.author}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '16px 6px', gap: '6px' }}>
                <BookOpen size={24} style={{ color: 'var(--editorial-green)', opacity: 0.8 }} />
                <div style={{ fontSize: '0.80rem', fontWeight: 700, color: 'var(--editorial-text)' }}>
                  {category === 'All' ? 'Collection' : category}
                </div>
              </div>
            )}
          </div>

          {/* Up / Down Navigation Controls for Mobile Vertical Half-Circle */}
          <div
            style={{
              position: 'absolute',
              left: '12px',
              bottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              zIndex: 80
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                addMobileScrollDelta(-mobileStepAngle * 2 || -14);
              }}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid var(--editorial-border)',
                boxShadow: '0 2px 6px rgba(37, 40, 32, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--editorial-text)'
              }}
              title="Scroll up"
              aria-label="Scroll up"
            >
              <ChevronUp size={16} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                addMobileScrollDelta(mobileStepAngle * 2 || 14);
              }}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid var(--editorial-border)',
                boxShadow: '0 2px 6px rgba(37, 40, 32, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--editorial-text)'
              }}
              title="Scroll down"
              aria-label="Scroll down"
            >
              <ChevronDown size={16} />
            </button>

            {/* Play / Pause Toggle Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAutoRotating(!isAutoRotating);
              }}
              style={{
                padding: '5px 12px',
                fontSize: '0.70rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                borderRadius: '9999px',
                backgroundColor: isAutoRotating ? 'var(--editorial-green)' : '#FFFFFF',
                color: isAutoRotating ? '#FFFFFF' : 'var(--editorial-text)',
                border: '1.5px solid var(--editorial-border)',
                cursor: 'pointer',
                fontWeight: 700,
                boxShadow: '0 2px 6px rgba(37, 40, 32, 0.1)'
              }}
              title={isAutoRotating ? 'Pause rotation' : 'Play rotation'}
            >
              {isAutoRotating ? <Pause size={11} /> : <Play size={11} fill="currentColor" />}
              <span>{isAutoRotating ? 'Pause' : 'Play'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════
  // RENDER PC VERSION: 360-DEGREE FULL CIRCULAR BOOKSHELF ROTUNDA
  // ═════════════════════════════════════════════════════════════════
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        maxWidth: '100vw',
        margin: '0 auto 28px',
        paddingTop: '12px',
        userSelect: 'none',
        overflow: 'visible'
      }}
    >


      {/* 360-Degree Circular Rotunda Stage */}
      <div
        ref={containerRef}
        onPointerDown={handleDesktopPointerDown}
        onPointerMove={handleDesktopPointerMove}
        onPointerUp={handleDesktopPointerUp}
        onPointerLeave={handleDesktopPointerUp}
        style={{
          position: 'relative',
          width: `${desktopSize}px`,
          height: `${desktopSize}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          borderRadius: '50%',
          backgroundColor: '#FAF8F4',
          boxShadow: `
            0 24px 54px -8px rgba(37, 40, 32, 0.20),
            0 8px 22px -4px rgba(37, 40, 32, 0.10),
            inset 0 0 0 10px #FFFFFF,
            inset 0 0 0 12px var(--editorial-border),
            inset 0 12px 28px rgba(37, 40, 32, 0.06)
          `,
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
          overflow: 'visible'
        }}
      >
        {/* Outermost Shelving Bezel Frame */}
        <div
          style={{
            position: 'absolute',
            width: `${(desktopRadius + desktopCardH / 2 + 10) * 2}px`,
            height: `${(desktopRadius + desktopCardH / 2 + 10) * 2}px`,
            borderRadius: '50%',
            border: '12px solid #FFFFFF',
            boxShadow: '0 8px 24px rgba(37, 40, 32, 0.12), inset 0 2px 4px rgba(0,0,0,0.04)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        {/* Gold Inlaid Circular Dial Accent */}
        <div
          style={{
            position: 'absolute',
            width: `${(desktopRadius + desktopCardH / 2) * 2}px`,
            height: `${(desktopRadius + desktopCardH / 2) * 2}px`,
            borderRadius: '50%',
            border: '1.5px solid rgba(212, 175, 55, 0.35)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        {/* Inner Shelving Rim Frame */}
        <div
          style={{
            position: 'absolute',
            width: `${(desktopRadius - desktopCardH / 2 - 2) * 2}px`,
            height: `${(desktopRadius - desktopCardH / 2 - 2) * 2}px`,
            borderRadius: '50%',
            border: '2px solid #E2DDD0',
            backgroundColor: '#FAF8F4',
            boxShadow: 'inset 0 2px 6px rgba(37, 40, 32, 0.05)',
            pointerEvents: 'none',
            zIndex: 3
          }}
        />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ROTATING 360° WHEEL CONTAINER (GPU TRANSFORMED, ZERO LAG)   */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div
          ref={desktopWheelRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: `${desktopSize}px`,
            height: `${desktopSize}px`,
            transform: 'rotate(0deg)',
            transformOrigin: 'center center',
            willChange: 'transform',
            pointerEvents: 'auto',
            zIndex: 5
          }}
        >
          {desktopShelfItems.map(({ book, idx, posX, posY, bookRotation, spineTheme, coverUrl, isBookAvailable }) => {
            const bId = book.id !== undefined ? book.id : book._id;
            const isHovered = hoveredIndex === idx;
            const isSelected = selectedIndex === idx;
            const isActive = isHovered || isSelected;

            return (
              <div
                key={bId ? `${bId}-${idx}` : idx}
                role="button"
                tabIndex={0}
                aria-label={`Open details for ${book.title}`}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={(e) => handleBookClick(e, book)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleBookClick(e, book);
                  }
                }}
                style={{
                  position: 'absolute',
                  left: `${posX}px`,
                  top: `${posY}px`,
                  width: `${desktopCardW}px`,
                  height: `${desktopCardH}px`,
                  transform: `rotate(${bookRotation}deg)${isActive ? ' translateY(-8px) scale(1.03)' : ''}`,
                  transformOrigin: 'center center',
                  zIndex: isActive ? 100 : 10,
                  cursor: 'pointer',
                  willChange: 'transform',
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                  transition: 'transform 0.18s cubic-bezier(0.2, 0, 0, 1)'
                }}
                title={`${book.title} by ${book.author} — Click to view details`}
              >
                {/* AUTHENTIC ARCHIVAL HARDCOVER BOOK SPINE */}
                <div
                  className="shelf-spine-card"
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    borderRadius: '2.5px',
                    backgroundColor: spineTheme.bg,
                    overflow: 'hidden',
                    boxShadow: isActive
                      ? '0 6px 16px rgba(0, 0, 0, 0.45), 0 0 12px rgba(212, 175, 55, 0.85)'
                      : '0 2px 4px rgba(0, 0, 0, 0.35), inset 1px 0 2px rgba(255,255,255,0.16), inset -1px 0 2px rgba(0,0,0,0.45)',
                    border: isActive
                      ? '1.2px solid rgba(212, 175, 55, 0.95)'
                      : `1px solid ${spineTheme.border}`,
                    borderLeft: isActive ? '1.5px solid rgba(212, 175, 55, 0.95)' : '1px solid rgba(255, 255, 255, 0.16)',
                    pointerEvents: 'auto',
                    transition: 'box-shadow 0.18s ease, border 0.18s ease'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '2px 0',
                      backgroundColor: spineTheme.bg
                    }}
                  >
                    <img
                      src={coverUrl}
                      alt={book.title}
                      loading="lazy"
                      onError={(e) => handleBookCoverError(e, book.title, book.author, book.category)}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'left center',
                        opacity: 0.82,
                        filter: 'contrast(1.06) brightness(0.96)',
                        pointerEvents: 'none'
                      }}
                    />

                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.08) 16%, rgba(255,255,255,0.30) 38%, rgba(255,255,255,0.06) 62%, rgba(0,0,0,0.18) 84%, rgba(0,0,0,0.72) 100%)',
                        pointerEvents: 'none'
                      }}
                    />

                    {/* Live Availability Status Pip */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        backgroundColor: isBookAvailable ? '#27AE60' : '#C0392B',
                        border: '0.6px solid #FFFFFF',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.4)',
                        zIndex: 4,
                        pointerEvents: 'none'
                      }}
                    />

                    <div style={{ position: 'absolute', top: '22%', left: '6%', right: '6%', height: '1.2px', backgroundColor: spineTheme.rib, opacity: 0.65, pointerEvents: 'none', zIndex: 2 }} />
                    <div style={{ position: 'absolute', top: '78%', left: '6%', right: '6%', height: '1.2px', backgroundColor: spineTheme.rib, opacity: 0.65, pointerEvents: 'none', zIndex: 2 }} />

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px', zIndex: 3, pointerEvents: 'none' }}>
                      <div style={{ width: '92%', height: '2px', backgroundColor: spineTheme.rib, opacity: 0.95, borderRadius: '1px' }} />
                    </div>

                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', width: '100%', zIndex: 3, pointerEvents: 'none', padding: '2px 0' }}>
                      <span
                        style={{
                          writingMode: 'vertical-rl',
                          textOrientation: 'mixed',
                          transform: 'rotate(180deg)',
                          fontSize: desktopCardW > 14 ? '7.5px' : (desktopCardW > 10 ? '6.5px' : '5.5px'),
                          fontFamily: "'Space Grotesk', -apple-system, sans-serif",
                          fontWeight: 700,
                          letterSpacing: '0.02em',
                          color: spineTheme.text,
                          textShadow: '0 1px 2px rgba(0,0,0,0.98)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: 1,
                          maxHeight: `${desktopCardH - 16}px`,
                          userSelect: 'none'
                        }}
                      >
                        {book.title}
                      </span>
                    </div>

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px', zIndex: 3, pointerEvents: 'none' }}>
                      <div style={{ width: '92%', height: '2px', backgroundColor: spineTheme.rib, opacity: 0.90, borderRadius: '1px' }} />
                      <span
                        style={{
                          marginTop: '1px',
                          width: '3px',
                          height: '3px',
                          borderRadius: '50%',
                          backgroundColor: isBookAvailable ? '#2E7D32' : '#C62828',
                          border: '0.5px solid #FFFFFF',
                          pointerEvents: 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* CENTRAL CIRCLE DISC (Desktop Unified Hub)                   */}
        {/* Clicking it also redirects to the book's details page       */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div
          onClick={(e) => {
            if (activeBook) handleBookClick(e, activeBook);
          }}
          style={{
            position: 'relative',
            width: `${desktopHubDiameter}px`,
            height: `${desktopHubDiameter}px`,
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '2px solid var(--editorial-border)',
            boxShadow: `
              0 10px 26px rgba(37, 40, 32, 0.08),
              inset 0 2px 5px rgba(0,0,0,0.03)
            `,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 16px',
            zIndex: 60,
            cursor: activeBook ? 'pointer' : 'default',
            pointerEvents: 'auto',
            textAlign: 'center'
          }}
        >
          {activeBook ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '100%' }}>
              <div
                style={{
                  width: '52px',
                  height: '76px',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.22)',
                  marginBottom: '8px',
                  backgroundColor: '#1E1E1E'
                }}
              >
                <img
                  src={activeCoverUrl}
                  alt={activeBook.title}
                  onError={(e) => handleBookCoverError(e, activeBook.title, activeBook.author, activeBook.category)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <h4
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: 'var(--editorial-text)',
                  lineHeight: 1.2,
                  margin: 0,
                  maxHeight: '36px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  textOverflow: 'ellipsis'
                }}
              >
                {activeBook.title}
              </h4>

              <div style={{ fontSize: '0.70rem', color: 'var(--editorial-text-muted)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                {activeBook.author}
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--editorial-text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <BookOpen size={28} style={{ opacity: 0.40, color: 'var(--editorial-accent)' }} />
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--editorial-text)' }}>
                {category === 'All' ? 'Complete Collection' : category}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--editorial-text-muted)', fontWeight: 600 }}>
                Hover book to preview
              </span>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* PLAY / PAUSE BUTTON (Right Corner, Paused by default)      */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div
          style={{
            position: 'absolute',
            bottom: '-10px',
            right: '6px',
            zIndex: 80,
            pointerEvents: 'auto'
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsAutoRotating(!isAutoRotating);
            }}
            className="btn btn-outline btn-sm"
            style={{
              padding: '7px 20px',
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '9999px',
              backgroundColor: isAutoRotating ? 'var(--editorial-green)' : '#FFFFFF',
              color: isAutoRotating ? '#FFFFFF' : 'var(--editorial-text)',
              border: '1.5px solid var(--editorial-border)',
              cursor: 'pointer',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(37, 40, 32, 0.16)',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            title={isAutoRotating ? 'Pause rotation' : 'Play rotation'}
          >
            {isAutoRotating ? <Pause size={12} /> : <Play size={12} fill="currentColor" />}
            <span>{isAutoRotating ? 'Pause' : 'Play'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
