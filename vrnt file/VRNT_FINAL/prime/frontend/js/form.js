// ============================================================
// Veda Rakshana Nidhi Trust – Form State & Drag-Drop
// Pure localStorage for temp draft only – cleared after submit
// ============================================================

const STORAGE_KEY = 'vrnt_form_draft'; // draft only, cleared after submit

// ── Save draft form data to localStorage (for preview page) ─
function saveFormData() {
    const data = {
        first_name: getValue('first_name'),
        last_name: getValue('last_name'),
        mobile: getValue('mobile'),
        email: getValue('email'),
        street1: getValue('street1'),
        street2: getValue('street2'),
        city: getValue('city'),
        state: getValue('state'),
        postal: getValue('postal'),
        aadhaar: getValue('aadhaar'),
        dob: getValue('dob'),
        vedham: getValue('vedham'),
        shaka: getValue('shaka'),
        gothram: getValue('gothram'),
        soothram: getValue('soothram'),
        patasalai: getValue('patasalai'),
        adhyapakar: getValue('adhyapakar'),
        certified_in: getValue('certified_in'),
        year_cert: getValue('year_cert'),
        cert_filename: window._certFileName || '',
        photo_filename: window._photoFileName || '',
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ── loadFormData: intentionally does NOTHING
//    Form always starts empty – no pre-filling from storage
function loadFormData() {
    // Do not restore any data – form is always blank on open
}

// ── Get / Set helpers ──────────────────────────────────
function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
}

function setValue(id, val) {
    const el = document.getElementById(id);
    if (el && val !== undefined) el.value = val;
}

// ── Upload preview helper ──────────────────────────────
function setUploadPreview(zoneId, filename) {
    const zone = document.getElementById(zoneId);
    if (!zone) return;
    let preview = zone.querySelector('.upload-preview');
    if (!preview) {
        preview = document.createElement('p');
        preview.className = 'upload-preview';
        zone.appendChild(preview);
    }
    preview.textContent = '📎 ' + filename;
}

// ── File stored references ─────────────────────────────
window._certFileName = '';
window._photoFileName = '';
window._certFile = null;
window._photoFile = null;

// ── Wire up a drag-and-drop upload zone ───────────────
function initUploadZone(zoneId, inputId, fileKey) {
    const zone = document.getElementById(zoneId);
    const input = document.getElementById(inputId);
    if (!zone || !input) return;

    zone.addEventListener('click', (e) => {
        if (e.target === input) return;
        input.click();
    });

    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => { zone.classList.remove('drag-over'); });
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length) handleFileSelect(files[0], zone, inputId, fileKey);
    });

    input.addEventListener('change', () => {
        if (input.files.length) handleFileSelect(input.files[0], zone, inputId, fileKey);
    });
}

function handleFileSelect(file, zone, inputId, fileKey) {
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    const ALLOWED = ['.pdf', '.jpg', '.jpeg', '.png'];
    if (!ALLOWED.includes(ext)) {
        window.showError && window.showError(inputId, 'Allowed file types: PDF, JPG, PNG only.');
        return;
    }
    window.clearError && window.clearError(inputId);
    window['_' + fileKey + 'File'] = file;
    window['_' + fileKey + 'FileName'] = file.name;
    setUploadPreview(zone.id, file.name);
}

// Expose globally
window.saveFormData = saveFormData;
window.loadFormData = loadFormData;
window.initUploadZone = initUploadZone;
