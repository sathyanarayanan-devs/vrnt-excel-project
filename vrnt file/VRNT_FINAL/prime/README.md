# Veda Rakshana Nidhi Trust – Application Form Website

A professional multi-step government-style application form for Veda Rakshana Nidhi Trust.

## Project Structure

```
prime/
├── frontend/
│   ├── index.html        ← Step 1: Application Form
│   ├── preview.html      ← Step 2: Review & Confirm
│   ├── vehicle.html      ← Step 3: Additional/Vehicle Details
│   ├── success.html      ← Step 4: Submission Success
│   ├── css/
│   │   └── styles.css    ← Deep teal theme, parallax header, responsive
│   └── js/
│       ├── translations.js  ← English / Tamil / Telugu i18n
│       ├── validation.js    ← Real-time field validation
│       └── form.js          ← Form state, localStorage, drag-drop uploads
└── backend/
    ├── main.py           ← FastAPI REST API
    ├── requirements.txt  ← Python dependencies
    ├── start.bat         ← Windows auto-setup & launch script
    ├── uploads/          ← Uploaded files (auto-created)
    └── applications.xlsx ← Excel records (auto-created)
```

## Quick Start

### Option A – Frontend Only (No Backend)
Open `frontend/index.html` directly in your browser.
The form works fully offline — data is stored in browser `localStorage`.
The final submit step will gracefully handle backend unavailability.

### Option B – Full Stack (with Excel saving)

1. **Start the backend:**
   ```
   Double-click: backend/start.bat
   ```
   This will:
   - Create a Python virtual environment
   - Install all dependencies
   - Start the server at `http://localhost:8000`

2. **Open the frontend:**
   Open `frontend/index.html` in your browser.

3. **View API docs:**
   Visit `http://localhost:8000/docs`

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/submit` | Submit application form |
| GET | `/applications` | List all applications |

## Features

- ✅ Sticky parallax header (background-attachment: fixed)
- ✅ Language switcher: English / Tamil / Telugu
- ✅ Real-time field validation (Aadhaar, Mobile, Email)
- ✅ Drag-and-drop file upload zones
- ✅ Multi-step form flow with progress indicator
- ✅ Review/preview page with masked Aadhaar
- ✅ Editable vehicle details table
- ✅ Auto-save to Excel (.xlsx) on submission
- ✅ Uploaded files stored in `backend/uploads/`
- ✅ Confetti animation on success
- ✅ Fully responsive (mobile + desktop)

## Requirements

- Python 3.9+ (for backend)
- Any modern browser (for frontend)
