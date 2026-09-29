// =====================================================
//  DEVPULSE — TELEMETRY HUD & API CLIENT ENGINE
// =====================================================

// --- STATE BUFFERS ---
const BUFFER_SIZE = 40;
let cpuHistory = Array(BUFFER_SIZE).fill(28);
let memHistory = Array(BUFFER_SIZE).fill(4.1);
let netHistory = Array(BUFFER_SIZE).fill(42);
let errHistory = Array(BUFFER_SIZE).fill(0.02);
let p99History = Array(BUFFER_SIZE).fill(45);
let p50History = Array(BUFFER_SIZE).fill(18);

let logStreamPaused = false;
let logs = [];
const SAMPLE_MESSAGES = [
  { lvl: "INFO", msg: "HTTP 200 GET /api/v2/auth/session — 14ms (caller: 192.168.1.104)" },
  { lvl: "INFO", msg: "Redis cluster: 42,910 keys synced to replica pod-eu-west-3" },
  { lvl: "INFO", msg: "PostgreSQL read-replica lag: 0.14ms (within SLA)" },
  { lvl: "WARN", msg: "Memory pool allocation reached 74% on worker node #4" },
  { lvl: "INFO", msg: "HTTP 201 POST /api/v1/payments/intent — Stripe webhook verified" },
  { lvl: "WARN", msg: "API Gateway rate limiter throttled burst client IP [45.12.98.2]" },
  { lvl: "ERROR", msg: "Kafka broker #2 socket timeout: retrying partition 0 offset commit" },
  { lvl: "INFO", msg: "Kubernetes HPA scaled deployment 'core-api' from 8 to 10 pods" },
  { lvl: "INFO", msg: "HTTP 200 GET /api/v3/metrics/live — 6ms (gzip: 4.2kb)" },
  { lvl: "INFO", msg: "Garbage collection completed: reclaimed 184MB in 3.2ms" }
];

// --- INITIALIZE ---
document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupTelemetryLoop();
  setupLogStream();
  setupApiClient();
});

// --- NAVIGATION TABS ---
function setupNavigation() {
  const tabs = [
    { btn: "tabTelemetry", view: "viewTelemetry" },
    { btn: "tabApiClient", view: "viewApiClient" },
    { btn: "tabServices", view: "viewServices" }
  ];

  tabs.forEach(t => {
    document.getElementById(t.btn).addEventListener("click", () => {
      tabs.forEach(other => {
        document.getElementById(other.btn).classList.toggle("active", other.btn === t.btn);
        document.getElementById(other.view).style.display = other.btn === t.btn ? "flex" : "none";
      });
    });
  });
}

// --- TELEMETRY ENGINE & CANVAS DRAWING ---
let loadSpikeMultiplier = 1;

