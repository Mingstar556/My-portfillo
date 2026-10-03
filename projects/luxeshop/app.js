/**
 * LUXESHOP — Client-Side E-Commerce & Operations Studio Engine
 * Compressed showcase for Mingstar Portfolio
 * High-performance vanilla JavaScript ES6+
 */

'use strict';

// =====================================================
// 1. PRODUCT CATALOG DATA (Curated 19 SKUs)
// =====================================================
const CATALOG = [
  // Electronics
  {
    id: 1,
    name: 'Wireless Noise-Cancelling Headphones',
    category: 'Electronics',
    price: 249.99,
    originalPrice: 349.99,
    stock: 45,
    rating: 4.9,
    reviews: 184,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    description: 'Premium over-ear headphones with 30-hour battery life, active hybrid noise cancellation, and studio-grade beryllium drivers.',
    tags: ['audio', 'wireless', 'bluetooth', 'noise-cancelling'],
    featured: true
  },
  {
    id: 2,
    name: '4K Ultra HD Smart TV 55"',
    category: 'Electronics',
    price: 899.99,
    originalPrice: 1199.99,
    stock: 18,
    rating: 4.8,
    reviews: 92,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600',
    description: 'Brilliant 4K OLED display with HDR10+ cinema mastering, 120Hz refresh rate, and AI smart voice navigation.',
    tags: ['tv', '4k', 'oled', 'smart'],
    featured: true
  },
  {
    id: 3,
    name: 'Mechanical Gaming Keyboard',
    category: 'Electronics',
    price: 129.99,
    originalPrice: 159.99,
    stock: 64,
    rating: 4.7,
    reviews: 142,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600',
    description: 'RGB per-key backlit mechanical keyboard with hot-swappable tactile switches, sound dampening foam, and CNC aluminum chassis.',
    tags: ['gaming', 'keyboard', 'rgb', 'mechanical'],
    featured: false
  },
  {
    id: 4,
    name: 'Portable Bluetooth Speaker',
    category: 'Electronics',
    price: 79.99,
    originalPrice: 99.99,
    stock: 110,
    rating: 4.6,
    reviews: 78,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600',
    description: 'Waterproof (IPX7) 360° omnidirectional sound speaker with 20-hour continuous playback and USB-C fast charging.',
    tags: ['speaker', 'bluetooth', 'portable', 'waterproof'],
    featured: false
  },
  {
    id: 5,
    name: 'Smartwatch Pro X',
    category: 'Electronics',
    price: 299.99,
    originalPrice: 399.99,
    stock: 52,
    rating: 4.8,
    reviews: 215,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    description: 'Advanced fitness smartwatch with real-time optical heart rate, multi-band GPS, sapphire crystal glass, and 7-day battery life.',
    tags: ['smartwatch', 'fitness', 'gps', 'health'],
    featured: true
  },
  {
    id: 6,
    name: 'Wireless Fast Charging Pad',
    category: 'Electronics',
    price: 29.99,
    originalPrice: 39.99,
    stock: 180,
    rating: 4.5,
    reviews: 63,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600',
    description: '15W fast wireless induction charger compatible with all Qi-enabled devices. Non-slip matte finish with thermal protection.',
    tags: ['charger', 'wireless', 'qi', 'accessories'],
    featured: false
  },

  // Clothing
  {
    id: 7,
    name: 'Premium Merino Wool Sweater',
    category: 'Clothing',
    price: 89.99,
    originalPrice: 119.99,
    stock: 75,
    rating: 4.9,
    reviews: 114,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600',
    description: 'Super-soft 100% Australian merino wool crewneck sweater. Naturally breathable, temperature-regulating, and machine washable.',
    tags: ['wool', 'sweater', 'winter', 'apparel'],
    featured: true
  },
  {
    id: 8,
    name: 'Classic Slim-Fit Stretch Jeans',
    category: 'Clothing',
    price: 59.99,
    originalPrice: 79.99,
    stock: 120,
    rating: 4.6,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',
    description: 'Japanese denim slim-fit jeans infused with 2% elastane for unrestricted motion and shape retention.',
    tags: ['jeans', 'denim', 'casual', 'pants'],
    featured: false
  },
  {
    id: 9,
    name: 'Running Performance Jacket',
    category: 'Clothing',
    price: 119.99,
    originalPrice: 149.99,
    stock: 40,
    rating: 4.7,
    reviews: 53,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600',
    description: 'Ultra-lightweight windproof and water-repellent shell with 360° reflective safety accents and packable storage pouch.',
    tags: ['jacket', 'running', 'sport', 'outerwear'],
    featured: false
  },
  {
    id: 10,
    name: 'Organic Cotton T-Shirt 3-Pack',
    category: 'Clothing',
    price: 39.99,
    originalPrice: 49.99,
    stock: 240,
    rating: 4.8,
    reviews: 167,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
    description: '100% GOTS-certified combed organic cotton crewneck t-shirts. Preshrunk ring-spun knit with tagless neck comfort.',
    tags: ['t-shirt', 'organic', 'cotton', 'basics'],
    featured: false
  },

  // Home & Kitchen
  {
    id: 11,
    name: 'Stainless Steel Cookware Set 10-Piece',
    category: 'Home & Kitchen',
    price: 279.99,
    originalPrice: 379.99,
    stock: 28,
    rating: 4.9,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
    description: 'Commercial-grade tri-ply stainless steel with aluminum core for even heat distribution. Induction ready and oven-safe to 500°F.',
    tags: ['cookware', 'kitchen', 'stainless', 'chef'],
    featured: true
  },
  {
    id: 12,
    name: 'Smart Air Purifier HEPA H13',
    category: 'Home & Kitchen',
    price: 189.99,
    originalPrice: 249.99,
    stock: 32,
    rating: 4.8,
    reviews: 130,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600',
    description: 'True HEPA H13 filtration capturing 99.97% of airborne allergens. Real-time air quality laser sensor with quiet whisper sleep mode.',
    tags: ['air purifier', 'hepa', 'smart home', 'clean'],
    featured: false
  },
  {
    id: 13,
    name: 'Bamboo Cutting Board 3-Piece Set',
    category: 'Home & Kitchen',
    price: 34.99,
    originalPrice: 44.99,
    stock: 145,
    rating: 4.7,
    reviews: 62,
    image: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600',
    description: 'Sustainable organic Moso bamboo boards with built-in juice drainage grooves and non-slip silicone feet.',
    tags: ['cutting board', 'bamboo', 'kitchen', 'prep'],
    featured: false
  },
  {
    id: 14,
    name: 'Pour-Over Artisan Coffee Maker Kit',
    category: 'Home & Kitchen',
    price: 64.99,
    originalPrice: 84.99,
    stock: 60,
    rating: 4.9,
    reviews: 178,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600',
    description: 'Heat-resistant borosilicate glass carafe with double-mesh stainless laser filter, precision gooseneck kettle, and bamboo collar.',
    tags: ['coffee', 'pour-over', 'kitchen', 'artisan'],
    featured: true
  },

  // Books
  {
    id: 15,
    name: 'The Art of Clean Architecture',
    category: 'Books',
    price: 34.99,
    originalPrice: 44.99,
    stock: 110,
    rating: 4.9,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
    description: 'A comprehensive guide to resilient software engineering, modular boundaries, decoupled testing, and maintainable systems.',
    tags: ['programming', 'coding', 'software', 'architecture'],
    featured: true
  },
  {
    id: 16,
    name: 'Mindful Leadership in High Growth',
    category: 'Books',
    price: 24.99,
    originalPrice: 29.99,
    stock: 85,
    rating: 4.7,
    reviews: 48,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600',
    description: 'Practical strategies for emotional resilience, empathetic executive decisions, and high-velocity team orchestration.',
    tags: ['leadership', 'business', 'management'],
    featured: false
  },
  {
    id: 17,
    name: 'The Science of Culinary Chemistry',
    category: 'Books',
    price: 42.99,
    originalPrice: 54.99,
    stock: 55,
    rating: 4.8,
    reviews: 74,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600',
    description: 'Explore the molecular gastronomy, Maillard reaction kinetics, and thermal dynamics that transform raw ingredients into masterpieces.',
    tags: ['cooking', 'science', 'food'],
    featured: false
  },

  // Sports
  {
    id: 18,
    name: 'Adjustable Dumbbell Set (5-52.5 lbs)',
    category: 'Sports',
    price: 349.99,
    originalPrice: 449.99,
    stock: 15,
    rating: 4.9,
    reviews: 140,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600',
    description: 'Quick-turn dial weight selector replacing 15 sets of traditional weights with compact molded steel plates.',
    tags: ['dumbbells', 'fitness', 'gym', 'strength'],
    featured: true
  },
  {
    id: 19,
    name: 'Eco-Grip Yoga Mat Premium 6mm',
    category: 'Sports',
    price: 45.99,
    originalPrice: 59.99,
    stock: 90,
    rating: 4.7,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600',
    description: 'Non-slip textured TPE yoga mat with laser body alignment guides and complimentary woven carrying strap.',
    tags: ['yoga', 'fitness', 'mat', 'pilates'],
    featured: false
  }
];

