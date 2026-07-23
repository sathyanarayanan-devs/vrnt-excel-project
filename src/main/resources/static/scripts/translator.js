/* ════════════════════════════════════════════════════════════
   VRNT - TRANSLATOR
   Supported: English, Tamil, Telugu, Hindi, Sanskrit

   Language is stored in localStorage and remains selected
   across all HTML pages until manually changed.
════════════════════════════════════════════════════════════ */

const LANGUAGE_STORAGE_KEY = "vrntLanguage";

let currentLanguage = "en";


/* ════════════════════════════════════════════════════════════
   TRANSLATIONS
════════════════════════════════════════════════════════════ */

const TranslationDictionary = {

    /* ========================================================
       ENGLISH
    ======================================================== */

    en: {
        form_title: "Application Form",

        step_personal: "Personal Details",
        step_preview: "Preview",
        step_submit: "Submit",

        section_personal: "Personal Details",
        section_vedic: "Vedic Details",
        section_upload: "Document Upload",

        lbl_name_aadhaar: "Name as in Aadhaar",
        lbl_first_name: "First Name",
        lbl_last_name: "Last Name",
        lbl_mobile: "Mobile Number",
        lbl_email: "Email ID",
        lbl_password: "Password",
        lbl_address: "Address",
        lbl_city: "City",
        lbl_state: "State",
        lbl_aadhaar: "Aadhaar Number",
        lbl_dob: "Date of Birth",
        lbl_vedham: "Vedham",
        lbl_shaka: "Shaka",
        lbl_gothram: "Gothram",
        lbl_soothram: "Soothram",
        lbl_patasalai: "Patasalai",
        lbl_adhyapakar: "Veda Adhyapakar's Name",
        lbl_certified_in: "Certified In",
        lbl_year_cert: "Year of Certification",
        lbl_cert_upload: "Certificate Upload",
        lbl_photo_upload: "Passport Size Photo Upload",

        hint_first_name: "Enter your first name",
        hint_last_name: "Enter your last name",
        hint_mobile: "98765 43210",
        hint_email: "example@example.com",
        hint_password: "Minimum 6 characters",
        hint_street1: "Street Address Line 1",
        hint_street2: "Street Address Line 2 (optional)",
        hint_city: "City / Town",
        hint_state: "State / Union Territory",
        hint_postal: "PIN Code (6 digits)",
        hint_year: "e.g., 2020",

        upload_title: "Upload a File",

        btn_preview: "Preview Application",
        btn_submit: "Submit Application",
        btn_back: "Back",
        btn_next: "Next",
        btn_cancel: "Cancel",
        btn_reset: "Reset",

        msg_loading: "Submitting your application...",
        msg_success: "Application submitted successfully.",
        "success.title": "Application Submitted Successfully",
        "success.description": "Your application has been received successfully. You can now return to the home page and log in to continue.",
        "success.homeButton": "Returns to home and Log In",
        msg_validation_error: "Please fix the highlighted errors before continuing.",
        msg_error: "We could not submit your application. Please try again.",

        "site.title": "VRNT - Veda Rakshana Nidhi Trust",
        "menu.title": "Menu",

        "nav.login": "Login",
        "nav.register": "Register",
        "nav.about": "About Us",
        "nav.contact": "Contact",

        "button.login": "Login",
        "button.register": "Register",

        "hero.greeting": "SRI GURUBYO NAMAHA",
        "hero.tagline":
            "Preserving and Promoting the Vedas for Future Generations",
        "hero.address":
            "64/31, Subramaniam Street, West Mambalam, Chennai - 600 033",
        "hero.sponsor":
            "Sponsored by His Holiness Pujya Sri Maha Swamigal (Paramacharyal)",

        "login.title": "Login to Your Account",
        "login.subtitle":
            "Sign in to access your account and continue",
        "login.usernameLabel": "Username or Email",
        "login.usernamePlaceholder":
            "Enter your username or email",
        "login.usernameHelp":
            "Enter your registered username or email address",
        "login.passwordLabel": "Password",
        "login.passwordPlaceholder": "Enter your password",
        "login.passwordHelp":
            "Password must be at least 6 characters long",
        "login.rememberMe": "Remember me",
        "login.signInBtn": "Sign In",
        "login.forgotPwd": "Forgot Password?",
        "login.noAccount": "Don't Have an Account?",
        "login.createAccount": "Create Account",
        "login.agreePrefix": "By signing in, you agree to our",
        "login.terms": "Terms of Service",
        "login.and": "and",
        "login.privacy": "Privacy Policy",

        "forgot.title": "Reset Your Password",
        "forgot.subtitle":
            "We'll help you get back into your account",
        "forgot.instruction":
            "Enter your email address and we'll send you a password reset link to your email.",
        "forgot.emailLabel": "Email Address",
        "forgot.emailPlaceholder":
            "Enter your registered email address",
        "forgot.emailHelp":
            "We'll send a password reset link to this email",
        "forgot.sendBtn": "Send Reset Link",
        "forgot.backBtn": "Back to Login",
        "forgot.successTitle": "Reset Link Sent!",
        "forgot.successMsg1":
            "We've sent a password reset link to your email address.",
        "forgot.successMsg2":
            "Please check your inbox and follow the instructions to reset your password.",
        "forgot.resendPrefix":
            "Didn't receive the email? Check your spam folder or",
        "forgot.resendLink": "click here to resend",
        "forgot.rememberPwd": "Remember your password?",
        "forgot.loginLink": "Login to your account",
        "forgot.footerNote":
            "For security reasons, the password reset link will expire in 30 minutes.",

        "search.pageTitle": "Search Application",
        "search.pageSubtitle": "Review and manage registered users with ease",
        "search.filtersHeading": "Search Filters",
        "search.roleLabel": "Role",
        "search.roleDefault": "Select A Role",
        "search.roleNormal": "Normal",
        "search.roleAdmin": "Admin",
        "search.usernameLabel": "Username",
        "search.usernamePlaceholder":
            "Enter username to search",
        "search.usernameHelp":
            "Leave blank to search all users",
        "search.searchBtn": "Search Applications",
        "search.resultsHeading": "Search Results",
        "search.thName": "Name",
        "search.thUsername": "Username",
        "search.thEmail": "Email",
        "search.thRole": "Role",
        "search.thDepartment": "Department",
        "search.thGender": "Gender",
        "search.thActions": "Actions",
        "search.emptyTitle": "No Search Results",
        "search.emptyMsg":
            "Enter search criteria above to find applications.",
        "search.viewAllBtn": "View All Users",
        "search.clearBtn": "Clear Filters",
        "search.refreshBtn": "Refresh",
        "search.exportAllBtn": "Export All Users",
        "search.exportNormalsBtn": "Export Normal Users",
        "search.exportAdminsBtn": "Export Admin Users",
        "search.logoutBtn": "Log Out",
        "search.adminUser": "Admin User",
        "search.modal.title": "Confirm Log Out",
        "search.modal.question": "Are you sure you want to log out?",
        "search.modal.warning": "You will be redirected to the login page. Any unsaved changes will be lost.",
        "search.modal.currentUser": "Current User",
        "search.modal.sessionActive": "Session active since:",
        "search.modal.cancel": "Cancel",
        "search.modal.confirm": "Yes, Log Out",

        "common.cancel": "Cancel",
        "common.logout": "Logout",
        "common.home": "Go to Home",

        "dashboard.title": "Dashboard",
        "dashboard.user.welcome": "Welcome",
        "dashboard.user.subtitle": "View and manage your profile information",
        "dashboard.user.meta": "Last updated: Just now",
        "dashboard.user.details": "My Profile Information",
        "dashboard.logout.title": "Confirm Log Out",
        "dashboard.logout.confirm": "Are you sure you want to log out?",
        "dashboard.admin.title": "Admin Dashboard",
        "dashboard.admin.welcome": "Admin Dashboard",
        "dashboard.admin.subtitle": "Manage and view all registered users",
        "dashboard.admin.meta": "You have full administrative access",
        "dashboard.admin.totalUsers": "Total Users",
        "dashboard.admin.registeredUsers": "Registered users in system",
        "dashboard.admin.search": "Search & Manage",
        "dashboard.admin.searchAccess": "Access user search and management",
        "dashboard.admin.export": "Export Data",
        "dashboard.admin.exportAccess": "Export user data to Excel/CSV",
        "dashboard.admin.adminInfo": "Administrator Information",
        "dashboard.admin.adminRole": "Administrator",
        "dashboard.admin.goToSearch": "Go to Search Page",
        "dashboard.admin.capabilities": "Your Capabilities",
        "dashboard.admin.cap1": "Search and filter all registered users",
        "dashboard.admin.cap2": "View detailed user information and profiles",
        "dashboard.admin.cap3": "Export user data to Excel and CSV formats",
        "dashboard.admin.cap4": "Select and download specific user records",
        "dashboard.admin.cap5": "Full access to system administration features",

        "form.firstName": "First Name",
        "form.lastName": "Last Name",
        "form.email": "Email",
        "form.mobile": "Mobile",
        "form.aadhaar": "Aadhaar",
        "form.dob": "Date of Birth",
        "form.city": "City",
        "form.state": "State",
        "form.vedham": "Vedham",
        "form.gothram": "Gothram",
        "form.certified": "Certified In",
        "form.yearCert": "Year of Certification",

        /* PREVIEW PAGE */

        "preview.pageTitle":
            "Preview Application - Veda Rakshana Nidhi Trust",

        "preview.trustTitle":
            "Veda Rakshana Nidhi Trust",

        "preview.reviewTitle":
            "Review Your Application",

        "preview.reviewText":
            "Please verify the details below before submitting your application.",

        "preview.editButton":
            "Edit Application",

        "preview.submitButton":
            "Submit Application",

        "preview.personalSection":
            "Personal Details",

        "preview.vedicSection":
            "Vedic Details",

        "preview.noDetails":
            "No details provided.",

        "preview.noData":
            "No application data was found. Please go back and complete the form.",

        "preview.noSubmitData":
            "No application data found to submit.",

        "preview.field.first_name": "First Name",
        "preview.field.last_name": "Last Name",
        "preview.field.mobile": "Mobile Number",
        "preview.field.email": "Email ID",
        "preview.field.password": "Password",
        "preview.field.street1": "Street Address Line 1",
        "preview.field.street2": "Street Address Line 2",
        "preview.field.city": "City",
        "preview.field.state": "State",
        "preview.field.postalCode": "PIN Code",
        "preview.field.aadhaar": "Aadhaar Number",
        "preview.field.dateOfBirth": "Date of Birth",
        "preview.field.vedham": "Vedham",
        "preview.field.shaka": "Shaka",
        "preview.field.gothram": "Gothram",
        "preview.field.soothram": "Soothram",
        "preview.field.patasalai": "Patasalai",
        "preview.field.adhyapakarName":
            "Veda Adhyapakar Name",
        "preview.field.certifiedIn": "Certified In",
        "preview.field.yearOfCertification":
            "Year of Certification",

        "login.fillAllFields": "Please fill in all fields",
        "login.validEmailOrUsername": "Please enter a valid email address or username",
        "login.inProgress": "Logging in...",
        "login.successRedirect": "Login successful! Redirecting...",
        "login.failed": "Login failed. Please try again.",
        "login.error": "An error occurred. Please try again.",
        "forgot.enterEmail": "Please enter your email address",
        "forgot.validEmail": "Please enter a valid email address",
        "forgot.sending": "Sending...",
        "forgot.failed": "Failed to process your request. Please try again.",
        "forgot.errorLater": "An error occurred. Please try again later.",
        "forgot.resetSentRedirect": "Password reset link sent! Redirecting to login...",
        "forgot.successTitle": "Email Sent Successfully!",
        "forgot.successMessage": "We've sent a password reset link to",
        "forgot.successInstruction": "Please check your email and follow the link to reset your password. If you don't see the email, please check your spam folder.",
        "index.alreadyRegistered": "You are already registered. Please visit your dashboard.",
        "index.alreadyLoggedIn": "You are already logged in.",
        "index.loginFirst": "Please log in first.",
        "dashboard.sessionExpired": "Session expired. Redirecting to login...",
        "dashboard.logoutSuccess": "Logged out successfully. Redirecting...",
        "dashboard.user.defaultName": "User",
        "dashboard.user.noEmail": "No email available",
        "dashboard.user.member": "Member",
        "dashboard.admin.cardTotalUsers": "Total Users",
        "dashboard.admin.cardReady": "Ready",
        "dashboard.admin.cardSearch": "Search & Manage",
        "dashboard.admin.cardExport": "Export Data",
        "dashboard.admin.cardAvailable": "Available",
        "dashboard.admin.cardSearchSubtitle": "Access user search and management",
        "dashboard.admin.cardExportSubtitle": "Export user data to Excel/CSV",
        "search.accessDenied": "Access denied. Admin access required.",
        "search.unknownUser": "Unable to determine authenticated user. Please log in again.",
        "search.loadUsersFailed": "Failed to load users.",
        "search.noFilteredUsers": "There are no filtered users to export.",
        "search.noUsers": "There are no users to export.",
        "search.authRequired": "Authentication required to export data.",
        "search.exportSuccess": "Excel export started successfully.",
        "search.exportFailed": "Excel export failed. Please try again.",
        "search.csvExportSuccess": "CSV export started successfully.",
        "search.viewBtn": "View",
        "search.detail.applicantName": "Applicant Name",
        "search.detail.username": "Username",
        "search.detail.email": "Email",
        "search.detail.mobile": "Mobile",
        "search.detail.role": "Role",
        "search.detail.state": "State",
        "search.detail.city": "District / City",
        "search.detail.aadhaar": "Aadhaar",
        "search.detail.dob": "Date of Birth",
        "search.detail.street1": "Street Address 1",
        "search.detail.street2": "Street Address 2",
        "search.detail.postalCode": "Postal Code",
        "search.detail.vedham": "Vedham",
        "search.detail.shaka": "Shaka",
        "search.detail.gothram": "Gothram",
        "search.detail.soothram": "Soothram",
        "search.detail.patasalai": "Patasalai",
        "search.detail.adhyapakar": "Veda Adhyapakar",
        "search.detail.certifiedIn": "Certified In",
        "search.detail.yearOfCertification": "Year of Certification",
        "search.detail.certificate": "Certificate",
        "search.detail.photo": "Photo",
        "search.detail.notUploaded": "Not uploaded",
        "form.dataSaved": "Form data saved locally",
        "form.duplicateEmail": "A duplicate email was detected. Retrying with a fresh email address.",
        "footer.copyright":
            "© 2025 Veda Rakshana Nidhi Trust. All rights reserved."
    },


    /* ========================================================
       TAMIL
    ======================================================== */

    ta: {
        form_title: "விண்ணப்பப் படிவம்",

        step_personal: "தனிப்பட்ட விவரங்கள்",
        step_preview: "முன்னோட்டம்",
        step_submit: "சமர்ப்பித்தல்",

        section_personal: "தனிப்பட்ட விவரங்கள்",
        section_vedic: "வேத விவரங்கள்",
        section_upload: "ஆவணப் பதிவேற்றம்",

        lbl_name_aadhaar: "ஆதாரில் உள்ளபடி பெயர்",
        lbl_first_name: "முதல் பெயர்",
        lbl_last_name: "கடைசி பெயர்",
        lbl_mobile: "கைபேசி எண்",
        lbl_email: "மின்னஞ்சல் முகவரி",
        lbl_password: "கடவுச்சொல்",
        lbl_address: "முகவரி",
        lbl_city: "நகரம்",
        lbl_state: "மாநிலம்",
        lbl_aadhaar: "ஆதார் எண்",
        lbl_dob: "பிறந்த தேதி",
        lbl_vedham: "வேதம்",
        lbl_shaka: "சாகை",
        lbl_gothram: "கோத்திரம்",
        lbl_soothram: "சூத்திரம்",
        lbl_patasalai: "பாடசாலை",
        lbl_adhyapakar: "வேத அத்யாபகரின் பெயர்",
        lbl_certified_in: "சான்றிதழ் பெற்ற பிரிவு",
        lbl_year_cert: "சான்றிதழ் பெற்ற ஆண்டு",
        lbl_cert_upload: "சான்றிதழைப் பதிவேற்றவும்",
        lbl_photo_upload:
            "பாஸ்போர்ட் அளவு புகைப்படத்தைப் பதிவேற்றவும்",

        hint_first_name: "உங்கள் முதல் பெயரை உள்ளிடவும்",
        hint_last_name: "உங்கள் கடைசி பெயரை உள்ளிடவும்",
        hint_mobile: "98765 43210",
        hint_email: "example@example.com",
        hint_password: "குறைந்தது 6 எழுத்துகள்",
        hint_street1: "தெரு முகவரி வரி 1",
        hint_street2: "தெரு முகவரி வரி 2 (விருப்பம்)",
        hint_city: "நகரம் / ஊர்",
        hint_state: "மாநிலம் / யூனியன் பிரதேசம்",
        hint_postal: "அஞ்சல் குறியீடு (6 இலக்கங்கள்)",
        hint_year: "உதாரணம்: 2020",

        upload_title: "கோப்பைப் பதிவேற்றவும்",

        btn_preview: "விண்ணப்பத்தை முன்னோட்டமிடவும்",
        btn_submit: "விண்ணப்பத்தை சமர்ப்பிக்கவும்",
        btn_back: "பின்செல்",
        btn_next: "அடுத்து",
        btn_cancel: "ரத்து செய்",
        btn_reset: "மீட்டமை",

        "site.title":
            "VRNT - வேத ரக்ஷண நிதி அறக்கட்டளை",

        "menu.title": "பட்டியல்",

        "nav.login": "உள்நுழைவு",
        "nav.register": "பதிவு",
        "nav.about": "எங்களைப் பற்றி",
        "nav.contact": "தொடர்பு",

        "button.login": "உள்நுழையவும்",
        "button.register": "பதிவு செய்யவும்",

        "hero.greeting": "ஸ்ரீ குருப்யோ நமஹ",
        "hero.tagline":
            "எதிர்கால தலைமுறைகளுக்காக வேதங்களைப் பாதுகாத்து வளர்த்தல்",
        "hero.address":
            "64/31, சுப்பிரமணியம் தெரு, மேற்கு மாம்பலம், சென்னை - 600 033",
        "hero.sponsor":
            "பூஜ்ய ஸ்ரீ மகா ஸ்வாமிகள் (பரமாச்சார்யாள்) அவர்களின் அருளாசியுடன்",

        "login.title": "உங்கள் கணக்கில் உள்நுழையவும்",
        "login.subtitle":
            "உங்கள் கணக்கை அணுக உள்நுழையவும்",
        "login.usernameLabel":
            "பயனர் பெயர் அல்லது மின்னஞ்சல்",
        "login.usernamePlaceholder":
            "பயனர் பெயர் அல்லது மின்னஞ்சலை உள்ளிடவும்",
        "login.usernameHelp":
            "பதிவு செய்யப்பட்ட பயனர் பெயர் அல்லது மின்னஞ்சல் முகவரியை உள்ளிடவும்",
        "login.passwordLabel": "கடவுச்சொல்",
        "login.passwordPlaceholder":
            "உங்கள் கடவுச்சொல்லை உள்ளிடவும்",
        "login.passwordHelp":
            "கடவுச்சொல் குறைந்தது 6 எழுத்துகளைக் கொண்டிருக்க வேண்டும்",
        "login.rememberMe": "என்னை நினைவில் வைத்திரு",
        "login.signInBtn": "உள்நுழையவும்",
        "login.forgotPwd":
            "கடவுச்சொல்லை மறந்துவிட்டீர்களா?",
        "login.noAccount": "கணக்கு இல்லையா?",
        "login.createAccount": "கணக்கை உருவாக்கவும்",
        "login.agreePrefix":
            "உள்நுழைவதன் மூலம், எங்களின்",
        "login.terms": "சேவை விதிமுறைகள்",
        "login.and": "மற்றும்",
        "login.privacy": "தனியுரிமைக் கொள்கை",

        "forgot.title":
            "உங்கள் கடவுச்சொல்லை மீட்டமைக்கவும்",
        "forgot.subtitle":
            "உங்கள் கணக்கை மீண்டும் அணுக உதவுகிறோம்",
        "forgot.instruction":
            "உங்கள் மின்னஞ்சல் முகவரியை உள்ளிடவும். கடவுச்சொல்லை மீட்டமைக்கும் இணைப்பை மின்னஞ்சலில் அனுப்புவோம்.",
        "forgot.emailLabel": "மின்னஞ்சல் முகவரி",
        "forgot.emailPlaceholder":
            "பதிவு செய்யப்பட்ட மின்னஞ்சல் முகவரியை உள்ளிடவும்",
        "forgot.emailHelp":
            "கடவுச்சொல் மீட்டமைப்பு இணைப்பு இந்த மின்னஞ்சலுக்கு அனுப்பப்படும்",
        "forgot.sendBtn":
            "மீட்டமைப்பு இணைப்பை அனுப்பவும்",
        "forgot.backBtn":
            "உள்நுழைவுக்குத் திரும்பவும்",
        "forgot.successTitle":
            "மீட்டமைப்பு இணைப்பு அனுப்பப்பட்டது!",
        "forgot.successMsg1":
            "உங்கள் மின்னஞ்சல் முகவரிக்கு கடவுச்சொல் மீட்டமைப்பு இணைப்பை அனுப்பியுள்ளோம்.",
        "forgot.successMsg2":
            "உங்கள் மின்னஞ்சல் பெட்டியைச் சரிபார்த்து, வழங்கப்பட்ட வழிமுறைகளைப் பின்பற்றவும்.",
        "forgot.resendPrefix":
            "மின்னஞ்சல் கிடைக்கவில்லையா? தேவையற்ற அஞ்சல் கோப்புறையைச் சரிபார்க்கவும் அல்லது",
        "forgot.resendLink":
            "மீண்டும் அனுப்ப இங்கே சொடுக்கவும்",
        "forgot.rememberPwd":
            "உங்கள் கடவுச்சொல் நினைவில் உள்ளதா?",
        "forgot.loginLink":
            "உங்கள் கணக்கில் உள்நுழையவும்",
        "forgot.footerNote":
            "பாதுகாப்பு காரணங்களுக்காக, கடவுச்சொல் மீட்டமைப்பு இணைப்பு 30 நிமிடங்களில் காலாவதியாகும்.",

        "success.title": "விண்ணப்பம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது",
        "success.description": "உங்கள் விண்ணப்பம் வெற்றிகரமாக பெறப்பட்டது. இப்போது ஹோம் பக்கத்திற்குச் சென்று உள்நுழையலாம்.",
        "success.homeButton": "முகப்பிற்குத் திரும்பி உள்நுழையவும்",

        "search.pageTitle": "விண்ணப்பத் தேடல்",
        "search.filtersHeading": "தேடல் வடிகட்டிகள்",
        "search.roleLabel": "பங்கு",
        "search.roleDefault":
            "ஒரு பங்கைத் தேர்ந்தெடுக்கவும்",
        "search.roleNormal": "பொது பயனர்",
        "search.roleAdmin": "நிர்வாகி",
        "search.usernameLabel": "பயனர் பெயர்",
        "search.usernamePlaceholder":
            "தேட பயனர் பெயரை உள்ளிடவும்",
        "search.usernameHelp":
            "அனைத்து பயனர்களையும் தேட காலியாக விடவும்",
        "search.searchBtn":
            "விண்ணப்பங்களைத் தேடவும்",
        "search.resultsHeading": "தேடல் முடிவுகள்",
        "search.thName": "பெயர்",
        "search.thUsername": "பயனர் பெயர்",
        "search.thEmail": "மின்னஞ்சல்",
        "search.thRole": "பங்கு",
        "search.thDepartment": "துறை",
        "search.thGender": "பாலினம்",
        "search.thActions": "செயல்கள்",
        "search.emptyTitle": "தேடல் முடிவுகள் இல்லை",
        "search.emptyMsg":
            "விண்ணப்பங்களைத் தேட மேலே உள்ள தேடல் விவரங்களை உள்ளிடவும்.",
        "search.viewAllBtn":
            "அனைத்து பயனர்களையும் காண்க",
        "search.clearBtn":
            "வடிகட்டிகளை அழிக்கவும்",
        "search.refreshBtn": "புதுப்பிக்கவும்",
        "search.exportAllBtn":
            "அனைத்து பயனர்களையும் ஏற்றுமதி செய்",
        "search.exportNormalsBtn":
            "பொது பயனர்களை ஏற்றுமதி செய்",
        "search.exportAdminsBtn":
            "நிர்வாகிகளை ஏற்றுமதி செய்",
        "search.logoutBtn": "வெளியேறு",
        "search.adminUser": "நிர்வாக பயனர்",
        "search.pageSubtitle": "பதிவு செய்யப்பட்ட பயனர்களை எளிதாக மதிப்பாய்வு செய்து நிர்வகிக்கவும்",
        "search.modal.title": "வெளியேறுதலை உறுதிப்படுத்தவும்",
        "search.modal.question": "நிச்சயமாக வெளியேற விரும்புகிறீர்களா?",
        "search.modal.warning": "நீங்கள் உள்நுழைவு பக்கத்திற்கு திருப்பி அனுப்பப்படுவீர்கள். சேமிக்கப்படாத மாற்றங்கள் இழக்கப்படும்.",
        "search.modal.currentUser": "தற்போதைய பயனர்",
        "search.modal.sessionActive": "அமர்வு செயலில் உள்ள நேரம்:",
        "search.modal.cancel": "ரத்து செய்",
        "search.modal.confirm": "ஆம், வெளியேறு",

        "common.cancel": "ரத்து செய்",
        "common.logout": "வெளியேறு",
        "common.home": "முகப்புக்குச் செல்லவும்",

        "dashboard.title": "கட்டுப்பாட்டுப் பலகை",
        "dashboard.user.welcome": "வரவேற்கிறோம்",
        "dashboard.user.subtitle": "உங்கள் விவரங்களைப் பார்க்கவும் நிர்வகிக்கவும்",
        "dashboard.user.meta": "கடைசியாக புதுப்பிக்கப்பட்டது: இப்போதே",
        "dashboard.user.details": "என் சுயவிவரத் தகவல்",
        "dashboard.logout.title": "வெளியேறுவதை உறுதிப்படுத்தவும்",
        "dashboard.logout.confirm": "நீங்கள் நிச்சயமாக வெளியேற விரும்புகிறீர்களா?",
        "dashboard.admin.title": "நிர்வாகப் பலகம்",
        "dashboard.admin.welcome": "நிர்வாகப் பலகம்",
        "dashboard.admin.subtitle": "அனைத்து பதிவு செய்யப்பட்ட பயனர்களையும் நிர்வகிக்கவும் பார்க்கவும்",
        "dashboard.admin.meta": "உங்களுக்கு முழு நிர்வாக அணுகல் உள்ளது",
        "dashboard.admin.totalUsers": "மொத்த பயனர்கள்",
        "dashboard.admin.registeredUsers": "சிஸ்டத்தில் பதிவு செய்யப்பட்ட பயனர்கள்",
        "dashboard.admin.search": "தேடல் & நிர்வாகம்",
        "dashboard.admin.searchAccess": "பயனர் தேடல் மற்றும் நிர்வாகத்தை அணுகவும்",
        "dashboard.admin.export": "தரவு ஏற்றுமதி",
        "dashboard.admin.exportAccess": "பயனர் தரவை Excel/CSV ஆக ஏற்றுமதி செய்யவும்",
        "dashboard.admin.adminInfo": "நிர்வாகி தகவல்",
        "dashboard.admin.adminRole": "நிர்வாகி",
        "dashboard.admin.goToSearch": "தேடல் பக்கத்திற்குச் செல்லவும்",
        "dashboard.admin.capabilities": "உங்கள் திறன்கள்",
        "dashboard.admin.cap1": "அனைத்து பதிவு செய்யப்பட்ட பயனர்களையும் தேடவும் வடிகட்டவும்",
        "dashboard.admin.cap2": "விவரமான பயனர் தகவல் மற்றும் சுயவிவரங்களைப் பார்க்கவும்",
        "dashboard.admin.cap3": "பயனர் தரவை Excel மற்றும் CSV வடிவங்களில் ஏற்றுமதி செய்யவும்",
        "dashboard.admin.cap4": "குறிப்பிட்ட பயனர் பதிவுகளைத் தேர்ந்தெடுத்து பதிவிறக்கவும்",
        "dashboard.admin.cap5": "அமைப்பு நிர்வாக அம்சங்களுக்கான முழு அணுகல்",

        "form.firstName": "முதல் பெயர்",
        "form.lastName": "கடைசி பெயர்",
        "form.email": "மின்னஞ்சல்",
        "form.mobile": "கைபேசி",
        "form.aadhaar": "ஆதார்",
        "form.dob": "பிறந்த தேதி",
        "form.city": "நகரம்",
        "form.state": "மாநிலம்",
        "form.vedham": "வேதம்",
        "form.gothram": "கோத்திரம்",
        "form.certified": "சான்றிதழ் பெற்ற பிரிவு",
        "form.yearCert": "சான்றிதழ் பெற்ற ஆண்டு",

        /* PREVIEW PAGE */

        "preview.pageTitle":
            "விண்ணப்ப முன்னோட்டம் - வேத ரக்ஷண நிதி அறக்கட்டளை",

        "preview.trustTitle":
            "வேத ரக்ஷண நிதி அறக்கட்டளை",

        "preview.reviewTitle":
            "உங்கள் விண்ணப்பத்தை சரிபார்க்கவும்",

        "preview.reviewText":
            "உங்கள் விண்ணப்பத்தை சமர்ப்பிப்பதற்கு முன் கீழே உள்ள விவரங்களைச் சரிபார்க்கவும்.",

        "preview.editButton":
            "விண்ணப்பத்தைத் திருத்தவும்",

        "preview.submitButton":
            "விண்ணப்பத்தை சமர்ப்பிக்கவும்",

        "preview.personalSection":
            "தனிப்பட்ட விவரங்கள்",

        "preview.vedicSection":
            "வேத விவரங்கள்",

        "preview.noDetails":
            "விவரங்கள் எதுவும் வழங்கப்படவில்லை.",

        "preview.noData":
            "விண்ணப்பத் தகவல்கள் எதுவும் கிடைக்கவில்லை. தயவுசெய்து முந்தைய பக்கத்திற்குச் சென்று விண்ணப்பப் படிவத்தை பூர்த்தி செய்யவும்.",

        "preview.noSubmitData":
            "சமர்ப்பிக்க விண்ணப்பத் தகவல்கள் எதுவும் இல்லை.",

        "preview.field.first_name": "முதல் பெயர்",
        "preview.field.last_name": "கடைசி பெயர்",
        "preview.field.mobile": "கைபேசி எண்",
        "preview.field.email": "மின்னஞ்சல் முகவரி",
        "preview.field.password": "கடவுச்சொல்",
        "preview.field.street1": "தெரு முகவரி வரி 1",
        "preview.field.street2": "தெரு முகவரி வரி 2",
        "preview.field.city": "நகரம்",
        "preview.field.state": "மாநிலம்",
        "preview.field.postalCode": "அஞ்சல் குறியீடு",
        "preview.field.aadhaar": "ஆதார் எண்",
        "preview.field.dateOfBirth": "பிறந்த தேதி",
        "preview.field.vedham": "வேதம்",
        "preview.field.shaka": "சாகை",
        "preview.field.gothram": "கோத்திரம்",
        "preview.field.soothram": "சூத்திரம்",
        "preview.field.patasalai": "பாடசாலை",
        "preview.field.adhyapakarName":
            "வேத அத்யாபகரின் பெயர்",
        "preview.field.certifiedIn":
            "சான்றிதழ் பெற்ற பிரிவு",
        "preview.field.yearOfCertification":
            "சான்றிதழ் பெற்ற ஆண்டு",

        "login.fillAllFields": "எல்லா துறைகளையும் நிரப்பவும்",
        "login.validEmailOrUsername": "சரியான மின்னஞ்சல் முகவரி அல்லது பயனர் பெயரை உள்ளிடவும்",
        "login.inProgress": "உள்நுழைகிறது...",
        "login.successRedirect": "உள்நுழைவு வெற்றிகரமாக! திருப்பி அனுப்பப்படுகிறது...",
        "login.failed": "உள்நுழைவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.",
        "login.error": "ஒரு பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
        "forgot.enterEmail": "உங்கள் மின்னஞ்சல் முகவரியை உள்ளிடவும்",
        "forgot.validEmail": "சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்",
        "forgot.sending": "அனுப்புகிறது...",
        "forgot.failed": "உங்கள் கோரிக்கையை செயலாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
        "forgot.errorLater": "ஒரு பிழை ஏற்பட்டது. பின்னர் மீண்டும் முயற்சிக்கவும்.",
        "forgot.resetSentRedirect": "கடவுச்சொல் மீட்டமைப்பு இணைப்பு அனுப்பப்பட்டது! உள்நுழைவு பக்கத்திற்கு திருப்பி அனுப்பப்படுகிறது...",
        "forgot.successTitle": "மின்னஞ்சல் வெற்றிகரமாக அனுப்பப்பட்டது!",
        "forgot.successMessage": "நாங்கள் கடவுச்சொல் மீட்டமைப்பு இணைப்பை அனுப்பியுள்ளோம்",
        "forgot.successInstruction": "உங்கள் மின்னஞ்சலைச் சரிபார்த்து, கடவுச்சொல்லை மீட்டமைக்க இணைப்பைப் பின்பற்றவும். மின்னஞ்சல் வரவில்லை என்றால், உங்கள் ஸ்பேம் கோப்புறையையும் சரிபார்க்கவும்.",
        "index.alreadyRegistered": "நீங்கள் ஏற்கனவே பதிவு செய்துவிட்டீர்கள். உங்கள் டாஷ்போர்டிற்கு செல்லவும்.",
        "index.alreadyLoggedIn": "நீங்கள் ஏற்கனவே உள்நுழைந்துவிட்டீர்கள்.",
        "index.loginFirst": "முதலில் உள்நுழையவும்.",
        "dashboard.sessionExpired": "அமர்வு காலாவதியானது. உள்நுழைவு பக்கத்திற்கு திருப்பி அனுப்பப்படுகிறது...",
        "dashboard.logoutSuccess": "வெற்றிகரமாக வெளியேறிவிட்டீர்கள். திருப்பி அனுப்பப்படுகிறது...",
        "dashboard.user.defaultName": "பயனர்",
        "dashboard.user.noEmail": "மின்னஞ்சல் கிடைக்கவில்லை",
        "dashboard.user.member": "உறுப்பினர்",
        "dashboard.admin.cardTotalUsers": "மொத்த பயனர்கள்",
        "dashboard.admin.cardReady": "தயாராக உள்ளது",
        "dashboard.admin.cardSearch": "தேடல் & நிர்வாகம்",
        "dashboard.admin.cardExport": "தரவு ஏற்றுமதி",
        "dashboard.admin.cardAvailable": "கிடைக்கிறது",
        "dashboard.admin.cardSearchSubtitle": "பயனர் தேடல் மற்றும் நிர்வாகத்தை அணுகவும்",
        "dashboard.admin.cardExportSubtitle": "பயனர் தரவை Excel/CSV ஆக ஏற்றுமதி செய்யவும்",
        "search.accessDenied": "அணுகல் மறுக்கப்பட்டது. நிர்வாக அணுகல் தேவை.",
        "search.unknownUser": "அங்கீகரிக்கப்பட்ட பயனரை தீர்மானிக்க முடியவில்லை. மீண்டும் உள்நுழையவும்.",
        "search.loadUsersFailed": "பயனர்களை ஏற்ற முடியவில்லை.",
        "search.noFilteredUsers": "ஏற்றுமதி செய்ய வடிகட்டப்பட்ட பயனர்கள் இல்லை.",
        "search.noUsers": "ஏற்றுமதி செய்ய பயனர்கள் இல்லை.",
        "search.authRequired": "தரவை ஏற்றுமதி செய்ய அங்கீகாரம் தேவை.",
        "search.exportSuccess": "Excel ஏற்றுமதி தொடங்கியது.",
        "search.exportFailed": "Excel ஏற்றுமதி தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.",
        "search.csvExportSuccess": "CSV ஏற்றுமதி தொடங்கியது.",
        "search.viewBtn": "பார்க்க",
        "search.detail.applicantName": "விண்ணப்பதாரியின் பெயர்",
        "search.detail.username": "பயனர் பெயர்",
        "search.detail.email": "மின்னஞ்சல்",
        "search.detail.mobile": "கைபேசி",
        "search.detail.role": "பங்கு",
        "search.detail.state": "மாநிலம்",
        "search.detail.city": "மாவட்டம் / நகரம்",
        "search.detail.aadhaar": "ஆதார்",
        "search.detail.dob": "பிறந்த தேதி",
        "search.detail.street1": "தெரு முகவரி 1",
        "search.detail.street2": "தெரு முகவரி 2",
        "search.detail.postalCode": "அஞ்சல் குறியீடு",
        "search.detail.vedham": "வேதம்",
        "search.detail.shaka": "சாகை",
        "search.detail.gothram": "கோத்திரம்",
        "search.detail.soothram": "சூத்திரம்",
        "search.detail.patasalai": "பாடசாலை",
        "search.detail.adhyapakar": "வேத அத்யாபகர்",
        "search.detail.certifiedIn": "சான்றிதழ் பெற்ற பிரிவு",
        "search.detail.yearOfCertification": "சான்றிதழ் பெற்ற ஆண்டு",
        "search.detail.certificate": "சான்றிதழ்",
        "search.detail.photo": "புகைப்படம்",
        "search.detail.notUploaded": "பதிவேற்றப்படவில்லை",
        "form.dataSaved": "விண்ணப்பத் தரவு உள்ளூரில் சேமிக்கப்பட்டது",
        "form.duplicateEmail": "மறுபடியும் ஒரே மின்னஞ்சல் கண்டறியப்பட்டது. புதிய மின்னஞ்சலுடன் மீண்டும் முயற்சிக்கப்படுகிறது.",
        "footer.copyright":
            "© 2025 வேத ரக்ஷண நிதி அறக்கட்டளை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை."
    },


    /* ========================================================
       TELUGU
    ======================================================== */

    te: {
        form_title: "దరఖాస్తు ఫారం",

        step_personal: "వ్యక్తిగత వివరాలు",
        step_preview: "ముందస్తు వీక్షణ",
        step_submit: "సమర్పణ",

        section_personal: "వ్యక్తిగత వివరాలు",
        section_vedic: "వేద వివరాలు",
        section_upload: "పత్రాల అప్‌లోడ్",

        lbl_name_aadhaar: "ఆధార్‌లో ఉన్న పేరు",
        lbl_first_name: "మొదటి పేరు",
        lbl_last_name: "చివరి పేరు",
        lbl_mobile: "మొబైల్ నంబర్",
        lbl_email: "ఇమెయిల్ ఐడి",
        lbl_password: "పాస్‌వర్డ్",
        lbl_address: "చిరునామా",
        lbl_city: "నగరం",
        lbl_state: "రాష్ట్రం",
        lbl_aadhaar: "ఆధార్ నంబర్",
        lbl_dob: "పుట్టిన తేదీ",
        lbl_vedham: "వేదం",
        lbl_shaka: "శాఖ",
        lbl_gothram: "గోత్రం",
        lbl_soothram: "సూత్రం",
        lbl_patasalai: "పాఠశాల",
        lbl_adhyapakar: "వేద అధ్యాపకుని పేరు",
        lbl_certified_in: "ధృవీకరణ పొందిన విభాగం",
        lbl_year_cert: "ధృవీకరణ సంవత్సరం",
        lbl_cert_upload: "సర్టిఫికేట్ అప్‌లోడ్",
        lbl_photo_upload:
            "పాస్‌పోర్ట్ సైజు ఫోటో అప్‌లోడ్",

        hint_first_name:
            "మీ మొదటి పేరును నమోదు చేయండి",
        hint_last_name:
            "మీ చివరి పేరును నమోదు చేయండి",
        hint_mobile: "98765 43210",
        hint_email: "example@example.com",
        hint_password: "కనీసం 6 అక్షరాలు",
        hint_street1: "వీధి చిరునామా లైన్ 1",
        hint_street2:
            "వీధి చిరునామా లైన్ 2 (ఐచ్ఛికం)",
        hint_city: "నగరం / పట్టణం",
        hint_state:
            "రాష్ట్రం / కేంద్ర పాలిత ప్రాంతం",
        hint_postal: "పిన్ కోడ్ (6 అంకెలు)",
        hint_year: "ఉదా: 2020",

        upload_title: "ఫైల్‌ను అప్‌లోడ్ చేయండి",

        btn_preview:
            "దరఖాస్తును ముందుగా చూడండి",
        btn_submit: "దరఖాస్తును సమర్పించండి",
        btn_back: "వెనుకకు",
        btn_next: "తదుపరి",
        btn_cancel: "రద్దు చేయండి",
        btn_reset: "రీసెట్ చేయండి",

        "site.title":
            "VRNT - వేద రక్షణ నిధి ట్రస్ట్",

        "menu.title": "మెను",

        "nav.login": "లాగిన్",
        "nav.register": "నమోదు",
        "nav.about": "మా గురించి",
        "nav.contact": "సంప్రదించండి",

        "button.login": "లాగిన్",
        "button.register": "నమోదు",

        "hero.greeting": "శ్రీ గురుభ్యో నమః",
        "hero.tagline":
            "భవిష్యత్ తరాల కోసం వేదాలను సంరక్షించడం మరియు ప్రోత్సహించడం",
        "hero.address":
            "64/31, సుబ్రమణ్యం వీధి, వెస్ట్ మాంబలం, చెన్నై - 600 033",
        "hero.sponsor":
            "పూజ్య శ్రీ మహా స్వామిగళ్ (పరమాచార్యులు) వారి ఆశీస్సులతో",

        "login.title": "మీ ఖాతాలో లాగిన్ అవ్వండి",
        "login.subtitle":
            "మీ ఖాతాను యాక్సెస్ చేయడానికి లాగిన్ అవ్వండి",
        "login.usernameLabel":
            "వినియోగదారు పేరు లేదా ఇమెయిల్",
        "login.usernamePlaceholder":
            "వినియోగదారు పేరు లేదా ఇమెయిల్ నమోదు చేయండి",
        "login.usernameHelp":
            "నమోదైన వినియోగదారు పేరు లేదా ఇమెయిల్ చిరునామాను నమోదు చేయండి",
        "login.passwordLabel": "పాస్‌వర్డ్",
        "login.passwordPlaceholder":
            "మీ పాస్‌వర్డ్ నమోదు చేయండి",
        "login.passwordHelp":
            "పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి",
        "login.rememberMe": "నన్ను గుర్తుంచుకో",
        "login.signInBtn": "సైన్ ఇన్",
        "login.forgotPwd":
            "పాస్‌వర్డ్ మర్చిపోయారా?",
        "login.noAccount": "ఖాతా లేదా?",
        "login.createAccount": "ఖాతాను సృష్టించండి",
        "login.agreePrefix":
            "సైన్ ఇన్ చేయడం ద్వారా, మీరు మా",
        "login.terms": "సేవా నిబంధనలు",
        "login.and": "మరియు",
        "login.privacy": "గోప్యతా విధానం",

        "forgot.title": "పాస్‌వర్డ్‌ను పునరుద్ధరించండి",
        "forgot.subtitle": "మీ ఖాతాకు తిరిగి ప్రవేశించడంలో మేము మీకు సహాయం చేస్తాము",
        "forgot.instruction": "మీ ఇమెయిల్ చిరునామాను నమోదు చేయండి. మేము మీకు పాస్‌వర్డ్ రీసెట్ లింక్‌ను పంపుతాము.",
        "forgot.emailLabel": "ఇమెయిల్ చిరునామా",
        "forgot.emailPlaceholder": "నమోదించిన మీ ఇమెయిల్ చిరునామాను నమోదు చేయండి",
        "forgot.emailHelp": "రిసెట్ లింక్ ఈ ఇమెయిల్‌కు పంపబడుతుంది",
        "forgot.sendBtn": "రిసెట్ లింక్ పంపండి",
        "forgot.backBtn": "లాగిన్‌కు తిరిగి",
        "forgot.successTitle": "రిసెట్ లింక్ పంపబడింది!",
        "forgot.successMsg1": "పాస్‌వర్డ్ రీసెట్ లింక్‌ను మేము మీ ఇమెయిల్‌కు పంపాము.",
        "forgot.successMsg2": "దయచేసి మీ ఇన్‌బాక్స్‌ను తనిఖీ చేసి సూచనలను అనుసరించండి.",
        "forgot.resendPrefix": "ఇమెయిల్ అందకపోతే, స్పామ్ ఫోల్డర్‌ను తనిఖీ చేయండి లేదా",
        "forgot.resendLink": "ఇక్కడ క్లిక్ చేసి మళ్లీ పంపండి",
        "forgot.rememberPwd": "మీకు పాస్‌వర్డ్ గుర్తుందా?",
        "forgot.loginLink": "మీ ఖాతాలో లాగిన్ చేయండి",
        "forgot.footerNote": "భద్రత కారణాల వల్ల, పాస్‌వర్డ్ రీసెట్ లింక్ 30 నిమిషాల్లో గడువు ముగుస్తుంది.",

        "search.pageTitle": "వెతుకుడు అప్లికేషన్",
        "search.pageSubtitle": "నమోదు చేసిన వినియోగదారులను సులభంగా సమీక్షించండి మరియు నిర్వహించండి",
        "search.filtersHeading": "శోధన ఫిల్టర్లు",
        "search.roleLabel": "పాత్ర",
        "search.roleDefault": "ఒక పాత్రను ఎంచుకోండి",
        "search.roleNormal": "సాధారణ",
        "search.roleAdmin": "అడ్మిన్",
        "search.usernameLabel": "వినియోగదారు పేరు",
        "search.usernamePlaceholder": "శోధన కోసం వినియోగదారు పేరును నమోదు చేయండి",
        "search.usernameHelp": "అన్ని వినియోగదారులను శోధించడానికి ఖాళీగా விடండి",
        "search.searchBtn": "అప్లికేషన్‌లను శోధించండి",
        "search.resultsHeading": "శోధన ఫలితాలు",
        "search.thName": "పేరు",
        "search.thUsername": "వినియోగదారు పేరు",
        "search.thEmail": "ఇమెయిల్",
        "search.thRole": "పాత్ర",
        "search.thDepartment": "విభాగం",
        "search.thGender": "లింగం",
        "search.thActions": "చర్యలు",
        "search.emptyTitle": "శోధన ఫలితాలు లేవు",
        "search.emptyMsg": "అప్లికేషన్‌లను కనుగొనడానికి పైన వివరాలను నమోదు చేయండి.",
        "search.viewAllBtn": "అన్ని వినియోగదారులను వీక్షించండి",
        "search.clearBtn": "ఫిల్టర్లను క్లియర్ చేయండి",
        "search.refreshBtn": "రిఫ్రేష్",
        "search.exportAllBtn": "అన్ని వినియోగదారులను ఎగుమతి చేయండి",
        "search.exportNormalsBtn": "సాధారణ వినియోగదారులను ఎగుమతి చేయండి",
        "search.exportAdminsBtn": "అడ్మిన్ వినియోగదారులను ఎగుమతి చేయండి",
        "search.logoutBtn": "లాగ్ అవుట్",
        "search.adminUser": "అడ్మిన్ యూజర్",
        "search.modal.title": "లాగ్ అవుట్‌ను నిర్ధారించండి",
        "search.modal.question": "మీరు నిజంగా లాగ్ అవుట్ కావాలనుకుంటున్నారా?",
        "search.modal.warning": "మీరు లాగిన్ పేజీకి తిరిగి వెళ్లబడతారు. నిల్వ చేయని మార్పులు కోల్పోతాయి.",
        "search.modal.currentUser": "ప్రస్తుత వినియోగదారు",
        "search.modal.sessionActive": "సెషన్ క్రియాశీలంగా ఉంటుంది:",
        "search.modal.cancel": "రద్దు చేయండి",
        "search.modal.confirm": "అవును, లాగ్ అవుట్",

        "common.cancel": "రద్దు చేయండి",
        "common.logout": "లాగ్ అవుట్",
        "common.home": "హోమ్‌కు వెళ్లండి",

        "dashboard.title": "డాష్‌బోర్డ్",
        "dashboard.user.welcome": "స్వాగతం",
        "dashboard.user.subtitle": "మీlič్ వివరాలను వీక్షించండి మరియు నిర్వహించండి",
        "dashboard.user.meta": "చివరిగా నవీకరించబడింది: ఇప్పుడు",
        "dashboard.user.details": "నా వ్యక్తిగత సమాచారం",
        "dashboard.logout.title": "లాగ్ అవుట్‌ను నిర్ధారించండి",
        "dashboard.logout.confirm": "మీరు నిజంగా లాగ్ అవుట్ చేయాలనుకుంటున్నారా?",
        "dashboard.admin.title": "అడ్మిన్ డాష్‌బోర్డ్",
        "dashboard.admin.welcome": "అడ్మిన్ డాష్‌బోర్డ్",
        "dashboard.admin.subtitle": "నమోదైన అన్ని వినియోగదారులను నిర్వహించండి మరియు వీక్షించండి",
        "dashboard.admin.meta": "మీకు పూర్తి నిర్వాహక ప్రాప్యత ఉంది",
        "dashboard.admin.totalUsers": "మొత్తం వినియోగదారులు",
        "dashboard.admin.registeredUsers": "సిస్టమ్‌లో నమోదు చేసిన వినియోగదారులు",
        "dashboard.admin.search": "శోధన & నిర్వహణ",
        "dashboard.admin.searchAccess": "వినియోగదారు శోధన మరియు నిర్వహణను యాక్సెస్ చేయండి",
        "dashboard.admin.export": "డేటా ఎగుమతి",
        "dashboard.admin.exportAccess": "వినియోగదారు డేటాను Excel/CSV‌కి ఎగుమతి చేయండి",
        "dashboard.admin.adminInfo": "నిర్వాహక సమాచారం",
        "dashboard.admin.adminRole": "నిర్వాహకుడు",
        "dashboard.admin.goToSearch": "శోధన పేజీకి వెళ్లండి",
        "dashboard.admin.capabilities": "మీ సామర్థ్యాలు",
        "dashboard.admin.cap1": "నమోదైన అన్ని వినియోగదారులను శోధించండి మరియు వడపోత చేయండి",
        "dashboard.admin.cap2": "వివరమైన వినియోగదారు సమాచారం మరియు ప్రొఫైల్స్‌ను వీక్షించండి",
        "dashboard.admin.cap3": "వినియోగదారు డేటాను Excel మరియు CSV రూపాల్లో ఎగుమతి చేయండి",
        "dashboard.admin.cap4": "నిర్దిష్ట వినియోగదారు రికార్డులను ఎంచుకుని డౌన్‌లోడ్ చేయండి",
        "dashboard.admin.cap5": "వ్యవస్థ నిర్వహణ లక్షణాలకు పూర్తి ప్రాప్యత",

        "form.firstName": "మొదటి పేరు",
        "form.lastName": "చివరి పేరు",
        "form.email": "ఇమెయిల్",
        "form.mobile": "మొబైల్",
        "form.aadhaar": "ఆధార్",
        "form.dob": "పుట్టిన తేదీ",
        "form.city": "నగరం",
        "form.state": "రాష్ట్రం",
        "form.vedham": "వేదం",
        "form.gothram": "గోత్రం",
        "form.certified": "ధృవీకరణ",
        "form.yearCert": "ధృవీకరణ సంవత్సరం",

        /* PREVIEW PAGE */

        "preview.pageTitle":
            "దరఖాస్తు ముందస్తు వీక్షణ - వేద రక్షణ నిధి ట్రస్ట్",

        "preview.trustTitle":
            "వేద రక్షణ నిధి ట్రస్ట్",

        "preview.reviewTitle":
            "మీ దరఖాస్తును సమీక్షించండి",

        "preview.reviewText":
            "మీ దరఖాస్తును సమర్పించే ముందు క్రింది వివరాలను ధృవీకరించండి.",

        "preview.editButton":
            "దరఖాస్తును సవరించండి",

        "preview.submitButton":
            "దరఖాస్తును సమర్పించండి",

        "preview.personalSection":
            "వ్యక్తిగత వివరాలు",

        "preview.vedicSection":
            "వేద వివరాలు",

        "preview.noDetails":
            "వివరాలు అందించబడలేదు.",

        "preview.noData":
            "దరఖాస్తు సమాచారం కనుగొనబడలేదు. దయచేసి వెనుకకు వెళ్లి ఫారమ్‌ను పూర్తి చేయండి.",

        "preview.noSubmitData":
            "సమర్పించడానికి దరఖాస్తు సమాచారం లేదు.",

        "preview.field.first_name": "మొదటి పేరు",
        "preview.field.last_name": "చివరి పేరు",
        "preview.field.mobile": "మొబైల్ నంబర్",
        "preview.field.email": "ఇమెయిల్ ఐడి",
        "preview.field.password": "పాస్‌వర్డ్",
        "preview.field.street1":
            "వీధి చిరునామా లైన్ 1",
        "preview.field.street2":
            "వీధి చిరునామా లైన్ 2",
        "preview.field.city": "నగరం",
        "preview.field.state": "రాష్ట్రం",
        "preview.field.postalCode": "పిన్ కోడ్",
        "preview.field.aadhaar": "ఆధార్ నంబర్",
        "preview.field.dateOfBirth": "పుట్టిన తేదీ",
        "preview.field.vedham": "వేదం",
        "preview.field.shaka": "శాఖ",
        "preview.field.gothram": "గోత్రం",
        "preview.field.soothram": "సూత్రం",
        "preview.field.patasalai": "పాఠశాల",
        "preview.field.adhyapakarName":
            "వేద అధ్యాపకుని పేరు",
        "preview.field.certifiedIn":
            "ధృవీకరణ పొందిన విభాగం",
        "preview.field.yearOfCertification":
            "ధృవీకరణ సంవత్సరం",

        "login.fillAllFields": "అన్ని ఖాళీలను పూరించండి",
        "login.validEmailOrUsername": "చెల్లుబాటు అయ్యే ఇమెయిల్ చిరునామా లేదా వినియోగదారు పేరును నమోదు చేయండి",
        "login.inProgress": "లాగిన్ అవుతుంది...",
        "login.successRedirect": "లాగిన్ విజయవంతమైంది! తిరిగి వెళ్లబడుతుంది...",
        "login.failed": "లాగిన్ విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.",
        "login.error": "ఒక లోపం ఏర్పడింది. దయచేసి మళ్లీ ప్రయత్నించండి.",
        "forgot.enterEmail": "మీ ఇమెయిల్ చిరునామాను నమోదు చేయండి",
        "forgot.validEmail": "చెల్లుబాటు అయ్యే ఇమెయిల్ చిరునామాను నమోదు చేయండి",
        "forgot.sending": "అప్లోడ్ అవుతుంది...",
        "forgot.failed": "మీ అభ్యర్థనను ప్రాసెస్ చేయలేకపోయాము. దయచేసి మళ్లీ ప్రయత్నించండి.",
        "forgot.errorLater": "ఒక లోపం ఏర్పడింది. తర్వాత మళ్లీ ప్రయత్నించండి.",
        "forgot.resetSentRedirect": "పాస్‌వర్డ్ రీసెట్ లింక్ పంపబడింది! లాగిన్ పేజీకి తిరిగి వెళ్లబడుతుంది...",
        "forgot.successTitle": "ఇమెయిల్ విజయవంతంగా పంపబడింది!",
        "forgot.successMessage": "మేము పాస్‌వర్డ్ రీసెట్ లింక్ పంపించాము",
        "forgot.successInstruction": "మీ ఇమెయిల్‌ను తనిఖీ చేసి, పాస్‌వర్డ్‌ను రీసెట్ చేయడానికి లింక్‌ను అనుసరించండి. ఇమెయిల్ కనిపిస్తే, దయచేసి స్పామ్ ఫోల్డర్‌ను కూడా తనిఖీ చేయండి.",
        "index.alreadyRegistered": "మీరు ఇప్పటికే నమోదు చేసుకున్నారు. దయచేసి మీ డాష్‌బోర్డుకు వెళ్లండి.",
        "index.alreadyLoggedIn": "మీరు ఇప్పటికే లాగిన్ అయి ఉన్నారు.",
        "index.loginFirst": "దయచేసి మొదట లాగిన్ అవ్వండి.",
        "dashboard.sessionExpired": "సెషన్ గడువు ముగిసింది. లాగిన్ పేజీకి తిరిగి వెళ్లబడుతుంది...",
        "dashboard.logoutSuccess": "విజయవంతంగా లాగ్ అవుట్ అయ్యారు. తిరిగి వెళ్లబడుతుంది...",
        "dashboard.user.defaultName": "వినియోగదారు",
        "dashboard.user.noEmail": "ఇమెయిల్ అందుబాటులో లేదు",
        "dashboard.user.member": "సభ్యుడు",
        "dashboard.admin.cardTotalUsers": "మొత్తం వినియోగదారులు",
        "dashboard.admin.cardReady": "తయారు",
        "dashboard.admin.cardSearch": "శోధన & నిర్వహణ",
        "dashboard.admin.cardExport": "డేటా ఎగుమతి",
        "dashboard.admin.cardAvailable": "అందుబాటులో ఉంది",
        "dashboard.admin.cardSearchSubtitle": "వినియోగదారు శోధన మరియు నిర్వహణను యాక్సెస్ చేయండి",
        "dashboard.admin.cardExportSubtitle": "వినియోగదారు డేటాను Excel/CSV‌కి ఎగుమతి చేయండి",
        "search.accessDenied": "ప్రవేశం నిరాకరించబడింది. అడ్మిన్ ప్రాప్యత అవసరం.",
        "search.unknownUser": "ప్రామాణీకరించబడిన వినియోగదారును గుర్తించలేకపోయాము. మళ్లీ లాగిన్ అవ్వండి.",
        "search.loadUsersFailed": "వినియోగదారులను లోడ్ చేయలేకపోయాము.",
        "search.noFilteredUsers": "ఎగుమతి చేయడానికి ఫిల్టర్ చేసిన వినియోగదారులు లేరు.",
        "search.noUsers": "ఎగుమతి చేయడానికి వినియోగదారులు లేరు.",
        "search.authRequired": "డేటాను ఎగుమతి చేయడానికి ప్రామాణీకరణ అవసరం.",
        "search.exportSuccess": "Excel ఎగుమతి ప్రారంభమైంది.",
        "search.exportFailed": "Excel ఎగుమతి విఫలమైంది. మళ్లీ ప్రయత్నించండి.",
        "search.csvExportSuccess": "CSV ఎగుమతి ప్రారంభమైంది.",
        "search.viewBtn": "వీక్షించండి",
        "search.detail.applicantName": "దరఖాస్తుదారుని పేరు",
        "search.detail.username": "వినియోగదారు పేరు",
        "search.detail.email": "ఇమెయిల్",
        "search.detail.mobile": "మొబైల్",
        "search.detail.role": "పాత్ర",
        "search.detail.state": "రాష్ట్రం",
        "search.detail.city": "జిల్లా / నగరం",
        "search.detail.aadhaar": "ఆధార్",
        "search.detail.dob": "పుట్టిన తేదీ",
        "search.detail.street1": "వీధి చిరునామా 1",
        "search.detail.street2": "వీధి చిరునామా 2",
        "search.detail.postalCode": "పిన్ కోడ్",
        "search.detail.vedham": "వేదం",
        "search.detail.shaka": "శాఖ",
        "search.detail.gothram": "గోత్రం",
        "search.detail.soothram": "సూత్రం",
        "search.detail.patasalai": "పాఠశాల",
        "search.detail.adhyapakar": "వేద అధ్యాపకుడు",
        "success.title": "దరఖాస్తు విజయవంతంగా సమర్పించబడింది",
        "success.description": "మీ దరఖాస్తు విజయవంతంగా స్వీకరించబడింది. ఇప్పుడు హోమ్ పేజీకి వెళ్లి లాగిన్ చేయవచ్చు.",
        "success.homeButton": "హోమ్‌కు తిరిగి వెళ్లి లాగిన్ చేయండి",
        "search.detail.certifiedIn": "ధృవీకరణ పొందిన విభాగం",
        "search.detail.yearOfCertification": "ధృవీకరణ సంవత్సరం",
        "search.detail.certificate": "సర్టిఫికేట్",
        "search.detail.photo": "ఫోటో",
        "search.detail.notUploaded": "అప్‌లోడ్ కాలేదు",
        "form.dataSaved": "ఫారమ్ డేటా స్థానికంగా సేవ్ చేయబడింది",
        "form.duplicateEmail": "నకిలీ ఇమెయిల్ గుర్తించబడింది. తాజా ఇమెయిల్‌తో మళ్లీ ప్రయత్నించండి.",
        "footer.copyright":
            "© 2025 వేద రక్షణ నిధి ట్రസ്റ്റ്. అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి."
    },


    /* ========================================================
       HINDI
    ======================================================== */

    hi: {
        form_title: "आवेदन पत्र",

        step_personal: "व्यक्तिगत विवरण",
        step_preview: "पूर्वावलोकन",
        step_submit: "जमा करें",

        section_personal: "व्यक्तिगत विवरण",
        section_vedic: "वैदिक विवरण",
        section_upload: "दस्तावेज़ अपलोड",

        lbl_name_aadhaar: "आधार के अनुसार नाम",
        lbl_first_name: "पहला नाम",
        lbl_last_name: "अंतिम नाम",
        lbl_mobile: "मोबाइल नंबर",
        lbl_email: "ईमेल आईडी",
        lbl_password: "पासवर्ड",
        lbl_address: "पता",
        lbl_city: "शहर",
        lbl_state: "राज्य",
        lbl_aadhaar: "आधार नंबर",
        lbl_dob: "जन्म तिथि",
        lbl_vedham: "वेद",
        lbl_shaka: "शाखा",
        lbl_gothram: "गोत्र",
        lbl_soothram: "सूत्र",
        lbl_patasalai: "पाठशाला",
        lbl_adhyapakar: "वेद अध्यापक का नाम",
        lbl_certified_in: "प्रमाणित विषय",
        lbl_year_cert: "प्रमाणन वर्ष",
        lbl_cert_upload: "प्रमाणपत्र अपलोड",
        lbl_photo_upload:
            "पासपोर्ट आकार फोटो अपलोड",

        hint_first_name:
            "अपना पहला नाम दर्ज करें",
        hint_last_name:
            "अपना अंतिम नाम दर्ज करें",
        hint_mobile: "98765 43210",
        hint_email: "example@example.com",
        hint_password: "न्यूनतम 6 अक्षर",
        hint_street1: "सड़क पता पंक्ति 1",
        hint_street2:
            "सड़क पता पंक्ति 2 (वैकल्पिक)",
        hint_city: "शहर / नगर",
        hint_state:
            "राज्य / केंद्र शासित प्रदेश",
        hint_postal: "पिन कोड (6 अंक)",
        hint_year: "उदा: 2020",

        upload_title: "फ़ाइल अपलोड करें",

        btn_preview:
            "आवेदन का पूर्वावलोकन करें",
        btn_submit: "आवेदन जमा करें",
        btn_back: "वापस",
        btn_next: "अगला",
        btn_cancel: "रद्द करें",
        btn_reset: "रीसेट करें",

        "site.title":
            "VRNT - वेद रक्षण निधि ट्रस्ट",

        "menu.title": "मेनू",

        "nav.login": "लॉगिन",
        "nav.register": "पंजीकरण",
        "nav.about": "हमारे बारे में",
        "nav.contact": "संपर्क",

        "button.login": "लॉगिन",
        "button.register": "पंजीकरण",

        "hero.greeting": "श्री गुरुभ्यो नमः",
        "hero.tagline":
            "भावी पीढ़ियों के लिए वेदों का संरक्षण और संवर्धन",
        "hero.address":
            "64/31, सुब्रमण्यम स्ट्रीट, वेस्ट मम्बलम, चेन्नई - 600 033",
        "hero.sponsor":
            "पूज्य श्री महा स्वामीगल (परमाचार्य) के आशीर्वाद से",

        "login.title":
            "अपने खाते में लॉगिन करें",
        "login.subtitle":
            "अपने खाते तक पहुँचने के लिए साइन इन करें",
        "login.usernameLabel":
            "उपयोगकर्ता नाम या ईमेल",
        "login.usernamePlaceholder":
            "उपयोगकर्ता नाम या ईमेल दर्ज करें",
        "login.usernameHelp":
            "अपना पंजीकृत उपयोगकर्ता नाम या ईमेल पता दर्ज करें",
        "login.passwordLabel": "पासवर्ड",
        "login.passwordPlaceholder":
            "अपना पासवर्ड दर्ज करें",
        "login.passwordHelp":
            "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए",
        "login.rememberMe": "मुझे याद रखें",
        "login.signInBtn": "साइन इन",
        "login.forgotPwd": "पासवर्ड भूल गए?",
        "login.noAccount": "खाता नहीं है?",
        "login.createAccount": "खाता बनाएँ",
        "login.agreePrefix":
            "साइन इन करके, आप हमारी",
        "login.terms": "सेवा की शर्तें",
        "login.and": "और",
        "login.privacy": "गोपनीयता नीति",

        "search.pageTitle": "खोज आवेदन",
        "search.pageSubtitle": "पंजीकृत उपयोगकर्ताओं की समीक्षा करें और आसानी से प्रबंधित करें",
        "search.filtersHeading": "खोज फिल्टर",
        "search.roleLabel": "भूमिका",
        "search.roleDefault": "एक भूमिका चुनें",
        "search.roleNormal": "सामान्य",
        "search.roleAdmin": "प्रशासक",
        "search.usernameLabel": "उपयोगकर्ता नाम",
        "search.usernamePlaceholder": "खोज के लिए उपयोगकर्ता नाम दर्ज करें",
        "search.usernameHelp": "सभी उपयोगकर्ताओं को खोजने के लिए खाली छोड़ दें",
        "search.searchBtn": "आवेदन खोजें",
        "search.resultsHeading": "खोज परिणाम",
        "search.thName": "नाम",
        "search.thUsername": "उपयोगकर्ता नाम",
        "search.thEmail": "ईमेल",
        "search.thRole": "भूमिका",
        "search.thDepartment": "विभाग",
        "search.thGender": "लिंग",
        "search.thActions": "क्रियाएँ",
        "search.emptyTitle": "कोई खोज परिणाम नहीं",
        "search.emptyMsg": "आवेदन खोजने के लिए ऊपर मानदंड दर्ज करें।",
        "search.viewAllBtn": "सभी उपयोगकर्ताओं को देखें",
        "search.clearBtn": "फ़िल्टर साफ़ करें",
        "search.refreshBtn": "ताज़ा करें",
        "search.exportAllBtn": "सभी उपयोगकर्ता निर्यात करें",
        "search.exportNormalsBtn": "सामान्य उपयोगकर्ता निर्यात करें",
        "search.exportAdminsBtn": "प्रशासक उपयोगकर्ता निर्यात करें",
        "search.logoutBtn": "लॉग आउट",
        "search.adminUser": "प्रशासक उपयोगकर्ता",
        "search.modal.title": "लॉग आउट की पुष्टि करें",
        "search.modal.question": "क्या आप वाकई लॉग आउट करना चाहते हैं?",
        "search.modal.warning": "आपको लॉगिन पेज पर पुनः निर्देशित किया जाएगा। कोई भी असहेजित परिवर्तन खो जाएगा।",
        "search.modal.currentUser": "वर्तमान उपयोगकर्ता",
        "search.modal.sessionActive": "सत्र सक्रिय है:",
        "search.modal.cancel": "रद्द करें",
        "search.modal.confirm": "हाँ, लॉग आउट",

        "common.cancel": "रद्द करें",
        "common.logout": "लॉग आउट",
        "common.home": "होम पर जाएँ",

        "dashboard.title": "डैशबोर्ड",
        "dashboard.user.welcome": "स्वागत है",
        "dashboard.user.subtitle": "अपनी प्रोफ़ाइल जानकारी देखें और प्रबंधित करें",
        "dashboard.user.meta": "अंतिम अपडेट: अभी",
        "dashboard.user.details": "मेरी प्रोफ़ाइल जानकारी",
        "dashboard.logout.title": "लॉग आउट की पुष्टि करें",
        "dashboard.logout.confirm": "क्या आप वाकई लॉग आउट करना चाहते हैं?",
        "dashboard.admin.title": "व्यवस्थापक डैशबोर्ड",
        "dashboard.admin.welcome": "व्यवस्थापक डैशबोर्ड",
        "dashboard.admin.subtitle": "सभी पंजीकृत उपयोगकर्ताओं को प्रबंधित करें और देखें",
        "dashboard.admin.meta": "आपके पास पूर्ण प्रशासनिक पहुँच है",
        "dashboard.admin.totalUsers": "कुल उपयोगकर्ता",
        "dashboard.admin.registeredUsers": "सिस्टम में पंजीकृत उपयोगकर्ता",
        "dashboard.admin.search": "खोज और प्रबंधन",
        "dashboard.admin.searchAccess": "उपयोगकर्ता खोज और प्रबंधन तक पहुँचें",
        "dashboard.admin.export": "डेटा निर्यात",
        "dashboard.admin.exportAccess": "उपयोगकर्ता डेटा को Excel/CSV में निर्यात करें",
        "dashboard.admin.adminInfo": "प्रशासक जानकारी",
        "dashboard.admin.adminRole": "प्रशासक",
        "dashboard.admin.goToSearch": "खोज पृष्ठ पर जाएँ",
        "dashboard.admin.capabilities": "आपकी क्षमताएँ",
        "dashboard.admin.cap1": "सभी पंजीकृत उपयोगकर्ताओं को खोजें और फ़िल्टर करें",
        "dashboard.admin.cap2": "विस्तृत उपयोगकर्ता जानकारी और प्रोफ़ाइल देखें",
        "dashboard.admin.cap3": "उपयोगकर्ता डेटा को Excel और CSV स्वरूपों में निर्यात करें",
        "dashboard.admin.cap4": "विशिष्ट उपयोगकर्ता रिकॉर्ड चुनें और डाउनलोड करें",
        "dashboard.admin.cap5": "सिस्टम प्रशासन सुविधाओं तक पूरी पहुँच",

        "form.firstName": "पहला नाम",
        "form.lastName": "अंतिम नाम",
        "form.email": "ईमेल",
        "form.mobile": "मोबाइल",
        "form.aadhaar": "आधार",
        "form.dob": "जन्म तिथि",
        "form.city": "शहर",
        "form.state": "राज्य",
        "form.vedham": "वेद",
        "form.gothram": "गोत्र",
        "form.certified": "प्रमाणित विषय",
        "form.yearCert": "प्रमाणन वर्ष",

        /* PREVIEW PAGE */

        "preview.pageTitle":
            "आवेदन पूर्वावलोकन - वेद रक्षण निधि ट्रस्ट",

        "preview.trustTitle":
            "वेद रक्षण निधि ट्रस्ट",

        "preview.reviewTitle":
            "अपने आवेदन की समीक्षा करें",

        "preview.reviewText":
            "अपना आवेदन जमा करने से पहले कृपया नीचे दिए गए विवरणों की जाँच करें।",

        "preview.editButton":
            "आवेदन संपादित करें",

        "preview.submitButton":
            "आवेदन जमा करें",

        "preview.personalSection":
            "व्यक्तिगत विवरण",

        "preview.vedicSection":
            "वैदिक विवरण",

        "preview.noDetails":
            "कोई विवरण प्रदान नहीं किया गया।",

        "preview.noData":
            "कोई आवेदन जानकारी नहीं मिली। कृपया वापस जाएँ और आवेदन पत्र पूरा करें।",

        "preview.noSubmitData":
            "जमा करने के लिए कोई आवेदन जानकारी नहीं मिली।",

        "preview.field.first_name": "पहला नाम",
        "preview.field.last_name": "अंतिम नाम",
        "preview.field.mobile": "मोबाइल नंबर",
        "preview.field.email": "ईमेल आईडी",
        "preview.field.password": "पासवर्ड",
        "preview.field.street1": "सड़क पता पंक्ति 1",
        "preview.field.street2": "सड़क पता पंक्ति 2",
        "preview.field.city": "शहर",
        "preview.field.state": "राज्य",
        "preview.field.postalCode": "पिन कोड",
        "preview.field.aadhaar": "आधार नंबर",
        "preview.field.dateOfBirth": "जन्म तिथि",
        "preview.field.vedham": "वेद",
        "preview.field.shaka": "शाखा",
        "preview.field.gothram": "गोत्र",
        "preview.field.soothram": "सूत्र",
        "preview.field.patasalai": "पाठशाला",
        "preview.field.adhyapakarName":
            "वेद अध्यापक का नाम",
        "preview.field.certifiedIn":
            "प्रमाणित विषय",
        "preview.field.yearOfCertification":
            "प्रमाणन वर्ष",

        "login.fillAllFields": "सभी क्षेत्रों को भरें",
        "login.validEmailOrUsername": "कृपया एक valid ईमेल पता या उपयोगकर्ता नाम दर्ज करें",
        "login.inProgress": "लॉगिन हो रहा है...",
        "login.successRedirect": "लॉगिन सफल! पुनर्निर्देशित हो रहा है...",
        "login.failed": "लॉगिन विफल। कृपया फिर से प्रयास करें।",
        "login.error": "एक त्रुटि हुई। कृपया फिर से प्रयास करें।",
        "forgot.enterEmail": "कृपया अपना ईमेल पता दर्ज करें",
        "forgot.validEmail": "कृपया एक वैध ईमेल पता दर्ज करें",
        "forgot.sending": "भेजा जा रहा है...",
        "forgot.failed": "आपका अनुरोध संसाधित नहीं किया जा सका। कृपया फिर से प्रयास करें।",
        "forgot.errorLater": "एक त्रुटि हुई। बाद में फिर से प्रयास करें।",
        "forgot.resetSentRedirect": "पासवर्ड रीसेट लिंक भेजा गया! लॉगिन पृष्ठ पर पुनर्निर्देशित हो रहा है...",
        "forgot.successTitle": "ईमेल सफलतापूर्वक भेजा गया!",
        "forgot.successMessage": "हमने पासवर्ड रीसेट लिंक भेज दिया है",
        "forgot.successInstruction": "कृपया अपना ईमेल देखें और पासवर्ड रीसेट करने के लिए लिंक का पालन करें। यदि ईमेल नहीं मिलता है, तो कृपया स्पैम फ़ोल्डर भी देखें।",
        "index.alreadyRegistered": "आप पहले से ही पंजीकृत हैं। कृपया अपने डैशबोर्ड पर जाएँ।",
        "index.alreadyLoggedIn": "आप पहले से ही लॉग इन हैं।",
        "index.loginFirst": "कृपया पहले लॉग इन करें।",
        "dashboard.sessionExpired": "सत्र समाप्त हो गया। लॉगिन पृष्ठ पर पुनर्निर्देशित हो रहा है...",
        "dashboard.logoutSuccess": "सफलतापूर्वक लॉग आउट हो गए। पुनर्निर्देशित हो रहा है...",
        "dashboard.user.defaultName": "उपयोगकर्ता",
        "dashboard.user.noEmail": "कोई ईमेल उपलब्ध नहीं",
        "dashboard.user.member": "सदस्य",
        "dashboard.admin.cardTotalUsers": "कुल उपयोगकर्ता",
        "dashboard.admin.cardReady": "तैयार",
        "dashboard.admin.cardSearch": "खोज और प्रबंधन",
        "dashboard.admin.cardExport": "डेटा निर्यात",
        "dashboard.admin.cardAvailable": "उपलब्ध",
        "dashboard.admin.cardSearchSubtitle": "उपयोगकर्ता खोज और प्रबंधन तक पहुँचें",
        "dashboard.admin.cardExportSubtitle": "उपयोगकर्ता डेटा को Excel/CSV में निर्यात करें",
        "search.accessDenied": "पहुँच अस्वीकृत। व्यवस्थापक पहुँच आवश्यक है।",
        "search.unknownUser": "प्रमाणित उपयोगकर्ता निर्धारित नहीं किया जा सका। कृपया फिर से लॉगिन करें।",
        "search.loadUsersFailed": "उपयोगकर्ताओं को लोड नहीं किया जा सका।",
        "search.noFilteredUsers": "निर्यात करने के लिए कोई फ़िल्टर किया गया उपयोगकर्ता नहीं है।",
        "search.noUsers": "निर्यात करने के लिए कोई उपयोगकर्ता नहीं है।",
        "search.authRequired": "डेटा निर्यात करने के लिए प्रमाणीकरण आवश्यक है।",
        "search.exportSuccess": "Excel निर्यात शुरू हो गया।",
        "search.exportFailed": "Excel निर्यात विफल रहा। कृपया फिर से प्रयास करें।",
        "search.csvExportSuccess": "CSV निर्यात शुरू हो गया।",
        "search.viewBtn": "देखें",
        "search.detail.applicantName": "आवेदक का नाम",
        "search.detail.username": "उपयोगकर्ता नाम",
        "search.detail.email": "ईमेल",
        "search.detail.mobile": "मोबाइल",
        "search.detail.role": "भूमिका",
        "search.detail.state": "राज्य",
        "search.detail.city": "जिला / शहर",
        "search.detail.aadhaar": "आधार",
        "search.detail.dob": "जन्म तिथि",
        "search.detail.street1": "सड़क पता 1",
        "search.detail.street2": "सड़क पता 2",
        "search.detail.postalCode": "पिन कोड",
        "search.detail.vedham": "वेद",
        "search.detail.shaka": "शाखा",
        "search.detail.gothram": "गोत्र",
        "search.detail.soothram": "सूत्र",
        "search.detail.patasalai": "पाठशाला",
        "search.detail.adhyapakar": "वेद अध्यापक",
        "success.title": "आवेदन सफलतापूर्वक जमा किया गया है",
        "success.description": "आपका आवेदन सफलतापूर्वक प्राप्त कर लिया गया है। अब आप होम पेज पर वापस जाकर लॉगिन कर सकते हैं।",
        "success.homeButton": "होम पर लौटें और लॉगिन करें",
        "search.detail.certifiedIn": "प्रमाणित विषय",
        "search.detail.yearOfCertification": "प्रमाणन वर्ष",
        "search.detail.certificate": "प्रमाणपत्र",
        "search.detail.photo": "फोटो",
        "search.detail.notUploaded": "अपलोड नहीं किया गया",
        "form.dataSaved": "फॉर्म डेटा स्थानीय रूप से सहेजा गया",
        "form.duplicateEmail": "एक_duplicate ईमेल पाया गया। नए ईमेल के साथ पुनः प्रयास किया जा रहा है।",
        "footer.copyright":
            "© 2025 वेद रक्षण निधि ट्रस्ट। सर्वाधिकार सुरक्षित।"
    },

    /* ========================================================
       SANSKRIT
    ======================================================== */

    sa: {
        "login.fillAllFields": "सर्वाणि क्षेत्राणि पूरयन्तु",
        "login.validEmailOrUsername": "कृपया वैधं ईमेल-पत्तां वा उपयोक्तृनामं लिखतु",
        "login.inProgress": "प्रवेशः क्रियते...",
        "login.successRedirect": "प्रवेशः सफलः! पुनर्निर्दिश्यते...",
        "login.failed": "प्रवेशः असफलः। कृपया पुनः प्रयासं कुरुत।",
        "login.error": "त्रुटिः अभवत्। कृपया पुनः प्रयासं कुरुत।",
        "forgot.enterEmail": "कृपया ईमेल-पत्त्रं लिखतु",
        "forgot.validEmail": "कृपया वैधं ईमेल-पत्त्रं लिखतु",
        "forgot.sending": "प्रेष्यते...",
        "forgot.failed": "अभ्यर्थना न संसाध्यत। कृपया पुनः प्रयासं कुरुत।",
        "forgot.errorLater": "त्रुटिः अभवत्। पश्चात् पुनः प्रयासं कुरुत।",
        "forgot.resetSentRedirect": "सङ्केतपुनर्स्थापनं प्रेषितम्! प्रवेशपृष्ठं प्रति पुनर्निर्दिश्यते...",
        "forgot.successTitle": "ईमेलः सफलतया प्रेषितः!",
        "forgot.successMessage": "वयं सङ्केतपुनर्स्थापनं प्रेषितवन्तः",
        "forgot.successInstruction": "कृपया ईमेलं पश्यत तथा सङ्केतपुनर्स्थापनार्थं लिङ्कं अनुगच्छत। यदि ईमेलं न लभ्यते, तर्हि स्पैम-फोल्डरं पश्यतु।",
        "index.alreadyRegistered": "भवन् पूर्वमेव पंजीकृतः अस्ति। कृपया स्वं डैशबोर्डं गच्छतु।",
        "index.alreadyLoggedIn": "भवन् पूर्वमेव प्रविष्टः अस्ति।",
        "index.loginFirst": "कृपया प्रथमं प्रवेशं कुरुत।",
        "dashboard.sessionExpired": "सत्रं समाप्तम्। प्रवेशपृष्ठं प्रति पुनर्निर्दिश्यते...",
        "dashboard.logoutSuccess": "सफलतया निर्गतः। पुनर्निर्दिश्यते...",
        "dashboard.user.defaultName": "उपयोक्ता",
        "dashboard.user.noEmail": "ईमेलं न लभ्यते",
        "dashboard.user.member": "सदस्यः",
        "dashboard.admin.cardTotalUsers": "कुलोपयोक्तारः",
        "dashboard.admin.cardReady": "तत्परः",
        "dashboard.admin.cardSearch": "अन्वेषणं तथा प्रबन्धनम्",
        "dashboard.admin.cardExport": "दत्तांश-निर्यातः",
        "dashboard.admin.cardAvailable": "उपलब्धः",
        "dashboard.admin.cardSearchSubtitle": "उपयोक्तृअन्वेषणं तथा प्रबन्धनं पश्यतु",
        "dashboard.admin.cardExportSubtitle": "उपयोक्तृदत्तांशं Excel/CSV इति निर्यातयतु",
        "search.accessDenied": "प्रवेशः न स्वीकृतः। प्रशासनप्रवेशः आवश्यकः।",
        "search.unknownUser": "प्रमाणितः उपयोक्ता न ज्ञातः। कृपया पुनः प्रवेशं कुरुत।",
        "search.loadUsersFailed": "उपयोक्तारः न लब्धाः।",
        "search.noFilteredUsers": "निर्यातीकरणार्थं न कोऽपि छनितः उपयोक्ता अस्ति।",
        "search.noUsers": "निर्यातीकरणार्थं न कोऽपि उपयोक्ता अस्ति।",
        "search.authRequired": "दत्तांशं निर्यातयितुं प्रमाणीकरणं आवश्यकम्।",
        "search.exportSuccess": "Excel-निर्यातः आरब्धः।",
        "search.exportFailed": "Excel-निर्यातः असफलः। कृपया पुनः प्रयासं कुरुत।",
        "search.csvExportSuccess": "CSV-निर्यातः आरब्धः।",
        "search.viewBtn": "द्रष्टुम्",
        "search.detail.applicantName": "आवेदकनाम",
        "search.detail.username": "उपयोक्तृनाम",
        "search.detail.email": "ईमेल",
        "search.detail.mobile": "मोबाइल",
        "search.detail.role": "भूमिका",
        "search.detail.state": "राज्य",
        "search.detail.city": "जिला / नगरम्",
        "search.detail.aadhaar": "आधारः",
        "search.detail.dob": "जन्मतिथि",
        "search.detail.street1": "मार्गपत्ता 1",
        "search.detail.street2": "मार्गपत्ता 2",
        "search.detail.postalCode": "पोष्टकोडः",
        "search.detail.vedham": "वेदः",
        "search.detail.shaka": "शाखा",
        "search.detail.gothram": "गोत्रम्",
        "search.detail.soothram": "सूत्रम्",
        "search.detail.patasalai": "पाठशाला",
        "search.detail.adhyapakar": "वेदाध्यापकः",
        "success.title": "आवेदनम् सफलतया समर्पितम् अस्ति",
        "success.description": "तव आवेदनम् सफलतया प्राप्यते। अधुना गृहपृष्ठं प्रति गच्छ स्वप्रवेशाय।",
        "success.homeButton": "गृहं प्रतिनिवर्त्य प्रवेशं कुर्वंतु",
        "search.detail.certifiedIn": "प्रमाणितविषयः",
        "search.detail.yearOfCertification": "प्रमाणनवर्षम्",
        "search.detail.certificate": "प्रमाणपत्रम्",
        "search.detail.photo": "चित्रम्",
        "search.detail.notUploaded": "न उपलोडितम्",
        "form.dataSaved": "फॉर्मदत्तांशः स्थानीयं रक्षितः",
        "form.duplicateEmail": "समानाय ईमेल-पत्राय प्रत्यक्षः। नूतने ईमेल-पत्रेण पुनः प्रयासः क्रियते।",
        "footer.copyright":
            "© 2025 वेद रक्षण निधि ट्रस्ट। सर्वाधिकाराः सुरक्षिताः।"
    }
};


