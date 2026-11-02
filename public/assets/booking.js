(() => {
  const keys = {
    promo: 'heavenly-promo-dismissed',
    offerSeen: 'heavenly-offer-seen',
    offerDismissed: 'heavenly-offer-dismissed-at',
    enquiry: 'heavenly-offer-enquiry',
  };
  const contactURL = '/contact?offer=welcome50#booking';
  const offerMessage = 'I would like to enquire about the £50 new-client offer and arrange my first consultation.';
  const read = (storage, key) => {
    try { return window[storage].getItem(key); } catch { return null; }
  };
  const write = (storage, key, value) => {
    try { window[storage].setItem(key, value); } catch { /* Navigation still works when storage is unavailable. */ }
  };

  function init() {
    const root = document.documentElement;
    const promo = document.querySelector('.hf-promo-bar');
    const dialog = document.querySelector('.hf-offer-dialog');
    let previousFocus = null;
    let autoTimer;

    function syncPromoHeight() {
      const height = promo?.getBoundingClientRect().height || 0;
      root.style.setProperty('--hf-promo-height', `${height}px`);
    }

    if (read('sessionStorage', keys.promo) === '1') root.classList.add('hf-promo-dismissed');
    syncPromoHeight();
    if (promo) {
      if ('ResizeObserver' in window) new ResizeObserver(syncPromoHeight).observe(promo);
      else window.addEventListener('resize', syncPromoHeight);
      promo.querySelector('.hf-promo-close')?.addEventListener('click', () => {
        root.classList.add('hf-promo-dismissed');
        write('sessionStorage', keys.promo, '1');
        syncPromoHeight();
        document.querySelector('.nav-cta-button')?.focus({ preventScroll: true });
      });
    }

    const markDismissed = () => write('localStorage', keys.offerDismissed, String(Date.now()));
    function closeOffer() {
      if (!dialog?.open) return;
      markDismissed();
      dialog.close();
    }
    function openOffer(trigger) {
      if (!dialog || dialog.open || typeof dialog.showModal !== 'function') return false;
      clearTimeout(autoTimer);
      previousFocus = trigger || document.activeElement;
      dialog.showModal();
      document.body.classList.add('hf-offer-is-open');
      write('sessionStorage', keys.offerSeen, '1');
      dialog.querySelector('.hf-offer-title')?.focus({ preventScroll: true });
      return true;
    }

    document.querySelectorAll('[data-hf-offer-open]').forEach(link => {
      link.addEventListener('click', event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (openOffer(link)) {
          event.preventDefault();
          event.stopPropagation();
        }
      });
    });

    if (dialog) {
      dialog.querySelectorAll('[data-hf-offer-close]').forEach(button => button.addEventListener('click', closeOffer));
      dialog.addEventListener('cancel', event => {
        event.preventDefault();
        closeOffer();
      });
      dialog.addEventListener('close', () => {
        document.body.classList.remove('hf-offer-is-open');
        if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
      });
      dialog.addEventListener('keydown', event => {
        if (event.key !== 'Tab') return;
        const controls = [...dialog.querySelectorAll('button:not([disabled]), input:not([disabled]), a[href], select:not([disabled]), textarea:not([disabled])')]
          .filter(control => control.getClientRects().length > 0 && control.tabIndex >= 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      });
      let outsidePointerDown = false;
      const outside = event => {
        const rect = dialog.getBoundingClientRect();
        return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
      };
      dialog.addEventListener('pointerdown', event => { outsidePointerDown = event.target === dialog && outside(event); });
      dialog.addEventListener('click', event => {
        if (outsidePointerDown && event.target === dialog && outside(event)) closeOffer();
        outsidePointerDown = false;
      });

      const form = dialog.querySelector('form');
      const name = form.elements.namedItem('name');
      name.addEventListener('input', () => name.setCustomValidity(''));
      form.addEventListener('submit', event => {
        // Isolate this handoff from the exported template's delegated form handlers.
        event.preventDefault();
        event.stopImmediatePropagation();
        name.setCustomValidity(name.value.trim() ? '' : 'Please enter your name.');
        if (!form.reportValidity()) return;
        const data = new FormData(form);
        write('sessionStorage', keys.enquiry, JSON.stringify({
          name: String(data.get('name') || '').trim(),
          email: String(data.get('email') || '').trim(),
          phone: String(data.get('phone') || '').trim(),
          createdAt: Date.now(),
        }));
        markDismissed();
        window.location.assign(contactURL);
      }, { capture: true });

      const dismissedAt = Number(read('localStorage', keys.offerDismissed)) || 0;
      const recentlyDismissed = Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000;
      if (document.querySelector('.hf-home-hero') && !read('sessionStorage', keys.offerSeen) && !recentlyDismissed) {
        autoTimer = window.setTimeout(() => {
          const active = document.activeElement;
          const menu = document.querySelector('.fullscreen-menu');
          const menuOpen = menu && getComputedStyle(menu).display !== 'none';
          const editing = active?.matches('input, textarea, select, [contenteditable="true"]');
          if (!document.hidden && !menuOpen && !editing && window.scrollY < window.innerHeight) openOffer();
        }, 15000);
      }
    }

    // This is a prefill/handoff, not a submission or a booking confirmation.
    const bookingSection = document.getElementById('booking');
    const form = bookingSection?.querySelector('form');
    if (form && new URLSearchParams(window.location.search).get('offer') === 'welcome50') {
      let enquiry;
      try { enquiry = JSON.parse(read('sessionStorage', keys.enquiry) || 'null'); } catch { enquiry = null; }
      try { window.sessionStorage.removeItem(keys.enquiry); } catch { /* No persistent copy of the visitor's details. */ }
      const fresh = enquiry && typeof enquiry.createdAt === 'number' && Date.now() - enquiry.createdAt < 30 * 60 * 1000;
      const fill = (selector, value) => {
        const field = form.querySelector(selector);
        if (field && typeof value === 'string' && !field.value) field.value = value;
      };
      if (fresh) {
        fill('[name="Name"]', enquiry.name);
        fill('[name="Email"]', enquiry.email);
        fill('[name="Phone"]', enquiry.phone);
      }
      fill('[name="Subject"]', '£50 new-client offer · First consultation');
      fill('[name="Message"]', offerMessage);
      const phone = form.querySelector('[name="Phone"]');
      if (phone) {
        phone.required = false;
        phone.placeholder = 'Your phone (optional)';
      }
      const note = document.createElement('div');
      note.className = 'hf-enquiry-context';
      note.setAttribute('role', 'status');
      const title = document.createElement('strong');
      title.textContent = 'Your £50 welcome offer';
      note.append(title, 'Review your details below and send your enquiry to arrange a consultation.');
      form.before(note);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