// Initial Demo Orders for the Operations Studio
const INITIAL_ORDERS = [
  {
    id: '#LX-88301',
    customer: 'Alice Johnson',
    items: 'Wireless Headphones (x1)',
    total: 249.99,
    status: 'delivered',
    time: '2 hours ago'
  },
  {
    id: '#LX-88302',
    customer: 'Bob Smith',
    items: 'Smartwatch Pro X (x1), Organic Tees (x1)',
    total: 339.98,
    status: 'shipped',
    time: '5 hours ago'
  },
  {
    id: '#LX-88303',
    customer: 'Carol White',
    items: 'Artisan Pour-Over Coffee Kit (x1)',
    total: 64.99,
    status: 'processing',
    time: '8 hours ago'
  },
  {
    id: '#LX-88304',
    customer: 'David Miller',
    items: 'Stainless Cookware 10-Piece (x1)',
    total: 279.99,
    status: 'delivered',
    time: 'Yesterday'
  },
  {
    id: '#LX-88305',
    customer: 'Elena Rostova',
    items: 'Adjustable Dumbbells Set (x1)',
    total: 349.99,
    status: 'pending',
    time: 'Just now'
  }
];

// =====================================================
// 2. APPLICATION STATE MANAGEMENT
// =====================================================
class StoreState {
  constructor() {
    this.products = this.loadProducts();
    this.cart = this.loadCart();
    this.orders = this.loadOrders();
    this.couponCode = localStorage.getItem('luxe_coupon') || '';
    this.discountRate = this.couponCode === 'LUXE20' ? 0.20 : 0.00;
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.sortBy = 'featured';
    this.inStockOnly = false;
    this.theme = localStorage.getItem('luxe_theme') || 'dark';
    this.mode = 'storefront';
  }

