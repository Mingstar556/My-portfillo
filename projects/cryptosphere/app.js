// =====================================================
//  CRYPTOSPHERE — MARKET ENGINE & PORTFOLIO ENGINE
// =====================================================

const TOKENS = [
  { id: "btc", symbol: "BTC", name: "Bitcoin", icon: "₿", price: 64850.00, change: 3.42, high: 65400, low: 62900, vol: "28.4B", mcap: "1,278B", color: "#f5c518" },
  { id: "eth", symbol: "ETH", name: "Ethereum", icon: "Ξ", price: 3480.50, change: 2.15, high: 3540, low: 3380, vol: "14.2B", mcap: "418B", color: "#8b5cf6" },
  { id: "sol", symbol: "SOL", name: "Solana", icon: "◎", price: 154.20, change: -1.24, high: 159, low: 148, vol: "4.8B", mcap: "71B", color: "#06b6d4" },
  { id: "ada", symbol: "ADA", name: "Cardano", icon: "₳", price: 0.485, change: 4.10, high: 0.50, low: 0.46, vol: "640M", mcap: "17.2B", color: "#3b82f6" },
  { id: "dot", symbol: "DOT", name: "Polkadot", icon: "●", price: 6.82, change: -0.85, high: 7.10, low: 6.70, vol: "220M", mcap: "9.8B", color: "#ec4899" },
  { id: "avax", symbol: "AVAX", name: "Avalanche", icon: "▲", price: 32.40, change: 5.60, high: 33.50, low: 30.20, vol: "510M", mcap: "12.8B", color: "#ef4444" },
  { id: "link", symbol: "LINK", name: "Chainlink", icon: "⬡", price: 16.75, change: 1.45, high: 17.20, low: 16.10, vol: "380M", mcap: "10.1B", color: "#2563eb" },
  { id: "xrp", symbol: "XRP", name: "Ripple", icon: "✕", price: 0.592, change: -0.42, high: 0.61, low: 0.58, vol: "890M", mcap: "33.2B", color: "#10b981" }
];

let activeToken = TOKENS[0];
let activeTimeframe = "24H";
let showSMA = true;

// Default Portfolio Holdings
let portfolioHoldings = JSON.parse(localStorage.getItem("cryptosphere_portfolio") || "null") || [
  { symbol: "BTC", qty: 0.35, buyPrice: 56000 },
  { symbol: "ETH", qty: 3.2, buyPrice: 2900 },
  { symbol: "SOL", qty: 28, buyPrice: 130 }
];

// Price history points buffer for the chart
let priceHistory = [];

document.addEventListener("DOMContentLoaded", () => {
  initMarquee();
  generatePriceHistory();
  renderChart();
  renderTable();
  updatePortfolioUI();
  setupEventListeners();
  startLivePriceTickerSimulation();
});

// --- MARQUEE ---
function initMarquee() {
  const stream = document.getElementById("marqueeStream");
  const html = TOKENS.map(t => {
    const isUp = t.change >= 0;
    const sign = isUp ? "+" : "";
    const cls = isUp ? "text-green" : "text-red";
    return `
      <div class="ticker-item">
        <span class="ticker-sym">${t.symbol}</span>
        <span class="ticker-price">$${formatNumber(t.price)}</span>
        <span class="${cls}">(${sign}${t.change}%)</span>
      </div>
    `;
  }).join("");

  // duplicate for continuous seamless scroll
  stream.innerHTML = html + html;
}

// --- CHART GENERATION & CANVAS RENDERING ---
function generatePriceHistory() {
  const points = activeTimeframe === "24H" ? 48 : activeTimeframe === "7D" ? 56 : activeTimeframe === "1M" ? 60 : 72;
  const basePrice = activeToken.price;
  const volatility = activeTimeframe === "24H" ? 0.015 : activeTimeframe === "7D" ? 0.05 : 0.12;

  let current = basePrice * (1 - (activeToken.change / 100));
  priceHistory = [];

  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.48) * volatility * current;
    current += change;
    priceHistory.push(current);
  }
  priceHistory[priceHistory.length - 1] = basePrice;
}

