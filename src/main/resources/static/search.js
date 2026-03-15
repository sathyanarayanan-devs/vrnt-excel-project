// ── CONFIG ────────────────────────────────────────────
const API_BASE   = 'http://localhost:8080';

// ── STATE ─────────────────────────────────────────────
let currentPage    = 1;
const PER_PAGE     = 10;
let currentResults = [];
let expandedRow    = null;
let sessionStart   = new Date();

// ── ON PAGE LOAD ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {

    // ── Check login ───────────────────────────────────
    const role     = localStorage.getItem('role');
    const username = localStorage.getItem('username');
    const fullName = localStorage.getItem('fullName');

    if (!role || !username) {
        window.location.href = 'login.html';
        return;
    }

    // ── Show logged-in user info ──────────────────────
    document.getElementById('userNameDisplay').textContent =
        fullName || username;
    document.getElementById('currentUserEmail').textContent =
        username;

    // ── Session time ──────────────────────────────────
    updateSessionTime();
    setInterval(updateSessionTime, 60000);

    // ── Show teacher-only buttons ─────────────────────
    // Export buttons are visible ONLY to teachers
    applyRoleVisibility(role);

    // ── Load all users on page open ───────────────────
    fetchUsers();

    // ── Search form submit ────────────────────────────
    document.getElementById('searchForm')
        .addEventListener('submit', function (e) {
            e.preventDefault();
            currentPage = 1;
            fetchUsers();
        });

    // ── Logout confirm ────────────────────────────────
    document.getElementById('confirmLogout')
        .addEventListener('click', logoutUser);

    // ── User profile button ───────────────────────────
    document.getElementById('userProfileBtn')
        .addEventListener('click', function () {
            showNotification(
                'Logged in as: ' + (fullName || username) +
                ' (' + role + ')', 'info');
        });
});

// ── ROLE VISIBILITY ───────────────────────────────────
// Hide export buttons for students — teachers only
function applyRoleVisibility(role) {
    const teacherOnlyEls =
        document.querySelectorAll('.teacher-only');

    teacherOnlyEls.forEach(el => {
        el.style.display =
            role === 'teacher' ? '' : 'none';
    });
}

