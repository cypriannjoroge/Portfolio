// Initialize AOS
AOS.init({ once: true, duration: 700, easing: 'ease-out-cubic'});

// Lazy loading for background images with progressive enhancement
document.addEventListener('DOMContentLoaded', function() {
  // Intersection Observer for lazy loading
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const bgImage = element.style.backgroundImage;
        
        if (bgImage && bgImage !== 'none') {
          // Extract image URL from background-image
          const imageUrl = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/)[1];
          
          // Create a new image to preload with progressive loading
          const img = new Image();
          
          // Start with low quality placeholder
          element.classList.add('skeleton');
          
          img.onload = () => {
            // Remove skeleton and show loaded image with blur-up effect
            element.classList.remove('skeleton');
            element.classList.add('blur-up');
            element.style.backgroundImage = bgImage;
            element.classList.add('loaded');
            
            // Remove blur after a short delay for smooth transition
            setTimeout(() => {
              element.classList.add('loaded');
              element.classList.remove('blur-up');
            }, 100);
          };
          
          img.onerror = () => {
            // Handle loading error
            element.classList.remove('skeleton');
            element.style.backgroundImage = 'none';
            element.style.backgroundColor = 'var(--card-bg)';
          };
          
          // Start loading the image
          img.src = imageUrl;
        }
        
        observer.unobserve(element);
      }
    });
  }, {
    rootMargin: '100px 0px', // Start loading 100px before entering viewport
    threshold: 0.01
  });

  // Observe all thumb-slide elements
  document.querySelectorAll('.thumb-slide').forEach(slide => {
    const bgImage = slide.style.backgroundImage;
    if (bgImage && bgImage !== 'none') {
      // Store original background image
      slide.style.setProperty('--bg-image', bgImage);
      // Remove background image initially
      slide.style.backgroundImage = 'none';
      // Add lazy class
      slide.classList.add('lazy-bg');
      // Start observing
      imageObserver.observe(slide);
    }
  });
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  const navbarClose = document.querySelector('.navbar-close');
  const navLinks = document.querySelectorAll('.nav-link');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const themeToggle = document.getElementById('theme-toggle');
  
  // Toggle mobile menu
  function toggleMenu() {
    const isOpen = navbarCollapse.classList.contains('show');
    const navbar = document.querySelector('.navbar');
    
    if (isOpen) {
      // Close menu
      navbarCollapse.classList.remove('show');
      document.body.classList.remove('menu-open');
      navbar.classList.remove('menu-open');
      navbarToggler.setAttribute('aria-expanded', 'false');
    } else {
      // Open menu
      navbarCollapse.classList.add('show');
      document.body.classList.add('menu-open');
      navbar.classList.add('menu-open');
      navbarToggler.setAttribute('aria-expanded', 'true');
    }
  }
  
  // Close mobile menu function
  function closeMenu() {
    const navbar = document.querySelector('.navbar');
    navbarCollapse.classList.remove('show');
    document.body.classList.remove('menu-open');
    navbar.classList.remove('menu-open');
    navbarToggler.setAttribute('aria-expanded', 'false');
  }
  
  // Event listeners
  if (navbarToggler) navbarToggler.addEventListener('click', toggleMenu);
  if (navbarClose) navbarClose.addEventListener('click', closeMenu);
  
  // Close menu when clicking outside (only on mobile)
  document.addEventListener('click', function(e) {
    if (window.innerWidth < 992) {
      if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
        closeMenu();
      }
    }
  });
  
  // Close menu when clicking on nav links (only on mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (window.innerWidth < 992) {
        // Small delay to allow navigation to start before closing menu
        setTimeout(() => {
          closeMenu();
        }, 100);
      }
    });
  });
  
  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.body.classList.remove('resize-animation-stopper');
    }, 400);
    
    // Close menu when resizing to desktop
    if (window.innerWidth >= 992) {
      closeMenu();
    }
  });
  
  // Handle escape key to close menu
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navbarCollapse.classList.contains('show')) {
      closeMenu();
    }
  });
  
  // Sync theme toggle buttons
  if (themeToggle && themeToggleMobile) {
    const syncThemeToggle = (e) => {
      const otherToggle = e.target === themeToggle ? themeToggleMobile : themeToggle;
      otherToggle.click();
    };
    
    themeToggle.addEventListener('click', syncThemeToggle);
    themeToggleMobile.addEventListener('click', syncThemeToggle);
  }
});

// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const moonIcon = document.getElementById('moon-icon');
const sunIcon = document.getElementById('sun-icon');
const html = document.documentElement;

// Check for saved user preference, if any, on load of the website
const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(savedTheme);

// Toggle theme when button is clicked
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

// Set theme function
function setTheme(theme) {
  if (theme === 'light') {
    html.setAttribute('data-theme', 'light');
    if (moonIcon) moonIcon.classList.remove('d-none');
    if (sunIcon) sunIcon.classList.add('d-none');
  } else {
    html.removeAttribute('data-theme');
    if (moonIcon) moonIcon.classList.add('d-none');
    if (sunIcon) sunIcon.classList.remove('d-none');
  }
}

// Smooth scroll & active nav highlighting
const sections = [...document.querySelectorAll('section.section, header.section')];
const navLinks = [...document.querySelectorAll('#navLinks .nav-link')];
const setActiveLink = () => {
  let index = sections.findIndex(sec => {
    const rect = sec.getBoundingClientRect();
    return rect.top <= 80 && rect.bottom >= 120;
  });
  if (index === -1) return;
  const id = sections[index].id;
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
};
document.addEventListener('scroll', setActiveLink);
setActiveLink();

// Animate skill bars
function initSkillBars() {
  const skillElements = document.querySelectorAll('.skill');
  console.log(`Found ${skillElements.length} skill elements`);
  
  skillElements.forEach((el, index) => {
    const value = Number(el.dataset.value || 0);
    console.log(`Skill ${index + 1}: ${el.dataset.label} - ${value}%`);
    
    // Remove existing elements if any
    const existingFill = el.querySelector('.fill');
    const existingValue = el.querySelector('.value');
    if (existingFill) existingFill.remove();
    if (existingValue) existingValue.remove();
    
    // Create progress bar
    const bar = document.createElement('div');
    bar.className = 'fill';
    bar.style.width = '0%';
    bar.style.height = '10px';
    bar.style.borderRadius = '999px';
    el.appendChild(bar);

    // Create percent label
    const label = document.createElement('span');
    label.className = 'value';
    label.textContent = value + '%';
    el.style.position = 'relative';
    el.appendChild(label);

    // Animate on view
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          console.log(`Animating skill: ${el.dataset.label} to ${value}%`);
          let start = 0;
          const step = () => {
            start += (value - start) * 0.08;
            bar.style.width = start.toFixed(1) + '%';
            if (Math.abs(start - value) > .5) requestAnimationFrame(step);
            else bar.style.width = value + '%';
          };
          requestAnimationFrame(step);
          el.classList.add('fill');
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });
    observer.observe(el);
  });
}

// Initialize skill bars when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSkillBars);
} else {
  initSkillBars();
}

// Back to Top Button
const backToTopButton = document.getElementById('backToTop');

// Show/hide back to top button based on scroll position
function toggleBackToTopButton() {
  if (window.scrollY > 300) {
    backToTopButton.classList.add('show');
  } else {
    backToTopButton.classList.remove('show');
  }
}

// Scroll to top when button is clicked
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Initialize back to top button
if (backToTopButton) {
  // Show/hide button on scroll
  window.addEventListener('scroll', toggleBackToTopButton);
  
  // Scroll to top on click
  backToTopButton.addEventListener('click', scrollToTop);
  
  // Initial check
  toggleBackToTopButton();
}

// Portfolio filters (hide/show static cards)
document.querySelectorAll('.filters .btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filters .btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    const cards = document.querySelectorAll('#grid > [data-tag]');
    cards.forEach(card => {
      const tag = card.dataset.tag;
      card.style.display = (filter === 'all' || tag === filter) ? '' : 'none';
    });
  });
});
