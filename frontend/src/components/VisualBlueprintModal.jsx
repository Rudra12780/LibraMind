import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Image as ImageIcon,
  Printer,
  FileText,
  Sparkles,
  Camera,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  ChevronRight
} from 'lucide-react';
import {
  BLUEPRINT_PAGES,
  downloadPageSVG,
  downloadPagePNG,
  downloadDesignThinkingJPG,
  downloadAllBlueprintsZIP,
  downloadAllBlueprintsSVG,
  downloadAllBlueprintsPNG,
  printSingleBlueprint,
  printAllBlueprints
} from '../data/visualBlueprints';

export default function VisualBlueprintModal({ isOpen, onClose, initialPage = 'home' }) {
  const [selectedPageId, setSelectedPageId] = useState(initialPage);
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState('svg'); // 'svg' or 'jpg'

  useEffect(() => {
    if (initialPage) {
      setSelectedPageId(initialPage);
    }
  }, [initialPage, isOpen]);

  if (!isOpen) return null;

  const activePage = BLUEPRINT_PAGES.find(p => p.id === selectedPageId) || BLUEPRINT_PAGES[0];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(20, 25, 22, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          color: 'var(--editorial-text)',
          width: '100%',
          maxWidth: '1240px',
          height: '95vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--editorial-border)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '12px 24px',
            borderBottom: '2.5px solid var(--editorial-text)',
            backgroundColor: 'var(--editorial-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          {/* Title Branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                backgroundColor: 'var(--editorial-text)',
                border: '1px solid var(--editorial-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}
            >
              <FileText size={20} color="#FFFFFF" strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--editorial-text)',
                    padding: '2px 8px',
                    border: '1px solid var(--editorial-border)'
                  }}
                >
                  UI Blueprint Portfolio
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--editorial-text)', fontWeight: 700 }}>
                  Page {activePage.pageNumber} of {BLUEPRINT_PAGES.length}: {activePage.shortTitle} · Balsamiq Low-Fi Wireframe
                </span>
              </div>
              <h2
                style={{
                  margin: '2px 0 0',
                  fontSize: '1.20rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  color: 'var(--editorial-text)'
                }}
              >
                LibraMind – {activePage.name}
              </h2>
            </div>
          </div>

          {/* Action Controls & Close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {activePage.id === 'home' && (
              <div
                style={{
                  display: 'flex',
                  backgroundColor: '#EEEEEE',
                  padding: '3px',
                  borderRadius: '8px',
                  border: '1px solid #DDDDDD'
                }}
              >
                <button
                  onClick={() => setViewMode('svg')}
                  style={{
                    background: viewMode === 'svg' ? '#FFFFFF' : 'transparent',
                    color: '#111111',
                    border: 'none',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: viewMode === 'svg' ? 800 : 500,
                    cursor: 'pointer',
                    boxShadow: viewMode === 'svg' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  📐 Vector (.SVG)
                </button>
                <button
                  onClick={() => setViewMode('jpg')}
                  style={{
                    background: viewMode === 'jpg' ? '#FFFFFF' : 'transparent',
                    color: '#111111',
                    border: 'none',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: viewMode === 'jpg' ? 800 : 500,
                    cursor: 'pointer',
                    boxShadow: viewMode === 'jpg' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  📸 Photo (.JPG)
                </button>
              </div>
            )}

            {/* Download All 21 ZIP Package */}
            <button
              onClick={downloadAllBlueprintsZIP}
              style={{
                background: 'linear-gradient(135deg, var(--forest-dark) 0%, var(--botanical) 100%)',
                color: '#FFFFFF',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(52,78,65,0.25)'
              }}
              title="Download all 21 wireframe SVG files in a single .ZIP file"
            >
              <Download size={13} /> Download All 21 (.ZIP)
            </button>

            {/* Print All 21 Pages */}
            <button
              onClick={printAllBlueprints}
              style={{
                background: '#000000',
                color: '#FFFFFF',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
              title="Print or export all 21 pages in a single portrait document for Word"
            >
              <Printer size={13} /> Print All 21 Pages (Word Ready)
            </button>

            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid #CCCCCC',
                backgroundColor: '#FFFFFF',
                color: '#333333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Close Blueprint Modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 21-Page Navigation Tab Bar */}
        <div
          style={{
            padding: '8px 20px',
            backgroundColor: '#F5F5F5',
            borderBottom: '1px solid #E0E0E0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#333333', whiteSpace: 'nowrap', marginRight: '4px' }}>
            All 21 Pages:
          </span>
          {BLUEPRINT_PAGES.map((page) => {
            const isSelected = page.id === selectedPageId;
            return (
              <button
                key={page.id}
                onClick={() => {
                  setSelectedPageId(page.id);
                  if (page.id !== 'home') setViewMode('svg');
                }}
                style={{
                  background: isSelected ? '#111111' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#222222',
                  border: isSelected ? '1.5px solid #000000' : '1px solid #CCCCCC',
                  padding: '5px 12px',
                  borderRadius: '16px',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 800 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.18)' : 'none',
                  transition: 'all 0.15s ease',
                  flexShrink: 0
                }}
              >
                <span>{page.pageNumber}. {page.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Blueprint Layout Specifications Strip for Selected Page */}
        <div
          style={{
            padding: '7px 24px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #EAEAEA',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            overflowX: 'auto',
            fontSize: '0.74rem',
            color: '#444444',
            scrollbarWidth: 'none'
          }}
        >
          <strong style={{ color: '#000000', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
            Included Sections:
          </strong>
          {activePage.sections.map((sec, i) => (
            <React.Fragment key={i}>
              <span style={{ whiteSpace: 'nowrap' }}>{sec}</span>
              {i < activePage.sections.length - 1 && <span style={{ color: '#AAAAAA' }}>·</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Canvas Viewport */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#EDEDED'
          }}
        >
          <div
            style={{
              width: `${880 * zoom}px`,
              maxWidth: '100%',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
              borderRadius: '8px',
              border: '1.5px solid #000000',
              overflow: 'hidden',
              transition: 'transform 0.15s ease'
            }}
          >
            {activePage.id === 'home' && viewMode === 'jpg' ? (
              <img
                src="/libramind-design-thinking-wireframe.jpg"
                alt="LibraMind Design Thinking Wireframe Blueprint"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            ) : (
              <div
                style={{ width: '100%', height: 'auto', display: 'block' }}
                dangerouslySetInnerHTML={{ __html: activePage.svg }}
              />
            )}
          </div>
        </div>

        {/* Bottom Toolbar: Zoom Controls & Download Buttons */}
        <div
          style={{
            padding: '12px 24px',
            backgroundColor: '#FAFAFA',
            borderTop: '1px solid #E0E0E0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          {/* Zoom controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#666666', fontWeight: 600 }}>Zoom:</span>
            <button
              onClick={() => setZoom(Math.max(0.6, zoom - 0.15))}
              style={{
                background: '#FFFFFF',
                color: '#111111',
                border: '1px solid #CCCCCC',
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.78rem'
              }}
              title="Zoom Out"
            >
              <ZoomOut size={13} />
            </button>
            <span style={{ fontSize: '0.80rem', fontWeight: 700, color: '#111111', minWidth: '40px', textAlign: 'center' }}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(Math.min(1.6, zoom + 0.15))}
              style={{
                background: '#FFFFFF',
                color: '#111111',
                border: '1px solid #CCCCCC',
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.78rem'
              }}
              title="Zoom In"
            >
              <ZoomIn size={13} />
            </button>
            <button
              onClick={() => setZoom(1)}
              style={{
                background: 'transparent',
                color: '#444444',
                border: 'none',
                fontSize: '0.76rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                marginLeft: '4px',
                textDecoration: 'underline'
              }}
            >
              <RotateCcw size={11} /> Reset (100%)
            </button>
          </div>

          {/* Action Download Buttons for Active Page */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Download All 21 ZIP Package */}
            <button
              onClick={downloadAllBlueprintsZIP}
              style={{
                background: 'linear-gradient(135deg, var(--forest-dark) 0%, var(--botanical) 100%)',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(52,78,65,0.22)'
              }}
              title="Download all 21 wireframe blueprint files in one .ZIP archive"
            >
              <Download size={14} /> Download All 21 (.ZIP)
            </button>

            {/* Download Vector (.SVG) */}
            <button
              onClick={() => downloadPageSVG(activePage.id)}
              style={{
                background: '#111111',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
              title={`Download scalable vector file for ${activePage.shortTitle}`}
            >
              <Download size={14} /> .SVG
            </button>

            {/* Download Image (.PNG) */}
            <button
              onClick={() => downloadPagePNG(activePage.id)}
              style={{
                background: '#FFFFFF',
                color: '#111111',
                border: '1px solid #CCCCCC',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                cursor: 'pointer'
              }}
              title={`Download raster PNG image for ${activePage.shortTitle}`}
            >
              <ImageIcon size={14} /> .PNG
            </button>

            {/* Print / Save as PDF for Word */}
            <button
              onClick={() => printSingleBlueprint(activePage.id)}
              style={{
                background: '#EAEAEA',
                color: '#111111',
                border: '1px solid #B0B0B0',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                cursor: 'pointer'
              }}
              title="Print or export portrait PDF for Word Document"
            >
              <Printer size={14} /> Print Page (Word Ready)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
