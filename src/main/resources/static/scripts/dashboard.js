/**
 * DASHBOARD PAGE FUNCTIONALITY
 * Handles user and admin dashboard display and logout
 */

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
 * Check authentication
 */
function checkAuthentication() {
    const authToken = localStorage.getItem('authToken');
    const userEmail = localStorage.getItem('userEmail');

    if (!authToken || !userEmail) {
        showAlert(getText('dashboard.sessionExpired', 'Session expired. Redirecting to login...'), 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return false;
    }

    return { token: authToken, email: userEmail };
}

/**
 * Initialize dashboard page
 */
function initializeDashboard() {
    const auth = checkAuthentication();
    if (!auth) return;

    setupLanguageButtons();
    setupLogoutButton();

    // Determine if this is user or admin dashboard based on email
    const isAdmin = auth.email.endsWith('@vrnt.org');

    if (isAdmin) {
        initializeAdminDashboard(auth);
    } else {
        initializeUserDashboard(auth);
    }
}

/**
 * Initialize user dashboard
 */
function initializeUserDashboard(auth) {
    loadUserDetails(auth);
}

/**
 * Initialize admin dashboard
 */
function initializeAdminDashboard(auth) {
    displayAdminInfo(auth.email);
    loadAdminStatistics(auth);
}

/**
 * Load user details
 */
async function loadUserDetails(auth) {
    try {
        const response = await fetch(`/api/auth/user-details`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`,
                'Content-Type': 'application/json'
            }
        });

        const payload = await response.json().catch(() => null);
        const user = payload?.data || payload;

        if (response.ok && user && (user.firstName || user.email || user.username || user.lastName)) {
            displayUserDetails(user);
            return;
        }
    } catch (error) {
        console.error('Error loading user details:', error);
    }

    loadUserDetailsFromLocal();
}

/**
 * Load user details from localStorage
 */
function loadUserDetailsFromLocal() {
    const userEmail = localStorage.getItem('userEmail');
    const storedUserData = localStorage.getItem('registrationFormData')
        || localStorage.getItem('registrationPreviewData')
        || localStorage.getItem('previewData');

    if (storedUserData) {
        try {
            const user = JSON.parse(storedUserData);
            user.email = user.email || userEmail;
            displayUserDetails(user);
        } catch (e) {
            console.error('Error parsing stored user data:', e);
        }
    }
}

/**
 * Display user details
 */
function displayUserDetails(user) {
    const profileSection = document.querySelector('.details-section');
    if (!profileSection) return;

    updateUserDashboardHeader(user);

    const details = [
        [getText('form.firstName', 'First Name'), user.firstName],
        [getText('form.lastName', 'Last Name'), user.lastName],
        [getText('form.email', 'Email'), user.email],
        [getText('form.mobile', 'Mobile'), user.mobile],
        [getText('form.aadhaar', 'Aadhaar'), user.aadhaar],
        [getText('form.dob', 'Date of Birth'), formatDate(user.dateOfBirth)],
        [getText('form.city', 'City'), user.city],
        [getText('form.state', 'State'), user.state],
        [getText('form.vedham', 'Vedham'), user.vedham],
        [getText('form.gothram', 'Gothram'), user.gothram],
        [getText('form.certified', 'Certified In'), user.certifiedIn],
        [getText('form.yearCert', 'Year of Certification'), user.yearOfCertification]
    ];

    const detailsGrid = profileSection.querySelector('.details-grid');
    if (!detailsGrid) return;

    detailsGrid.innerHTML = `
        <div class="profile-summary-card">
            <div class="profile-summary-header">
                <div>
                    <h3>${escapeHtml(user.firstName || 'User')} ${escapeHtml(user.lastName || '')}</h3>
                    <p>${escapeHtml(user.email || getText('dashboard.user.noEmail', 'No email available'))}</p>
                </div>
                <span class="profile-badge">${escapeHtml(user.role || getText('dashboard.user.member', 'Member'))}</span>
            </div>
            ${details.map(([label, value]) => `
                <div class="detail-item">
                    <div class="detail-label">${escapeHtml(label)}</div>
                    <div class="detail-value">${escapeHtml(value || '-')}</div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Display admin info
 */
function updateUserDashboardHeader(user) {
    const dashboardHeader = document.querySelector('.dashboard-header');
    if (!dashboardHeader) return;

    const displayName = [user?.firstName, user?.lastName]
        .filter(Boolean)
        .join(' ')
        .trim() || user?.username || user?.email?.split('@')[0] || getText('dashboard.user.defaultName', 'User');

    const welcomeTitle = typeof Translator !== 'undefined' && Translator.getTranslation
        ? Translator.getTranslation('dashboard.user.welcome')
        : 'Welcome';
    const subtitle = typeof Translator !== 'undefined' && Translator.getTranslation
        ? Translator.getTranslation('dashboard.user.subtitle')
        : 'View and manage your profile information';
    const meta = typeof Translator !== 'undefined' && Translator.getTranslation
        ? Translator.getTranslation('dashboard.user.meta')
        : 'Last updated: Just now';

    dashboardHeader.innerHTML = `
        <h1>${escapeHtml(`${welcomeTitle}, ${displayName}`)}</h1>
        <p>${escapeHtml(subtitle)}</p>
        <div class="header-meta">${escapeHtml(meta)}</div>
    `;
}

function displayAdminInfo(email) {
    const adminName = email.split('@')[0];
    const dashboardHeader = document.querySelector('.dashboard-header');

    if (dashboardHeader) {
        const welcomeKey = typeof Translator !== 'undefined' && Translator.getTranslation
            ? Translator.getTranslation('dashboard.admin.welcome')
            : 'Admin Dashboard';
        const subtitle = typeof Translator !== 'undefined' && Translator.getTranslation
            ? Translator.getTranslation('dashboard.admin.subtitle')
            : 'Manage and view all registered users';
        const meta = typeof Translator !== 'undefined' && Translator.getTranslation
            ? Translator.getTranslation('dashboard.admin.meta')
            : 'You have full administrative access';

        dashboardHeader.innerHTML = `
            <h1>${escapeHtml(`${welcomeKey}, ${adminName}`)}</h1>
            <p>${escapeHtml(subtitle)}</p>
            <div class="header-meta">${escapeHtml(meta)}</div>
        `;
    }
}

/**
 * Load admin statistics
 */
async function loadAdminStatistics(auth) {
    try {
        const response = await fetch(`/api/auth/users/count`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`,
                'Content-Type': 'application/json'
            }
        });

        let userCount = 0;
        if (response.ok) {
            const payload = await response.json();
            userCount = payload?.data?.count || payload?.count || 0;
        }

        displayAdminCards(userCount);
    } catch (error) {
        console.error('Error loading statistics:', error);
        displayAdminCards(0);
    }
}

/**
 * Display admin dashboard cards
 */
function displayAdminCards(userCount) {
    const cardsGrid = document.querySelector('.cards-grid');

    if (!cardsGrid) return;

    const cardsHtml = `
        <div class="card">
            <i class="bi bi-people-fill card-icon"></i>
            <div class="card-title">${getText('dashboard.admin.cardTotalUsers', 'Total Users')}</div>
            <div class="card-value">${userCount}</div>
            <div class="card-subtitle">${getText('dashboard.admin.registeredUsers', 'Registered users in system')}</div>
        </div>
        <div class="card">
            <i class="bi bi-search card-icon"></i>
            <div class="card-title">${getText('dashboard.admin.cardSearch', 'Search & Manage')}</div>
            <div class="card-value">${getText('dashboard.admin.cardReady', 'Ready')}</div>
            <div class="card-subtitle">${getText('dashboard.admin.cardSearchSubtitle', 'Access user search and management')}</div>
        </div>
        <div class="card">
            <i class="bi bi-file-earmark-text card-icon"></i>
            <div class="card-title">${getText('dashboard.admin.cardExport', 'Export Data')}</div>
            <div class="card-value">${getText('dashboard.admin.cardAvailable', 'Available')}</div>
            <div class="card-subtitle">${getText('dashboard.admin.cardExportSubtitle', 'Export user data to Excel/CSV')}</div>
        </div>
    `;

    cardsGrid.innerHTML = cardsHtml;
}

/**
 * Set up logout button
 */
function setupLogoutButton() {
    const logoutBtn = document.querySelector('.btn-logout');
    const logoutConfirmModal = document.getElementById('logoutModal');
    const confirmLogoutBtn = document.getElementById('confirmLogout');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (logoutConfirmModal && typeof bootstrap !== 'undefined') {
                new bootstrap.Modal(logoutConfirmModal).show();
            } else {
                handleLogout();
            }
        });
    }

    if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener('click', handleLogout);
    }
}

/**
 * Handle logout
 */
function handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userRole');

    showAlert(getText('dashboard.logoutSuccess', 'Logged out successfully. Redirecting...'), 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
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
 * Format date
 */
function formatDate(dateString) {
    if (!dateString || dateString === '-') return '-';
    if (typeof dateString === 'string' && dateString.includes('-')) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
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
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

/**
 * Initialize page on DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeTranslator();
    initializeDashboard();
});

/**
 * Setup search button for admin
 */
function setupSearchNavigation() {
    const searchBtn = document.querySelector('[data-action="go-to-search"]');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            window.location.href = 'search.html';
        });
    }
}

// Call this after page loads
document.addEventListener('DOMContentLoaded', () => {
    setupSearchNavigation();
});
