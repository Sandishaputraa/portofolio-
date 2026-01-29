/* HAMBURGER TOGGLE */
const burger = document.querySelector(".hamburger");
const menu = document.querySelector(".nav-center");

burger?.addEventListener("click", () => {
  menu.classList.toggle("active");
});

/* CLOSE MENU WHEN CLICK LINK */
menu?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    menu.classList.remove("active");
  });
});

/* ACTIVE PAGE HIGHLIGHT */
document.addEventListener("DOMContentLoaded", function() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  
  document.querySelectorAll(".nav-center a").forEach(link => {
    const linkPage = link.getAttribute("href");
    
    // Remove active class from all
    link.classList.remove("active");
    
    // Add active class to current page
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
    
    // Handle home page
    if (currentPage === "" && linkPage === "index.html") {
      link.classList.add("active");
    }
  });
});

/* DARK MODE TOGGLE */
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// Initialize theme from localStorage
function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  
  if (savedTheme === "dark") {
    body.classList.add("dark");
    updateThemeIcon(true);
  } else {
    updateThemeIcon(false);
  }
}

// Update theme icon
function updateThemeIcon(isDark) {
  if (!themeToggle) return;
  
  if (isDark) {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
}

// Toggle theme
themeToggle?.addEventListener("click", () => {
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");
  
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeIcon(isDark);
});

/* PORTFOLIO FILTER (only on portfolio page) */
function initPortfolioFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  
  if (filterButtons.length === 0 || portfolioCards.length === 0) return;
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      
      // Add active to clicked button
      this.classList.add('active');
      
      const filter = this.getAttribute('data-filter');
      
      portfolioCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category').includes(filter)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 100);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });
}

/* FORM SUBMISSION (only on contact page) */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const statusMsg = document.getElementById('statusMsg');
  
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.textContent = 'Mengirim...';
    statusMsg.textContent = '';
    statusMsg.style.color = '';
    
    try {
      const formData = new FormData(this);
      const response = await fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        statusMsg.textContent = 'Pesan terkirim! Terima kasih.';
        statusMsg.style.color = '#10b981';
        contactForm.reset();
      } else {
        throw new Error('Gagal mengirim pesan');
      }
    } catch (error) {
      statusMsg.textContent = 'Maaf, terjadi kesalahan. Silakan coba lagi.';
      statusMsg.style.color = '#ef4444';
    } finally {
      // Restore button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      
      // Clear message after 5 seconds
      setTimeout(() => {
        statusMsg.textContent = '';
      }, 5000);
    }
  });
}

/* TYPEWRITER EFFECT (optional) */
function initTypewriter() {
  const typewriterEl = document.getElementById('typewriter');
  if (!typewriterEl) return;
  
  const texts = JSON.parse(typewriterEl.getAttribute('data-texts') || '[]');
  let currentIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function type() {
    const currentText = texts[currentIndex];
    
    if (isDeleting) {
      typewriterEl.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterEl.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
      // Pause at the end of typing
      isDeleting = true;
      setTimeout(type, 1500);
    } else if (isDeleting && charIndex === 0) {
      // Move to next text
      isDeleting = false;
      currentIndex = (currentIndex + 1) % texts.length;
      setTimeout(type, 500);
    } else {
      // Continue typing/deleting
      setTimeout(type, isDeleting ? 50 : 100);
    }
  }
  
  setTimeout(type, 1000);
}

/* SCROLL ANIMATION */
function initScrollAnimation() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, {
    threshold: 0.1
  });
  
  document.querySelectorAll('.fade-in, .service-card, .portfolio-card').forEach(el => {
    observer.observe(el);
  });
}

/* INITIALIZE EVERYTHING */
document.addEventListener("DOMContentLoaded", function() {
  initTheme();
  initPortfolioFilter();
  initContactForm();
  initTypewriter();
  initScrollAnimation();
  
  // Mobile menu close on outside click
  document.addEventListener('click', (e) => {
    if (menu && menu.classList.contains('active') && 
        !menu.contains(e.target) && 
        !burger.contains(e.target)) {
      menu.classList.remove('active');
    }
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu && menu.classList.contains('active')) {
      menu.classList.remove('active');
    }
    
    // Ctrl/Cmd + D for dark mode toggle
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      themeToggle?.click();
    }
  });
});

/* SMOOTH SCROLL */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

/* BACK TO TOP BUTTON */
function initBackToTop() {
  const backToTopBtn = document.createElement('button');
  backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.style.display = 'none';
  document.body.appendChild(backToTopBtn);
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.style.display = 'flex';
    } else {
      backToTopBtn.style.display = 'none';
    }
  });
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Initialize back to top button
document.addEventListener("DOMContentLoaded", initBackToTop);

/* LOADING ANIMATION */
window.addEventListener('load', function() {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 300);
    }, 500);
  }
});

/* CURRENT YEAR IN FOOTER */
document.addEventListener("DOMContentLoaded", function() {
  const yearElements = document.querySelectorAll('.current-year');
  if (yearElements.length > 0) {
    const currentYear = new Date().getFullYear();
    yearElements.forEach(el => {
      el.textContent = currentYear;
    });
  }
});

