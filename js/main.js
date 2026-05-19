/* ============================
   Flor Masajes - Main JS
   ============================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollHeader();
  initBackToTop();
  initScrollAnimations();
  initActiveLink();
  initContactForm();
});

/* ---------- Mobile Navigation ---------- */
function initNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeMenu() {
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (navClose) {
    navClose.addEventListener('click', closeMenu);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)) {
      closeMenu();
    }
  });
}

/* ---------- Scroll Header ---------- */
function initScrollHeader() {
  const header = document.getElementById('header');
  const scrollThreshold = 80;

  function updateHeader() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', throttle(updateHeader, 100));
  updateHeader();
}

/* ---------- Back to Top ---------- */
function initBackToTop() {
  const backToTop = document.getElementById('back-to-top');
  if (!backToTop) return;

  function toggleVisibility() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', throttle(toggleVisibility, 100));
}

/* ---------- Scroll Animations ---------- */
function initScrollAnimations() {
  const elements = document.querySelectorAll(
    '.service-card, .pricing-card, .schedule-card, .about__content, .about__image-wrapper, .contact__info, .contact__form-wrapper'
  );

  elements.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ---------- Active Link on Scroll ---------- */
function initActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function setActiveLink() {
    const scrollY = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active-link');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active-link');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', throttle(setActiveLink, 100));
}

/* ---------- Contact Form ---------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;
    const sessionType = document.getElementById('session-type').value;
    const message = document.getElementById('message').value.trim();

    let whatsappMessage = `Hola Flor! Soy ${name}.%0A`;
    whatsappMessage += `Me gustaría consultar por: ${getServiceName(service)}.%0A`;
    if (sessionType) whatsappMessage += `Duración: ${getSessionName(sessionType)}%0A`;
    if (phone) whatsappMessage += `Mi teléfono: ${phone}%0A`;
    if (message) whatsappMessage += `${message}`;

    // Redirect to WhatsApp
    window.open(`https://wa.me/59891910970?text=${whatsappMessage}`, '_blank');

    form.reset();
    showNotification('¡Mensaje enviado! Te redirigimos a WhatsApp.');
  });
}

function getServiceName(value) {
  const services = {
    relajante: 'Masaje Relajante',
    descontracturante: 'Descontracturante',
    integral: 'Masaje Integral',
  };
  return services[value] || value;
}

function getSessionName(value) {
  const sessions = {
    '30min': '30 min - Solo espalda ($1200)',
    '45min': '45 min - Cuerpo completo ($2000)',
  };
  return sessions[value] || value;
}

/* ---------- Notification ---------- */
function showNotification(message) {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;

  Object.assign(notification.style, {
    position: 'fixed',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%) translateY(20px)',
    background: '#3d3229',
    color: '#fff',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontFamily: "'Montserrat', sans-serif",
    zIndex: '9999',
    opacity: '0',
    transition: '0.3s ease',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  });

  document.body.appendChild(notification);

  requestAnimationFrame(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/* ---------- Utility ---------- */
function throttle(fn, delay) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    }
  };
}
