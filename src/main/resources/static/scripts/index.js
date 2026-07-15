/**
 * INDEX/HOME PAGE FUNCTIONALITY
 * Handles navigation, authentication checks, and page initialization
 */

/**
 * Initialize translator on page load
 */
function initializeTranslator() {
    if (typeof Translator !== 'undefined') {
        Translator.init();
    }
}

/**
 * Initialize language buttons
 */
function setupLanguageButtons() {
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const lang = this.getAttribute('data-lang');
            if (typeof Translator !== 'undefined') {
                Translator.setLanguage(lang);
                updateLanguageButtonStates(lang);
            }
        });
    });

    // Set active button based on current language
    if (typeof Translator !== 'undefined') {
        const currentLang = Translator.getCurrentLanguage();
        updateLanguageButtonStates(currentLang);
    }
}

/**
 * Update language button active states
 */
function updateLanguageButtonStates(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
}

/**
 * Check authentication and redirect if not logged in
 */
function checkAuthentication() {
    const authToken = localStorage.getItem('authToken');
    const isPublicPage = true; // Home page is public, no auth required

    // Home page is accessible to everyone
    if (authToken) {
        // Update button text if user is logged in
        updateNavigationForLoggedInUser();
    }
}

/**
 * Update navigation for logged-in users
 */
function updateNavigationForLoggedInUser() {
    const userEmail = localStorage.getItem('userEmail');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    // Update navigation links or show user info
    console.log('User logged in:', userEmail, 'Admin:', isAdmin);
}

/**
 * Set up navigation links
 */
function setupNavigationLinks() {
    // Register button
    const registerBtn = document.querySelector('a[href="register.html"], .btn-primary-home');
    if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
            const authToken = localStorage.getItem('authToken');
            if (authToken) {
                // User already logged in, show message or redirect
                showAlert('You are already registered. Please visit your dashboard.', 'info');
                e.preventDefault();
                setTimeout(() => {
                    const isAdmin = localStorage.getItem('isAdmin') === 'true';
                    window.location.href = isAdmin ? 'admin-dashboard.html' : 'user-dashboard.html';
                }, 1500);
            }
        });
    }

    // Login button
    const loginBtn = document.querySelector('a[href="login.html"], .btn-secondary-home');
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            const authToken = localStorage.getItem('authToken');
            if (authToken) {
                e.preventDefault();
                showAlert('You are already logged in.', 'info');
                setTimeout(() => {
                    const isAdmin = localStorage.getItem('isAdmin') === 'true';
                    window.location.href = isAdmin ? 'admin-dashboard.html' : 'user-dashboard.html';
                }, 1500);
            }
        });
    }

    // Sidebar navigation links
    const sidebarLinks = document.querySelectorAll('.nav-link-sidebar');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function () {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                // Check if auth is required for this page
                const requiresAuth = ['search.html', 'user-dashboard.html', 'admin-dashboard.html'].includes(href);

                if (requiresAuth && !localStorage.getItem('authToken')) {
                    showAlert('Please log in first.', 'warning');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                } else {
                    window.location.href = href;
                }
            }
        });
    });
}

/**
 * Set up sidebar toggle
 */
function setupSidebar() {
    const offcanvasElement = document.getElementById('sidebar');
    if (offcanvasElement) {
        // Bootstrap offcanvas is already set up via data attributes
        // Additional JS setup if needed
    }
}

/**
 * Show alert message
 */
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer') || createAlertContainer();

    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="bi bi-${getAlertIcon(type)}"></i>
        <span>${message}</span>
        <button class="close-btn" type="button" aria-label="Close">
            <i class="bi bi-x"></i>
        </button>
    `;

    alertContainer.appendChild(alert);

    const closeBtn = alert.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => alert.remove());

    // Auto-remove after 5 seconds
    setTimeout(() => alert.remove(), 5000);
}

/**
 * Create alert container if it doesn't exist
 */
function createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alertContainer';
    container.style.cssText = 'position: fixed; top: 80px; right: 20px; z-index: 1000; max-width: 400px; width: 90%;';
    document.body.appendChild(container);
    return container;
}

/**
 * Get alert icon based on type
 */
function getAlertIcon(type) {
    const icons = {
        'success': 'check-circle-fill',
        'danger': 'exclamation-circle-fill',
        'warning': 'exclamation-triangle-fill',
        'info': 'info-circle-fill'
    };
    return icons[type] || icons['info'];
}

/**
 * Add smooth scroll behavior
 */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Add animation on scroll
 */
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.feature-card, .info-section').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });
}

/**
 * Set up mobile navigation toggle
 */
function setupMobileNav() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Add mobile menu functionality if needed
    // This is usually handled by Bootstrap's navbar toggle
}

/**
 * Check if user is authenticated and update UI accordingly
 */
function updateUIForAuthentication() {
    const isAuthenticated = localStorage.getItem('authToken') !== null;
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (isAuthenticated) {
        // Hide register button and change login button text to Dashboard
        const registerBtns = document.querySelectorAll('a[href="register.html"]');
        const loginBtns = document.querySelectorAll('a[href="login.html"]');

        registerBtns.forEach(btn => {
            btn.style.display = 'none';
        });

        loginBtns.forEach(btn => {
            btn.textContent = isAdmin ? 'Admin Dashboard' : 'My Dashboard';
            btn.href = isAdmin ? 'admin-dashboard.html' : 'user-dashboard.html';
        });
    }
}

/**
 * Initialize page on DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeTranslator();
    checkAuthentication();
    setupLanguageButtons();
    setupNavigationLinks();
    setupSidebar();
    setupSmoothScroll();
    setupScrollAnimations();
    setupMobileNav();
    updateUIForAuthentication();
});

/**
 * Handle page visibility to check authentication
 */
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        checkAuthentication();
    }
});
