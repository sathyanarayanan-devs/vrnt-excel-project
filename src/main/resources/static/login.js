// ── TOGGLE PASSWORD VISIBILITY ────────────────────────
document.getElementById('togglePassword')
        .addEventListener('click', function () {
    const passwordInput = document.getElementById('pwd');
    const icon = this.querySelector('i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    }
});

// ── LOGIN FORM SUBMIT ─────────────────────────────────
document.getElementById('loginForm')
        .addEventListener('submit', async function (e) {

    // ✅ MUST be first line — stops browser from submitting form itself
    e.preventDefault();

    const username = document.getElementById('uname').value.trim();
    const password = document.getElementById('pwd').value;

    // ── Validation ────────────────────────────────────
    if (!username) {
        showError('Please enter your username');
        return;
    }
    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }

    // ── Show loading ──────────────────────────────────
    const loginBtn = document.querySelector('.btn-login');
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2"
              role="status" aria-hidden="true"></span>
        Signing in...`;
    loginBtn.disabled = true;

    try {
        // ── Call Spring Boot API ──────────────────────
        const response = await fetch(
            'http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const result = await response.json();

        if (result.success) {
            // ── Save to localStorage ──────────────────
            localStorage.setItem('token',    result.data.token);
            localStorage.setItem('username', result.data.username);
            localStorage.setItem('role',     result.data.role);
            localStorage.setItem('fullName', result.data.fullName);

            showSuccess('Welcome back, ' + result.data.fullName + '!');

            // ── Redirect based on role ────────────────
            setTimeout(() => {
                if (result.data.role === 'teacher') {
                    window.location.href = 'search.html';
                } else if (result.data.role === 'student') {
                    window.location.href = 'search.html';
                } else {
                    window.location.href = 'search.html';
                }
            }, 1000);

        } else {
            showError(result.message);
            loginBtn.innerHTML = originalText;
            loginBtn.disabled = false;
        }

    } catch (error) {
        showError('Cannot connect to server. ' +
                  'Make sure Spring Boot is running on port 8080.');
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
    }
});

// ── INPUT FOCUS EFFECTS ───────────────────────────────
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', function () {
        this.parentElement.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', function () {
        this.parentElement.parentElement.classList.remove('focused');
    });
});

// ── HELPERS ───────────────────────────────────────────
function showError(message) {
    removeAlerts();
    const div = document.createElement('div');
    div.className = 'alert alert-danger mt-3';
    div.innerHTML = `❌ ${message}`;
    document.getElementById('loginForm').prepend(div);
    setTimeout(() => div.remove(), 4000);
}

function showSuccess(message) {
    removeAlerts();
    const div = document.createElement('div');
    div.className = 'alert alert-success mt-3';
    div.innerHTML = `✅ ${message}`;
    document.getElementById('loginForm').prepend(div);
}

function removeAlerts() {
    document.querySelectorAll('.alert').forEach(a => a.remove());
}