  loadProducts() {
    const saved = localStorage.getItem('luxe_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return JSON.parse(JSON.stringify(CATALOG));
  }

  saveProducts() {
    try { localStorage.setItem('luxe_products', JSON.stringify(this.products)); } catch (_) {}
  }

  loadCart() {
    const saved = localStorage.getItem('luxe_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    // Default demo cart with 1 initial item to showcase calculations immediately
    return [
      { id: 1, quantity: 1 }
    ];
  }

  saveCart() {
    try { localStorage.setItem('luxe_cart', JSON.stringify(this.cart)); } catch (_) {}
  }

  loadOrders() {
    const saved = localStorage.getItem('luxe_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return JSON.parse(JSON.stringify(INITIAL_ORDERS));
  }

  saveOrders() {
    try { localStorage.setItem('luxe_orders', JSON.stringify(this.orders)); } catch (_) {}
  }

  getProductById(id) {
    return this.products.find(p => p.id === Number(id));
  }

  addToCart(productId, qty = 1) {
    const product = this.getProductById(productId);
    if (!product || product.stock <= 0) return false;

    const existing = this.cart.find(item => item.id === Number(productId));
    if (existing) {
      existing.quantity = Math.min(product.stock, existing.quantity + qty);
    } else {
      this.cart.push({ id: Number(productId), quantity: Math.min(product.stock, qty) });
    }
    this.saveCart();
    return true;
  }

  updateCartQty(productId, delta) {
    const item = this.cart.find(i => i.id === Number(productId));
    if (!item) return;
    const product = this.getProductById(productId);

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.cart = this.cart.filter(i => i.id !== Number(productId));
    } else if (product && item.quantity > product.stock) {
      item.quantity = product.stock;
    }
    this.saveCart();
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(i => i.id !== Number(productId));
    this.saveCart();
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  applyCoupon(code) {
    const clean = code.trim().toUpperCase();
    if (clean === 'LUXE20') {
      this.couponCode = 'LUXE20';
      this.discountRate = 0.20;
      localStorage.setItem('luxe_coupon', 'LUXE20');
      return { success: true, message: 'Promo code LUXE20 applied: 20% discount!' };
    }
    return { success: false, message: 'Invalid promo code. Try LUXE20' };
  }

  removeCoupon() {
    this.couponCode = '';
    this.discountRate = 0.00;
    localStorage.removeItem('luxe_coupon');
  }

  getCartTotals() {
    let subtotal = 0;
    let itemCount = 0;

    this.cart.forEach(item => {
      const prod = this.getProductById(item.id);
      if (prod) {
        subtotal += prod.price * item.quantity;
        itemCount += item.quantity;
      }
    });

    const discount = subtotal * this.discountRate;
    const discountedSubtotal = subtotal - discount;
    const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 12.00;
    const tax = discountedSubtotal * 0.08;
    const total = discountedSubtotal + shipping + tax;

    return {
      subtotal,
      discount,
      shipping,
      tax,
      total,
      itemCount,
      freeShippingRemaining: Math.max(0, 100 - subtotal)
    };
  }

  addOrder(orderData) {
    this.orders.unshift(orderData);
    this.saveOrders();
  }

  cycleOrderStatus(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;
    const flow = {
      pending: 'processing',
      processing: 'shipped',
      shipped: 'delivered',
      delivered: 'pending'
    };
    order.status = flow[order.status] || 'processing';
    this.saveOrders();
  }

  updateStock(productId, delta) {
    const product = this.getProductById(productId);
    if (!product) return;
    product.stock = Math.max(0, product.stock + delta);
    this.saveProducts();
  }

  toggleFeatured(productId) {
    const product = this.getProductById(productId);
    if (!product) return;
    product.featured = !product.featured;
    this.saveProducts();
  }

  resetDemo() {
    localStorage.removeItem('luxe_products');
    localStorage.removeItem('luxe_cart');
    localStorage.removeItem('luxe_orders');
    localStorage.removeItem('luxe_coupon');
    this.products = JSON.parse(JSON.stringify(CATALOG));
    this.cart = [{ id: 1, quantity: 1 }];
    this.orders = JSON.parse(JSON.stringify(INITIAL_ORDERS));
    this.couponCode = '';
    this.discountRate = 0;
    this.saveProducts();
    this.saveCart();
    this.saveOrders();
  }
}

// Global App Instance
const store = new StoreState();

// =====================================================
// 3. UI CONTROLLER & EVENT WIRING
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initViewSwitcher();
  initStorefront();
  initCartDrawer();
  initQuickView();
  initCheckout();
  initAdminStudio();
  updateAllBadges();
});

// Toast Notifications Helper
function showToast(text, icon = '🛍️') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(text)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

// Theme Manager
function initTheme() {
  const btn = document.getElementById('themeToggleBtn');
  applyTheme(store.theme);

  if (btn) {
    btn.addEventListener('click', () => {
      store.theme = store.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('luxe_theme', store.theme);
      applyTheme(store.theme);
      showToast(`Switched to ${store.theme} theme`, store.theme === 'dark' ? '🌙' : '☀️');
    });
  }
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.remove('theme-dark');
    document.body.classList.add('theme-light');
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.body.classList.remove('theme-light');
    document.body.classList.add('theme-dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

// Storefront vs Admin Studio View Switcher
function initViewSwitcher() {
  const tabStorefront = document.getElementById('tabStorefront');
  const tabAdmin = document.getElementById('tabAdmin');
  const viewStorefront = document.getElementById('viewStorefront');
  const viewAdmin = document.getElementById('viewAdmin');

  function setMode(mode) {
    store.mode = mode;
    const isStore = mode === 'storefront';

    tabStorefront.classList.toggle('active', isStore);
    tabStorefront.setAttribute('aria-selected', String(isStore));
    tabAdmin.classList.toggle('active', !isStore);
    tabAdmin.setAttribute('aria-selected', String(!isStore));

    viewStorefront.hidden = !isStore;
    viewAdmin.hidden = isStore;

    if (!isStore) {
      renderAdminStudio();
    }
  }

  if (tabStorefront) tabStorefront.addEventListener('click', () => setMode('storefront'));
  if (tabAdmin) tabAdmin.addEventListener('click', () => setMode('admin'));

  const btnSuccessViewAdmin = document.getElementById('btnSuccessViewAdmin');
  if (btnSuccessViewAdmin) {
    btnSuccessViewAdmin.addEventListener('click', () => {
      closeCheckoutModal();
      setMode('admin');
    });
  }
}

// =====================================================
// 4. STOREFRONT RENDERING & SEARCH/FILTERS
// =====================================================
function initStorefront() {
  renderCatalog();
  updateCategoryCounts();
  renderSpotlight();

  // Search input
  const searchInput = document.getElementById('globalSearch');
  const clearBtn = document.getElementById('clearSearchBtn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      store.searchQuery = e.target.value.toLowerCase().trim();
      clearBtn.hidden = store.searchQuery.length === 0;
      renderCatalog();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      store.searchQuery = '';
      clearBtn.hidden = true;
      renderCatalog();
    });
  }

  // Category filter tabs
  const categoryTabs = document.querySelectorAll('.cat-pill');
  categoryTabs.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryTabs.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      store.activeCategory = pill.dataset.category;
      syncHeroTags(store.activeCategory);
      renderCatalog();
    });
  });

  // Hero quick tags
  const heroTags = document.querySelectorAll('.hero-quick-tag');
  heroTags.forEach(tag => {
    tag.addEventListener('click', () => {
      store.activeCategory = tag.dataset.category;
      syncCategoryPills(store.activeCategory);
      syncHeroTags(store.activeCategory);
      renderCatalog();
    });
  });

  // Sort dropdown
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      store.sortBy = e.target.value;
      renderCatalog();
    });
  }

  // In-stock toggle
  const inStockCheck = document.getElementById('inStockOnlyCheckbox');
  if (inStockCheck) {
    inStockCheck.addEventListener('change', (e) => {
      store.inStockOnly = e.target.checked;
      renderCatalog();
    });
  }

  // Reset filters button
  const resetBtn = document.getElementById('resetFiltersBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      store.searchQuery = '';
      if (clearBtn) clearBtn.hidden = true;
      store.activeCategory = 'all';
      store.sortBy = 'featured';
      store.inStockOnly = false;
      if (inStockCheck) inStockCheck.checked = false;
      if (sortSelect) sortSelect.value = 'featured';
      syncCategoryPills('all');
      syncHeroTags('all');
      renderCatalog();
    });
  }

  // Copy promo code pill
  const promoPill = document.getElementById('copyPromoCode');
  if (promoPill) {
    promoPill.addEventListener('click', () => {
      navigator.clipboard?.writeText('LUXE20');
      showToast('Copied promo code "LUXE20" to clipboard!', '📋');
      const couponInput = document.getElementById('couponInput');
      if (couponInput) couponInput.value = 'LUXE20';
    });
  }
}