// Add this to existing script.js

/* FAQ TOGGLE */
function initFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const isActive = question.classList.contains('active');
      
      // Close all other FAQs
      faqQuestions.forEach(q => {
        q.classList.remove('active');
        q.nextElementSibling.classList.remove('active');
      });
      
      // Toggle current FAQ
      if (!isActive) {
        question.classList.add('active');
        answer.classList.add('active');
      }
    });
  });
}

// Add to initialization function
document.addEventListener("DOMContentLoaded", function() {
  initTheme();
  initPortfolioFilter();
  initContactForm();
  initTypewriter();
  initScrollAnimation();
  initFAQ(); // <-- Add this
  initBackToTop();
});

// Tambah fungsi ini di bagian akhir sebelum console.log
/* IMAGE LAZY LOADING */
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    images.forEach(img => {
      img.src = img.dataset.src;
    });
  }
}

// Update initialization function
document.addEventListener("DOMContentLoaded", function() {
  initTheme();
  initPortfolioFilter();
  initContactForm();
  initTypewriter();
  initScrollAnimation();
  initFAQ();
  initBackToTop();
  initLazyLoading(); // Tambah ini
  
  // Fix: Ensure active page highlighting works correctly
  highlightActivePage();
});

/* IMPROVED ACTIVE PAGE HIGHLIGHTING */
function highlightActivePage() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-center a");
  
  navLinks.forEach(link => {
    link.classList.remove("active");
    const linkPage = link.getAttribute("href");
    
    // Handle exact matches and home page
    if (linkPage === currentPage || 
        (currentPage === "" && linkPage === "index.html") ||
        (currentPage === "/" && linkPage === "index.html")) {
      link.classList.add("active");
    }
  });
}

/* FORM SUBMISSION - IMPROVED VERSION */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const statusMsg = document.getElementById('statusMsg');
  
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    const originalBtnClass = submitBtn.className;
    
    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    submitBtn.className = 'btn primary loading';
    
    // Reset status message
    statusMsg.className = 'status-message';
    statusMsg.textContent = '';
    statusMsg.style.display = 'none';
    
    try {
      const formData = new FormData(this);
      
      // Show loading state
      statusMsg.className = 'status-message';
      statusMsg.textContent = 'Mengirim pesan...';
      statusMsg.style.display = 'block';
      
      const response = await fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        // Success
        statusMsg.className = 'status-message success';
        statusMsg.innerHTML = '<i class="fas fa-check-circle"></i> Pesan terkirim! Terima kasih atas masukan Anda.';
        statusMsg.style.display = 'block';
        
        // Reset form
        contactForm.reset();
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          statusMsg.style.display = 'none';
        }, 5000);
      } else {
        throw new Error('Gagal mengirim pesan');
      }
    } catch (error) {
      // Error
      statusMsg.className = 'status-message error';
      statusMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi via WhatsApp/Telegram.';
      statusMsg.style.display = 'block';
      
      console.error('Form submission error:', error);
    } finally {
      // Restore button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      submitBtn.className = originalBtnClass;
    }
  });
}

/* IMAGE ERROR HANDLING */
function initImageErrorHandling() {
  const images = document.querySelectorAll('.card-image img');
  
  images.forEach(img => {
    // Add error event listener
    img.addEventListener('error', function() {
      console.warn('Image failed to load:', this.src);
      
      // Mark image as error
      this.classList.add('error');
      
      // Alternative: Replace with placeholder
      // this.src = 'https://via.placeholder.com/600x400/4f46e5/ffffff?text=Project+Image';
      
      // Alternative 2: Show fallback text
      const cardImage = this.closest('.card-image');
      if (cardImage) {
        cardImage.style.background = 'linear-gradient(135deg, var(--gradient-1) 0%, var(--gradient-2) 100%)';
        cardImage.style.display = 'flex';
        cardImage.style.alignItems = 'center';
        cardImage.style.justifyContent = 'center';
        cardImage.style.color = 'var(--text)';
        cardImage.style.fontSize = '18px';
        cardImage.innerHTML = '<span>📱 Project Preview</span>';
      }
    });
    
    // Add load event to confirm success
    img.addEventListener('load', function() {
      this.classList.remove('error');
      this.classList.add('loaded');
    });
  });
}

/* PRELOAD IMAGES */
function preloadPortfolioImages() {
  const imageUrls = [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1611605698335-8b1569810432?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  ];
  
  imageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}

// UPDATE INITIALIZATION FUNCTION
document.addEventListener("DOMContentLoaded", function() {
  initTheme();
  initPortfolioFilter();
  initContactForm();
  initTypewriter();
  initScrollAnimation();
  initFAQ();
  initBackToTop();
  initLazyLoading();
  initImageErrorHandling(); // Tambah ini
  preloadPortfolioImages(); // Tambah ini
  highlightActivePage();
});

/* COPYRIGHT NOTICE */
console.log(`
       =========================================
            Sandi Shaputra Portfolio v1.0
           Built with 💙 and lots of coffee
       =========================================
`);