/* ════════════════════════════════════════════════════════════
   READ SAVED LANGUAGE
════════════════════════════════════════════════════════════ */

function readSavedLanguage() {
    try {
        const language =
            localStorage.getItem(LANGUAGE_STORAGE_KEY);

        if (
            language &&
            Object.prototype.hasOwnProperty.call(
                TranslationDictionary,
                language
            )
        ) {
            return language;
        }
    } catch (error) {
        console.warn(
            "Unable to read saved language:",
            error
        );
    }

    return "en";
}


/* ════════════════════════════════════════════════════════════
   SAVE LANGUAGE
════════════════════════════════════════════════════════════ */

function saveLanguage(language) {
    try {
        localStorage.setItem(
            LANGUAGE_STORAGE_KEY,
            language
        );
    } catch (error) {
        console.warn(
            "Unable to save language:",
            error
        );
    }
}


/* ════════════════════════════════════════════════════════════
   GET TRANSLATION
════════════════════════════════════════════════════════════ */

function getTranslation(key) {
    if (!key) {
        return "";
    }

    const translations =
        TranslationDictionary[currentLanguage] || {};

    if (
        Object.prototype.hasOwnProperty.call(
            translations,
            key
        )
    ) {
        return translations[key];
    }

    if (
        Object.prototype.hasOwnProperty.call(
            TranslationDictionary.en,
            key
        )
    ) {
        return TranslationDictionary.en[key];
    }

    console.warn(`Missing translation key: ${key}`);

    return key;
}


