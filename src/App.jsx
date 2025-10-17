import { useEffect, useMemo, useState, useCallback } from "react";

/* ===== Icon (SVG inside rounded square) ===== */
function Icon({ name }) {
  let svg = null;

  if (name === "projects") {
    svg = (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3.5 7h6l1.5 2H20a1.5 1.5 0 0 1 1.5 1.5V18A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18V8.5A1.5 1.5 0 0 1 4 7h-.5z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  } else if (name === "education") {
    svg = (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 10l9-4 9 4-9 4-9-4z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M7 12v4c2 2 8 2 10 0v-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M21 10v5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  } else if (name === "experience") {
    svg = (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="7" width="18" height="12" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M3 12h18" fill="none" stroke="currentColor" strokeWidth="2"/>
      </svg>
    );
  } else {
    svg = (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3l1.8 3.8L18 8.6l-3.7 1.9L12 14l-1.9-3.5L6.4 8.6l4.2-1.8L12 3z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M5 17l.9 1.9L8 20l-2.1 1.1L5 23l-1-1.9L2 20l2-1.1L5 17zM18 15l.9 1.9L21 18l-2.1 1.1L18 21l-1-1.9L15 18l2-1.1L18 15z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    );
  }

  return (
    <span className="icon" aria-hidden="true">
      {svg}
    </span>
  );
}

/* ===== Splash / Loader ===== */
function Splash({ onReady }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let done = false;
    const minMs = 900;
    const start = performance.now();
    const tick = () => setPct(p => Math.min(p + Math.random() * 12, 100));
    const interval = setInterval(tick, 140);

    const finish = () => {
      if (done) return;
      done = true;
      const elapsed = performance.now() - start;
      const wait = Math.max(0, minMs - elapsed);
      setTimeout(() => {
        setPct(100);
        setTimeout(() => onReady(), 250);
      }, wait);
    };

    const onLoad = () => finish();
    window.addEventListener("load", onLoad);

    const safety = setInterval(() => {
      setPct(p => {
        if (p >= 96) finish();
        return p;
      });
    }, 200);

    return () => {
      clearInterval(interval);
      clearInterval(safety);
      window.removeEventListener("load", onLoad);
    };
  }, [onReady]);

  return (
    <div className="splash" role="dialog" aria-modal="true" aria-label="Loading">
      <div className="splash-card">
        <div className="splash-titlebar">Loading</div>
        <div className="splash-body">
          <div className="loadingbar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.floor(pct)}>
            <div className="loadingbar-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="loading-label">{Math.floor(pct)}%</div>
        </div>
      </div>
    </div>
  );
}

/* ===== Toast ===== */
function Toast({ message, show }) {
  return <div className={`toast ${show ? "show" : ""}`} role="status" aria-live="polite">{message}</div>;
}