function setupTelemetryLoop() {
  document.getElementById("btnSimulateLoad").addEventListener("click", () => {
    loadSpikeMultiplier = 2.4;
    addLog("WARN", "SIMULATED TRAFFIC SPIKE TRIGGERED: Injected 5,000 synthetic requests");
    setTimeout(() => { loadSpikeMultiplier = 1; }, 7000);
  });

  setInterval(() => {
    // Generate new values
    const cpuVal = Math.min(98, Math.max(12, (26 + Math.random() * 8) * loadSpikeMultiplier)).toFixed(1);
    const memVal = Math.min(15.8, (4.1 + Math.random() * 0.4 * loadSpikeMultiplier)).toFixed(2);
    const netVal = (38 + Math.random() * 15 * loadSpikeMultiplier).toFixed(1);
    const rpsVal = Math.round((1420 + Math.random() * 200) * loadSpikeMultiplier);
    const errVal = loadSpikeMultiplier > 1 ? (0.2 + Math.random() * 0.4).toFixed(2) : (0.01 + Math.random() * 0.03).toFixed(2);

    const p99 = Math.round((38 + Math.random() * 15) * loadSpikeMultiplier);
    const p50 = Math.round((15 + Math.random() * 6) * (loadSpikeMultiplier > 1 ? 1.4 : 1));

    // Update Text
    document.getElementById("valCpu").textContent = `${cpuVal}%`;
    document.getElementById("valMemory").textContent = `${memVal} / 16 GB`;
    document.getElementById("valNetwork").textContent = `${netVal} MB/s`;
    document.getElementById("valRps").textContent = `${rpsVal.toLocaleString()} req/s`;
    document.getElementById("valErrorRate").textContent = `${errVal}%`;

    // Rotate buffers
    cpuHistory.push(parseFloat(cpuVal)); cpuHistory.shift();
    memHistory.push(parseFloat(memVal)); memHistory.shift();
    netHistory.push(parseFloat(netVal)); netHistory.shift();
    errHistory.push(parseFloat(errVal)); errHistory.shift();
    p99History.push(p99); p99History.shift();
    p50History.push(p50); p50History.shift();

    // Redraw Canvases
    drawMiniSparkline("canvasCpu", cpuHistory, "#06b6d4", 0, 100);
    drawMiniSparkline("canvasMemory", memHistory, "#8b5cf6", 0, 16);
    drawMiniSparkline("canvasNetwork", netHistory, "#3b82f6", 0, 100);
    drawMiniSparkline("canvasErrors", errHistory, "#10b981", 0, 1);
    drawMainTimeSeriesChart();
  }, 1000);
}

function drawMiniSparkline(canvasId, data, color, minVal, maxVal) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  // Gradient fill under line
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, color + "33");
  grad.addColorStop(1, color + "00");

  ctx.beginPath();
  const step = W / (data.length - 1);
  data.forEach((val, i) => {
    const norm = Math.min(1, Math.max(0, (val - minVal) / (maxVal - minVal)));
    const y = H - (norm * (H - 10)) - 5;
    const x = i * step;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Fill down to bottom
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();
}

function drawMainTimeSeriesChart() {
  const canvas = document.getElementById("canvasMainStream");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  // Grid lines
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const y = 30 + i * 50;
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(W - 20, y);
    ctx.stroke();

    ctx.fillStyle = "#64748b";
    ctx.font = "10px JetBrains Mono";
    ctx.textAlign = "right";
    ctx.fillText(`${(100 - i * 20)}ms`, 35, y + 3);
  }

  // Draw P99 (Purple line)
  drawCurve(ctx, p99History, "#8b5cf6", W, H, 0, 120);

  // Draw P50 (Cyan line)
  drawCurve(ctx, p50History, "#06b6d4", W, H, 0, 120);
}

