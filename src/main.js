/**
 * Heavenly Faces / Mancino Beauty E-Commerce Engine
 * High-performance vanilla JS interactive cart, navigation, animations & UI features.
 */

// -------------------------------------------------------------
// 1. PRODUCT DATABASE & CATALOG
// -------------------------------------------------------------
const PRODUCTS = [
  {
    id: 'eye-gel',
    name: 'Eye gel',
    price: 19.00,
    priceFormatted: '$ 19.00 USD',
    image: '/assets/63bab3c727acad1be85e17ec/63bab3c727acad186d5e19ef_pexels-ron-lach-8128688.jpg',
    category: 'Shampoos',
    type: 'Face Care'
  },
  {
    id: 'face-oil',
    name: 'Face oil',
    price: 29.00,
    priceFormatted: '$ 29.00 USD',
    image: '/assets/63bab3c727acad1be85e17ec/63bab3c727acadba1b5e19f2_pexels-ron-lach-8160449.avif',
    category: 'Face Care',
    type: 'Face Care'
  },
  {
    id: 'fluid-cream',
    name: 'Fluid cream',
    price: 49.00,
    priceFormatted: '$ 49.00 USD',
    image: '/assets/63bab3c727acad1be85e17ec/63bab3c727acad3fe55e19f1_pexels-ron-lach-8140905.avif',
    category: 'Face Care',
    type: 'Face Care'
  },
  {
    id: 'recovery-cream',
    name: 'Recovery cream',
    price: 29.00,
    priceFormatted: '$ 29.00 USD',
    image: '/assets/63bab3c727acad1be85e17ec/63bab3c727acadc99b5e19ee_pexels-anna-shvets-5217926.jpg',
    category: 'Balsams',
    type: 'Skin Care'
  },
  {
    id: 'rich-night-serum',
    name: 'Rich night serum',
    price: 69.00,
    priceFormatted: '$ 69.00 USD',
    image: '/assets/63bab3c727acad1be85e17ec/63bab3c727acad6a5a5e19f3_pexels-ron-lach-8131568.jpg',
    category: 'Body Lotions',
    type: 'Skin Care'
  },
  {
    id: 'tonicum',
    name: 'Tonicum',
    price: 39.00,
    priceFormatted: '$ 39.00 USD',
    image: '/assets/63bab3c727acad1be85e17ec/63bab3c727acadb5eb5e19f0_pexels-ron-lach-8131584.avif',
    category: 'Hand Care',
    type: 'Body Care'
  }
];

// -------------------------------------------------------------
// 2. CART STATE MANAGEMENT
// -------------------------------------------------------------
class CartManager {
  constructor() {
    this.cartKey = 'mancino_heavenly_cart';
    this.items = this.loadCart();
    this.initUI();
    this.render();
  }

