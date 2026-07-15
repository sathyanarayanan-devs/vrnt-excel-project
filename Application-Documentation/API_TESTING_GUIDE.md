# API Testing Guide - VRNT Registration

## Registration Endpoint

### URL
```
POST /api/auth/register
```

### Content-Type
```
multipart/form-data
```

### Parameters

#### Text Fields
| Parameter | Type | Required | Example | Validation |
|-----------|------|----------|---------|-----------|
| firstName | string | Yes | John | 2-50 chars, letters only |
| lastName | string | Yes | Doe | 2-50 chars, letters only |
| mobile | string | Yes | 9876543210 | 10 digits, starts 6-9 |
| email | string | Yes | john@example.com | Valid email |
| street1 | string | Yes | 123 Main St | Max 255 chars |
| street2 | string | No | Apt 456 | Max 255 chars |
| city | string | Yes | Chennai | Max 100 chars |
| state | string | Yes | Tamil Nadu | Max 100 chars |
| postalCode | string | Yes | 560034 | 6 digits, valid PIN |
| aadhaar | string | Yes | 123456789012 | 12 digits |
| dateOfBirth | date | Yes | 1990-05-15 | YYYY-MM-DD, past date |
| vedham | string | Yes | Rigveda | Max 50 chars |
| shaka | string | No | Yajurveda | Max 50 chars |
| gothram | string | Yes | Bharadwaja | Max 50 chars |
| soothram | string | No | Ashvalayan | Max 50 chars |
| patasalai | string | No | Sri Veda Pathasala | Max 255 chars |
| adhyapakarName | string | No | Dr. Sharma | Max 255 chars |
| certifiedIn | string | No | Vedic Studies | Max 255 chars |
| yearOfCertification | string | No | 2020 | 4-digit year |

#### File Fields
| Parameter | Type | Required | Max Size | Allowed Types |
|-----------|------|----------|----------|---------------|
| certFile | file | No | 5MB | PDF, JPG, PNG |
| photoFile | file | No | 5MB | JPG, PNG |

## CURL Examples

### 1. Basic Registration (Text Only)
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -F "firstName=John" \
  -F "lastName=Doe" \
  -F "mobile=9876543210" \
  -F "email=john@example.com" \
  -F "street1=123 Main Street" \
  -F "street2=Apt 456" \
  -F "city=Chennai" \
  -F "state=Tamil Nadu" \
  -F "postalCode=560034" \
  -F "aadhaar=123456789012" \
  -F "dateOfBirth=1990-05-15" \
  -F "vedham=Rigveda" \
  -F "shaka=Yajurveda" \
  -F "gothram=Bharadwaja" \
  -F "soothram=Ashvalayan" \
  -F "patasalai=Sri Veda Pathasala" \
  -F "adhyapakarName=Dr. Sharma" \
  -F "certifiedIn=Vedic Studies" \
  -F "yearOfCertification=2020"
```

### 2. Registration with Certificate File
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -F "firstName=John" \
  -F "lastName=Doe" \
  -F "mobile=9876543210" \
  -F "email=john@example.com" \
  -F "street1=123 Main Street" \
  -F "city=Chennai" \
  -F "state=Tamil Nadu" \
  -F "postalCode=560034" \
  -F "aadhaar=123456789012" \
  -F "dateOfBirth=1990-05-15" \
  -F "vedham=Rigveda" \
  -F "gothram=Bharadwaja" \
  -F "certFile=@/path/to/certificate.pdf"
```

### 3. Registration with Both Files
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -F "firstName=John" \
  -F "lastName=Doe" \
  -F "mobile=9876543210" \
  -F "email=john@example.com" \
  -F "street1=123 Main Street" \
  -F "city=Chennai" \
  -F "state=Tamil Nadu" \
  -F "postalCode=560034" \
  -F "aadhaar=123456789012" \
  -F "dateOfBirth=1990-05-15" \
  -F "vedham=Rigveda" \
  -F "gothram=Bharadwaja" \
  -F "certFile=@/path/to/certificate.pdf" \
  -F "photoFile=@/path/to/photo.jpg"