function syncCategoryPills(category) {
  document.querySelectorAll('.cat-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.category === category);
  });
}

function syncHeroTags(category) {
  document.querySelectorAll('.hero-quick-tag').forEach(tag => {
    tag.classList.toggle('active', tag.dataset.category === category);
  });
}

function updateCategoryCounts() {
  const counts = {
    all: store.products.length,
    Electronics: 0,
    Clothing: 0,
    'Home & Kitchen': 0,
    Books: 0,
    Sports: 0
  };

  store.products.forEach(p => {
    if (counts[p.category] !== undefined) counts[p.category]++;
  });

  const countAll = document.getElementById('countAll');
  const countElec = document.getElementById('countElectronics');
  const countCloth = document.getElementById('countClothing');
  const countHome = document.getElementById('countHome');
  const countBooks = document.getElementById('countBooks');
  const countSports = document.getElementById('countSports');

  if (countAll) countAll.textContent = counts.all;
  if (countElec) countElec.textContent = counts.Electronics;
  if (countCloth) countCloth.textContent = counts.Clothing;
  if (countHome) countHome.textContent = counts['Home & Kitchen'];
  if (countBooks) countBooks.textContent = counts.Books;
  if (countSports) countSports.textContent = counts.Sports;
}

function renderSpotlight() {
  const spotlight = store.products.find(p => p.id === 1) || store.products[0];
  if (!spotlight) return;

  const img = document.getElementById('spotlightImg');
  const title = document.getElementById('spotlightTitle');
  const price = document.getElementById('spotlightPrice');
  const orig = document.getElementById('spotlightOrig');
  const addBtn = document.getElementById('spotlightAddBtn');

  if (img) img.src = spotlight.image;
  if (title) title.textContent = spotlight.name;
  if (price) price.textContent = `$${spotlight.price.toFixed(2)}`;
  if (orig) orig.textContent = spotlight.originalPrice ? `$${spotlight.originalPrice.toFixed(2)}` : '';

  if (addBtn) {
    addBtn.onclick = () => {
      store.addToCart(spotlight.id, 1);
      updateAllBadges();
      bumpCartBadge();
      showToast(`Added "${spotlight.name}" to your cart`, '🛒');
    };
  }
}

