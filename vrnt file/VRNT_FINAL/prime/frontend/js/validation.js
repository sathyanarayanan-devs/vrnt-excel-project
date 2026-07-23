// ============================================================
// Veda Rakshana Nidhi Trust – Form Validation
// Rules: names = alpha only + first-letter capital
//        mobile = Indian 10-digit starting with 6-9
//        postal = Tamil Nadu 6-digit starting with 6
// ============================================================

const ALLOWED_FILE_EXT = ['.pdf', '.jpg', '.jpeg', '.png'];

// ── Helper: show / clear error ─────────────────────────
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errEl = document.getElementById(fieldId + '_err');
    if (field) { field.classList.add('is-invalid'); field.classList.remove('is-valid'); }
    if (errEl) { errEl.textContent = message; errEl.classList.add('show'); }
}

function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errEl = document.getElementById(fieldId + '_err');
    if (field) { field.classList.remove('is-invalid'); field.classList.add('is-valid'); }
    if (errEl) { errEl.classList.remove('show'); errEl.textContent = ''; }
}

function clearAllErrors() {
    document.querySelectorAll('.form-control').forEach(f => f.classList.remove('is-invalid', 'is-valid'));
    document.querySelectorAll('.error-msg').forEach(e => { e.classList.remove('show'); e.textContent = ''; });
}

// ── Auto-capitalise first letter of each word ──────────
function capitalizeWords(str) {
    return str.replace(/\b[a-z]/g, c => c.toUpperCase());
}

// ── Name validator: alpha + spaces only, first letter capital ──
function validateName(fieldId, label) {
    const field = document.getElementById(fieldId);
    if (!field) return true;
    let val = field.value.trim();
    if (!val) { showError(fieldId, label + ' is required.'); return false; }
    if (!/^[A-Za-z ]+$/.test(val)) {
        showError(fieldId, label + ' must contain alphabets only (no numbers or symbols).');
        return false;
    }
    // Enforce first-letter capital
    const corrected = capitalizeWords(val);
    if (val !== corrected) {
        field.value = corrected;
        val = corrected;
    }
    clearError(fieldId);
    return true;
}

// ── Required (general) ─────────────────────────────────
function validateRequired(fieldId, label) {
    const field = document.getElementById(fieldId);
    if (!field) return true;
    const val = field.value.trim();
    if (!val) { showError(fieldId, (label || 'This field') + ' is required.'); return false; }
    clearError(fieldId);
    return true;
}

// ── Indian mobile (+91): 10 digits, starts 6-9 ─────────
function validateMobile(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return true;
    let raw = field.value.trim().replace(/\D/g, '');
    if (raw.length === 12 && raw.startsWith('91')) raw = raw.slice(2);
    if (!raw) { showError(fieldId, 'Mobile number is required.'); return false; }
    if (raw.length !== 10) { showError(fieldId, 'Enter a valid 10-digit mobile number.'); return false; }
    if (!/^[6-9]/.test(raw)) { showError(fieldId, 'Mobile number must start with 6, 7, 8 or 9.'); return false; }
    clearError(fieldId);
    return true;
}

// ── Email ──────────────────────────────────────────────
function validateEmail(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return true;
    const val = field.value.trim();
    if (!val) { showError(fieldId, 'Email ID is required.'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        showError(fieldId, 'Enter a valid email address (e.g. name@example.com).'); return false;
    }
    clearError(fieldId);
    return true;
}

// ── Aadhaar: exactly 12 digits ─────────────────────────
function validateAadhaar(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return true;
    const val = field.value.replace(/\D/g, '');
    if (!val) { showError(fieldId, 'Aadhaar number is required.'); return false; }
    if (val.length !== 12) { showError(fieldId, 'Aadhaar must be exactly 12 digits.'); return false; }
    clearError(fieldId);
    return true;
}

// ── PIN: 6 digits ───────────
function validatePostal(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return true;
    const val = field.value.trim();
    if (!val) { showError(fieldId, 'PIN code is required.'); return false; }
    if (!/^\d{6}$/.test(val)) { showError(fieldId, 'Enter a valid 6-digit PIN code.'); return false; }
    clearError(fieldId);
    return true;
}

// ── Year (optional): 4-digit valid year ────────────────
function validateYear(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field || !field.value.trim()) return true;
    const val = field.value.trim();
    const yr = parseInt(val, 10);
    if (!/^\d{4}$/.test(val) || yr < 1900 || yr > new Date().getFullYear()) {
        showError(fieldId, 'Enter a valid 4-digit year (e.g. 2020).'); return false;
    }
    clearError(fieldId);
    return true;
}

