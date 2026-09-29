// =====================================================
//  CODECRAFT STUDIO — SANDBOX & IDE RUNTIME ENGINE
// =====================================================

const TEMPLATES = {
  cube: {
    html: `<div class="scene">
  <div class="cube">
    <div class="cube-face front">Front</div>
    <div class="cube-face back">Back</div>
    <div class="cube-face right">Right</div>
    <div class="cube-face left">Left</div>
    <div class="cube-face top">Top</div>
    <div class="cube-face bottom">Bottom</div>
  </div>
</div>
<div class="controls-hint">Move cursor to rotate cube</div>`,
    css: `body {
  margin: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #0a0a14;
  color: #fff;
  font-family: system-ui, sans-serif;
  overflow: hidden;
}
.scene {
  width: 200px;
  height: 200px;
  perspective: 600px;
}
.cube {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  animation: rotateCube 12s infinite linear;
}
.cube-face {
  position: absolute;
  width: 200px;
  height: 200px;
  border: 2px solid rgba(139, 92, 246, 0.8);
  background: rgba(139, 92, 246, 0.15);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  box-shadow: inset 0 0 30px rgba(139, 92, 246, 0.3);
}
.front  { transform: rotateY(0deg) translateZ(100px); }
.back   { transform: rotateY(180deg) translateZ(100px); }
.right  { transform: rotateY(90deg) translateZ(100px); }
.left   { transform: rotateY(-90deg) translateZ(100px); }
.top    { transform: rotateX(90deg) translateZ(100px); }
.bottom { transform: rotateX(-90deg) translateZ(100px); }

@keyframes rotateCube {
  from { transform: rotateX(-20deg) rotateY(0deg); }
  to   { transform: rotateX(-20deg) rotateY(360deg); }
}
.controls-hint {
  margin-top: 3rem;
  font-size: 0.85rem;
  color: #94a3b8;
  letter-spacing: 0.05em;
}`,
    js: `console.log("3D Interactive Cube Initialized!");
const scene = document.querySelector('.scene');
const cube = document.querySelector('.cube');

window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 60;
  const y = (e.clientY / window.innerHeight - 0.5) * -60;
  cube.style.animation = 'none';
  cube.style.transform = \`rotateX(\${y}deg) rotateY(\${x}deg)\`;
});

window.addEventListener('mouseleave', () => {
  cube.style.animation = 'rotateCube 12s infinite linear';
});`
  },

  particles: {
    html: `<canvas id="canvas"></canvas>
<div class="overlay-info">
  <h2>Particle Physics Mesh</h2>
  <p>Move mouse to attract particles. Click to burst.</p>
</div>`,
    css: `body {
  margin: 0;
  background: #090a0f;
  overflow: hidden;
  font-family: system-ui, sans-serif;
}
canvas {
  display: block;
  width: 100vw;
  height: 100vh;
}
.overlay-info {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  color: #fff;
  pointer-events: none;
}
.overlay-info h2 { margin: 0 0 0.3rem; font-size: 1.2rem; color: #38bdf8; }
.overlay-info p { margin: 0; font-size: 0.85rem; color: #64748b; }`,
    js: `console.log("Canvas Particle Engine running...");
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
});

const mouse = { x: W / 2, y: H / 2, active: false };
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.active = true;
});

const particles = [];
for (let i = 0; i < 90; i++) {
  particles.push({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 1.5,
    vy: (Math.random() - 0.5) * 1.5,
    r: Math.random() * 2.5 + 1
  });
}

function loop() {
  ctx.fillStyle = 'rgba(9, 10, 15, 0.2)';
  ctx.fillRect(0, 0, W, H);

  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;

    // Draw particle
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();

    // Connect lines
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.strokeStyle = \`rgba(56, 189, 248, \${(1 - dist / 100) * 0.3})\`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(loop);
}
loop();`
  },

  glasscard: {
    html: `<div class="card-wrap">
  <div class="glass-card">
    <div class="card-chip"></div>
    <div class="card-title">Nexus Platinum</div>
    <div class="card-number">•••• •••• •••• 5560</div>
    <div class="card-footer">
      <div>
        <div class="label">CARD HOLDER</div>
        <div class="val">MINGSTAR</div>
      </div>
      <div>
        <div class="label">EXPIRES</div>
        <div class="val">09/28</div>
      </div>
    </div>
  </div>
</div>`,
    css: `body {
  margin: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 30% 30%, #2e0854, #0a0a14);
  font-family: system-ui, sans-serif;
  color: #fff;
}
.card-wrap {
  perspective: 1000px;
}
.glass-card {
  width: 340px;
  height: 200px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease;
}
.glass-card:hover {
  transform: translateY(-8px) rotateX(6deg) rotateY(-6deg);
  border-color: rgba(245, 197, 24, 0.5);
}
.card-chip {
  width: 40px;
  height: 28px;
  background: linear-gradient(135deg, #f5c518, #d97706);
  border-radius: 5px;
}
.card-title { font-size: 0.9rem; font-weight: 700; color: #f5c518; }
.card-number { font-size: 1.25rem; font-family: monospace; letter-spacing: 0.1em; }
.card-footer { display: flex; justify-content: space-between; }
.label { font-size: 0.65rem; color: #94a3b8; }
.val { font-size: 0.85rem; font-weight: 600; }`,
    js: `console.log("Glassmorphism Card Rendered successfully.");
const card = document.querySelector('.glass-card');
card.addEventListener('mouseenter', () => console.log("Card hover interaction triggered."));`
  },

  todo: {
    html: `<div class="todo-app">
  <div class="todo-header">
    <h2>Micro Tasks</h2>
    <span id="taskCount">0 tasks</span>
  </div>
  <div class="todo-input-bar">
    <input type="text" id="newTodo" placeholder="What needs to get done?" />
    <button id="btnAdd">Add</button>
  </div>
  <ul class="todo-list" id="todoList"></ul>
</div>`,
    css: `body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
  color: #f8fafc;
  font-family: system-ui, sans-serif;
  padding: 1rem;
}
.todo-app {
  width: 100%;
  max-width: 400px;
  background: #1e293b;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}
.todo-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.2rem; }
.todo-header h2 { margin: 0; font-size: 1.3rem; }
#taskCount { font-size: 0.8rem; color: #94a3b8; }
.todo-input-bar { display: flex; gap: 0.5rem; margin-bottom: 1.2rem; }
.todo-input-bar input {
  flex: 1;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 6px;
  padding: 0.6rem 0.8rem;
  color: #fff;
  outline: none;
}
.todo-input-bar button {
  background: #3b82f6;
  border: none;
  color: #fff;
  font-weight: 600;
  padding: 0 1rem;
  border-radius: 6px;
  cursor: pointer;
}
.todo-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0f172a;
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  font-size: 0.9rem;
}
.todo-item.done span { text-decoration: line-through; color: #64748b; }
.btn-del { background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 1.1rem; }`,
    js: `console.log("Reactive Todo loaded.");
let items = ["Ship responsive portfolio", "Deploy 4 big web applications", "Submit GitHub push"];
const list = document.getElementById('todoList');
const count = document.getElementById('taskCount');
const input = document.getElementById('newTodo');

function render() {
  list.innerHTML = items.map((it, idx) => \`
    <li class="todo-item">
      <span>\${it}</span>
      <button class="btn-del" onclick="deleteItem(\${idx})">&times;</button>
    </li>
  \`).join('');
  count.textContent = items.length + " tasks";
}

window.deleteItem = (i) => {
  console.log("Deleted item index: " + i);
  items.splice(i, 1);
  render();
};

document.getElementById('btnAdd').addEventListener('click', () => {
  const v = input.value.trim();
  if (v) {
    items.push(v);
    input.value = '';
    console.log("Added new task: " + v);
    render();
  }
});
render();`
  }
};

