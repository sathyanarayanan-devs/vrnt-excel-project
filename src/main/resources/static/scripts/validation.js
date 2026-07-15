/* ════════════════════════════════════════════════════════════
   FORM VALIDATION SCRIPT
════════════════════════════════════════════════════════════ */

function enforceNumericInput(event) {
    const field = event.target;
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter'];

    if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
        return;
    }

    if (!/^\d$/.test(event.key)) {
        event.preventDefault();
    }
}

function sanitizeNumericField(field) {
    if (!field) return;

    let value = field.value.replace(/\D/g, '');

    if (field.id === 'mobile') {
        value = value.slice(0, 10);
    } else if (field.id === 'postalCode') {
        value = value.slice(0, 6);
    } else if (field.id === 'aadhaar') {
        value = value.slice(0, 12);
    } else if (field.id === 'yearOfCertification') {
        value = value.slice(0, 4);
    }

    field.value = value;
}

function attachNumericInputRestrictions() {
    const numericFields = ['mobile', 'postalCode', 'aadhaar', 'yearOfCertification'];

    numericFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field) return;

        field.addEventListener('keydown', enforceNumericInput);
        field.addEventListener('paste', (event) => {
            event.preventDefault();
            const pastedText = (event.clipboardData || window.clipboardData).getData('text');
            const sanitized = pastedText.replace(/\D/g, '');
            const start = field.selectionStart || 0;
            const end = field.selectionEnd || 0;
            const nextValue = field.value.substring(0, start) + sanitized + field.value.substring(end);
            field.value = nextValue.replace(/\D/g, '');
            field.dispatchEvent(new Event('input', { bubbles: true }));
        });
        field.addEventListener('input', () => sanitizeNumericField(field));
    });
}

function setDateOfBirthRange() {
    const dobField = document.getElementById('dateOfBirth');
    if (!dobField) return;

    const today = new Date();
    const maxDate = today.toISOString().split('T')[0];
    dobField.min = '1900-01-01';
    dobField.max = maxDate;
}

const ValidationRules = {
    firstName: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s]+$/,
        message: 'First name should be 2-50 letters only',
    },
    last_name: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s]+$/,
        message: 'Last name should be 2-50 letters only',
    },
    mobile: {
        required: true,
        pattern: /^[6-9]\d{9}$/,
        message: 'Mobile must be a valid 10-digit Indian number (6-9xxxxxxxxx)',
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address',
    },
    street1: {
        required: true,
        maxLength: 255,
        message: 'Street address is required',
    },
    street2: {
        maxLength: 255,
        message: 'Street address line 2 is too long',
    },
    city: {
        required: true,
        maxLength: 100,
        message: 'City is required and max 100 characters',
    },
    state: {
        required: true,
        maxLength: 100,
        message: 'State is required and max 100 characters',
    },
    postalCode: {
        required: true,
        pattern: /^[1-9][0-9]{5}$/,
        message: 'PIN code must be a valid 6-digit number',
    },
    aadhaar: {
        required: true,
        pattern: /^[2-9]{1}[0-9]{11}$/,
        message: 'Aadhaar must be a valid 12-digit number',
    },
    dateOfBirth: {
        required: true,
        message: 'Date of birth is required',
        custom: validateDateOfBirth,
    },
    vedham: {
        required: true,
        maxLength: 50,
        message: 'Vedham is required',
    },
    shaka: {
        maxLength: 50,
        message: 'Shaka is too long (max 50 chars)',
    },
    gothram: {
        required: true,
        maxLength: 50,
        message: 'Gothram is required',
    },
    soothram: {
        maxLength: 50,
        message: 'Soothram is too long (max 50 chars)',
    },
    patasalai: {
        maxLength: 255,
        message: 'Patasalai is too long (max 255 chars)',
    },
    adhyapakarName: {
        maxLength: 255,
        message: 'Adhyapakar name is too long (max 255 chars)',
    },
    certifiedIn: {
        maxLength: 255,
        message: 'Certified in is too long (max 255 chars)',
    },
    yearOfCertification: {
        pattern: /^(19|20)\d{2}$/,
        message: 'Year must be a valid 4-digit year',
    },
};

/**
 * Custom validator for date of birth
 */
function validateDateOfBirth(value) {
    if (!value) return false;
    const dob = new Date(value);
    const today = new Date();

    // Check if date is in the past
    if (dob >= today) {
        return { valid: false, message: 'Date of birth must be in the past' };
    }

    // Check if age is reasonable (not more than 120 years)
    const age = today.getFullYear() - dob.getFullYear();
    if (age > 120 || age < 1) {
        return { valid: false, message: 'Please enter a valid date of birth' };
    }

    return { valid: true };
}

