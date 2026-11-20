import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  SUBJECT_CATEGORIES,
  TOTAL_SUBCATEGORIES_COUNT
} from '../data/interestCategories';
import {
  Search,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  BookOpen,
  Brain,
  Heart,
  Compass,
  Lightbulb,
  Cpu,
  Wand2,
  Ghost,
  Landmark,
  TrendingUp,
  GraduationCap,
  Users,
  Sun,
  Palette,
  Layers,
  LayoutGrid,
  List
} from 'lucide-react';

const ICON_MAP = {
  BookOpen,
  Brain,
  Heart,
  Compass,
  Lightbulb,
  Cpu,
  Wand2,
  Ghost,
  Landmark,
  TrendingUp,
  GraduationCap,
  Users,
  Sun,
  Palette,
  Sparkles
};

// Short names for horizontal mobile category scroll pills
const SHORT_CAT_NAMES = {
  'fiction-literature': 'Fiction',
  'psychology-behaviour': 'Psychology',
  'romance-relationships': 'Romance',
  'mystery-thriller-crime': 'Mystery',
  'self-help-development': 'Self-Help',
  'philosophy-thinking': 'Philosophy',
  'science-technology': 'Science & AI',
  'fantasy-imagination': 'Fantasy',
  'horror-gothic': 'Horror',
  'history-culture': 'History',
  'business-finance-economics': 'Business',
  'education-academic': 'Academic',
  'society-human-life': 'Society',
  'spirituality-religion': 'Spirituality',
  'creative-arts': 'Creative Arts'
};