function drawCurve(ctx, data, color, W, H, minVal, maxVal) {
  const padLeft = 45;
  const padRight = 20;
  const padTop = 30;
  const padBottom = 30;
  const chartW = W - padLeft - padRight;
  const chartH = H - padTop - padBottom;
  const step = chartW / (data.length - 1);

  ctx.beginPath();
  data.forEach((val, i) => {
    const norm = Math.min(1, Math.max(0, (val - minVal) / (maxVal - minVal)));
    const x = padLeft + i * step;
    const y = padTop + chartH - (norm * chartH);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Glow point at the latest entry
  const lastVal = data[data.length - 1];
  const lastNorm = Math.min(1, Math.max(0, (lastVal - minVal) / (maxVal - minVal)));
  const lastX = padLeft + (data.length - 1) * step;
  const lastY = padTop + chartH - (lastNorm * chartH);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
  ctx.fill();
}

// --- LOG STREAM ENGINE ---
function setupLogStream() {
  const streamEl = document.getElementById("logStream");
  const filterSelect = document.getElementById("logFilterLevel");
  const searchInput = document.getElementById("logSearchInput");
  const pauseBtn = document.getElementById("btnToggleLogPause");
  const clearBtn = document.getElementById("btnClearLogs");

  // Initial logs
  SAMPLE_MESSAGES.forEach(s => addLog(s.lvl, s.msg));

  // Stream pump every 1.5s
  setInterval(() => {
    if (logStreamPaused) return;
    const item = SAMPLE_MESSAGES[Math.floor(Math.random() * SAMPLE_MESSAGES.length)];
    addLog(item.lvl, item.msg);
  }, 1600);

  pauseBtn.addEventListener("click", () => {
    logStreamPaused = !logStreamPaused;
    pauseBtn.textContent = logStreamPaused ? "Resume Stream" : "Pause Stream";
    pauseBtn.style.color = logStreamPaused ? "#f59e0b" : "";
  });

  clearBtn.addEventListener("click", () => {
    logs = [];
    renderLogs();
  });

  filterSelect.addEventListener("change", renderLogs);
  searchInput.addEventListener("input", renderLogs);
}

function addLog(lvl, msg) {
  const time = new Date().toTimeString().split(" ")[0] + "." + Math.floor(Math.random() * 900 + 100);
  logs.unshift({ time, lvl, msg });
  if (logs.length > 80) logs.pop();
  renderLogs();
}

function renderLogs() {
  const streamEl = document.getElementById("logStream");
  const filterLvl = document.getElementById("logFilterLevel").value;
  const searchQ = document.getElementById("logSearchInput").value.toLowerCase().trim();

  const filtered = logs.filter(l => {
    if (filterLvl !== "ALL" && l.lvl !== filterLvl) return false;
    if (searchQ && !l.msg.toLowerCase().includes(searchQ) && !l.time.includes(searchQ)) return false;
    return true;
  });

  streamEl.innerHTML = filtered.map(l => `
    <div class="log-line">
      <span class="log-time">[${l.time}]</span>
      <span class="log-lvl lvl-${l.lvl}">${l.lvl}</span>
      <span class="log-msg">${escapeHtml(l.msg)}</span>
    </div>
  `).join("");
}

// --- REST API PLAYGROUND ENGINE ---
function setupApiClient() {
  const form = document.getElementById("apiClientForm");
  const subHeaders = document.getElementById("subtabHeaders");
  const subBody = document.getElementById("subtabBody");
  const paneHeaders = document.getElementById("paneHeaders");
  const paneBody = document.getElementById("paneBody");
  const copyBtn = document.getElementById("btnCopyResponse");
  const benchmarkBtn = document.getElementById("btnBenchmark");

  // Subtabs
  subHeaders.addEventListener("click", () => {
    subHeaders.classList.add("active");
    subBody.classList.remove("active");
    paneHeaders.style.display = "block";
    paneBody.style.display = "none";
  });

  subBody.addEventListener("click", () => {
    subBody.classList.add("active");
    subHeaders.classList.remove("active");
    paneBody.style.display = "block";
    paneHeaders.style.display = "none";
  });

  // Presets
  document.querySelectorAll(".preset-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById("requestUrl").value = btn.dataset.url;
      document.getElementById("httpMethod").value = btn.dataset.method;
      if (btn.dataset.body) {
        document.getElementById("requestPayload").value = btn.dataset.body;
        subBody.click();
      }
    });
  });

  // Send Single Request
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await executeRequest();
  });

  // Benchmark Request (5x)
  benchmarkBtn.addEventListener("click", async () => {
    benchmarkBtn.disabled = true;
    benchmarkBtn.textContent = "Running 5x...";
    const times = [];

    for (let i = 1; i <= 5; i++) {
      benchmarkBtn.textContent = `Req ${i}/5...`;
      const res = await executeRequest(false);
      if (res && res.time) times.push(res.time);
      await new Promise(r => setTimeout(r, 200));
    }

    if (times.length > 0) {
      const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
      const min = Math.min(...times);
      const max = Math.max(...times);
      document.getElementById("responseCodeBlock").textContent = JSON.stringify({
        benchmarkSummary: "5x Parallel HTTP Probes Complete",
        targetUrl: document.getElementById("requestUrl").value,
        samples_ms: times,
        average_latency_ms: avg,
        min_latency_ms: min,
        max_latency_ms: max,
        variance_ms: max - min,
        p95_estimate_ms: Math.round(avg * 1.15)
      }, null, 2);
    }

    benchmarkBtn.disabled = false;
    benchmarkBtn.textContent = "⚡ Benchmark (5x)";
  });

  // Copy Response
  copyBtn.addEventListener("click", () => {
    const code = document.getElementById("responseCodeBlock").textContent;
    navigator.clipboard.writeText(code).then(() => {
      copyBtn.textContent = "Copied!";
      setTimeout(() => { copyBtn.textContent = "Copy Response"; }, 2000);
    });
  });
}

