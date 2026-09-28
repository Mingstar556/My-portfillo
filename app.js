// =====================================================
//  PORTFOLIO — APP.JS
// =====================================================

// --- DEFAULT DATA ---
const DEFAULT_SKILLS = [
  { name: "HTML & CSS", level: 90, icon: "HTML" },
  { name: "JavaScript", level: 80, icon: "JS" },
  { name: "UI/UX Design", level: 75, icon: "UX" },
  { name: "React", level: 70, icon: "RE" },
  { name: "Python", level: 65, icon: "PY" },
  { name: "Git & GitHub", level: 85, icon: "GIT" }
];

const DEFAULT_PROJECTS = [
  {
    title: "Portfolio Website",
    tag: "Web",
    emoji: "web",
    desc: "A personal portfolio built with HTML, CSS & JS.",
    fullDesc: "This is the very site you are looking at! Built from scratch with a black, purple and yellow theme. Features include an editable mode, animated particles, and a modular project system.",
    url: "",
    github: ""
  },
  {
    title: "E-Commerce App",
    tag: "Full Stack",
    emoji: "shop",
    desc: "Online store with cart, checkout, and admin panel.",
    fullDesc: "A full-stack e-commerce platform with product listings, shopping cart, user authentication, order management, and an admin dashboard. Built with React and Node.js.",
    url: "",
    github: ""
  },
  {
    title: "Mobile Weather App",
    tag: "Mobile",
    emoji: "cloud",
    desc: "Real-time weather app with beautiful UI and animations.",
    fullDesc: "A cross-platform mobile app that fetches real-time weather data from OpenWeatherMap API. Features animated weather icons, a 7-day forecast, location-based weather, and dark/light mode.",
    url: "",
    github: ""
  }
];

// --- STATE ---
let skills = JSON.parse(localStorage.getItem("portfolio_skills") || "null") || [...DEFAULT_SKILLS];
let projects = JSON.parse(localStorage.getItem("portfolio_projects") || "null") || [...DEFAULT_PROJECTS];
let editMode = false;
let editingProjectIndex = -1;

// --- SAVE ---
function saveData() {
  localStorage.setItem("portfolio_skills", JSON.stringify(skills));
  localStorage.setItem("portfolio_projects", JSON.stringify(projects));
}

// --- EDITABLE TEXT (contenteditable) ---
function initEditables() {
  document.querySelectorAll(".editable").forEach(el => {
    const key = el.dataset.key;
    const stored = localStorage.getItem("pf_text_" + key);
    if (stored) el.textContent = stored;

    el.addEventListener("blur", () => {
      localStorage.setItem("pf_text_" + key, el.textContent.trim());
    });
  });
}

function setEditables(active) {
  document.querySelectorAll(".editable").forEach(el => {
    el.contentEditable = active ? "true" : "false";
  });
}

// --- EDIT MODE TOGGLE ---
const editBtn = document.getElementById("editModeBtn");
editBtn.addEventListener("click", () => {
  editMode = !editMode;
  document.body.classList.toggle("edit-active", editMode);
  editBtn.textContent = editMode ? "Done Editing" : "Edit Mode";
  editBtn.classList.toggle("active", editMode);
  setEditables(editMode);
});

// --- PARTICLE CANVAS ---
(function () {
  const canvas = document.getElementById("particles-canvas");
  const ctx = canvas.getContext("2d");
  let W, H, particles = [];
  const COUNT = 80;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    return {
      x: rand(0, W), y: rand(0, H),
      vx: rand(-0.3, 0.3), vy: rand(-0.3, 0.3),
      r: rand(1, 3.5),
      alpha: rand(0.15, 0.7),
      color: Math.random() > 0.6 ? "245,197,24" : "123,47,247"
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
      ctx.fillStyle = "rgba(" + p.color + "," + p.alpha + ")";
      ctx.fill();
    });

    // draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = "rgba(123,47,247," + (0.12 * (1 - dist / 120)) + ")";
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  init();
  draw();
})();

// --- NAVBAR ---
window.addEventListener("scroll", () => {
  document.getElementById("navbar").classList.toggle("scrolled", window.scrollY > 60);
  updateActiveNav();
});

function updateActiveNav() {
  const sections = ["hero", "about", "skills", "projects", "contact"];
  const scrollY = window.scrollY + 100;
  sections.forEach(id => {
    const sec = document.getElementById(id);
    if (!sec) return;
    const top = sec.offsetTop, bottom = top + sec.offsetHeight;
    const link = document.querySelector(".nav-link[href='#" + id + "']");
    if (link) link.classList.toggle("active", scrollY >= top && scrollY < bottom);
  });
}