// ── FETCH USERS FROM SPRING BOOT ──────────────────────
async function fetchUsers() {
    const roleFilter     = document.getElementById('role').value;
    const usernameFilter = document.getElementById('uname').value
        .trim().toLowerCase();

    showLoading(true);

    try {
        const response = await fetch(
            `${API_BASE}/api/auth/users`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

        if (!response.ok) {
            throw new Error('Server error: ' + response.status);
        }

        const result = await response.json();
        let users = Array.isArray(result) ? result : result.data || [];

        // ── Filter client-side ────────────────────────
        if (roleFilter) {
            users = users.filter(u =>
                u.role && u.role.toLowerCase() === roleFilter);
        }
        if (usernameFilter) {
            users = users.filter(u =>
                (u.username && u.username.toLowerCase()
                    .includes(usernameFilter)) ||
                (u.fullName && u.fullName.toLowerCase()
                    .includes(usernameFilter))
            );
        }

        currentResults = users;
        currentPage    = 1;
        renderTable();

    } catch (error) {
        console.error('Fetch error:', error);
        showNotification(
            'Cannot connect to server. ' +
            'Make sure Spring Boot is running on port 8080.',
            'danger');
        currentResults = [];
        renderTable();
    } finally {
        showLoading(false);
    }
}

// ── VIEW ALL (clears filters, loads every user) ───────
function viewAll() {
    document.getElementById('role').value  = '';
    document.getElementById('uname').value = '';
    currentPage = 1;
    fetchUsers();
    showNotification('Showing all registered users', 'info');
}

// ── RENDER TABLE ──────────────────────────────────────
function renderTable() {
    const tbody      = document.getElementById('resultsBody');
    const emptyState = document.getElementById('emptyState');
    const pagination = document.getElementById('pagination');
    const resultCount       = document.getElementById('resultCount');
    const paginationContainer =
        document.getElementById('paginationContainer');
    const pageInfo   = document.getElementById('pageInfo');

    tbody.innerHTML      = '';
    pagination.innerHTML = '';

    const total      = currentResults.length;
    const totalPages = Math.ceil(total / PER_PAGE);
    const startIdx   = (currentPage - 1) * PER_PAGE;
    const endIdx     = Math.min(startIdx + PER_PAGE, total);
    const pageData   = currentResults.slice(startIdx, endIdx);

    resultCount.textContent =
        `${total} result${total !== 1 ? 's' : ''} found`;

    if (total === 0) {
        emptyState.style.display        = 'block';
        paginationContainer.style.display = 'none';
        return;
    }

    emptyState.style.display        = 'none';
    paginationContainer.style.display = 'flex';
    pageInfo.textContent =
        `Showing ${startIdx + 1}–${endIdx} of ${total}`;

    // ── Build rows ────────────────────────────────────
    pageData.forEach(user => {
        const roleClass = user.role === 'student'
            ? 'status-student' : 'status-teacher';
        const roleLabel = user.role
            ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
            : '-';

        // Main row
        const row = document.createElement('tr');
        row.dataset.id = user.id;
        row.innerHTML = `
            <td>${user.fullName  || '-'}</td>
            <td>${user.username  || '-'}</td>
            <td>${user.email     || '-'}</td>
            <td><span class="status-badge ${roleClass}">${roleLabel}</span></td>
            <td>${user.department || '-'}</td>
            <td>${user.gender    || '-'}</td>
            <td>
                <button class="btn-view"
                        id="viewBtn-${user.id}"
                        onclick="toggleDetails(${user.id})">
                    <i class="bi bi-eye"></i> View
                </button>
            </td>`;
        tbody.appendChild(row);

        // Details row (hidden by default)
        const detailsRow = document.createElement('tr');
        detailsRow.id    = `details-${user.id}`;
        detailsRow.style.display = 'none';
        detailsRow.innerHTML = `
            <td colspan="7">
                <div class="details-container">
                    <div class="details-grid">
                        <div class="detail-item">
                            <div class="detail-label">ID</div>
                            <div class="detail-value">${user.id}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Full Name</div>
                            <div class="detail-value">${user.fullName || '-'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Username</div>
                            <div class="detail-value">${user.username || '-'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Email</div>
                            <div class="detail-value">${user.email || '-'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Role</div>
                            <div class="detail-value">${roleLabel}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Department</div>
                            <div class="detail-value">${user.department || '-'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Gender</div>
                            <div class="detail-value">${user.gender || '-'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Registered On</div>
                            <div class="detail-value">
                                ${user.createdAt
            ? new Date(user.createdAt)
                .toLocaleDateString()
            : '-'}
                            </div>
                        </div>
                    </div>
                </div>
            </td>`;
        tbody.appendChild(detailsRow);
    });

    // ── Pagination ────────────────────────────────────
    if (totalPages > 1) {
        const prev = document.createElement('li');
        prev.className =
            `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        prev.innerHTML =
            `<a class="page-link" href="#"
                onclick="changePage(${currentPage - 1})">
                &laquo;</a>`;
        pagination.appendChild(prev);

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className =
                `page-item ${currentPage === i ? 'active' : ''}`;
            li.innerHTML =
                `<a class="page-link" href="#"
                    onclick="changePage(${i})">${i}</a>`;
            pagination.appendChild(li);
        }

        const next = document.createElement('li');
        next.className =
            `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
        next.innerHTML =
            `<a class="page-link" href="#"
                onclick="changePage(${currentPage + 1})">
                &raquo;</a>`;
        pagination.appendChild(next);
    }
}

// ── TOGGLE DETAILS ROW ────────────────────────────────
function toggleDetails(id) {
    const detailsRow = document.getElementById(`details-${id}`);
    const viewBtn    = document.getElementById(`viewBtn-${id}`);

    if (expandedRow && expandedRow !== id) {
        const prev    = document.getElementById(`details-${expandedRow}`);
        const prevBtn = document.getElementById(`viewBtn-${expandedRow}`);
        if (prev)    prev.style.display = 'none';
        if (prevBtn) {
            prevBtn.innerHTML = '<i class="bi bi-eye"></i> View';
            prevBtn.classList.remove('active');
        }
    }

    if (detailsRow.style.display === 'none') {
        detailsRow.style.display = '';
        viewBtn.innerHTML = '<i class="bi bi-eye-slash"></i> Hide';
        viewBtn.classList.add('active');
        expandedRow = id;
        detailsRow.scrollIntoView({
            behavior: 'smooth', block: 'nearest'
        });
    } else {
        detailsRow.style.display = 'none';
        viewBtn.innerHTML = '<i class="bi bi-eye"></i> View';
        viewBtn.classList.remove('active');
        expandedRow = null;
    }
}

// ── CHANGE PAGE ───────────────────────────────────────
function changePage(page) {
    const totalPages =
        Math.ceil(currentResults.length / PER_PAGE);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderTable();
    document.querySelector('.result-container')
        .scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── CLEAR SEARCH ──────────────────────────────────────
function clearSearch() {
    document.getElementById('role').value  = '';
    document.getElementById('uname').value = '';
    currentPage = 1;
    fetchUsers();
    showNotification('Search filters cleared');
}

// ── REFRESH ───────────────────────────────────────────
function refreshResults() {
    fetchUsers();
    showNotification('Results refreshed');
}

// ── EXPORT ALL USERS (teacher only) ───────────────────
async function exportToCSV() {
    await downloadExcel('all', 'all_users');
}

// ── EXPORT STUDENTS ONLY (teacher only) ───────────────
async function exportStudents() {
    await downloadExcel('students', 'students');
}

// ── EXPORT TEACHERS ONLY (teacher only) ───────────────
async function exportTeachers() {
    await downloadExcel('teachers', 'teachers');
}

// ── SHARED EXCEL DOWNLOAD HELPER ──────────────────────
async function downloadExcel(endpoint, fileLabel) {
    const username = localStorage.getItem('username');
    const role     = localStorage.getItem('role');

    if (role !== 'teacher') {
        showNotification(
            '🚫 Only teachers can export Excel files', 'danger');
        return;
    }

    try {
        showNotification('⏳ Preparing download...', 'info');

        const response = await fetch(
            `${API_BASE}/api/admin/excel/export/${endpoint}` +
            `?username=${username}`, {
                method: 'GET'
            });

        if (!response.ok) {
            let msg = 'Export failed';
            try {
                const err = await response.json();
                msg = err.message || msg;
            } catch (_) {}
            showNotification(msg, 'danger');
            return;
        }

        const blob     = await response.blob();
        const url      = URL.createObjectURL(blob);
        const a        = document.createElement('a');
        a.href         = url;
        a.download     =
            `${fileLabel}_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification(
            `✅ ${fileLabel}.xlsx downloaded successfully`, 'success');

    } catch (error) {
        console.error(error);
        showNotification(
            'Export failed. Check server connection.', 'danger');
    }
}

// ── LOGOUT ────────────────────────────────────────────
function logoutUser() {
    const btn = document.getElementById('confirmLogout');
    btn.innerHTML =
        '<span class="spinner-border spinner-border-sm me-2"></span>' +
        'Logging out...';
    btn.disabled = true;

    setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        localStorage.removeItem('fullName');
        window.location.href = 'login.html';
    }, 1000);
}

// ── SESSION TIME ──────────────────────────────────────
function updateSessionTime() {
    const el = document.getElementById('sessionTime');
    if (!el) return;
    const mins  = Math.floor((new Date() - sessionStart) / 60000);
    const hours = Math.floor(mins / 60);
    if (hours > 0) {
        el.textContent = `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (mins > 0) {
        el.textContent = `${mins} minute${mins > 1 ? 's' : ''} ago`;
    } else {
        el.textContent = 'Just now';
    }
}

// ── LOADING INDICATOR ─────────────────────────────────
function showLoading(show) {
    const tbody = document.getElementById('resultsBody');
    if (show) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4">
                    <span class="spinner-border text-primary me-2"></span>
                    Loading...
                </td>
            </tr>`;
        document.getElementById('emptyState').style.display = 'none';
    }
}

// ── NOTIFICATION TOAST ────────────────────────────────
function showNotification(message, type = 'success') {
    const n = document.createElement('div');
    n.className =
        `alert alert-${type} alert-dismissible fade show position-fixed`;
    n.style.cssText =
        'top:20px; right:20px; z-index:1050; min-width:300px;';

    const icon = type === 'success' ? 'bi-check-circle' :
        type === 'info'    ? 'bi-info-circle'  :
            type === 'danger'  ? 'bi-x-circle'     :
                'bi-exclamation-triangle';

    n.innerHTML =
        `<i class="bi ${icon} me-2"></i>${message}
         <button type="button" class="btn-close"
                 data-bs-dismiss="alert"></button>`;

    document.body.appendChild(n);
    setTimeout(() => { if (n.parentNode) n.remove(); }, 3500);
}
