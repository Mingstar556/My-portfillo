// =====================================================
//  NEXUSFLOW — ENTERPRISE AGILE & KANBAN ENGINE
// =====================================================

const COLUMNS = [
  { id: "backlog", title: "Backlog", color: "col-backlog" },
  { id: "in_progress", title: "In Progress", color: "col-in_progress" },
  { id: "review", title: "Code Review", color: "col-review" },
  { id: "qa", title: "QA & Testing", color: "col-qa" },
  { id: "done", title: "Completed", color: "col-done" }
];

const INITIAL_TASKS = [
  {
    id: "TASK-101",
    title: "Implement OAuth2.0 Token Refresh Interceptor",
    desc: "Architect seamless JWT rotation on Axios client with automatic queue retries upon 401 Unauthorized responses.",
    column: "done",
    priority: "urgent",
    tag: "Security",
    assignee: "Mingstar",
    dueDate: "2026-09-28",
    points: 5,
    subtasks: [
      { text: "Add JWT decode utility", done: true },
      { text: "Handle concurrent 401 retry queue", done: true },
      { text: "Unit test expiration boundary condition", done: true }
    ]
  },
  {
    id: "TASK-102",
    title: "PostgreSQL Time-Series Table Partitioning",
    desc: "Partition audit logs and financial ledger tables by calendar month to optimize query execution and vacuum times.",
    column: "done",
    priority: "high",
    tag: "Backend",
    assignee: "Sarah K.",
    dueDate: "2026-09-29",
    points: 8,
    subtasks: [
      { text: "Benchmark current unindexed scan latency", done: true },
      { text: "Write migration script for declarative range partitioning", done: true },
      { text: "Validate foreign key integrity across partitions", done: true }
    ]
  },
  {
    id: "TASK-103",
    title: "Real-Time WebSocket Heartbeat & Reconnection",
    desc: "Integrate exponential backoff jitter reconnection logic for socket client to preserve live metric feeds across spotty connections.",
    column: "review",
    priority: "urgent",
    tag: "Frontend",
    assignee: "Mingstar",
    dueDate: "2026-09-30",
    points: 5,
    subtasks: [
      { text: "Design client-side ping/pong heartbeat timer", done: true },
      { text: "Implement exponential backoff with randomized jitter", done: true },
      { text: "Add connection state banner in UI", done: false }
    ]
  },
  {
    id: "TASK-104",
    title: "Design System Token Sync & Glassmorphism Kit",
    desc: "Extract shared CSS custom variables and component presets from Figma into CSS variables and React design tokens.",
    column: "in_progress",
    priority: "medium",
    tag: "Design",
    assignee: "Elena R.",
    dueDate: "2026-10-02",
    points: 3,
    subtasks: [
      { text: "Export color & elevation tokens from Figma", done: true },
      { text: "Build glassmorphic modal and badge variants", done: false }
    ]
  },
  {
    id: "TASK-105",
    title: "Distributed Redis Caching Layer for Profile APIs",
    desc: "Cache high-throughput user profile and project query responses with 15-minute TTL and invalidation triggers on mutation.",
    column: "in_progress",
    priority: "high",
    tag: "Backend",
    assignee: "Sarah K.",
    dueDate: "2026-10-03",
    points: 5,
    subtasks: [
      { text: "Setup Redis client connection pool", done: true },
      { text: "Implement cache middleware with key hashing", done: false },
      { text: "Benchmark p99 latency reduction", done: false }
    ]
  },
  {
    id: "TASK-106",
    title: "Docker Multi-Stage Build Optimization",
    desc: "Refactor production Dockerfiles using Alpine Linux multi-stage builds to shrink container image size from 1.2GB to under 120MB.",
    column: "qa",
    priority: "medium",
    tag: "DevOps",
    assignee: "David L.",
    dueDate: "2026-10-01",
    points: 3,
    subtasks: [
      { text: "Strip devDependencies from final image runner", done: true },
      { text: "Add non-root security user in container", done: true },
      { text: "Verify GitHub Actions pipeline build time", done: false }
    ]
  },
  {
    id: "TASK-107",
    title: "Drag-and-Drop Column Reordering & Touch Events",
    desc: "Add mobile touch drag support and column custom sorting to deliver native mobile experience for Kanban boards.",
    column: "backlog",
    priority: "high",
    tag: "Frontend",
    assignee: "Mingstar",
    dueDate: "2026-10-05",
    points: 5,
    subtasks: [
      { text: "Touch event polyfill and listener hooks", done: false },
      { text: "Haptic vibration feedback on mobile drag", done: false }
    ]
  },
  {
    id: "TASK-108",
    title: "Automated End-to-End Cypress / Playwright Suite",
    desc: "Author integration regression suites for checkout flow, task state persistence, and authentication edge cases.",
    column: "backlog",
    priority: "medium",
    tag: "DevOps",
    assignee: "David L.",
    dueDate: "2026-10-06",
    points: 8,
    subtasks: [
      { text: "Setup headless CI test runner", done: false },
      { text: "Record test coverage for user journey paths", done: false }
    ]
  }
];

