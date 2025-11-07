// Set current year
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Smooth scrolling for anchor links and scroll-top visibility
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
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
        // Close navbar collapse on mobile
        const navbarCollapse = document.getElementById('navbarNav');
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse && navbarCollapse.classList.contains('show')) {
            bsCollapse.hide();
        }

        // Smooth scroll (existing logic)
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
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