/* ════════════════════════════════════════════════════════════
   TRANSLATE STANDARD HTML ELEMENTS
════════════════════════════════════════════════════════════ */

function translatePage() {
    document
        .querySelectorAll("[data-i18n]")
        .forEach((element) => {
            const key =
                element.getAttribute("data-i18n");

            element.textContent =
                getTranslation(key);
        });

    document
        .querySelectorAll("[data-i18n-placeholder]")
        .forEach((element) => {
            const key =
                element.getAttribute(
                    "data-i18n-placeholder"
                );

            element.placeholder =
                getTranslation(key);
        });

    document
        .querySelectorAll("[data-i18n-title]")
        .forEach((element) => {
            const key =
                element.getAttribute(
                    "data-i18n-title"
                );

            element.title =
                getTranslation(key);
        });

    document
        .querySelectorAll("[data-i18n-aria-label]")
        .forEach((element) => {
            const key =
                element.getAttribute(
                    "data-i18n-aria-label"
                );

            element.setAttribute(
                "aria-label",
                getTranslation(key)
            );
        });

    updateLanguageButtons();

    document.documentElement.lang =
        currentLanguage;

    translatePreviewPage();
}


/* ════════════════════════════════════════════════════════════
   TRANSLATE PREVIEW PAGE

   This handles preview.html because much of its content is
   created dynamically using JavaScript.
════════════════════════════════════════════════════════════ */

