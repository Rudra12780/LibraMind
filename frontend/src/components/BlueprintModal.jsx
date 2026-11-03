import React, { useState } from 'react';
import {
  X,
  Download,
  FileText,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Sparkles,
  BookOpen,
  MapPin,
  Armchair,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import {
  BLUEPRINT_MARKDOWN,
  downloadBlueprintMarkdown,
  downloadBlueprintText,
  printBlueprintDocument
} from '../data/blueprintsData';

export default function BlueprintModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(BLUEPRINT_MARKDOWN);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pages = [
    { id: 'all', label: 'Full System Blueprint', icon: Layers },
    { id: 'home', label: 'Page 1: Home Sanctuary', icon: BookOpen },
    { id: 'catalog', label: 'Page 2: Catalog & Filter', icon: MapPin },
    { id: 'book-details', label: 'Page 3: Book Details & 4-Tier Stack', icon: Sparkles },
    { id: 'ai-finder', label: 'Page 4: AI Book Finder', icon: Sparkles },
    { id: 'compare', label: 'Page 5: Book Comparator', icon: Layers },
    { id: 'seats', label: 'Page 6: Study Pod Map', icon: Armchair },
    { id: 'dashboard', label: 'Page 8: Member Hub', icon: ShieldCheck }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(35, 52, 43, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          width: '100%',
          maxWidth: '1000px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--editorial-border)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 28px',
            borderBottom: '2.5px solid var(--editorial-text)',
            backgroundColor: 'var(--editorial-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  background: 'var(--editorial-text)',
                  color: '#FFFFFF',
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  padding: '2px 8px',
                  border: '1px solid var(--editorial-text)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
              >
                Official Spec
              </span>
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.4rem',
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--forest-dark)'
                }}
              >
                LibraMind Website Page Blueprints & Architecture
              </h2>
            </div>
            <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--muted-text)' }}>
              Complete wireframe hierarchy, route schema, component specifications, and backend bindings.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid var(--editorial-border)',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--forest-dark)',
              transition: 'all 0.15s ease'
            }}
            title="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Toolbar / Download Buttons Bar */}
        <div
          style={{
            padding: '14px 28px',
            backgroundColor: '#FAF5EC',
            borderBottom: '1px solid var(--subtle-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={downloadBlueprintMarkdown}
              className="btn btn-primary btn-sm"
              style={{
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '0.82rem',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(52, 78, 65, 0.2)'
              }}
            >
              <Download size={14} /> Download Markdown (.md)
            </button>

            <button
              onClick={downloadBlueprintText}
              className="btn btn-secondary btn-sm"
              style={{
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '0.82rem',
                gap: '6px'
              }}
            >
              <FileText size={14} /> Download Text Spec (.txt)
            </button>

            <button
              onClick={printBlueprintDocument}
              className="btn btn-outline btn-sm"
              style={{
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '0.82rem',
                gap: '6px',
                backgroundColor: '#FFFFFF'
              }}
            >
              <Printer size={14} /> Print / Save as PDF
            </button>
          </div>

          <button
            onClick={handleCopy}
            style={{
              background: 'none',
              border: '1px solid var(--editorial-border)',
              borderRadius: '8px',
              padding: '7px 12px',
              fontSize: '0.80rem',
              fontWeight: 600,
              color: copied ? 'var(--status-available-text)' : 'var(--forest-dark)',
              backgroundColor: copied ? 'var(--status-available-bg)' : '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied to Clipboard!' : 'Copy Raw Blueprint'}
          </button>
        </div>

        {/* Blueprint Content Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 28px',
            backgroundColor: '#FFFFFF'
          }}
        >
          <pre
            style={{
              margin: 0,
              fontFamily: 'Consolas, "Fira Code", Monaco, monospace',
              fontSize: '0.82rem',
              lineHeight: 1.55,
              color: 'var(--forest-dark)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              backgroundColor: '#FAF8F1',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid var(--editorial-border)'
            }}
          >
            {BLUEPRINT_MARKDOWN}
          </pre>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 28px',
            backgroundColor: '#FAF8F1',
            borderTop: '1px solid var(--subtle-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            color: 'var(--muted-text)'
          }}
        >
          <span>LibraMind System Architecture · 12 Pages Covered</span>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '6px' }}
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}

