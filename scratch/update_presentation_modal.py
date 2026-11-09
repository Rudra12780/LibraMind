with open('frontend/src/components/PresentationModal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the slidesData array
old_array_pattern = r'const slidesData = \[\s*\{ num: 1[\s\S]*?\{ num: 15[\s\S]*?\}\s*\];'

new_array = '''const slidesData = [
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
  ];'''

import re
content = re.sub(old_array_pattern, new_array, content)

# Also add buttons to open offline viewer and download offline zip in PresentationModal header
old_hdr_btn = '<button\n              onClick={handleDownload}'
new_hdr_btn = '''<a
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
              onClick={handleDownload}'''

if old_hdr_btn in content:
    content = content.replace(old_hdr_btn, new_hdr_btn, 1)

with open('frontend/src/components/PresentationModal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated PresentationModal.jsx successfully!")