// ── File upload (optional) ─────────────────────────────
function validateFileUpload(inputId) {
    const input = document.getElementById(inputId);
    if (!input || !input.files || input.files.length === 0) return true;
    const ext = '.' + input.files[0].name.split('.').pop().toLowerCase();
    if (!ALLOWED_FILE_EXT.includes(ext)) {
        showError(inputId, 'Allowed file types: PDF, JPG, PNG only.'); return false;
    }
    clearError(inputId);
    return true;
}

// ── Full form validation ───────────────────────────────
function validateForm() {
    let valid = true;
    valid = validateName('first_name', 'First Name') && valid;
    valid = validateName('last_name', 'Last Name') && valid;
    valid = validateMobile('mobile') && valid;
    valid = validateEmail('email') && valid;
    valid = validateRequired('street1', 'Street Address') && valid;
    valid = validateName('city', 'City') && valid;
    valid = validateName('state', 'State') && valid;
    valid = validatePostal('postal') && valid;
    valid = validateAadhaar('aadhaar') && valid;
    valid = validateRequired('dob', 'Date of Birth') && valid;
    valid = validateRequired('vedham', 'Vedham') && valid;
    valid = validateRequired('gothram', 'Gothram') && valid;
    valid = validateYear('year_cert') && valid;
    valid = validateFileUpload('cert_file') && valid;
    valid = validateFileUpload('photo_file') && valid;
    return valid;
}

// ── Real-time listeners ────────────────────────────────
function attachRealtimeValidation() {
    // First Name – alpha only, auto-capitalize
    const fnEl = document.getElementById('first_name');
    if (fnEl) {
        fnEl.addEventListener('input', () => {
            // Strip non-alpha except space
            fnEl.value = fnEl.value.replace(/[^A-Za-z ]/g, '');
        });
        fnEl.addEventListener('blur', () => validateName('first_name', 'First Name'));
    }

    // Last Name – same
    const lnEl = document.getElementById('last_name');
    if (lnEl) {
        lnEl.addEventListener('input', () => {
            lnEl.value = lnEl.value.replace(/[^A-Za-z ]/g, '');
        });
        lnEl.addEventListener('blur', () => validateName('last_name', 'Last Name'));
    }

    // Mobile – digits only, strip country code
    const mEl = document.getElementById('mobile');
    if (mEl) {
        mEl.addEventListener('input', () => {
            let v = mEl.value.replace(/\D/g, '');
            if (v.length === 12 && v.startsWith('91')) v = v.slice(2);
            mEl.value = v.slice(0, 10);
            if (mEl.value.length > 0) validateMobile('mobile');
        });
        mEl.addEventListener('blur', () => validateMobile('mobile'));
    }

    // Email
    const eEl = document.getElementById('email');
    if (eEl) {
        eEl.addEventListener('blur', () => validateEmail('email'));
        eEl.addEventListener('input', () => { if (eEl.value.includes('@')) validateEmail('email'); });
    }

    // Aadhaar – digits only, max 12
    const aEl = document.getElementById('aadhaar');
    if (aEl) {
        aEl.addEventListener('input', () => {
            aEl.value = aEl.value.replace(/\D/g, '').slice(0, 12);
            if (aEl.value.length > 0) validateAadhaar('aadhaar');
        });
        aEl.addEventListener('blur', () => validateAadhaar('aadhaar'));
    }

    // PIN code – digits only, max 6
    const pEl = document.getElementById('postal');
    if (pEl) {
        pEl.addEventListener('input', () => {
            pEl.value = pEl.value.replace(/\D/g, '').slice(0, 6);
            if (pEl.value.length === 6) validatePostal('postal');
        });
        pEl.addEventListener('blur', () => validatePostal('postal'));
    }

    // Year of cert
    const yEl = document.getElementById('year_cert');
    if (yEl) {
        yEl.addEventListener('input', () => {
            yEl.value = yEl.value.replace(/\D/g, '').slice(0, 4);
        });
        yEl.addEventListener('blur', () => validateYear('year_cert'));
    }

    // City & State - alpha only, auto-capitalize
    ['city', 'state'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => el.value = el.value.replace(/[^A-Za-z ]/g, ''));
            el.addEventListener('blur', () => validateName(id, id.charAt(0).toUpperCase() + id.slice(1)));
        }
    });

    // Required on blur
    ['street1', 'dob', 'vedham', 'gothram'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('blur', () => validateRequired(id));
    });
}

// Expose globally
window.validateForm = validateForm;
window.attachRealtimeValidation = attachRealtimeValidation;
window.showError = showError;
window.clearError = clearError;
window.clearAllErrors = clearAllErrors;