function translatePreviewPage() {
    const previewCard =
        document.getElementById("previewCard");

    if (!previewCard) {
        return;
    }

    document.title =
        getTranslation("preview.pageTitle");


    /* Header title */

    const headerTitle =
        document.querySelector(".header-main-title");

    if (headerTitle) {
        headerTitle.textContent =
            getTranslation("preview.trustTitle");
    }


    /* Progress labels */

    const stepLabels =
        document.querySelectorAll(
            ".step-progress .step-label"
        );

    if (stepLabels[0]) {
        stepLabels[0].textContent =
            getTranslation("step_personal");
    }

    if (stepLabels[1]) {
        stepLabels[1].textContent =
            getTranslation("step_preview");
    }

    if (stepLabels[2]) {
        stepLabels[2].textContent =
            getTranslation("step_submit");
    }


    /* Preview heading */

    const previewTitle =
        previewCard.querySelector(
            ".form-card-title"
        );

    if (previewTitle) {
        previewTitle.textContent =
            getTranslation(
                "preview.reviewTitle"
            );
    }


    /* Preview description */

    const previewDescription =
        previewCard.querySelector(
            ".form-card-title + p"
        );

    if (previewDescription) {
        previewDescription.textContent =
            getTranslation(
                "preview.reviewText"
            );
    }


    /* Buttons */

    const backButton =
        document.getElementById("backBtn");

    if (backButton) {
        backButton.textContent =
            getTranslation(
                "preview.editButton"
            );
    }

    const submitButton =
        document.getElementById("submitBtn");

    if (submitButton) {
        submitButton.textContent =
            getTranslation(
                "preview.submitButton"
            );
    }


    /* Footer */

    const footerText =
        document.querySelector(
            ".site-footer p"
        );

    if (footerText) {
        footerText.textContent =
            getTranslation(
                "footer.copyright"
            );
    }


    /*
     * Preview fields are dynamically generated.
     * Re-render preview after language changes.
     */

    if (
        typeof window.renderPreview === "function"
    ) {
        window.renderPreview();
    }
}


