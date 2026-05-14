// ===========================
// DevFlow — main.js
// ===========================

// --- Utility functions (these are tested in tests/app.test.js) ---

/**
 * Validates an email address format.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Sanitises a string: trims whitespace and removes HTML tags.
 * @param {string} str
 * @returns {string}
 */
function sanitiseInput(str) {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/<[^>]*>/g, '');
}

/**
 * Formats a timestamp into a readable date string.
 * @param {Date|string} date
 * @returns {string}
 */
function formatDate(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid date';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/**
 * Truncates a string to a given length with ellipsis.
 * @param {string} str
 * @param {number} maxLen
 * @returns {string}
 */
function truncate(str, maxLen) {
  if (typeof str !== 'string') return '';
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trimEnd() + '…';
}

// Export for Node.js / test environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { isValidEmail, sanitiseInput, formatDate, truncate };
}

// --- Contact form handler ---
function handleSubmit(event) {
  event.preventDefault();
  const name    = sanitiseInput(document.getElementById('name').value);
  const email   = document.getElementById('email').value;
  const message = sanitiseInput(document.getElementById('message').value);
  const status  = document.getElementById('form-status');

  if (!name || !message) {
    status.style.color = '#f87171';
    status.textContent = 'Please fill in all fields.';
    return;
  }
  if (!isValidEmail(email)) {
    status.style.color = '#f87171';
    status.textContent = 'Please enter a valid email address.';
    return;
  }

  // Simulate a successful submission (replace with real API call)
  status.style.color = '#22c55e';
  status.textContent = '✓ Message sent! We\'ll be in touch.';
  document.getElementById('contactForm').reset();
}

// --- Scroll-triggered animations (browser only) ---
if (typeof document !== 'undefined') {
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.pipe-step, .feature-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  // Stagger children on scroll-in
  document.querySelectorAll('.visible').forEach((el, i) => {
    el.style.transitionDelay = `${i * 60}ms`;
  });
});

document.addEventListener('animationend', (e) => {
  if (e.target.classList.contains('pipe-step') || e.target.classList.contains('feature-card')) {
    e.target.style.opacity = '1';
    e.target.style.transform = 'translateY(0)';
  }
});

// Helper: add 'visible' class styles via JS (since we set opacity inline)
const style = document.createElement('style');
style.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);
} // end browser-only guard
