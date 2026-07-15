# E2E Test Report

## Run Details
- Date: 2026-07-15
- Command: `./mvnw -DskipTests=false test -Dtest=E2EIntegrationTests`
- Overall result: PASS

## Test Cases

| Test name | Result | Files targeted | Notes |
| --- | --- | --- | --- |
| registrationValidationRejectsBadData | PASS | [src/test/java/com/example/Vrnt/integration/E2EIntegrationTests.java](src/test/java/com/example/Vrnt/integration/E2EIntegrationTests.java), [src/main/java/com/example/Vrnt/Controller/UserController.java](src/main/java/com/example/Vrnt/Controller/UserController.java), [src/main/java/com/example/Vrnt/service/UserService.java](src/main/java/com/example/Vrnt/service/UserService.java), [src/main/java/com/example/Vrnt/model/User.java](src/main/java/com/example/Vrnt/model/User.java), [src/main/java/com/example/Vrnt/Repository/UserRepository.java](src/main/java/com/example/Vrnt/Repository/UserRepository.java) | Verified that invalid registration payloads are rejected with a bad request response. |
| adminSearchEndpoint_filtersAndAuthorization | PASS | [src/test/java/com/example/Vrnt/integration/E2EIntegrationTests.java](src/test/java/com/example/Vrnt/integration/E2EIntegrationTests.java), [src/main/java/com/example/Vrnt/Controller/UserController.java](src/main/java/com/example/Vrnt/Controller/UserController.java), [src/main/java/com/example/Vrnt/security/JwtUtil.java](src/main/java/com/example/Vrnt/security/JwtUtil.java) | Verified admin access works and a normal user is forbidden from the admin search endpoint. |
| excelExportEndpoints_produceValidWorkbook_and_noFormulaCells | PASS | [src/test/java/com/example/Vrnt/integration/E2EIntegrationTests.java](src/test/java/com/example/Vrnt/integration/E2EIntegrationTests.java), [src/main/java/com/example/Vrnt/Controller/ExcelController.java](src/main/java/com/example/Vrnt/Controller/ExcelController.java), [src/main/java/com/example/Vrnt/service/ExcelService.java](src/main/java/com/example/Vrnt/service/ExcelService.java) | Verified that Excel export returns a valid workbook and does not contain formula cells. |

## Summary
- Total tests run: 3
- Passed: 3
- Failed: 0
- Errors: 0
- Skipped: 0

## Evidence
The Maven test run reported:
- Tests run: 3
- Failures: 0
- Errors: 0
- Skipped: 0
- BUILD SUCCESS
