// Set current year
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Smooth scrolling for anchor links and scroll-top visibility
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Skip if href is just "#" or empty
        if (href === '#' || href === '') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

// Navbar state & mobile menu handling
const navbar = document.getElementById('mainNavbar');
const navbarCollapse = document.getElementById('navbarNav');

const updateNavbarState = () => {
    const isMobile = window.innerWidth < 992;
    const isScrolled = window.scrollY > 30;

    // 🖥️ Desktop: classic transparent ↔ opaque
    if (!isMobile) {
        if (isScrolled) {
            navbar.classList.add('navbar-scrolled');
            navbar.classList.remove('navbar-transparent');
        } else {
            navbar.classList.add('navbar-transparent');
            navbar.classList.remove('navbar-scrolled');
        }
    } 
    // 📱 Mobile: 
    // - transparent only at top + menu closed
    // - black otherwise (scrolled or menu open)
    else {
        navbar.classList.toggle('scrolled-mobile', isScrolled);
        // Note: .navbar-mobile-open is controlled by collapse events below
    }
};

// Handle menu open/close (mobile only)
const handleMenuToggle = () => {
    const isMobile = window.innerWidth < 992;
    if (!isMobile) return;

    if (navbarCollapse.classList.contains('show')) {
        navbar.classList.add('navbar-mobile-open');
    } else {
        navbar.classList.remove('navbar-mobile-open');
    }
};

// Events
window.addEventListener('load', updateNavbarState);
window.addEventListener('scroll', updateNavbarState);
window.addEventListener('resize', updateNavbarState);

// Bootstrap collapse events (for menu open/close)
navbarCollapse.addEventListener('shown.bs.collapse', handleMenuToggle);
navbarCollapse.addEventListener('hidden.bs.collapse', handleMenuToggle);

// Close navbar when clicking nav links (mobile) — fixed to accept event param
 document.querySelectorAll('.nav-link').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Skip if href is just "#" or empty (handled by other listeners)
        if (href === '#' || href === '') return;
        
        // Close navbar collapse on mobile
        const navbarCollapse = document.getElementById('navbarNav');
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse && navbarCollapse.classList.contains('show')) {
            bsCollapse.hide();
        }

        // Smooth scroll (existing logic)
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

document.addEventListener('click', function (event) {
    const navbarCollapse = document.getElementById('navbarNav');
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    if (navbarCollapse.classList.contains('show') && 
        !event.target.closest('.navbar') && 
        !event.target.closest('.navbar-toggler')) {
        
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        bsCollapse?.hide();
    }
});

(function applyMobileClassByUA() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(
    navigator.userAgent || navigator.vendor || window.opera
  );

  const root = document.documentElement;

  if (isMobile) {
    root.classList.add('mobile');
    if (/iPad|iPhone|iPod/i.test(navigator.userAgent)) {
      root.classList.add('ios');
    } else if (/Android/i.test(navigator.userAgent)) {
      root.classList.add('android');
    }
  }

  window.isMobileDevice = isMobile;
})();

(function() {
  const sliderInner = document.getElementById('sliderInner');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('sliderDots');
  
  const slides = sliderInner.children;
  const totalSlides = slides.length;
  let currentIndex = 0;

  // Create dots
  function createDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.dataset.index = i;
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  // Update active dot
  function updateDots() {
    document.querySelectorAll('.slider-dots button').forEach((btn, i) => {
      btn.classList.toggle('active', i === currentIndex);
    });
  }

  // Go to specific slide
  function goToSlide(index) {
    currentIndex = ((index % totalSlides) + totalSlides) % totalSlides; // handle negatives
    const offset = -currentIndex * 100;
    sliderInner.style.transform = `translateX(${offset}%)`;
    updateDots();
  }

  // Navigation
  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  // Event listeners
  prevBtn?.addEventListener('click', prevSlide);
  nextBtn?.addEventListener('click', nextSlide);

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  // Touch / Pointer swipe support for mobile and touch devices
  // - Detects horizontal swipes and triggers next/prev slide
  // - Uses a threshold and ensures vertical movement (scroll) isn't mistaken for a swipe
  (function addSwipeSupport() {
    if (!sliderInner) return;

    // help the browser know we intend horizontal interactions but still allow vertical scrolling
    try { sliderInner.style.touchAction = sliderInner.style.touchAction || 'pan-y'; } catch (e) { /* ignore */ }

    let startX = 0;
    let startY = 0;
    let isDown = false;
    const THRESHOLD = 50; // px required to qualify as swipe

    // TOUCH events (mobile)
    sliderInner.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      isDown = true;
    }, { passive: true });

    sliderInner.addEventListener('touchend', (e) => {
      if (!isDown) return;
      isDown = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > THRESHOLD) {
        if (dx < 0) nextSlide(); else prevSlide();
      }
    });

    // POINTER events (covers stylus, some touchpads and modern browsers)
    sliderInner.addEventListener('pointerdown', (e) => {
      // only handle primary pointers
      if (e.isPrimary === false) return;
      startX = e.clientX;
      startY = e.clientY;
      isDown = true;
      try { sliderInner.setPointerCapture?.(e.pointerId); } catch (err) { /* ignore */ }
    });

    sliderInner.addEventListener('pointerup', (e) => {
      if (!isDown) return;
      isDown = false;
      try { sliderInner.releasePointerCapture?.(e.pointerId); } catch (err) { /* ignore */ }
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > THRESHOLD) {
        if (dx < 0) nextSlide(); else prevSlide();
      }
    });

    sliderInner.addEventListener('pointercancel', () => { isDown = false; });
  })();

  // Auto-init
  createDots();

  // Optional: Disable arrows at ends (remove if you want infinite loop)
  function updateArrows() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === totalSlides - 1;
    // Style disabled
    prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';
    nextBtn.style.opacity = currentIndex === totalSlides - 1 ? '0.4' : '1';
  }

  // Call after goToSlide
  const originalGoToSlide = goToSlide;
  goToSlide = function(index) {
    originalGoToSlide(index);
    updateArrows();
  };

  updateArrows();
})();

