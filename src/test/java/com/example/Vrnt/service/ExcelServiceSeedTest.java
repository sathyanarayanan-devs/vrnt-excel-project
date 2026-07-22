package com.example.Vrnt.service;

import com.example.Vrnt.config.AppProperties;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;

class ExcelServiceSeedTest {

    @TempDir
    Path tempDir;

    @Test
    void initExcelOnStartupCreatesEmptyWorkbooksWhenNoUsersExist() throws Exception {
        Path normalPath = tempDir.resolve("normal.xlsx");
        Path adminPath = tempDir.resolve("admin.xlsx");

        AppProperties appProperties = new AppProperties();
        appProperties.setNormalExcelPath(normalPath.toString());
        appProperties.setAdminExcelPath(adminPath.toString());

        ExcelService excelService = new ExcelService(appProperties);

        // Create empty workbook files so startup should initialize them without any
        // demo account data.
        normalPath.toFile().createNewFile();
        adminPath.toFile().createNewFile();

        excelService.initExcelOnStartup();

        assertThat(excelService.getAllUsers()).isEmpty();
        assertThat(excelService.findByUsername("admin.demo")).isNull();
        assertThat(excelService.findByEmail("demo.user@example.com")).isNull();
    }

    @Test
    void initExcelOnStartupPreservesExistingUserDataWithoutInjectingDemoAccounts() throws Exception {
        Path normalPath = tempDir.resolve("normal.xlsx");
        Path adminPath = tempDir.resolve("admin.xlsx");

        AppProperties appProperties = new AppProperties();
        appProperties.setNormalExcelPath(normalPath.toString());
        appProperties.setAdminExcelPath(adminPath.toString());

        ExcelService excelService = new ExcelService(appProperties);

        writeWorkbookWithUser(normalPath, "demo.user@example.com", "demo.user", "old-password");
        writeWorkbookWithUser(adminPath, "admin.demo@vrnt.org", "admin.demo", "another-password");
        writeWorkbookWithUser(normalPath, "other.admin@vrnt.org", "otheradmin", "old-password");
        writeWorkbookWithUser(adminPath, "old.user@example.com", "olduser", "another-password");

        excelService.initExcelOnStartup();

        assertThat(excelService.getAllUsers()).hasSize(2);
        assertThat(excelService.findByEmail("admin.demo@vrnt.org")).isNull();
        assertThat(excelService.findByEmail("demo.user@example.com")).isNull();
        assertThat(excelService.findByEmail("other.admin@vrnt.org")).isNotNull();
        assertThat(excelService.findByEmail("old.user@example.com")).isNotNull();
    }

    private void writeWorkbookWithUser(Path filePath, String email, String username, String password) throws Exception {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("All Users");
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("First Name");
            header.createCell(1).setCellValue("Last Name");
            header.createCell(2).setCellValue("Mobile");
            header.createCell(3).setCellValue("Email");
            header.createCell(4).setCellValue("Role");
            header.createCell(5).setCellValue("Username");
            header.createCell(6).setCellValue("Password");

            Row data = sheet.createRow(1);
            data.createCell(0).setCellValue("Existing");
            data.createCell(1).setCellValue("User");
            data.createCell(2).setCellValue("1234567890");
            data.createCell(3).setCellValue(email);
            data.createCell(4).setCellValue("normal");
            data.createCell(5).setCellValue(username);
            data.createCell(6).setCellValue(password);

            try (java.io.FileOutputStream fos = new java.io.FileOutputStream(filePath.toFile())) {
                workbook.write(fos);
            }
        }
    }
}
