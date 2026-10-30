/**
 * AURA FASHION - Diwali Mega Sale 2026 Interactive Script
 */

// Sample Product Dataset
const products = [
  {
    id: 1,
    name: "Royal Royal Banarasi Silk Saree",
    category: "women",
    originalPrice: 12999,
    discountedPrice: 5199,
    discount: "60% OFF",
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Hand-Embroidered Velvet Sherwani",
    category: "men",
    originalPrice: 18999,
    discountedPrice: 9499,
    discount: "50% OFF",
    rating: 4.8,
    reviews: 94,
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Designer Floral Silk Lehenga",
    category: "women",
    originalPrice: 15999,
    discountedPrice: 7999,
    discount: "50% OFF",
    rating: 4.9,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Kids Brocade Kurta Pyjama Set",
    category: "kids",
    originalPrice: 4999,
    discountedPrice: 1999,
    discount: "60% OFF",
    rating: 4.7,
    reviews: 65,
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Classic Silk Nehru Jacket Set",
    category: "men",
    originalPrice: 7999,
    discountedPrice: 3999,
    discount: "50% OFF",
    rating: 4.6,
    reviews: 82,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "24K Gold Plated Kundan Necklace Set",
    category: "accessories",
    originalPrice: 8999,
    discountedPrice: 3599,
    discount: "60% OFF",
    rating: 4.9,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1611591475179-420d28f20037?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 7,
    name: "Girls Ethnic Festive Frock Lehenga",
    category: "kids",
    originalPrice: 5999,
    discountedPrice: 2399,
    discount: "60% OFF",
    rating: 4.8,
    reviews: 48,
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 8,
    name: "Handcrafted Bridal Potli Bag",
    category: "accessories",
    originalPrice: 2999,
    discountedPrice: 1499,
    discount: "50% OFF",
    rating: 4.7,
    reviews: 76,
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=800&auto=format&fit=crop"
  }
];

// App State (with LocalStorage)
let cart = JSON.parse(localStorage.getItem('aura_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('aura_wishlist')) || [];

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Render initial products
  renderProducts(products);
  updateCartUI();
  updateWishlistUI();
  initCountdownTimer();

  // Mobile Menu Toggle
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');

  hamburgerBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  // Category Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const filter = e.target.getAttribute('data-filter');
      filterProducts(filter);
    });
  });

  // Promotional Filter Triggers (from offer cards)
  const filterTriggers = document.querySelectorAll('.filter-trigger');
  filterTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const filter = trigger.getAttribute('data-filter');
      const targetBtn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
      if (targetBtn) {
        targetBtn.click();
      }
    });
  });

  // Search Input Functionality
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query)
    );
    renderProducts(filtered);
  });

  // Cart Drawer Listeners
  const cartBtn = document.getElementById('cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartDrawer = document.getElementById('cart-drawer');

  cartBtn.addEventListener('click', () => {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
  });

  closeCartBtn.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  function closeCart() {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
  }

  // Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Newsletter Form Submit Validation
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');
  const newsletterMsg = document.getElementById('newsletter-message');

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailValue = newsletterEmail.value.trim();

    if (validateEmail(emailValue)) {
      newsletterMsg.textContent = "🎉 Thank you for subscribing! Your ₹500 discount code is DIWALI2026.";
      newsletterMsg.className = "form-message success";
      newsletterEmail.value = "";
    } else {
      newsletterMsg.textContent = "Please enter a valid email address.";
      newsletterMsg.className = "form-message error";
    }
  });

  // Checkout Button Trigger
  document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Please add items before checking out!");
      return;
    }
    alert("✨ Happy Diwali! Proceeding to Secure Festive Checkout Window.");
  });
});