function renderCatalog() {
  const grid = document.getElementById('productGrid');
  const emptyBox = document.getElementById('emptyResultsBox');
  const resultsCount = document.getElementById('resultsCount');
  if (!grid) return;

  let filtered = store.products.filter(p => {
    // Category check
    if (store.activeCategory !== 'all' && p.category !== store.activeCategory) return false;
    // In-stock check
    if (store.inStockOnly && p.stock <= 0) return false;
    // Search query check
    if (store.searchQuery) {
      const q = store.searchQuery;
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchTags = p.tags && p.tags.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchCat && !matchTags) return false;
    }
    return true;
  });

  // Sorting
  if (store.sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (store.sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (store.sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (store.sortBy === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    // featured first, then rating
    filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  if (resultsCount) {
    resultsCount.textContent = `Showing ${filtered.length} product${filtered.length === 1 ? '' : 's'}`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (emptyBox) emptyBox.hidden = false;
    return;
  }

  if (emptyBox) emptyBox.hidden = true;
  grid.innerHTML = '';

  filtered.forEach(p => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.id = p.id;

    const discountPercent = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
    const isOutOfStock = p.stock <= 0;

    card.innerHTML = `
      <div class="product-card-media">
        <img class="product-card-img" src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" />
        <div class="product-card-badge-row">
          ${discountPercent > 0 ? `<span class="badge-discount">-${discountPercent}%</span>` : ''}
          ${p.featured ? `<span class="badge-featured-card">Featured</span>` : ''}
        </div>
        <button class="btn-quick-view" data-quickview="${p.id}" aria-label="Quick preview ${escapeHtml(p.name)}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          <span>Quick View</span>
        </button>
      </div>

      <div class="product-card-body">
        <span class="product-card-cat">${escapeHtml(p.category)}</span>
        <h3 class="product-card-title">${escapeHtml(p.name)}</h3>

        <div class="product-card-rating">
          <span class="stars-gold">${'★'.repeat(Math.round(p.rating))}</span>
          <span class="rating-val">${p.rating.toFixed(1)}</span>
          <span class="rating-count">(${p.reviews})</span>
        </div>

        <div class="product-card-footer">
          <div class="price-wrap">
            <span class="current-price">$${p.price.toFixed(2)}</span>
            ${p.originalPrice ? `<span class="original-price">$${p.originalPrice.toFixed(2)}</span>` : ''}
          </div>
          <button class="btn-add-cart" data-add="${p.id}" ${isOutOfStock ? 'disabled' : ''}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
            <span>${isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    `;

    // Event listeners
    card.querySelector('.btn-add-cart').addEventListener('click', (e) => {
      e.stopPropagation();
      if (store.addToCart(p.id, 1)) {
        updateAllBadges();
        bumpCartBadge();
        showToast(`Added "${p.name}" to cart`, '🛒');
      }
    });

    card.querySelector('.btn-quick-view').addEventListener('click', (e) => {
      e.stopPropagation();
      openQuickView(p.id);
    });

    grid.appendChild(card);
  });
}

// =====================================================
// 5. SHOPPING CART DRAWER
// =====================================================
function initCartDrawer() {
  const overlay = document.getElementById('cartOverlay');
  const openBtn = document.getElementById('cartOpenBtn');
  const closeBtn = document.getElementById('cartCloseBtn');
  const clearBtn = document.getElementById('btnClearCart');
  const emptyCta = document.getElementById('cartEmptyCta');
  const applyCouponBtn = document.getElementById('applyCouponBtn');
  const removeCouponBtn = document.getElementById('removeCouponBtn');
  const couponInput = document.getElementById('couponInput');
  const btnCheckoutTrigger = document.getElementById('btnCheckoutTrigger');

  if (openBtn) openBtn.addEventListener('click', openCartDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeCartDrawer();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (store.cart.length === 0) return;
      store.clearCart();
      renderCartItems();
      updateAllBadges();
      showToast('Cleared your cart', '🗑️');
    });
  }

  if (emptyCta) {
    emptyCta.addEventListener('click', () => {
      closeCartDrawer();
    });
  }

  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', () => {
      const res = store.applyCoupon(couponInput.value);
      showToast(res.message, res.success ? '🏷️' : '⚠️');
      renderCartItems();
    });
  }

  if (removeCouponBtn) {
    removeCouponBtn.addEventListener('click', () => {
      store.removeCoupon();
      if (couponInput) couponInput.value = '';
      showToast('Promo code removed', '🏷️');
      renderCartItems();
    });
  }

  if (btnCheckoutTrigger) {
    btnCheckoutTrigger.addEventListener('click', () => {
      if (store.cart.length === 0) {
        showToast('Your cart is empty!', '⚠️');
        return;
      }
      closeCartDrawer();
      openCheckoutModal();
    });
  }
}

