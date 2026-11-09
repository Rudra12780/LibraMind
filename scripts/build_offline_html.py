import os
import json
import base64

root_dir = os.path.abspath('.')
bp_dir = os.path.join(root_dir, 'offline_blueprints')
manifest_path = os.path.join(bp_dir, 'manifest.json')

with open(manifest_path, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

# Load each SVG
for item in manifest:
    svg_path = os.path.join(bp_dir, item['filename'])
    with open(svg_path, 'r', encoding='utf-8') as sf:
        item['svg'] = sf.read()

# Read the zip file as base64 so it can be downloaded directly from the offline HTML without any server!
zip_path = os.path.join(root_dir, 'LibraMind_Complete_Blueprints_Offline_Bundle.zip')
with open(zip_path, 'rb') as zf:
    zip_b64 = base64.b64encode(zf.read()).decode('ascii')

# Read the PPTX file as base64 as well if available
pptx_path = os.path.join(root_dir, 'LibraMind_Design_Thinking_Presentation.pptx')
pptx_b64 = ""
if os.path.exists(pptx_path):
    with open(pptx_path, 'rb') as pf:
        pptx_b64 = base64.b64encode(pf.read()).decode('ascii')

manifest_json = json.dumps(manifest)

html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LibraMind — Standalone Offline Website & 21 Architectural Blueprints</title>
  <style>
    :root {{
      --editorial-bg: #FAF8F5;
      --editorial-card: #FFFFFF;
      --editorial-border: #E8E2D8;
      --editorial-text: #1E2420;
      --editorial-muted: #5E6660;
      --editorial-accent: #1E3A2F;
      --editorial-accent-light: #527362;
      --editorial-gold: #C2923D;
      --editorial-terracotta: #9E5D3B;
      --editorial-parchment: #F5F1E8;
      --font-serif: 'Georgia', 'Playfair Display', 'Times New Roman', serif;
      --font-sans: 'Segoe UI', system-ui, -apple-system, sans-serif;
    }}

    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      font-family: var(--font-sans);
      background-color: var(--editorial-bg);
      color: var(--editorial-text);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }}

    /* Top Offline Banner */
    .offline-badge-bar {{
      background: #14221A;
      color: #E2ECE5;
      padding: 10px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      border-bottom: 1px solid #C2923D;
    }}
    .offline-badge-bar .badge {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(194, 146, 61, 0.25);
      border: 1px solid #C2923D;
      padding: 3px 10px;
      border-radius: 20px;
      font-weight: 600;
      color: #F7D488;
    }}
    .download-group {{
      display: flex;
      gap: 10px;
    }}
    .btn-offline-dl {{
      background: #C2923D;
      color: #14221A;
      border: none;
      padding: 5px 14px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
      text-decoration: none;
    }}
    .btn-offline-dl:hover {{
      background: #D9A84E;
      transform: translateY(-1px);
    }}
    .btn-offline-dl.outline {{
      background: transparent;
      color: #E2ECE5;
      border: 1px solid #527362;
    }}
    .btn-offline-dl.outline:hover {{
      border-color: #C2923D;
      color: #F7D488;
    }}

    /* Global Navigation */
    header.main-header {{
      background: #FFFFFF;
      border-bottom: 1px solid var(--editorial-border);
      padding: 16px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
    }}
    .logo-container {{
      display: flex;
      align-items: center;
      gap: 12px;
    }}
    .logo-emblem {{
      width: 38px;
      height: 38px;
      background: var(--editorial-accent);
      color: #FFFFFF;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-serif);
      font-size: 22px;
      font-weight: bold;
    }}
    .logo-text h1 {{
      font-family: var(--font-serif);
      font-size: 20px;
      color: var(--editorial-accent);
      letter-spacing: -0.5px;
    }}
    .logo-text p {{
      font-size: 11px;
      color: var(--editorial-muted);
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }}

    nav.main-nav {{
      display: flex;
      gap: 8px;
    }}
    .nav-tab-btn {{
      padding: 8px 16px;
      border-radius: 6px;
      border: 1px solid transparent;
      background: transparent;
      font-size: 14px;
      font-weight: 500;
      color: var(--editorial-muted);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }}
    .nav-tab-btn:hover {{
      background: var(--editorial-parchment);
      color: var(--editorial-accent);
    }}
    .nav-tab-btn.active {{
      background: var(--editorial-accent);
      color: #FFFFFF;
      font-weight: 600;
    }}

    /* Container */
    .app-container {{
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px;
    }}

    .tab-content {{
      display: none;
    }}
    .tab-content.active {{
      display: block;
    }}

    /* Blueprints Mode Layout */
    .blueprints-workspace {{
      display: grid;
      grid-template-columns: 340px 1fr;
      gap: 24px;
      min-height: 820px;
    }}
    .bp-sidebar {{
      background: #FFFFFF;
      border: 1px solid var(--editorial-border);
      border-radius: 8px;
      padding: 16px;
      height: calc(100vh - 160px);
      position: sticky;
      top: 90px;
      overflow-y: auto;
    }}
    .bp-sidebar-header {{
      padding-bottom: 12px;
      border-bottom: 1px solid var(--editorial-border);
      margin-bottom: 12px;
    }}
    .bp-sidebar-header h2 {{
      font-size: 16px;
      color: var(--editorial-accent);
      font-family: var(--font-serif);
    }}
    .bp-sidebar-header p {{
      font-size: 12px;
      color: var(--editorial-muted);
    }}

    .bp-group-title {{
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--editorial-terracotta);
      margin: 16px 0 8px 6px;
    }}
    .bp-item-btn {{
      width: 100%;
      text-align: left;
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid transparent;
      background: transparent;
      cursor: pointer;
      font-size: 13px;
      color: var(--editorial-text);
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
      transition: all 0.15s;
    }}
    .bp-item-btn:hover {{
      background: var(--editorial-parchment);
    }}
    .bp-item-btn.active {{
      background: #EBF2ED;
      border-color: #527362;
      color: var(--editorial-accent);
      font-weight: 600;
    }}
    .bp-item-btn .num-pill {{
      font-size: 11px;
      padding: 1px 6px;
      background: var(--editorial-border);
      border-radius: 10px;
      color: var(--editorial-muted);
    }}

    /* Main Blueprint Viewer */
    .bp-viewer-card {{
      background: #FFFFFF;
      border: 1px solid var(--editorial-border);
      border-radius: 8px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }}
    .bp-viewer-header {{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--editorial-border);
    }}
    .bp-title-area h2 {{
      font-family: var(--font-serif);
      font-size: 24px;
      color: var(--editorial-accent);
    }}
    .bp-title-area p {{
      font-size: 14px;
      color: var(--editorial-muted);
      margin-top: 4px;
    }}
    .bp-meta-tags {{
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }}
    .bp-tag {{
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      background: var(--editorial-parchment);
      color: var(--editorial-accent);
      border: 1px solid var(--editorial-border);
    }}

    .bp-actions {{
      display: flex;
      gap: 8px;
    }}
    .btn-action {{
      padding: 6px 14px;
      border-radius: 6px;
      border: 1px solid var(--editorial-border);
      background: #FFFFFF;
      font-size: 13px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }}
    .btn-action:hover {{
      background: var(--editorial-parchment);
      border-color: var(--editorial-accent-light);
    }}
    .btn-action.primary {{
      background: var(--editorial-accent);
      color: #FFFFFF;
      border-color: var(--editorial-accent);
    }}
    .btn-action.primary:hover {{
      background: #142820;
    }}

    .bp-canvas-container {{
      background: #FAF8F5;
      border: 1px solid var(--editorial-border);
      border-radius: 6px;
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 900px;
      overflow-x: auto;
    }}
    .bp-svg-wrapper {{
      max-width: 900px;
      width: 100%;
      background: #FFFFFF;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
      border: 1px solid #D9D3C7;
      border-radius: 4px;
    }}
    .bp-svg-wrapper svg {{
      width: 100%;
      height: auto;
      display: block;
    }}

    .bp-sections-list {{
      margin-top: 16px;
      padding: 16px;
      background: var(--editorial-parchment);
      border-radius: 6px;
      border: 1px solid var(--editorial-border);
    }}
    .bp-sections-list h4 {{
      font-size: 13px;
      color: var(--editorial-accent);
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }}
    .bp-sections-list ul {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 8px;
      list-style: none;
    }}
    .bp-sections-list li {{
      font-size: 12.5px;
      color: var(--editorial-text);
      display: flex;
      align-items: center;
      gap: 6px;
    }}

    /* Simulated Live Website Styles */
    .website-hero {{
      background: linear-gradient(135deg, #1A3024 0%, #264435 100%);
      color: #FFFFFF;
      border-radius: 12px;
      padding: 48px;
      position: relative;
      overflow: hidden;
      margin-bottom: 32px;
      border: 1px solid #C2923D;
    }}
    .website-hero h2 {{
      font-family: var(--font-serif);
      font-size: 38px;
      line-height: 1.2;
      max-width: 650px;
      margin-bottom: 16px;
    }}
    .website-hero p {{
      font-size: 16px;
      color: #D3E0D8;
      max-width: 600px;
      margin-bottom: 24px;
    }}
    .hero-search-box {{
      display: flex;
      gap: 12px;
      max-width: 640px;
      background: #FFFFFF;
      padding: 8px;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }}
    .hero-search-box input {{
      flex: 1;
      border: none;
      padding: 10px 14px;
      font-size: 15px;
      outline: none;
      color: #1E2420;
    }}
    .hero-search-box button {{
      background: var(--editorial-terracotta);
      color: #FFFFFF;
      border: none;
      padding: 10px 24px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
    }}

    .stats-ribbon {{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }}
    .stat-card {{
      background: #FFFFFF;
      border: 1px solid var(--editorial-border);
      border-radius: 8px;
      padding: 20px;
      text-align: center;
    }}
    .stat-card .val {{
      font-family: var(--font-serif);
      font-size: 28px;
      font-weight: bold;
      color: var(--editorial-accent);
    }}
    .stat-card .lbl {{
      font-size: 12px;
      color: var(--editorial-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 4px;
    }}

    .section-title {{
      font-family: var(--font-serif);
      font-size: 26px;
      color: var(--editorial-accent);
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }}

    /* Catalog Grid */
    .book-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }}
    .book-card {{
      background: #FFFFFF;
      border: 1px solid var(--editorial-border);
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all 0.2s;
    }}
    .book-card:hover {{
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
      border-color: var(--editorial-accent-light);
    }}
    .book-cover {{
      height: 180px;
      background: #EFECE6;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      border-bottom: 1px solid var(--editorial-border);
    }}
    .book-cover .genre-pill {{
      position: absolute;
      top: 10px;
      left: 10px;
      background: var(--editorial-accent);
      color: #FFFFFF;
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 600;
    }}
    .book-cover .status-pill {{
      position: absolute;
      top: 10px;
      right: 10px;
      background: #2E7D32;
      color: #FFFFFF;
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 600;
    }}
    .book-body {{
      padding: 16px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }}
    .book-title {{
      font-family: var(--font-serif);
      font-size: 16px;
      font-weight: bold;
      color: var(--editorial-text);
      line-height: 1.3;
      margin-bottom: 4px;
    }}
    .book-author {{
      font-size: 13px;
      color: var(--editorial-muted);
      margin-bottom: 12px;
    }}
    .book-shelf-coord {{
      font-size: 12px;
      background: var(--editorial-parchment);
      padding: 6px 10px;
      border-radius: 4px;
      color: var(--editorial-accent);
      font-weight: 600;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }}
    .book-card-actions {{
      margin-top: auto;
      display: flex;
      gap: 8px;
    }}
    .btn-book-action {{
      flex: 1;
      padding: 8px;
      border-radius: 6px;
      border: 1px solid var(--editorial-border);
      background: #FFFFFF;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      text-align: center;
      transition: all 0.15s;
    }}
    .btn-book-action.primary {{
      background: var(--editorial-accent);
      color: #FFFFFF;
      border-color: var(--editorial-accent);
    }}
    .btn-book-action.primary:hover {{
      background: #142820;
    }}

    /* Seat Map Simulation */
    .seat-map-grid {{
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 12px;
      padding: 24px;
      background: #FFFFFF;
      border: 1px solid var(--editorial-border);
      border-radius: 8px;
      margin-bottom: 32px;
    }}
    .seat-box {{
      aspect-ratio: 1;
      border-radius: 6px;
      border: 1px solid #D9D3C7;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }}
    .seat-box.available {{
      background: #E8F5E9;
      color: #2E7D32;
      border-color: #A5D6A7;
    }}
    .seat-box.occupied {{
      background: #FFEBEE;
      color: #C62828;
      border-color: #EF9A9A;
      cursor: not-allowed;
    }}
    .seat-box.selected {{
      background: #1E3A2F;
      color: #FFFFFF;
      border-color: #1E3A2F;
      box-shadow: 0 0 0 2px #C2923D;
    }}

    /* Toast Notification */
    #offline-toast {{
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #1E3A2F;
      color: #FFFFFF;
      padding: 12px 20px;
      border-radius: 6px;
      border-left: 4px solid #C2923D;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      font-size: 13.5px;
      display: none;
      z-index: 1000;
    }}
  </style>