/* ===== Project Modal ===== */
function ProjectModal({ open, project, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={`${project.title} details`} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-window" role="document">
        <div className="modal-titlebar">
          <span>{project.title}</span>
          <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <p className="modal-sub">{project.subtitle}</p>
          <p>{project.description}</p>
          {project.tech?.length > 0 && (
            <>
              <strong>Tech</strong>
              <div style={{ marginTop: 8 }}>
                {project.tech.map((t, i) => <span key={i} className="pill" style={{ marginBottom: 8 }}>{t}</span>)}
              </div>
            </>
          )}
          {(project.links?.demo || project.links?.code) && (
            <div className="modal-actions">
              {project.links.demo && <a className="btn" href={project.links.demo} target="_blank" rel="noreferrer">Live Demo</a>}
              {project.links.code && <a className="btn" href={project.links.code} target="_blank" rel="noreferrer">Source</a>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===== Control Message Modal ===== */
function ControlModal({ control, onClose }) {
  useEffect(() => {
    if (!control) return;
    const onKey = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [control, onClose]);

  if (!control) return null;

  const messages = {
    "Languages": "These are the programming languages I’m most fluent in — the backbone of all my software projects.",
    "Web & Databases": "Core web technologies and database tools I use to build full-stack applications.",
    "Frameworks & Tools": "Development frameworks and utilities that streamline my workflow and design process.",
    "DevOps": "Cloud and deployment tools that support scalability, automation, and version control."
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Use the default larger modal window (same size as project modal) */}
      <div className="modal-window" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-titlebar">
          <span>{control}</span>
          <button type="button" className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <p>{messages[control] || "This section showcases my technical expertise."}</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [booted, setBooted] = useState(false);
  const initialTab = (() => {
    const h = window.location.hash.replace("#", "");
    return ["projects", "education", "experience", "other"].includes(h) ? h : "projects";
  })();
  const [active, setActive] = useState(initialTab);
  const [loadingTab, setLoadingTab] = useState(false);

  // Project modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Control modal state
  const [activeControl, setActiveControl] = useState(null);

  // toast state
  const [toast, setToast] = useState({ show: false, message: "" });
  const popToast = useCallback((msg) => {
    setToast({ show: true, message: msg });
    window.clearTimeout(popToast._t);
    popToast._t = window.setTimeout(() => setToast({ show: false, message: "" }), 1200);
  }, []);

  // keep URL hash synced with active tab
  useEffect(()=>{ if (active) window.history.replaceState(null,"",`#${active}`); },[active]);

  // keyboard shortcuts: 1..4 switch tabs
  useEffect(() => {
    const map = ["projects", "education", "experience", "other"];
    const onKey = (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLButtonElement) return;
      if (e.key >= "1" && e.key <= "4") {
        const idx = Number(e.key) - 1;
        if (map[idx]) handleTab(map[idx]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleTab = (key) => {
    if (key === active) return;
    setLoadingTab(true);
    setTimeout(() => {
      setActive(key);
      setLoadingTab(false);
    }, 350);
  };

  const title = useMemo(
    () => ({ projects: "Projects", education: "Education", experience: "Experience", other: "Other" }[active]),
    [active]
  );

  // sample project data (replace with your real projects)
  const projects = [
    {
      title: "Distributed Fire Response System",
      subtitle: "Real-time drone-swarm firefighting simulator & scheduler",
      description: "Built a three-subsystem simulation (Fire Incident → Scheduler → Drones) communicating over UDP, with drone state machines, fault injection/handling, and periodic event logging + post-run metrics.",
      tech: ["Java", "JUnit5"],
      links: { code: "https://github.com/DiegoNin2/SYSC3303-A1-4-Project/tree/main/L1G4_Project"},
    },
    {
      title: "Health and Fitness Center Management System",
      subtitle: "Relational database-driven management platform",
      description: "Designed and implemented a fitness-center database that supports member registration, trainer scheduling, class bookings, billing, and equipment management. Includes a Python interface for CRUD operations and SQL scripts for schema creation and data manipulation.",
      tech: ["PostgreSQL", "Python"],
      links: { code: "https://github.com/rockbjson/3005-FinalProject", demo: "https://youtu.be/Lp9sewt37s4" },
    },
    {
      title: "'Python'",
      subtitle: "Retro Snake Game",
      description: "Developed a classic Snake game in Python using Pygame, featuring hand-drawn pixel graphics, animated start screen, and a dynamic score system. Designed all assets (background, snake, icons, and UI) from scratch in Procreate to create a cohesive retro aesthetic.",
      tech: ["Python", "Pygame", "Procreate"],
      links: { code: "https://github.com/rockbjson/snake-game" },
    },
    { 
      title: "Neureset – Software Prototype", 
      subtitle: "Direct Neurofeedback EEG Device Simulator", 
      description: "Built a neurofeedback EEG device simulator with real-time brainwave tracking, electrode activity, and session logging using Mediator and Observer design patterns, featuring battery management, progress visualization, and fault handling.", 
      tech: ["Qt (QMake)", "C++"], 
      links: { code: "https://github.com/rockbjson/3004Project", demo: "https://youtu.be/v46Up-pbSqA" } 
    },
    { 
      title: "Personal Portfolio Website", 
      subtitle: "You're looking at it!", 
      description: "Built a responsive portfolio website with retro-style UI, smooth animations, and clear project showcases—highlighting both technical and design skills.", 
      tech: ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS"], 
      links: { code: "https://github.com/rockbjson" } },
  ];

  if (!booted) return <Splash onReady={() => setBooted(true)} />;

  return (
    <>
      <Toast message={toast.message} show={toast.show} />
      <div className="page">
        {/* ===== LEFT STACK ===== */}
        <aside className="left">
          <div className="profile card">
            <div className="avatar">
              <img src="/assets/avatar.png" alt="Tanisi Das" />
            </div>
            <div>
              <div className="name">Tanisi Das</div>
              <div className="tagline">Aspiring software developer &amp; HCI researcher</div>
            </div>
          </div>

          <div className="intro card">
            Hi! I'm a 4th year Computer Science Honours Student @ Carleton University exploring the intersection of HCI, AI &amp; software engineering to create intuitive &amp; user-focused digital experiences.
          </div>

          {[
            "Languages",
            "Web & Databases",
            "Frameworks & Tools",
            "DevOps"
          ].map((section) => (
            <div
              key={section}
              className="control card"
            >
              <div className="titlebar">{section}</div>
              <div className="body">
                {section === "Languages" && (
                  <>
                    <button type="button" className="pill">Python</button>
                    <button type="button" className="pill">Java</button>
                    <button type="button" className="pill">C</button>
                    <button type="button" className="pill">C++</button>
                    <button type="button" className="pill">Javascript</button>
                  </>
                )}
                {section === "Web & Databases" && (
                  <>
                    <button type="button" className="pill brown">HTML</button>
                    <button type="button" className="pill brown">CSS</button>
                    <button type="button" className="pill brown">JavaScript</button>
                    <button type="button" className="pill brown">SQL</button>
                    <button type="button" className="pill brown">PostgreSQL</button>
                  </>
                )}
                {section === "Frameworks & Tools" && (
                  <>
                    <button type="button" className="pill">Qt</button>
                    <button type="button" className="pill">Spring Boot</button>
                    <button type="button" className="pill">Node.js</button>
                    <button type="button" className="pill">React</button>
                    <button type="button" className="pill">Power BI</button>
                    <button type="button" className="pill">UiPath</button>
                  </>
                )}
                {section === "DevOps" && (
                  <>
                    <button type="button" className="pill brown">AWS (S3, Lambda)</button>
                    <button type="button" className="pill brown">Git</button>
                  </>
                )}
              </div>

              {/* Arrow button is the ONLY trigger for the control modal */}
              <button
                type="button"
                className="arrow-btn"
                aria-label={`Open ${section} details`}
                onClick={(e) => { e.stopPropagation(); setActiveControl(section); }}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M8 5l8 7-8 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </aside>

        {/* ===== JOINED WINDOW (board + rail) ===== */}
        <div className="joined">
          {/* Center board */}
          <section className="board" aria-labelledby="board-title">
            <div className="titlebar" id="board-title">{title}</div>
            <div className="board-scroll" role="tabpanel" aria-labelledby={`tab-${active}`}>
              {/* Page transition: wrapper keyed by tab */}
              <div key={active} className="panel animate-in">
                {loadingTab ? <SkeletonPanel tab={active} /> : (
                  <>
                    {active === "projects" && <Projects projects={projects} onOpen={(p) => { setSelectedProject(p); setModalOpen(true); }} />}
                    {active === "education" && <Education />}
                    {active === "experience" && <Experience />}
                    {active === "other" && <Other />}
                  </>
                )}
              </div>
            </div>
          </section>

          {/* Rail lives INSIDE the same joined window */}
          <aside className="rail">
            <nav className="menu card" aria-label="Pages">
              <div className="titlebar">Menu</div>
              <div role="tablist" aria-orientation="vertical" className="tabs">
                {[
                  ["projects","Projects"],
                  ["education","Education"],
                  ["experience","Experience"],
                  ["other","Other"],
                ].map(([k,label], i) => (
                  <button
                    key={k}
                    id={`tab-${k}`}
                    role="tab"
                    className="tab"
                    aria-selected={active === k}
                    aria-controls={`panel-${k}`}
                    onClick={() => handleTab(k)}
                  >
                    <Icon name={k} />
                    <span>
                      {label} 
                    </span>
                  </button>
                ))}
              </div>
            </nav>

            <div className="widget card" aria-label="Widget">
              <div className="titlebar">Quick Links</div>
              <div className="body">
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {/* Resume opens directly in a new tab (inline PDF) */}
                  <li>
                    <a href="/resume.pdf" target="_blank" rel="noreferrer">Resume (PDF)</a>

                  </li>
                  <li><a href="https://github.com/rockbjson" target="_blank" rel="noreferrer">GitHub</a></li>
                  <li><a href="https://www.linkedin.com/in/tanisi-das" target="_blank" rel="noreferrer">LinkedIn</a></li>
                  <li>
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => {
                        navigator.clipboard?.writeText("tanisidas.21@gmail.com");
                        popToast("Email copied!");
                      }}
                      aria-label="Copy email address"
                    >
                      Copy Email
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div style={{ flex: 1 }} />
          </aside>
        </div>
      </div>

      {/* Modals at root so they overlay everything */}
      <ProjectModal
        open={modalOpen}
        project={selectedProject || { title: "", subtitle: "", description: "", tech: [], links: {} }}
        onClose={() => setModalOpen(false)}
      />
      <ControlModal control={activeControl} onClose={() => setActiveControl(null)} />
    </>
  );
}

/* ===== Skeletons (tab switch shimmer) ===== */
function SkeletonPanel({ tab }) {
  if (tab === "projects") {
    return (
      <div className="tiles">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="tile skeleton" aria-hidden="true">
            <div className="mini-bar skeleton-bar" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="list">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="item card skeleton" style={{ height: 68 }} aria-hidden="true" />
      ))}
    </div>
  );
}

/* ===== Panels ===== */

function Projects({ projects, onOpen }) {
  return (
    <div id="panel-projects">
      <div className="tiles">
        {projects.map((p, i) => (
          <article
            className="tile clickable tile-anim"
            key={i}
            tabIndex={0}
            aria-label={`${p.title} — open details`}
            onClick={() => onOpen(p)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onOpen(p); }}
          >
            <div className="mini-bar" />
            <div className="tile-title">
              <strong>{p.title}</strong>
              <span className="tile-sub">{p.subtitle}</span>
            </div>

            {/* Small, discrete arrow button (uses existing CSS .arrow-btn) */}
            <button
              type="button"
              className="arrow-btn"
              aria-label="Open project details"
              onClick={(e) => { e.stopPropagation(); onOpen(p); }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M8 5l8 7-8 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

function Education() {
  return (
    <div id="panel-education" className="list">
      {/* Degree + Achievements */}
      <div className="item card">
        <strong>B.Sc. (Honours) Computer Science</strong><br />
        Carleton University (2021–2026)
        <div style={{ marginTop: 10 }}>
          <strong>Courses</strong>
          <ul style={{ margin: "6px 0 0 18px" }}>
            <li>Algorithms</li>
            <li>Data Structures</li>
            <li>Database Management</li>
            <li>Object-Oriented Programming</li>
            <li>Software Design Patterns</li>
            <li>Human-Computer Interaction</li>
          </ul>
        </div>
        <div style={{ marginTop: 10 }}>
          <strong>Achievements</strong>
          <ul style={{ margin: "6px 0 0 18px" }}>
            <li>Dean’s Honour List (2021–2022, 2023–2024)</li>
            <li>President's Scholarship (2021)</li>
            <li>Award of Excellence for International Students (2021)</li>
            <li>Henry Marshall Tory Award (2022)</li>
          </ul>
        </div>
      </div>

      <div className="item card">
        <strong>International Baccalaureate Diploma Programme (IBDP)</strong><br />GEMS Modern Academy
        <ul style={{ margin: "6px 0 0 18px" }}>
          <li>Overall score of 36/42</li>
          <li>Subjects: English Language &amp; Literature HL, Psychology HL, Physics HL, Mathematical Analysis &amp; Approaches SL, Chemistry SL, Spanish Ab Initio SL</li>
        </ul>
      </div>
    </div>
  );
}

function Experience() {
  return (
    <div id="panel-experience" className="list">
      <div className="item card">
        <strong>IT Corporate &amp; Support Intern — Flydubai</strong><br />
        <ul style={{ margin: "6px 0 0 18px" }}>
          <li>Designed and implemented workflows using UiPath to automate invoice processing and reduce processing time</li>
          <li>Processed large datasets of invoice data to facilitate financial tracking, auditing and data reporting</li>
          <li>Utilized UiPath to automate data extraction from customer review websites such as TripAdvisor</li>
          <li>Designed an application to conduct sentiment analysis on extracted reviews using Python, an NLP model and Excel to provide insights into customer satisfaction data</li>
        </ul>
      </div>
    </div>
  );
}

function Other() {
  return (
    <div id="panel-other" className="list">
      <div className="item card">
        <strong>Volunteer Instructor — Parijat Academy</strong><br />
        <ul style={{ margin: "6px 0 0 18px" }}>
          <li>Created and delivered engaging lesson plans on turtle graphics in the MSW Logo</li>
          <li>Taught shape creation and color usage, inspiring student designs</li>
          <li>Introduced students to Scratch syntax, aiding in their transition to other programming languages</li>
        </ul>
      </div>
      <div className="item card">
        <strong>IBM Full Stack Software Developer Specialization</strong><br />
        Skills: Cloud Computing, HTML, CSS, JavaScript, Git, React, Node.js, Express, Flask, Django, SQL, Docker, Kubernetes, OpenShift, GenAI 
      </div>
      <div className="item card">
        <strong>Coding for Everyone: C and C++ Specialization </strong><br />
        Skills: C, C++, Algorithms
      </div>
      <div className="item card">
        <strong>Python 3 Programming </strong><br />
        Skills: Python, Data collection and processing, XML, JSON, Web scraping
      </div>
    </div>
  );
}
