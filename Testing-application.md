# Testing Application

## Overview
This document records the end-to-end workflow verification performed for the VRNT application.

## Environment
- Application URL: http://localhost:8081
- Build/run command used: ./mvnw spring-boot:run
- Verified on: 2026-07-15

## Test Steps and Results

### 1. User Registration Flow
- Opened the registration page and entered demo user data.
- Used the preview page to review the entered details before submission.
- Result: Preview page displayed the entered values correctly, including the masked password.
- Submitted the application successfully.
- Result: Redirected to the success page and displayed the confirmation message.

### 2. User Login Flow
- Navigated to the login page and signed in as the demo user.
- Credentials used:
  - Email: demo.user@example.com
  - Password: DemoPass123
- Result: Login succeeded and redirected to the user dashboard.
- Verified that the dashboard displayed the profile details entered during registration.

### 3. Admin Registration Flow
- Registered a demo admin account through the backend registration endpoint.
- Credentials used:
  - Email: admin.demo@vrnt.org
  - Password: AdminPass123
- Result: Registration completed successfully and the user was assigned the admin role.

### 4. Admin Login Flow
- Logged in as the admin user.
- Result: Login succeeded and redirected to the admin dashboard.
- Verified that the dashboard showed the correct admin privileges and the user count.

### 5. Admin Search Users
- Opened the admin search page.
- Verified that the search results displayed the registered users in a table.
- Result: The page showed 4 users, including the newly created demo user and admin user.

### 6. Admin Export Users to Excel
- Clicked the export action on the admin search page.
- Result: An Excel file was generated successfully at the project output path.
- Generated file:
  - ./VRNT_Data/vrnt_users.xlsx

### 7. Admin Logout
- Used the logout action from the admin dashboard/search page flow.
- Result: The logout flow was available and the session was terminated successfully.

## Notes
- The preview page and success page both rendered correctly.
- The login and admin dashboard flows worked as expected.
- The application successfully stored and displayed the registration data for the demo user.
