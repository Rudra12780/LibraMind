import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause
} from 'lucide-react';
import { getOfflineBookCover, handleBookCoverError } from '../utils/offlineCovers';

const EMPTY_SET = new Set();
const EMPTY_ARRAY = [];

// Deep Archival Library Leather & Bookcloth Palettes (Authentic physical hardcover colors)
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
  _onBorrow,
  _onReturn,
  _onReserve,
  _onToggleWishlist,
  _wishlistIds = EMPTY_SET,
  _onToggleCompare,
  _compareBookIds = EMPTY_ARRAY,
  _onAddToPlanner,
  _userBorrowedBookIds = EMPTY_SET
}) {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // RAF Direct Refs for 60fps buttery-smooth hardware acceleration
  const targetAngleRef = useRef(0);
  const currentAngleRef = useRef(0);
  const bookElsRef = useRef([]);
  const hoveredIndexRef = useRef(null);
  const selectedIndexRef = useRef(null);
  const isDraggingRef = useRef(false);
  const isAutoRotatingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const dragStartRef = useRef({ centerX: 0, centerY: 0, prevAngle: 0, startY: 0, startX: 0 });

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

  useEffect(() => {
    isAutoRotatingRef.current = isAutoRotating;
  }, [isAutoRotating]);

  useEffect(() => {
    hoveredIndexRef.current = hoveredIndex;
  }, [hoveredIndex]);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  // Category specification:
  // - "All" Category: ONLY show real book spines along the wheel.
  // - All other categories: Show upright front covers along the wheel with adaptive radius.
  const isAllOption = !category || category === 'All' || category === 'all';
  const isSpineMode = isAllOption;

  // Display books in this view
  const displayBooks = useMemo(() => {
    return books || [];
  }, [books]);

  const N = Math.max(1, displayBooks.length);

  // ═══════════════════════════════════════════════════════════════════════
  // DYNAMIC SIZING & PROPORTIONAL RADIUS ADAPTATION:
  // - Spine Mode (All Categories): Authentic 360° library rotunda wheel
  // - Front Cover Mode (Other Categories): Radius adapts to book count N
  //   (If 5 books, creates a compact, neat circle so it never looks empty)
  // ═══════════════════════════════════════════════════════════════════════
  const { carouselSize, shelfRadius, innerHubDiameter, cardW, cardH } = useMemo(() => {
    if (isSpineMode) {
      // ── ALL BOOKS CATEGORY: REAL HARDCOVER SPINES ──
      const h = isMobile ? 58 : (isTablet ? 78 : 94);
      let w;
      if (isMobile) {
        w = N <= 20 ? 13 : (N <= 50 ? 8.5 : (N <= 80 ? 6.5 : 5.5));
      } else if (isTablet) {
        w = N <= 20 ? 22 : (N <= 50 ? 15 : (N <= 80 ? 11 : 9.5));
      } else {
        w = N <= 20 ? 26 : (N <= 50 ? 18 : (N <= 80 ? 13 : 10.5));
      }

      const size = isMobile ? Math.min(windowWidth - 28, 330) : (isTablet ? 490 : 600);
      const radius = isMobile ? Math.round(size * 0.36) : (isTablet ? 180 : 224);
      const hub = isMobile ? Math.round(size * 0.42) : (isTablet ? 230 : 280);

      return {
        carouselSize: size,
        shelfRadius: radius,
        innerHubDiameter: hub,
        cardW: w,
        cardH: h
      };
    }

    // ── ALL OTHER CATEGORIES: FRONT COVERS WITH ADAPTIVE RADIUS ──
    let w, h;
    if (isMobile) {
      if (N <= 5) { w = 46; h = 68; }
      else if (N <= 8) { w = 42; h = 62; }
      else if (N <= 14) { w = 38; h = 56; }
      else if (N <= 20) { w = 34; h = 50; }
      else { w = 28; h = 42; }
    } else if (isTablet) {
      if (N <= 5) { w = 62; h = 92; }
      else if (N <= 8) { w = 56; h = 84; }
      else if (N <= 14) { w = 50; h = 74; }
      else if (N <= 20) { w = 44; h = 66; }
      else { w = 38; h = 56; }
    } else {
      // Desktop / Laptop
      if (N <= 5) { w = 72; h = 106; }
      else if (N <= 8) { w = 66; h = 98; }
      else if (N <= 14) { w = 58; h = 86; }
      else if (N <= 20) { w = 50; h = 74; }
      else { w = 44; h = 65; }
    }

    // Circumference gap between adjacent book edges:
    let desiredGap;
    if (isMobile) {
      desiredGap = N <= 4 ? 20 : (N <= 8 ? 16 : 12);
    } else {
      desiredGap = N <= 4 ? 32 : (N <= 6 ? 26 : (N <= 12 ? 22 : 18));
    }

    // Circumference C = 2 * PI * R => R = N * (w + desiredGap) / (2 * PI)
    const idealR = (N * (w + desiredGap)) / (2 * Math.PI);

    // Bounds: compact when N <= 5, spacious when N is large
    const minR = isMobile ? 78 : 120;
    const maxR = isMobile ? 122 : 225;
    const radius = Math.round(Math.min(maxR, Math.max(minR, idealR)));

    const size = isMobile
      ? Math.min(windowWidth - 28, Math.round(radius * 2 + h + 22))
      : Math.round(radius * 2 + h + 42);

    const hub = Math.round(
      Math.max(
        isMobile ? 96 : 130,
        radius * 2 - h - (isMobile ? 14 : 28)
      )
    );

    return {
      carouselSize: size,
      shelfRadius: radius,
      innerHubDiameter: hub,
      cardW: w,
      cardH: h
    };
  }, [isSpineMode, N, isMobile, isTablet, windowWidth]);

  const centerRadius = carouselSize / 2;

  // ═══════════════════════════════════════════════════════════════════════
  // 60FPS HARDWARE-ACCELERATED CIRCULAR ROTARY ENGINE
  // Spines radiate outward as spokes; Front covers sit along shelf arc
  // ═══════════════════════════════════════════════════════════════════════
  const applyCarouselPositions = useCallback((angle, scrollSpeed = 0) => {
    if (!containerRef.current) return;
    const total = displayBooks.length;
    if (total === 0) return;

    const step = 360 / total;

    for (let i = 0; i < total; i++) {
      const el = bookElsRef.current[i];
      if (!el) continue;

      const angleDeg = (i * step + angle - 90) % 360;
      const angleRad = (angleDeg * Math.PI) / 180;

      // 3D Perspective Depth: foreground slightly forward, background receding
      const depthNorm = (Math.sin(angleRad) + 1) / 2;
      const scrollRecess = Math.min(0.06, scrollSpeed * 0.05);
      const baseScale = isSpineMode ? (0.88 + 0.12 * depthNorm) : (0.90 + 0.10 * depthNorm);
      const scale = Math.max(0.80, baseScale * (1 - scrollRecess));

      // Radial spoke angle: points cleanly outward from center
      const rot = (angleDeg + 90).toFixed(1);

      const isHov = hoveredIndexRef.current === i;
      const isSel = selectedIndexRef.current === i;
      const isActive = isHov || isSel;

      if (isActive) {
        // Active volume pulls proudly outward along its radial spoke
        const pullDist = isSpineMode ? (isMobile ? 14 : 22) : (isMobile ? 8 : 14);
        const posX = centerRadius + (shelfRadius + pullDist) * Math.cos(angleRad) - cardW / 2;
        const posY = centerRadius + (shelfRadius + pullDist) * Math.sin(angleRad) - cardH / 2;
        el.style.transform = `translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, 0) rotate(${rot}deg) scale(${isMobile ? 1.08 : 1.15})`;
        el.style.zIndex = 300;
        el.style.opacity = '1';
      } else {
        const posX = centerRadius + shelfRadius * Math.cos(angleRad) - cardW / 2;
        const posY = centerRadius + shelfRadius * Math.sin(angleRad) - cardH / 2;
        el.style.transform = `translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, 0) rotate(${rot}deg) scale(${scale.toFixed(3)})`;
        el.style.zIndex = Math.round(10 + depthNorm * 30);
        el.style.opacity = isSpineMode ? (0.76 + 0.24 * depthNorm).toFixed(2) : (0.80 + 0.20 * depthNorm).toFixed(2);
      }
    }
  }, [displayBooks, centerRadius, shelfRadius, cardW, cardH, isSpineMode, isMobile]);

  // RequestAnimationFrame rotation loop
  useEffect(() => {
    let animId;
    const tick = () => {
      if (isAutoRotatingRef.current && !isDraggingRef.current && hoveredIndexRef.current === null) {
        targetAngleRef.current += 0.22;
      }

      const diff = targetAngleRef.current - currentAngleRef.current;
      const scrollSpeed = Math.min(1.5, Math.abs(diff) / 2.0);
      if (Math.abs(diff) > 0.005) {
        currentAngleRef.current += diff * 0.18;
        applyCarouselPositions(currentAngleRef.current, scrollSpeed);
      } else {
        applyCarouselPositions(currentAngleRef.current, 0);
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [applyCarouselPositions]);

  // Reset angle when books or category change
  useEffect(() => {
    targetAngleRef.current = 0;
    currentAngleRef.current = 0;
    setHoveredIndex(null);
    setSelectedIndex(null);
    applyCarouselPositions(0, 0);
  }, [books, category, applyCarouselPositions]);

  // Active book determination
  const activeIndex = hoveredIndex !== null ? hoveredIndex : selectedIndex;
  const activeBook = activeIndex !== null ? displayBooks[activeIndex] : null;
  const activeBookId = activeBook ? (activeBook.id !== undefined ? activeBook.id : activeBook._id) : null;
  const activeCoverUrl = activeBook ? (activeBook.cover_image || getOfflineBookCover(activeBook.title, activeBook.author, activeBook.category)) : null;

  // Wheel interaction: scroll only when cursor is directly over the circle
  useEffect(() => {
    const stageEl = containerRef.current;
    if (!stageEl) return;

    const handleWheelEvent = (e) => {
      const rect = stageEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const r = rect.width / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      if (dist > r) return;

      e.preventDefault();
      e.stopPropagation();
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      targetAngleRef.current += delta > 0 ? 3.6 : -3.6;
    };

    stageEl.addEventListener('wheel', handleWheelEvent, { passive: false });
    return () => stageEl.removeEventListener('wheel', handleWheelEvent);
  }, []);

  // Rotary steering wheel drag handlers (Desktop pointer & Mobile touch unified)
  const handlePointerDown = (e) => {
    if (!containerRef.current) return;
    try {
      e.target.setPointerCapture(e.pointerId);
    } catch (_) {}
    isDraggingRef.current = true;
    setIsDragging(true);
    hasMovedRef.current = false;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const startAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
    dragStartRef.current = {
      centerX: cx,
      centerY: cy,
      prevAngle: startAngle,
      startX: e.clientX,
      startY: e.clientY
    };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      hasMovedRef.current = true;
    }
    const { centerX, centerY, prevAngle } = dragStartRef.current;
    const curAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    let delta = curAngle - prevAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    targetAngleRef.current += delta;
    dragStartRef.current.prevAngle = curAngle;
  };

  const handlePointerUp = (e) => {
    try {
      if (e?.target?.releasePointerCapture) {
        e.target.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  if (!books || books.length === 0) {
    return null;
  }

  return (
    <div
      ref={wrapperRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        maxWidth: '100vw',
        margin: isMobile ? '0 auto 20px' : '0 auto 36px',
        userSelect: 'none'
      }}
    >
      {/* Action Bar: Play/Pause continuous rotation */}
      {displayBooks.length > 1 && (
        <div
          style={{
            width: '100%',
            maxWidth: `${carouselSize}px`,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: isMobile ? '8px' : '14px',
            padding: '0 8px'
          }}
        >
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className="btn btn-outline btn-sm"
            style={{
              padding: isMobile ? '3px 10px' : '4px 12px',
              fontSize: isMobile ? '0.70rem' : '0.76rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              borderRadius: '9999px',
              backgroundColor: isAutoRotating ? 'var(--editorial-green)' : '#FFFFFF',
              color: isAutoRotating ? '#FFFFFF' : 'var(--editorial-text)',
              borderColor: isAutoRotating ? 'var(--editorial-green)' : 'var(--editorial-border)',
              boxShadow: '0 2px 6px rgba(37, 40, 32, 0.08)',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            title={isAutoRotating ? 'Pause rotation' : 'Play continuous 360° rotation'}
          >
            {isAutoRotating ? <Pause size={isMobile ? 10 : 11} /> : <Play size={isMobile ? 10 : 11} />}
            <span>{isAutoRotating ? 'Pause' : 'Play'}</span>
          </button>
        </div>
      )}

      {/* ── 360° Round / Circular Bookshelf Stage ── */}
      <div
        ref={containerRef}
        onPointerDown={(e) => {
          if (e.target === containerRef.current) {
            setSelectedIndex(null);
            setHoveredIndex(null);
          }
          handlePointerDown(e);
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          position: 'relative',
          width: `${carouselSize}px`,
          height: `${carouselSize}px`,
          maxWidth: 'calc(100vw - 20px)',
          maxHeight: 'calc(100vw - 20px)',
          borderRadius: '50%',
          backgroundColor: '#FAF8F4',
          boxShadow: `
            0 28px 64px -8px rgba(37, 40, 32, 0.24),
            0 12px 28px -4px rgba(37, 40, 32, 0.14),
            inset 0 0 0 ${isMobile ? '8px' : '12px'} #FFFFFF,
            inset 0 0 0 ${isMobile ? '10px' : '14px'} var(--editorial-border),
            inset 0 16px 36px rgba(37, 40, 32, 0.08)
          `,
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
          margin: '0 auto'
        }}
      >
        {/* Outermost Architectural White Wall Rim Bezel */}
        <div
          style={{
            position: 'absolute',
            inset: isMobile ? '-6px' : '-10px',
            borderRadius: '50%',
            border: `${isMobile ? '10px' : '16px'} solid #FFFFFF`,
            boxShadow: '0 8px 30px rgba(37, 40, 32, 0.14), inset 0 2px 4px rgba(0,0,0,0.06)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        {/* Circular Recessed Shelf Track Floor Ring */}
        <div
          style={{
            position: 'absolute',
            width: `${shelfRadius * 2}px`,
            height: `${shelfRadius * 2}px`,
            borderRadius: '50%',
            border: '2px solid rgba(212, 175, 55, 0.32)',
            boxShadow: 'inset 0 1px 4px rgba(37, 40, 32, 0.04)',
            pointerEvents: 'none',
            zIndex: 2
          }}
        />

        {/* ═════════════════════════════════════════════════════════ */}
        {/* BOOKS POSITIONED ALONG THE CIRCULAR PATH                  */}
        {/* Mode A (isSpineMode): PROPER ORIGINAL BOOK SPINES ONLY    */}
        {/* Mode B (!isSpineMode): Upright Book Front Covers          */}
        {/* ═════════════════════════════════════════════════════════ */}
        {displayBooks.map((book, idx) => {
          const bId = book.id !== undefined ? book.id : book._id;
          const isHov = hoveredIndex === idx;
          const isSel = selectedIndex === idx;
          const isActive = isHov || isSel;
          const coverUrl = book.cover_image || getOfflineBookCover(book.title, book.author, book.category);
          const isBookAvailable = book.available_copies !== undefined ? book.available_copies > 0 : true;
          const spineTheme = getArchivalSpineTheme(book, idx);

          return (
            <div
              key={bId || idx}
              ref={el => (bookElsRef.current[idx] = el)}
              onMouseEnter={() => {
                if (!isMobile) setHoveredIndex(idx);
              }}
              onMouseLeave={() => {
                if (!isMobile) setHoveredIndex(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (hasMovedRef.current) return;
                setSelectedIndex(idx);
                if (onViewDetails) {
                  onViewDetails(bId);
                }
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${cardW}px`,
                height: `${cardH}px`,
                willChange: 'transform',
                zIndex: isActive ? 300 : 15,
                cursor: 'pointer'
              }}
              title={`${book.title} by ${book.author}`}
            >
              {isSpineMode ? (
                /* ═════════════════════════════════════════════════════════ */
                /* ALL CATEGORIES: AUTHENTIC ORIGINAL BOOK SPINE             */
                /* Slender hardcover physical spine with archival textures   */
                /* ═════════════════════════════════════════════════════════ */
                <div
                  className="shelf-spine-card"
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    borderRadius: isMobile ? '2.5px' : '3px',
                    backgroundColor: spineTheme.bg,
                    overflow: 'hidden',
                    boxShadow: isActive
                      ? '0 18px 38px rgba(0, 0, 0, 0.65), 0 0 0 2.5px #E5C158'
                      : '0 2px 6px rgba(0, 0, 0, 0.40), inset 1px 0 2px rgba(255,255,255,0.18), inset -1px 0 2px rgba(0,0,0,0.5)',
                    borderLeft: '1.5px solid rgba(255, 255, 255, 0.18)',
                    borderRight: `1.5px solid ${spineTheme.border}`,
                    transformOrigin: 'center center',
                    pointerEvents: 'auto',
                    transition: 'box-shadow 0.2s ease, border-color 0.2s ease'
                  }}
                >
                  {/* Spine Face: Real archival hardcover texture */}
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
                      loading="eager"
                      decoding="async"
                      onError={(e) => handleBookCoverError(e, book.title, book.author, book.category)}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'left center',
                        opacity: 0.82,
                        filter: 'contrast(1.08) brightness(0.96)',
                        pointerEvents: 'none'
                      }}
                    />

                    {/* 3D Cylindrical Spine Sheen */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.08) 16%, rgba(255,255,255,0.30) 38%, rgba(255,255,255,0.06) 62%, rgba(0,0,0,0.18) 84%, rgba(0,0,0,0.72) 100%)',
                        pointerEvents: 'none'
                      }}
                    />

                    {/* Raised Horizontal Ribs */}
                    <div style={{ position: 'absolute', top: '22%', left: '6%', right: '6%', height: '1.5px', backgroundColor: spineTheme.rib, opacity: 0.65, boxShadow: '0 1px 1px rgba(0,0,0,0.7)', pointerEvents: 'none', zIndex: 2 }} />
                    <div style={{ position: 'absolute', top: '78%', left: '6%', right: '6%', height: '1.5px', backgroundColor: spineTheme.rib, opacity: 0.65, boxShadow: '0 1px 1px rgba(0,0,0,0.7)', pointerEvents: 'none', zIndex: 2 }} />

                    {/* Top Headband Trim */}
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px', zIndex: 3, pointerEvents: 'none' }}>
                      <div style={{ width: '92%', height: isMobile ? '2px' : '2.5px', backgroundColor: spineTheme.rib, opacity: 0.95, borderRadius: '1px' }} />
                      <div style={{ width: '75%', height: '1px', backgroundColor: 'rgba(0,0,0,0.6)' }} />
                    </div>

                    {/* Vertical Book Title Typography */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', width: '100%', zIndex: 3, pointerEvents: 'none', padding: '2px 0' }}>
                      <span
                        style={{
                          writingMode: 'vertical-rl',
                          textOrientation: 'mixed',
                          transform: 'rotate(180deg)',
                          fontSize: isMobile ? (cardW > 10 ? '7px' : '5.5px') : (cardW > 24 ? '8px' : '6.5px'),
                          fontFamily: "'Noto Sans Devanagari', 'Lohit Devanagari', 'Mangal', Georgia, serif",
                          fontWeight: 700,
                          letterSpacing: '0.02em',
                          color: spineTheme.text,
                          textShadow: '0 1px 3px rgba(0,0,0,0.98), 0 0 2px rgba(0,0,0,0.95)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: 1,
                          maxHeight: `${cardH - 18}px`,
                          userSelect: 'none'
                        }}
                      >
                        {book.title}
                      </span>
                    </div>

                    {/* Bottom Headband & Availability Pip */}
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px', zIndex: 3, pointerEvents: 'none' }}>
                      <div style={{ width: '75%', height: '1px', backgroundColor: 'rgba(0,0,0,0.6)' }} />
                      <div style={{ width: '92%', height: isMobile ? '1.5px' : '2px', backgroundColor: spineTheme.rib, opacity: 0.90, borderRadius: '1px' }} />
                      <span
                        style={{
                          marginTop: '1px',
                          width: isMobile ? '3px' : '4px',
                          height: isMobile ? '3px' : '4px',
                          borderRadius: '50%',
                          backgroundColor: isBookAvailable ? '#2E7D32' : '#C62828',
                          border: '0.5px solid #FFFFFF',
                          pointerEvents: 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* ═════════════════════════════════════════════════════════ */
                /* OTHER CATEGORIES: UPRIGHT FRONT BOOK COVERS               */
                /* ═════════════════════════════════════════════════════════ */
                <div
                  className="shelf-front-cover-card"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: isMobile ? '3.5px' : '5px',
                    backgroundColor: '#FFFFFF',
                    overflow: 'hidden',
                    border: isActive
                      ? '2.5px solid #E5C158'
                      : '1px solid rgba(0, 0, 0, 0.16)',
                    boxShadow: isActive
                      ? '0 18px 36px -4px rgba(37, 40, 32, 0.45), 0 0 0 2px #E5C158'
                      : '0 4px 12px -2px rgba(37, 40, 32, 0.20)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transformOrigin: 'center center',
                    transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                    pointerEvents: 'auto'
                  }}
                >
                  <img
                    src={coverUrl}
                    alt={book.title}
                    loading="eager"
                    decoding="async"
                    onError={(e) => handleBookCoverError(e, book.title, book.author, book.category)}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Subtle Hardcover Hinge Crease Shadow */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      width: isMobile ? '4px' : '6px',
                      background: 'linear-gradient(90deg, rgba(0,0,0,0.30) 0%, rgba(255,255,255,0.15) 20%, transparent 100%)',
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Status Indicator Pip */}
                  <span
                    style={{
                      position: 'absolute',
                      top: isMobile ? '3px' : '4px',
                      right: isMobile ? '3px' : '4px',
                      width: isMobile ? '5px' : '7px',
                      height: isMobile ? '5px' : '7px',
                      borderRadius: '50%',
                      backgroundColor: isBookAvailable ? '#2E7D32' : '#C62828',
                      border: '1px solid #FFFFFF',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                      pointerEvents: 'none'
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* ═════════════════════════════════════════════════════════ */}
        {/* CENTER DISC: BOOK PROPER SHOWCASE ONLY                    */}
        {/* Prominent front cover, category, title, author.           */}
        {/* No options or buttons below the books (clean display).    */}
        {/* ═════════════════════════════════════════════════════════ */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (activeBookId && onViewDetails) {
              onViewDetails(activeBookId);
            }
          }}
          style={{
            position: 'absolute',
            width: `${innerHubDiameter}px`,
            height: `${innerHubDiameter}px`,
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '2px solid #E2DDD0',
            boxShadow: `
              0 14px 32px rgba(37, 40, 32, 0.10),
              inset 0 0 0 ${innerHubDiameter < 150 ? '3px' : '5px'} #FAF8F4,
              inset 0 0 0 ${innerHubDiameter < 150 ? '5px' : '7px'} rgba(212, 175, 55, 0.28)
            `,
            zIndex: 60,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: innerHubDiameter < 150 ? '8px 10px' : '14px 18px',
            pointerEvents: 'auto',
            overflow: 'hidden',
            cursor: activeBook ? 'pointer' : 'default'
          }}
          title={activeBook ? `${activeBook.title} by ${activeBook.author}` : 'Circular Bookshelf'}
        >
          {activeBook ? (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                overflow: 'hidden'
              }}
            >
              {/* Proper Front Cover Artwork in the Middle */}
              {activeCoverUrl && (
                <div
                  style={{
                    width: innerHubDiameter < 150 ? '38px' : (innerHubDiameter < 190 ? '48px' : (innerHubDiameter < 240 ? '60px' : '72px')),
                    height: innerHubDiameter < 150 ? '56px' : (innerHubDiameter < 190 ? '70px' : (innerHubDiameter < 240 ? '88px' : '104px')),
                    borderRadius: '4px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 22px rgba(0,0,0,0.30)',
                    marginBottom: innerHubDiameter < 150 ? '3px' : '6px',
                    flexShrink: 0
                  }}
                >
                  <img
                    src={activeCoverUrl}
                    alt={activeBook.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => handleBookCoverError(e, activeBook.title, activeBook.author, activeBook.category)}
                  />
                </div>
              )}

              {/* Category Badge */}
              <span
                style={{
                  fontSize: innerHubDiameter < 150 ? '0.52rem' : (innerHubDiameter < 190 ? '0.58rem' : '0.64rem'),
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: 'var(--editorial-accent)',
                  textTransform: 'uppercase',
                  marginBottom: '2px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '92%'
                }}
              >
                {activeBook.category || 'LIBRARY VOLUME'}
              </span>

              {/* Book Title */}
              <h4
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: innerHubDiameter < 150 ? '0.78rem' : (innerHubDiameter < 190 ? '0.88rem' : '1.02rem'),
                  fontWeight: 800,
                  color: 'var(--editorial-text)',
                  lineHeight: 1.15,
                  margin: '0 0 2px',
                  display: '-webkit-box',
                  WebkitLineClamp: innerHubDiameter < 150 ? 1 : 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {activeBook.title}
              </h4>

              {/* Author */}
              <p
                style={{
                  fontSize: innerHubDiameter < 150 ? '0.58rem' : (innerHubDiameter < 190 ? '0.64rem' : '0.72rem'),
                  color: 'var(--editorial-text-muted)',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '92%'
                }}
              >
                {activeBook.author}
              </p>
            </div>
          ) : (
            /* Neutral State: Clean prompt when no volume is actively hovered */
            <div
              style={{
                color: 'var(--editorial-text-muted)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: innerHubDiameter < 150 ? '4px' : '10px',
                textAlign: 'center',
                userSelect: 'none'
              }}
            >
              <span
                style={{
                  fontSize: innerHubDiameter < 150 ? '0.76rem' : (innerHubDiameter < 180 ? '0.86rem' : '0.96rem'),
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--editorial-text)',
                  fontWeight: 700,
                  marginBottom: '2px',
                  whiteSpace: 'nowrap'
                }}
              >
                No Book Selected
              </span>

              <span
                style={{
                  fontSize: innerHubDiameter < 150 ? '0.52rem' : (innerHubDiameter < 180 ? '0.58rem' : '0.66rem'),
                  color: 'var(--editorial-text-muted)',
                  lineHeight: 1.3,
                  maxWidth: innerHubDiameter < 150 ? '110px' : (innerHubDiameter < 180 ? '140px' : '170px')
                }}
              >
                {displayBooks.length === 1
                  ? '1 volume in this category'
                  : `All ${displayBooks.length} volumes in this view • Hover or click any book`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