// Render Product Cards
function renderProducts(items) {
  const grid = document.getElementById('products-grid');
  grid.innerHTML = "";

  if (items.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No products found matching your search criteria.</p>`;
    return;
  }

  items.forEach(product => {
    const isWishlisted = wishlist.includes(product.id);
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <span class="product-badge">${product.discount}</span>
      <button class="wishlist-toggle ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist(${product.id})">
        <i data-lucide="heart" style="${isWishlisted ? 'fill: var(--bright-red);' : ''}"></i>
      </button>
      <div class="product-img-box">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-details">
        <span class="product-category">${product.category}</span>
        <h3 class="product-title">${product.name}</h3>
        <div class="product-rating">
          ★ ${product.rating} <span>(${product.reviews})</span>
        </div>
        <div class="product-price-box">
          <span class="current-price">₹${product.discountedPrice.toLocaleString('en-IN')}</span>
          <span class="original-price">₹${product.originalPrice.toLocaleString('en-IN')}</span>
        </div>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
          <i data-lucide="shopping-bag"></i> Add To Cart
        </button>
      </div>
    `;
    grid.appendChild(card);
  });

  if (window.lucide) {
    lucide.createIcons();
  }
}

// Filter Products
function filterProducts(category) {
  if (category === 'all') {
    renderProducts(products);
  } else {
    const filtered = products.filter(p => p.category === category);
    renderProducts(filtered);
  }
}

// Wishlist Logic
function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId);
  if (index > -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push(productId);
  }
  localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
  updateWishlistUI();
  
  // Re-render current filter state
  const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
  filterProducts(activeFilter);
}

function updateWishlistUI() {
  document.getElementById('wishlist-count').textContent = wishlist.length;
}

// Add to Cart Logic
function addToCart(productId) {
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const product = products.find(p => p.id === productId);
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartUI();

  // Open Cart Drawer automatically
  document.getElementById('cart-drawer').classList.add('active');
  document.getElementById('cart-overlay').classList.add('active');
}

// Save Cart to LocalStorage
function saveCart() {
  localStorage.setItem('aura_cart', JSON.stringify(cart));
}

// Update Cart Drawer & Badges
function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').textContent = totalItems;
  document.getElementById('cart-header-count').textContent = totalItems;

  const cartContainer = document.getElementById('cart-items-container');
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart-msg">
        <i data-lucide="shopping-bag" style="width: 48px; height: 48px; margin-bottom: 10px; color: var(--text-muted);"></i>
        <p>Your shopping bag is empty.</p>
      </div>
    `;
    document.getElementById('cart-subtotal').textContent = "₹0";
    document.getElementById('cart-discount').textContent = "- ₹0";
    document.getElementById('cart-total').textContent = "₹0";
    if (window.lucide) lucide.createIcons();
    return;
  }

  let subtotal = 0;

  cart.forEach(item => {
    const itemTotal = item.discountedPrice * item.quantity;
    subtotal += itemTotal;

    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.name}</h4>
        <div class="cart-item-price">₹${item.discountedPrice.toLocaleString('en-IN')} × ${item.quantity}</div>
        <div class="cart-qty-controls">
          <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
        <i data-lucide="trash-2"></i>
      </button>
    `;
    cartContainer.appendChild(cartItem);
  });

  const festiveDiscount = Math.round(subtotal * 0.1); // Additional 10% Diwali checkout discount
  const finalTotal = subtotal - festiveDiscount;

  document.getElementById('cart-subtotal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  document.getElementById('cart-discount').textContent = `- ₹${festiveDiscount.toLocaleString('en-IN')}`;
  document.getElementById('cart-total').textContent = `₹${finalTotal.toLocaleString('en-IN')}`;

  if (window.lucide) {
    lucide.createIcons();
  }
}

// Modify Cart Quantities
function updateQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    saveCart();
    updateCartUI();
  }
}

// Remove Item from Cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
}

// Dynamic Diwali Countdown Timer Target: November 8, 2026
function initCountdownTimer() {
  const targetDate = new Date('November 8, 2026 23:59:59').getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById('countdown-timer').innerHTML = "<h3 style='color: var(--bright-gold);'>Diwali Mega Sale Has Concluded!</h3>";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// Email Regex Helper
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}