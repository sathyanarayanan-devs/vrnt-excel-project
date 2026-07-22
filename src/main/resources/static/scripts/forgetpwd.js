/**
 * FORGOT PASSWORD PAGE FUNCTIONALITY
 * Handles password reset flow
 */

const ForgotConfig = {
    apiBaseUrl: '/api/auth',
    resetEndpoint: '/forgot-password',
    redirectDelay: 3000
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
 * Initialize forgot password form on page load
 */
function initializeForgotForm() {
    const forgotForm = document.getElementById('forgotForm');
    if (!forgotForm) return;

    forgotForm.addEventListener('submit', handleForgotSubmit);
}

/**
 * Handle forgot password form submission
 */
async function handleForgotSubmit(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();

    // Validate field
    if (!email) {
        showAlert(getText('forgot.enterEmail', 'Please enter your email address'), 'warning');
        return;
    }

    // Email validation
    if (!isValidEmail(email)) {
        showAlert(getText('forgot.validEmail', 'Please enter a valid email address'), 'warning');
        return;
    }

    // Disable submit button and show loading state
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border"></span> ${getText('forgot.sending', 'Sending...')}`;

    try {
        const response = await fetch(`${ForgotConfig.apiBaseUrl}${ForgotConfig.resetEndpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            showSuccessMessage(email);

            setTimeout(() => {
                window.location.href = 'login.html';
            }, ForgotConfig.redirectDelay);
        } else {
            showAlert(data.message || getText('forgot.failed', 'Failed to process your request. Please try again.'), 'danger');
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        showAlert(getText('forgot.errorLater', 'An error occurred. Please try again later.'), 'danger');
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
 * Show success message
 */
function showSuccessMessage(email) {
    const form = document.getElementById('forgotForm');
    if (!form) return;

    // Hide form
    form.style.display = 'none';

    // Create success message container
    const successContainer = document.createElement('div');
    successContainer.className = 'success-message show';
    successContainer.innerHTML = `
        <div style="text-align: center; padding: 30px;">
            <i class="bi bi-check-circle" style="font-size: 48px; margin-bottom: 15px; display: block;"></i>
            <h4 style="margin-bottom: 10px;">${getText('forgot.successTitle', 'Email Sent Successfully!')}</h4>
            <p style="margin-bottom: 20px;">
                ${getText('forgot.successMessage', "We've sent a password reset link to")} <strong>${escapeHtml(email)}</strong>
            </p>
            <p style="font-size: 13px; color: #6c757d; margin-bottom: 0;">
                ${getText('forgot.successInstruction', 'Please check your email and follow the link to reset your password. If you do not see the email, please check your spam folder.')}
            </p>
        </div>
    `;

    const forgotBody = form.closest('.forgot-body') || form.parentElement;
    forgotBody.appendChild(successContainer);

    showAlert(getText('forgot.resetSentRedirect', 'Password reset link sent! Redirecting to login...'), 'success');
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
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
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
    const emailInput = document.getElementById('email');

    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            if (emailInput.value && !isValidEmail(emailInput.value)) {
                emailInput.classList.add('is-invalid');
            } else {
                emailInput.classList.remove('is-invalid');
            }
        });

        emailInput.addEventListener('focus', () => {
            emailInput.classList.remove('is-invalid');
        });
    }
}

/**
 * Set up back to login link
 */
function setupBackLink() {
    const backLink = document.querySelector('.back-to-login a, a[href="login.html"]');
    if (backLink) {
        backLink.addEventListener('click', (e) => {
            // Allow normal link behavior
        });
    }
}

/**
 * Initialize page on DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeTranslator();
    setupLanguageButtons();
    setupFieldValidation();
    initializeForgotForm();
    setupBackLink();
});