export default function InterestCategorySelector({
  selectedInterests = [],
  onChange,
  maxSelections = 50,
  compact = false
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [activeSplitCategory, setActiveSplitCategory] = useState('fiction-literature');
  const [desktopViewMode, setDesktopViewMode] = useState('split'); // 'split' | 'grid' | 'stack'
  const [allExpanded, setAllExpanded] = useState(false);
  const [showSelectedChips, setShowSelectedChips] = useState(true);

  // Responsive desktop detection (>= 768px is desktop view)
  const [isDesktop, setIsDesktop] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 768 : true));

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Normalize selected interests into an array of trimmed strings
  const currentSelected = useMemo(() => {
    if (Array.isArray(selectedInterests)) {
      return selectedInterests.map(s => String(s).trim()).filter(Boolean);
    }
    if (typeof selectedInterests === 'string') {
      return selectedInterests.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  }, [selectedInterests]);

  const [expandedCategories, setExpandedCategories] = useState(() => {
    // Expand the first category and any category containing pre-selected interests
    const initial = { 'fiction-literature': true };
    const rawList = Array.isArray(selectedInterests)
      ? selectedInterests
      : typeof selectedInterests === 'string'
        ? selectedInterests.split(',').map(s => s.trim())
        : [];
    if (rawList.length > 0) {
      SUBJECT_CATEGORIES.forEach(cat => {
        if (cat.subcategories.some(sub => rawList.includes(sub))) {
          initial[cat.id] = true;
        }
      });
    }
    return initial;
  });

  // Ensure categories with selected interests are auto-expanded when props change
  useEffect(() => {
    if (currentSelected.length > 0) {
      setExpandedCategories(prev => {
        const next = { ...prev };
        let changed = false;
        SUBJECT_CATEGORIES.forEach(cat => {
          if (cat.subcategories.some(sub => currentSelected.includes(sub)) && !next[cat.id]) {
            next[cat.id] = true;
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }
  }, [currentSelected]);

  const toggleInterest = (interestName) => {
    const trimmed = interestName.trim();
    let updated;
    if (currentSelected.includes(trimmed)) {
      updated = currentSelected.filter(i => i !== trimmed);
    } else {
      if (currentSelected.length >= maxSelections) return;
      updated = [...currentSelected, trimmed];
    }
    onChange(updated);
  };

  const removeInterest = (e, interestName) => {
    e.stopPropagation();
    const updated = currentSelected.filter(i => i !== interestName.trim());
    onChange(updated);
  };

  const toggleCategoryExpand = (catId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const handleToggleExpandAll = () => {
    if (allExpanded) {
      setExpandedCategories({});
      setAllExpanded(false);
    } else {
      const allTrue = {};
      SUBJECT_CATEGORIES.forEach(cat => {
        allTrue[cat.id] = true;
      });
      setExpandedCategories(allTrue);
      setAllExpanded(true);
    }
  };

  const selectAllInCategory = (subcategories) => {
    const newItems = subcategories.filter(sub => !currentSelected.includes(sub));
    const combined = [...currentSelected, ...newItems].slice(0, maxSelections);
    onChange(combined);
  };

  const clearCategory = (subcategories) => {
    const set = new Set(subcategories);
    const updated = currentSelected.filter(item => !set.has(item));
    onChange(updated);
  };

  const clearAll = () => {
    onChange([]);
  };

  // Filter categories based on search and active quick filter pill
  const filteredCategories = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return SUBJECT_CATEGORIES.map(cat => {
      // 1. Quick pill filter check
      if (activeCategoryFilter !== 'all' && cat.id !== activeCategoryFilter) {
        return null;
      }

      // 2. Search query check
      if (!term) return cat;

      const catMatches = cat.name.toLowerCase().includes(term);
      const matchingSubs = cat.subcategories.filter(sub =>
        sub.toLowerCase().includes(term)
      );
      if (catMatches || matchingSubs.length > 0) {
        return {
          ...cat,
          subcategories: matchingSubs.length > 0 ? matchingSubs : cat.subcategories,
          autoExpanded: true
        };
      }
      return null;
    }).filter(Boolean);
  }, [searchTerm, activeCategoryFilter]);

  // Synchronize active split category when filtered categories change
  useEffect(() => {
    if (filteredCategories.length > 0) {
      const exists = filteredCategories.some(c => c.id === activeSplitCategory);
      if (!exists) {
        setActiveSplitCategory(filteredCategories[0].id);
      }
    }
  }, [filteredCategories, activeSplitCategory]);

  const currentSplitCat = useMemo(() => {
    return filteredCategories.find(c => c.id === activeSplitCategory) || filteredCategories[0] || SUBJECT_CATEGORIES[0];
  }, [filteredCategories, activeSplitCategory]);

  return (
    <div className="interest-selector-container" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      {/* ── Top Controls: Search Bar & Actions ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
        {/* Search Input Bar */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--editorial-text-muted)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Search 140 topics (e.g. AI, Psychology, Stoicism)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              paddingLeft: '38px',
              paddingRight: searchTerm ? '36px' : '12px',
              fontSize: '0.84rem',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--editorial-border)',
              width: '100%',
              boxSizing: 'border-box',
              height: '42px'
            }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--editorial-text-muted)',
                cursor: 'pointer',
                padding: '6px'
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* ── Quick Category Filter Pills Bar (Wrapping on Desktop, Swipe on Mobile) ── */}
        <div
          className="category-pills-scroll"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '4px',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <button
            type="button"
            onClick={() => { setActiveCategoryFilter('all'); }}
            style={{
              flexShrink: 0,
              padding: '5px 12px',
              fontSize: '0.74rem',
              fontWeight: activeCategoryFilter === 'all' ? 700 : 500,
              borderRadius: 'var(--radius-sm)',
              border: activeCategoryFilter === 'all' ? '1px solid var(--editorial-green)' : '1px solid var(--editorial-border)',
              backgroundColor: activeCategoryFilter === 'all' ? 'var(--editorial-green)' : '#FFFFFF',
              color: activeCategoryFilter === 'all' ? '#FFFFFF' : 'var(--editorial-text)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            All Areas (15)
          </button>
          {SUBJECT_CATEGORIES.map(cat => {
            const isPillActive = activeCategoryFilter === cat.id;
            const shortName = SHORT_CAT_NAMES[cat.id] || cat.name;
            const catCount = cat.subcategories.filter(s => currentSelected.includes(s)).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  const targetCat = isPillActive ? 'all' : cat.id;
                  setActiveCategoryFilter(targetCat);
                  setActiveSplitCategory(cat.id);
                  setExpandedCategories(prev => ({ ...prev, [cat.id]: true }));
                }}
                style={{
                  flexShrink: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 11px',
                  fontSize: '0.74rem',
                  fontWeight: isPillActive ? 700 : 500,
                  borderRadius: 'var(--radius-sm)',
                  border: isPillActive ? '1px solid var(--editorial-green)' : '1px solid var(--editorial-border)',
                  backgroundColor: isPillActive ? 'var(--editorial-green)' : '#FFFFFF',
                  color: isPillActive ? '#FFFFFF' : 'var(--editorial-text)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{shortName}</span>
                {catCount > 0 && (
                  <span
                    style={{
                      fontSize: '0.66rem',
                      backgroundColor: isPillActive ? 'rgba(255,255,255,0.25)' : 'var(--editorial-green)',
                      color: '#FFFFFF',
                      padding: '1px 5px',
                      borderRadius: '999px',
                      fontWeight: 700
                    }}
                  >
                    {catCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Selection Status & View Controls Bar ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            padding: '8px 12px',
            backgroundColor: 'var(--editorial-bg-subtle)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--editorial-border)'
          }}
        >
          {/* Chosen Count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--editorial-text)' }}>
              Selected Interests:
            </span>
            <span
              className="badge"
              style={{
                backgroundColor: currentSelected.length > 0 ? 'var(--editorial-green)' : 'var(--editorial-border)',
                color: currentSelected.length > 0 ? '#FFFFFF' : 'var(--editorial-text-muted)',
                fontSize: '0.74rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '999px'
              }}
            >
              {currentSelected.length} of {maxSelections}
            </span>
          </div>

          {/* Desktop View Switcher & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Desktop View Mode Segmented Selector */}
            {isDesktop && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  backgroundColor: '#FFFFFF',
                  padding: '2px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--editorial-border)'
                }}
              >
                <button
                  type="button"
                  onClick={() => setDesktopViewMode('split')}
                  style={{
                    background: desktopViewMode === 'split' ? 'var(--editorial-green)' : 'transparent',
                    color: desktopViewMode === 'split' ? '#FFFFFF' : 'var(--editorial-text)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    padding: '3px 8px',
                    fontSize: '0.72rem',
                    fontWeight: desktopViewMode === 'split' ? 700 : 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease'
                  }}
                  title="Split Explorer: Categories on left rail, topics in right workspace"
                >
                  <Layers size={12} /> Explorer
                </button>
                <button
                  type="button"
                  onClick={() => setDesktopViewMode('grid')}
                  style={{
                    background: desktopViewMode === 'grid' ? 'var(--editorial-green)' : 'transparent',
                    color: desktopViewMode === 'grid' ? '#FFFFFF' : 'var(--editorial-text)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    padding: '3px 8px',
                    fontSize: '0.72rem',
                    fontWeight: desktopViewMode === 'grid' ? 700 : 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease'
                  }}
                  title="2-Column Grid: Side-by-side category cards"
                >
                  <LayoutGrid size={12} /> 2-Column
                </button>
                <button
                  type="button"
                  onClick={() => setDesktopViewMode('stack')}
                  style={{
                    background: desktopViewMode === 'stack' ? 'var(--editorial-green)' : 'transparent',
                    color: desktopViewMode === 'stack' ? '#FFFFFF' : 'var(--editorial-text)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    padding: '3px 8px',
                    fontSize: '0.72rem',
                    fontWeight: desktopViewMode === 'stack' ? 700 : 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease'
                  }}
                  title="Accordion Stack: Expandable vertical stack"
                >
                  <List size={12} /> Stack
                </button>
              </div>
            )}

            {/* Expand / Collapse All Toggle (in stack & mobile view) */}
            {(!isDesktop || desktopViewMode === 'stack') && (
              <button
                type="button"
                onClick={handleToggleExpandAll}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--editorial-green)',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {allExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                <span>{allExpanded ? 'Collapse All' : 'Expand All (15)'}</span>
              </button>
            )}

            {currentSelected.length > 0 && (
              <>
                <span style={{ color: 'var(--editorial-border)' }}>|</span>
                <button
                  type="button"
                  onClick={clearAll}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--editorial-accent)',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Clear All
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Active Selection Preview Chips ── */}
        {currentSelected.length > 0 && showSelectedChips && (
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--editorial-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--editorial-accent)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Active Reading Portfolio Topics ({currentSelected.length}):
              </span>
              <button
                type="button"
                onClick={() => setShowSelectedChips(false)}
                style={{ background: 'none', border: 'none', fontSize: '0.70rem', color: 'var(--editorial-text-muted)', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Hide
              </button>
            </div>
            <div
              className="custom-editorial-scrollbar"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '5px',
                maxHeight: '130px',
                overflowY: 'auto'
              }}
            >
              {currentSelected.map(interest => (
                <span
                  key={interest}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '3px 8px 3px 10px',
                    backgroundColor: 'var(--editorial-bg-subtle)',
                    border: '1px solid var(--editorial-green)',
                    color: 'var(--editorial-green)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.74rem',
                    fontWeight: 600
                  }}
                >
                  <span>{interest}</span>
                  <button
                    type="button"
                    onClick={(e) => removeInterest(e, interest)}
                    aria-label={`Remove ${interest}`}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--editorial-accent)',
                      cursor: 'pointer',
                      padding: '1px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <X size={12} strokeWidth={2.5} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Empty State if Search Finds Nothing ── */}
      {filteredCategories.length === 0 ? (
        <div
          style={{
            padding: '28px 16px',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--editorial-border)',
            color: 'var(--editorial-text-muted)',
            fontSize: '0.86rem'
          }}
        >
          No matching subjects found for "{searchTerm}".
          <div style={{ marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setActiveCategoryFilter('all'); }}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.76rem', padding: '4px 12px' }}
            >
              Reset Search Filters
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* ══════════════════════════════════════════════════════════════ */}
          {/* VIEW MODE 1: DESKTOP SPLIT EXPLORER (Category Rail + Workspace) */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {isDesktop && desktopViewMode === 'split' && (
            <div
              style={{
                display: 'flex',
                gap: '16px',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--editorial-border)',
                padding: '16px',
                minHeight: '420px',
                boxSizing: 'border-box'
              }}
            >
              {/* Left Navigation Rail (Categories List) */}
              <div
                className="custom-editorial-scrollbar"
                style={{
                  width: '36%',
                  minWidth: '220px',
                  maxWidth: '280px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  borderRight: '1px solid var(--editorial-border)',
                  paddingRight: '12px',
                  maxHeight: compact ? '420px' : '560px',
                  overflowY: 'auto'
                }}
              >
                <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--editorial-accent)', marginBottom: '4px', paddingLeft: '4px' }}>
                  Scholarly Domains ({filteredCategories.length})
                </div>

                {filteredCategories.map((cat, idx) => {
                  const isSelected = cat.id === currentSplitCat.id;
                  const inCatCount = cat.subcategories.filter(s => currentSelected.includes(s)).length;
                  const IconComp = ICON_MAP[cat.icon] || BookOpen;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveSplitCategory(cat.id)}
                      className="desktop-cat-rail-item"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '9px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: isSelected ? '1px solid var(--editorial-green)' : '1px solid var(--editorial-border)',
                        backgroundColor: isSelected ? 'var(--editorial-bg-subtle)' : '#FFFFFF',
                        color: isSelected ? 'var(--editorial-green)' : 'var(--editorial-text)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                        transition: 'all 0.15s ease',
                        borderLeft: isSelected ? '4px solid var(--editorial-green)' : '1px solid var(--editorial-border)',
                        boxSizing: 'border-box'
                      }}
                    >
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isSelected ? 'var(--editorial-green)' : inCatCount > 0 ? 'var(--editorial-green)' : 'var(--editorial-bg)',
                          color: (isSelected || inCatCount > 0) ? '#FFFFFF' : 'var(--editorial-text)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <IconComp size={15} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: isSelected ? 800 : 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {idx + 1}. {cat.name}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--editorial-text-muted)' }}>
                          {cat.subcategories.length} topics
                        </div>
                      </div>
                      {inCatCount > 0 && (
                        <span
                          style={{
                            fontSize: '0.66rem',
                            fontWeight: 800,
                            backgroundColor: 'var(--editorial-green)',
                            color: '#FFFFFF',
                            padding: '1px 6px',
                            borderRadius: '999px',
                            flexShrink: 0
                          }}
                        >
                          ✓ {inCatCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Right Detail Workspace (Selected Category's Topics) */}
              <div
                className="custom-editorial-scrollbar"
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  paddingLeft: '4px',
                  maxHeight: compact ? '420px' : '560px',
                  overflowY: 'auto'
                }}
              >
                {/* Active Category Detail Header */}
                <div
                  style={{
                    padding: '14px 16px',
                    backgroundColor: 'var(--editorial-bg-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--editorial-border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--editorial-accent)', display: 'block', marginBottom: '2px' }}>
                        ACTIVE LITERARY FOCUS
                      </span>
                      <h4 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.24rem', color: 'var(--editorial-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{currentSplitCat.name}</span>
                        <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--editorial-text-muted)', backgroundColor: '#FFFFFF', padding: '1px 8px', borderRadius: '999px', border: '1px solid var(--editorial-border)' }}>
                          {currentSplitCat.subcategories.length} Topics
                        </span>
                      </h4>
                      <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: 'var(--editorial-text-muted)', lineHeight: 1.4 }}>
                        {currentSplitCat.description}
                      </p>
                    </div>

                    {/* Bulk Selection Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => selectAllInCategory(currentSplitCat.subcategories)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--editorial-green)',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          padding: '3px 6px',
                          textDecoration: 'underline'
                        }}
                      >
                        Select All {currentSplitCat.subcategories.length}
                      </button>
                      <span style={{ color: 'var(--editorial-border)' }}>|</span>
                      <button
                        type="button"
                        onClick={() => clearCategory(currentSplitCat.subcategories)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--editorial-text-muted)',
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: '3px 6px'
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subcategory Topic Pills */}
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--editorial-text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Available Topics in {currentSplitCat.name}:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {currentSplitCat.subcategories.map(sub => {
                      const isSelected = currentSelected.includes(sub);

                      return (
                        <button
                          key={sub}
                          type="button"
                          className="topic-pill-btn"
                          title={sub}
                          onClick={() => toggleInterest(sub)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '7px',
                            padding: '8px 14px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.80rem',
                            fontWeight: isSelected ? 700 : 500,
                            lineHeight: 1.3,
                            cursor: 'pointer',
                            border: isSelected ? '1.5px solid var(--editorial-green)' : '1px solid var(--editorial-border)',
                            backgroundColor: isSelected ? 'var(--editorial-green)' : '#FFFFFF',
                            color: isSelected ? '#FFFFFF' : 'var(--editorial-text)',
                            boxShadow: isSelected ? '0 2px 6px rgba(38,61,50,0.22)' : '0 1px 2px rgba(0,0,0,0.03)',
                            transition: 'all 0.15s ease',
                            textAlign: 'left'
                          }}
                        >
                          {isSelected ? (
                            <Check size={14} strokeWidth={3} style={{ flexShrink: 0 }} />
                          ) : (
                            <span style={{ color: 'var(--editorial-border-dark)', fontSize: '0.78rem', flexShrink: 0 }}>+</span>
                          )}
                          <span>{sub}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* VIEW MODE 2: DESKTOP 2-COLUMN GRID (Side-by-Side Cards)       */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {isDesktop && desktopViewMode === 'grid' && (
            <div
              className="custom-editorial-scrollbar"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
                gap: '14px',
                maxHeight: compact ? '440px' : 'none',
                overflowY: compact ? 'auto' : 'visible'
              }}
            >
              {filteredCategories.map((cat, catIdx) => {
                const selectedInCatCount = cat.subcategories.filter(sub => currentSelected.includes(sub)).length;
                const IconComp = ICON_MAP[cat.icon] || BookOpen;

                return (
                  <div
                    key={cat.id}
                    className="category-card-item"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-sm)',
                      border: selectedInCatCount > 0 ? '1.5px solid var(--editorial-green)' : '1px solid var(--editorial-border)',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: selectedInCatCount > 0 ? 'var(--editorial-green)' : 'var(--editorial-bg)',
                            color: selectedInCatCount > 0 ? '#FFFFFF' : 'var(--editorial-text)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <IconComp size={15} />
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: '0.86rem', fontWeight: 700, fontFamily: 'var(--font-serif)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {catIdx + 1}. {cat.name}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--editorial-text-muted)' }}>
                            {cat.subcategories.length} topics
                          </div>
                        </div>
                      </div>

                      {selectedInCatCount > 0 && (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            color: '#FFFFFF',
                            backgroundColor: 'var(--editorial-green)',
                            padding: '2px 7px',
                            borderRadius: '999px',
                            fontWeight: 700,
                            flexShrink: 0
                          }}
                        >
                          ✓ {selectedInCatCount}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.70rem', borderTop: '1px solid var(--editorial-border)', paddingTop: '6px' }}>
                      <span style={{ color: 'var(--editorial-text-muted)' }}>Choose topics:</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => selectAllInCategory(cat.subcategories)}
                          style={{ background: 'none', border: 'none', color: 'var(--editorial-green)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                        >
                          Select All
                        </button>
                        <span style={{ color: 'var(--editorial-border)' }}>|</span>
                        <button
                          type="button"
                          onClick={() => clearCategory(cat.subcategories)}
                          style={{ background: 'none', border: 'none', color: 'var(--editorial-text-muted)', cursor: 'pointer', padding: 0 }}
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    {/* Subcategories Topic Pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {cat.subcategories.map(sub => {
                        const isSelected = currentSelected.includes(sub);

                        return (
                          <button
                            key={sub}
                            type="button"
                            className="topic-pill-btn"
                            title={sub}
                            onClick={() => toggleInterest(sub)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '5px 10px',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.74rem',
                              fontWeight: isSelected ? 700 : 500,
                              lineHeight: 1.25,
                              cursor: 'pointer',
                              border: isSelected ? '1.5px solid var(--editorial-green)' : '1px solid var(--editorial-border)',
                              backgroundColor: isSelected ? 'var(--editorial-green)' : '#FFFFFF',
                              color: isSelected ? '#FFFFFF' : 'var(--editorial-text)',
                              boxShadow: isSelected ? '0 2px 5px rgba(38,61,50,0.18)' : '0 1px 2px rgba(0,0,0,0.03)',
                              transition: 'all 0.15s ease',
                              textAlign: 'left'
                            }}
                          >
                            {isSelected ? (
                              <Check size={12} strokeWidth={3} style={{ flexShrink: 0 }} />
                            ) : (
                              <span style={{ color: 'var(--editorial-border-dark)', fontSize: '0.72rem', flexShrink: 0 }}>+</span>
                            )}
                            <span>{sub}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* VIEW MODE 3: ACCORDION STACK (For Mobile or Desktop Stack)     */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {(!isDesktop || desktopViewMode === 'stack') && (
            <div
              className="interest-selector-accordion custom-editorial-scrollbar"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: compact ? '420px' : (isDesktop ? '600px' : 'none'),
                overflowY: isDesktop ? 'auto' : 'visible',
                paddingRight: '2px',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {filteredCategories.map((cat, catIdx) => {
                const isExpanded = searchTerm ? true : Boolean(expandedCategories[cat.id]);
                const selectedInCatCount = cat.subcategories.filter(sub =>
                  currentSelected.includes(sub)
                ).length;
                const IconComp = ICON_MAP[cat.icon] || BookOpen;

                return (
                  <div
                    key={cat.id}
                    className="category-card-item"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-sm)',
                      border: selectedInCatCount > 0 ? '1.5px solid var(--editorial-green)' : '1px solid var(--editorial-border)',
                      overflow: 'hidden',
                      transition: 'border-color 0.15s ease',
                      boxSizing: 'border-box',
                      flexShrink: 0,
                      minHeight: 'fit-content'
                    }}
                  >
                    {/* Category Header Row (Tap to expand/collapse) */}
                    <div
                      onClick={() => toggleCategoryExpand(cat.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleCategoryExpand(cat.id); }}
                      aria-expanded={isExpanded}
                      style={{
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        userSelect: 'none',
                        backgroundColor: selectedInCatCount > 0 ? 'var(--editorial-bg-subtle)' : '#FFFFFF',
                        gap: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                        {/* Category Icon */}
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: selectedInCatCount > 0 ? 'var(--editorial-green)' : 'var(--editorial-bg)',
                            color: selectedInCatCount > 0 ? '#FFFFFF' : 'var(--editorial-text)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <IconComp size={16} />
                        </div>

                        {/* Title & Topic Details */}
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <span
                              style={{
                                fontSize: '0.88rem',
                                fontWeight: 700,
                                color: 'var(--editorial-text)',
                                fontFamily: 'var(--font-serif)',
                                lineHeight: 1.25
                              }}
                            >
                              {catIdx + 1}. {cat.name}
                            </span>
                            <span
                              style={{
                                fontSize: '0.68rem',
                                color: 'var(--editorial-text-muted)',
                                backgroundColor: 'var(--editorial-bg)',
                                padding: '1px 6px',
                                borderRadius: '2px',
                                fontWeight: 600,
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {cat.subcategories.length} topics
                            </span>
                            {selectedInCatCount > 0 && (
                              <span
                                style={{
                                  fontSize: '0.68rem',
                                  color: '#FFFFFF',
                                  backgroundColor: 'var(--editorial-green)',
                                  padding: '1px 6px',
                                  borderRadius: '999px',
                                  fontWeight: 700,
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                ✓ {selectedInCatCount}
                              </span>
                            )}
                          </div>

                          <p
                            style={{
                              margin: '2px 0 0',
                              fontSize: '0.72rem',
                              color: 'var(--editorial-text-muted)',
                              lineHeight: 1.3,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical'
                            }}
                          >
                            {cat.description}
                          </p>
                        </div>
                      </div>

                      {/* Expand Chevron Icon */}
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          color: 'var(--editorial-text-muted)'
                        }}
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>

                    {/* Subcategories Expandable Drawer */}
                    {isExpanded && (
                      <div
                        style={{
                          padding: '12px 14px 14px',
                          borderTop: '1px solid var(--editorial-border)',
                          backgroundColor: '#FCFAF7'
                        }}
                      >
                        {/* Bulk Action Controls */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '10px',
                            fontSize: '0.72rem'
                          }}
                        >
                          <span style={{ color: 'var(--editorial-text-muted)', fontWeight: 600 }}>
                            Tap topics to toggle:
                          </span>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                              type="button"
                              onClick={() => selectAllInCategory(cat.subcategories)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--editorial-green)',
                                fontWeight: 700,
                                cursor: 'pointer',
                                padding: '2px 4px'
                              }}
                            >
                              Select All {cat.subcategories.length}
                            </button>
                            <span style={{ color: 'var(--editorial-border)' }}>|</span>
                            <button
                              type="button"
                              onClick={() => clearCategory(cat.subcategories)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--editorial-text-muted)',
                                fontWeight: 600,
                                cursor: 'pointer',
                                padding: '2px 4px'
                              }}
                            >
                              Clear
                            </button>
                          </div>
                        </div>

                        {/* Subcategory Topic Pills */}
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px'
                          }}
                        >
                          {cat.subcategories.map(sub => {
                            const isSelected = currentSelected.includes(sub);

                            return (
                              <button
                                key={sub}
                                type="button"
                                className="topic-pill-btn"
                                title={sub}
                                onClick={() => toggleInterest(sub)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '7px 12px',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: '0.78rem',
                                  fontWeight: isSelected ? 700 : 500,
                                  lineHeight: 1.3,
                                  cursor: 'pointer',
                                  border: isSelected ? '1.5px solid var(--editorial-green)' : '1px solid var(--editorial-border)',
                                  backgroundColor: isSelected ? 'var(--editorial-green)' : '#FFFFFF',
                                  color: isSelected ? '#FFFFFF' : 'var(--editorial-text)',
                                  boxShadow: isSelected ? '0 2px 6px rgba(38,61,50,0.22)' : '0 1px 2px rgba(0,0,0,0.03)',
                                  transition: 'all 0.15s ease',
                                  textAlign: 'left',
                                  wordBreak: 'break-word',
                                  maxWidth: '100%',
                                  boxSizing: 'border-box'
                                }}
                              >
                                {isSelected ? (
                                  <Check size={13} strokeWidth={3} style={{ flexShrink: 0 }} />
                                ) : (
                                  <span style={{ color: 'var(--editorial-border-dark)', fontSize: '0.74rem', flexShrink: 0 }}>+</span>
                                )}
                                <span>{sub}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
