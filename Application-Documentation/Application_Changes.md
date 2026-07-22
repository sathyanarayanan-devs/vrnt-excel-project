# Application Changes Summary

## Overview
The registration, login, user lookup, dashboard listing, search, and Excel export flows were updated to use the Excel workbook as the runtime source of truth for user data.

## What changed
- Registration now writes a new user record directly to the Excel workbook.
- Login validates credentials by reading users from the Excel workbook instead of relying on the database.
- User details, count, and listing endpoints now resolve data from Excel-backed records.
- Role assignment still follows the existing email-domain rule, with admin users recognized when the email ends in @vrnt.org.
- Export endpoints now generate Excel files from the same Excel-backed user records.

## Key implementation points
- The Excel service now creates/updates the workbook, stores user rows, and exposes lookup helpers for email, username, mobile, Aadhaar, role, and count operations.
- User service methods for registration, login, user detail retrieval, count, search, and listing now delegate to Excel-backed operations.
- The end-to-end test verifies normal and admin registration, login, user details, count retrieval, listing, and Excel export.

## Verification
The project was rebuilt successfully and the E2E regression test was executed successfully:
- Build: ./mvnw clean -DskipTests compile
- Test: ./mvnw -q -Dtest=E2EUserFlowTest test
