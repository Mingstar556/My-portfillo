// =====================================================
//  PORTFOLIO — APP.JS
//  Full-Stack Web Developer & UI Designer Portfolio
//  Crafted by Mingstar
//  · 3D interactive profile (pointer tilt + gyroscope)
//  · In-page Live Demo viewer (iframe + device sizes)
// =====================================================

// --- FLAGSHIP PRODUCTION PROJECTS DATA ---
const FLAGSHIP_PROJECTS = [
  {
    id: "nexusflow",
    title: "NexusFlow — Agile & Kanban Task Suite",
    tag: "Full-Stack Web App • Productivity",
    emoji: "📊",
    desc: "A production-ready Agile Kanban board featuring HTML5 drag-and-drop, sprint burn-down analytics, subtask checklist tracking, local persistence, and JSON state export/import.",
    tech: ["JavaScript ES6+", "HTML5 Drag & Drop", "Canvas Analytics", "LocalStorage"],
    url: "./projects/nexusflow/index.html",
    github: "https://github.com/Mingstar556/Portfolilo/tree/main/projects/nexusflow",
    architecture: "Built with modular ES6 state management, custom HTML5 event drag handlers, normalized task data stores, and a 2D Canvas rendering engine for sprint velocity metrics.",
    features: [
      "Fluid drag-and-drop across 5 sprint workflow stages with drop indicators",
      "Sprint velocity & burn-down line and donut charts rendered on HTML5 Canvas",
      "Dynamic task filtering by Priority (Urgent/High/Med/Low), Assignee, and Category Tag",
      "Subtask checklist with real-time percentage progress bar calculations",
      "Standalone, zero-dependency client architecture with JSON backup import/export"
    ]
  },
  {
    id: "devpulse",
    title: "DevPulse — Cloud Telemetry & API Sandbox Studio",
    tag: "Full-Stack Web Tool • Observability",
    emoji: "⚡",
    desc: "Real-time cloud infrastructure observability console with live Canvas telemetry gauges, streaming service event logs with level filtering, and an interactive REST API benchmark playground.",
    tech: ["Canvas 2D HUD", "Real-Time Streams", "REST Client Engine", "Latency Benchmarking"],
    url: "./projects/devpulse/index.html",
    github: "https://github.com/Mingstar556/Portfolilo/tree/main/projects/devpulse",
    architecture: "Engineered rolling 40-sample circular telemetry buffers for sub-millisecond chart repainting, non-blocking synthetic load injection, and an asynchronous HTTP probe client with statistical p95 latency calculation.",
    features: [
      "Real-time CPU, RAM, Network I/O, and RPS sparkline monitors updating at 1-second intervals",
      "P99 and P50 latency waveform graphs rendered on high-performance Canvas",
      "Live streaming terminal log with regex search, level filtering (INFO/WARN/ERROR), and pause toggle",
      "Interactive REST API client with CORS fallback proxy simulation and pretty-printed JSON inspector",
      "Automated 5x benchmarking probe with variance and p95 latency statistical calculations"
    ]
  },
  {
    id: "cryptosphere",
    title: "CryptoSphere — Market Intelligence & Portfolio Studio",
    tag: "FinTech • Real-Time Web App",
    emoji: "💎",
    desc: "Interactive cryptocurrency trading analytics terminal featuring live price candlestick charts, moving average indicators, asset allocation donut charts, and continuous ticker streams.",
    tech: ["Interactive Canvas Charts", "SMA(20) Indicator", "Portfolio Engine", "Multi-Currency Converter"],
    url: "./projects/cryptosphere/index.html",
    github: "https://github.com/Mingstar556/Portfolilo/tree/main/projects/cryptosphere",
    architecture: "Designed with continuous marquee ticker streaming, Canvas 2D area charts with Bézier gradient smoothing, technical SMA indicators, and a multi-currency valuation engine supporting USD, EUR, and KHR.",
    features: [
      "Continuous marquee ticker streaming real-time cryptocurrency bid/ask quotes",
      "Interactive timeframes (24H, 7D, 1M, 1Y) with toggleable 20-period Moving Average (SMA)",
      "Personal portfolio profit & loss tracker with all-time return calculation and local persistence",
      "Dynamic asset allocation donut chart rendered natively on HTML5 Canvas",
      "Instant fiat & crypto currency converter with support for USD, EUR, and KHR"
    ]
  },
  {
    id: "codecraft",
    title: "CodeCraft Studio — In-Browser Code Sandbox & IDE",
    tag: "Developer Tools • Web Sandbox",
    emoji: "🚀",
    desc: "In-browser code editor and live compilation sandbox with multi-language tabs (HTML/CSS/JS), virtual JavaScript console output capturing, template showcase, and responsive viewport testing.",
    tech: ["Sandboxed Iframe", "Virtual Console Listener", "Template Engine", "Responsive Viewports"],
    url: "./projects/codecraft/index.html",
    github: "https://github.com/Mingstar556/Portfolilo/tree/main/projects/codecraft",
    architecture: "Built around an isolated iframe sandbox with bi-directional postMessage communication to securely trap runtime console methods, auto-compiling user code with debounced execution.",
    features: [
      "Multi-tab editing for HTML5, CSS3, and JavaScript ES6+ with Tab indentation support",
      "Virtual Console intercepting console.log/warn/error and uncaught runtime exceptions",
      "Preloaded templates: 3D Glowing Cube, Particle Mesh, Glassmorphic Card, and Reactive Todo App",
      "Responsive device switcher (Desktop 100%, Tablet 768px, Mobile 375px)",
      "One-click standalone single-file HTML bundle export with integrated scripts and styling"
    ]
  }
];

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// =====================================================
//  3D INTERACTIVE PROFILE (pointer tilt + gyroscope)
// =====================================================
(function init3DAvatar() {
  const scene = document.getElementById("avatarScene");
  const tilt = document.getElementById("avatarTilt");
  if (!scene || !tilt || REDUCED_MOTION) return;

  const MAX_TILT = 13; // degrees

  function setGlare(clientX, clientY) {
    const r = scene.getBoundingClientRect();
    scene.style.setProperty("--gx", `${((clientX - r.left) / r.width) * 100}%`);
    scene.style.setProperty("--gy", `${((clientY - r.top) / r.height) * 100}%`);
  }

  // --- Pointer-driven tilt (desktop / any fine pointer) ---
  let raf = null;
  scene.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    const r = scene.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;   // -0.5 … 0.5
    const py = (e.clientY - r.top) / r.height - 0.5;
    setGlare(e.clientX, e.clientY);
    if (raf) return;
    raf = requestAnimationFrame(() => {
      tilt.style.transform =
        `rotateY(${(px * MAX_TILT * 2).toFixed(2)}deg) rotateX(${(-py * MAX_TILT * 2).toFixed(2)}deg)`;
      raf = null;
    });
  });

  scene.addEventListener("pointerleave", () => {
    tilt.style.transform = "";
  });

  // --- Gyroscope tilt (mobile) — iOS needs a one-time permission grant ---
  const isTouchPrimary = window.matchMedia("(hover: none)").matches;
  if (!isTouchPrimary || typeof DeviceOrientationEvent === "undefined") return;

  function applyGyro(beta, gamma) {
    const g = Math.max(-24, Math.min(24, gamma)) / 24;   // left-right
    const b = Math.max(-24, Math.min(24, beta - 45)) / 24; // front-back, holding phone ~45°
    tilt.style.transform =
      `rotateY(${(g * (MAX_TILT - 3)).toFixed(2)}deg) rotateX(${(-b * (MAX_TILT - 5)).toFixed(2)}deg)`;
  }

  function startGyro() {
    window.addEventListener("deviceorientation", (e) => {
      if (e.beta == null || e.gamma == null) return;
      applyGyro(e.beta, e.gamma);
    }, { passive: true });
  }

  scene.addEventListener("pointerdown", function requestGyro() {
    try {
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        DeviceOrientationEvent.requestPermission()
          .then((state) => { if (state === "granted") startGyro(); })
          .catch(() => {});
        scene.removeEventListener("pointerdown", requestGyro);
      } else {
        startGyro();
        scene.removeEventListener("pointerdown", requestGyro);
      }
    } catch (_) { /* gyro unavailable */ }
  });
})();

