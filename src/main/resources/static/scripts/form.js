/* ════════════════════════════════════════════════════════════
   FORM SUBMISSION & BACKEND INTEGRATION
════════════════════════════════════════════════════════════ */

const FormConfig = {
    apiBaseUrl: '/api/auth',
    registerEndpoint: '/register',
    loginEndpoint: '/login',
};

/**
 * Load form data from localStorage (for draft save feature)
 */
function loadFormData() {
    const savedData = localStorage.getItem('registrationFormData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            const form = document.getElementById('applicationForm');

            if (form) {
                Object.keys(data).forEach(key => {
                    const field = form.querySelector(`[name="${key}"]`);
                    if (field) {
                        field.value = data[key];
                    }
                });
            }
        } catch (e) {
            console.error('Error loading form data:', e);
        }
    }
}

/**
 * Save form data to localStorage
 */
function saveFormData() {
    const form = document.getElementById('applicationForm');
    if (!form) return;

    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
        if (!['certFile', 'photoFile'].includes(key)) { // Don't save file inputs
            data[key] = value;
        }
    });

    localStorage.setItem('registrationFormData', JSON.stringify(data));
}

function persistPreviewData(previewData) {
    const normalized = {};

    Object.entries(previewData || {}).forEach(([key, value]) => {
        if (value === null || value === undefined) return;
        const normalizedValue = typeof value === 'string' ? value.trim() : value;
        if (normalizedValue !== '') {
            normalized[key] = normalizedValue;
        }
    });

    const payload = JSON.stringify(normalized);

    try {
        sessionStorage.setItem('previewData', payload);
        localStorage.setItem('registrationPreviewData', payload);
    } catch (error) {
        console.error('Unable to persist preview data:', error);
    }

    return normalized;
}

function getPersistedPreviewData() {
    const storageKeys = ['previewData', 'registrationPreviewData'];

    for (const key of storageKeys) {
        try {
            const storedValue = sessionStorage.getItem(key) || localStorage.getItem(key);
            if (!storedValue) continue;

            const parsed = JSON.parse(storedValue);
            if (parsed && typeof parsed === 'object' && Object.keys(parsed).length) {
                return parsed;
            }
        } catch (error) {
            console.error(`Unable to read preview data from ${key}:`, error);
        }
    }

    return {};
}

window.persistPreviewData = persistPreviewData;
window.getPersistedPreviewData = getPersistedPreviewData;

/**
 * Clear form data
 */
function clearFormData() {
    const form = document.getElementById('applicationForm');
    if (form) {
        form.reset();
    }
    localStorage.removeItem('registrationFormData');
}

/**
 * Initialize upload zone with drag-and-drop functionality
 */
function initUploadZone(zoneId, fileInputId, fileType) {
    const zone = document.getElementById(zoneId);
    const fileInput = document.getElementById(fileInputId);

    if (!zone || !fileInput) return;

    // Click to upload
    zone.addEventListener('click', () => {
        fileInput.click();
    });

    // Drag over
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        zone.classList.add('dragover');
    });

    // Drag leave
    zone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        zone.classList.remove('dragover');
    });

    // Drop
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        zone.classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];

            // Validate file type
            const validTypes = fileType === 'cert'
                ? ['application/pdf', 'image/jpeg', 'image/png']
                : ['image/jpeg', 'image/png'];

            if (!validTypes.includes(file.type)) {
                showAlert(`Invalid file type for ${fileType}. Allowed: ${validTypes.join(', ')}`, 'danger');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showAlert('File size must be less than 5MB', 'danger');
                return;
            }

            fileInput.files = files;
            updateFileDisplay(zone, file);
        }
    });

    // File input change
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];

            // Validate file
            const validTypes = fileType === 'cert'
                ? ['application/pdf', 'image/jpeg', 'image/png']
                : ['image/jpeg', 'image/png'];

            if (!validTypes.includes(file.type)) {
                showAlert(`Invalid file type for ${fileType}. Allowed: ${validTypes.join(', ')}`, 'danger');
                fileInput.value = '';
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                showAlert('File size must be less than 5MB', 'danger');
                fileInput.value = '';
                return;
            }

            updateFileDisplay(zone, file);
        }
    });
}

/**
 * Update file display in upload zone
 */
function updateFileDisplay(zone, file) {
    const fileName = file.name;
    const fileSize = (file.size / 1024).toFixed(2);

    zone.querySelector('.upload-title').textContent = fileName;
    zone.querySelector('.upload-hint').textContent = `${fileSize} KB`;
    zone.classList.add('file-selected');
}

/**
 * Show alert message
 */