// App State
let tasks = [];
let draggedTaskId = null;
let currentModalSubtasks = [];

// Initialize
function init() {
  loadTasks();
  setupEventListeners();
  renderBoard();
  updateQuickStats();
}

function loadTasks() {
  const saved = localStorage.getItem("nexusflow_tasks");
  if (saved) {
    try {
      tasks = JSON.parse(saved);
    } catch (e) {
      tasks = [...INITIAL_TASKS];
    }
  } else {
    tasks = [...INITIAL_TASKS];
    saveTasks();
  }
}

function saveTasks() {
  localStorage.setItem("nexusflow_tasks", JSON.stringify(tasks));
}

// Render Board
function renderBoard() {
  const boardEl = document.getElementById("boardColumns");
  boardEl.innerHTML = "";

  const searchQuery = document.getElementById("taskSearch").value.toLowerCase().trim();
  const filterPriority = document.getElementById("filterPriority").value;
  const filterTag = document.getElementById("filterTag").value;
  const filterAssignee = document.getElementById("filterAssignee").value;

  COLUMNS.forEach(col => {
    const colEl = document.createElement("div");
    colEl.className = "column";
    colEl.dataset.columnId = col.id;

    // Filter tasks for this column
    const colTasks = tasks.filter(t => {
      if (t.column !== col.id) return false;
      if (filterPriority !== "all" && t.priority !== filterPriority) return false;
      if (filterTag !== "all" && t.tag !== filterTag) return false;
      if (filterAssignee !== "all" && t.assignee !== filterAssignee) return false;
      if (searchQuery) {
        const matchesTitle = t.title.toLowerCase().includes(searchQuery);
        const matchesDesc = t.desc.toLowerCase().includes(searchQuery);
        const matchesId = t.id.toLowerCase().includes(searchQuery);
        const matchesAssignee = t.assignee.toLowerCase().includes(searchQuery);
        if (!matchesTitle && !matchesDesc && !matchesId && !matchesAssignee) return false;
      }
      return true;
    });

    // Column Header
    colEl.innerHTML = `
      <div class="column-header">
        <div class="column-title-wrap">
          <span class="col-indicator ${col.color}"></span>
          <span class="column-title">${col.title}</span>
          <span class="column-count">${colTasks.length}</span>
        </div>
        <button class="column-btn-add" title="Add task to ${col.title}" data-col="${col.id}">+</button>
      </div>
      <div class="column-cards" data-column-id="${col.id}"></div>
    `;

    const cardsContainer = colEl.querySelector(".column-cards");

    // Add dragover events to column
    cardsContainer.addEventListener("dragover", handleDragOver);
    cardsContainer.addEventListener("dragleave", handleDragLeave);
    cardsContainer.addEventListener("drop", handleDrop);

    // Render Cards
    colTasks.forEach(task => {
      const card = createTaskCardElement(task);
      cardsContainer.appendChild(card);
    });

    // Add task button
    colEl.querySelector(".column-btn-add").addEventListener("click", () => {
      openTaskModal(null, col.id);
    });

    boardEl.appendChild(colEl);
  });
}