  loadCart() {
    try {
      const saved = localStorage.getItem(this.cartKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(this.cartKey, JSON.stringify(this.items));
    } catch (e) {}
    this.render();
  }

  addItem(productId, qty = 1) {
    const prod = PRODUCTS.find(p => p.id === productId || p.name.toLowerCase() === productId.toLowerCase());
    if (!prod) return;

    const existing = this.items.find(i => i.id === prod.id);
    if (existing) {
      existing.quantity += qty;
    } else {
      this.items.push({
        id: prod.id,
        name: prod.name,
        price: prod.price,
        image: prod.image,
        quantity: qty
      });
    }
    this.saveCart();
    this.showToast(`Added ${prod.name} to cart!`);
    this.openCart();
  }

  updateQuantity(productId, newQty) {
    const item = this.items.find(i => i.id === productId);
    if (!item) return;
    if (newQty <= 0) {
      this.removeItem(productId);
    } else {
      item.quantity = newQty;
      this.saveCart();
    }
  }

  removeItem(productId) {
    this.items = this.items.filter(i => i.id !== productId);
    this.saveCart();
  }

  getTotalCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  openCart() {
    const cartWrappers = document.querySelectorAll('.cart-wrapper, .w-commerce-commercecartcontainerwrapper');
    cartWrappers.forEach(cw => {
      cw.style.setProperty('display', 'flex', 'important');
      cw.classList.add('w--open');
    });
    document.body.style.overflow = 'hidden';
  }

  closeCart() {
    const cartWrappers = document.querySelectorAll('.cart-wrapper, .w-commerce-commercecartcontainerwrapper');
    cartWrappers.forEach(cw => {
      cw.style.setProperty('display', 'none', 'important');
      cw.classList.remove('w--open');
    });
    document.body.style.overflow = '';
  }

  showToast(message) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cart-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: #1c152a;
        color: #f7e6ea;
        border: 1px solid #c07ca5;
        padding: 0.9rem 1.6rem;
        border-radius: 40px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        font-family: 'Poppins', sans-serif;
        font-size: 0.95rem;
        font-weight: 500;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
        pointer-events: none;
      `;
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="color:#d49fb8;font-size:1.2rem;">✦</span> ${message}`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
    }, 2800);
  }

  initUI() {
    // Open cart buttons
    const cartOpenBtns = document.querySelectorAll('[data-node-type="commerce-cart-open-link"], .w-commerce-commercecartopenlink');
    cartOpenBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openCart();
      });
    });

    // Close cart buttons
    const cartCloseBtns = document.querySelectorAll('[data-node-type="commerce-cart-close-link"], .w-commerce-commercecartcloselink, .close-button-2');
    cartCloseBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeCart();
      });
    });

    // Close on backdrop click (click outside modal box)
    const cartWrappers = document.querySelectorAll('.cart-wrapper, .w-commerce-commercecartcontainerwrapper');
    cartWrappers.forEach(wrapper => {
      wrapper.addEventListener('click', (e) => {
        const cartBox = wrapper.querySelector('.cart-container, .w-commerce-commercecartcontainer');
        if (e.target === wrapper || (cartBox && !cartBox.contains(e.target))) {
          this.closeCart();
        }
      });
    });

    // ESC key closes cart & menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeCart();
        closeFullscreenMenu();
      }
    });

    // Connect product cards "Add to Cart" or "Click"
    this.bindProductCards();

    // Checkout button handler
    const checkoutBtn = document.querySelector('.cart-submit-button, [data-node-type="cart-checkout-button"]');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.triggerCheckoutModal();
      });
    }
  }

  bindProductCards() {
    // Find all product listing items on the page
    const productItems = document.querySelectorAll('.product-1-item, .w-dyn-item');
    productItems.forEach(item => {
      const titleEl = item.querySelector('.product-1-title, .listing-heading-uni-1, h3, h4');
      const name = titleEl ? titleEl.textContent.trim() : '';
      const matchingProduct = PRODUCTS.find(p => p.name.toLowerCase() === name.toLowerCase());

      if (matchingProduct) {
        // Check if there is already an Add to Cart button, if not make the circle button or card interactive
        const circleBtn = item.querySelector('.main-circle-button, .product-circle-button');
        if (circleBtn) {
          circleBtn.style.cursor = 'pointer';
          circleBtn.setAttribute('title', `Add ${matchingProduct.name} to Cart`);
          circleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.addItem(matchingProduct.id);
          });
        }
      }
    });
  }

  render() {
    const totalCount = this.getTotalCount();
    const subtotal = this.getSubtotal();

    // Update cart badge counts
    const countBadges = document.querySelectorAll('.w-commerce-commercecartopenlinkcount, .cart-quantity');
    countBadges.forEach(b => {
      b.textContent = totalCount;
      b.style.transform = 'scale(1.25)';
      setTimeout(() => b.style.transform = 'scale(1)', 200);
    });

    // Containers in the cart drawer
    const emptyState = document.querySelector('.w-commerce-commercecartemptystate');
    const errorState = document.querySelector('.w-commerce-commercecarterrorstate');
    const form = document.querySelector('.w-commerce-commercecartform');
    const subtotalEl = document.querySelector('.w-commerce-commercecartordervalue, .cart-order-summary.is-price');

    if (errorState) errorState.style.display = 'none';

    if (subtotalEl) {
      subtotalEl.textContent = `$ ${subtotal.toFixed(2)} USD`;
    }

    if (totalCount === 0) {
      if (emptyState) emptyState.style.display = 'flex';
      if (form) form.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (form) {
      form.style.display = 'block';

      // Find or create cart items container
      let itemsList = form.querySelector('.cart-custom-list');
      if (!itemsList) {
        // Remove old dynamic binds if present
        const oldList = form.querySelector('.w-commerce-commercecartlist, .cart-list');
        if (oldList) oldList.remove();

        itemsList = document.createElement('div');
        itemsList.className = 'cart-list cart-custom-list';
        form.insertBefore(itemsList, form.firstChild);
      }

      itemsList.innerHTML = this.items.map(item => `
        <div class="cart-item w-commerce-commercecartitem" style="display:flex;align-items:center;justify-content:space-between;padding:1.2rem 1.5rem;border-bottom:1px solid rgba(192,124,165,0.25);">
          <div style="display:flex;align-items:center;gap:1.2rem;">
            <img src="${item.image}" alt="${item.name}" class="cart-order-image" style="width:3.8rem;height:3.8rem;object-fit:cover;border-radius:50%;border:1px solid rgba(255,255,255,0.2);" />
            <div>
              <div class="cart-order-product" style="font-family:'Clash Display Variable',sans-serif;font-weight:500;font-size:1.15rem;color:#f7e6ea;letter-spacing:0.04em;">${item.name}</div>
              <div style="color:#c07ca5;font-size:0.95rem;margin-top:0.2rem;">$ ${item.price.toFixed(2)} USD</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:0.9rem;">
            <div style="display:inline-flex;align-items:center;background:rgba(255,255,255,0.08);border-radius:6px;border:1px solid rgba(192,124,165,0.3);overflow:hidden;">
              <button type="button" class="cart-qty-btn" data-id="${item.id}" data-action="dec" style="background:none;border:none;color:#f7e6ea;padding:0.4rem 0.7rem;cursor:pointer;font-size:1.1rem;line-height:1;">-</button>
              <span style="min-width:1.8rem;text-align:center;font-weight:600;font-size:0.95rem;color:#fff;">${item.quantity}</span>
              <button type="button" class="cart-qty-btn" data-id="${item.id}" data-action="inc" style="background:none;border:none;color:#f7e6ea;padding:0.4rem 0.7rem;cursor:pointer;font-size:1.1rem;line-height:1;">+</button>
            </div>
            <button type="button" class="cart-remove-btn" data-id="${item.id}" title="Remove item" style="background:none;border:none;color:#c07ca5;cursor:pointer;font-size:1.1rem;padding:0.4rem;">✕</button>
          </div>
        </div>
      `).join('');

      // Bind quantity + and - buttons
      itemsList.querySelectorAll('.cart-qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const id = btn.getAttribute('data-id');
          const action = btn.getAttribute('data-action');
          const item = this.items.find(i => i.id === id);
          if (item) {
            const nextQty = action === 'inc' ? item.quantity + 1 : item.quantity - 1;
            this.updateQuantity(id, nextQty);
          }
        });
      });

      // Bind remove buttons
      itemsList.querySelectorAll('.cart-remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const id = btn.getAttribute('data-id');
          this.removeItem(id);
        });
      });
    }
  }

  triggerCheckoutModal() {
    const subtotal = this.getSubtotal();
    const count = this.getTotalCount();
    if (count === 0) {
      alert('Your cart is currently empty. Please select some beauty products first!');
      return;
    }

    let checkoutModal = document.getElementById('checkout-modal');
    if (!checkoutModal) {
      checkoutModal = document.createElement('div');
      checkoutModal.id = 'checkout-modal';
      checkoutModal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(15, 12, 28, 0.85);
        backdrop-filter: blur(12px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        padding: 1.5rem;
      `;
      document.body.appendChild(checkoutModal);
    }

    checkoutModal.innerHTML = `
      <div style="background:#1b152d;border:1px solid #c07ca5;border-radius:16px;max-width:520px;width:100%;padding:2.5rem;box-shadow:0 25px 60px rgba(0,0,0,0.7);color:#f7e6ea;position:relative;animation:modalIn 0.3s ease;">
        <button id="close-checkout" style="position:absolute;top:1.2rem;right:1.2rem;background:none;border:none;color:#c07ca5;font-size:1.5rem;cursor:pointer;">✕</button>
        <div style="text-align:center;margin-bottom:2rem;">
          <h2 style="font-family:'Clash Display Variable',sans-serif;font-size:2rem;font-weight:400;margin-bottom:0.5rem;letter-spacing:0.04em;">MANCINO</h2>
          <p style="color:#c07ca5;font-size:0.95rem;text-transform:uppercase;letter-spacing:0.1em;">Order Checkout</p>
        </div>
        <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:1.2rem;margin-bottom:1.5rem;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.6rem;color:#d5c5d0;">
            <span>Items (${count})</span>
            <span>$ ${subtotal.toFixed(2)} USD</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:0.6rem;color:#d5c5d0;">
            <span>Complimentary Luxury Shipping</span>
            <span style="color:#78d4a3;">FREE</span>
          </div>
          <div style="border-top:1px solid rgba(192,124,165,0.3);padding-top:0.8rem;display:flex;justify-content:space-between;font-weight:600;font-size:1.2rem;color:#fff;">
            <span>Total</span>
            <span>$ ${subtotal.toFixed(2)} USD</span>
          </div>
        </div>
        <form id="order-form" onsubmit="event.preventDefault();" style="display:flex;flex-direction:column;gap:1rem;">
          <div>
            <label style="display:block;font-size:0.85rem;color:#c07ca5;margin-bottom:0.3rem;text-transform:uppercase;">Full Name</label>
            <input type="text" required placeholder="Elena Rostova" style="width:100%;padding:0.8rem 1rem;background:rgba(255,255,255,0.06);border:1px solid rgba(192,124,165,0.4);border-radius:6px;color:#fff;outline:none;" />
          </div>
          <div>
            <label style="display:block;font-size:0.85rem;color:#c07ca5;margin-bottom:0.3rem;text-transform:uppercase;">Email Address</label>
            <input type="email" required placeholder="elena@example.com" style="width:100%;padding:0.8rem 1rem;background:rgba(255,255,255,0.06);border:1px solid rgba(192,124,165,0.4);border-radius:6px;color:#fff;outline:none;" />
          </div>
          <div>
            <label style="display:block;font-size:0.85rem;color:#c07ca5;margin-bottom:0.3rem;text-transform:uppercase;">Delivery Address</label>
            <input type="text" required placeholder="742 Evergreen Terrace, Suite 100" style="width:100%;padding:0.8rem 1rem;background:rgba(255,255,255,0.06);border:1px solid rgba(192,124,165,0.4);border-radius:6px;color:#fff;outline:none;" />
          </div>
          <button type="submit" id="confirm-order-btn" style="background:#53436d;color:#fff;border:none;padding:1.1rem;border-radius:6px;font-family:'Clash Display Variable',sans-serif;font-size:1.1rem;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;margin-top:0.8rem;transition:background 0.2s;">
            Complete Order ($ ${subtotal.toFixed(2)})
          </button>
        </form>
      </div>
    `;

    checkoutModal.style.display = 'flex';

    document.getElementById('close-checkout').onclick = () => {
      checkoutModal.style.display = 'none';
    };

    checkoutModal.onclick = (e) => {
      if (e.target === checkoutModal) checkoutModal.style.display = 'none';
    };

    document.getElementById('order-form').onsubmit = (e) => {
      e.preventDefault();
      checkoutModal.innerHTML = `
        <div style="background:#1b152d;border:1px solid #c07ca5;border-radius:16px;max-width:440px;width:100%;padding:3rem 2rem;text-align:center;box-shadow:0 25px 60px rgba(0,0,0,0.7);color:#f7e6ea;">
          <div style="font-size:3.5rem;margin-bottom:1rem;color:#78d4a3;">✓</div>
          <h2 style="font-family:'Clash Display Variable',sans-serif;font-size:1.8rem;margin-bottom:0.6rem;">Order Confirmed!</h2>
          <p style="color:#d5c5d0;font-size:0.95rem;line-height:1.6;margin-bottom:2rem;">
            Thank you for shopping with Heavenly Faces. Your items will be packaged and prepared with care.
          </p>
          <button id="modal-done-btn" style="background:#53436d;color:#fff;border:none;padding:0.8rem 2rem;border-radius:30px;cursor:pointer;font-family:'Poppins',sans-serif;">
            Return to Store
          </button>
        </div>
      `;
      this.items = [];
      this.saveCart();
      document.getElementById('modal-done-btn').onclick = () => {
        checkoutModal.style.display = 'none';
        this.closeCart();
      };
    };
  }
}

// -------------------------------------------------------------
// 3. FULLSCREEN NAVIGATION MENU
// -------------------------------------------------------------
function setupFullscreenMenu() {
  const menuTriggers = document.querySelectorAll('.menu-button, .mobile-menu-button, .footer-open-menu-link, .nav-button-2, [data-w-id="4580e459-8874-822e-e3eb-c97d9014cdea"]');
  const fullscreenMenu = document.querySelector('.fullscreen-menu');
  const closeBtn = document.querySelector('.fullscreen-menu .close-button, .close-button-bg');

  menuTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (fullscreenMenu) {
        fullscreenMenu.classList.add('is-active');
        fullscreenMenu.style.display = 'flex';
        fullscreenMenu.style.opacity = '1';
        fullscreenMenu.style.visibility = 'visible';
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeBtn && fullscreenMenu) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeFullscreenMenu();
    });
  }

  // Close when clicking backdrop
  if (fullscreenMenu) {
    const bg = fullscreenMenu.querySelector('.fullscreen-menu-bg');
    if (bg) {
      bg.addEventListener('click', () => closeFullscreenMenu());
    }
    fullscreenMenu.querySelectorAll('.fullscreen-menu-link').forEach(link => {
      link.addEventListener('click', () => {
        closeFullscreenMenu();
      });
    });
  }
}

function closeFullscreenMenu() {
  const fullscreenMenu = document.querySelector('.fullscreen-menu');
  if (fullscreenMenu) {
    fullscreenMenu.classList.remove('is-active');
    fullscreenMenu.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// -------------------------------------------------------------
// 4. DROPDOWN MENUS (CATEGORIES, SERVICES, TEMPLATE)
// -------------------------------------------------------------
function setupDropdowns() {
  const dropdowns = document.querySelectorAll('.w-dropdown');
  dropdowns.forEach(dropdown => {
    const isAccordion = dropdown.classList.contains('accordion');
    const isHover = dropdown.getAttribute('data-hover') !== 'false' && !isAccordion;
    const toggle = dropdown.querySelector('.w-dropdown-toggle');
    const list = dropdown.querySelector('.w-dropdown-list');
    if (!toggle || !list) return;

    let timeout;

    if (isHover) {
      // Hover interaction for nav dropdowns
      dropdown.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
        closeAllDropdowns(dropdown);
        dropdown.classList.add('w--open');
        toggle.classList.add('w--open');
        list.classList.add('w--open');
        list.style.display = 'block';
      });

      dropdown.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
          dropdown.classList.remove('w--open');
          toggle.classList.remove('w--open');
          list.classList.remove('w--open');
          list.style.display = 'none';
        }, 150);
      });
    }

    // Click toggle
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = list.classList.contains('w--open');
      if (isAccordion) {
        if (isOpen) {
          dropdown.classList.remove('w--open');
          toggle.classList.remove('w--open');
          list.classList.remove('w--open');
          list.style.display = 'none';
        } else {
          dropdown.classList.add('w--open');
          toggle.classList.add('w--open');
          list.classList.add('w--open');
          list.style.display = 'block';
        }
      } else {
        closeAllDropdowns();
        if (!isOpen) {
          dropdown.classList.add('w--open');
          toggle.classList.add('w--open');
          list.classList.add('w--open');
          list.style.display = 'block';
        }
      }
    });
  });

  document.addEventListener('click', () => {
    closeAllDropdowns();
  });
}

function closeAllDropdowns(except = null) {
  document.querySelectorAll('.w-dropdown:not(.accordion)').forEach(d => {
    if (d !== except) {
      d.classList.remove('w--open');
      const t = d.querySelector('.w-dropdown-toggle');
      const l = d.querySelector('.w-dropdown-list');
      if (t) t.classList.remove('w--open');
      if (l) {
        l.classList.remove('w--open');
        l.style.display = 'none';
      }
    }
  });
}

// -------------------------------------------------------------
// 5. SMOOTH SCROLLING & HERO DOWN-ARROW
// -------------------------------------------------------------
function setupSmoothScroll() {
  // Hero down circle button to #discover
  const heroDownBtn = document.querySelector('.hero-down-button, a[href="#discover"], .main-circle-button');
  if (heroDownBtn) {
    heroDownBtn.addEventListener('click', (e) => {
      const target = document.getElementById('discover');
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Smooth scroll for all hash links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').substring(1);
      if (!targetId) return;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// -------------------------------------------------------------
// 6. SCROLL REVEAL & LUXURY PARALLAX EFFECTS
// -------------------------------------------------------------
function setupScrollAnimations() {
  // Animate hero heading immediately on page load
  const heroHeading = document.querySelector('.heading.is-header-slider-2-title-2');
  if (heroHeading) {
    heroHeading.style.transition = 'opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)';
    requestAnimationFrame(() => {
      heroHeading.style.opacity = '1';
      heroHeading.style.transform = 'translateY(0)';
    });
  }

  const hiddenElements = document.querySelectorAll('[style*="opacity:0"], [style*="opacity: 0"]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '50px 0px -50px 0px',
    threshold: 0.05
  });

  hiddenElements.forEach(el => {
    if (el !== heroHeading) {
      el.style.transform = 'translateY(24px)';
      observer.observe(el);
    }
  });

  // Parallax on scroll for luxury images (preserve hover state)
  const parallaxImages = document.querySelectorAll('.cover-image.is-parallax, .cover-image.is-parallax-medium');
  if (parallaxImages.length > 0) {
    window.addEventListener('scroll', () => {
      parallaxImages.forEach(img => {
        const link = img.closest('.listing-1-link');
        if (link && link.matches(':hover')) return;

        const rect = img.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const shift = (rect.top - window.innerHeight / 2) * 0.08;
          img.style.transform = `translate3d(0, ${shift}px, 0) scale(1.08)`;
        }
      });
    }, { passive: true });
  }
}

// -------------------------------------------------------------
// 7. NEWSLETTER & FORM HANDLERS
// -------------------------------------------------------------
function setupForms() {
  const forms = document.querySelectorAll('form:not(#order-form)');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const parent = form.parentElement;
      const successDiv = parent ? parent.querySelector('.w-form-done') : null;
      if (successDiv) {
        form.style.display = 'none';
        successDiv.style.display = 'block';
      } else {
        const msg = document.createElement('div');
        msg.style.cssText = 'color:#d49fb8;padding:1rem;font-weight:500;text-align:center;';
        msg.textContent = 'Thank you! Your message has been received.';
        form.style.display = 'none';
        form.parentNode.insertBefore(msg, form);
      }
    });
  });
}

// -------------------------------------------------------------
// 7. BEAUTY ROUTINE PINNED HORIZONTAL SCROLL STOP ANIMATION
// -------------------------------------------------------------
function setupBeautyRoutineScroll() {
  const section = document.querySelector('.routine-pinned-section');
  const track = document.getElementById('routine-carousel-track');
  const wrapper = document.querySelector('.routine-carousel-wrapper');
  if (!section || !track || !wrapper) return;

  let ticking = false;

  function update() {
    const rect = section.getBoundingClientRect();
    const sectionHeight = section.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollDistance = sectionHeight - windowHeight;

    if (scrollDistance <= 0) {
      ticking = false;
      return;
    }

    // progress goes from 0 (top of section touches top of viewport)
    // to 1 (scrolled through the full vertical distance of the section)
    const progress = Math.min(Math.max(-rect.top / scrollDistance, 0), 1);
    const maxTranslate = Math.max(0, track.scrollWidth - wrapper.clientWidth);
    const currentX = -(progress * maxTranslate);

    track.style.transform = `translate3d(${currentX}px, 0, 0)`;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Initial position check
  update();
}

// -------------------------------------------------------------
// 8. CURSOR ANIMATIONS & 3D TILT PHYSICS ENGINE
// -------------------------------------------------------------
function setupCursorAnimations() {
  // A. Magnetic Circle Buttons (Discover button, hero circle buttons)
  setupMagneticCircleButtons();

  // B. Magnetic Social Buttons
  setupMagneticSocialButtons();

  // C. 3D Tilt Cursor Physics on Images & Text
  setup3DTiltCursorEffects();

  // D. Variable Font Weight on Cursor X Movement
  setupVariableFontCursorEffect();
}

/**
 * Magnetic button pull tracking cursor coordinates relative to center
 */
function setupMagneticCircleButtons() {
  const circleButtons = document.querySelectorAll('.main-circle-button, .hero-down-button');
  
  circleButtons.forEach(btn => {
    const content = btn.querySelector('.circle-button-content');
    const border = btn.querySelector('.circle-button-border-1');
    const icon = btn.querySelector('.circle-button-icon-1');
    const text = btn.querySelector('.circle-button-text-1');

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized offset (-1 to 1)
      const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
      const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)));

      // Magnetic pull: border stretches further than content for organic elastic feel
      if (content) {
        content.style.transform = `translate3d(${normX * 16}px, ${normY * 16}px, 0)`;
      }
      if (border) {
        border.style.transform = `translate3d(${normX * 24}px, ${normY * 24}px, 0) scale(1.18)`;
      }
      if (icon) {
        icon.style.transform = `translate3d(${normX * 12}px, ${normY * 12}px, 0)`;
      }
    });

    btn.addEventListener('mouseleave', () => {
      if (content) {
        content.style.transform = 'translate3d(0, 0, 0)';
      }
      if (border) {
        border.style.transform = 'translate3d(0, 0, 0) scale(1)';
      }
      if (icon) {
        icon.style.transform = 'translate3d(0, 0, 0)';
      }
    });
  });
}

/**
 * Magnetic Social Buttons
 */
function setupMagneticSocialButtons() {
  const socialButtons = document.querySelectorAll('.social-1-link-block');

  socialButtons.forEach(btn => {
    const icon = btn.querySelector('.social-icon');
    const circle = btn.querySelector('.social-link-circle');

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
      const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)));

      if (icon) {
        icon.style.transform = `translate3d(${normX * 8}px, ${normY * 8}px, 0)`;
      }
      if (circle) {
        circle.style.transform = `translate3d(${normX * 4}px, ${normY * 4}px, 0) scale(1)`;
      }
    });

    btn.addEventListener('mouseleave', () => {
      if (icon) {
        icon.style.transform = 'translate3d(0, 0, 0)';
      }
      if (circle) {
        circle.style.transform = 'translate3d(0, 0, 0) scale(0.6)';
      }
    });
  });
}

/**
 * 3D Tilt Cursor Physics on Images (_3d-block > _3d-trigger) and Text (_3d-block-for-text)
 * Using smooth requestAnimationFrame linear interpolation (lerp)
 */
function setup3DTiltCursorEffects() {
  const imageBlocks = Array.from(document.querySelectorAll('._3d-block'));
  const textBlocks = Array.from(document.querySelectorAll('._3d-block-for-text'));

  if (imageBlocks.length === 0 && textBlocks.length === 0) return;

  // Track target mouse position
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let hasMoved = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    hasMoved = true;
  }, { passive: true });

  // Store current animated values for each block
  const imageStates = imageBlocks.map(block => ({
    block,
    trigger: block.querySelector('._3d-trigger') || block,
    currentRotX: 0,
    currentRotY: 0,
    currentTransX: 0,
    currentTransY: 0
  }));

  const textStates = textBlocks.map(block => ({
    block,
    currentRotX: 0,
    currentRotY: 0,
    currentTransX: 0,
    currentTransY: 0
  }));

  const windowW = window.innerWidth;
  const windowH = window.innerHeight;

  function render3D() {
    if (hasMoved) {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;

      // 1. Image 3D tilt
      imageStates.forEach(item => {
        const rect = item.block.getBoundingClientRect();
        // Check if visible in viewport
        if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const normX = Math.max(-1.2, Math.min(1.2, (mouseX - centerX) / halfW));
          const normY = Math.max(-1.2, Math.min(1.2, (mouseY - centerY) / halfH));

          // Webflow a-137 configuration:
          // X: -2% to 2% translate, -4deg to 4deg rotateY
          // Y: -2% to 2% translate, 3deg to -3deg rotateX
          const targetRotY = normX * 4;
          const targetRotX = -normY * 3;
          const targetTransX = normX * 2;
          const targetTransY = normY * 2;

          // Smooth damping lerp (0.08)
          item.currentRotX += (targetRotX - item.currentRotX) * 0.08;
          item.currentRotY += (targetRotY - item.currentRotY) * 0.08;
          item.currentTransX += (targetTransX - item.currentTransX) * 0.08;
          item.currentTransY += (targetTransY - item.currentTransY) * 0.08;

          item.trigger.style.transform = `translate3d(${item.currentTransX.toFixed(2)}%, ${item.currentTransY.toFixed(2)}%, 0) rotateX(${item.currentRotX.toFixed(2)}deg) rotateY(${item.currentRotY.toFixed(2)}deg)`;
        }
      });

      // 2. Text 3D floating parallax
      textStates.forEach(item => {
        const rect = item.block.getBoundingClientRect();
        if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const normX = Math.max(-1.2, Math.min(1.2, (mouseX - centerX) / halfW));
          const normY = Math.max(-1.2, Math.min(1.2, (mouseY - centerY) / halfH));

          // Webflow a-69 configuration:
          // X: -3rem to 3rem translate, -8deg to 8deg rotateY
          // Y: -3rem to 3rem translate, 8deg to -8deg rotateX
          const targetRotY = normX * 8;
          const targetRotX = -normY * 8;
          const targetTransX = normX * 24;
          const targetTransY = normY * 24;

          item.currentRotX += (targetRotX - item.currentRotX) * 0.08;
          item.currentRotY += (targetRotY - item.currentRotY) * 0.08;
          item.currentTransX += (targetTransX - item.currentTransX) * 0.08;
          item.currentTransY += (targetTransY - item.currentTransY) * 0.08;

          item.block.style.transform = `translate3d(${item.currentTransX.toFixed(1)}px, ${item.currentTransY.toFixed(1)}px, 0) rotateX(${item.currentRotX.toFixed(2)}deg) rotateY(${item.currentRotY.toFixed(2)}deg)`;
        }
      });
    }

    requestAnimationFrame(render3D);
  }

  requestAnimationFrame(render3D);
}

/**
 * Variable Font Weight Shift on Horizontal Cursor Movement (Webflow a-163)
 */
function setupVariableFontCursorEffect() {
  const headings = document.querySelectorAll(
    '.heading.is-header-video-1-title-1, .heading.is-content-grid-1-title, .heading.is-header-slider-2-title-2, .listing-heading-uni-1'
  );
  if (headings.length === 0) return;

  let ticking = false;

  window.addEventListener('mousemove', (e) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const normX = Math.max(0, Math.min(1, e.clientX / window.innerWidth));
        // Interpolate weight from 200 (light) to 600 (bold)
        const weight = Math.round(200 + normX * (600 - 200));

        headings.forEach(h => {
          h.style.fontVariationSettings = `'wght' ${weight}`;
          h.style.fontWeight = weight;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// -------------------------------------------------------------
// 9. HERO IMAGE SLIDER ENGINE (Webflow a-63 Replication)
// -------------------------------------------------------------
function setupHeroImageSlider() {
  const sliderContainers = document.querySelectorAll('.header-slider-2, .slider');
  if (sliderContainers.length === 0) return;

  // Find slider instance (in header-slider-2 or .slider)
  const headerSlider = document.querySelector('.header-slider-2') || document.querySelector('.slider');
  if (!headerSlider) return;

  const img1 = headerSlider.querySelector('.slider-image-1');
  const img2 = headerSlider.querySelector('.slider-image-2');
  const img3 = headerSlider.querySelector('.slider-image-3');
  const images = [img1, img2, img3].filter(Boolean);

  const timelineBg = headerSlider.querySelector('.slider-timeline-bg') || document.querySelector('.slider-timeline-bg');
  const wipeBg = headerSlider.querySelector('.slider-bg-for-interaction');

  if (images.length === 0) return;

  // Webflow IX2 exact timings
  const DURATION_ZOOM = 4200; // 4.2s zoom-out and timeline progress
  const DURATION_WIPE = 1400; // 1.4s wipe sweep transition

  // Initial setup for wipe curtain
  if (wipeBg) {
    wipeBg.style.display = 'block';
    wipeBg.style.position = 'absolute';
    wipeBg.style.inset = '0';
    wipeBg.style.zIndex = '15';
    wipeBg.style.backgroundColor = 'var(--purple-black, #15112a)';
    wipeBg.style.transform = 'translate3d(0%, 0, 0)';
    wipeBg.style.willChange = 'transform';
    wipeBg.style.pointerEvents = 'none';
  }

  // Initial setup for slide images
  images.forEach((img, i) => {
    img.style.position = 'absolute';
    img.style.inset = '0';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.pointerEvents = 'none';
    img.style.willChange = 'transform, opacity';
    if (i === 0) {
      img.style.display = 'block';
      img.style.opacity = '1';
      img.style.zIndex = '5';
      img.style.transform = 'scale(1.25)';
    } else {
      img.style.display = 'none';
      img.style.opacity = '0';
      img.style.zIndex = '4';
      img.style.transform = 'scale(1.25)';
    }
  });

  let currentIndex = 0;
  let isRunning = true;
  let zoomTimeout = null;
  let wipeTimeout = null;

  function playSlide(index) {
    if (!isRunning) return;

    const currentImg = images[index];

    // Ensure current image is active and placed above background layers
    images.forEach((img, i) => {
      if (i === index) {
        img.style.display = 'block';
        img.style.opacity = '1';
        img.style.zIndex = '6';
      } else {
        img.style.zIndex = '4';
      }
    });

    // 1. Reset current image to scale(1.25) without transition
    currentImg.style.transition = 'none';
    currentImg.style.transform = 'scale(1.25)';
    currentImg.offsetHeight; // force reflow

    // 2. Start smooth zoom-out: scale(1.25) -> scale(1.0)
    currentImg.style.transition = `transform ${DURATION_ZOOM}ms cubic-bezier(0.075, 0.82, 0.165, 1)`;
    currentImg.style.transform = 'scale(1.0)';

    // 3. Reset and animate timeline progress bar
    if (timelineBg) {
      timelineBg.style.transition = 'none';
      timelineBg.style.transform = 'translate3d(-100%, 0, 0)';
      timelineBg.offsetHeight; // force reflow
      timelineBg.style.transition = `transform ${DURATION_ZOOM}ms linear`;
      timelineBg.style.transform = 'translate3d(0%, 0, 0)';
    }

    // 4. Wipe out curtain overlay to reveal current image
    if (wipeBg) {
      wipeBg.style.transition = `transform ${DURATION_WIPE}ms cubic-bezier(0.85, 0, 0.15, 1)`;
      wipeBg.style.transform = 'translate3d(100%, 0, 0)';
    }

    // 5. When zoom ends, initiate wipe-in transition to cover slide
    zoomTimeout = setTimeout(() => {
      if (!isRunning) return;

      // Reset wipeBg off-screen to the left (-100%) instantly
      if (wipeBg) {
        wipeBg.style.transition = 'none';
        wipeBg.style.transform = 'translate3d(-100%, 0, 0)';
        wipeBg.offsetHeight; // force reflow
        wipeBg.style.transition = `transform ${DURATION_WIPE}ms cubic-bezier(0.85, 0, 0.15, 1)`;
        wipeBg.style.transform = 'translate3d(0%, 0, 0)';
      }

      // Timeline bar exits out to the right (101%)
      if (timelineBg) {
        timelineBg.style.transition = `transform ${DURATION_WIPE}ms cubic-bezier(0.85, 0, 0.15, 1)`;
        timelineBg.style.transform = 'translate3d(101%, 0, 0)';
      }

      // 6. When wipe covers screen, hide old slide and advance to next slide
      wipeTimeout = setTimeout(() => {
        if (!isRunning) return;

        currentImg.style.display = 'none';
        currentImg.style.opacity = '0';

        currentIndex = (currentIndex + 1) % images.length;
        playSlide(currentIndex);
      }, DURATION_WIPE);

    }, DURATION_ZOOM);
  }

  // Handle visibility change (pause when tab hidden to prevent drift)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
      clearTimeout(zoomTimeout);
      clearTimeout(wipeTimeout);
    } else {
      if (!isRunning) {
        isRunning = true;
        playSlide(currentIndex);
      }
    }
  });

  // Start slider at slide 0
  playSlide(0);
}

// -------------------------------------------------------------
// 10. INITIALIZE ON DOM READY
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  window.cartManager = new CartManager();
  setupFullscreenMenu();
  setupDropdowns();
  setupSmoothScroll();
  setupScrollAnimations();
  setupForms();
  setupBeautyRoutineScroll();
  setupCursorAnimations();
  setupHeroImageSlider();
});


