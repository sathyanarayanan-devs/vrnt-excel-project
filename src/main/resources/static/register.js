// ── TOGGLE PASSWORD VISIBILITY ────────────────────────
// ✅ Only ONE set of toggle listeners (removed old duplicate)
document.getElementById('togglePassword1')
        .addEventListener('click', function () {
    toggleVisibility('pwd', this);
});

document.getElementById('togglePassword2')
        .addEventListener('click', function () {
    toggleVisibility('c-pwd', this);
});

function toggleVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon  = btn.querySelector('i');
    if (input.type === 'password') {
        input.type     = 'text';
        icon.className = 'bi bi-eye-slash';
    } else {
        input.type     = 'password';
        icon.className = 'bi bi-eye';
    }
}

// ── REAL-TIME PASSWORD MATCH CHECK ────────────────────
const passwordInput        = document.getElementById('pwd');
const confirmPasswordInput = document.getElementById('c-pwd');

function validatePasswordMatch() {
    const pwd  = passwordInput.value;
    const cpwd = confirmPasswordInput.value;
    if (pwd && cpwd) {
        confirmPasswordInput.style.borderColor =
            pwd === cpwd ? '#28a745' : '#dc3545';
    } else {
        confirmPasswordInput.style.borderColor = '#e9ecef';
    }
}

passwordInput.addEventListener('input', validatePasswordMatch);
confirmPasswordInput.addEventListener('input', validatePasswordMatch);

// ── INPUT FOCUS EFFECTS ───────────────────────────────
document.querySelectorAll('.form-control, .form-select')
        .forEach(input => {
    input.addEventListener('focus', function () {
        this.classList.add('focused');
    });
    input.addEventListener('blur', function () {
        this.classList.remove('focused');
    });
});

// ── REGISTER FORM SUBMIT — FETCH TO SPRING BOOT ───────
// ✅ Only ONE submit listener (removed old fake setTimeout version)
document.getElementById('registerForm')
        .addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn    = this.querySelector("button[type='submit']");
    const originalText = submitBtn.innerHTML;

    // ── Build payload ─────────────────────────────────
    const payload = {
        role:            document.getElementById('role').value,
        username:        document.getElementById('uname').value.trim(),
        fullName:        document.getElementById('fname').value.trim(),
        emailAddress:    document.getElementById('email').value.trim(),
        gender:          document.querySelector(
                         "input[name='gender']:checked")?.value ?? '',
        department:      document.getElementById('course').value,
        password:        document.getElementById('pwd').value,
        confirmPassword: document.getElementById('c-pwd').value,
    };

    // ── Client-side checks ────────────────────────────
    if (!payload.role) {
        showAlert('Please select your role', 'danger'); return;
    }
    if (!payload.username) {
        showAlert('Please enter a username', 'danger'); return;
    }
    if (!payload.fullName) {
        showAlert('Please enter your full name', 'danger'); return;
    }
    if (!payload.emailAddress) {
        showAlert('Please enter your email', 'danger'); return;
    }
    if (!payload.gender) {
        showAlert('Please select your gender', 'danger'); return;
    }
    if (!payload.department) {
        showAlert('Please select your department', 'danger'); return;
    }
    if (payload.password.length < 6) {
        showAlert('Password must be at least 6 characters', 'danger');
        return;
    }
    if (payload.password !== payload.confirmPassword) {
        showAlert('Passwords do not match', 'danger'); return;
    }
    if (!document.getElementById('terms').checked) {
        showAlert('You must agree to Terms of Service', 'danger');
        return;
    }

    // ── Loading state ─────────────────────────────────
    submitBtn.disabled  = true;
    submitBtn.innerHTML =
        `<span class="spinner-border spinner-border-sm me-2"></span>
         Creating Account...`;

    try {
        // ── Call Spring Boot register API ─────────────
        const res = await fetch(
            'http://localhost:8080/api/auth/register', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload),
        });

        const json = await res.json();

        if (res.ok && json.success) {
            showAlert(json.message ||
                'Registration successful!', 'success');

            // Redirect to login after 1.5 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);

        } else {
            // Show field validation errors from backend
            if (json.data && typeof json.data === 'object') {
                const msgs = Object.values(json.data).join(' • ');
                showAlert(msgs, 'warning');
            } else {
                showAlert(json.message ||
                    'Registration failed.', 'danger');
            }
        }

    } catch (err) {
        console.error(err);
        showAlert(
            'Cannot reach the server. ' +
            'Make sure Spring Boot is running on port 8080.',
            'danger'
        );
    } finally {
        submitBtn.disabled  = false;
        submitBtn.innerHTML = originalText;
    }
});

// ── HELPER — Show Alert ───────────────────────────────
function showAlert(message, type = 'info') {
    document.querySelector('.vrnt-alert')?.remove();

    const div = document.createElement('div');
    div.className =
        `alert alert-${type} alert-dismissible fade show vrnt-alert mt-3`;
    div.innerHTML = `
        ${message}
        <button type="button" class="btn-close"
                data-bs-dismiss="alert"></button>`;

    document.getElementById('registerForm').before(div);
    div.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
