# Registration Form Implementation Guide

## Overview

This document provides a complete guide for the VRNT Excel Project registration form implementation with CSS styling, JavaScript functionality, and backend integration.

## Files Created/Updated

### 1. Frontend Files

#### HTML
- **File**: `src/main/resources/static/register.html`
- **Updates**: Fixed field names to match backend expectations
- **Fields Updated**:
  - `postal` → `postalCode`
  - `dob` → `dateOfBirth`
  - `adhyapakar` → `adhyapakarName`
  - `certified_in` → `certifiedIn`
  - `year_cert` → `yearOfCertification`
  - `cert_file` → `certFile`
  - `photo_file` → `photoFile`

#### CSS
- **File**: `src/main/resources/static/styles/register.css`
- **Features**:
  - Professional styling with primary color (#8F5307)
  - Form validation states (valid/invalid styling)
  - Responsive design (desktop, tablet, mobile)
  - Upload zones with drag-and-drop functionality
  - Alerts and notification styling
  - Step progress indicator
  - Animations and transitions
  - Accessibility features (aria labels, semantic HTML)

#### JavaScript - Validation
- **File**: `src/main/resources/static/scripts/validation.js`
- **Features**:
  - Real-time field validation
  - Validation rules for all fields
  - Custom validators (date of birth check)
  - Error message display
  - Form-wide validation
  - Blur/input event handlers

#### JavaScript - Translation
- **File**: `src/main/resources/static/scripts/translator.js`
- **Features**:
  - Multilingual support (English, Tamil, Telugu, Hindi)
  - Language switching with button controls
  - localStorage persistence of language preference
  - Dynamic text translation for all UI elements
  - 250+ translation strings

#### JavaScript - Form Handling
- **File**: `src/main/resources/static/scripts/form.js`
- **Features**:
  - Form submission to backend
  - File upload handling with validation
  - File size and type checking (max 5MB)
  - Auto-save to localStorage every 30 seconds
  - Alert messages for success/error
  - Loading spinners
  - Form preview functionality
  - Data export (JSON/CSV)
  - Keyboard shortcuts (Ctrl+S to save, Esc to reset)

### 2. Backend Changes

#### Controller
- **File**: `src/main/java/com/example/Vrnt/Controller/UserController.java`
- **Changes**:
  - Updated `/api/auth/register` endpoint
  - Changed from `@RequestBody` to multipart/form-data
  - Added file parameters (certFile, photoFile)
  - Added proper logging with @Slf4j

#### Build Configuration
- **File**: `pom.xml`
- **Changes**:
  - Fixed Maven compiler plugin configuration
  - Added Lombok version to annotation processor path
  - Corrected Java source/target to 21
  - Added maven-compiler-plugin version

## How It Works

### Registration Flow

```
1. User Opens Form
   ↓
2. Form Initializes
   - Loads saved data from localStorage (if any)
   - Initializes language translator
   - Attaches validation handlers
   - Sets up file upload zones
   ↓
3. User Fills Fields
   - Real-time validation on each field
   - Error messages display immediately
   - Auto-save every 30 seconds
   ↓
4. User Uploads Files
   - Drag and drop or click to upload
   - File type validation (PDF, JPG, PNG for cert; JPG, PNG for photo)
   - File size validation (max 5MB)
   - Visual feedback showing file name and size
   ↓
5. User Submits Form
   - Full form validation
   - All fields checked for errors
   - FormData created with all fields + files
   ↓
6. Backend Processing
   - POST to /api/auth/register with multipart/form-data
   - Backend validates data
   - Checks for duplicate email/mobile/aadhaar
   - Saves files to disk
   - Stores user data in MySQL database
   - Auto-exports to Excel
   ↓
7. Success Response
   - Show success alert
   - Clear form data
   - Redirect to login page after 2 seconds
```

## Field Mapping

| HTML ID | Backend Name | Type | Required | Validation |
|---------|--------------|------|----------|-----------|
| first_name | firstName | String | Yes | 2-50 chars, letters only |
| last_name | lastName | String | Yes | 2-50 chars, letters only |
| mobile | mobile | String | Yes | 10 digits, starts 6-9 |
| email | email | String | Yes | Valid email format |
| street1 | street1 | String | Yes | Max 255 chars |
| street2 | street2 | String | No | Max 255 chars |
| city | city | String | Yes | Max 100 chars |
| state | state | String | Yes | Max 100 chars |
| postalCode | postalCode | String | Yes | 6 digits, valid PIN |
| aadhaar | aadhaar | String | Yes | 12 digits, valid Aadhaar |
| dateOfBirth | dateOfBirth | Date | Yes | Past date, reasonable age |
| vedham | vedham | String | Yes | Max 50 chars |
| shaka | shaka | String | No | Max 50 chars |
| gothram | gothram | String | Yes | Max 50 chars |
| soothram | soothram | String | No | Max 50 chars |
| patasalai | patasalai | String | No | Max 255 chars |
| adhyapakarName | adhyapakarName | String | No | Max 255 chars |
| certifiedIn | certifiedIn | String | No | Max 255 chars |
| yearOfCertification | yearOfCertification | String | No | 4-digit year |
| certFile | certFile | File | No | PDF, JPG, PNG, max 5MB |
| photoFile | photoFile | photoFile | No | JPG, PNG, max 5MB |

## Supported Languages

1. **English** (en) - Default
2. **Tamil** (ta)
3. **Telugu** (te)
4. **Hindi** (hi)

All UI text, form labels, hints, buttons, and messages support multilingual display.

## Features

### Client-Side Features
✅ Real-time form validation
✅ Multilingual support (4 languages)
✅ Drag-and-drop file uploads
✅ File type and size validation
✅ Auto-save to browser storage
✅ Keyboard shortcuts
✅ Responsive design
✅ Accessibility features
✅ Loading indicators
✅ Success/error alerts
✅ Form preview
✅ Data export (JSON/CSV)

### Backend Features
✅ Multipart file upload handling
✅ Field validation with detailed messages
✅ Duplicate detection (email, mobile, aadhaar)
✅ File storage on server
✅ Database persistence
✅ Excel auto-export
✅ Comprehensive logging
✅ Error handling

## Testing Guide

### 1. Basic Registration
```bash
1. Navigate to register.html
2. Fill in all required fields with valid data
3. Select files for certificate and photo
4. Click "Preview Application"
5. Verify all data is correct
6. Submit the form
7. Expect success message and redirect to login
```

### 2. Validation Testing
```bash
# Test first name validation
- Empty value → Error
- 1 character → Error
- Numbers "123" → Error
- Valid "John Smith" → OK

# Test mobile validation
- 8 digits "9876543210" → Error (starts with 6-9)
- 11 digits → Error
- Invalid "5234567890" → Error (starts with 5)
- Valid "9876543210" → OK

# Test email validation
- No @ symbol → Error
- "test@" → Error
- Valid "test@example.com" → OK

# Test PIN code
- 5 digits "12345" → Error
- 7 digits "1234567" → Error
- Starting with 0 "012345" → Error
- Valid "560034" → OK

# Test date of birth
- Future date → Error
- Age > 120 years → Error
- Valid past date → OK

# Test Aadhaar
- 11 digits → Error
- 13 digits → Error
- Invalid format → Error
- Valid 12-digit → OK
```

### 3. File Upload Testing
```bash
# Valid file uploads
- Certificate: upload PDF, JPG, PNG under 5MB
- Photo: upload JPG, PNG under 5MB

# Invalid uploads
- Certificate: try uploading .doc file → Error
- Certificate: try uploading 10MB PDF → Error
- Photo: try uploading .txt file → Error

# Drag and drop
- Drag cert file to upload zone → Should display filename and size
- Drag photo file to upload zone → Should display filename and size
```

### 4. Language Switching
```bash
1. Click different language buttons
2. Verify all form labels update
3. Verify success/error messages in selected language
4. Refresh page - language should persist
```

### 5. Auto-save Testing
```bash
1. Fill form with some data
2. Press Ctrl+S → Should show "Form data saved locally"
3. Refresh page → Data should still be present
4. Clear browser storage → Data should be gone
```

### 6. Error Handling
```bash
# Test duplicate email
- Register with email@example.com
- Try registering again with same email
- Should show error: "Email already exists"

# Test duplicate mobile
- Register with 9876543210
- Try registering with same mobile
- Should show error: "Mobile already registered"

# Test duplicate aadhaar
- Register with 123456789012
- Try registering with same aadhaar
- Should show error: "Aadhaar already registered"
```

## API Endpoint

### Registration Endpoint
```
POST /api/auth/register
Content-Type: multipart/form-data

Parameters:
- firstName (string, required)
- lastName (string, required)
- mobile (string, required)
- email (string, required)
- street1 (string, required)
- street2 (string, optional)
- city (string, required)
- state (string, required)
- postalCode (string, required)
- aadhaar (string, required)
- dateOfBirth (date, required)
- vedham (string, required)
- shaka (string, optional)
- gothram (string, required)
- soothram (string, optional)
- patasalai (string, optional)
- adhyapakarName (string, optional)
- certifiedIn (string, optional)
- yearOfCertification (string, optional)
- certFile (file, optional, max 5MB)
- photoFile (file, optional, max 5MB)

Response (Success):
{
  "status": "success",
  "message": "Registration successful! Welcome, John Doe",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "mobile": "+919876543210",
    "status": "PENDING",
    "createdAt": "2025-07-14T10:30:00"
  }
}

Response (Error):
{
  "status": "error",
  "message": "Email already exists",
  "data": null
}
```

## Troubleshooting

### Issue: Files not uploading
**Solution**: Check file size (< 5MB) and type (PDF/JPG/PNG for cert, JPG/PNG for photo)

### Issue: Form validation not working
**Solution**: Ensure validation.js is loaded before form.js in HTML

### Issue: Language not switching
**Solution**: Check browser console for JavaScript errors, ensure translator.js is loaded

### Issue: Backend not receiving files
**Solution**: Verify endpoint accepts "multipart/form-data" and MultipartFile parameters are correct

### Issue: Auto-save not working
**Solution**: Check browser localStorage is enabled and not full

## Performance Notes

- Form auto-save interval: 30 seconds
- File size limit: 5MB
- Supported file types:
  - Certificate: PDF, JPG, PNG
  - Photo: JPG, PNG
- Database indexes on email, mobile, aadhaar for fast duplicate checks

## Security Considerations

✓ File type validation on client-side
✓ File size validation on client-side
✓ Server-side validation on all fields
✓ SQL injection prevention via parameterized queries
✓ File upload directory outside web root
✓ CORS enabled for frontend (configurable)

## Future Enhancements

- [ ] Email verification
- [ ] OTP verification for mobile
- [ ] Profile photo cropping
- [ ] Document preview
- [ ] Payment integration
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Admin approval workflow
- [ ] API rate limiting
- [ ] HTTPS enforcement