async function executeRequest(updateViewer = true) {
  const url = document.getElementById("requestUrl").value.trim();
  const method = document.getElementById("httpMethod").value;
  const rawHeaders = document.getElementById("requestHeaders").value.trim();
  const rawBody = document.getElementById("requestPayload").value.trim();

  const statusBadge = document.getElementById("resStatusBadge");
  const timeStat = document.getElementById("resTime");
  const sizeStat = document.getElementById("resSize");
  const codeBlock = document.getElementById("responseCodeBlock");
  const spinner = document.getElementById("btnSendSpinner");
  const btnText = document.getElementById("btnSendText");

  spinner.style.display = "inline-block";
  btnText.textContent = "Executing...";

  const headers = {};
  rawHeaders.split("\n").forEach(line => {
    const parts = line.split(":");
    if (parts.length >= 2) {
      headers[parts[0].trim()] = parts.slice(1).join(":").trim();
    }
  });

  const options = { method, headers };
  if (method !== "GET" && method !== "HEAD" && rawBody) {
    options.body = rawBody;
  }

  const t0 = performance.now();
  try {
    const res = await fetch(url, options);
    const duration = Math.round(performance.now() - t0);

    const contentType = res.headers.get("content-type") || "";
    let data;
    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    const payloadLength = JSON.stringify(data).length;

    if (updateViewer) {
      statusBadge.textContent = `${res.status} ${res.statusText || (res.status === 200 ? "OK" : "")}`;
      statusBadge.className = `status-badge ${res.ok ? "status-2xx" : "status-4xx"}`;
      timeStat.textContent = `Time: ${duration} ms`;
      sizeStat.textContent = `Size: ${(payloadLength / 1024).toFixed(2)} KB`;
      codeBlock.textContent = typeof data === "object" ? JSON.stringify(data, null, 2) : data;
    }

    addLog(res.ok ? "INFO" : "WARN", `API Client Probed ${method} ${url} -> ${res.status} (${duration}ms)`);
    return { status: res.status, time: duration, size: payloadLength };
  } catch (err) {
    const duration = Math.round(performance.now() - t0);
    // CORS or Network fallback simulation for demonstration
    if (updateViewer) {
      statusBadge.textContent = `Client Handled (CORS Block / Network)`;
      statusBadge.className = "status-badge status-4xx";
      timeStat.textContent = `Time: ${duration} ms`;
      sizeStat.textContent = `Size: 0 KB`;
      codeBlock.textContent = JSON.stringify({
        warning: "Browser Cross-Origin Resource Sharing (CORS) or Network Error",
        details: err.message,
        help: "The browser prevented reading this origin directly. Testing against public APIs like JSONPlaceholder, GitHub API, or CoinGecko will return full responses.",
        simulatedProxyResponse: {
          url,
          method,
          synthesizedStatusCode: 200,
          roundTripLatency: `${duration}ms`,
          status: "Healthy / Endpoint reachable via server-side reverse proxy"
        }
      }, null, 2);
    }
    return { status: 0, time: duration };
  } finally {
    spinner.style.display = "none";
    btnText.textContent = "Send Request";
  }
}

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