// =====================================================
//  PARTICLE CANVAS BACKGROUND
// =====================================================
(function initParticleCanvas() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H, particles = [];
  const isSmall = window.innerWidth < 768;
  const COUNT = isSmall ? 32 : 72;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    return {
      x: rand(0, W || 800),
      y: rand(0, H || 600),
      vx: rand(-0.35, 0.35),
      vy: rand(-0.35, 0.35),
      r: rand(1.2, 3),
      alpha: rand(0.15, 0.65),
      color: Math.random() > 0.65 ? "245, 197, 24" : "123, 47, 247"
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(123, 47, 247, ${0.14 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    if (!REDUCED_MOTION) requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  init();
  draw();
})();

// =====================================================
//  NAVBAR & SCROLL SPY
// =====================================================
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 50);
  updateActiveNav();
}, { passive: true });

function updateActiveNav() {
  const sections = ["hero", "about", "skills", "projects", "contact"];
  const scrollY = window.scrollY + 120;
  sections.forEach(id => {
    const sec = document.getElementById(id);
    if (!sec) return;
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) link.classList.toggle("active", scrollY >= top && scrollY < bottom);
  });
}

// Mobile Hamburger
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", String(open));
  });
  navLinks.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

// =====================================================
//  PROJECTS RENDERING
// =====================================================
function renderProjects() {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;
  grid.innerHTML = "";

  FLAGSHIP_PROJECTS.forEach((p, i) => {
    const card = document.createElement("article");
    card.className = "project-card";
    card.style.animationDelay = `${i * 0.1}s`;
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Open live demo of ${p.title}`);

    const techPills = p.tech.map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join("");

    card.innerHTML = `
      <div class="project-top-row">
        <div class="project-emoji-box">${p.emoji}</div>
        <div class="project-meta">
          <span class="live-badge"><span class="live-dot"></span>Live App</span>
          <span class="project-tag">${escapeHtml(p.tag)}</span>
        </div>
      </div>
      <h3 class="project-title">${escapeHtml(p.title)}</h3>
      <p class="project-desc">${escapeHtml(p.desc)}</p>
      <div class="project-tech-tags">${techPills}</div>
      <div class="project-links">
        <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="project-link-btn btn-live-demo" title="Launch live application">
          <span>▶ Launch Live Demo</span>
        </a>
        <a href="${p.github}" target="_blank" rel="noopener noreferrer" class="project-link-btn btn-github-code" title="Inspect source code on GitHub">
          <span>Source Code</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
        </a>
      </div>
      <p class="card-hint">click card to preview in page ↗</p>
    `;

    // Card click / Enter opens the in-page demo viewer
    card.addEventListener("click", (e) => {
      if (e.target.closest(".project-link-btn")) return;
      openDemoModal(p);
    });
    card.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && !e.target.closest(".project-link-btn")) {
        e.preventDefault();
        openDemoModal(p);
      }
    });

    grid.appendChild(card);
  });
}

// =====================================================
//  LIVE DEMO VIEWER MODAL (in-page iframe + case study)
// =====================================================
const demoModal = document.getElementById("demoModal");
const demoModalClose = document.getElementById("demoModalClose");
const demoFrame = document.getElementById("demoFrame");
const demoViewport = document.getElementById("demoViewport");
const demoOpenTab = document.getElementById("demoOpenTab");
const tabPreview = document.getElementById("tabPreview");
const tabCase = document.getElementById("tabCase");
const panePreview = document.getElementById("panePreview");
const paneCase = document.getElementById("paneCase");
const demoCaseContent = document.getElementById("demoCaseContent");

function openDemoModal(p) {
  if (!demoModal) return;
  document.getElementById("demoEmoji").textContent = p.emoji;
  document.getElementById("demoTitle").textContent = p.title;
  document.getElementById("demoTag").textContent = p.tag;
  demoOpenTab.href = p.url;
  demoFrame.src = p.url; // loads only when opened

  // reset to preview tab + desktop width each time
  switchTab("preview");
  setDevice(demoViewport.querySelector(".device-btn.active")?.dataset.w || "full");

  renderCaseStudy(p);
  demoModal.classList.add("open");
  document.body.style.overflow = "hidden";
  demoModalClose && demoModalClose.focus();
}

function closeDemoModal() {
  if (!demoModal) return;
  demoModal.classList.remove("open");
  demoFrame.src = "about:blank"; // stop the running app
  maybeRestoreScroll();
}

function switchTab(which) {
  const isPreview = which === "preview";
  tabPreview.classList.toggle("active", isPreview);
  tabCase.classList.toggle("active", !isPreview);
  tabPreview.setAttribute("aria-selected", String(isPreview));
  tabCase.setAttribute("aria-selected", String(!isPreview));
  panePreview.hidden = !isPreview;
  paneCase.hidden = isPreview;
}

function setDevice(w) {
  if (!demoViewport) return;
  demoViewport.dataset.device = w === "full" ? "full" : (w === "820" ? "tablet" : "mobile");
  document.querySelectorAll(".device-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.w === String(w));
  });
}

function renderCaseStudy(p) {
  const featureList = p.features.map(f => `<li>${escapeHtml(f)}</li>`).join("");
  const techPills = p.tech.map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join("");
  demoCaseContent.innerHTML = `
    <div class="case-study-content">
      <div class="case-study-top">
        <span class="case-study-emoji">${p.emoji}</span>
        <div>
          <span class="case-study-tag">${escapeHtml(p.tag)}</span>
          <h2 class="case-study-title">${escapeHtml(p.title)}</h2>
        </div>
      </div>

      <div class="case-study-section-title">Overview</div>
      <p class="case-study-text">${escapeHtml(p.desc)}</p>

      <div class="case-study-section-title">Architecture &amp; Implementation</div>
      <p class="case-study-text">${escapeHtml(p.architecture)}</p>

      <div class="case-study-section-title">Key Capabilities &amp; Features</div>
      <ul class="case-study-features">${featureList}</ul>

      <div class="case-study-section-title">Technologies Employed</div>
      <div class="project-tech-tags">${techPills}</div>

      <div class="case-study-actions">
        <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="project-link-btn btn-live-demo">
          <span>Open Live Application</span>
        </a>
        <a href="${p.github}" target="_blank" rel="noopener noreferrer" class="project-link-btn btn-github-code">
          <span>View GitHub Source</span>
        </a>
      </div>
    </div>
  `;
}

if (demoModalClose) demoModalClose.addEventListener("click", closeDemoModal);
if (demoModal) {
  demoModal.addEventListener("click", (e) => {
    if (e.target === demoModal) closeDemoModal();
  });
}
if (tabPreview) tabPreview.addEventListener("click", () => switchTab("preview"));
if (tabCase) tabCase.addEventListener("click", () => switchTab("case"));
document.querySelectorAll(".device-btn").forEach(btn => {
  btn.addEventListener("click", () => setDevice(btn.dataset.w));
});

// =====================================================
//  TELEGRAM QR MODAL
// =====================================================
const telegramQRModal = document.getElementById("telegramQRModal");
const btnViewTelegramQR = document.getElementById("btnViewTelegramQR");
const qrModalClose = document.getElementById("qrModalClose");

if (btnViewTelegramQR && telegramQRModal) {
  btnViewTelegramQR.addEventListener("click", () => {
    telegramQRModal.classList.add("open");
    document.body.style.overflow = "hidden";
  });
}
if (qrModalClose) qrModalClose.addEventListener("click", closeTelegramQRModal);
if (telegramQRModal) {
  telegramQRModal.addEventListener("click", (e) => {
    if (e.target === telegramQRModal) closeTelegramQRModal();
  });
}

function closeTelegramQRModal() {
  if (telegramQRModal) telegramQRModal.classList.remove("open");
  maybeRestoreScroll();
}

function maybeRestoreScroll() {
  const anyOpen = document.querySelector(".modal-overlay.open");
  if (!anyOpen) document.body.style.overflow = "";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeDemoModal();
    closeTelegramQRModal();
    if (navLinks && navLinks.classList.contains("open")) {
      navLinks.classList.remove("open");
      hamburger && hamburger.setAttribute("aria-expanded", "false");
    }
  }
});

// =====================================================
//  SCROLL REVEAL OBSERVER
// =====================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

function observeReveal() {
  document.querySelectorAll(".glass-card, .section-title, .section-subtitle, .contact-intro").forEach(el => {
    el.classList.add("reveal");
    revealObserver.observe(el);
  });
}

// =====================================================
//  CONTACT FORM HANDLER
// =====================================================
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (formSuccess) {
      formSuccess.style.display = "block";
      contactForm.reset();
      setTimeout(() => { formSuccess.style.display = "none"; }, 6000);
    }
  });
}

// =====================================================
//  UTILITIES & INIT
// =====================================================
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

const footerYear = document.getElementById("footerYear");
if (footerYear) footerYear.textContent = new Date().getFullYear();

document.addEventListener("DOMContentLoaded", () => {
  renderProjects();
  observeReveal();
});