// hamburger
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
hamburger.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// --- SCROLL REVEAL ---
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); revealObserver.unobserve(e.target); } });
}, { threshold: 0.12 });

function observeReveal() {
  document.querySelectorAll(".glass-card, .section-title, .section-subtitle, .contact-intro").forEach(el => {
    el.classList.add("reveal");
    revealObserver.observe(el);
  });
}

// --- SKILLS ---
function renderSkills() {
  const grid = document.getElementById("skillsGrid");
  grid.innerHTML = "";
  skills.forEach((sk, i) => {
    const card = document.createElement("div");
    card.className = "skill-card";
    card.style.animationDelay = (i * 0.07) + "s";
    card.innerHTML = `
      <button class="skill-delete-btn" data-i="${i}" title="Remove skill">x</button>
      <div class="skill-header">
        <div class="skill-name-wrap">
          <span class="skill-icon">${sk.icon}</span>
          <span class="skill-name">${sk.name}</span>
        </div>
        <span class="skill-pct">${sk.level}%</span>
      </div>
      <div class="skill-bar-bg"><div class="skill-bar" data-level="${sk.level}"></div></div>
    `;
    grid.appendChild(card);
  });

  // animate bars
  setTimeout(() => {
    document.querySelectorAll(".skill-bar").forEach(bar => {
      bar.style.width = bar.dataset.level + "%";
    });
  }, 200);

  // delete skill
  grid.querySelectorAll(".skill-delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const i = parseInt(btn.dataset.i);
      if (confirm("Remove skill '" + skills[i].name + "'?")) {
        skills.splice(i, 1);
        saveData();
        renderSkills();
      }
    });
  });
}

// add skill modal
const addSkillBtn = document.getElementById("addSkillBtn");
const addSkillModal = document.getElementById("addSkillModal");
const addSkillClose = document.getElementById("addSkillClose");
const cancelAddSkill = document.getElementById("cancelAddSkill");
const addSkillForm = document.getElementById("addSkillForm");

addSkillBtn.addEventListener("click", () => openModal(addSkillModal));
addSkillClose.addEventListener("click", () => closeModal(addSkillModal));
cancelAddSkill.addEventListener("click", () => closeModal(addSkillModal));

addSkillForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("skillName").value.trim();
  const level = parseInt(document.getElementById("skillLevel").value);
  const icon = document.getElementById("skillEmoji").value.trim() || name.slice(0, 3).toUpperCase();
  skills.push({ name, level, icon });
  saveData();
  renderSkills();
  closeModal(addSkillModal);
  addSkillForm.reset();
});

// --- PROJECTS ---
function renderProjects() {
  const grid = document.getElementById("projectsGrid");
  grid.innerHTML = "";
  projects.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.style.animationDelay = (i * 0.1) + "s";
    const links = [];
    if (p.url) links.push(`<a class="project-link" href="${p.url}" target="_blank" rel="noopener">Live Demo</a>`);
    if (p.github) links.push(`<a class="project-link" href="${p.github}" target="_blank" rel="noopener">GitHub</a>`);
    card.innerHTML = `
      <div class="project-actions">
        <button class="project-edit-btn" data-i="${i}" title="Edit">Ed</button>
        <button class="project-delete-btn" data-i="${i}" title="Delete">Del</button>
      </div>
      <span class="project-emoji">${p.emoji}</span>
      <span class="project-tag">${p.tag || "Project"}</span>
      <h3 class="project-title">${p.title}</h3>
      <p class="project-desc">${p.desc}</p>
      ${links.length ? '<div class="project-links">' + links.join("") + '</div>' : ""}
    `;

    // click to view (not on action buttons or links)
    card.addEventListener("click", (e) => {
      if (e.target.closest(".project-actions") || e.target.closest(".project-links")) return;
      openProjectModal(p);
    });

    grid.appendChild(card);
  });

  // edit / delete project
  grid.querySelectorAll(".project-edit-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openEditProjectModal(parseInt(btn.dataset.i));
    });
  });
  grid.querySelectorAll(".project-delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const i = parseInt(btn.dataset.i);
      if (confirm("Delete project '" + projects[i].title + "'?")) {
        projects.splice(i, 1);
        saveData();
        renderProjects();
      }
    });
  });
}

