import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Layers,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle2,
  ExternalLink,
  Compass,
  Grid,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Eye,
  SlidersHorizontal,
  Bookmark
} from 'lucide-react';
import {
  BLUEPRINT_PAGES,
  downloadPageSVG,
  downloadPagePNG,
  downloadAllBlueprintsZIP,
  downloadAllBlueprintsSVG,
  downloadAllBlueprintsPNG,
  printSingleBlueprint,
  printAllBlueprints,
  getThumbnailSVG
} from '../data/visualBlueprints';
import { BLUEPRINT_MARKDOWN } from '../data/blueprintsData';

export default function BlueprintsPage({ onNavigate, initialPageId = 'home', onOpenPresentation }) {
  const [selectedPageId, setSelectedPageId] = useState(initialPageId || 'home');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewLayout, setViewLayout] = useState('sheet'); // 'sheet' (full uncut single sheet), 'continuous' (all 21 sheets uncut), 'grid' (portfolio grid), 'spec' (markdown)
  const [zoom, setZoom] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const sheetContainerRef = useRef(null);

  useEffect(() => {
    if (initialPageId) {
      setSelectedPageId(initialPageId);
    }
  }, [initialPageId]);

  // Scroll to top when active blueprint changes
  useEffect(() => {
    if (viewLayout === 'sheet' && sheetContainerRef.current) {
      sheetContainerRef.current.scrollTop = 0;
    }
  }, [selectedPageId, viewLayout]);

  const activePage = useMemo(() => {
    return BLUEPRINT_PAGES.find(p => p.id === selectedPageId) || BLUEPRINT_PAGES[0];
  }, [selectedPageId]);

  const currentIndex = useMemo(() => {
    return BLUEPRINT_PAGES.findIndex(p => p.id === activePage.id);
  }, [activePage.id]);

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + BLUEPRINT_PAGES.length) % BLUEPRINT_PAGES.length;
    setSelectedPageId(BLUEPRINT_PAGES[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % BLUEPRINT_PAGES.length;
    setSelectedPageId(BLUEPRINT_PAGES[nextIdx].id);
  };

  const handleCopyMarkdown = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(BLUEPRINT_MARKDOWN);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const categories = [
    { id: 'all', label: 'All 21 Blueprints', count: 21 },
    { id: 'public', label: 'Public Tier (7)', count: 7 },
    { id: 'member', label: 'Member Sanctuary (5)', count: 5 },
    { id: 'staff_admin', label: 'Staff & Admin (3)', count: 3 },
    { id: 'security_util', label: 'Support & Docs (6)', count: 6 },
    { id: 'spec', label: 'System Spec (.MD)', count: null }
  ];

  const filteredPages = useMemo(() => {
    return BLUEPRINT_PAGES.filter(p => {
      // Category Filter
      let matchCat = true;
      if (activeCategory === 'public') matchCat = p.category === 'Public Tier';
      else if (activeCategory === 'member') matchCat = p.category === 'Member Tier';
      else if (activeCategory === 'staff_admin') matchCat = p.category === 'Staff Tier' || p.category === 'Admin Tier';
      else if (activeCategory === 'security_util') matchCat = p.category === 'Security Tier' || p.category === 'Utility Tier';

      if (!matchCat) return false;

      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.name.toLowerCase().includes(q);
        const matchRoute = p.route.toLowerCase().includes(q);
        const matchSections = (p.sections || []).some(s => s.toLowerCase().includes(q));
        const matchDesc = (p.desc || '').toLowerCase().includes(q);
        return matchTitle || matchRoute || matchSections || matchDesc;
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div
      style={{
        backgroundColor: 'var(--editorial-bg)',
        minHeight: '100vh',
        color: 'var(--editorial-text)',
        paddingBottom: '80px'
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 1. TOP HEADER & BREADCRUMB HERO                                 */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          borderBottom: '1px solid var(--editorial-border)',
          backgroundColor: '#FFF8E9',
          padding: '40px 24px 32px'
        }}
      >
        <div className="container" style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ maxWidth: '820px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 10px',
                  backgroundColor: 'var(--editorial-border)',
                  color: 'var(--editorial-text)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '10px'
                }}
              >
                <Layers size={14} strokeWidth={2.4} /> ARCHITECTURAL SYSTEM SPECIFICATION // 21 FULL WIREFRAME SHEETS
              </div>
              <h1
                style={{
                  fontSize: 'clamp(2rem, 3.8vw, 2.8rem)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                  margin: '4px 0 0'
                }}
              >
                Website Blueprints & Architecture
              </h1>
            </div>
          </div>

          {/* Category Filter Pills & Mode Toggles */}
          <div
            style={{
              marginTop: '28px',
              paddingTop: '20px',
              borderTop: '1px solid var(--editorial-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              {categories.map(cat => {
                const isActive = (cat.id === 'spec' && viewLayout === 'spec') || (viewLayout !== 'spec' && activeCategory === cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      if (cat.id === 'spec') {
                        setViewLayout('spec');
                      } else {
                        if (viewLayout === 'spec') setViewLayout('sheet');
                        setActiveCategory(cat.id);
                      }
                    }}
                    style={{
                      padding: '6px 14px',
                      fontSize: '0.80rem',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      border: isActive ? '1px solid var(--editorial-green)' : '1px solid var(--editorial-border)',
                      backgroundColor: isActive ? 'var(--editorial-green)' : '#FFF8E9',
                      color: isActive ? '#FFF8E9' : 'var(--editorial-text)',
                      transition: 'all 0.15s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* View Layout Selector (Sheet vs Continuous vs Grid vs Spec) */}
            <div
              style={{
                display: 'inline-flex',
                border: '1px solid var(--editorial-border)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--editorial-bg-subtle)',
                padding: '3px',
                gap: '2px'
              }}
            >
              <button
                onClick={() => setViewLayout('sheet')}
                style={{
                  padding: '5px 12px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  border: 'none',
                  borderRadius: 'var(--radius-xs)',
                  cursor: 'pointer',
                  backgroundColor: viewLayout === 'sheet' ? '#FFF8E9' : 'transparent',
                  color: viewLayout === 'sheet' ? 'var(--editorial-text)' : 'var(--editorial-text-muted)',
                  boxShadow: viewLayout === 'sheet' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                title="Single Sheet Uncut Inspector"
              >
                <Eye size={13} /> Full Sheet
              </button>

              <button
                onClick={() => setViewLayout('continuous')}
                style={{
                  padding: '5px 12px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  border: 'none',
                  borderRadius: 'var(--radius-xs)',
                  cursor: 'pointer',
                  backgroundColor: viewLayout === 'continuous' ? '#FFF8E9' : 'transparent',
                  color: viewLayout === 'continuous' ? 'var(--editorial-text)' : 'var(--editorial-text-muted)',
                  boxShadow: viewLayout === 'continuous' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                title="View All 21 Blueprints Continuous Uncut"
              >
                <Layers size={13} /> All 21 Continuous
              </button>

              <button
                onClick={() => setViewLayout('grid')}
                style={{
                  padding: '5px 12px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  border: 'none',
                  borderRadius: 'var(--radius-xs)',
                  cursor: 'pointer',
                  backgroundColor: viewLayout === 'grid' ? '#FFF8E9' : 'transparent',
                  color: viewLayout === 'grid' ? 'var(--editorial-text)' : 'var(--editorial-text-muted)',
                  boxShadow: viewLayout === 'grid' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                title="21-Sheet Portfolio Grid"
              >
                <Grid size={13} /> Grid Portfolio
              </button>

              <button
                onClick={() => setViewLayout('spec')}
                style={{
                  padding: '5px 12px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  border: 'none',
                  borderRadius: 'var(--radius-xs)',
                  cursor: 'pointer',
                  backgroundColor: viewLayout === 'spec' ? '#FFF8E9' : 'transparent',
                  color: viewLayout === 'spec' ? 'var(--editorial-text)' : 'var(--editorial-text-muted)',
                  boxShadow: viewLayout === 'spec' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                title="Read Architecture Specification Markdown"
              >
                <FileText size={13} /> Spec (.MD)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 2. MAIN BLUEPRINT CONTENT AREA                                 */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <main className="container" style={{ maxWidth: '1280px', margin: '32px auto 0', padding: '0 24px' }}>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* VIEW 1: FULL UNCUT SINGLE SHEET INSPECTOR (Default)           */}
        {/* ───────────────────────────────────────────────────────────── */}
        {viewLayout === 'sheet' && (
          <div style={{ display: 'grid', gridTemplateColumns: isFullScreen ? '1fr' : 'minmax(280px, 340px) 1fr', gap: '24px', alignItems: 'start' }}>
            {/* Left Page Selector Sidebar (Hidden in Fullscreen) */}
            {!isFullScreen && (
              <div
                style={{
                  backgroundColor: '#FFF8E9',
                  border: '1px solid var(--editorial-border)',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Search / Filter Pages */}
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--editorial-text-muted)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 21 blueprint sheets..."
                    style={{
                      width: '100%',
                      padding: '7px 10px 7px 32px',
                      fontSize: '0.80rem',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--editorial-border)',
                      backgroundColor: 'var(--editorial-bg-subtle)',
                      boxSizing: 'border-box'
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{ position: 'absolute', right: '8px', top: '8px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.75rem' }}
                    >
                      ×
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--editorial-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Sheets Directory ({filteredPages.length} of 21)
                  </span>
                  <span style={{ fontSize: '0.70rem', color: 'var(--editorial-text-muted)' }}>Click to Inspect</span>
                </div>

                {/* 21 Sheets List */}
                <div
                  style={{
                    maxHeight: '680px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    paddingRight: '4px'
                  }}
                >
                  {filteredPages.map(page => {
                    const isSelected = page.id === activePage.id;
                    return (
                      <button
                        key={page.id}
                        onClick={() => setSelectedPageId(page.id)}
                        style={{
                          textAlign: 'left',
                          padding: '10px 12px',
                          border: isSelected ? '1px solid var(--editorial-green)' : '1px solid var(--editorial-border)',
                          backgroundColor: isSelected ? 'var(--editorial-green)' : '#FFF8E9',
                          color: isSelected ? '#FFF8E9' : 'var(--editorial-text)',
                          borderRadius: 'var(--radius-xs)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', opacity: isSelected ? 0.9 : 0.65 }}>
                            Page {page.pageNumber} • {page.category}
                          </span>
                          <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', opacity: isSelected ? 0.85 : 0.5 }}>
                            {page.route}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, lineHeight: 1.25 }}>
                          {page.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Right: Full Uncut Blueprint Sheet Viewer */}
            <div
              style={{
                backgroundColor: '#FFF8E9',
                border: '1px solid var(--editorial-border)',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Sheet Control Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid var(--retro-brown)',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--editorial-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      SHEET {activePage.pageNumber} OF 21
                    </span>
                    <span style={{ fontSize: '0.72rem', backgroundColor: 'var(--editorial-bg-subtle)', border: '1px solid var(--editorial-border)', padding: '2px 8px', borderRadius: '6px' }}>
                      {activePage.category}
                    </span>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--editorial-text-muted)' }}>
                      http://libramind.edu{activePage.route}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 700, textTransform: 'uppercase', margin: '4px 0 0', color: 'var(--editorial-text)' }}>
                    {activePage.name}
                  </h2>
                </div>

                {/* Controls: Prev/Next, Zoom, Download, Print, Fullscreen */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {/* Prev / Next Page Buttons */}
                  <div style={{ display: 'inline-flex', border: '1px solid var(--editorial-border)', borderRadius: 'var(--radius-xs)', overflow: 'hidden' }}>
                    <button
                      onClick={handlePrev}
                      style={{ padding: '6px 10px', backgroundColor: '#FFF8E9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', borderRight: '1px solid var(--editorial-border)' }}
                      title="Previous Blueprint (Left Arrow)"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={handleNext}
                      style={{ padding: '6px 10px', backgroundColor: '#FFF8E9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      title="Next Blueprint (Right Arrow)"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Zoom Controls */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--editorial-border)', borderRadius: 'var(--radius-xs)', backgroundColor: '#FFF8E9', padding: '0 4px' }}>
                    <button
                      onClick={() => setZoom(z => Math.max(0.5, Number((z - 0.15).toFixed(2))))}
                      style={{ padding: '6px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      title="Zoom Out"
                    >
                      <ZoomOut size={14} />
                    </button>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, padding: '0 6px', fontFamily: 'var(--font-mono)' }}>
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      onClick={() => setZoom(z => Math.min(2.5, Number((z + 0.15).toFixed(2))))}
                      style={{ padding: '6px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      title="Zoom In"
                    >
                      <ZoomIn size={14} />
                    </button>
                    <button
                      onClick={() => setZoom(1)}
                      style={{ padding: '6px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', borderLeft: '1px solid var(--editorial-border)' }}
                      title="Reset Zoom to 100%"
                    >
                      <RotateCcw size={12} />
                    </button>
                  </div>

                  {/* Fullscreen Toggle */}
                  <button
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '6px 10px' }}
                    title={isFullScreen ? 'Exit Wide View' : 'Wide View (Hide Sidebar)'}
                  >
                    {isFullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  </button>

                  {/* Single Sheet Downloads */}
                  <button
                    onClick={() => downloadPageSVG(activePage.id)}
                    className="btn btn-outline btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    title="Download this uncropped sheet as SVG"
                  >
                    <Download size={13} /> SVG
                  </button>
                  <button
                    onClick={() => downloadPagePNG(activePage.id)}
                    className="btn btn-outline btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    title="Download this uncropped sheet as high-res PNG"
                  >
                    <Download size={13} /> PNG
                  </button>
                  <button
                    onClick={() => printSingleBlueprint(activePage.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    title="Print single sheet"
                  >
                    <Printer size={13} /> Print
                  </button>
                </div>
              </div>

              {/* ═════════════════════════════════════════════════════ */}
              {/* FULL UNCUT SHEET DISPLAY (NO CLIPPING, NO CUTS)       */}
              {/* ═════════════════════════════════════════════════════ */}
              <div
                ref={sheetContainerRef}
                style={{
                  width: '100%',
                  maxHeight: '680px',
                  overflowY: 'auto',
                  overflowX: 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  padding: '24px 12px',
                  backgroundColor: '#FAF8F4',
                  border: '1px solid var(--editorial-border)',
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                  scrollBehavior: 'smooth'
                }}
              >
                <div
                  style={{
                    width: `${Math.round(920 * zoom)}px`,
                    maxWidth: zoom === 1 ? '920px' : 'none',
                    aspectRatio: '920 / 1520',
                    backgroundColor: '#FFF8E9',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                    border: '1px solid #C8C4B8',
                    transition: 'width 0.2s ease',
                    flexShrink: 0
                  }}
                  dangerouslySetInnerHTML={{ __html: activePage.svg }}
                />
              </div>

              {/* Sections & Description Breakdown */}
              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--editorial-border)' }}>
                <h4 style={{ fontSize: '0.90rem', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 10px', color: 'var(--editorial-text)' }}>
                  Architectural Wireframe Sections (Page {activePage.pageNumber})
                </h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {(activePage.sections || []).map((sec, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '4px 10px',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        backgroundColor: 'var(--editorial-bg-subtle)',
                        border: '1px solid var(--editorial-border)',
                        borderRadius: '6px',
                        color: 'var(--editorial-text)'
                      }}
                    >
                      {sec}
                    </span>
                  ))}
                </div>
                <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--editorial-text)', opacity: 0.85, lineHeight: 1.45 }}>
                  {activePage.desc}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* VIEW 2: CONTINUOUS ALL-21 SHEETS UNCUT FEED                   */}
        {/* Allows continuous scrolling through all 21 full sheets       */}
        {/* ───────────────────────────────────────────────────────────── */}
        {viewLayout === 'continuous' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', alignItems: 'center' }}>
            <div
              style={{
                width: '100%',
                backgroundColor: '#FFF8E9',
                border: '1px solid var(--editorial-border)',
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--editorial-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  CONTINUOUS UNCUT ARCHITECTURAL FEED
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: '1.2rem', textTransform: 'uppercase', fontWeight: 700 }}>
                  All 21 Blueprint Sheets Stacked Uncropped
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={downloadAllBlueprintsZIP}
                  className="btn btn-primary btn-sm"
                >
                  <Download size={14} /> Download 21 ZIP
                </button>
                <button
                  onClick={printAllBlueprints}
                  className="btn btn-outline btn-sm"
                >
                  <Printer size={14} /> Print All 21
                </button>
              </div>
            </div>

            {filteredPages.map(page => (
              <div
                key={page.id}
                id={`blueprint-sheet-${page.id}`}
                style={{
                  width: '100%',
                  maxWidth: '960px',
                  backgroundColor: '#FFF8E9',
                  border: '1px solid var(--editorial-border)',
                  padding: '28px',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px'
                }}
              >
                {/* Header Strip for each page in feed */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--retro-brown)', paddingBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--editorial-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        PAGE {page.pageNumber} OF 21
                      </span>
                      <span style={{ fontSize: '0.68rem', backgroundColor: 'var(--editorial-bg-subtle)', border: '1px solid var(--editorial-border)', padding: '2px 6px' }}>
                        {page.category}
                      </span>
                    </div>
                    <h3 style={{ margin: '3px 0 0', fontSize: '1.25rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--editorial-text)' }}>
                      {page.name}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => {
                        setSelectedPageId(page.id);
                        setViewLayout('sheet');
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.74rem', padding: '4px 10px' }}
                    >
                      <Eye size={12} /> Inspect Sheet
                    </button>
                    <button
                      onClick={() => downloadPageSVG(page.id)}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.74rem', padding: '4px 10px' }}
                    >
                      <Download size={12} /> SVG
                    </button>
                  </div>
                </div>

                {/* Uncropped SVG Canvas */}
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '920 / 1520',
                    backgroundColor: '#FFF8E9',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    border: '1px solid #D2D2D2'
                  }}
                  dangerouslySetInnerHTML={{ __html: page.svg }}
                />

                {/* Section tags */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px solid var(--editorial-border)' }}>
                  {(page.sections || []).map((sec, sIdx) => (
                    <span key={sIdx} style={{ fontSize: '0.72rem', backgroundColor: 'var(--editorial-bg-subtle)', padding: '3px 8px', border: '1px solid var(--editorial-border)' }}>
                      {sec}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* VIEW 3: 21-SHEET PORTFOLIO GRID                               */}
        {/* ───────────────────────────────────────────────────────────── */}
        {viewLayout === 'grid' && (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px'
              }}
            >
              {filteredPages.map(page => (
                <div
                  key={page.id}
                  style={{
                    backgroundColor: '#FFF8E9',
                    border: '1px solid var(--editorial-border)',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setSelectedPageId(page.id);
                    setViewLayout('sheet');
                  }}
                >
                  {/* Top Sheet Header */}
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--editorial-border)', backgroundColor: '#FAF8F4' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--editorial-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        SHEET {page.pageNumber} OF 21
                      </span>
                      <span style={{ fontSize: '0.66rem', backgroundColor: '#FFF8E9', border: '1px solid var(--editorial-border)', padding: '1px 6px' }}>
                        {page.category}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, textTransform: 'uppercase', margin: 0, color: 'var(--editorial-text)', lineHeight: 1.25 }}>
                      {page.name}
                    </h3>
                  </div>

                  {/* Thumbnail Preview */}
                  <div
                    style={{
                      height: '380px',
                      backgroundColor: '#FFF8E9',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderBottom: '1px solid var(--editorial-border)',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        aspectRatio: '920 / 1520',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.10)',
                        border: '1px solid #D2D2D2',
                        pointerEvents: 'none'
                      }}
                      dangerouslySetInnerHTML={{ __html: getThumbnailSVG(page.svg) }}
                    />
                  </div>

                  {/* Footer Info & Action */}
                  <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '0.74rem', color: 'var(--editorial-text)', opacity: 0.8, lineHeight: 1.35 }}>
                      {page.desc}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px dashed var(--editorial-border)' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--editorial-accent)' }}>
                        Inspect Full Sheet Uncut →
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadPageSVG(page.id);
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--editorial-text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}
                        title="Download SVG"
                      >
                        <Download size={13} /> SVG
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* VIEW 4: SYSTEM ARCHITECTURE SPECIFICATION (.MD)               */}
        {/* ───────────────────────────────────────────────────────────── */}
        {viewLayout === 'spec' && (
          <div
            style={{
              backgroundColor: '#FFF8E9',
              border: '1px solid var(--editorial-border)',
              padding: '32px',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--retro-brown)', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--editorial-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  MARKDOWN SPECIFICATION
                </span>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 700, textTransform: 'uppercase', margin: '4px 0 0', color: 'var(--editorial-text)' }}>
                  System Architecture & Design Thinking Specs
                </h2>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleCopyMarkdown}
                  className="btn btn-outline btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  {isCopied ? <Check size={14} color="#2E7D32" /> : <Copy size={14} />}
                  <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Markdown'}</span>
                </button>

                <a
                  href={`data:text/markdown;charset=utf-8,${encodeURIComponent(BLUEPRINT_MARKDOWN)}`}
                  download="LibraMind-Architecture-Specification.md"
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={14} /> Download .MD
                </a>
              </div>
            </div>

            <pre
              style={{
                backgroundColor: 'var(--editorial-bg-subtle)',
                border: '1px solid var(--editorial-border)',
                padding: '20px',
                fontFamily: "var(--font-mono), 'Consolas', 'Fira Code', monospace",
                fontSize: '0.84rem',
                lineHeight: 1.6,
                color: 'var(--editorial-text)',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                borderRadius: '3px'
              }}
            >
              {BLUEPRINT_MARKDOWN}
            </pre>
          </div>
        )}

      </main>
    </div>
  );
}