```

## Success Response

```json
{
  "status": "success",
  "message": "Registration successful! Welcome, John Doe",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "mobile": "+919876543210",
    "email": "john@example.com",
    "street1": "123 Main Street",
    "street2": "Apt 456",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "postalCode": "560034",
    "aadhaar": "123456789012",
    "dateOfBirth": "1990-05-15",
    "vedham": "Rigveda",
    "shaka": "Yajurveda",
    "gothram": "Bharadwaja",
    "soothram": "Ashvalayan",
    "patasalai": "Sri Veda Pathasala",
    "adhyapakarName": "Dr. Sharma",
    "certifiedIn": "Vedic Studies",
    "yearOfCertification": "2020",
    "certificatePath": "/uploads/cert_1234567890.pdf",
    "photoPath": "/uploads/photo_1234567890.jpg",
    "status": "PENDING",
    "createdAt": "2025-07-14T10:30:00.123456",
    "updatedAt": null
  }
}
```

## Error Responses

### 1. Validation Error
```json
{
  "status": "error",
  "message": "First name should contain only letters and spaces",
  "data": null
}
```

### 2. Duplicate Email Error
```json
{
  "status": "error",
  "message": "An account with email 'john@example.com' already exists",
  "data": null
}
```

### 3. Duplicate Mobile Error
```json
{
  "status": "error",
  "message": "Mobile number '9876543210' is already registered",
  "data": null
}
```

### 4. Duplicate Aadhaar Error
```json
{
  "status": "error",
  "message": "Aadhaar number '123456789012' is already registered",
  "data": null
}
```

### 5. Invalid File Error
```json
{
  "status": "error",
  "message": "Invalid file type for certificate. Allowed: application/pdf, image/jpeg, image/png",
  "data": null
}
```

### 6. File Size Error
```json
{
  "status": "error",
  "message": "File size must be less than 5MB",
  "data": null
}
```

## Postman Collection

### Import this as a Postman request

**Method**: POST  
**URL**: `{{base_url}}/api/auth/register`  
**Content-Type**: `multipart/form-data`

**Body** (form-data):
```
Key: firstName | Value: John | Type: Text
Key: lastName | Value: Doe | Type: Text
Key: mobile | Value: 9876543210 | Type: Text
Key: email | Value: john@example.com | Type: Text
Key: street1 | Value: 123 Main Street | Type: Text
Key: street2 | Value: Apt 456 | Type: Text
Key: city | Value: Chennai | Type: Text
Key: state | Value: Tamil Nadu | Type: Text
Key: postalCode | Value: 560034 | Type: Text
Key: aadhaar | Value: 123456789012 | Type: Text
Key: dateOfBirth | Value: 1990-05-15 | Type: Text
Key: vedham | Value: Rigveda | Type: Text
Key: shaka | Value: Yajurveda | Type: Text
Key: gothram | Value: Bharadwaja | Type: Text
Key: soothram | Value: Ashvalayan | Type: Text
Key: patasalai | Value: Sri Veda Pathasala | Type: Text
Key: adhyapakarName | Value: Dr. Sharma | Type: Text
Key: certifiedIn | Value: Vedic Studies | Type: Text
Key: yearOfCertification | Value: 2020 | Type: Text
Key: certFile | Value: (select file) | Type: File
Key: photoFile | Value: (select file) | Type: File
```

## JavaScript Fetch Examples

### 1. Basic Registration with Fetch
```javascript
const formData = new FormData();
formData.append('firstName', 'John');
formData.append('lastName', 'Doe');
formData.append('mobile', '9876543210');
formData.append('email', 'john@example.com');
formData.append('street1', '123 Main Street');
formData.append('city', 'Chennai');
formData.append('state', 'Tamil Nadu');
formData.append('postalCode', '560034');
formData.append('aadhaar', '123456789012');
formData.append('dateOfBirth', '1990-05-15');
formData.append('vedham', 'Rigveda');
formData.append('gothram', 'Bharadwaja');

