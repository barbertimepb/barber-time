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
