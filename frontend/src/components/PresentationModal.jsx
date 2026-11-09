import React, { useState } from 'react';
import {
  FileText,
  Download,
  X,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
  BarChart2,
  GitBranch,
  ShieldAlert,
  ChevronRight,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export default function PresentationModal({ isOpen, onClose }) {
  const [activeSlideTab, setActiveSlideTab] = useState(1);

  if (!isOpen) return null;

  const slidesData = [
    { num: 1, title: 'Title Slide', tag: 'DELUXE BOOK COVER', desc: 'Gilded morocco leather frontispiece with project title, subtitle, and verified placeholders: [Insert Student Name], [Insert Team Members], [Insert College Name].' },
    { num: 2, title: 'Introduction', tag: 'CHAPTER I · DILEMMA', desc: 'Traditional library search and seat contention dilemmas vs the LibraMind smart biophilic paradigm and core values.' },
    { num: 3, title: 'Project Overview', tag: 'CHAPTER II · TOPOLOGY', desc: '3-tier enterprise architecture, tri-portal access (Member, Librarian, Admin), 4-tier spatial stack coordinates, and system diagram.' },
    { num: 4, title: 'User Research', tag: 'CHAPTER III · INQUIRY', desc: 'Dual-track research framework: qualitative observational ethnography & interviews + quantitative survey sampling protocol.' },
    { num: 5, title: 'Empathize', tag: 'CHAPTER IV · EMPATHY', desc: '4-quadrant visual empathy map (Think, Feel, Say, Do) capturing real scholar and circulation desk psychological realities.' },
    { num: 6, title: 'Statistical Findings', tag: 'CHAPTER V · CALCULUS', desc: 'Academic mathematical formulations: Mean (μ), Std Dev (s), Median (Q2), Mode, Normal Gaussian PDF f(x), and Poisson arrival probability.' },
    { num: 7, title: 'Define', tag: 'CHAPTER VI · PROBLEM TREE', desc: 'Core POV problem statement and visual Problem Tree Analysis: Root Causes (Roots), Core Problem (Trunk), Downstream Effects (Canopy).' },
    { num: 8, title: 'Ideation', tag: 'CHAPTER VII · IDEATION', desc: 'Four multidisciplinary engineering pillars: Python AI & ML, Probability & Queues, Spatial Graph Routing, and Transactional WAL Integrity.' },
    { num: 9, title: 'Idea Selection', tag: 'CHAPTER VIII · MCDA & SWOT', desc: 'Multi-Criteria Decision Analysis (MCDA) weighted prioritization matrix + comprehensive 4-quadrant strategic SWOT appraisal.' },
    { num: 10, title: 'Prototype', tag: 'CHAPTER IX · PROTOTYPE', desc: 'Four operational fullstack modules (Catalog, Member Hub, Circulation Desk, Seat Concurrency Map) + Python AI microservice bridge.' },
    { num: 11, title: 'Testing & Validation', tag: 'CHAPTER X · VERIFICATION', desc: 'Empirical system verification matrix: RBAC boundary protection, atomic seat concurrency locks, and barcode scan-to-patron lookup.' },
    { num: 12, title: 'Results & Iterations', tag: 'CHAPTER XI · ITERATIONS', desc: 'Three-phase Design Thinking evolution: V1 generic table baseline -> V2 spatial stack coordinates -> V3 biophilic editorial sanctuary.' },
    { num: 13, title: 'Impact & Limitations', tag: 'CHAPTER XII · BOUNDARIES', desc: 'Anticipated socio-technical impact vectors (spatial discovery, fair seating, desk velocity) balanced against engineering boundary constraints.' },
    { num: 14, title: 'Conclusion & Future Scope', tag: 'CHAPTER XIII · ROADMAP', desc: 'Design Thinking synthesis + Phased AI roadmap: all-MiniLM-L6-v2 embeddings, LSTM demand models, and IoT RFID smart shelf telemetry.' },
    { num: 15, title: 'References & Q&A', tag: 'CHAPTER XIV · BIBLIOGRAPHY', desc: 'Peer-reviewed academic bibliography (Brown, Norman, ACRL, Kleinrock, Vaswani), technology registry, and formal committee Q&A dialogue.' }
  ];

  const handleDownload = () => {
    // Direct link to the generated pptx file
    const link = document.createElement('a');
    link.href = '/LibraMind_Design_Thinking_Presentation.pptx';
    link.download = 'LibraMind_Design_Thinking_Presentation.pptx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(27, 48, 36, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="bio-card"
        style={{
          width: '1080px',
          maxWidth: '96vw',
          maxHeight: '92vh',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-sm)',
          border: '1.5px solid var(--editorial-border)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 28px',
            backgroundColor: 'var(--editorial-bg)',
            borderBottom: '1px solid var(--editorial-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="editorial-kicker" style={{ color: 'var(--editorial-terracotta)', letterSpacing: '0.12em', margin: 0 }}>
                ACADEMIC VIVA 2026 • 16:9 WIDESCREEN PRESENTATION
              </span>
              <span
                style={{
                  fontSize: '0.64rem',
                  fontWeight: 700,
                  backgroundColor: 'var(--editorial-green)',
                  color: '#FFFFFF',
                  padding: '2px 8px',
                  borderRadius: '2px'
                }}
              >
                15 SLIDES COMPLETE
              </span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.55rem',
                color: 'var(--editorial-text)',
                margin: 0,
                fontWeight: 800
              }}
            >
              LibraMind – AI-Powered Smart Library Management System
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '0.84rem', color: 'var(--editorial-text-muted)' }}>
              A Human-Centered Design Thinking Approach • Editable PowerPoint (.pptx) Deck
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a
              href="/LibraMind_Offline_Website_&_Blueprints.html"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{
                borderColor: 'var(--editorial-gold)',
                color: 'var(--editorial-gold)',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none'
              }}
              title="Open standalone self-contained offline website viewer"
            >
              🌐 Standalone Offline Viewer
            </a>
            <a
              href="/LibraMind_Complete_Blueprints_Offline_Bundle.zip"
              download="LibraMind_Complete_Blueprints_Offline_Bundle.zip"
              className="btn btn-outline btn-sm"
              style={{
                borderColor: '#FFFFFF',
                color: '#FFFFFF',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none'
              }}
              title="Download all 21 architectural blueprints offline (.ZIP)"
            >
              📦 Blueprints (.ZIP)
            </a>
            <button
              onClick={handleDownload}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                fontSize: '0.88rem',
                fontWeight: 700,
                backgroundColor: 'var(--editorial-green)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Download size={16} strokeWidth={2.5} />
              <span>Download PPT (.pptx)</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--editorial-text-muted)',
                padding: '6px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Close Modal"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Modal Body: Two-Column Showcase */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '360px 1fr',
            flex: 1,
            overflow: 'hidden'
          }}
        >
          {/* Left Column: Slide Navigator Index */}
          <div
            style={{
              borderRight: '1px solid var(--editorial-border)',
              backgroundColor: 'var(--editorial-bg-subtle)',
              overflowY: 'auto',
              padding: '16px'
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--editorial-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              SLIDE INDEX (EXACTLY 15 SLIDES)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {slidesData.map((s) => {
                const isActive = activeSlideTab === s.num;
                return (
                  <button
                    key={s.num}
                    onClick={() => setActiveSlideTab(s.num)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '10px 12px',
                      backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                      border: isActive ? '1px solid var(--editorial-accent)' : '1px solid transparent',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      boxShadow: isActive ? 'var(--shadow-sm)' : 'none'
                    }}
                  >
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        backgroundColor: isActive ? 'var(--editorial-green)' : 'var(--editorial-border)',
                        color: isActive ? '#FFFFFF' : 'var(--editorial-text)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: '1px'
                      }}
                    >
                      {s.num}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--editorial-text)' }}>
                          {s.title}
                        </span>
                        <span style={{ fontSize: '0.62rem', color: 'var(--editorial-terracotta)', fontWeight: 700 }}>
                          {s.tag}
                        </span>
                      </div>
                      <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'var(--editorial-text-muted)', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {s.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Slide Detail & Asset Previews */}
          <div
            style={{
              padding: '24px 30px',
              overflowY: 'auto',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            {/* Active Slide Card Preview */}
            {(() => {
              const current = slidesData.find((s) => s.num === activeSlideTab) || slidesData[0];
              return (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          backgroundColor: 'var(--editorial-bg-subtle)',
                          color: 'var(--editorial-accent)',
                          padding: '3px 8px',
                          border: '1px solid var(--editorial-border)',
                          borderRadius: '2px'
                        }}
                      >
                        SLIDE {current.num} OF 15
                      </span>
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--editorial-terracotta)' }}>
                        {current.tag}
                      </span>
                    </div>

                    <span style={{ fontSize: '0.72rem', color: 'var(--editorial-text-muted)' }}>
                      16:9 Modern Editorial Format
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.45rem',
                      color: 'var(--editorial-text)',
                      margin: '0 0 6px',
                      fontWeight: 700
                    }}
                  >
                    {current.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--editorial-text-muted)', lineHeight: 1.5, margin: 0 }}>
                    {current.desc}
                  </p>
                </div>
              );
            })()}

            {/* Embedded Diagram Preview for Diagram Slides */}
            {activeSlideTab === 3 && (
              <div style={{ border: '1px solid var(--editorial-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <div style={{ padding: '8px 12px', backgroundColor: 'var(--editorial-bg-subtle)', fontSize: '0.74rem', fontWeight: 700, color: 'var(--editorial-text)' }}>
                  📊 Embedded Slide 3 Diagram: System Architecture & 3-Tier Layering
                </div>
                <img
                  src="/presentation_assets/diagram_slide3_system_overview.png"
                  alt="System Architecture Diagram"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            )}

            {activeSlideTab === 6 && (
              <div style={{ border: '1px solid var(--editorial-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <div style={{ padding: '8px 12px', backgroundColor: 'var(--editorial-bg-subtle)', fontSize: '0.74rem', fontWeight: 700, color: 'var(--editorial-text)' }}>
                  📈 Embedded Slide 6 Chart: Retrieval Time Gaussian Density Curve & Pain Point Prevalence
                </div>
                <img
                  src="/presentation_assets/chart_slide6_stats.png"
                  alt="Statistical Charts"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            )}

            {activeSlideTab === 7 && (
              <div style={{ border: '1px solid var(--editorial-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <div style={{ padding: '8px 12px', backgroundColor: 'var(--editorial-bg-subtle)', fontSize: '0.74rem', fontWeight: 700, color: 'var(--editorial-text)' }}>
                  🌳 Embedded Slide 7 Diagram: Problem Tree Analysis (Roots, Trunk & Canopy)
                </div>
                <img
                  src="/presentation_assets/diagram_slide7_problem_tree.png"
                  alt="Problem Tree Analysis"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            )}

            {activeSlideTab === 8 && (
              <div style={{ border: '1px solid var(--editorial-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <div style={{ padding: '8px 12px', backgroundColor: 'var(--editorial-bg-subtle)', fontSize: '0.74rem', fontWeight: 700, color: 'var(--editorial-text)' }}>
                  🧠 Embedded Slide 8 Diagram: Multidisciplinary Ideation (Python AI, Probability, Spatial Routing & Concurrency)
                </div>
                <img
                  src="/presentation_assets/diagram_slide8_ideation.png"
                  alt="Ideation Pillars"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            )}

            {activeSlideTab === 9 && (
              <div style={{ border: '1px solid var(--editorial-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <div style={{ padding: '8px 12px', backgroundColor: 'var(--editorial-bg-subtle)', fontSize: '0.74rem', fontWeight: 700, color: 'var(--editorial-text)' }}>
                  🎯 Embedded Slide 9 Diagram: Feasibility vs Impact Matrix & SWOT Analysis Grid
                </div>
                <img
                  src="/presentation_assets/diagram_slide9_selection.png"
                  alt="Prioritization Matrix & SWOT"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            )}

            {activeSlideTab === 10 && (
              <div style={{ border: '1px solid var(--editorial-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <div style={{ padding: '8px 12px', backgroundColor: 'var(--editorial-bg-subtle)', fontSize: '0.74rem', fontWeight: 700, color: 'var(--editorial-text)' }}>
                  💻 Embedded Slide 10 Diagram: Prototype Modules & Python NLP Machine Learning Flow
                </div>
                <img
                  src="/presentation_assets/diagram_slide10_prototype.png"
                  alt="Prototype Modules & AI Engine"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            )}

            {/* Presentation Highlights Banner */}
            <div
              style={{
                padding: '18px 22px',
                backgroundColor: 'var(--editorial-bg-subtle)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--editorial-border)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '14px'
              }}
            >
              <div>
                <span style={{ fontSize: '0.70rem', fontWeight: 700, color: 'var(--editorial-accent)', textTransform: 'uppercase' }}>
                  FILE FORMAT
                </span>
                <div style={{ fontSize: '0.90rem', fontWeight: 700, color: 'var(--editorial-text)', marginTop: '2px' }}>
                  PowerPoint (.pptx)
                </div>
                <span style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)' }}>
                  16:9 Widescreen • 1.17 MB
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.70rem', fontWeight: 700, color: 'var(--editorial-accent)', textTransform: 'uppercase' }}>
                  DESIGN PALETTE
                </span>
                <div style={{ fontSize: '0.90rem', fontWeight: 700, color: 'var(--editorial-text)', marginTop: '2px' }}>
                  Biophilic Academic
                </div>
                <span style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)' }}>
                  Forest Green, Sage, Cream &amp; Terracotta
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.70rem', fontWeight: 700, color: 'var(--editorial-accent)', textTransform: 'uppercase' }}>
                  ANALYTICAL RIGOR
                </span>
                <div style={{ fontSize: '0.90rem', fontWeight: 700, color: 'var(--editorial-text)', marginTop: '2px' }}>
                  Math &amp; Concurrency
                </div>
                <span style={{ fontSize: '0.74rem', color: 'var(--editorial-text-muted)' }}>
                  Gaussian μ/σ, P(Occ), TF-IDF &amp; Partial Indexes
                </span>
              </div>
            </div>

            {/* Bottom Download CTA Bar */}
            <div
              style={{
                marginTop: 'auto',
                paddingTop: '16px',
                borderTop: '1px solid var(--editorial-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--editorial-green)" />
                <span style={{ fontSize: '0.80rem', color: 'var(--editorial-text-muted)' }}>
                  File stored locally at: <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--editorial-text)' }}>LibraMind_Design_Thinking_Presentation.pptx</code>
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="btn btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.84rem',
                    padding: '8px 16px',
                    backgroundColor: 'var(--editorial-green)'
                  }}
                >
                  <Download size={14} />
                  <span>Download File (.pptx)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