fetch('/api/auth/register', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### 2. Registration with File Upload
```javascript
const formData = new FormData();
formData.append('firstName', 'John');
formData.append('lastName', 'Doe');
formData.append('mobile', '9876543210');
formData.append('email', 'john@example.com');
formData.append('street1', '123 Main Street');
formData.append('city', 'Chennai');
formData.append('state', 'Tamil Nadu');
formData.append('postalCode', '560034');
formData.append('aadhaar', '123456789012');
formData.append('dateOfBirth', '1990-05-15');
formData.append('vedham', 'Rigveda');
formData.append('gothram', 'Bharadwaja');

// Add file
const certFileInput = document.getElementById('certFile');
if (certFileInput.files.length > 0) {
  formData.append('certFile', certFileInput.files[0]);
}

const photoFileInput = document.getElementById('photoFile');
if (photoFileInput.files.length > 0) {
  formData.append('photoFile', photoFileInput.files[0]);
}

fetch('/api/auth/register', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  if (data.status === 'success') {
    console.log('Registration successful!', data.data);
  } else {
    console.error('Registration failed:', data.message);
  }
})
.catch(error => console.error('Error:', error));
```

### 3. Registration with Error Handling
```javascript
async function registerUser(formData) {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Registration failed');
    }

    console.log('Success:', result.data);
    return result.data;
  } catch (error) {
    console.error('Registration error:', error.message);
    throw error;
  }
}

// Usage
try {
  const userData = await registerUser(formData);
  console.log('Registered user:', userData);
} catch (error) {
  // Handle error - show message to user
}
```

## Test Data Sets

### Valid Test Data
```
Name: John Doe
Mobile: 9876543210
Email: john.doe@example.com
Address: 123 Main St, Apt 456, Chennai, Tamil Nadu, 560034
Aadhaar: 123456789012
DOB: 1990-05-15
Vedham: Rigveda
Gothram: Bharadwaja
```

### Invalid Test Data (for validation testing)

#### Invalid First Name
- `123` (numbers)
- `j` (too short)
- `John@Doe` (special characters)

#### Invalid Mobile
- `5876543210` (starts with 5)
- `987654321` (9 digits)
- `98765432101` (11 digits)

#### Invalid Email
- `john@` (incomplete)
- `john.example.com` (no @)
- `@example.com` (no local part)

#### Invalid PIN Code
- `12345` (5 digits)
- `0123456` (starts with 0)
- `12345a` (contains letter)

#### Invalid Aadhaar
- `12345678901` (11 digits)
- `1234567890123` (13 digits)
- `000000000000` (invalid format)

#### Invalid Date of Birth
- Future date
- 150 years ago
- Invalid format

## Performance Notes

- Max file size per request: 10MB (5MB per file)
- Concurrent registration requests: No limit
- Average response time: < 1 second
- Database indexes on email, mobile, aadhaar for fast lookups
- File storage optimized for quick access

## Monitoring & Logging

### Backend Logs
- Registration request received
- Duplicate check results
- File save operations
- Database insert operations
- Excel export status
- Error details

### Frontend Logs
- Form initialization
- Validation events
- File upload events
- API request/response
- Error handling

## Troubleshooting

### Issue: 400 Bad Request
**Solution**: Check all required fields are present and valid

### Issue: 409 Conflict (Email exists)
**Solution**: Use a different email address

### Issue: 413 Payload Too Large
**Solution**: Reduce file size (< 5MB)

### Issue: 500 Internal Server Error
**Solution**: Check server logs for detailed error message

### Issue: CORS Error
**Solution**: Ensure frontend is making request to correct API URL