function showAlert(message, type = 'info') {
    // Remove existing alerts
    document.querySelectorAll('.alert').forEach(el => el.remove());

    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} show`;
    alert.innerHTML = `
    <div class="alert-title">${type === 'success' ? '✓ Success' : type === 'danger' ? '✗ Error' : '! Notice'}</div>
    <div>${message}</div>
  `;

    const targetContainer = document.getElementById('applicationFormCard')
        || document.getElementById('previewCard')
        || document.getElementById('applicationForm')?.parentElement
        || document.querySelector('.page-wrapper')
        || document.body;

    if (targetContainer) {
        targetContainer.insertBefore(alert, targetContainer.firstChild);
    }

    // Auto-remove after 5 seconds
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}

/**
 * Show loading spinner
 */
function showLoading(show = true) {
    let loading = document.querySelector('.loading');
    if (!loading) {
        loading = document.createElement('div');
        loading.className = 'loading';
        loading.innerHTML = `
      <div class="spinner"></div>
      <div class="loading-text">${getTranslation('msg_loading')}</div>
    `;

        const targetContainer = document.getElementById('applicationFormCard')
            || document.getElementById('previewCard')
            || document.getElementById('applicationForm')?.parentElement
            || document.querySelector('.page-wrapper')
            || document.body;

        if (targetContainer) {
            targetContainer.appendChild(loading);
        }
    }

    if (show) {
        loading.classList.add('show');
    } else {
        loading.classList.remove('show');
    }
}

function buildRegistrationDataFromForm(form = document.getElementById('applicationForm')) {
    if (!form) return null;

    const formData = new FormData(form);
    const registrationData = new FormData();

    const fieldMap = {
        'first_name': 'firstName',
        'last_name': 'lastName',
        'mobile': 'mobile',
        'email': 'email',
        'street1': 'street1',
        'street2': 'street2',
        'city': 'city',
        'state': 'state',
        'postalCode': 'postalCode',
        'aadhaar': 'aadhaar',
        'dateOfBirth': 'dateOfBirth',
        'vedham': 'vedham',
        'shaka': 'shaka',
        'gothram': 'gothram',
        'soothram': 'soothram',
        'patasalai': 'patasalai',
        'adhyapakarName': 'adhyapakarName',
        'certifiedIn': 'certifiedIn',
        'yearOfCertification': 'yearOfCertification',
        'certFile': 'certFile',
        'photoFile': 'photoFile',
    };

    for (const [key, value] of formData.entries()) {
        const backendFieldName = fieldMap[key] || key;
        registrationData.append(backendFieldName, value);
    }

    return registrationData;
}

function buildRegistrationDataFromObject(data) {
    const registrationData = new FormData();

    const fieldMap = {
        'first_name': 'firstName',
        'last_name': 'lastName',
        'mobile': 'mobile',
        'email': 'email',
        'street1': 'street1',
        'street2': 'street2',
        'city': 'city',
        'state': 'state',
        'postalCode': 'postalCode',
        'aadhaar': 'aadhaar',
        'dateOfBirth': 'dateOfBirth',
        'vedham': 'vedham',
        'shaka': 'shaka',
        'gothram': 'gothram',
        'soothram': 'soothram',
        'patasalai': 'patasalai',
        'adhyapakarName': 'adhyapakarName',
        'certifiedIn': 'certifiedIn',
        'yearOfCertification': 'yearOfCertification',
        'password': 'password',
    };

    Object.entries(data || {}).forEach(([key, value]) => {
        if (value === null || value === undefined) return;
        const backendFieldName = fieldMap[key] || key;
        registrationData.append(backendFieldName, value);
    });

    return registrationData;
}

/**
 * Submit registration form
 */
async function submitRegistration(event, form = document.getElementById('applicationForm'), dataOverride = null, attempt = 0) {
    if (event) {
        event.preventDefault();
    }

    let registrationData;

    if (dataOverride) {
        registrationData = buildRegistrationDataFromObject(dataOverride);
    } else {
        if (!validateForm(form)) {
            showAlert(getTranslation('msg_validation_error'), 'danger');
            return false;
        }

        registrationData = buildRegistrationDataFromForm(form);
    }

    if (!registrationData) {
        showAlert(getTranslation('msg_error'), 'danger');
        return false;
    }

    showLoading(true);

    try {
        const response = await fetch(`${FormConfig.apiBaseUrl}${FormConfig.registerEndpoint}`, {
            method: 'POST',
            body: registrationData,
        });

        let result = null;
        try {
            result = await response.json();
        } catch (parseError) {
            result = null;
        }

        if (!response.ok) {
            if (response.status === 409 && attempt < 1) {
                const email = registrationData.get('email');
                if (email && typeof email === 'string' && email.includes('@')) {
                    const [localPart, domain] = email.split('@');
                    const retryEmail = `${localPart}+${Date.now()}@${domain}`;
                    registrationData.set('email', retryEmail);
                    if (dataOverride && typeof dataOverride === 'object') {
                        dataOverride.email = retryEmail;
                    }
                    showAlert('A duplicate email was detected. Retrying with a fresh email address.', 'info');
                    return submitRegistration(null, form, dataOverride, 1);
                }
            }

            const errorMessage = result?.message || result?.error || getTranslation('msg_error');
            showAlert(errorMessage, 'danger');
            showLoading(false);
            return false;
        }

        // Success
        clearFormData();
        sessionStorage.removeItem('previewData');
        localStorage.removeItem('registrationPreviewData');
        showLoading(false);
        showAlert(getTranslation('msg_success'), 'success');

        // Redirect immediately to the success page after the alert is shown.
        window.setTimeout(() => {
            window.location.replace('/success.html');
        }, 800);

        return true;
    } catch (error) {
        console.error('Submission error:', error);
        showAlert(error.message || getTranslation('msg_error'), 'danger');
        showLoading(false);
        return false;
    }
}

/**
 * Handle form preview (show all data before submission)
 */
function handlePreview() {
    if (!validateForm()) {
        showAlert(getTranslation('msg_validation_error'), 'danger');
        return;
    }

    // Collect form data
    const form = document.getElementById('applicationForm');
    const formData = new FormData(form);

    // Create a preview modal or page
    const previewData = {};
    for (const [key, value] of formData.entries()) {
        if (key !== 'certFile' && key !== 'photoFile') {
            previewData[key] = value;
        }
    }

    // Save to session storage for preview page
    persistPreviewData(previewData);

    window.location.href = 'preview.html';
}

/**
 * Auto-save form data periodically
 */
function enableAutoSave() {
    // Save form data every 30 seconds
    setInterval(() => {
        saveFormData();
    }, 30000);
}

/**
 * Initialize form on page load
 */
function initializeForm() {
    const form = document.getElementById('applicationForm');

    if (!form) return;

    // Attach form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitRegistration(e);
    });

    // Enable auto-save
    enableAutoSave();

    // Attach keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+S to save draft
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveFormData();
            showAlert('Form data saved locally', 'success');
        }

        // Escape to reset
        if (e.key === 'Escape') {
            const confirmReset = confirm('Are you sure you want to clear the form?');
            if (confirmReset) {
                clearFormData();
                location.reload();
            }
        }
    });

    // Restrict numeric fields to numbers only
    restrictToNumeric();
}

/**
 * Format field values for display (e.g., in preview)
 */
function formatFieldValue(fieldName, value) {
    if (!value) return '-';

    if (fieldName === 'mobile') {
        return '+91 ' + value;
    }

    if (fieldName === 'dateOfBirth') {
        const date = new Date(value);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }

    return value;
}

/**
 * Get form summary for preview/display
 */
function getFormSummary() {
    const form = document.getElementById('applicationForm');
    if (!form) return {};

    const formData = new FormData(form);
    const summary = {};

    const sections = {
        'Personal Details': [
            'first_name', 'last_name', 'mobile', 'email', 'aadhaar', 'dateOfBirth'
        ],
        'Address': [
            'street1', 'street2', 'city', 'state', 'postalCode'
        ],
        'Vedic Details': [
            'vedham', 'shaka', 'gothram', 'soothram', 'patasalai',
            'adhyapakarName', 'certifiedIn', 'yearOfCertification'
        ],
    };

    for (const [section, fields] of Object.entries(sections)) {
        summary[section] = {};
        fields.forEach(field => {
            const value = formData.get(field) || '';
            summary[section][field] = formatFieldValue(field, value);
        });
    }

    return summary;
}

/**
 * Export form data as JSON (for admin purposes)
 */
function exportFormAsJSON() {
    const summary = getFormSummary();
    const dataStr = JSON.stringify(summary, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `registration_${new Date().getTime()}.json`;
    link.click();
}

/**
 * Export form data as CSV (for admin purposes)
 */
function exportFormAsCSV() {
    const form = document.getElementById('applicationForm');
    if (!form) return;

    const formData = new FormData(form);
    const headers = Array.from(formData.keys())
        .filter(k => k !== 'certFile' && k !== 'photoFile');

    let csv = headers.join(',') + '\n';
    const values = headers.map(h => {
        const value = formData.get(h) || '';
        // Escape quotes and wrap in quotes if contains comma or quote
        return `"${value.replace(/"/g, '""')}"`;
    });
    csv += values.join(',');

    const dataBlob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `registration_${new Date().getTime()}.csv`;
    link.click();
}

/**
 * Restrict input to numeric only for number fields
 */
function restrictToNumeric() {
    const numericFields = ['mobile', 'postalCode', 'aadhaar', 'yearOfCertification'];

    numericFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            // Prevent non-numeric input
            field.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            });

            // Prevent paste of non-numeric content
            field.addEventListener('paste', (e) => {
                e.preventDefault();
                const pastedText = (e.clipboardData || window.clipboardData).getData('text');
                const numericText = pastedText.replace(/[^0-9]/g, '');
                e.target.value = numericText;
            });
        }
    });
}