let currentTab = "html";
let runDebounceTimer = null;
let consoleCount = 0;

document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  setupCodeEditors();
  setupTemplates();
  setupViewport();
  setupConsoleReceiver();

  // Load default template
  loadTemplate("cube");
});

function setupTabs() {
  const tabs = document.querySelectorAll(".editor-tab");
  const editors = {
    html: document.getElementById("codeHtml"),
    css: document.getElementById("codeCss"),
    js: document.getElementById("codeJs")
  };

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentTab = tab.dataset.lang;

      Object.keys(editors).forEach(lang => {
        editors[lang].style.display = lang === currentTab ? "block" : "none";
      });
      editors[currentTab].focus();
    });
  });
}

function setupCodeEditors() {
  const editors = [
    document.getElementById("codeHtml"),
    document.getElementById("codeCss"),
    document.getElementById("codeJs")
  ];

  editors.forEach(ed => {
    // Tab key handling
    ed.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const start = ed.selectionStart;
        const end = ed.selectionEnd;
        ed.value = ed.value.substring(0, start) + "  " + ed.value.substring(end);
        ed.selectionStart = ed.selectionEnd = start + 2;
      }
    });

    // Auto-run on change
    ed.addEventListener("input", () => {
      clearTimeout(runDebounceTimer);
      document.getElementById("previewStatus").textContent = "Compiling...";
      runDebounceTimer = setTimeout(() => {
        executeSandbox();
      }, 700);
    });
  });

  document.getElementById("btnRunCode").addEventListener("click", () => {
    executeSandbox();
  });

  document.getElementById("btnFormatCode").addEventListener("click", () => {
    // Simple basic indent format
    const ed = document.getElementById(currentTab === "html" ? "codeHtml" : currentTab === "css" ? "codeCss" : "codeJs");
    ed.value = ed.value.split("\n").map(l => l.trimEnd()).join("\n");
    addConsoleMessage("info", `Formatted ${currentTab.toUpperCase()} buffer`);
  });

  document.getElementById("btnClearCode").addEventListener("click", () => {
    const ed = document.getElementById(currentTab === "html" ? "codeHtml" : currentTab === "css" ? "codeCss" : "codeJs");
    ed.value = "";
    executeSandbox();
  });

  // Export HTML
  document.getElementById("btnExportHtml").addEventListener("click", () => {
    const bundle = buildSandboxDoc();
    const blob = new Blob([bundle], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `codecraft_project_${Date.now()}.html`;
    a.click();
    addConsoleMessage("info", "Exported standalone bundle as HTML file");
  });
}