function createTaskCardElement(task) {
  const card = document.createElement("div");
  card.className = "task-card";
  card.draggable = true;
  card.dataset.taskId = task.id;

  const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
  const completedSubtasks = task.subtasks ? task.subtasks.filter(s => s.done).length : 0;
  const pct = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const priorityClass = `p-${task.priority}`;
  const priorityLabels = { urgent: "Urgent", high: "High", medium: "Medium", low: "Low" };

  const initials = task.assignee.split(" ").map(n => n[0]).join("").slice(0, 2);

  card.innerHTML = `
    <div class="task-top">
      <span class="priority-pill ${priorityClass}">${priorityLabels[task.priority] || task.priority}</span>
      <button class="task-card-menu-btn" title="Edit task" data-task-id="${task.id}">✎</button>
    </div>
    <div class="task-title">${escapeHtml(task.title)}</div>
    <div class="task-desc">${escapeHtml(task.desc)}</div>
    ${totalSubtasks > 0 ? `
      <div class="task-subtasks-progress">
        <div class="subtask-status-row">
          <span>Subtasks</span>
          <span>${completedSubtasks}/${totalSubtasks} (${pct}%)</span>
        </div>
        <div class="subtask-bar-track">
          <div class="subtask-bar-fill" style="width: ${pct}%"></div>
        </div>
      </div>
    ` : ""}
    <div class="task-meta-row">
      <span class="tag-badge">${escapeHtml(task.tag)}</span>
      <div style="display:flex; align-items:center; gap:0.5rem;">
        <span style="color:var(--text-muted); font-size:0.75rem;">${task.points} pts</span>
        <div class="task-assignee-avatar" title="${task.assignee}">${initials}</div>
      </div>
    </div>
  `;

  // Drag Events
  card.addEventListener("dragstart", handleDragStart);
  card.addEventListener("dragend", handleDragEnd);

  // Edit Click
  card.querySelector(".task-card-menu-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    openTaskModal(task.id);
  });

  // Card click opens modal too
  card.addEventListener("click", () => {
    openTaskModal(task.id);
  });

  return card;
}

// Drag & Drop Handlers
function handleDragStart(e) {
  draggedTaskId = this.dataset.taskId;
  this.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", draggedTaskId);
}

function handleDragEnd() {
  this.classList.remove("dragging");
  document.querySelectorAll(".column").forEach(c => c.classList.remove("drag-over"));
  draggedTaskId = null;
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  const col = this.closest(".column");
  if (col) col.classList.add("drag-over");
}

function handleDragLeave(e) {
  const col = this.closest(".column");
  if (col) col.classList.remove("drag-over");
}

function handleDrop(e) {
  e.preventDefault();
  const col = this.closest(".column");
  if (!col) return;
  col.classList.remove("drag-over");

  const targetColId = col.dataset.columnId;
  const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;

  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex !== -1 && tasks[taskIndex].column !== targetColId) {
    const oldCol = tasks[taskIndex].column;
    tasks[taskIndex].column = targetColId;
    saveTasks();
    renderBoard();
    updateQuickStats();

    showToast(`Task ${taskId} moved to ${COLUMNS.find(c => c.id === targetColId).title}`);
  }
}

// Task Modal Functions
function openTaskModal(taskId = null, defaultColumn = "backlog") {
  const modal = document.getElementById("taskModal");
  const form = document.getElementById("taskForm");
  const modalTitle = document.getElementById("modalTaskTitle");

  if (taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    modalTitle.textContent = `Edit Task ${task.id}`;
    document.getElementById("taskId").value = task.id;
    document.getElementById("taskTitleInput").value = task.title;
    document.getElementById("taskColumnSelect").value = task.column;
    document.getElementById("taskPrioritySelect").value = task.priority;
    document.getElementById("taskTagSelect").value = task.tag;
    document.getElementById("taskAssigneeSelect").value = task.assignee;
    document.getElementById("taskDueDateInput").value = task.dueDate || "";
    document.getElementById("taskPointsInput").value = task.points || 5;
    document.getElementById("taskDescInput").value = task.desc;
    currentModalSubtasks = task.subtasks ? JSON.parse(JSON.stringify(task.subtasks)) : [];
  } else {
    modalTitle.textContent = "Create New Task";
    form.reset();
    document.getElementById("taskId").value = "";
    document.getElementById("taskColumnSelect").value = defaultColumn;
    document.getElementById("taskPointsInput").value = 5;
    currentModalSubtasks = [];
  }

  renderModalSubtasks();
  modal.classList.add("open");
  document.getElementById("taskTitleInput").focus();
}

function closeTaskModal() {
  document.getElementById("taskModal").classList.remove("open");
}

function renderModalSubtasks() {
  const list = document.getElementById("modalSubtaskList");
  const count = document.getElementById("modalSubtaskCount");
  list.innerHTML = "";
  count.textContent = `${currentModalSubtasks.length} items`;

  currentModalSubtasks.forEach((st, idx) => {
    const li = document.createElement("li");
    li.className = "subtask-modal-item";
    li.innerHTML = `
      <div class="subtask-item-left">
        <input type="checkbox" class="subtask-checkbox" ${st.done ? "checked" : ""} data-idx="${idx}" />
        <span class="${st.done ? "subtask-done-text" : ""}">${escapeHtml(st.text)}</span>
      </div>
      <button type="button" class="subtask-del-btn" data-idx="${idx}">&times;</button>
    `;

    li.querySelector(".subtask-checkbox").addEventListener("change", (e) => {
      currentModalSubtasks[idx].done = e.target.checked;
      renderModalSubtasks();
    });

    li.querySelector(".subtask-del-btn").addEventListener("click", () => {
      currentModalSubtasks.splice(idx, 1);
      renderModalSubtasks();
    });

    list.appendChild(li);
  });
}