/* -----------------------------
   Holiday banner behavior
   - Shows only between 23 Dec and 2 Jan (inclusive)
   - Allows user to dismiss; dismissal expires after the holiday period
   - Thumbnail opens modal with full-size image
   ----------------------------- */
(function holidayBanner() {
  const bannerFull = document.getElementById('holiday-banner');
  const bannerMini = document.getElementById('holiday-banner-mini');
  const btnClose = document.getElementById('holiday-close'); // minimize button
  const bellLeft = document.getElementById('holiday-bell-left'); // bell icon on left
  const notifyBtn = document.getElementById('holiday-notify'); // notification bell (in minimized view)
  const openLink = document.getElementById('holiday-open'); // thumbnail/link (in full view)
  const modal = document.getElementById('holiday-modal');
  const modalClose = document.getElementById('holiday-modal-close');
  const modalBackdrop = document.getElementById('holiday-modal-backdrop');

  if (!bannerFull || !bannerMini) return; // nothing to do

  function isInHolidayRange(today = new Date()) {
    const m = today.getMonth(); // 0..11
    const d = today.getDate();

    // Show if date is between 23 Dec and 31 Dec, OR between 1 Jan and 2 Jan
    if ((m === 11 && d >= 23 && d <= 31) || (m === 0 && d <= 2)) return true;
    return false;
  }

  // Determine the Jan 3 that follows the current holiday window
  function nextJan3After(today = new Date()) {
    const year = today.getFullYear();
    const jan3ThisYear = new Date(year, 0, 3);
    // if today is on or before Jan 3 this year, use that; otherwise next year
    if (today <= jan3ThisYear) return jan3ThisYear;
    return new Date(year + 1, 0, 3);
  }

  // Show full banner (expanded)
  function expandBanner() {
    bannerFull.setAttribute('aria-hidden', 'false');
    bannerFull.removeAttribute('inert');
    bannerMini.setAttribute('aria-hidden', 'true');
    bannerMini.setAttribute('inert', '');
  }

  // Hide full banner, show minimized bell (collapsed)
  function minimizeBanner() {
    // Remove focus from any focused element in the banner before hiding
    if (document.activeElement && bannerFull.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    bannerFull.setAttribute('aria-hidden', 'true');
    bannerFull.setAttribute('inert', '');
    bannerMini.setAttribute('aria-hidden', 'false');
    bannerMini.removeAttribute('inert');
  }

  // If user dismissed, hide until after Jan 2 (i.e. show again next season)
  const dismissedUntil = localStorage.getItem('holidayBannerDismissedUntil');
  if (dismissedUntil) {
    const until = new Date(dismissedUntil);
    if (until > new Date()) {
      bannerFull.setAttribute('aria-hidden', 'true');
      bannerFull.setAttribute('inert', '');
      bannerMini.setAttribute('aria-hidden', 'true');
      bannerMini.setAttribute('inert', '');
      return; // dismissed for now
    } else {
      localStorage.removeItem('holidayBannerDismissedUntil');
    }
  }

  // Only show when in holiday range (UNCOMMENT FOR PRODUCTION)
  // if (!isInHolidayRange()) {
  //   bannerFull.setAttribute('aria-hidden', 'true');
  //   bannerFull.setAttribute('inert', '');
  //   bannerMini.setAttribute('aria-hidden', 'true');
  //   bannerMini.setAttribute('inert', '');
  //   return;
  // }

  // Initially show full banner
  expandBanner();

  // Close button minimizes the banner to notification bell
  if (btnClose) {
    btnClose.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      minimizeBanner();
    });
  }

  // Bell icon on left side opens modal (same as clicking the banner)
  if (bellLeft) {
    bellLeft.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (modal) {
        modal.setAttribute('aria-hidden', 'false');
        modal.removeAttribute('inert');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  // Notification bell expands banner back to full view
  if (notifyBtn) {
    notifyBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      expandBanner();
    });
  }

  // Thumbnail/text link opens modal for full-size image
  if (openLink) {
    openLink.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (modal) {
        modal.setAttribute('aria-hidden', 'false');
        modal.removeAttribute('inert');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  function closeModal() {
    if (modal) {
      // Remove focus from modal elements before hiding
      if (document.activeElement && modal.contains(document.activeElement)) {
        document.activeElement.blur();
      }
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('inert', '');
    }
    document.body.style.overflow = '';
    // Expand banner again after closing modal (if it's still shown)
    if (bannerFull.getAttribute('aria-hidden') === 'false') {
      expandBanner();
    }
  }

  // Modal close (X)
  if (modalClose) {
    modalClose.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    });
  }

  // Backdrop click closes modal
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', function (e) {
      e.stopPropagation();
      closeModal();
    });
  }

  // Dismiss button inside modal (hides banner for the season)
  const dismissBtn = document.getElementById('holiday-dismiss-btn');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const until = nextJan3After(new Date());
      localStorage.setItem('holidayBannerDismissedUntil', until.toISOString());
      bannerFull.setAttribute('aria-hidden', 'true');
      bannerMini.setAttribute('aria-hidden', 'true');
      closeModal();
    });
  }

  // Allow escape key to close modal
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
})();