function setupTemplates() {
  const select = document.getElementById("templateSelect");
  const btn = document.getElementById("btnLoadTemplate");

  btn.addEventListener("click", () => {
    loadTemplate(select.value);
  });
}

function loadTemplate(key) {
  const tpl = TEMPLATES[key];
  if (!tpl) return;
  document.getElementById("codeHtml").value = tpl.html;
  document.getElementById("codeCss").value = tpl.css;
  document.getElementById("codeJs").value = tpl.js;

  clearConsole();
  addConsoleMessage("info", `Loaded template: ${key}`);
  executeSandbox();
}

function setupViewport() {
  const frame = document.getElementById("previewFrame");
  document.querySelectorAll(".vp-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".vp-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      frame.style.width = btn.dataset.width;
    });
  });
}

function buildSandboxDoc() {
  const html = document.getElementById("codeHtml").value;
  const css = document.getElementById("codeCss").value;
  const js = document.getElementById("codeJs").value;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    // Capture console and errors back to parent IDE
    (function() {
      const origLog = console.log;
      const origWarn = console.warn;
      const origError = console.error;

      function post(type, args) {
        try {
          const text = Array.from(args).map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
          window.parent.postMessage({ type: 'codecraft_log', level: type, text: text }, '*');
        } catch(e) {}
      }

      console.log = function() { post('info', arguments); origLog.apply(console, arguments); };
      console.warn = function() { post('warn', arguments); origWarn.apply(console, arguments); };
      console.error = function() { post('error', arguments); origError.apply(console, arguments); };

      window.onerror = function(msg, url, line) {
        post('error', ['Runtime Error: ' + msg + ' (Line ' + line + ')']);
      };
    })();
    ${js}
  <\/script>
</body>
</html>`;
}

function executeSandbox() {
  const frame = document.getElementById("previewFrame");
  const doc = buildSandboxDoc();
  frame.srcdoc = doc;
  document.getElementById("previewStatus").textContent = "Live Reload Ready";
}

// Virtual Console
function setupConsoleReceiver() {
  window.addEventListener("message", (e) => {
    if (e.data && e.data.type === "codecraft_log") {
      addConsoleMessage(e.data.level, e.data.text);
    }
  });

  document.getElementById("btnClearConsole").addEventListener("click", clearConsole);
}

function addConsoleMessage(level, text) {
  const out = document.getElementById("consoleOutput");
  const line = document.createElement("div");
  line.className = `con-log con-${level}`;
  line.textContent = `> ${text}`;
  out.appendChild(line);
  out.scrollTop = out.scrollHeight;

  consoleCount++;
  document.getElementById("consoleCount").textContent = consoleCount;
}

function clearConsole() {
  document.getElementById("consoleOutput").innerHTML = "";
  consoleCount = 0;
  document.getElementById("consoleCount").textContent = 0;
}