/* ════════════════════════════════════════════════════════════
   PREVIEW FIELD TRANSLATION
════════════════════════════════════════════════════════════ */

function getPreviewFieldLabel(fieldName) {
    const key =
        `preview.field.${fieldName}`;

    const translation =
        getTranslation(key);

    if (translation !== key) {
        return translation;
    }

    return fieldName
        .replace(/_/g, " ")
        .replace(
            /\b\w/g,
            character =>
                character.toUpperCase()
        );
}


/* ════════════════════════════════════════════════════════════
   PREVIEW SECTION TRANSLATION
════════════════════════════════════════════════════════════ */

function getPreviewSectionTitle(sectionName) {
    const sections = {
        personal:
            "preview.personalSection",

        vedic:
            "preview.vedicSection"
    };

    const key = sections[sectionName];

    return key
        ? getTranslation(key)
        : sectionName;
}


/* ════════════════════════════════════════════════════════════
   UPDATE LANGUAGE BUTTONS
════════════════════════════════════════════════════════════ */

function updateLanguageButtons() {
    document
        .querySelectorAll(".lang-btn")
        .forEach((button) => {
            const isActive =
                button.dataset.lang ===
                currentLanguage;

            button.classList.toggle(
                "active",
                isActive
            );

            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );
        });
}