function openCartDrawer() {
  renderCartItems();
  const overlay = document.getElementById('cartOverlay');
  if (overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const overlay = document.getElementById('cartOverlay');
  if (overlay) {
    overlay.classList.remove('open');
    maybeRestoreScroll();
  }
}

function bumpCartBadge() {
  const badge = document.getElementById('cartBadgeCount');
  if (!badge) return;
  badge.classList.remove('bump');
  void badge.offsetWidth;
  badge.classList.add('bump');
}

function updateAllBadges() {
  const totals = store.getCartTotals();
  const badge = document.getElementById('cartBadgeCount');
  const drawerCount = document.getElementById('cartDrawerCount');

  if (badge) badge.textContent = totals.itemCount;
  if (drawerCount) drawerCount.textContent = totals.itemCount;
}

function renderCartItems() {
  const wrap = document.getElementById('cartItemsWrap');
  const emptyState = document.getElementById('cartEmptyState');
  const footer = document.getElementById('cartDrawerFooter');
  const goalBox = document.getElementById('shippingGoalBox');
  const goalText = document.getElementById('shippingGoalText');
  const goalFill = document.getElementById('shippingGoalFill');

  const totals = store.getCartTotals();
  updateAllBadges();

  if (!wrap) return;

  if (store.cart.length === 0) {
    wrap.innerHTML = '';
    wrap.hidden = true;
    if (emptyState) emptyState.hidden = false;
    if (footer) footer.hidden = true;
    if (goalBox) goalBox.hidden = true;
    return;
  }

  wrap.hidden = false;
  if (emptyState) emptyState.hidden = true;
  if (footer) footer.hidden = false;
  if (goalBox) goalBox.hidden = false;

  // Free shipping progress bar
  if (totals.freeShippingRemaining <= 0) {
    if (goalText) goalText.textContent = '🎉 You qualified for FREE Express Shipping!';
    if (goalFill) goalFill.style.width = '100%';
  } else {
    const pct = Math.min(100, Math.round(((100 - totals.freeShippingRemaining) / 100) * 100));
    if (goalText) goalText.textContent = `Add $${totals.freeShippingRemaining.toFixed(2)} more for FREE Express Shipping!`;
    if (goalFill) goalFill.style.width = `${pct}%`;
  }

  // Items list
  wrap.innerHTML = '';
  store.cart.forEach(item => {
    const product = store.getProductById(item.id);
    if (!product) return;

    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <img src="${product.image}" alt="${escapeHtml(product.name)}" class="cart-item-img" />
      <div class="cart-item-info">
        <div class="cart-item-top">
          <span class="cart-item-title">${escapeHtml(product.name)}</span>
          <button class="cart-item-del" data-del="${product.id}" title="Remove item" aria-label="Remove item">&times;</button>
        </div>
        <div class="cart-item-bottom">
          <span class="cart-item-price">$${(product.price * item.quantity).toFixed(2)}</span>
          <div class="cart-item-stepper">
            <button data-dec="${product.id}" aria-label="Decrease quantity">−</button>
            <span>${item.quantity}</span>
            <button data-inc="${product.id}" aria-label="Increase quantity">+</button>
          </div>
        </div>
      </div>
    `;

    row.querySelector('[data-del]').addEventListener('click', () => {
      store.removeFromCart(product.id);
      renderCartItems();
    });

    row.querySelector('[data-dec]').addEventListener('click', () => {
      store.updateCartQty(product.id, -1);
      renderCartItems();
    });

    row.querySelector('[data-inc]').addEventListener('click', () => {
      store.updateCartQty(product.id, 1);
      renderCartItems();
    });

    wrap.appendChild(row);
  });

  // Totals & coupon UI
  const subtotalEl = document.getElementById('cartSubtotal');
  const discountRow = document.getElementById('discountSummaryRow');
  const discountEl = document.getElementById('cartDiscount');
  const shippingEl = document.getElementById('cartShipping');
  const taxEl = document.getElementById('cartTax');
  const totalEl = document.getElementById('cartTotal');
  const couponBadge = document.getElementById('couponAppliedBadge');

  if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
  if (shippingEl) shippingEl.textContent = totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `$${totals.tax.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${totals.total.toFixed(2)}`;

  if (store.discountRate > 0) {
    if (discountRow) discountRow.hidden = false;
    if (discountEl) discountEl.textContent = `-$${totals.discount.toFixed(2)}`;
    if (couponBadge) couponBadge.hidden = false;
  } else {
    if (discountRow) discountRow.hidden = true;
    if (couponBadge) couponBadge.hidden = true;
  }
}

// =====================================================
// 6. QUICK VIEW MODAL
// =====================================================
function initQuickView() {
  const overlay = document.getElementById('quickViewOverlay');
  const closeBtn = document.getElementById('quickViewCloseBtn');
  const minusBtn = document.getElementById('qvQtyMinus');
  const plusBtn = document.getElementById('qvQtyPlus');
  const qtyInput = document.getElementById('qvQtyInput');
  const addBtn = document.getElementById('qvAddToCartBtn');

  if (closeBtn) closeBtn.addEventListener('click', closeQuickView);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeQuickView();
    });
  }

  if (minusBtn && qtyInput) {
    minusBtn.addEventListener('click', () => {
      const v = Math.max(1, parseInt(qtyInput.value || 1) - 1);
      qtyInput.value = v;
    });
  }

  if (plusBtn && qtyInput) {
    plusBtn.addEventListener('click', () => {
      const v = Math.min(99, parseInt(qtyInput.value || 1) + 1);
      qtyInput.value = v;
    });
  }

  if (addBtn && qtyInput) {
    addBtn.addEventListener('click', () => {
      const prodId = addBtn.dataset.id;
      if (!prodId) return;
      const count = parseInt(qtyInput.value || 1);
      store.addToCart(prodId, count);
      updateAllBadges();
      bumpCartBadge();
      closeQuickView();
      showToast(`Added ${count}x item to cart!`, '🛒');
    });
  }
}

function openQuickView(productId) {
  const p = store.getProductById(productId);
  if (!p) return;

  const overlay = document.getElementById('quickViewOverlay');
  const img = document.getElementById('qvImg');
  const badge = document.getElementById('qvBadge');
  const cat = document.getElementById('qvCategory');
  const title = document.getElementById('qvTitle');
  const stars = document.getElementById('qvStars');
  const ratingNum = document.getElementById('qvRatingNum');
  const reviewsCount = document.getElementById('qvReviewsCount');
  const price = document.getElementById('qvPrice');
  const origPrice = document.getElementById('qvOrigPrice');
  const saveTag = document.getElementById('qvSaveTag');
  const desc = document.getElementById('qvDesc');
  const tagsRow = document.getElementById('qvTags');
  const stockText = document.getElementById('qvStockText');
  const qtyInput = document.getElementById('qvQtyInput');
  const addBtn = document.getElementById('qvAddToCartBtn');

  if (img) img.src = p.image;
  if (badge) {
    badge.textContent = p.featured ? 'Featured Pick' : 'In Stock';
  }
  if (cat) cat.textContent = p.category;
  if (title) title.textContent = p.name;
  if (stars) stars.textContent = '★'.repeat(Math.round(p.rating));
  if (ratingNum) ratingNum.textContent = `${p.rating.toFixed(1)} / 5.0`;
  if (reviewsCount) reviewsCount.textContent = `(${p.reviews} verified reviews)`;
  if (price) price.textContent = `$${p.price.toFixed(2)}`;
  if (origPrice) origPrice.textContent = p.originalPrice ? `$${p.originalPrice.toFixed(2)}` : '';

  if (saveTag) {
    if (p.originalPrice) {
      saveTag.hidden = false;
      saveTag.textContent = `Save $${(p.originalPrice - p.price).toFixed(2)}`;
    } else {
      saveTag.hidden = true;
    }
  }

  if (desc) desc.textContent = p.description;

  if (tagsRow) {
    tagsRow.innerHTML = (p.tags || []).map(t => `<span class="qv-tag-pill">#${escapeHtml(t)}</span>`).join('');
  }

  if (stockText) {
    stockText.textContent = p.stock > 0 ? `In Stock (${p.stock} units remaining)` : 'Out of Stock';
  }

  if (qtyInput) qtyInput.value = 1;
  if (addBtn) {
    addBtn.dataset.id = p.id;
    addBtn.disabled = p.stock <= 0;
  }

  if (overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeQuickView() {
  const overlay = document.getElementById('quickViewOverlay');
  if (overlay) {
    overlay.classList.remove('open');
    maybeRestoreScroll();
  }
}

// =====================================================
// 7. CHECKOUT SIMULATION MODAL
// =====================================================
function initCheckout() {
  const overlay = document.getElementById('checkoutOverlay');
  const closeBtn = document.getElementById('checkoutCloseBtn');
  const form = document.getElementById('checkoutForm');
  const btnFillAlice = document.getElementById('btnFillAlice');
  const btnFillBob = document.getElementById('btnFillBob');
  const btnSuccessContinue = document.getElementById('btnSuccessContinue');

  if (closeBtn) closeBtn.addEventListener('click', closeCheckoutModal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeCheckoutModal();
    });
  }

  if (btnSuccessContinue) {
    btnSuccessContinue.addEventListener('click', closeCheckoutModal);
  }

  // Persona quick fill presets
  if (btnFillAlice) {
    btnFillAlice.addEventListener('click', () => {
      document.getElementById('custName').value = 'Alice Johnson';
      document.getElementById('custEmail').value = 'alice@example.com';
      document.getElementById('custAddress').value = '742 Evergreen Terrace';
      document.getElementById('custCity').value = 'New York';
      document.getElementById('custZip').value = '10001';
      document.getElementById('cardNumber').value = '4532 8920 1840 9942';
      document.getElementById('cardExpiry').value = '08/28';
      document.getElementById('cardCvc').value = '784';
      showToast('Loaded demo persona: Alice Johnson', '👤');
    });
  }

  if (btnFillBob) {
    btnFillBob.addEventListener('click', () => {
      document.getElementById('custName').value = 'Bob Smith';
      document.getElementById('custEmail').value = 'bob@example.com';
      document.getElementById('custAddress').value = '120 Ocean View Blvd';
      document.getElementById('custCity').value = 'San Francisco';
      document.getElementById('custZip').value = '94107';
      document.getElementById('cardNumber').value = '5424 9912 3450 7118';
      document.getElementById('cardExpiry').value = '11/27';
      document.getElementById('cardCvc').value = '319';
      showToast('Loaded demo persona: Bob Smith', '👤');
    });
  }

  // Format card number with spaces
  const cardInput = document.getElementById('cardNumber');
  if (cardInput) {
    cardInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 16);
      val = val.match(/.{1,4}/g)?.join(' ') || val;
      e.target.value = val;
    });
  }

  // Format card expiry with slash
  const expiryInput = document.getElementById('cardExpiry');
  if (expiryInput) {
    expiryInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2);
      e.target.value = val;
    });
  }

  // Handle Order Submit
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      processCheckout();
    });
  }
}