</head>
<body>

  <!-- Top Offline Header Bar -->
  <div class="offline-badge-bar">
    <div style="display: flex; align-items: center; gap: 12px;">
      <span class="badge">⚡ OFFLINE MODE</span>
      <span><strong>LibraMind Standalone Edition</strong> — Complete website & all 21 architectural blueprints accessible without internet or server!</span>
    </div>
    <div class="download-group">
      <button class="btn-offline-dl" onclick="downloadZipOffline()">
        📦 Download All 21 Blueprints (.ZIP)
      </button>

      <button class="btn-offline-dl outline" onclick="window.print()">
        🖨️ Print / PDF
      </button>
    </div>
  </div>

  <!-- Global Application Header -->
  <header class="main-header">
    <div class="logo-container">
      <div class="logo-emblem">L</div>
      <div class="logo-text">
        <h1>LibraMind</h1>
        <p>AI-Powered Smart Library Management System</p>
      </div>
    </div>
    <nav class="main-nav">
      <button class="nav-tab-btn active" onclick="switchMainTab('blueprints')">
        📐 Architectural Blueprints (21 Pages)
      </button>
      <button class="nav-tab-btn" onclick="switchMainTab('catalog')">
        📚 Simulated Book Catalog
      </button>
      <button class="nav-tab-btn" onclick="switchMainTab('seats')">
        🪑 Seat Concurrency Map
      </button>
      <button class="nav-tab-btn" onclick="switchMainTab('dashboards')">
        👤 Tri-Portal Consoles
      </button>
    </nav>
  </header>

  <div class="app-container">

    <!-- TAB 1: BLUEPRINTS WORKSPACE -->
    <div id="tab-blueprints" class="tab-content active">
      <div class="blueprints-workspace">
        <!-- Sidebar -->
        <aside class="bp-sidebar">
          <div class="bp-sidebar-header">
            <h2>Design Thinking Blueprints</h2>
            <p>21 Complete Balsamiq-Style UI Wireframes</p>
          </div>
          <div id="bp-nav-list">
            <!-- Injected by JavaScript -->
          </div>
        </aside>

        <!-- Main Viewer -->
        <main class="bp-viewer-card">
          <div class="bp-viewer-header">
            <div class="bp-title-area">
              <h2 id="active-bp-title">Loading Blueprint...</h2>
              <p id="active-bp-desc">Architectural specification and section layout.</p>
              <div class="bp-meta-tags">
                <span class="bp-tag" id="active-bp-route">Route: /home</span>
                <span class="bp-tag" id="active-bp-tier">Public Tier</span>
                <span class="bp-tag" id="active-bp-num">Page 1 of 21</span>
              </div>
            </div>
            <div class="bp-actions">
              <button class="btn-action primary" onclick="downloadCurrentSVG()">
                💾 Download This SVG
              </button>
              <button class="btn-action" onclick="downloadZipOffline()">
                📦 Download All (.ZIP)
              </button>
            </div>
          </div>

          <!-- Canvas Viewport -->
          <div class="bp-canvas-container">
            <div class="bp-svg-wrapper" id="bp-svg-target">
              <!-- SVG is dynamically inserted here -->
            </div>
          </div>

          <div class="bp-sections-list">
            <h4>Structural Sections & Component Blueprint</h4>
            <ul id="active-bp-sections">
              <!-- Sections injected here -->
            </ul>
          </div>
        </main>
      </div>
    </div>

    <!-- TAB 2: SIMULATED BOOK CATALOG -->
    <div id="tab-catalog" class="tab-content">
      <div class="website-hero">
        <h2>Sanctuary of Human Knowledge</h2>
        <p>Explore thousands of volumes indexed with 4-tier spatial rack coordinates, real-time availability badges, and intelligent semantic categorization.</p>
        <div class="hero-search-box">
          <input type="text" id="offline-search-input" placeholder="Search by title, author, topic, ISBN, or aisle number..." onkeyup="filterBooksOffline()">
          <button onclick="filterBooksOffline()">Search Catalog</button>
        </div>
      </div>

      <div class="stats-ribbon">
        <div class="stat-card">
          <div class="val">18,450</div>
          <div class="lbl">Total Cataloged Volumes</div>
        </div>
        <div class="stat-card">
          <div class="val">14,210</div>
          <div class="lbl">Available on Shelves</div>
        </div>
        <div class="stat-card">
          <div class="val">4-Tier</div>
          <div class="lbl">Floor & Rack Guidance</div>
        </div>
        <div class="stat-card">
          <div class="val">100%</div>
          <div class="lbl">Offline Self-Contained</div>
        </div>
      </div>

      <div class="section-title">
        <span>Curated Volumes in Circulation</span>
        <span style="font-size: 14px; font-family: var(--font-sans); color: var(--editorial-muted);">Showing 8 featured volumes</span>
      </div>

      <div class="book-grid" id="offline-book-grid">
        <!-- Injected via JavaScript -->
      </div>
    </div>

    <!-- TAB 3: SEAT CONCURRENCY MAP -->
    <div id="tab-seats" class="tab-content">
      <div class="section-title">
        <span>Floor 2: Silent Study Carrels & Focus Pods</span>
        <span style="font-size: 14px; font-family: var(--font-sans); color: var(--editorial-muted);">Click any green carrel to test offline reservation</span>
      </div>
      <p style="color: var(--editorial-muted); margin-bottom: 20px;">
        LibraMind uses atomic lock states to guarantee that no two scholars can reserve the same study carrel simultaneously.
      </p>

      <div class="seat-map-grid" id="offline-seat-grid">
        <!-- Injected via JavaScript -->
      </div>

      <div style="background: #FFFFFF; border: 1px solid var(--editorial-border); padding: 20px; border-radius: 8px; display: flex; gap: 24px; justify-content: center;">
        <span style="display: inline-flex; align-items: center; gap: 8px; font-size: 13px;"><span style="width: 14px; height: 14px; background: #E8F5E9; border: 1px solid #A5D6A7; border-radius: 3px;"></span> Available Carrel</span>
        <span style="display: inline-flex; align-items: center; gap: 8px; font-size: 13px;"><span style="width: 14px; height: 14px; background: #FFEBEE; border: 1px solid #EF9A9A; border-radius: 3px;"></span> Occupied / Reserved</span>
        <span style="display: inline-flex; align-items: center; gap: 8px; font-size: 13px;"><span style="width: 14px; height: 14px; background: #1E3A2F; border: 1px solid #C2923D; border-radius: 3px;"></span> Your Selected Carrel</span>
      </div>
    </div>

    <!-- TAB 4: TRI-PORTAL CONSOLES -->
    <div id="tab-dashboards" class="tab-content">
      <div class="section-title">
        <span>Tri-Portal Role-Based Consoles (Offline Interactive Overview)</span>
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
        <div style="background: #FFFFFF; border: 1px solid var(--editorial-border); border-radius: 8px; padding: 24px;">
          <h3 style="font-family: var(--font-serif); color: var(--editorial-accent); margin-bottom: 8px;">🎓 Student Sanctuary Hub</h3>
          <p style="font-size: 13px; color: var(--editorial-muted); margin-bottom: 16px;">Route: /dashboard</p>
          <ul style="font-size: 13px; line-height: 1.8; color: var(--editorial-text); padding-left: 20px;">
            <li>Active loan tracking with auto-due dates</li>
            <li>Single-click loan renewals</li>
            <li>Waiting list reservation queue</li>
            <li>Study seat reservation pass</li>
            <li>Penalty settlement status</li>
          </ul>
        </div>

        <div style="background: #FFFFFF; border: 1px solid var(--editorial-border); border-radius: 8px; padding: 24px;">
          <h3 style="font-family: var(--font-serif); color: var(--editorial-accent); margin-bottom: 8px;">📋 Librarian Circulation Desk</h3>
          <p style="font-size: 13px; color: var(--editorial-muted); margin-bottom: 16px;">Route: /librarian</p>
          <ul style="font-size: 13px; line-height: 1.8; color: var(--editorial-text); padding-left: 20px;">
            <li>Barcode copy lookup & patron association</li>
            <li>Instant check-in / check-out dispatcher</li>
            <li>Waiting list patron priority assignment</li>
            <li>14-day loan expiration penalty alerts</li>
            <li>Overdue return warning sender</li>
          </ul>
        </div>

        <div style="background: #FFFFFF; border: 1px solid var(--editorial-border); border-radius: 8px; padding: 24px;">
          <h3 style="font-family: var(--font-serif); color: var(--editorial-accent); margin-bottom: 8px;">🏛️ Administrator Central Control</h3>
          <p style="font-size: 13px; color: var(--editorial-muted); margin-bottom: 16px;">Route: /admin</p>
          <ul style="font-size: 13px; line-height: 1.8; color: var(--editorial-text); padding-left: 20px;">
            <li>Role-Based Access Control (RBAC)</li>
            <li>System audit trail & transaction ledger</li>
            <li>Physical stack coordinates configuration</li>
            <li>Circulation velocity & demand forecasts</li>
            <li>Database WAL backups & maintenance</li>
          </ul>
        </div>
      </div>
    </div>

  </div>

  <div id="offline-toast">Notification Message</div>

  <script>
    // Embedded Manifest and SVGs
    const MANIFEST = {manifest_json};
    const ZIP_B64 = "{zip_b64}";
    const PPTX_B64 = "{pptx_b64}";

    let currentBpIndex = 0;

    // Initialize Blueprints Sidebar
    function initBlueprintsSidebar() {{
      const container = document.getElementById('bp-nav-list');
      container.innerHTML = '';

      let currentCategory = '';
      MANIFEST.forEach((bp, idx) => {{
        if (bp.category !== currentCategory) {{
          currentCategory = bp.category;
          const catTitle = document.createElement('div');
          catTitle.className = 'bp-group-title';
          catTitle.textContent = currentCategory;
          container.appendChild(catTitle);
        }}

        const btn = document.createElement('button');
        btn.className = 'bp-item-btn' + (idx === 0 ? ' active' : '');
        btn.id = 'bp-btn-' + idx;
        btn.onclick = () => selectBlueprint(idx);
        btn.innerHTML = `
          <span>${{bp.shortTitle}}</span>
          <span class="num-pill">P.${{bp.pageNumber}}</span>
        `;
        container.appendChild(btn);
      }});

      renderActiveBlueprint();
    }}

    function selectBlueprint(idx) {{
      document.querySelectorAll('.bp-item-btn').forEach(b => b.classList.remove('active'));
      const activeBtn = document.getElementById('bp-btn-' + idx);
      if (activeBtn) activeBtn.classList.add('active');
      currentBpIndex = idx;
      renderActiveBlueprint();
    }}

    function renderActiveBlueprint() {{
      const bp = MANIFEST[currentBpIndex];
      document.getElementById('active-bp-title').textContent = bp.name;
      document.getElementById('active-bp-desc').textContent = bp.desc;
      document.getElementById('active-bp-route').textContent = 'Route: ' + bp.route;
      document.getElementById('active-bp-tier').textContent = bp.category;
      document.getElementById('active-bp-num').textContent = 'Page ' + bp.pageNumber + ' of ' + MANIFEST.length;

      document.getElementById('bp-svg-target').innerHTML = bp.svg;

      const secList = document.getElementById('active-bp-sections');
      secList.innerHTML = '';
      bp.sections.forEach(sec => {{
        const li = document.createElement('li');
        li.innerHTML = '<span>✦</span> ' + sec;
        secList.appendChild(li);
      }});
    }}

    function downloadCurrentSVG() {{
      const bp = MANIFEST[currentBpIndex];
      const blob = new Blob([bp.svg], {{ type: 'image/svg+xml;charset=utf-8' }});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = bp.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Downloaded ' + bp.filename);
    }}

    function downloadZipOffline() {{
      if (!ZIP_B64) {{
        alert('ZIP package not embedded.');
        return;
      }}
      const byteCharacters = atob(ZIP_B64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {{
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }}
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {{ type: 'application/zip' }});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'LibraMind_Complete_Blueprints_Offline_Bundle.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Downloaded Complete Offline Blueprints (.ZIP)!');
    }}

    function downloadPptxOffline() {{
      if (!PPTX_B64) {{
        alert('PowerPoint file is compiling. Please check the project directory for the .pptx file.');
        return;
      }}
      const byteCharacters = atob(PPTX_B64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {{
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }}
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {{ type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' }});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'LibraMind_Design_Thinking_Presentation.pptx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Downloaded Book-Themed Presentation (.PPTX)!');
    }}

    function switchMainTab(tabId) {{
      document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
      document.querySelectorAll('.nav-tab-btn').forEach(b => b.classList.remove('active'));

      const target = document.getElementById('tab-' + tabId);
      if (target) target.classList.add('active');

      event.currentTarget.classList.add('active');
    }}

    function showToast(msg) {{
      const t = document.getElementById('offline-toast');
      t.textContent = msg;
      t.style.display = 'block';
      setTimeout(() => {{ t.style.display = 'none'; }}, 3500);
    }}

    // Sample Offline Books
    const SAMPLE_BOOKS = [
      {{ id: 1, title: 'The Bhagavad Gita: Walk the Path of Inner Peace', author: 'Eknath Easwaran', genre: 'Spiritual & Wisdom', year: 2007, shelf: 'Floor 1 · Shelf SP-01', copies: 2 }},
      {{ id: 2, title: 'A Man Called Ove', author: 'Fredrik Backman', genre: 'Emotional Fiction', year: 2014, shelf: 'Floor 2 · Shelf EF-02', copies: 1 }},
      {{ id: 3, title: 'The Power of Now: Spiritual Enlightenment', author: 'Eckhart Tolle', genre: 'Spiritual & Wisdom', year: 2004, shelf: 'Floor 1 · Shelf SP-02', copies: 4 }},
      {{ id: 4, title: 'A Monster Calls', author: 'Patrick Ness', genre: 'Emotional Fiction', year: 2013, shelf: 'Floor 2 · Shelf EF-11', copies: 2 }},
      {{ id: 5, title: 'Atomic Habits: Tiny Changes, Remarkable Results', author: 'James Clear', genre: 'Motivation & Growth', year: 2018, shelf: 'Floor 1 · Shelf MO-05', copies: 3 }},
      {{ id: 6, title: 'Deep Work: Rules for Focused Success', author: 'Cal Newport', genre: 'Productivity & Tech', year: 2016, shelf: 'Floor 3 · Shelf CS-08', copies: 2 }},
      {{ id: 7, title: 'Introduction to Algorithms (CLRS)', author: 'Cormen, Leiserson, Rivest', genre: 'Computer Science', year: 2022, shelf: 'Floor 3 · Shelf CS-01', copies: 5 }},
      {{ id: 8, title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', genre: 'Software Engineering', year: 2017, shelf: 'Floor 3 · Shelf CS-04', copies: 3 }}
    ];

    function renderBooks(books) {{
      const grid = document.getElementById('offline-book-grid');
      grid.innerHTML = '';
      books.forEach(b => {{
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
          <div class="book-cover">
            <span class="genre-pill">${{b.genre}}</span>
            <span class="status-pill">${{b.copies}} in Stacks</span>
            <div style="font-family: var(--font-serif); font-size: 40px; color: #527362; opacity: 0.3;">📖</div>
          </div>
          <div class="book-body">
            <div class="book-title">${{b.title}}</div>
            <div class="book-author">by ${{b.author}} (${{b.year}})</div>
            <div class="book-shelf-coord">📍 ${{b.shelf}}</div>
            <div class="book-card-actions">
              <button class="btn-book-action" onclick="showToast('Viewing details for: ${{b.title}}')">Details</button>
              <button class="btn-book-action primary" onclick="showToast('Simulated Loan: ${{b.title}} reserved for checkout!')">Borrow Book</button>
            </div>
          </div>
        `;
        grid.appendChild(card);
      }});
    }}

    function filterBooksOffline() {{
      const query = document.getElementById('offline-search-input').value.toLowerCase();
      const filtered = SAMPLE_BOOKS.filter(b => 
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query) ||
        b.genre.toLowerCase().includes(query) ||
        b.shelf.toLowerCase().includes(query)
      );
      renderBooks(filtered);
    }}

    // Initialize Seat Grid
    function initSeats() {{
      const grid = document.getElementById('offline-seat-grid');
      grid.innerHTML = '';
      for (let i = 1; i <= 32; i++) {{
        const seat = document.createElement('div');
        const isOccupied = [3, 7, 11, 14, 18, 22, 27, 30].includes(i);
        seat.className = 'seat-box ' + (isOccupied ? 'occupied' : 'available');
        seat.innerHTML = `<span>P-${{String(i).padStart(2, '0')}}</span><span style="font-size: 9px; opacity: 0.8;">${{isOccupied ? 'In Use' : 'Free'}}</span>`;
        if (!isOccupied) {{
          seat.onclick = function() {{
            document.querySelectorAll('.seat-box.selected').forEach(s => s.classList.replace('selected', 'available'));
            seat.className = 'seat-box selected';
            showToast('Pod P-' + String(i).padStart(2, '0') + ' reserved in offline test session!');
          }};
        }}
        grid.appendChild(seat);
      }}
    }}

    // Bootstrap
    window.onload = function() {{
      initBlueprintsSidebar();
      renderBooks(SAMPLE_BOOKS);
      initSeats();
    }};
  </script>
</body>
</html>
"""

out_html_root = os.path.join(root_dir, 'LibraMind_Offline_Website_&_Blueprints.html')
out_html_public = os.path.join(root_dir, 'frontend', 'public', 'LibraMind_Offline_Website_&_Blueprints.html')
out_html_bp = os.path.join(bp_dir, 'index.html')

with open(out_html_root, 'w', encoding='utf-8') as f:
    f.write(html_template)

with open(out_html_public, 'w', encoding='utf-8') as f:
    f.write(html_template)

with open(out_html_bp, 'w', encoding='utf-8') as f:
    f.write(html_template)

print(f"Generated standalone offline HTML viewer:")
print(f"  -> {out_html_root} ({os.path.getsize(out_html_root)} bytes)")
print(f"  -> {out_html_public}")
print(f"  -> {out_html_bp}")