function getValidationRuleName(fieldId) {
    const ruleMap = {
        first_name: 'firstName',
        postalCode: 'postalCode',
        dateOfBirth: 'dateOfBirth',
        adhyapakarName: 'adhyapakarName',
        certifiedIn: 'certifiedIn',
        yearOfCertification: 'yearOfCertification',
    };

    return ruleMap[fieldId] || fieldId;
}

/**
 * Validate a single field
 */
function validateField(fieldName, value) {
    const rules = ValidationRules[fieldName];

    if (!rules) return { valid: true }; // No rules defined

    // Check if required
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        return { valid: false, message: `${fieldName} is required` };
    }

    // Skip further validation if empty and not required
    if (!value && !rules.required) {
        return { valid: true };
    }

    // Check minLength
    if (rules.minLength && value && value.length < rules.minLength) {
        return { valid: false, message: `Minimum length is ${rules.minLength} characters` };
    }

    // Check maxLength
    if (rules.maxLength && value && value.length > rules.maxLength) {
        return { valid: false, message: `Maximum length is ${rules.maxLength} characters` };
    }

    // Check pattern
    if (rules.pattern && value && !rules.pattern.test(value)) {
        return { valid: false, message: rules.message };
    }

    // Check custom validator
    if (rules.custom && value) {
        const customResult = rules.custom(value);
        if (customResult && customResult.valid === false) {
            return customResult;
        }
    }

    return { valid: true };
}

/**
 * Display validation error for a field
 */
function showFieldError(fieldId, errorMessage) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}_err`);

    if (!field) return;

    field.classList.add('is-invalid');
    field.classList.remove('is-valid');

    if (errorEl) {
        errorEl.textContent = errorMessage;
    }

    // Show error message
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        formGroup.classList.add('has-error');
    }
}

/**
 * Clear validation error for a field
 */
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}_err`);

    if (!field) return;

    field.classList.remove('is-invalid');
    field.classList.remove('is-valid');

    if (errorEl) {
        errorEl.textContent = '';
    }

    const formGroup = field.closest('.form-group');
    if (formGroup) {
        formGroup.classList.remove('has-error');
    }
}

/**
 * Mark field as valid
 */
function markFieldValid(fieldId) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}_err`);

    if (!field) return;

    field.classList.remove('is-invalid');
    field.classList.add('is-valid');

    if (errorEl) {
        errorEl.textContent = '';
    }

    const formGroup = field.closest('.form-group');
    if (formGroup) {
        formGroup.classList.remove('has-error');
    }
}

/**
 * Validate entire form
 */
function validateForm() {
    const form = document.getElementById('applicationForm');
    if (!form) return false;

    let isValid = true;
    const formData = new FormData(form);

    // Get all field IDs from the form
    const fieldIds = [
        'first_name', 'last_name', 'mobile', 'email',
        'street1', 'street2', 'city', 'state', 'postalCode',
        'aadhaar', 'dateOfBirth',
        'vedham', 'shaka', 'gothram', 'soothram', 'patasalai',
        'adhyapakarName', 'certifiedIn', 'yearOfCertification'
    ];

    fieldIds.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field) return;

        const value = field.value.trim();
        const ruleName = getValidationRuleName(fieldId);

        const validation = validateField(ruleName, value);

        if (!validation.valid) {
            showFieldError(fieldId, validation.message);
            isValid = false;
        } else {
            clearFieldError(fieldId);
        }
    });

    return isValid;
}

/**
 * Attach real-time validation to all form inputs
 */
function attachRealtimeValidation() {
    const form = document.getElementById('applicationForm');
    if (!form) return;

    // Get all input, select, and textarea elements
    const inputs = form.querySelectorAll('input:not([type="file"]), select, textarea');

    inputs.forEach(input => {
        // Validate on blur
        input.addEventListener('blur', () => {
            const fieldId = input.id;
            const ruleName = getValidationRuleName(fieldId);

            const value = input.value.trim();
            const validation = validateField(ruleName, value);

            if (!validation.valid) {
                showFieldError(fieldId, validation.message);
            } else {
                markFieldValid(fieldId);
            }
        });

        // Clear error on focus
        input.addEventListener('focus', () => {
            const fieldId = input.id;
            clearFieldError(fieldId);
        });

        // Real-time validation for certain fields
        input.addEventListener('input', () => {
            const fieldId = input.id;
            const value = input.value.trim();

            // Only validate if field has a value (allow empty optional fields)
            if (value) {
                const ruleName = getValidationRuleName(fieldId);
                const validation = validateField(ruleName, value);

                if (!validation.valid) {
                    showFieldError(fieldId, validation.message);
                } else {
                    markFieldValid(fieldId);
                }
            } else {
                clearFieldError(fieldId);
            }
        });
    });
}