function openCheckoutModal() {
  const totals = store.getCartTotals();
  const overlay = document.getElementById('checkoutOverlay');
  const form = document.getElementById('checkoutForm');
  const successView = document.getElementById('checkoutSuccessView');
  const countEl = document.getElementById('coItemCount');
  const totalEl = document.getElementById('coTotalDue');

  if (countEl) countEl.textContent = `${totals.itemCount} item${totals.itemCount === 1 ? '' : 's'}`;
  if (totalEl) totalEl.textContent = `$${totals.total.toFixed(2)}`;

  if (form) form.hidden = false;
  if (successView) successView.hidden = true;

  if (overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCheckoutModal() {
  const overlay = document.getElementById('checkoutOverlay');
  if (overlay) {
    overlay.classList.remove('open');
    maybeRestoreScroll();
  }
}

function processCheckout() {
  const name = document.getElementById('custName')?.value.trim() || 'Valued Customer';
  const address = document.getElementById('custAddress')?.value.trim() || 'Standard Delivery';
  const submitBtn = document.getElementById('btnPlaceOrder');
  const spinner = document.getElementById('orderSpinner');
  const btnText = document.getElementById('placeOrderText');

  if (submitBtn) submitBtn.disabled = true;
  if (spinner) spinner.hidden = false;
  if (btnText) btnText.textContent = 'Processing Authorization...';

  const totals = store.getCartTotals();
  const summaryItems = store.cart.map(i => {
    const prod = store.getProductById(i.id);
    return prod ? `${prod.name} (x${i.quantity})` : 'Item';
  }).join(', ');

  // Simulated gateway delay
  setTimeout(() => {
    const orderNum = `#LX-${Math.floor(10000 + Math.random() * 90000)}`;

    // Add to Store operations queue
    store.addOrder({
      id: orderNum,
      customer: name,
      items: summaryItems || 'Catalog Items',
      total: totals.total,
      status: 'processing',
      time: 'Just now'
    });

    // Clear cart
    store.clearCart();
    updateAllBadges();

    // Show Confirmation View
    const form = document.getElementById('checkoutForm');
    const successView = document.getElementById('checkoutSuccessView');
    const orderIdEl = document.getElementById('successOrderId');
    const receiptCustomer = document.getElementById('receiptCustomer');
    const receiptAddress = document.getElementById('receiptAddress');
    const receiptTotal = document.getElementById('receiptTotal');

    if (orderIdEl) orderIdEl.textContent = orderNum;
    if (receiptCustomer) receiptCustomer.textContent = name;
    if (receiptAddress) receiptAddress.textContent = address;
    if (receiptTotal) receiptTotal.textContent = `$${totals.total.toFixed(2)}`;

    if (form) form.hidden = true;
    if (successView) successView.hidden = false;

    if (submitBtn) submitBtn.disabled = false;
    if (spinner) spinner.hidden = true;
    if (btnText) btnText.textContent = 'Place Order & Simulate Fulfillment';

    showToast(`Order ${orderNum} confirmed successfully!`, '🎉');
  }, 1000);
}

// =====================================================
// 8. ADMIN OPERATIONS STUDIO & TELEMETRY
// =====================================================
function initAdminStudio() {
  const btnReset = document.getElementById('btnAdminReset');
  const btnSimulate = document.getElementById('btnSimulateOrder');

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('Reset store demo to initial catalog and state?')) {
        store.resetDemo();
        renderCatalog();
        updateCategoryCounts();
        renderSpotlight();
        renderAdminStudio();
        updateAllBadges();
        showToast('Demo state reset to initial factory values', '🔄');
      }
    });
  }

  if (btnSimulate) {
    btnSimulate.addEventListener('click', () => {
      simulateInboundSale();
    });
  }
}