/* ════════════════════════════════════════════════════════════
   CHANGE LANGUAGE
════════════════════════════════════════════════════════════ */

function changeLanguage(language) {
    if (
        !language ||
        !Object.prototype.hasOwnProperty.call(
            TranslationDictionary,
            language
        )
    ) {
        console.warn(
            `Unsupported language: ${language}`
        );

        return;
    }

    currentLanguage = language;

    saveLanguage(language);

    translatePage();

    document.dispatchEvent(
        new CustomEvent(
            "languageChanged",
            {
                detail: {
                    language:
                        currentLanguage
                }
            }
        )
    );
}


/* ════════════════════════════════════════════════════════════
   INITIALIZE
════════════════════════════════════════════════════════════ */

function initLanguage() {
    currentLanguage =
        readSavedLanguage();

    document
        .querySelectorAll(".lang-btn")
        .forEach((button) => {
            if (
                button.dataset
                    .translatorBound === "true"
            ) {
                return;
            }

            button.addEventListener(
                "click",
                function (event) {
                    event.preventDefault();

                    changeLanguage(
                        this.dataset.lang
                    );
                }
            );

            button.dataset.translatorBound =
                "true";
        });

    translatePage();
}


/* ════════════════════════════════════════════════════════════
   AUTO INITIALIZATION
════════════════════════════════════════════════════════════ */

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initLanguage,
        {
            once: true
        }
    );
} else {
    initLanguage();
}


/* ════════════════════════════════════════════════════════════
   GLOBAL API
════════════════════════════════════════════════════════════ */

const Translator = {
    init: initLanguage,

    setLanguage: changeLanguage,

    getCurrentLanguage: function () {
        return currentLanguage;
    },

    translatePage: translatePage,

    getTranslation: getTranslation,

    getPreviewFieldLabel:
        getPreviewFieldLabel,

    getPreviewSectionTitle:
        getPreviewSectionTitle
};


window.Translator = Translator;

window.initLanguage = initLanguage;

window.changeLanguage = changeLanguage;

window.translatePage = translatePage;

window.getTranslation = getTranslation;

window.getPreviewFieldLabel =
    getPreviewFieldLabel;

window.getPreviewSectionTitle =
    getPreviewSectionTitle;