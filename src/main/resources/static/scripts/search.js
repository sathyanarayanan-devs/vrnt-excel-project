/**
 * SEARCH PAGE FUNCTIONALITY
 * Handles admin search, filtering, detail view, and export
 */

const SearchConfig = {
    apiBaseUrl: '/api/auth',
    usersEndpoint: '/users'
};

let allUsers = [];
let filteredUsers = [];

function checkAuthentication() {
    const authToken = localStorage.getItem('authToken');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');
    const adminDetected = isAdmin || userRole === 'admin' || (userEmail && userEmail.toLowerCase().endsWith('@vrnt.org'));

    if (!authToken || !adminDetected) {
        showAlert('Access denied. Admin access required.', 'danger');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return false;
    }

    displayUserInfo(userEmail || 'Admin');
    return true;
}

function displayUserInfo(email) {
    const userNameDisplay = document.getElementById('userNameDisplay');
    if (userNameDisplay) {
        userNameDisplay.textContent = email.split('@')[0];
    }

    const currentUserEmail = document.getElementById('currentUserEmail');
    if (currentUserEmail) {
        currentUserEmail.textContent = email;
    }
}

function initializeTranslator() {
    if (typeof Translator !== 'undefined') {
        Translator.init();
    }
}

function initializeSearchPage() {
    if (!checkAuthentication()) return;

    setupLanguageButtons();
    setupLogoutButton();
    setupSearchForm();
    loadUsers();
}

function setupLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            if (typeof Translator !== 'undefined') {
                Translator.setLanguage(lang);
                updateLanguageButtonStates(lang);
            }
        });
    });

    if (typeof Translator !== 'undefined') {
        updateLanguageButtonStates(Translator.getCurrentLanguage());
    }
}

function updateLanguageButtonStates(lang) {
    document.querySelectorAll('.lang-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
}

function setupLogoutButton() {
    const logoutBtn = document.getElementById('userProfileBtn');
    const confirmLogoutBtn = document.getElementById('confirmLogout');
    const bottomLogoutBtn = document.getElementById('logoutBottomBtn');
    const backBtn = document.getElementById('backToDashboardBtn');
    const logoutModal = document.getElementById('logoutModal');

    if (logoutBtn && logoutModal && typeof bootstrap !== 'undefined') {
        logoutBtn.addEventListener('click', () => new bootstrap.Modal(logoutModal).show());
    }

    if (bottomLogoutBtn && logoutModal && typeof bootstrap !== 'undefined') {
        bottomLogoutBtn.addEventListener('click', () => new bootstrap.Modal(logoutModal).show());
    }

    if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener('click', handleLogout);
    }

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'admin-dashboard.html';
        });
    }
}

function handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userRole');
    showAlert('Logged out successfully. Redirecting...', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1200);
}

function setupSearchForm() {
    const form = document.getElementById('searchForm');
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            performSearch();
        });
    }

    const clearBtn = document.getElementById('clearFiltersBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearSearch);
    }

    const clearFooterBtn = document.getElementById('clearFooterFiltersBtn');
    if (clearFooterBtn) {
        clearFooterBtn.addEventListener('click', clearSearch);
    }
}

function performSearch() {
    const filters = getFilterValues();
    loadUsers(filters);
}

function getFilterValues() {
    const filters = {};

    const fieldIds = [
        'firstName', 'lastName', 'mobile', 'email', 'role', 'state', 'city', 'aadhaar',
        'dateOfBirth', 'vedham', 'shaka', 'gothram', 'soothram', 'patasalai',
        'adhyapakarName', 'certifiedIn', 'yearOfCertification'
    ];

    fieldIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.value) {
            filters[id] = el.value.trim();
        }
    });

    return filters;
}

function clearSearch() {
    document.querySelectorAll('#searchForm input, #searchForm select').forEach((input) => {
        input.value = '';
    });
    loadUsers({});
}