function simulateInboundSale() {
  const customers = ['Sophia Turner', 'Liam Davies', 'Marcus Vance', 'Hannah Schmidt', 'Kenji Sato'];
  const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
  const randomProduct = store.products[Math.floor(Math.random() * store.products.length)];
  const orderNum = `#LX-${Math.floor(10000 + Math.random() * 90000)}`;

  store.addOrder({
    id: orderNum,
    customer: randomCustomer,
    items: `${randomProduct.name} (x1)`,
    total: randomProduct.price,
    status: 'pending',
    time: 'Just now'
  });

  renderAdminStudio();
  showToast(`Simulated sale: ${orderNum} from ${randomCustomer}!`, '⚡');
}

function renderAdminStudio() {
  // KPI Calculations
  let grossRev = 0;
  store.orders.forEach(o => { grossRev += Number(o.total || 0); });
  const totalOrders = store.orders.length;
  const aov = totalOrders > 0 ? (grossRev / totalOrders) : 0;
  const lowStockCount = store.products.filter(p => p.stock <= 20).length;

  const revEl = document.getElementById('adminRevenue');
  const ordersEl = document.getElementById('adminTotalOrders');
  const aovEl = document.getElementById('adminAOV');
  const skusEl = document.getElementById('adminActiveSKUs');
  const lowStockBadge = document.getElementById('adminLowStockBadge');
  const queueCount = document.getElementById('orderQueueCount');

  if (revEl) revEl.textContent = `$${grossRev.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (ordersEl) ordersEl.textContent = totalOrders;
  if (aovEl) aovEl.textContent = `$${aov.toFixed(2)}`;
  if (skusEl) skusEl.textContent = store.products.length;
  if (lowStockBadge) lowStockBadge.textContent = `${lowStockCount} Low Stock`;
  if (queueCount) queueCount.textContent = `${store.orders.length} Active Orders`;

  // Render Orders Queue Table
  const ordersBody = document.getElementById('adminOrdersBody');
  if (ordersBody) {
    ordersBody.innerHTML = '';
    store.orders.slice(0, 8).forEach(o => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="font-family: var(--font-mono); color: var(--accent-emerald-light);">${escapeHtml(o.id)}</strong></td>
        <td>${escapeHtml(o.customer)}</td>
        <td><span style="font-size: 0.75rem; color: var(--text-secondary);">${escapeHtml(o.items)}</span></td>
        <td><strong>$${Number(o.total).toFixed(2)}</strong></td>
        <td>
          <span class="status-badge ${o.status}" data-cycle="${o.id}" title="Click to cycle status">
            ${capitalize(o.status)} ⟳
          </span>
        </td>
        <td>
          <button class="btn btn-outline btn-sm" data-cycle="${o.id}" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;">Advance</button>
        </td>
      `;

      tr.querySelectorAll('[data-cycle]').forEach(btn => {
        btn.addEventListener('click', () => {
          store.cycleOrderStatus(o.id);
          renderAdminStudio();
        });
      });

      ordersBody.appendChild(tr);
    });
  }

  // Render Inventory Management Table
  const invBody = document.getElementById('adminInventoryBody');
  if (invBody) {
    invBody.innerHTML = '';
    store.products.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <img src="${p.image}" alt="" style="width: 28px; height: 28px; border-radius: 4px; object-fit: cover;" />
            <span style="font-weight: 600;">${escapeHtml(p.name)}</span>
          </div>
        </td>
        <td><span style="color: var(--text-secondary); font-size: 0.75rem;">${escapeHtml(p.category)}</span></td>
        <td>$${p.price.toFixed(2)}</td>
        <td>
          <div class="stock-stepper-inline">
            <button class="btn-mini-step" data-stock-dec="${p.id}">−</button>
            <span style="font-family: var(--font-mono); font-weight: 700; min-width: 24px; text-align: center; ${p.stock <= 20 ? 'color: var(--accent-amber);' : ''}">${p.stock}</span>
            <button class="btn-mini-step" data-stock-inc="${p.id}">+</button>
          </div>
        </td>
        <td>
          <button class="btn btn-sm ${p.featured ? 'btn-primary' : 'btn-outline'}" data-feat="${p.id}" style="padding: 0.15rem 0.45rem; font-size: 0.7rem;">
            ${p.featured ? '★ Featured' : '☆ Standard'}
          </button>
        </td>
      `;

      tr.querySelector('[data-stock-dec]').addEventListener('click', () => {
        store.updateStock(p.id, -5);
        renderAdminStudio();
        renderCatalog();
        updateCategoryCounts();
      });

      tr.querySelector('[data-stock-inc]').addEventListener('click', () => {
        store.updateStock(p.id, 5);
        renderAdminStudio();
        renderCatalog();
        updateCategoryCounts();
      });

      tr.querySelector('[data-feat]').addEventListener('click', () => {
        store.toggleFeatured(p.id);
        renderAdminStudio();
        renderCatalog();
      });

      invBody.appendChild(tr);
    });
  }
}

// =====================================================
// 9. UTILITY FUNCTIONS
// =====================================================
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[m]));
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function maybeRestoreScroll() {
  const openModal = document.querySelector('.modal-overlay.open, .drawer-overlay.open');
  if (!openModal) {
    document.body.style.overflow = '';
  }
}

// Global escape listener
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCartDrawer();
    closeQuickView();
    closeCheckoutModal();
  }
});