// view project modal
const projectModal = document.getElementById("projectModal");
const modalClose = document.getElementById("modalClose");
const modalContent = document.getElementById("modalContent");
modalClose.addEventListener("click", () => closeModal(projectModal));
projectModal.addEventListener("click", (e) => { if (e.target === projectModal) closeModal(projectModal); });

function openProjectModal(p) {
  const links = [];
  if (p.url) links.push(`<a class="project-link" href="${p.url}" target="_blank" rel="noopener">Live Demo</a>`);
  if (p.github) links.push(`<a class="project-link" href="${p.github}" target="_blank" rel="noopener">GitHub</a>`);
  modalContent.innerHTML = `
    <span class="modal-emoji">${p.emoji}</span>
    <h2>${p.title}</h2>
    <span class="project-tag">${p.tag || "Project"}</span>
    <p>${p.fullDesc || p.desc}</p>
    ${links.length ? '<div class="modal-links">' + links.join("") + '</div>' : ""}
  `;
  openModal(projectModal);
}

// add/edit project modal
const addProjectBtn = document.getElementById("addProjectBtn");
const editProjectModal = document.getElementById("editProjectModal");
const editModalClose = document.getElementById("editModalClose");
const cancelEditProject = document.getElementById("cancelEditProject");
const editProjectForm = document.getElementById("editProjectForm");

addProjectBtn.addEventListener("click", () => openEditProjectModal(-1));
editModalClose.addEventListener("click", () => closeModal(editProjectModal));
cancelEditProject.addEventListener("click", () => closeModal(editProjectModal));
editProjectModal.addEventListener("click", (e) => { if (e.target === editProjectModal) closeModal(editProjectModal); });

function openEditProjectModal(i) {
  editingProjectIndex = i;
  document.getElementById("editProjectTitle").textContent = i >= 0 ? "Edit Project" : "Add Project";
  document.getElementById("editProjectIndex").value = i;
  const p = i >= 0 ? projects[i] : {};
  document.getElementById("epTitle").value = p.title || "";
  document.getElementById("epTag").value = p.tag || "";
  document.getElementById("epDesc").value = p.desc || "";
  document.getElementById("epFullDesc").value = p.fullDesc || "";
  document.getElementById("epUrl").value = p.url || "";
  document.getElementById("epGithub").value = p.github || "";
  document.getElementById("epEmoji").value = p.emoji || "";
  openModal(editProjectModal);
}

editProjectForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const p = {
    title: document.getElementById("epTitle").value.trim(),
    tag: document.getElementById("epTag").value.trim(),
    desc: document.getElementById("epDesc").value.trim(),
    fullDesc: document.getElementById("epFullDesc").value.trim(),
    url: document.getElementById("epUrl").value.trim(),
    github: document.getElementById("epGithub").value.trim(),
    emoji: document.getElementById("epEmoji").value.trim() || "proj"
  };
  if (editingProjectIndex >= 0) {
    projects[editingProjectIndex] = p;
  } else {
    projects.push(p);
  }
  saveData();
  renderProjects();
  closeModal(editProjectModal);
});

// --- CONTACT FORM ---
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  document.getElementById("formSuccess").style.display = "block";
  e.target.reset();
  setTimeout(() => { document.getElementById("formSuccess").style.display = "none"; }, 5000);
});

// --- AVATAR UPLOAD ---
document.getElementById("avatarUpload").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = document.getElementById("avatarImg");
    img.src = ev.target.result;
    img.style.display = "block";
    document.getElementById("avatarEmoji").style.display = "none";
    localStorage.setItem("portfolio_avatar", ev.target.result);
  };
  reader.readAsDataURL(file);
});

function loadAvatar() {
  const saved = localStorage.getItem("portfolio_avatar");
  if (saved) {
    document.getElementById("avatarImg").src = saved;
    document.getElementById("avatarImg").style.display = "block";
    document.getElementById("avatarEmoji").style.display = "none";
  }
}

// --- MODAL HELPERS ---
function openModal(el) { el.classList.add("open"); document.body.style.overflow = "hidden"; }
function closeModal(el) { el.classList.remove("open"); document.body.style.overflow = ""; }

// close modals on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    [projectModal, editProjectModal, addSkillModal].forEach(closeModal);
  }
});

// --- FOOTER YEAR ---
document.getElementById("footerYear").textContent = new Date().getFullYear();

// --- INIT ---
function init() {
  initEditables();
  loadAvatar();
  renderSkills();
  renderProjects();
  observeReveal();
}

document.addEventListener("DOMContentLoaded", init);