function handleAddSubtask() {
  const input = document.getElementById("newSubtaskInput");
  const val = input.value.trim();
  if (!val) return;
  currentModalSubtasks.push({ text: val, done: false });
  input.value = "";
  renderModalSubtasks();
}

// Quick Stats & Analytics
function updateQuickStats() {
  const total = tasks.length;
  const doneCount = tasks.filter(t => t.column === "done").length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  document.getElementById("quickStatsTotal").textContent = `${total} Tasks`;
  document.getElementById("quickStatsProgress").textContent = `${pct}% Complete`;

  // Update analytics metrics
  document.getElementById("mCompletedRatio").textContent = `${doneCount} / ${total}`;
  document.getElementById("mCompletedPct").textContent = `${pct}% Finished`;
  const totalPoints = tasks.reduce((sum, t) => sum + (t.points || 0), 0);
  document.getElementById("mVelocity").textContent = `${totalPoints} pts`;
}

// Draw Analytics Charts using Canvas 2D
function drawBurndownChart() {
  const canvas = document.getElementById("burndownCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  // Background grid
  ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  ctx.lineWidth = 1;
  const days = ["Day 1", "Day 3", "Day 5", "Day 7", "Day 9", "Day 11", "Day 14"];
  const padLeft = 40, padRight = 20, padTop = 30, padBottom = 30;
  const chartW = W - padLeft - padRight;
  const chartH = H - padTop - padBottom;

  for (let i = 0; i < 5; i++) {
    const y = padTop + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(W - padRight, y);
    ctx.stroke();

    ctx.fillStyle = "#64748b";
    ctx.font = "10px JetBrains Mono";
    ctx.fillText(`${Math.round(40 - i * 10)} pts`, 5, y + 3);
  }

  // Draw Ideal Burn-down Line (Dotted Gray)
  ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padLeft, padTop);
  ctx.lineTo(padLeft + chartW, padTop + chartH);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw Actual Burn-down Line (Gradient Purple)
  const actualPoints = [40, 37, 31, 24, 18, 14, 8];
  ctx.strokeStyle = "#8b5cf6";
  ctx.lineWidth = 3;
  ctx.beginPath();
  actualPoints.forEach((pts, i) => {
    const x = padLeft + (chartW / (actualPoints.length - 1)) * i;
    const y = padTop + chartH - (pts / 40) * chartH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Draw Data Points
  actualPoints.forEach((pts, i) => {
    const x = padLeft + (chartW / (actualPoints.length - 1)) * i;
    const y = padTop + chartH - (pts / 40) * chartH;

    ctx.fillStyle = "#8b5cf6";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();

    // Day labels
    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px Plus Jakarta Sans";
    ctx.textAlign = "center";
    ctx.fillText(days[i], x, H - 10);
  });
}

function drawDistributionChart() {
  const canvas = document.getElementById("distributionCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const counts = {
    backlog: tasks.filter(t => t.column === "backlog").length,
    in_progress: tasks.filter(t => t.column === "in_progress").length,
    review: tasks.filter(t => t.column === "review").length,
    qa: tasks.filter(t => t.column === "qa").length,
    done: tasks.filter(t => t.column === "done").length
  };

  const total = tasks.length || 1;
  const colors = {
    backlog: "#64748b",
    in_progress: "#3b82f6",
    review: "#f59e0b",
    qa: "#06b6d4",
    done: "#10b981"
  };

  const centerX = 120;
  const centerY = H / 2;
  const radius = 70;
  const innerRadius = 45;

  let startAngle = -Math.PI / 2;

  Object.keys(counts).forEach(key => {
    const sliceAngle = (counts[key] / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
    ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = colors[key];
    ctx.fill();
    startAngle += sliceAngle;
  });

  // Center text
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px Plus Jakarta Sans";
  ctx.textAlign = "center";
  ctx.fillText(`${total}`, centerX, centerY + 2);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px Plus Jakarta Sans";
  ctx.fillText("Total Tasks", centerX, centerY + 18);

  // Legend
  const legendX = 240;
  let legendY = 50;
  Object.keys(counts).forEach(key => {
    const colName = COLUMNS.find(c => c.id === key).title;
    ctx.fillStyle = colors[key];
    ctx.fillRect(legendX, legendY - 8, 12, 12);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "12px Plus Jakarta Sans";
    ctx.textAlign = "left";
    ctx.fillText(`${colName}: ${counts[key]} (${Math.round((counts[key]/total)*100)}%)`, legendX + 22, legendY + 2);
    legendY += 34;
  });
}

// Toast System
function showToast(message) {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>✔</span> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Utility: HTML escape
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

// Event Listeners Setup
function setupEventListeners() {
  // New Task
  document.getElementById("btnNewTask").addEventListener("click", () => openTaskModal());
  document.getElementById("btnModalClose").addEventListener("click", closeTaskModal);
  document.getElementById("btnModalCancel").addEventListener("click", closeTaskModal);

  // Task Form Submit
  document.getElementById("taskForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("taskId").value;
    const title = document.getElementById("taskTitleInput").value.trim();
    const column = document.getElementById("taskColumnSelect").value;
    const priority = document.getElementById("taskPrioritySelect").value;
    const tag = document.getElementById("taskTagSelect").value;
    const assignee = document.getElementById("taskAssigneeSelect").value;
    const dueDate = document.getElementById("taskDueDateInput").value;
    const points = parseInt(document.getElementById("taskPointsInput").value) || 3;
    const desc = document.getElementById("taskDescInput").value.trim();

    if (id) {
      // Edit existing
      const idx = tasks.findIndex(t => t.id === id);
      if (idx !== -1) {
        tasks[idx] = { ...tasks[idx], title, column, priority, tag, assignee, dueDate, points, desc, subtasks: currentModalSubtasks };
        showToast(`Task ${id} updated successfully`);
      }
    } else {
      // Create new
      const newId = `TASK-${Math.floor(100 + Math.random() * 900)}`;
      tasks.unshift({
        id: newId,
        title,
        column,
        priority,
        tag,
        assignee,
        dueDate,
        points,
        desc,
        subtasks: currentModalSubtasks
      });
      showToast(`Created new task ${newId}`);
    }

    saveTasks();
    renderBoard();
    updateQuickStats();
    closeTaskModal();
  });

  // Subtask Add
  document.getElementById("btnAddSubtask").addEventListener("click", handleAddSubtask);
  document.getElementById("newSubtaskInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSubtask();
    }
  });

  // Search & Filters
  document.getElementById("taskSearch").addEventListener("input", renderBoard);
  document.getElementById("filterPriority").addEventListener("change", renderBoard);
  document.getElementById("filterTag").addEventListener("change", renderBoard);
  document.getElementById("filterAssignee").addEventListener("change", renderBoard);

  // Views Toggle
  const btnBoard = document.getElementById("btnViewBoard");
  const btnAnalytics = document.getElementById("btnViewAnalytics");
  const boardView = document.getElementById("boardView");
  const analyticsView = document.getElementById("analyticsView");

  btnBoard.addEventListener("click", () => {
    btnBoard.classList.add("active");
    btnAnalytics.classList.remove("active");
    boardView.style.display = "block";
    analyticsView.style.display = "none";
  });

  btnAnalytics.addEventListener("click", () => {
    btnAnalytics.classList.add("active");
    btnBoard.classList.remove("active");
    boardView.style.display = "none";
    analyticsView.style.display = "block";
    drawBurndownChart();
    drawDistributionChart();
  });

  // Export JSON
  document.getElementById("btnExport").addEventListener("click", () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `nexusflow_tasks_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchor.click();
    showToast("Sprint board state exported to JSON");
  });

  // Reset Demo
  document.getElementById("btnResetDemo").addEventListener("click", () => {
    if (confirm("Reset board back to default high-productivity demo tasks?")) {
      tasks = [...INITIAL_TASKS];
      saveTasks();
      renderBoard();
      updateQuickStats();
      showToast("Board reset to initial demo tasks");
    }
  });

  // Theme Toggle
  const themeBtn = document.getElementById("themeToggle");
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("theme-light");
    const isLight = document.body.classList.contains("theme-light");
    themeBtn.querySelector(".theme-icon").textContent = isLight ? "☀️" : "🌙";
    if (analyticsView.style.display === "block") {
      drawBurndownChart();
      drawDistributionChart();
    }
  });

  // Keyboard Shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== document.getElementById("taskSearch") && !document.getElementById("taskModal").classList.contains("open")) {
      e.preventDefault();
      document.getElementById("taskSearch").focus();
    }
    if ((e.key === "n" || e.key === "N") && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA" && !document.getElementById("taskModal").classList.contains("open")) {
      e.preventDefault();
      openTaskModal();
    }
    if (e.key === "Escape") {
      closeTaskModal();
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