async function loadUsers(filters = {}) {
    try {
        const authToken = localStorage.getItem('authToken');
        const usernameParam = localStorage.getItem('username') || localStorage.getItem('userEmail') || '';

        if (!usernameParam) {
            showAlert('Unable to determine authenticated user. Please log in again.', 'danger');
            setTimeout(() => window.location.href = 'login.html', 1500);
            return;
        }

        const params = new URLSearchParams({ username: usernameParam });
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            }
        });

        const response = await fetch(`${SearchConfig.apiBaseUrl}${SearchConfig.usersEndpoint}?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const body = await response.json().catch(() => null);
            const errorMessage = body?.message || 'Failed to load users.';
            throw new Error(errorMessage);
        }

        allUsers = await response.json();
        filteredUsers = [...allUsers];
        displayResults();
    } catch (error) {
        console.error(error);
        showAlert(error.message || 'Unable to load users.', 'danger');
    }
}

function displayResults() {
    const resultsCount = document.getElementById('resultCount');
    if (resultsCount) {
        resultsCount.textContent = `Found ${filteredUsers.length} user(s)`;
    }

    const tbody = document.getElementById('resultsBody');
    const emptyState = document.getElementById('emptyState');
    const detailsContainer = document.getElementById('detailsContainer');

    if (!tbody) return;

    if (!filteredUsers.length) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        detailsContainer.innerHTML = '';
        return;
    }

    emptyState.style.display = 'none';

    tbody.innerHTML = filteredUsers.map((user, index) => `
        <tr>
            <td>${escapeHtml(formatName(user))}</td>
            <td>${escapeHtml(user.username || '-')}</td>
            <td>${escapeHtml(user.email || '-')}</td>
            <td>${escapeHtml(user.mobile || '-')}</td>
            <td>${escapeHtml(user.role || '-')}</td>
            <td>${escapeHtml(user.state || '-')}</td>
            <td>${escapeHtml(user.city || '-')}</td>
            <td>${escapeHtml(user.vedham || '-')}</td>
            <td>${escapeHtml(user.gothram || '-')}</td>
            <td>${escapeHtml(user.certifiedIn || '-')}</td>
            <td>
                <button class="btn-view" type="button" onclick="viewUserDetails(${index})">View</button>
            </td>
        </tr>
    `).join('');
}

function viewUserDetails(index) {
    const user = filteredUsers[index];
    if (!user) return;

    const detailsContainer = document.getElementById('detailsContainer');
    if (!detailsContainer) return;

    detailsContainer.innerHTML = `
        <div class="user-details-card">
            <div class="card-header">Application for ${escapeHtml(formatName(user))}</div>
            <div class="card-body">
                <div class="detail-list">
                    <div class="detail-pill"><span class="label">Applicant Name</span><span class="value">${escapeHtml(formatName(user))}</span></div>
                    <div class="detail-pill"><span class="label">Username</span><span class="value">${escapeHtml(user.username || '-')}</span></div>
                    <div class="detail-pill"><span class="label">Email</span><span class="value">${escapeHtml(user.email || '-')}</span></div>
                    <div class="detail-pill"><span class="label">Mobile</span><span class="value">${escapeHtml(user.mobile || '-')}</span></div>
                    <div class="detail-pill"><span class="label">Role</span><span class="value">${escapeHtml(user.role || '-')}</span></div>
                    <div class="detail-pill"><span class="label">State</span><span class="value">${escapeHtml(user.state || '-')}</span></div>
                    <div class="detail-pill"><span class="label">District / City</span><span class="value">${escapeHtml(user.city || '-')}</span></div>
                    <div class="detail-pill"><span class="label">Aadhaar</span><span class="value">${escapeHtml(user.aadhaar || '-')}</span></div>
                    <div class="detail-pill"><span class="label">Date of Birth</span><span class="value">${escapeHtml(formatDate(user.dateOfBirth))}</span></div>
                    <div class="detail-pill"><span class="label">Street Address 1</span><span class="value">${escapeHtml(user.street1 || '-')}</span></div>
                    <div class="detail-pill"><span class="label">Street Address 2</span><span class="value">${escapeHtml(user.street2 || '-')}</span></div>
                    <div class="detail-pill"><span class="label">Postal Code</span><span class="value">${escapeHtml(user.postalCode || '-')}</span></div>
                    <div class="detail-pill"><span class="label">Vedham</span><span class="value">${escapeHtml(user.vedham || '-')}</span></div>
                    <div class="detail-pill"><span class="label">Shaka</span><span class="value">${escapeHtml(user.shaka || '-')}</span></div>
                    <div class="detail-pill"><span class="label">Gothram</span><span class="value">${escapeHtml(user.gothram || '-')}</span></div>
                    <div class="detail-pill"><span class="label">Soothram</span><span class="value">${escapeHtml(user.soothram || '-')}</span></div>
                    <div class="detail-pill"><span class="label">Patasalai</span><span class="value">${escapeHtml(user.patasalai || '-')}</span></div>
                    <div class="detail-pill"><span class="label">Veda Adhyapakar</span><span class="value">${escapeHtml(user.adhyapakarName || '-')}</span></div>
                    <div class="detail-pill"><span class="label">Certified In</span><span class="value">${escapeHtml(user.certifiedIn || '-')}</span></div>
                    <div class="detail-pill"><span class="label">Year of Certification</span><span class="value">${escapeHtml(user.yearOfCertification || '-')}</span></div>
                    <div class="detail-pill"><span class="label">Certificate</span><span class="value">${buildDownloadLink(user.certificatePath, 'Certificate')}</span></div>
                    <div class="detail-pill"><span class="label">Photo</span><span class="value">${buildDownloadLink(user.photoPath, 'Photo')}</span></div>
                </div>
            </div>
        </div>
    `;
}

function buildDownloadLink(filePath, label) {
    if (!filePath) {
        return '<span class="text-muted">Not uploaded</span>';
    }

    const normalized = String(filePath).replace(/\\/g, '/');
    const fileName = normalized.split('/').pop();
    const downloadUrl = `/api/auth/files/${encodeURIComponent(fileName)}`;
    return `<a class="download-link" href="${downloadUrl}" target="_blank" rel="noopener noreferrer"><i class="bi bi-download"></i> ${escapeHtml(label)}</a>`;
}

function exportFilteredUsers(format) {
    if (!filteredUsers.length) {
        showAlert('There are no filtered users to export.', 'warning');
        return;
    }
    exportTo(format, filteredUsers, 'filtered_users');
}

function exportAllUsers(format) {
    if (!allUsers.length) {
        showAlert('There are no users to export.', 'warning');
        return;
    }
    exportTo(format, allUsers, 'all_users');
}

function exportTo(format, data, filenamePrefix) {
    const blob = new Blob([convertToCSV(data)], { type: format === 'excel' ? 'application/vnd.ms-excel;charset=utf-8;' : 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `${filenamePrefix}_${new Date().getTime()}.${format === 'excel' ? 'xlsx' : 'csv'}`;
    link.click();
    URL.revokeObjectURL(url);
    showAlert(`${format === 'excel' ? 'Excel' : 'CSV'} export started successfully.`, 'success');
}

function convertToCSV(data) {
    const headers = ['First Name', 'Last Name', 'Username', 'Email', 'Mobile', 'Role', 'State', 'District / City', 'Aadhaar', 'Date of Birth', 'Vedham', 'Gothram', 'Certified In', 'Year of Certification'];
    const rows = data.map((user) => [
        user.firstName || '',
        user.lastName || '',
        user.username || '',
        user.email || '',
        user.mobile || '',
        user.role || '',
        user.state || '',
        user.city || '',
        user.aadhaar || '',
        formatDate(user.dateOfBirth),
        user.vedham || '',
        user.gothram || '',
        user.certifiedIn || '',
        user.yearOfCertification || ''
    ]);

    let csv = headers.map((header) => `"${header}"`).join(',') + '\n';
    csv += rows.map((row) => row.map((cell) => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    return csv;
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatName(user) {
    const first = user.firstName || '';
    const last = user.lastName || '';
    const fullName = `${first} ${last}`.trim();
    return fullName || user.username || user.email || 'Unknown';
}

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
    alert.querySelector('.close-btn').addEventListener('click', () => alert.remove());
    setTimeout(() => alert.remove(), 5000);
}

function createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alertContainer';
    container.style.cssText = 'position: fixed; top: 80px; right: 20px; z-index: 1000; max-width: 400px; width: 90%;';
    document.body.appendChild(container);
    return container;
}

function getAlertIcon(type) {
    const icons = {
        success: 'check-circle-fill',
        danger: 'exclamation-circle-fill',
        warning: 'exclamation-triangle-fill',
        info: 'info-circle-fill'
    };
    return icons[type] || icons.info;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeTranslator();
    initializeSearchPage();
});
