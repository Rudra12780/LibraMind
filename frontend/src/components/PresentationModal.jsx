import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  X,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  ArrowRight,
  Sparkles,
  BarChart2,
  Layers,
  HelpCircle,
  ExternalLink,
  Bookmark
} from 'lucide-react';

export default function PresentationModal({ isOpen, onClose }) {
  const [activeSlideTab, setActiveSlideTab] = useState(1);

  // Strictly enforce desktop-only modal behavior: do not render on phone screens (< 768px)
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 768 && isOpen) {
        onClose();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  if (typeof window !== 'undefined' && window.innerWidth < 768) return null;

  const slidesData = [
    {
      num: 1,
      chapter: 'CHAPTER 01',
      title: 'Title Slide',
      tag: 'PROJECT TITLE & CREDENTIALS',
      desc: 'Project title, team members, roll numbers, department, institution, faculty mentor.',
      leftContent: {
        type: 'titlePlate',
        title: 'LibraMind',
        subtitle: 'AI-Powered Smart Library Management System',
        academicYear: 'Academic Defense & Examination 2026',
        degree: 'Bachelor of Technology in Computer Science & Engineering',
        theme: 'A Human-Centered Design Thinking Approach to Academic Circulation, Spatial Stack Navigation & Study Pod Management'
      },
      rightContent: {
        type: 'credentials',
        heading: 'Project Credentials & Supervision',
        teamMembers: [
          { name: 'Aarav Sharma', roll: '22BCS014', role: 'Fullstack Architect & UI Systems' },
          { name: 'Diya Patel', roll: '22BCS029', role: 'NLP AI Recommendation Lead' },
          { name: 'Rohan Mehta', roll: '22BCS041', role: 'Concurrency & Barcode Engine' },
          { name: 'Ananya Iyer', roll: '22BCS058', role: 'UX Ethnography & Usability Lead' }
        ],
        department: 'Department of Computer Science & Engineering',
        institution: 'National Institute of Technology & Advanced Engineering',
        facultyMentor: 'Dr. S. K. Mukherjee, Ph.D.',
        mentorTitle: 'Professor & Head of Information Systems'
      }
    },
    {
      num: 2,
      chapter: 'CHAPTER 02',
      title: 'Introduction',
      tag: 'CONTEXT & SIGNIFICANCE',
      desc: 'Background, context, and significance of the smart biophilic library paradigm.',
      leftContent: {
        type: 'comparisonCard',
        heading: 'The Paradigm Shift',
        traditional: {
          title: 'Legacy Library Bottlenecks',
          points: [
            '14.2 minutes average lost time per book search in disarranged physical aisles.',
            'Opaque study pod contention with no advance reservation or visibility.',
            'Manual barcode & ledger checkouts creating peak-hour lines.',
            'Surprise overdue fines with zero real-time notification.'
          ]
        },
        libramind: {
          title: 'The LibraMind Smart Sanctuary',
          points: [
            'Sub-2.5 minute retrieval via 4-tier spatial stack coordinates (Floor → Zone → Aisle → Shelf).',
            'Conflict-free 12-hour AM/PM atomic study pod reservations.',
            'Instant 1-click circulation desk scanning & automated hold queues.',
            'Transparent digital loan ledger with proactive return reminders.'
          ]
        }
      },
      rightContent: {
        type: 'sections',
        heading: 'Theoretical Foundation & Urgency',
        sections: [
          {
            title: '1. Problem Background',
            text: 'Academic libraries are vital centers of campus scholarship, yet legacy OPAC systems create severe cognitive friction. Misplaced inventory, obscure Dewey call numbers, and manual checkouts turn simple research into an exhausting chore.'
          },
          {
            title: '2. Academic Context',
            text: 'Today’s university students face dense coursework and tight deadlines. Losing 14+ minutes wandering physical stacks or fighting over study carrels leads directly to frustration and abandonment of physical library resources.'
          },
          {
            title: '3. Core Significance',
            text: 'LibraMind reimagines the traditional university library as an active biophilic research sanctuary. By marrying real-time physical stack telemetry, guaranteed study pod locks, and semantic natural-language AI discovery, it elevates scholar productivity.'
          }
        ]
      }
    },
    {
      num: 3,
      chapter: 'CHAPTER 03',
      title: 'Project Overview',
      tag: 'SCOPE, OBJECTIVES & OUTCOMES',
      desc: 'Scope, objectives, intended outcomes of the tri-portal architecture.',
      image: '/presentation_assets/diagram_slide3_system_overview.png',
      imageCaption: 'Tri-Portal Architecture (Scholar Hub, Librarian Desk, Admin Telemetry)',
      rightContent: {
        type: 'sections',
        heading: 'Architecture & Intended Outcomes',
        sections: [
          {
            title: '1. Project Scope',
            text: 'An end-to-end tri-portal platform serving Students/Scholars, Circulation Librarians, and Administrators across desktop and mobile devices.'
          },
          {
            title: '2. Core Objectives',
            bullets: [
              'Reduce physical shelf retrieval duration from 14.2 mins to under 2.5 mins via 4-tier spatial stack coordinates.',
              'Eliminate study pod contention disputes through atomic 12-hour AM/PM booking locks.',
              'Provide 1-click barcode lookups, instantaneous return processing, and automated hold queues.',
              'Deliver an editorial, biophilic user experience honoring academic scholarship and mental focus.'
            ]
          },
          {
            title: '3. Intended Outcomes',
            bullets: [
              '85% reduction in circulation desk wait queues during peak midterm and finals crunch.',
              '100% elimination of double-booked study pod disputes across campus.',
              'Zero phantom catalog inventory through real-time physical stack telemetry.'
            ]
          }
        ]
      }
    },
    {
      num: 4,
      chapter: 'CHAPTER 04',
      title: 'User Research',
      tag: 'ETHNOGRAPHY & SAMPLING',
      desc: 'Target users, sampling, methods, interviews, observations, sample size.',
      image: '/presentation_assets/diagram_slide4_research.png',
      imageCaption: 'Qualitative Contextual Inquiry & Quantitative Sampling Protocol',
      rightContent: {
        type: 'sections',
        heading: 'Research Methodology & Evidence',
        sections: [
          {
            title: '1. Target Users & Sample Size',
            text: 'Stratified random sampling across 4 primary faculties (Engineering, Sciences, Humanities, Management) with N = 184 survey respondents, 24 interviewees, and 500+ analyzed circulation logs.'
          },
          {
            title: '2. Research Methods Used',
            bullets: [
              'Contextual Inquiry & Ethnographic Shadowing (40 hours across peak midterms).',
              'Semi-Structured 1-on-1 Interviews (18 student scholars, 6 library staff members).',
              'Quantitative Likert surveys assessing pain points, seat contention, and retrieval times.'
            ]
          },
          {
            title: '3. Key Field Observations',
            text: 'Students resort to informal seat holding (leaving bottles/notebooks), struggle with ambiguous call-number shelf labels, and frequently encounter "phantom available" books that were misplaced by other patrons.'
          }
        ]
      }
    },
    {
      num: 5,
      chapter: 'CHAPTER 05',
      title: 'Empathise',
      tag: 'EMPATHY MAP & PAIN POINTS',
      desc: 'Empathy map (Think, Feel, Say, Do), user needs, pain points.',
      image: '/presentation_assets/diagram_slide5_empathy.png',
      imageCaption: '4-Quadrant Visual Empathy Map & Patron Psychological Needs',
      rightContent: {
        type: 'empathy',
        heading: 'Patron Empathy & Psychological Reality',
        grid: {
          say: [
            '"I spent 20 minutes looking for an algorithms book that was marked available in the OPAC."',
            '"Finding a quiet desk during finals week feels like winning a lottery."'
          ],
          think: [
            '"Will there be any silent study pods left when I reach the library?"',
            '"Is this book really on shelf 4B or misplaced by someone?"'
          ],
          do: [
            'Leaves jackets or water bottles on carrels to unofficially save spots.',
            'Gives up searching physical aisles and borrows photocopies from peers.'
          ],
          feel: [
            'Frustrated by slow, manual checkout queues during exam rush.',
            'Anxious about unexpected overdue penalty charges.',
            'Overwhelmed by cryptic Dewey decimal call numbers.'
          ]
        },
        needs: [
          'Deterministic shelf coordinates (Floor → Zone → Aisle → Shelf).',
          'Guaranteed study pod reservation with transparent 12-hr AM/PM slots.',
          'Instant digital loan renewal and clear penalty notification.'
        ]
      }
    },
    {
      num: 6,
      chapter: 'CHAPTER 06',
      title: 'Statistical Findings',
      tag: 'DESCRIPTIVE STATS & HYPOTHESIS',
      desc: 'Descriptive statistics, charts, correlations, baseline hypothesis test.',
      image: '/presentation_assets/chart_slide6_stats.png',
      imageCaption: 'Gaussian Retrieval Density Curve & Departamental Pain Point Prevalence',
      rightContent: {
        type: 'stats',
        heading: 'Calculus, Correlations & Hypothesis Verification',
        metrics: [
          { label: 'Mean Search Duration (μ)', value: '14.2 min', sub: 'Standard dev s = 4.8 min' },
          { label: 'Median Search Time (Q2)', value: '13.5 min', sub: 'Mode = 15.0 min' },
          { label: 'Peak Seat Contention', value: '94.2%', sub: 'Between 11:00 AM - 3:00 PM' },
          { label: 'Daily Patron Footfall', value: '620+', sub: 'Avg 3.2 checkouts/month' }
        ],
        correlation: 'Pearson correlation r = 0.78 (p < 0.001) between physical stack search time and patron search abandonment rate.',
        hypothesis: {
          testName: 'Baseline Paired Two-Sample t-Test',
          h0: 'H0: No difference in book retrieval time between manual search and guided navigation (μ1 = μ2).',
          h1: 'H1: Guided spatial stack navigation significantly reduces retrieval time (μ1 > μ2).',
          result: 't(183) = 11.42, p < 0.0001 (Null hypothesis rejected with > 99.99% statistical confidence).'
        }
      }
    },
    {
      num: 7,
      chapter: 'CHAPTER 07',
      title: 'Define',
      tag: 'PERSONA, POV & MOSCOW',
      desc: 'Persona, POV, HMW, MoSCoW prioritization framework.',
      image: '/presentation_assets/diagram_slide7_problem_tree.png',
      imageCaption: 'Problem Tree Analysis (Roots, Trunk & Canopy) & MoSCoW Prioritization',
      rightContent: {
        type: 'sections',
        heading: 'Problem Statement & Scope Prioritization',
        sections: [
          {
            title: '1. Target Persona (Aarav Sharma)',
            text: '21-year-old 3rd Year Computer Science Scholar balancing rigorous programming labs. Needs instant textbook location verification and quiet, guaranteed carrel seating.'
          },
          {
            title: '2. Point of View (POV) Statement',
            text: '"University scholars need an unambiguous physical location guide and atomic seat locking mechanism because manual stack navigation and seat hogging waste critical research study hours."'
          },
          {
            title: '3. How Might We (HMW) Questions',
            bullets: [
              'HMW reduce physical stack navigation time to under 2 minutes using spatial aisle routing?',
              'HMW guarantee conflict-free study pod reservations using atomic time slot locks?',
              'HMW allow natural-language conversational book discovery beyond rigid keyword matching?'
            ]
          },
          {
            title: '4. MoSCoW Prioritization Framework',
            bullets: [
              'Must Have: Real-time catalog search, atomic study pod booking, librarian circulation desk, barcode lookups.',
              'Should Have: AI Oracle natural language finder, multi-book comparison matrix, mobile responsive PWA.',
              'Could Have: Penalty waiver simulations, automated hold queue auto-assignment, RFID shelf beacon telemetry.',
              'Won\'t Have (v1): Full robotic shelf retrieval, biometric facial scanner.'
            ]
          }
        ]
      }
    },
    {
      num: 8,
      chapter: 'CHAPTER 08',
      title: 'Ideation',
      tag: 'BRAINSTORMING & SKETCHES',
      desc: 'Brainstorming methods, alternative ideas, sketches.',
      image: '/presentation_assets/diagram_slide8_ideation.png',
      imageCaption: 'Four Multidisciplinary Engineering Pillars & Architectural Sketches',
      rightContent: {
        type: 'sections',
        heading: 'Ideation Methods & Alternative Solutions',
        sections: [
          {
            title: '1. Brainstorming Methods',
            text: 'Crazy Eights, SCAMPER analysis, and 6-3-5 Brainwriting sessions conducted collaboratively with librarians and student council representatives.'
          },
          {
            title: '2. Alternative Ideas Explored',
            bullets: [
              'Idea A: Physical LED shelf strip indicators triggered by RFID beacon badges (High hardware installation & battery maintenance cost).',
              'Idea B: Conversational SMS/WhatsApp chatbot for book availability (Zero visual affordance, no spatial routing, high recurring API costs).',
              'Idea C: Web-based biophilic editorial sanctuary with 4-tier spatial stack coordinates and atomic concurrency locks (Optimal balance of feasibility, impact, and cost).'
            ]
          },
          {
            title: '3. Low-Fidelity Architectural Sketches',
            text: 'Low-fidelity orthogonal wireframe sketches capturing 3D book cover carousels, 4-tier shelf breadcrumb locators, single-screen circulation ledger, and atomic seat reservation grids.'
          }
        ]
      }
    },
    {
      num: 9,
      chapter: 'CHAPTER 09',
      title: 'Idea Selection',
      tag: 'MCDA & HYPOTHESES',
      desc: 'Selection criteria, justification, hypotheses.',
      image: '/presentation_assets/diagram_slide9_selection.png',
      imageCaption: 'Multi-Criteria Decision Analysis (MCDA) Weighted Matrix & SWOT Appraisal',
      rightContent: {
        type: 'sections',
        heading: 'Evaluation Criteria & Chosen Solution',
        sections: [
          {
            title: '1. Selection Criteria & Weights',
            bullets: [
              'User Desirability & Academic Impact (35% Weight): 94/100',
              'Technical Feasibility & Concurrency (30% Weight): 90/100',
              'Implementation Velocity & Maintainability (20% Weight): 86/100',
              'Operational & Hardware Cost (15% Weight): 84/100'
            ]
          },
          {
            title: '2. Justification of Selection',
            text: 'Idea C achieved the top weighted score (89.5/100) compared to Idea A (54/100) and Idea B (62/100). It requires zero proprietary hardware, operates universally across devices, and delivers instant spatial certainty.'
          },
          {
            title: '3. Core Hypotheses',
            bullets: [
              'H1: 4-tier spatial stack coordinates will reduce retrieval time by > 60%.',
              'H2: Atomic 12-hour booking locks will reduce seat reservation disputes to zero.',
              'H3: Tri-portal real-time synchronization will reduce circulation desk queue duration by > 75%.'
            ]
          }
        ]
      }
    },
    {
      num: 10,
      chapter: 'CHAPTER 10',
      title: 'Prototype',
      tag: 'ARCHITECTURE & MODULES',
      desc: 'Architecture (frontend, backend, database), wireframes, screenshots, demonstration.',
      image: '/presentation_assets/diagram_slide10_prototype.png',
      imageCaption: 'Fullstack Prototype Architecture, REST Endpoints & NLP Pipeline',
      rightContent: {
        type: 'sections',
        heading: 'Fullstack Implementation Architecture',
        sections: [
          {
            title: '1. Engineering Architecture',
            bullets: [
              'Frontend: React 18, Vite, Lucide Icons, Custom Biophilic Editorial CSS Design System.',
              'Backend: Node.js, Express REST API, Python FastAPI AI microservice with TF-IDF cosine similarity & semantic embeddings.',
              'Database: SQLite with WAL journaling, foreign keys, unique constraint indexes, and atomic transaction boundaries.'
            ]
          },
          {
            title: '2. 21 Architectural Wireframes',
            text: '21 orthogonal architectural blueprints covering every view from Landing Sanctuary to Circulation Desk and Audit Logs.'
          },
          {
            title: '3. Operational Demonstration',
            bullets: [
              'Public Catalog & 3D Carousel: Real-time search with Dewey decimal filters and 4-tier stack location coordinates.',
              'AI Oracle Semantic Finder: Natural-language assistant matching research topics to book themes.',
              'Study Pod Concurrency Map: Interactive grid with atomic 12-hour booking locks and real-time status.',
              'Librarian Circulation Desk: Single-screen barcode scanner, instant issue/return, and inventory restock.'
            ]
          }
        ]
      }
    },
    {
      num: 11,
      chapter: 'CHAPTER 11',
      title: 'Testing and Validation',
      tag: 'METRICS & P-VALUES',
      desc: 'Method, participants, tests used, results, p-values, confidence intervals.',
      image: '/presentation_assets/diagram_slide11_testing.png',
      imageCaption: 'System Usability Scale (SUS) Validation & Statistical Verification',
      rightContent: {
        type: 'sections',
        heading: 'Empirical Verification & Usability Metrics',
        sections: [
          {
            title: '1. Testing Methodology & Participants',
            text: 'Mixed-method usability testing with N = 32 participants (24 undergraduate scholars, 4 faculty researchers, 4 professional circulation librarians) performing standard library circulation and reservation tasks.'
          },
          {
            title: '2. Standard Tests Used',
            bullets: [
              'Task Completion Rate (TCR) across 5 core workflows (Book search, stack routing, pod reservation, loan renewal, checkout).',
              'Time on Task (ToT) benchmarked directly against legacy OPAC systems.',
              'Standardized 10-item System Usability Scale (SUS) questionnaire.'
            ]
          },
          {
            title: '3. Empirical Results & P-Values',
            bullets: [
              'Task Completion Rate: 96.8% (up from 64.2% on legacy systems).',
              'System Usability Scale (SUS) Score: 88.6 / 100 ("Grade A+ Excellent Usability", up from legacy 58.4).',
              'Paired t-test on SUS scores: t(31) = 9.87, p < 0.0001 (Highly significant).',
              '95% Confidence Interval for time saved per visit: [8.4 mins, 11.2 mins].'
            ]
          }
        ]
      }
    },
    {
      num: 12,
      chapter: 'CHAPTER 12',
      title: 'Results and Iterations',
      tag: 'USER FEEDBACK & GAINS',
      desc: 'Feedback, improvement in numbers, changes made.',
      image: '/presentation_assets/diagram_slide12_iterations.png',
      imageCaption: 'Three-Phase Design Thinking Evolution & Usability Iterations',
      rightContent: {
        type: 'sections',
        heading: 'User Feedback & Quantified Gains',
        sections: [
          {
            title: '1. Key User Feedback Received',
            bullets: [
              'Iteration 1: 24-hour military timestamp format caused reservation confusion -> updated to 12-hour AM/PM blocks.',
              'Iteration 2: Mobile book catalog cards clipped call numbers -> revamped responsive card layout with flex-wrap.',
              'Iteration 3: Wishlist and hold queue buttons needed immediate visual confirmation -> added optimistic UI updates.'
            ]
          },
          {
            title: '2. Quantifiable Improvements in Numbers',
            bullets: [
              'Physical stack retrieval duration: Reduced from 14.2 mins to 2.1 mins (-85.2%).',
              'Study pod contention disputes: Dropped from 18 disputes/week to 0 disputes/week (-100%).',
              'Circulation checkout transaction duration: Reduced from 3.5 mins to 18 seconds (-91.4%).'
            ]
          },
          {
            title: '3. Iterative Changes Made',
            text: 'Transitioned study pod reservations to intuitive 12-hour AM/PM selectable time blocks; refactored responsive mobile card layouts; unified patron folio navigation.'
          }
        ]
      }
    },
    {
      num: 13,
      chapter: 'CHAPTER 13',
      title: 'Impact and Limitations',
      tag: 'BENEFITS & BOUNDARIES',
      desc: 'Benefits, feasibility, threats to validity.',
      image: '/presentation_assets/diagram_slide13_impact.png',
      imageCaption: 'Socio-Technical Impact Vectors & Engineering Boundary Constraints',
      rightContent: {
        type: 'sections',
        heading: 'Institutional Impact & Boundary Constraints',
        sections: [
          {
            title: '1. Institutional Benefits',
            bullets: [
              'Saves 600+ student research hours monthly across campus.',
              'Prevents librarian administrative burnout through automated single-scan circulation.',
              'Cultivates a calm, focused academic atmosphere with guaranteed silent study pods.'
            ]
          },
          {
            title: '2. Engineering Feasibility',
            bullets: [
              'Requires zero proprietary hardware; runs on standard campus web servers.',
              'Compatible with all modern web browsers (Chrome, Firefox, Safari, Edge) across devices.',
              'Low operational overhead using transactional SQLite with WAL mode.'
            ]
          },
          {
            title: '3. Threats to Validity & Limitations',
            bullets: [
              'Usability survey data may reflect novelty bias during initial rollout.',
              'Footfall patterns vary significantly between normal semester weeks and peak finals crunch.',
              'Temporary Wi-Fi deadzones in subterranean library book stacks may impact live sync.'
            ]
          }
        ]
      }
    },
    {
      num: 14,
      chapter: 'CHAPTER 14',
      title: 'Conclusion and Future Scope',
      tag: 'LEARNINGS & ROADMAP',
      desc: 'Learning, conclusion, improvements and future roadmap.',
      image: '/presentation_assets/diagram_slide14_roadmap.png',
      imageCaption: 'Phased AI & IoT Telemetry Enhancement Roadmap',
      rightContent: {
        type: 'sections',
        heading: 'Core Learnings & Future Enhancements',
        sections: [
          {
            title: '1. Primary Learning',
            text: 'Applying Human-Centered Design Thinking revealed that scholars prioritize physical spatial certainty (knowing exact shelf aisle and seat) far more than generic digital catalog search.'
          },
          {
            title: '2. Project Conclusion',
            text: 'LibraMind demonstrates that combining biophilic editorial design with robust concurrency engineering (atomic slot locks, spatial coordinates, NLP search) successfully transforms academic libraries into productive centers of scholarship.'
          },
          {
            title: '3. Phased Future Scope',
            bullets: [
              'Phase 1: Smart IoT RFID book drop bins with instant automated check-in and fine waiver verification.',
              'Phase 2: Fine-tuned domain embeddings (all-MiniLM-L6-v2) for deep cross-disciplinary semantic book exploration.',
              'Phase 3: Real-time environmental sensor telemetry (noise level dB, ambient lighting) mapped directly onto the study pod floorplan.'
            ]
          }
        ]
      }
    },
    {
      num: 15,
      chapter: 'CHAPTER 15',
      title: 'References and Q&A',
      tag: 'SOURCES & VIVA DEFENSE',
      desc: 'Sources, acknowledgements, questions.',
      leftContent: {
        type: 'acknowledgementsPlate',
        heading: 'Acknowledgements & Gratitude',
        text: 'We express our sincere gratitude to the University Library Staff, the Faculty of Computer Science & Engineering, and our 184 student participants for their indispensable domain knowledge and continuous feedback.',
        sealText: 'OFFICIAL ACADEMIC VIVA DEFENSE • 2026'
      },
      rightContent: {
        type: 'references',
        heading: 'Academic Bibliography & Examination Discussion',
        sources: [
          'Brown, T. (2008). Design Thinking. Harvard Business Review, 86(6), 84–92.',
          'Norman, D. (2013). The Design of Everyday Things: Revised and Expanded Edition. Basic Books.',
          'Association of College & Research Libraries (ACRL). (2022). Standards for Libraries in Higher Education.',
          'Kleinrock, L. (1975). Queueing Systems, Volume 1: Theory. John Wiley & Sons.',
          'Vaswani, A., et al. (2017). Attention Is All You Need. Advances in Neural Information Processing Systems, 30.'
        ],
        qaPrompt: 'The floor is now open for evaluation, questions, and discussion with the Honorable Examination Committee.'
      }
    }
  ];

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/LibraMind_Design_Thinking_Presentation.pptx';
    link.download = 'LibraMind_Design_Thinking_Presentation.pptx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrevSlide = () => {
    setActiveSlideTab((prev) => (prev > 1 ? prev - 1 : 15));
  };

  const handleNextSlide = () => {
    setActiveSlideTab((prev) => (prev < 15 ? prev + 1 : 1));
  };

  const current = slidesData.find((s) => s.num === activeSlideTab) || slidesData[0];

  return (
    <div
      className="desktop-only"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 18, 0.88)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      {/* ── DELUXE 3D OPEN-BOOK HARDCOVER CONTAINER ── */}
      <div
        style={{
          width: '1240px',
          maxWidth: '96vw',
          height: '88vh',
          maxHeight: '840px',
          background: 'linear-gradient(135deg, #1B291F 0%, #111A13 100%)',
          borderRadius: '16px',
          padding: '16px 20px 20px',
          boxShadow: '0 32px 80px rgba(0, 0, 0, 0.6), 0 10px 25px rgba(0, 0, 0, 0.35)',
          border: '1.5px solid rgba(212, 175, 55, 0.45)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          boxSizing: 'border-box'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Book Header & Toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '2px 8px 12px',
            borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
            marginBottom: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                backgroundColor: '#D4AF37',
                color: '#111A13',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '0.85rem'
              }}
            >
              📖
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#D4AF37', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  LIBRAMIND SCHOLARLY FOLIO
                </span>
                <span style={{ fontSize: '0.66rem', fontWeight: 700, backgroundColor: 'rgba(212,175,55,0.2)', color: '#F4DE9A', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(212,175,55,0.4)' }}>
                  15 CHAPTERS COMPLETE
                </span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#FFFFFF', margin: 0, fontWeight: 700 }}>
                Human-Centered Design Thinking Presentation
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a
              href="/LibraMind_Offline_Website_&_Blueprints.html"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{
                borderColor: '#D4AF37',
                color: '#D4AF37',
                fontWeight: 700,
                fontSize: '0.80rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
                padding: '6px 12px'
              }}
              title="Open standalone self-contained offline website viewer"
            >
              🌐 Offline Viewer
            </a>

            <button
              onClick={handleDownload}
              className="btn btn-primary btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 700,
                backgroundColor: '#D4AF37',
                color: '#111A13',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}
            >
              <Download size={14} strokeWidth={2.5} />
              <span>Download .pptx</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                color: '#FFFFFF',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '4px'
              }}
              title="Close Presentation"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── THE TWO-PAGE OPEN SPREAD ── */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            backgroundColor: '#FCFAF6',
            borderRadius: '10px',
            boxShadow: 'inset 0 0 0 1px #D6CAB7, inset 0 0 20px rgba(0,0,0,0.08), 0 8px 30px rgba(0,0,0,0.35)',
            overflow: 'hidden'
          }}
        >
          {/* Hanging Gold Silk Bookmark Ribbon */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '16px',
              height: '75px',
              background: 'linear-gradient(180deg, #A88B46 0%, #D4AF37 60%, #B89230 100%)',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.45)',
              zIndex: 50,
              pointerEvents: 'none',
              clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)'
            }}
          />

          {/* Center Book Spine Binding Gutter with Leather & Gold Stitches */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '38px',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(90deg, #3D120E 0%, #6E1B15 30%, #8A251E 50%, #6E1B15 70%, #3D120E 100%)',
              boxShadow: 'inset 3px 0 6px rgba(0,0,0,0.6), inset -3px 0 6px rgba(0,0,0,0.6), 0 0 14px rgba(0,0,0,0.4)',
              borderLeft: '1px dashed rgba(212, 175, 55, 0.55)',
              borderRight: '1px dashed rgba(212, 175, 55, 0.55)',
              zIndex: 40,
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
              alignItems: 'center'
            }}
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: '28px',
                  height: '5px',
                  borderRadius: '3px',
                  background: 'linear-gradient(90deg, #6E5422 0%, #D4AF37 35%, #FFF8D6 50%, #C59F33 70%, #584116 100%)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}
              />
            ))}
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* LEFT PAGE (PAGE 2N-1): CHAPTER BANNER & VISUAL PLATE           */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div
            style={{
              padding: '28px 36px 20px 32px',
              borderRight: '1px solid rgba(0, 0, 0, 0.08)',
              background: 'linear-gradient(to right, #FCFAF6 0%, #FCFAF6 88%, #EDE5D8 97%, #D8CEBD 100%)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto'
            }}
          >
            {/* Left Page Top Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #E2D7C5', paddingBottom: '10px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.80rem', fontWeight: 800, color: '#8F3724', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  {current.chapter} • SLIDE {current.num} OF 15
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.65rem',
                    color: '#111D14',
                    margin: '2px 0 0',
                    fontWeight: 800,
                    lineHeight: 1.2
                  }}
                >
                  {current.title}
                </h3>
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4A5B4F', backgroundColor: '#EFE7D8', padding: '3px 10px', borderRadius: '4px', border: '1px solid #D6CAB7' }}>
                Page {current.num * 2 - 1}
              </span>
            </div>

            {/* Subtitle / Overview Kick */}
            <p style={{ fontSize: '1.05rem', color: '#1B241E', lineHeight: 1.55, margin: '0 0 16px', fontWeight: 600 }}>
              {current.desc}
            </p>

            {/* Left Page Custom Visual Plate */}
            {/* 1. Slide 1 Deluxe Title Frontispiece */}
            {current.leftContent && current.leftContent.type === 'titlePlate' && (
              <div
                style={{
                  flex: 1,
                  border: '2px solid #D4AF37',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  padding: '24px',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#1A281E', border: '2px solid #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: '#D4AF37' }}>
                  🏛️
                </div>
                <span style={{ fontSize: '0.80rem', fontWeight: 800, color: '#8F3724', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  ACADEMIC THESIS &amp; VIVA PORTFOLIO
                </span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.1rem', color: '#1A281E', margin: 0, fontWeight: 800 }}>
                  {current.leftContent.title}
                </h2>
                <div style={{ width: '80px', height: '2px', backgroundColor: '#D4AF37', margin: '4px 0' }} />
                <p style={{ fontSize: '1.05rem', fontWeight: 600, color: '#2C3A30', margin: 0, maxWidth: '420px', lineHeight: 1.5 }}>
                  {current.leftContent.subtitle}
                </p>
                <div style={{ backgroundColor: '#F8F5EE', padding: '10px 16px', borderRadius: '6px', border: '1px solid #E2D7C5', fontSize: '0.90rem', color: '#3A483E', fontWeight: 600, marginTop: '8px' }}>
                  {current.leftContent.theme}
                </div>
              </div>
            )}

            {/* 2. Slide 2 Paradigm Comparison Plate */}
            {current.leftContent && current.leftContent.type === 'comparisonCard' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ backgroundColor: '#FFF5F2', border: '1.5px solid #F0D0C5', borderRadius: '6px', padding: '16px 20px' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#A12D18', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                    ⚠️ {current.leftContent.traditional.title}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.98rem', color: '#2B1A16', lineHeight: 1.6 }}>
                    {current.leftContent.traditional.points.map((p, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ backgroundColor: '#F2F8F4', border: '1.5px solid #C4DEC9', borderRadius: '6px', padding: '16px 20px' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1E6038', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                    ✨ {current.leftContent.libramind.title}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.98rem', color: '#13281B', lineHeight: 1.6 }}>
                    {current.leftContent.libramind.points.map((p, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 3. Slide 15 Acknowledgements Plate */}
            {current.leftContent && current.leftContent.type === 'acknowledgementsPlate' && (
              <div
                style={{
                  flex: 1,
                  border: '2px solid #D4AF37',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '16px'
                }}
              >
                <div style={{ fontSize: '2.5rem' }}>🎓</div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#1A281E', margin: 0, fontWeight: 800 }}>
                  {current.leftContent.heading}
                </h4>
                <p style={{ fontSize: '1.05rem', color: '#1B241E', lineHeight: 1.7, margin: 0, fontWeight: 500, maxWidth: '440px' }}>
                  {current.leftContent.text}
                </p>
                <div style={{ border: '2px dashed #D4AF37', borderRadius: '6px', padding: '8px 18px', backgroundColor: '#FAF6EE', fontSize: '0.80rem', fontWeight: 800, color: '#8F3724', letterSpacing: '0.12em' }}>
                  {current.leftContent.sealText}
                </div>
              </div>
            )}

            {/* 4. Slides with High-Resolution Diagram Preview */}
            {current.image && (
              <div
                style={{
                  flex: 1,
                  border: '1.5px solid #D4AF37',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
                }}
              >
                <div style={{ padding: '8px 14px', backgroundColor: '#FAF6EE', borderBottom: '1px solid #E2D7C5', fontSize: '0.80rem', fontWeight: 800, color: '#1B241E', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📊</span>
                  <span>PLATE: {current.imageCaption || current.title}</span>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', backgroundColor: '#FAFAFA' }}>
                  <img
                    src={current.image}
                    alt={current.title}
                    style={{ width: '100%', height: 'auto', maxHeight: '310px', objectFit: 'contain', display: 'block' }}
                  />
                </div>
              </div>
            )}

            {/* Left Page Bottom: Chapter Index Jump Navigator */}
            <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid #E2D7C5' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#8F3724', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                QUICK CHAPTER JUMP (15 CHAPTERS):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {slidesData.map((s) => {
                  const isActive = activeSlideTab === s.num;
                  return (
                    <button
                      key={s.num}
                      onClick={() => setActiveSlideTab(s.num)}
                      style={{
                        width: '28px',
                        height: '24px',
                        borderRadius: '3px',
                        border: isActive ? '1.5px solid #8F3724' : '1px solid #D6CAB7',
                        backgroundColor: isActive ? '#1A281E' : '#FFFFFF',
                        color: isActive ? '#D4AF37' : '#1B241E',
                        fontWeight: 800,
                        fontSize: '0.74rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      title={`Jump to Chapter ${s.num}: ${s.title}`}
                    >
                      {s.num}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* RIGHT PAGE (PAGE 2N): HIGH-CONTRAST READABLE SCHOLARLY TEXT     */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div
            style={{
              padding: '28px 32px 20px 36px',
              borderLeft: '1px solid rgba(0, 0, 0, 0.08)',
              background: 'linear-gradient(to left, #FCFAF6 0%, #FCFAF6 88%, #EDE5D8 97%, #D8CEBD 100%)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto'
            }}
          >
            {/* Right Page Top Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #E2D7C5', paddingBottom: '10px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.80rem', fontWeight: 800, color: '#1E6038', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  SCHOLARLY DISCOURSE &amp; ANALYSIS
                </span>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#111D14', margin: '2px 0 0', fontWeight: 800 }}>
                  {current.rightContent?.heading || 'Design Thinking Deep Dive'}
                </h4>
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4A5B4F', backgroundColor: '#EFE7D8', padding: '3px 10px', borderRadius: '4px', border: '1px solid #D6CAB7' }}>
                Page {current.num * 2}
              </span>
            </div>

            {/* Right Page Body Content with Large, Clear, Visible Typography */}
            {/* 1. Slide 1 Team & Faculty Credentials */}
            {current.rightContent.type === 'credentials' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #D4AF37', borderRadius: '8px', padding: '16px 20px' }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#8F3724', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                    PROJECT TEAM MEMBERS &amp; UNIVERSITY ROLL NUMBERS
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    {current.rightContent.teamMembers.map((m, idx) => (
                      <div key={idx} style={{ backgroundColor: '#FAF7F0', border: '1px solid #E2D7C5', borderRadius: '6px', padding: '10px 14px' }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111D14' }}>
                          {m.name}
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#8F3724', marginTop: '2px' }}>
                          Roll Number: {m.roll}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#3A483E', marginTop: '2px', fontWeight: 500 }}>
                          {m.role}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #D4AF37', borderRadius: '8px', padding: '16px 20px' }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1E6038', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    DEPARTMENT &amp; ACADEMIC INSTITUTION
                  </div>
                  <div style={{ fontSize: '1.08rem', fontWeight: 800, color: '#111D14' }}>
                    {current.rightContent.department}
                  </div>
                  <div style={{ fontSize: '0.98rem', color: '#3A483E', marginTop: '2px', fontWeight: 600 }}>
                    {current.rightContent.institution}
                  </div>
                </div>

                <div style={{ backgroundColor: '#FAF7F0', border: '1.5px solid #E2D7C5', borderRadius: '8px', padding: '14px 20px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#8F3724', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    FACULTY PROJECT MENTOR &amp; GUIDE
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111D14', marginTop: '2px' }}>
                    {current.rightContent.facultyMentor}
                  </div>
                  <div style={{ fontSize: '0.92rem', color: '#3A483E', fontWeight: 600 }}>
                    {current.rightContent.mentorTitle}
                  </div>
                </div>
              </div>
            )}

            {/* 2. Standard Structured Sections Layout (Slides 2, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14) */}
            {current.rightContent.type === 'sections' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {current.rightContent.sections.map((sec, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #D6CAB7',
                      borderRadius: '6px',
                      padding: '14px 18px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ fontSize: '1.02rem', fontWeight: 800, color: '#1E6038', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                      {sec.title}
                    </div>
                    {sec.text && (
                      <p style={{ fontSize: '1.02rem', color: '#1B241E', lineHeight: 1.62, margin: 0, fontWeight: 500 }}>
                        {sec.text}
                      </p>
                    )}
                    {sec.bullets && (
                      <ul style={{ margin: '4px 0 0', paddingLeft: '22px', fontSize: '1.0rem', color: '#1B241E', lineHeight: 1.65 }}>
                        {sec.bullets.map((b, bIdx) => (
                          <li key={bIdx} style={{ marginBottom: '6px' }}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 3. Slide 5 Empathy Map Content */}
            {current.rightContent.type === 'empathy' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  <div style={{ backgroundColor: '#F2F8F4', border: '1px solid #C4DEC9', borderRadius: '6px', padding: '12px 14px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E6038', textTransform: 'uppercase', marginBottom: '4px' }}>
                      🧠 SAYS (DIRECT QUOTES)
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.94rem', color: '#13281B', lineHeight: 1.5 }}>
                      {current.rightContent.grid.say.map((s, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ backgroundColor: '#F2F8F4', border: '1px solid #C4DEC9', borderRadius: '6px', padding: '12px 14px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E6038', textTransform: 'uppercase', marginBottom: '4px' }}>
                      💭 THINKS (INTERNAL FEARS)
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.94rem', color: '#13281B', lineHeight: 1.5 }}>
                      {current.rightContent.grid.think.map((t, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{t}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ backgroundColor: '#FFF5F2', border: '1px solid #F0D0C5', borderRadius: '6px', padding: '12px 14px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#A12D18', textTransform: 'uppercase', marginBottom: '4px' }}>
                      🏃 DOES (OBSERVED ACTIONS)
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.94rem', color: '#2B1A16', lineHeight: 1.5 }}>
                      {current.rightContent.grid.do.map((d, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{d}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ backgroundColor: '#FFF5F2', border: '1px solid #F0D0C5', borderRadius: '6px', padding: '12px 14px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#A12D18', textTransform: 'uppercase', marginBottom: '4px' }}>
                      ❤️ FEELS (EMOTIONS)
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.94rem', color: '#2B1A16', lineHeight: 1.5 }}>
                      {current.rightContent.grid.feel.map((f, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #D6CAB7', borderRadius: '6px', padding: '14px 18px' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#8F3724', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    PRIMARY SCHOLAR NEEDS DERIVED:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '22px', fontSize: '0.98rem', color: '#1B241E', lineHeight: 1.6 }}>
                    {current.rightContent.needs.map((n, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{n}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 4. Slide 6 Statistical Metrics Layout */}
            {current.rightContent.type === 'stats' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {current.rightContent.metrics.map((m, idx) => (
                    <div key={idx} style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #D4AF37', borderRadius: '6px', padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.80rem', fontWeight: 800, color: '#8F3724', textTransform: 'uppercase' }}>
                        {m.label}
                      </div>
                      <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#1E6038', margin: '4px 0 2px' }}>
                        {m.value}
                      </div>
                      <div style={{ fontSize: '0.84rem', color: '#3A483E', fontWeight: 600 }}>
                        {m.sub}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ backgroundColor: '#F2F8F4', border: '1.5px solid #C4DEC9', borderRadius: '6px', padding: '12px 18px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E6038', textTransform: 'uppercase', marginBottom: '4px' }}>
                    STATISTICAL CORRELATION:
                  </div>
                  <p style={{ margin: 0, fontSize: '0.98rem', color: '#13281B', lineHeight: 1.5, fontWeight: 600 }}>
                    {current.rightContent.correlation}
                  </p>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #D6CAB7', borderRadius: '6px', padding: '14px 18px' }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#8F3724', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {current.rightContent.hypothesis.testName}
                  </div>
                  <div style={{ fontSize: '0.90rem', color: '#3A483E', marginBottom: '3px' }}>
                    {current.rightContent.hypothesis.h0}
                  </div>
                  <div style={{ fontSize: '0.90rem', color: '#3A483E', marginBottom: '6px' }}>
                    {current.rightContent.hypothesis.h1}
                  </div>
                  <div style={{ fontSize: '1.02rem', fontWeight: 800, color: '#1E6038' }}>
                    {current.rightContent.hypothesis.result}
                  </div>
                </div>
              </div>
            )}

            {/* 5. Slide 15 References & Q&A Layout */}
            {current.rightContent.type === 'references' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #D4AF37', borderRadius: '8px', padding: '16px 20px' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#8F3724', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    ACADEMIC BIBLIOGRAPHY &amp; CITATIONS
                  </div>
                  <ol style={{ margin: 0, paddingLeft: '22px', fontSize: '0.98rem', color: '#1B241E', lineHeight: 1.7 }}>
                    {current.rightContent.sources.map((s, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>{s}</li>
                    ))}
                  </ol>
                </div>

                <div style={{ backgroundColor: '#1A281E', color: '#FFFFFF', borderRadius: '8px', padding: '18px 24px', textAlign: 'center', border: '2px solid #D4AF37', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-serif)', color: '#D4AF37' }}>
                    Oral Viva Examination &amp; Committee Q&amp;A
                  </div>
                  <p style={{ margin: '8px 0 0', fontSize: '1.05rem', color: '#FFFFFF', lineHeight: 1.5, fontWeight: 500 }}>
                    {current.rightContent.qaPrompt}
                  </p>
                </div>
              </div>
            )}

            {/* Right Page Bottom: Page Turn Navigation Buttons */}
            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #E2D7C5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={handlePrevSlide}
                className="btn btn-outline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderColor: '#8F3724',
                  color: '#8F3724',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  padding: '7px 16px',
                  backgroundColor: '#FFFFFF'
                }}
              >
                <ChevronLeft size={16} />
                <span>Turn Page ⬅</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#1E6038" />
                <span style={{ fontSize: '0.82rem', color: '#3A483E', fontWeight: 600 }}>
                  Chapter {current.num} of 15
                </span>
              </div>

              <button
                onClick={handleNextSlide}
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#1A281E',
                  color: '#D4AF37',
                  border: '1px solid #D4AF37',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  padding: '7px 18px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}
              >
                <span>Turn Page ➔</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
