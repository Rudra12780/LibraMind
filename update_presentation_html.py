"""
Update presentation.html to have the exact 15-slide curriculum:
1. Title slide: Project title, team members, roll numbers, department, institution, faculty mentor
2. Introduction: Background, context, significance
3. Project overview: Scope, objectives, intended outcomes
4. User research: Target users, sampling, methods, interviews, observations, sample size
5. Empathise: Empathy map, user needs, pain points
6. Statistical findings: Descriptive statistics, charts, correlations, baseline hypothesis test
7. Define: Persona, POV, HMW, MoSCoW
8. Ideation: Brainstorming methods, alternative ideas, sketches
9. Idea selection: Selection criteria, justification, hypotheses
10. Prototype: Architecture (frontend, backend, database), wireframes, screenshots, demonstration
11. Testing and validation: Method, participants, tests used, results, p-values, confidence intervals
12. Results and iterations: Feedback, improvement in numbers, changes made
13. Impact and limitations: Benefits, feasibility, threats to validity
14. Conclusion and future scope: Learning, conclusion, improvements
15. References and Q&A: Sources, acknowledgements, questions
"""

import shutil

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LibraMind — 15-Slide Design Thinking Presentation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --charcoal: #242120;
      --charcoal-muted: #6D645D;
      --boho-olive: #435340;
      --boho-sage: #627254;
      --soft-sage: #E9EFE7;
      --cream: #FAF7F2;
      --sandstone: #F3ECE2;
      --clay: #F7ECE6;
      --terracotta: #B95D3B;
      --ochre: #C88E46;
      --border: #DFD6C9;
      --card-bg: #FFFFFF;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Outfit', sans-serif;
      background-color: #1a221b;
      color: var(--charcoal);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      overflow: hidden;
      padding: 16px;
    }

    .deck-container {
      position: relative;
      width: 95vw;
      max-width: 1320px;
      aspect-ratio: 16 / 9;
      background-color: var(--cream);
      border-radius: 16px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .slide {
      display: none;
      width: 100%;
      height: 100%;
      padding: 36px 48px;
      flex-direction: column;
      animation: fadeIn 0.25s ease-out;
      overflow-y: auto;
    }

    .slide.active {
      display: flex;
    }

    .slide-dark {
      background: linear-gradient(135deg, #1f2720 0%, #29352c 100%);
      color: var(--cream);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .slide-tag {
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--terracotta);
      margin-bottom: 4px;
    }

    .slide-dark .slide-tag {
      color: var(--ochre);
    }

    .slide-title {
      font-size: 1.85rem;
      font-weight: 700;
      font-family: 'Newsreader', serif;
      color: var(--charcoal);
      line-height: 1.2;
      margin-bottom: 4px;
    }

    .slide-dark .slide-title {
      color: #FFFFFF;
    }

    .slide-subtitle {
      font-size: 0.88rem;
      color: var(--charcoal-muted);
      margin-bottom: 12px;
    }

    .slide-dark .slide-subtitle {
      color: var(--soft-sage);
    }

    .divider {
      height: 2px;
      width: 100%;
      background: linear-gradient(90deg, var(--terracotta) 0%, var(--ochre) 35%, var(--border) 100%);
      margin-bottom: 18px;
      border-radius: 2px;
      opacity: 0.6;
    }

    .slide-dark .divider {
      background: linear-gradient(90deg, var(--ochre) 0%, var(--boho-olive) 50%, rgba(255,255,255,0.1) 100%);
    }

    .split-layout {
      display: grid;
      grid-template-columns: 1.15fr 1fr;
      gap: 24px;
      flex: 1;
      min-height: 0;
      align-items: stretch;
    }

    .image-card {
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
      min-height: 0;
      overflow: hidden;
    }

    .image-card img {
      width: 100%;
      height: 100%;
      max-height: 380px;
      object-fit: contain;
      border-radius: 8px;
    }

    .image-caption {
      margin-top: 8px;
      font-size: 0.76rem;
      color: var(--charcoal-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .content-card {
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      overflow-y: auto;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
    }

    .content-box {
      background: var(--sandstone);
      border-left: 3px solid var(--boho-olive);
      border-radius: 0 8px 8px 0;
      padding: 10px 14px;
    }

    .content-box h4 {
      font-size: 0.88rem;
      color: var(--boho-olive);
      margin-bottom: 4px;
      font-weight: 700;
    }

    .content-box p, .content-box ul {
      font-size: 0.82rem;
      line-height: 1.5;
      color: var(--charcoal);
    }

    .content-box ul {
      padding-left: 16px;
    }

    .content-box li {
      margin-bottom: 3px;
    }

    .metric-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }

    .metric-tile {
      background: var(--clay);
      border: 1px solid rgba(185, 93, 59, 0.2);
      border-radius: 8px;
      padding: 10px;
      text-align: center;
    }

    .metric-val {
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--terracotta);
      font-family: 'Newsreader', serif;
    }

    .metric-lbl {
      font-size: 0.72rem;
      color: var(--charcoal-muted);
      font-weight: 600;
      text-transform: uppercase;
    }

    /* Footer & Controls */
    .deck-footer {
      padding: 10px 48px;
      background: #FFFFFF;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.78rem;
      color: var(--charcoal-muted);
    }

    .controls-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 95vw;
      max-width: 1320px;
      margin-top: 12px;
      color: #d1dad4;
      font-size: 0.88rem;
    }

    .btn-nav {
      background: var(--boho-olive);
      color: var(--cream);
      border: 1px solid var(--boho-sage);
      padding: 8px 18px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-family: inherit;
      transition: all 0.2s;
    }

    .btn-nav:hover {
      background: #344232;
    }

    .btn-nav:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .btn-download {
      background: var(--terracotta);
      border-color: #9d4c2e;
    }

    .btn-download:hover {
      background: #a24b2b;
    }
  </style>
</head>
<body>

  <div class="deck-container">

    <!-- SLIDE 1: Title Slide -->
    <div class="slide slide-dark active" id="slide-1">
      <div style="margin: auto 0; max-width: 1100px;">
        <div class="slide-tag">CHAPTER 01 • ACADEMIC DEFENSE & VIVA 2026</div>
        <h1 class="slide-title" style="font-size: 3.2rem; margin-bottom: 6px;">LibraMind</h1>
        <h2 style="font-size: 1.35rem; font-weight: 400; color: var(--soft-sage); margin-bottom: 24px;">
          AI-Powered Smart Library Management System: A Human-Centered Design Thinking Approach
        </h2>
        <div class="divider"></div>

        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 28px; margin-top: 20px;">
          <div style="background: rgba(255,255,255,0.06); padding: 18px 22px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.12);">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--ochre); margin-bottom: 10px; text-transform: uppercase;">Team Members & Roles</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.84rem;">
              <div>
                <strong>Aarav Sharma</strong> (22BCS014)<br>
                <span style="color: var(--soft-sage); font-size: 0.78rem;">Research Lead: Interviews & Empathy Map</span>
              </div>
              <div>
                <strong>Diya Patel</strong> (22BCS029)<br>
                <span style="color: var(--soft-sage); font-size: 0.78rem;">Statistics Lead: Sampling & Hypothesis</span>
              </div>
              <div>
                <strong>Rohan Mehta</strong> (22BCS041)<br>
                <span style="color: var(--soft-sage); font-size: 0.78rem;">Frontend Lead: Wireframes & React</span>
              </div>
              <div>
                <strong>Ananya Iyer</strong> (22BCS058)<br>
                <span style="color: var(--soft-sage); font-size: 0.78rem;">Backend Lead: Python, SQLite & Engine</span>
              </div>
            </div>
            <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.15); font-size: 0.82rem;">
              <strong>Project & Doc Lead:</strong> Aarav Sharma (Planning, ideation facilitation, viva presentation)
            </div>
          </div>

          <div style="background: rgba(255,255,255,0.06); padding: 18px 22px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.12);">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--ochre); margin-bottom: 10px; text-transform: uppercase;">Academic Supervision & Institution</div>
            <p style="font-size: 0.84rem; line-height: 1.6; margin-bottom: 12px;">
              <strong>Department:</strong> Department of Computer Science & Engineering<br>
              <strong>Institution:</strong> National Institute of Technology & Advanced Engineering<br>
              <strong>Degree:</strong> Bachelor of Technology (CSE) — Final Year Capstone
            </p>
            <div style="background: rgba(200, 142, 70, 0.15); padding: 8px 12px; border-radius: 8px; border-left: 3px solid var(--ochre);">
              <strong style="color: #FFFFFF; font-size: 0.84rem;">Faculty Mentor:</strong><br>
              <span style="font-size: 0.82rem; color: var(--soft-sage);">Dr. S. K. Mukherjee, Ph.D. — Professor & Head of Information Systems</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 2: Introduction -->
    <div class="slide" id="slide-2">
      <div class="slide-tag">CHAPTER 02 • CONTEXT & SIGNIFICANCE</div>
      <h2 class="slide-title">Introduction: Background, Context & Significance</h2>
      <div class="slide-subtitle">Transforming academic research friction into an intuitive, biophilic sanctuary</div>
      <div class="divider"></div>
      <div class="split-layout">
        <div class="content-card">
          <div class="content-box">
            <h4>1. Problem Background</h4>
            <p>University libraries are foundational academic sanctuaries, yet legacy OPAC catalogs and manual checkouts impose severe cognitive friction. Students lose precious research time wandering physical aisles searching for misplaced or cryptic Dewey decimal call numbers.</p>
          </div>
          <div class="content-box">
            <h4>2. Academic Context & Pressure</h4>
            <p>Modern university scholars juggle intense multi-course project schedules. Friction in finding core texts and unpredictable contention for quiet study carrels directly degrade student academic performance and increase stress.</p>
          </div>
          <div class="content-box">
            <h4>3. Core Significance</h4>
            <p>LibraMind redefines academic infrastructure by uniting deterministic 4-tier stack telemetry (Floor → Zone → Aisle → Shelf), guaranteed 12-hour AM/PM study carrels, and natural language AI retrieval in one biophilic sanctuary.</p>
          </div>
        </div>
        <div class="content-card">
          <div style="font-weight: 700; font-size: 0.92rem; color: var(--boho-olive); margin-bottom: 6px;">Traditional OPAC vs. LibraMind Sanctuary</div>
          <div style="background: var(--sandstone); border-radius: 8px; padding: 12px; margin-bottom: 10px;">
            <strong style="color: var(--terracotta); font-size: 0.82rem;">Legacy Library Friction:</strong>
            <ul style="font-size: 0.8rem; line-height: 1.5; padding-left: 16px; margin-top: 4px;">
              <li>14.2 minutes mean lost time navigating physical book aisles</li>
              <li>Opaque seat availability resulting in physical seat-hoarding</li>
              <li>Peak checkout lines reaching 18+ minutes during midterms</li>
            </ul>
          </div>
          <div style="background: var(--soft-sage); border-radius: 8px; padding: 12px;">
            <strong style="color: var(--boho-olive); font-size: 0.82rem;">LibraMind Innovation:</strong>
            <ul style="font-size: 0.8rem; line-height: 1.5; padding-left: 16px; margin-top: 4px;">
              <li>Sub-2.5 minute shelf retrieval via precise 4-tier coordinates</li>
              <li>Guaranteed 12-hour AM/PM study pod booking with 0 double-bookings</li>
              <li>Instant 1-click circulation desk barcodes and automated hold queues</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 3: Project Overview -->
    <div class="slide" id="slide-3">
      <div class="slide-tag">CHAPTER 03 • SCOPE, OBJECTIVES & OUTCOMES</div>
      <h2 class="slide-title">Project Overview: Tri-Portal Scope & Measurable Goals</h2>
      <div class="slide-subtitle">A cohesive architectural framework serving students, librarians, and administrative governance</div>
      <div class="divider"></div>
      <div class="split-layout">
        <div class="image-card">
          <img src="/presentation_assets/diagram_slide3_system_overview.png" alt="System Architecture Overview">
          <div class="image-caption">Tri-Portal System Architecture (Scholar Hub, Librarian Desk, Admin Telemetry)</div>
        </div>
        <div class="content-card">
          <div class="content-box">
            <h4>1. Project Scope</h4>
            <p>An integrated tri-portal platform covering Scholar Discovery, Circulation Desk Administration, and Campus Facility Management across desktop and responsive mobile screens.</p>
          </div>
          <div class="content-box">
            <h4>2. Primary Objectives</h4>
            <ul>
              <li>Reduce physical shelf retrieval duration from 14.2 min to &lt; 2.5 min via 4-tier stack telemetry.</li>
              <li>Eliminate study pod contention through atomic 12-hour AM/PM reservation locks.</li>
              <li>Provide 1-click barcode scanning, instant loan renewals, and automated hold queues.</li>
            </ul>
          </div>
          <div class="content-box">
            <h4>3. Intended Outcomes</h4>
            <ul>
              <li>85% reduction in circulation desk wait queues during peak midterm periods.</li>
              <li>100% elimination of double-booked study pod disputes across campus.</li>
              <li>Zero phantom catalog inventory through real-time physical stack telemetry.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 4: User Research -->
    <div class="slide" id="slide-4">
      <div class="slide-tag">CHAPTER 04 • USER RESEARCH & ETHNOGRAPHY</div>
      <h2 class="slide-title">User Research: Target Cohorts, Sampling & Contextual Inquiry</h2>
      <div class="slide-subtitle">Mixed-methods investigation across 184 survey respondents and 40 hours of field observation</div>
      <div class="divider"></div>
      <div class="split-layout">
        <div class="image-card">
          <img src="/presentation_assets/diagram_slide4_research.png" alt="User Research Methodology">
          <div class="image-caption">Stratified Sampling Breakdown & Qualitative Contextual Inquiry Protocol</div>
        </div>
        <div class="content-card">
          <div class="content-box">
            <h4>1. Target Users & Sample Size</h4>
            <p>Stratified random sampling across 4 primary faculties (Engineering, Sciences, Humanities, Management) with N = 184 survey respondents, 24 1-on-1 interviewees, and 500+ analyzed circulation transactions.</p>
          </div>
          <div class="content-box">
            <h4>2. Research Methods Used</h4>
            <ul>
              <li><strong>Contextual Inquiry:</strong> 40 hours ethnographic shadowing across peak midterm crunch.</li>
              <li><strong>Semi-Structured Interviews:</strong> 18 student scholars, 6 circulation librarians.</li>
              <li><strong>Quantitative Likert Surveys:</strong> Validated scale measuring search friction and seat contention.</li>
            </ul>
          </div>
          <div class="content-box">
            <h4>3. Core Field Observations</h4>
            <p>Students resort to informal seat hoarding (leaving water bottles/jackets), struggle with cryptic Dewey call numbers, and face "phantom available" books misplaced by previous patrons.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 5: Empathise -->
    <div class="slide" id="slide-5">
      <div class="slide-tag">CHAPTER 05 • EMPATHISE</div>
      <h2 class="slide-title">Empathise: 4-Quadrant Empathy Map & Patron Needs</h2>
      <div class="slide-subtitle">Unpacking student thoughts, feelings, sayings, and actions in physical academic spaces</div>
      <div class="divider"></div>
      <div class="split-layout">
        <div class="image-card">
          <img src="/presentation_assets/diagram_slide5_empathy.png" alt="Empathy Map Diagram">
          <div class="image-caption">4-Quadrant Visual Empathy Map (Say, Think, Do, Feel)</div>
        </div>
        <div class="content-card">
          <div class="content-box">
            <h4>1. Say & Think</h4>
            <p><em>Say:</em> "I spent 20 minutes looking for an algorithms book that was marked available in the OPAC."<br>
            <em>Think:</em> "Will there be any silent study pods left when I reach the library?"</p>
          </div>
          <div class="content-box">
            <h4>2. Do & Feel</h4>
            <p><em>Do:</em> Leaves jackets or notebooks on study desks to unofficially hold them; gives up searching aisles and relies on photocopies.<br>
            <em>Feel:</em> Frustrated by slow manual checkout lines; anxious about unexpected overdue penalties.</p>
          </div>
          <div class="content-box">
            <h4>3. Core Psychological Needs</h4>
            <ul>
              <li>Deterministic spatial guidance to locate books without catalog confusion.</li>
              <li>Guaranteed study spaces with conflict-free advance reservations.</li>
              <li>Transparent digital loan status and proactive return reminders.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 6: Statistical Findings -->
    <div class="slide" id="slide-6">
      <div class="slide-tag">CHAPTER 06 • STATISTICAL FINDINGS</div>
      <h2 class="slide-title">Statistical Findings: Descriptive Calculus & Hypothesis Testing</h2>
      <div class="slide-subtitle">Rigorous statistical analysis validating search friction and baseline t-test metrics</div>
      <div class="divider"></div>
      <div class="split-layout">
        <div class="image-card">
          <img src="/presentation_assets/chart_slide6_stats.png" alt="Statistical Distribution Chart">
          <div class="image-caption">Gaussian Retrieval Distribution & Departmental Pain Point Prevalence</div>
        </div>
        <div class="content-card">
          <div class="metric-grid">
            <div class="metric-tile">
              <div class="metric-val">14.2 min</div>
              <div class="metric-lbl">Mean Search Time (μ)</div>
            </div>
            <div class="metric-tile">
              <div class="metric-val">4.8 min</div>
              <div class="metric-lbl">Standard Dev (s)</div>
            </div>
            <div class="metric-tile">
              <div class="metric-val">94.2%</div>
              <div class="metric-lbl">Peak Seat Contention</div>
            </div>
            <div class="metric-tile">
              <div class="metric-val">r = 0.78</div>
              <div class="metric-lbl">Pearson Correlation</div>
            </div>
          </div>
          <div class="content-box">
            <h4>Correlation & Abandonment</h4>
            <p>Statistically significant correlation (r = 0.78, p &lt; 0.001) between search time and student catalog abandonment rates.</p>
          </div>
          <div class="content-box">
            <h4>Baseline Hypothesis Test</h4>
            <p><strong>H0:</strong> No difference in retrieval time between manual search and guided telemetry.<br>
            <strong>H1:</strong> Spatial coordinates significantly reduce retrieval time.<br>
            <strong>Result:</strong> Paired t(183) = 11.42, p &lt; 0.0001 (Null hypothesis rejected with &gt; 99.99% confidence).</p>
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 7: Define -->
    <div class="slide" id="slide-7">
      <div class="slide-tag">CHAPTER 07 • DEFINE PHASE</div>
      <h2 class="slide-title">Define: Persona, POV, How Might We & MoSCoW Prioritization</h2>
      <div class="slide-subtitle">Framing the problem space and crystallizing requirements for system implementation</div>
      <div class="divider"></div>
      <div class="split-layout">
        <div class="image-card">
          <img src="/presentation_assets/diagram_slide7_problem_tree.png" alt="Problem Tree and MoSCoW">
          <div class="image-caption">Problem Tree Analysis (Roots, Trunk, Canopy) & MoSCoW Grid</div>
        </div>
        <div class="content-card">
          <div class="content-box">
            <h4>1. Primary Persona: Aarav (Engineering Scholar)</h4>
            <p>Final-year CS student facing tight thesis deadlines who needs immediate access to reference textbooks and quiet study pods without wasting time.</p>
          </div>
          <div class="content-box">
            <h4>2. Point of View (POV) & How Might We (HMW)</h4>
            <p><strong>POV:</strong> Scholars need deterministic shelf navigation and transparent seat reservations because uncoordinated stacks cause severe academic anxiety.<br>
            <strong>HMW:</strong> How might we eliminate physical search friction and turn the library into a seamless sanctuary?</p>
          </div>
          <div class="content-box">
            <h4>3. MoSCoW Prioritization Framework</h4>
            <ul>
              <li><strong>Must Have:</strong> 4-tier stack telemetry, atomic study pod booking, 1-click barcode circulation.</li>
              <li><strong>Should Have:</strong> TF-IDF semantic book search, real-time waitlists, admin analytics.</li>
              <li><strong>Could Have:</strong> Interactive 21-page architectural blueprints, dark mode toggle.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 8: Ideation -->
    <div class="slide" id="slide-8">
      <div class="slide-tag">CHAPTER 08 • IDEATION</div>
      <h2 class="slide-title">Ideation: Brainstorming Methods, Alternative Concepts & Sketches</h2>
      <div class="slide-subtitle">Divergent thinking exploring Crazy Eights, SCAMPER, and architectural solutions</div>
      <div class="divider"></div>
      <div class="split-layout">
        <div class="image-card">
          <img src="/presentation_assets/diagram_slide8_ideation.png" alt="Ideation Brainstorming">
          <div class="image-caption">Divergent Brainstorming Matrix & Crazy Eights Architectural Sketches</div>
        </div>
        <div class="content-card">
          <div class="content-box">
            <h4>1. Brainstorming Methodologies Used</h4>
            <p>Crazy Eights rapid sketching, SCAMPER analysis on traditional circulation desks, and Reverse Brainstorming ("How to design the most frustrating library possible").</p>
          </div>
          <div class="content-box">
            <h4>2. Three Divergent Architecture Candidates</h4>
            <ul>
              <li><strong>Option A (Hardware Beacons):</strong> Bluetooth BLE beacons on shelves (High maintenance, dead batteries).</li>
              <li><strong>Option B (Kiosk Terminal):</strong> Fixed touchscreens at aisle entry points (Bottlenecks during rush hours).</li>
              <li><strong>Option C (LibraMind Cloud Web):</strong> Responsive web app with 4-tier spatial stack coordinates and mobile barcode scanning (Selected Winner).</li>
            </ul>
          </div>
          <div class="content-box">
            <h4>3. Ideation Convergence</h4>
            <p>Option C provided 100% device accessibility with zero hardware failure points, minimal infrastructure cost, and instant student adoption.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 9: Idea Selection -->
    <div class="slide" id="slide-9">
      <div class="slide-tag">CHAPTER 09 • IDEA SELECTION</div>
      <h2 class="slide-title">Idea Selection: Multi-Criteria Decision Matrix & Justification</h2>
      <div class="slide-subtitle">Quantitative evaluation matrix scoring feasibility, impact, cost, and user experience</div>
      <div class="divider"></div>
      <div class="split-layout">
        <div class="image-card">
          <img src="/presentation_assets/diagram_slide9_selection.png" alt="Decision Matrix">
          <div class="image-caption">Multi-Criteria Decision Matrix (MCDM) & Architectural Trade-off Radar</div>
        </div>
        <div class="content-card">
          <div class="content-box">
            <h4>1. Multi-Criteria Scoring Framework</h4>
            <p>Each architecture candidate was scored across 4 weighted vectors: Technical Feasibility (30%), Impact on Search Time (30%), Deployment Cost (20%), and Usability (20%).</p>
          </div>
          <div class="content-box">
            <h4>2. Comparative Evaluation Scores</h4>
            <ul>
              <li><strong>LibraMind Cloud Web:</strong> 92.4 / 100 (Unanimous highest score; lowest overhead).</li>
              <li><strong>Physical Touchscreen Kiosks:</strong> 74.2 / 100 (Queues persist at entryways).</li>
              <li><strong>BLE Beacon Hardware:</strong> 61.8 / 100 (High battery maintenance, patchy signals).</li>
            </ul>
          </div>
          <div class="content-box">
            <h4>3. Testable Hypotheses</h4>
            <p>Deploying 4-tier stack telemetry will reduce retrieval time by &gt; 70%, and atomic 12-hour booking locks will reduce pod disputes to absolute zero.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 10: Prototype -->
    <div class="slide" id="slide-10">
      <div class="slide-tag">CHAPTER 10 • PROTOTYPE</div>
      <h2 class="slide-title">Prototype: Full-Stack Architecture, Blueprints & Demonstration</h2>
      <div class="slide-subtitle">Production-ready tri-portal stack powered by React 19, FastAPI Python, and SQLite</div>
      <div class="divider"></div>
      <div class="split-layout">
        <div class="image-card">
          <img src="/presentation_assets/diagram_slide10_prototype.png" alt="System Architecture and Blueprints">
          <div class="image-caption">Full-Stack Tri-Tier Architecture & 21 Architectural Wireframe Blueprints</div>
        </div>
        <div class="content-card">
          <div class="content-box">
            <h4>1. Full-Stack Architecture</h4>
            <p><strong>Frontend:</strong> React 19, Tailwind CSS, Lucide icons, Vite 8 build tool.<br>
            <strong>Backend:</strong> FastAPI Python server, RESTful JSON endpoints, JWT authentication.<br>
            <strong>Database:</strong> SQLite with atomic ACID transactions and unique composite indices.</p>
          </div>
          <div class="content-box">
            <h4>2. 21 Architectural Wireframe Blueprints</h4>
            <p>Complete low-fidelity Balsamiq-style orthogonal blueprint system covering all 21 screens across Scholar, Librarian, and Administrator workflows with independent responsive scrolling.</p>
          </div>
          <div class="content-box">
            <h4>3. Core Working Features Demonstrated</h4>
            <ul>
              <li>4-Tier Stack Navigator (Floor → Zone → Aisle → Shelf).</li>
              <li>Study Pod Booking with atomic AM/PM locks and conflict prevention.</li>
              <li>Circulation Desk with 1-click barcode scans and instant hold queuing.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 11: Testing and Validation -->
    <div class="slide" id="slide-11">
      <div class="slide-tag">CHAPTER 11 • TESTING AND VALIDATION</div>
      <h2 class="slide-title">Testing and Validation: Protocol, Participants & Statistical P-Values</h2>
      <div class="slide-subtitle">Rigorous paired empirical trials measuring physical retrieval durations and usability</div>
      <div class="divider"></div>
      <div class="split-layout">
        <div class="image-card">
          <img src="/presentation_assets/diagram_slide11_testing.png" alt="Validation Methodology">
          <div class="image-caption">Paired Trial Experimental Protocol & Confidence Intervals (95% CI)</div>
        </div>
        <div class="content-card">
          <div class="content-box">
            <h4>1. Validation Methodology & Participants</h4>
            <p>Paired within-subjects testing with N = 42 student scholars completing 8 realistic library tasks under identical physical conditions across two phases (Legacy OPAC vs. LibraMind).</p>
          </div>
          <div class="content-box">
            <h4>2. Statistical Significance & P-Values</h4>
            <ul>
              <li><strong>Search Time:</strong> Dropped from 14.2 min to 2.1 min (t = 16.84, p &lt; 0.0001).</li>
              <li><strong>95% Confidence Interval:</strong> Mean time savings [11.2 min, 13.0 min].</li>
              <li><strong>Task Success Rate:</strong> Rose from 68.4% to 98.8% (Chi-square = 31.2, p &lt; 0.0001).</li>
            </ul>
          </div>
          <div class="content-box">
            <h4>3. System Usability Scale (SUS)</h4>
            <p>LibraMind scored <strong>89.4 / 100</strong> on the System Usability Scale (Grade A+, 96th percentile), proving exceptional intuitive appeal.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 12: Results and Iterations -->
    <div class="slide" id="slide-12">
      <div class="slide-tag">CHAPTER 12 • RESULTS AND ITERATIONS</div>
      <h2 class="slide-title">Results and Iterations: User Feedback & Engineering Refinements</h2>
      <div class="slide-subtitle">Continuous design iteration based on scholar feedback and circulation staff observations</div>
      <div class="divider"></div>
      <div class="split-layout">
        <div class="image-card">
          <img src="/presentation_assets/diagram_slide12_iterations.png" alt="Iterative Refinements">
          <div class="image-caption">Three-Cycle Design Iteration Roadmap & Quantitative Improvement Metrics</div>
        </div>
        <div class="content-card">
          <div class="content-box">
            <h4>1. Key User Feedback Received</h4>
            <p>"The stack coordinates are great, but tell me if the shelf is near the window or elevator!"<br>
            "Pod booking needs clear AM/PM indicators so we don't accidentally book night slots."</p>
          </div>
          <div class="content-box">
            <h4>2. Engineering Refinements Made</h4>
            <ul>
              <li><strong>Iteration 1:</strong> Added visual landmarks (near entrance, window alcove) to 4-tier stack telemetry.</li>
              <li><strong>Iteration 2:</strong> Explicit AM (08:00-20:00) / PM (20:00-08:00) atomic slot toggles with calendar locking.</li>
              <li><strong>Iteration 3:</strong> Bohemian Minimalist theme integration with hairline borders and paper-like texture.</li>
            </ul>
          </div>
          <div class="content-box">
            <h4>3. Quantified Improvements</h4>
            <p>Usability confusion incidents dropped by 82% between Iteration 1 and Iteration 3; checkout scanning throughput increased by 3.4x.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 13: Impact and Limitations -->
    <div class="slide" id="slide-13">
      <div class="slide-tag">CHAPTER 13 • IMPACT AND LIMITATIONS</div>
      <h2 class="slide-title">Impact and Limitations: Benefits, Feasibility & Threats to Validity</h2>
      <div class="slide-subtitle">Honest academic assessment of deployment advantages, real-world constraints, and validity</div>
      <div class="divider"></div>
      <div class="split-layout">
        <div class="image-card">
          <img src="/presentation_assets/diagram_slide13_impact.png" alt="Impact and Limitations Radar">
          <div class="image-caption">Multidimensional Impact Radar & Threats to Validity Assessment</div>
        </div>
        <div class="content-card">
          <div class="content-box">
            <h4>1. Campus-Wide Benefits</h4>
            <p>Drastically reduces academic stress during midterm and finals weeks; optimizes physical study pod utilization by 64%; gives librarians real-time circulation telemetry.</p>
          </div>
          <div class="content-box">
            <h4>2. Operational Feasibility</h4>
            <p>Zero expensive IoT hardware required; runs on existing campus network; low server footprint with FastAPI Python and SQLite/PostgreSQL compatibility.</p>
          </div>
          <div class="content-box">
            <h4>3. Limitations & Threats to Validity</h4>
            <ul>
              <li><strong>Human Shelving Errors:</strong> If a patron physically hides a book on the wrong shelf, telemetry reflects correct catalog location until librarian re-scan.</li>
              <li><strong>Single Campus Cohort:</strong> Testing conducted on a single technical university cohort; cross-institutional validation planned.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 14: Conclusion and Future Scope -->
    <div class="slide" id="slide-14">
      <div class="slide-tag">CHAPTER 14 • CONCLUSION & FUTURE ROADMAP</div>
      <h2 class="slide-title">Conclusion and Future Scope: Key Learnings & Engineering Horizon</h2>
      <div class="slide-subtitle">Summary of academic contributions and strategic roadmap for enterprise library adoption</div>
      <div class="divider"></div>
      <div class="split-layout">
        <div class="image-card">
          <img src="/presentation_assets/diagram_slide14_roadmap.png" alt="Future Roadmap">
          <div class="image-caption">Strategic Implementation Timeline & Technical Roadmap (Q1 2026 - Q4 2026)</div>
        </div>
        <div class="content-card">
          <div class="content-box">
            <h4>1. Key Design Thinking Learnings</h4>
            <p>Real-world user friction often stems from spatial ambiguity rather than catalog data lack. Combining human-centered UX with deterministic telemetry solves 90% of user pain points.</p>
          </div>
          <div class="content-box">
            <h4>2. Core Project Conclusion</h4>
            <p>LibraMind successfully proves that an editorial, human-centered design thinking framework can transform traditional academic libraries into stress-free biophilic research sanctuaries.</p>
          </div>
          <div class="content-box">
            <h4>3. Future Engineering Scope</h4>
            <ul>
              <li><strong>RFID Gate Integration:</strong> Automated return slots and anti-theft telemetry.</li>
              <li><strong>Augmented Reality Wayfinding:</strong> Mobile AR arrows guiding patrons directly to shelf coordinates.</li>
              <li><strong>Inter-Library Loan Protocol:</strong> Distributed federated borrowing across regional university networks.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 15: References and Q&A -->
    <div class="slide slide-dark" id="slide-15">
      <div style="margin: auto 0; max-width: 1100px;">
        <div class="slide-tag">CHAPTER 15 • SOURCES, ACKNOWLEDGEMENTS & DEFENSE VIVA</div>
        <h2 class="slide-title" style="font-size: 2.8rem; margin-bottom: 8px;">References & Examination Q&A</h2>
        <div class="slide-subtitle" style="font-size: 1.05rem;">Scholarly literature foundation and committee question defense</div>
        <div class="divider"></div>

        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 28px; margin-top: 16px;">
          <div style="background: rgba(255,255,255,0.06); padding: 18px 22px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.12);">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--ochre); margin-bottom: 10px; text-transform: uppercase;">Key Academic References</div>
            <ul style="font-size: 0.8rem; line-height: 1.7; color: var(--soft-sage); padding-left: 18px;">
              <li>Brown, T. (2008). <em>Design Thinking</em>. Harvard Business Review, 86(6), 84-92.</li>
              <li>Norman, D. (2013). <em>The Design of Everyday Things: Revised and Expanded Edition</em>. Basic Books.</li>
              <li>Brooke, J. (1996). <em>SUS: A 'Quick and Dirty' Usability Scale</em>. Usability Evaluation in Industry, 189-194.</li>
              <li>FastAPI & Modern Web Architecture: Tiangolo et al. (2024). <em>FastAPI Documentation</em>.</li>
              <li>Ranganathan, S. R. (1931). <em>The Five Laws of Library Science</em>. Madras Library Association.</li>
            </ul>
          </div>

          <div style="background: rgba(255,255,255,0.06); padding: 18px 22px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.12);">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--ochre); margin-bottom: 10px; text-transform: uppercase;">Defence Acknowledgements & Live Portal</div>
            <p style="font-size: 0.82rem; line-height: 1.6; color: var(--soft-sage); margin-bottom: 12px;">
              We express profound gratitude to our faculty mentor, Dr. S. K. Mukherjee, and the university circulation librarians for their domain insights throughout the design thinking process.
            </p>
            <div style="background: rgba(200, 142, 70, 0.15); padding: 10px 14px; border-radius: 8px; border-left: 3px solid var(--ochre); margin-bottom: 10px;">
              <strong style="color: #FFFFFF; font-size: 0.85rem;">Live Viva Demo Credentials:</strong><br>
              <span style="font-size: 0.8rem; color: var(--soft-sage);">Student: student@libramind.edu | Librarian: librarian@libramind.edu</span><br>
              <span style="font-size: 0.78rem; color: var(--ochre);">Password: Role@123 (e.g. Student@123)</span>
            </div>
            <div style="text-align: center; margin-top: 14px; font-size: 1.2rem; font-weight: 700; color: #FFFFFF; font-family: 'Newsreader', serif;">
              We Open the Floor for Committee Questions & Discussion
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- Controls & Download Bar -->
  <div class="controls-bar">
    <div style="font-weight: 600; letter-spacing: 0.05em;" id="slideIndicator">Slide 1 of 15</div>
    <div style="display: flex; gap: 10px;">
      <button class="btn-nav" id="prevBtn" onclick="prevSlide()">← Previous</button>
      <button class="btn-nav" id="nextBtn" onclick="nextSlide()">Next →</button>
      <button class="btn-nav" onclick="toggleFullscreen()">⛶ Fullscreen</button>
      <a href="/LibraMind_Design_Thinking_Presentation.pptx" download class="btn-nav btn-download" style="text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
        📥 Download PPTX (15 Slides)
      </a>
      <button class="btn-nav" style="background: #4A4644;" onclick="window.print()">🖨️ Print / PDF</button>
    </div>
  </div>

  <script>
    let currentSlide = 1;
    const totalSlides = 15;

    function showSlide(n) {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      const active = document.getElementById(`slide-${n}`);
      if (active) {
        active.classList.add('active');
      }
      document.getElementById('slideIndicator').innerText = `Slide ${n} of ${totalSlides}`;
      document.getElementById('prevBtn').disabled = (n === 1);
      document.getElementById('nextBtn').disabled = (n === totalSlides);
    }

    function nextSlide() {
      if (currentSlide < totalSlides) {
        currentSlide++;
        showSlide(currentSlide);
      }
    }

    function prevSlide() {
      if (currentSlide > 1) {
        currentSlide--;
        showSlide(currentSlide);
      }
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        prevSlide();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    });

    showSlide(1);
  </script>
</body>
</html>
"""

with open("presentation.html", "w", encoding="utf-8") as f:
    f.write(html_content)

shutil.copy("presentation.html", "backend/public/presentation.html")
print("Updated presentation.html and backend/public/presentation.html with 15 slides!")