function renderChart() {
  const canvas = document.getElementById("cryptoPriceCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  if (!priceHistory.length) return;

  const min = Math.min(...priceHistory) * 0.995;
  const max = Math.max(...priceHistory) * 1.005;

  const padLeft = 20;
  const padRight = 60;
  const padTop = 20;
  const padBottom = 30;
  const chartW = W - padLeft - padRight;
  const chartH = H - padTop - padBottom;

  // Grid Lines
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    const y = padTop + (chartH / 3) * i;
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(W - padRight, y);
    ctx.stroke();

    const priceAtY = max - ((y - padTop) / chartH) * (max - min);
    ctx.fillStyle = "#64748b";
    ctx.font = "10px JetBrains Mono";
    ctx.textAlign = "left";
    ctx.fillText(`$${formatNumber(priceAtY)}`, W - padRight + 6, y + 3);
  }

  // Draw Area Gradient
  const grad = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
  grad.addColorStop(0, activeToken.color + "44");
  grad.addColorStop(1, activeToken.color + "00");

  const step = chartW / (priceHistory.length - 1);

  ctx.beginPath();
  priceHistory.forEach((p, i) => {
    const x = padLeft + i * step;
    const y = padTop + chartH - ((p - min) / (max - min)) * chartH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(padLeft + chartW, padTop + chartH);
  ctx.lineTo(padLeft, padTop + chartH);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Draw Main Price Line
  ctx.beginPath();
  priceHistory.forEach((p, i) => {
    const x = padLeft + i * step;
    const y = padTop + chartH - ((p - min) / (max - min)) * chartH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = activeToken.color;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Draw SMA(20) if enabled
  if (showSMA && priceHistory.length >= 20) {
    ctx.beginPath();
    for (let i = 19; i < priceHistory.length; i++) {
      const slice = priceHistory.slice(i - 19, i + 1);
      const sma = slice.reduce((a, b) => a + b, 0) / 20;
      const x = padLeft + i * step;
      const y = padTop + chartH - ((sma - min) / (max - min)) * chartH;
      if (i === 19) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "#06b6d4";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

// --- PORTFOLIO ENGINE & DONUT CANVAS ---
function updatePortfolioUI() {
  let totalUsd = 0;
  let totalCost = 0;

  const allocation = {};

  portfolioHoldings.forEach(h => {
    const token = TOKENS.find(t => t.symbol === h.symbol);
    const price = token ? token.price : h.buyPrice;
    const val = h.qty * price;
    totalUsd += val;
    totalCost += h.qty * h.buyPrice;
    allocation[h.symbol] = (allocation[h.symbol] || 0) + val;
  });

  const pnlUsd = totalUsd - totalCost;
  const pnlPct = totalCost > 0 ? (pnlUsd / totalCost) * 100 : 0;
  const isUp = pnlUsd >= 0;

  document.getElementById("portfolioTotal").textContent = `$${formatNumber(totalUsd)}`;
  const pnlEl = document.getElementById("portfolioPnL");
  pnlEl.textContent = `${isUp ? "+" : ""}$${formatNumber(pnlUsd)} (${isUp ? "+" : ""}${pnlPct.toFixed(2)}%)`;
  pnlEl.className = `pnl-val ${isUp ? "text-green" : "text-red"}`;

  renderDonutChart(allocation, totalUsd);
  updateConverter();
}

function renderDonutChart(allocation, totalUsd) {
  const canvas = document.getElementById("allocationCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  const legend = document.getElementById("donutLegend");
  legend.innerHTML = "";

  const keys = Object.keys(allocation);
  if (!keys.length || totalUsd === 0) return;

  const centerX = W / 2;
  const centerY = H / 2;
  const radius = 60;
  const innerRadius = 38;

  let startAngle = -Math.PI / 2;

  keys.forEach(sym => {
    const token = TOKENS.find(t => t.symbol === sym);
    const color = token ? token.color : "#94a3b8";
    const val = allocation[sym];
    const pct = ((val / totalUsd) * 100).toFixed(1);
    const sliceAngle = (val / totalUsd) * Math.PI * 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
    ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    startAngle += sliceAngle;

    // Legend item
    const row = document.createElement("div");
    row.className = "legend-entry";
    row.innerHTML = `
      <div class="legend-left">
        <span class="legend-dot" style="background:${color}"></span>
        <span>${sym}</span>
      </div>
      <span class="legend-pct">${pct}%</span>
    `;
    legend.appendChild(row);
  });
}

// --- CONVERTER ---
function updateConverter() {
  const amount = parseFloat(document.getElementById("calcAmount").value) || 0;
  const fromSym = document.getElementById("calcFrom").value;
  const toFiat = document.getElementById("calcToFiat").value;

  const token = TOKENS.find(t => t.symbol === fromSym);
  const price = token ? token.price : 1;
  const totalInUsd = amount * price;

  let converted = totalInUsd;
  let symbol = "$";
  if (toFiat === "EUR") { converted = totalInUsd * 0.92; symbol = "€"; }
  else if (toFiat === "KHR") { converted = totalInUsd * 4100; symbol = "៛"; }

  document.getElementById("calcResult").textContent = `${symbol}${formatNumber(converted)} ${toFiat}`;
}

// --- COIN TABLE ---
function renderTable() {
  const tbody = document.getElementById("marketTableBody");
  const search = document.getElementById("cryptoSearch").value.toLowerCase().trim();

  const filtered = TOKENS.filter(t => {
    if (!search) return true;
    return t.name.toLowerCase().includes(search) || t.symbol.toLowerCase().includes(search);
  });

  tbody.innerHTML = filtered.map((t, idx) => {
    const isUp = t.change >= 0;
    const sign = isUp ? "+" : "";
    const cls = isUp ? "text-green" : "text-red";
    return `
      <tr data-token-id="${t.id}">
        <td>${idx + 1}</td>
        <td>
          <div class="coin-cell">
            <span class="coin-icon">${t.icon}</span>
            <span class="coin-name">${t.name}</span>
            <span class="coin-sym">${t.symbol}</span>
          </div>
        </td>
        <td class="td-mono">$${formatNumber(t.price)}</td>
        <td class="td-mono ${cls}">${sign}${t.change}%</td>
        <td class="td-mono">$${t.vol}</td>
        <td class="td-mono">$${t.mcap}</td>
        <td>
          <button class="btn btn-outline btn-sm btn-trade" data-token-id="${t.id}">View Chart</button>
        </td>
      </tr>
    `;
  }).join("");

  tbody.querySelectorAll("tr").forEach(row => {
    row.addEventListener("click", () => {
      const id = row.dataset.tokenId;
      selectToken(id);
    });
  });
}

function selectToken(id) {
  const token = TOKENS.find(t => t.id === id);
  if (!token) return;
  activeToken = token;

  document.getElementById("activeTokenIcon").textContent = token.icon;
  document.getElementById("activeTokenName").textContent = token.name;
  document.getElementById("activeTokenSymbol").textContent = `${token.symbol}/USD`;
  document.getElementById("activeTokenPrice").textContent = `$${formatNumber(token.price)}`;

  const isUp = token.change >= 0;
  const changeEl = document.getElementById("activeTokenChange");
  changeEl.textContent = `${isUp ? "+" : ""}${token.change}%`;
  changeEl.className = `price-change-pill ${isUp ? "badge-green" : "badge-red"}`;

  document.getElementById("val24High").textContent = `$${formatNumber(token.high)}`;
  document.getElementById("val24Low").textContent = `$${formatNumber(token.low)}`;
  document.getElementById("val24Vol").textContent = `$${token.vol}`;

  generatePriceHistory();
  renderChart();
}

// --- SIMULATED LIVE TICKERS ---
function startLivePriceTickerSimulation() {
  setInterval(() => {
    const randomCoin = TOKENS[Math.floor(Math.random() * TOKENS.length)];
    const delta = (Math.random() - 0.49) * 0.003 * randomCoin.price;
    randomCoin.price = Math.max(0.01, randomCoin.price + delta);

    if (randomCoin.id === activeToken.id) {
      document.getElementById("activeTokenPrice").textContent = `$${formatNumber(randomCoin.price)}`;
    }
    updatePortfolioUI();
  }, 2000);
}

// --- UTILITIES ---
function formatNumber(num) {
  if (num >= 1000) return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (num >= 1) return num.toFixed(2);
  return num.toFixed(4);
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
  // Timeframe buttons
  document.querySelectorAll(".tf-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tf-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeTimeframe = btn.dataset.tf;
      generatePriceHistory();
      renderChart();
    });
  });

  // SMA toggle
  const btnSMA = document.getElementById("btnToggleSMA");
  btnSMA.addEventListener("click", () => {
    showSMA = !showSMA;
    btnSMA.classList.toggle("active", showSMA);
    renderChart();
  });

  // Converter inputs
  document.getElementById("calcAmount").addEventListener("input", updateConverter);
  document.getElementById("calcFrom").addEventListener("change", updateConverter);
  document.getElementById("calcToFiat").addEventListener("change", updateConverter);

  // Search input
  document.getElementById("cryptoSearch").addEventListener("input", renderTable);

  // Modal
  const modal = document.getElementById("addTxModal");
  document.getElementById("btnOpenAddTxModal").addEventListener("click", () => modal.classList.add("open"));
  document.getElementById("btnCloseModal").addEventListener("click", () => modal.classList.remove("open"));
  document.getElementById("btnCancelModal").addEventListener("click", () => modal.classList.remove("open"));

  document.getElementById("txForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const symbol = document.getElementById("txTokenSelect").value;
    const qty = parseFloat(document.getElementById("txQuantity").value) || 0;
    const buyPrice = parseFloat(document.getElementById("txBuyPrice").value) || 0;

    if (qty > 0 && buyPrice > 0) {
      portfolioHoldings.push({ symbol, qty, buyPrice });
      localStorage.setItem("cryptosphere_portfolio", JSON.stringify(portfolioHoldings));
      updatePortfolioUI();
      modal.classList.remove("open");
      document.getElementById("txForm").reset();
    }
  });
}
