// =====================================================
//  VISTABOARD — Business Analytics Dashboard
//  Vanilla JS + Canvas 2D · zero dependencies
// =====================================================

// --- Seeded RNG so the demo looks consistent per range ---
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const $ = (id) => document.getElementById(id);

// -----------------------------------------------------
//  DATA GENERATION
// -----------------------------------------------------
function genSeries(days, seed, base, variance, trend) {
  const rand = mulberry32(seed);
  const out = [];
  let v = base;
  for (let i = 0; i < days; i++) {
    v += (rand() - 0.46) * variance + trend;
    v = Math.max(base * 0.45, v);
    const weekend = (i % 7 === 5 || i % 7 === 6) ? 0.82 : 1; // dip on weekends
    out.push(Math.max(base * 0.4, v * weekend));
  }
  return out;
}

function genState(range) {
  const days = range;
  const revenue = genSeries(days, 42 + range, 3200, 900, 22);
  const expenses = genSeries(days, 7 + range, 1900, 500, 9);
  const sessions = Math.round(revenue.reduce((a, b) => a + b, 0) / 38);
  return {
    days, revenue, expenses, sessions,
    kpis: {
      revenue: revenue.reduce((a, b) => a + b, 0),
      users: Math.round(sessions * 0.31),
      conversion: 2.4 + mulberry32(range)() * 1.4,
      aov: (revenue.reduce((a, b) => a + b, 0) / Math.max(1, Math.round(sessions * 0.031))),
    },
    sources: [
      { label: "Organic Search", value: Math.round(sessions * 0.42), color: "#4f46e5" },
      { label: "Direct", value: Math.round(sessions * 0.26), color: "#7a5af8" },
      { label: "Referral", value: Math.round(sessions * 0.18), color: "#0ba5ec" },
      { label: "Social", value: Math.round(sessions * 0.14), color: "#12b76a" },
    ],
    channels: ["Online Store", "Marketplace", "Retail POS", "Wholesale"]
      .map((label, i) => ({
        label,
        now: 18000 + mulberry32(range * 10 + i)() * 26000,
        prev: 16000 + mulberry32(range * 7 + i)() * 22000,
      })),
  };
}

// -----------------------------------------------------
//  FORMAT HELPERS
// -----------------------------------------------------
const fmtMoney = (n, compact) =>
  compact && n >= 1000
    ? "$" + (n / 1000).toFixed(n >= 100000 ? 0 : 1) + "K"
    : "$" + Math.round(n).toLocaleString("en-US");
const fmtNum = (n) => Math.round(n).toLocaleString("en-US");

// -----------------------------------------------------
//  KPI CARDS
// -----------------------------------------------------
const KPI_DEFS = [
  { key: "revenue", label: "Total Revenue", fmt: (v) => fmtMoney(v, true) },
  { key: "users", label: "Active Users", fmt: (v) => fmtNum(v) },
  { key: "conversion", label: "Conversion Rate", fmt: (v) => v.toFixed(2) + "%" },
  { key: "aov", label: "Avg. Order Value", fmt: (v) => fmtMoney(v) },
];

function renderKpis(state) {
  const grid = $("kpiGrid");
  grid.innerHTML = "";
  KPI_DEFS.forEach((def, i) => {
    const delta = (mulberry32(def.key.length * 31 + state.days)() * 14 - 4);
    const up = delta >= 0;
    const card = document.createElement("div");
    card.className = "kpi-card";
    card.innerHTML = `
      <div class="kpi-top">
        <span class="kpi-label">${def.label}</span>
        <span class="kpi-delta ${up ? "up" : "down"}">${up ? "▲" : "▼"} ${Math.abs(delta).toFixed(1)}%</span>
      </div>
      <span class="kpi-value">${def.fmt(state.kpis[def.key])}</span>
      <canvas class="kpi-spark" width="240" height="42"></canvas>
    `;
    grid.appendChild(card);
    drawSpark(card.querySelector(".kpi-spark"), genSeries(24, i * 13 + state.days, 50, 26, 1.2), up ? "#12b76a" : "#f04438");
  });
}

