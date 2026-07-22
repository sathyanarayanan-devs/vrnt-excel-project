/**
 * LOGIN PAGE FUNCTIONALITY
 * Handles user authentication and login form submission
 */

const LoginConfig = {
    apiBaseUrl: '/api/auth',
    loginEndpoint: '/login',
    redirectDelay: 2000
};

/**
 * Initialize translator on page load
 */
function initializeTranslator() {
    if (typeof Translator !== 'undefined') {
        Translator.init();
    }
}

function getText(key, fallback = '') {
    return (typeof Translator !== 'undefined' && Translator.getTranslation)
        ? Translator.getTranslation(key)
        : fallback;
}

/**
 * Initialize login form on page load
 */
function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', handleLoginSubmit);
}

/**
 * Handle form submission
 */
async function handleLoginSubmit(e) {
    e.preventDefault();

    const usernameOrEmail = document.getElementById('uname').value.trim();
    const password = document.getElementById('pwd').value.trim();
    const rememberMe = document.getElementById('rememberMe')?.checked || false;

    // Validate fields
    if (!usernameOrEmail || !password) {
        showAlert(getText('login.fillAllFields', 'Please fill in all fields'), 'warning');
        return;
    }

    // If user entered an email, validate it; usernames are allowed too.
    if (usernameOrEmail.includes('@') && !isValidEmail(usernameOrEmail)) {
        showAlert(getText('login.validEmailOrUsername', 'Please enter a valid email address or username'), 'warning');
        return;
    }

    // Disable submit button and show loading state
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border"></span> ${getText('login.inProgress', 'Logging in...')}`;

    try {
        const response = await fetch(`${LoginConfig.apiBaseUrl}${LoginConfig.loginEndpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: usernameOrEmail, password })
        });

        const body = await response.json().catch(() => ({}));
        const data = body?.data || body || {};

        if (response.ok) {
            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }

            // Store login identifier and role for page routing
            localStorage.setItem('userEmail', usernameOrEmail);
            localStorage.setItem('username', data.username || usernameOrEmail.split('@')[0]);
            localStorage.setItem('userRole', data.role || 'normal');
            const isAdmin = data.role === 'admin';
            localStorage.setItem('isAdmin', isAdmin.toString());

            // Remember me functionality
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
                localStorage.setItem('rememberedEmail', usernameOrEmail);
            } else {
                localStorage.removeItem('rememberMe');
                localStorage.removeItem('rememberedEmail');
            }

            showAlert(getText('login.successRedirect', 'Login successful! Redirecting...'), 'success');

            // Redirect to appropriate dashboard
            setTimeout(() => {
                const redirectUrl = isAdmin ? 'admin-dashboard.html' : 'user-dashboard.html';
                window.location.href = redirectUrl;
            }, LoginConfig.redirectDelay);
        } else {
            showAlert(data.message || getText('login.failed', 'Login failed. Please try again.'), 'danger');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert(getText('login.error', 'An error occurred. Please try again.'), 'danger');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
    container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 1000; max-width: 400px; width: 90%;';
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
 * Populate remembered email if available
 */
function populateRememberedEmail() {
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    const rememberedEmail = localStorage.getItem('rememberedEmail');

    if (rememberMe && rememberedEmail) {
        const emailInput = document.getElementById('uname');
        const rememberCheckbox = document.getElementById('rememberMe');

        if (emailInput) emailInput.value = rememberedEmail;
        if (rememberCheckbox) rememberCheckbox.checked = true;
    }
}

/**
 * Set up language buttons
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
 * Validate form fields on input
 */
function setupFieldValidation() {
    const emailInput = document.getElementById('uname');
    const passwordInput = document.getElementById('pwd');

    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            if (emailInput.value && !isValidEmail(emailInput.value)) {
                emailInput.classList.add('is-invalid');
            } else {
                emailInput.classList.remove('is-invalid');
            }
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('blur', () => {
            if (passwordInput.value && passwordInput.value.length < 6) {
                passwordInput.classList.add('is-invalid');
            } else {
                passwordInput.classList.remove('is-invalid');
            }
        });
    }
}

/**
 * Clear authentication data when page unloads
 */
function setupSecurityCleanup() {
    window.addEventListener('beforeunload', () => {
        // Optional: Clear sensitive data if user closes tab
        // localStorage.removeItem('authToken');
    });
}

/**
 * Initialize page on DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeTranslator();
    populateRememberedEmail();
    setupLanguageButtons();
    setupFieldValidation();
    initializeLoginForm();
    setupSecurityCleanup();
});
