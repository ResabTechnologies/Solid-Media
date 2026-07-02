/**
 * Solid Media — Main JavaScript
 * Features: Loading screen, sticky navbar, scroll animations,
 *           animated counters, back-to-top, WhatsApp form, particles
 */

'use strict';

/* ============================================================
   LOADING SCREEN
   ============================================================ */
window.addEventListener('load', () => {
    const screen = document.getElementById('loadingScreen');
    if (!screen) return;
    setTimeout(() => {
        screen.classList.add('hidden');
        // Trigger hero animations after load
        document.querySelectorAll('[data-aos]').forEach(el => {
            if (isInViewport(el)) el.classList.add('aos-animate');
        });
    }, 1900);
});


/* ============================================================
   STICKY NAVBAR
   ============================================================ */
const navbar = document.getElementById('mainNavbar');

const handleNavbarScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
};

window.addEventListener('scroll', handleNavbarScroll, { passive: true });


/* ============================================================
   SMOOTH SCROLL FOR NAV LINKS
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();

        const navHeight = navbar ? navbar.offsetHeight : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;

        window.scrollTo({ top, behavior: 'smooth' });

        // Close mobile nav if open
        const navCollapse = document.getElementById('navbarNav');
        if (navCollapse && navCollapse.classList.contains('show')) {
            const toggler = document.querySelector('.navbar-toggler');
            if (toggler) toggler.click();
        }
    });
});


/* ============================================================
   SCROLL REVEAL (AOS-style, custom lightweight)
   ============================================================ */
function isInViewport(el, offset = 80) {
    const rect = el.getBoundingClientRect();
    return rect.top <= (window.innerHeight - offset);
}

function handleScrollReveal() {
    document.querySelectorAll('[data-aos]').forEach(el => {
        if (isInViewport(el)) {
            const delay = parseInt(el.getAttribute('data-aos-delay') || '0');
            setTimeout(() => el.classList.add('aos-animate'), delay);
        }
    });
}

// Throttle scroll handler for performance
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            handleScrollReveal();
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });


/* ============================================================
   ANIMATED COUNTERS
   ============================================================ */
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target') || '0');
    const duration = 2000; // ms
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current);
    }, 16);
}

// Observe counters
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
            entry.target.dataset.counted = 'true';
            animateCounter(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));


/* ============================================================
   BACK TO TOP BUTTON
   ============================================================ */
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


/* ============================================================
   WHATSAPP ENQUIRY FORM
   ============================================================ */
function sendToWhatsApp() {
    // Collect form values
    const name    = document.getElementById('waName')?.value.trim();
    const phone   = document.getElementById('waPhone')?.value.trim();
    const email   = document.getElementById('waEmail')?.value.trim();
    const service = document.getElementById('waService')?.value;
    const message = document.getElementById('waMessage')?.value.trim();

    // Basic validation
    if (!name) {
        showFormAlert('Please enter your full name.', 'warning');
        document.getElementById('waName')?.focus();
        return;
    }
    if (!phone) {
        showFormAlert('Please enter your phone number.', 'warning');
        document.getElementById('waPhone')?.focus();
        return;
    }
    if (!service) {
        showFormAlert('Please select a service you are interested in.', 'warning');
        document.getElementById('waService')?.focus();
        return;
    }
    if (!message) {
        showFormAlert('Please enter your message.', 'warning');
        document.getElementById('waMessage')?.focus();
        return;
    }

    // Build WhatsApp message
    const waNumber = '919497212097';
    let waMsg = `*New Enquiry from Solid Media Website*\n\n`;
    waMsg += `👤 *Name:* ${name}\n`;
    waMsg += `📞 *Phone:* ${phone}\n`;
    if (email) waMsg += `📧 *Email:* ${email}\n`;
    waMsg += `🎯 *Service:* ${service}\n\n`;
    waMsg += `💬 *Message:*\n${message}\n\n`;
    waMsg += `---\n_Sent via Solid Media Website_`;

    const encodedMsg = encodeURIComponent(waMsg);
    const waUrl = `https://wa.me/${waNumber}?text=${encodedMsg}`;

    // Open WhatsApp
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    // Success feedback
    showFormAlert('Opening WhatsApp... Your message has been pre-filled!', 'success');
}

function showFormAlert(msg, type) {
    // Remove existing alert
    const existing = document.getElementById('formAlert');
    if (existing) existing.remove();

    const colors = {
        success: { bg: '#d1fae5', border: '#10b981', text: '#065f46', icon: 'fa-check-circle' },
        warning: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', icon: 'fa-exclamation-triangle' },
        error:   { bg: '#fee2e2', border: '#ef4444', text: '#991b1b', icon: 'fa-times-circle' },
    };
    const c = colors[type] || colors.warning;

    const alert = document.createElement('div');
    alert.id = 'formAlert';
    alert.style.cssText = `
        background: ${c.bg};
        border: 1px solid ${c.border};
        color: ${c.text};
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 0.88rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;
        animation: slideDown 0.3s ease;
    `;
    alert.innerHTML = `<i class="fas ${c.icon}"></i> ${msg}`;

    const btn = document.getElementById('sendWhatsApp');
    if (btn) btn.parentNode.insertBefore(alert, btn);

    // Auto-dismiss after 5 seconds
    setTimeout(() => { if (alert.parentNode) alert.remove(); }, 5000);
}

// Make sendToWhatsApp available globally
window.sendToWhatsApp = sendToWhatsApp;


/* ============================================================
   HERO PARTICLES
   ============================================================ */
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const count = 30;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.setProperty('--dur', (8 + Math.random() * 12) + 's');
        p.style.setProperty('--delay', (Math.random() * 10) + 's');
        p.style.opacity = 0;
        container.appendChild(p);
    }
}

createParticles();


/* ============================================================
   NAVBAR ACTIVE STATE on SCROLL
   ============================================================ */
function setActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
    const navHeight = navbar ? navbar.offsetHeight + 20 : 100;

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight;
        if (window.scrollY >= sectionTop) {
            current = '#' + section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveNavLink, { passive: true });


/* ============================================================
   SERVICE CARD TILT EFFECT (subtle)
   ============================================================ */
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-6px) rotateX(${y * -6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});


/* ============================================================
   CSS ANIMATION FOR FORM ALERT
   ============================================================ */
const styleEl = document.createElement('style');
styleEl.textContent = `
    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-8px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    .navbar-nav .nav-link.active {
        color: #D4AF37 !important;
    }
`;
document.head.appendChild(styleEl);


/* ============================================================
   INITIAL TRIGGER — run on DOMContentLoaded
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    handleNavbarScroll();
    handleScrollReveal();

    // Toggle solid background on mobile menu expand
    const navbarNav = document.getElementById('navbarNav');
    const mainNavbar = document.getElementById('mainNavbar');
    if (navbarNav && mainNavbar) {
        navbarNav.addEventListener('show.bs.collapse', () => {
            mainNavbar.classList.add('scrolled');
        });
        navbarNav.addEventListener('hide.bs.collapse', () => {
            if (window.scrollY <= 60) {
                mainNavbar.classList.remove('scrolled');
            }
        });
    }
});