function drawSpark(canvas, data, color) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  const min = Math.min(...data), max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * (w - 4) + 2,
    h - 4 - ((v - min) / span) * (h - 10),
  ]);
  ctx.clearRect(0, 0, w, h);
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, color + "33");
  grad.addColorStop(1, color + "00");
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  pts.forEach((p) => ctx.lineTo(p[0], p[1]));
  ctx.lineTo(pts[pts.length - 1][0], h);
  ctx.lineTo(pts[0][0], h);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.beginPath();
  pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.stroke();
}

// -----------------------------------------------------
//  REVENUE AREA CHART (animated, hover tooltip)
// -----------------------------------------------------
const chart = { canvas: $("revenueChart"), hover: -1, progress: 0, state: null, raf: null };

function sizeChartCanvas() {
  const c = chart.canvas;
  const dpr = window.devicePixelRatio || 1;
  const rect = c.parentElement.getBoundingClientRect();
  c.width = Math.max(320, rect.width) * dpr;
  c.height = 300 * dpr;
  c.style.height = "100%";
  chart.ctx = c.getContext("2d");
  chart.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  chart.W = Math.max(320, rect.width);
  chart.H = 300;
}

function drawRevenueChart() {
  const { ctx, W, H, state, progress } = chart;
  if (!ctx || !state) return;
  ctx.clearRect(0, 0, W, H);

  const padL = 46, padR = 14, padT = 14, padB = 26;
  const iw = W - padL - padR, ih = H - padT - padB;
  const rev = state.revenue, exp = state.expenses;
  const all = rev.concat(exp);
  const max = Math.max(...all) * 1.12;
  const min = Math.min(...all) * 0.85;
  const span = max - min || 1;
  const n = rev.length;

  const xAt = (i) => padL + (i / (n - 1)) * iw;
  const yAt = (v) => padT + ih - ((v - min) / span) * ih;

  // grid + y labels
  ctx.font = "10px 'JetBrains Mono', monospace";
  ctx.fillStyle = "#98a2b3";
  ctx.strokeStyle = "#eef1f7";
  ctx.lineWidth = 1;
  for (let g = 0; g <= 4; g++) {
    const y = padT + (ih / 4) * g;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(W - padR, y);
    ctx.stroke();
    ctx.fillText(fmtMoney(max - (span / 4) * g, true), 4, y + 3);
  }

  // x labels (first, middle, last)
  ctx.fillStyle = "#98a2b3";
  const lbl = (i) => `D${i + 1}`;
  ctx.textAlign = "center";
  [0, Math.floor((n - 1) / 2), n - 1].forEach((i) => ctx.fillText(lbl(i), xAt(i), H - 8));
  ctx.textAlign = "left";

  const visible = Math.max(2, Math.floor(n * progress));
  const drawLine = (arr, stroke, fillTop, fillBottom) => {
    ctx.beginPath();
    for (let i = 0; i < visible; i++) {
      const x = xAt(i), y = yAt(arr[i]);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    if (fillTop) {
      const grad = ctx.createLinearGradient(0, padT, 0, padT + ih);
      grad.addColorStop(0, fillTop);
      grad.addColorStop(1, fillBottom);
      ctx.save();
      ctx.lineTo(xAt(visible - 1), padT + ih);
      ctx.lineTo(xAt(0), padT + ih);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
      ctx.beginPath();
      for (let i = 0; i < visible; i++) {
        const x = xAt(i), y = yAt(arr[i]);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
    }
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2.4;
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  drawLine(exp, "#f04438", "rgba(240,68,56,0.10)", "rgba(240,68,56,0)");
  drawLine(rev, "#4f46e5", "rgba(79,70,229,0.22)", "rgba(79,70,229,0)");

  // hover crosshair + point
  if (chart.hover >= 0 && chart.hover < visible) {
    const x = xAt(chart.hover), y = yAt(rev[chart.hover]);
    ctx.strokeStyle = "#c7cdd9";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(x, padT);
    ctx.lineTo(x, padT + ih);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(x, y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = "#4f46e5";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function animateChart() {
  cancelAnimationFrame(chart.raf);
  chart.progress = 0;
  const start = performance.now();
  const dur = 750;
  const tick = (t) => {
    chart.progress = Math.min(1, (t - start) / dur);
    chart.progress = 1 - Math.pow(1 - chart.progress, 3); // ease-out cubic
    drawRevenueChart();
    if (chart.progress < 1) chart.raf = requestAnimationFrame(tick);
  };
  chart.raf = requestAnimationFrame(tick);
}

function bindChartHover() {
  const wrap = chart.canvas.parentElement;
  const tooltip = $("chartTooltip");
  wrap.addEventListener("mousemove", (e) => {
    if (!chart.state) return;
    const rect = wrap.getBoundingClientRect();
    const padL = 46, padR = 14;
    const iw = chart.W - padL - padR;
    const rel = (e.clientX - rect.left - padL) / iw;
    const idx = Math.round(rel * (chart.state.revenue.length - 1));
    if (idx < 0 || idx >= chart.state.revenue.length) { tooltip.style.opacity = 0; return; }
    chart.hover = idx;
    drawRevenueChart();
    tooltip.style.opacity = 1;
    tooltip.style.left = (padL + (idx / (chart.state.revenue.length - 1)) * iw) + "px";
    tooltip.style.top = (14 + 260 - ((chart.state.revenue[idx] - Math.min(...chart.state.revenue) * 0.85) /
      ((Math.max(...chart.state.revenue.concat(chart.state.expenses)) * 1.12 - Math.min(...chart.state.revenue) * 0.85) || 1)) * 260) + "px";
    tooltip.innerHTML = `Day ${idx + 1} · <strong>${fmtMoney(chart.state.revenue[idx])}</strong>`;
  });
  wrap.addEventListener("mouseleave", () => {
    chart.hover = -1;
    tooltip.style.opacity = 0;
    drawRevenueChart();
  });
}

// -----------------------------------------------------
//  TRAFFIC DONUT
// -----------------------------------------------------
function drawDonut(state) {
  const canvas = $("trafficDonut");
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const size = 220;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, size, size);
  const cx = size / 2, cy = size / 2, r = size / 2 - 12, band = 24;
  const total = state.sources.reduce((a, s) => a + s.value, 0);
  let start = -Math.PI / 2;
  state.sources.forEach((s) => {
    const sweep = (s.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, start, start + sweep);
    ctx.strokeStyle = s.color;
    ctx.lineWidth = band;
    ctx.lineCap = "butt";
    ctx.stroke();
    start += sweep;
  });
  $("donutTotal").textContent = fmtNum(total);

  const legend = $("donutLegend");
  legend.innerHTML = "";
  state.sources.forEach((s) => {
    const li = document.createElement("li");
    li.innerHTML = `<i style="background:${s.color}"></i>${s.label}<b>${fmtNum(s.value)} · ${Math.round((s.value / total) * 100)}%</b>`;
    legend.appendChild(li);
  });
}

// -----------------------------------------------------
//  CHANNEL BARS
// -----------------------------------------------------
function drawBars(state) {
  const canvas = $("channelBars");
  const wrap = canvas.parentElement;
  const dpr = window.devicePixelRatio || 1;
  const W = wrap.clientWidth, H = 240;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  const padB = 26, padT = 10;
  const ih = H - padB - padT;
  const max = Math.max(...state.channels.flatMap((c) => [c.now, c.prev])) * 1.1;
  const groupW = W / state.channels.length;
  const barW = Math.min(22, groupW / 3.4);

  state.channels.forEach((c, i) => {
    const cx = groupW * i + groupW / 2;
    const hNow = (c.now / max) * ih;
    const hPrev = (c.prev / max) * ih;
    // previous period (ghost)
    ctx.fillStyle = "#e3e7f2";
    roundRect(ctx, cx - barW - 3, padT + ih - hPrev, barW, hPrev, 5);
    ctx.fill();
    // current period
    const grad = ctx.createLinearGradient(0, padT + ih - hNow, 0, padT + ih);
    grad.addColorStop(0, "#6d64f0");
    grad.addColorStop(1, "#4f46e5");
    ctx.fillStyle = grad;
    roundRect(ctx, cx + 3, padT + ih - hNow, barW, hNow, 5);
    ctx.fill();
    // label
    ctx.fillStyle = "#475467";
    ctx.font = "600 10px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "center";
    const words = c.label.split(" ");
    if (c.label.length > 12) {
      ctx.fillText(words[0], cx, H - 14);
      ctx.fillText(words.slice(1).join(" "), cx, H - 3);
    } else {
      ctx.fillText(c.label, cx, H - 8);
    }
    ctx.textAlign = "left";
  });
}

function roundRect(ctx, x, y, w, h, r) {
  r = Math.min(r, h / 2, w / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// -----------------------------------------------------
//  ORDERS TABLE
// -----------------------------------------------------
const CUSTOMERS = ["Sokha Chen", "David Lim", "Nary Pen", "James Carter", "Malis Uy", "Anna Schmidt", "Rithy Vong", "Lina Wu", "Tom Becker", "Dara Kong"];
const PRODUCTS = ["Analytics Pro License", "Cloud Plan — Team", "Design System Kit", "API Credits Pack", "Onboarding Service", "Data Connector Add-on"];
const STATUSES = [
  { name: "Paid", cls: "status-paid" },
  { name: "Pending", cls: "status-pending" },
  { name: "Refunded", cls: "status-refunded" },
];
const AVATAR_COLORS = ["#4f46e5", "#0ba5ec", "#12b76a", "#f79009", "#7a5af8", "#f04438"];

function renderOrders() {
  const rand = mulberry32(Date.now() % 100000);
  const body = $("ordersBody");
  body.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const name = CUSTOMERS[Math.floor(rand() * CUSTOMERS.length)];
    const product = PRODUCTS[Math.floor(rand() * PRODUCTS.length)];
    const status = STATUSES[rand() > 0.22 ? 0 : (rand() > 0.5 ? 1 : 2)];
    const amount = 49 + Math.round(rand() * 940);
    const daysAgo = Math.floor(rand() * 14);
    const initials = name.split(" ").map((p) => p[0]).join("");
    const color = AVATAR_COLORS[Math.floor(rand() * AVATAR_COLORS.length)];
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="order-customer"><span class="order-avatar" style="background:${color}">${initials}</span>${name}</span></td>
      <td>${product}</td>
      <td>${daysAgo === 0 ? "Today" : daysAgo + "d ago"}</td>
      <td class="order-amt">$${amount.toLocaleString("en-US")}</td>
      <td><span class="status-chip ${status.cls}">${status.name}</span></td>
    `;
    body.appendChild(tr);
  }
}

// -----------------------------------------------------
//  ORCHESTRATION
// -----------------------------------------------------
let currentRange = 30;

function refresh(range) {
  currentRange = range;
  const state = genState(range);
  chart.state = state;
  chart.hover = -1;

  renderKpis(state);
  drawDonut(state);
  drawBars(state);
  sizeChartCanvas();
  animateChart();
  renderOrders();

  const d = new Date();
  $("topbarDate").textContent =
    `Showing last ${range} days · updated ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;

  // monthly goal progress
  const goal = Math.min(97, Math.round((state.kpis.revenue / 150000) * 100));
  setTimeout(() => {
    $("goalFill").style.width = goal + "%";
    $("goalValue").textContent = fmtMoney(Math.min(state.kpis.revenue, 150000), true);
  }, 250);
}

// Range switcher
document.querySelectorAll(".range-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".range-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    refresh(parseInt(btn.dataset.range, 10));
  });
});

// Sidebar (mobile)
const sidebar = $("sidebar");
const scrim = $("sidebarScrim");
$("menuBtn").addEventListener("click", () => {
  sidebar.classList.toggle("open");
  scrim.classList.toggle("show", sidebar.classList.contains("open"));
});
scrim.addEventListener("click", () => {
  sidebar.classList.remove("open");
  scrim.classList.remove("show");
});
document.querySelectorAll("[data-nav]").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll("[data-nav]").forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
    if (window.innerWidth <= 900) {
      sidebar.classList.remove("open");
      scrim.classList.remove("show");
    }
  });
});

$("refreshOrders").addEventListener("click", renderOrders);

let resizeTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    sizeChartCanvas();
    drawRevenueChart();
    drawBars(chart.state);
  }, 150);
});

refresh(currentRange);
bindChartHover();
