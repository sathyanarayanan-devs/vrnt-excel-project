package com.example.Vrnt.service;

import com.example.Vrnt.Repository.UserRepository;
import com.example.Vrnt.config.AppProperties;
import com.example.Vrnt.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExcelService {

        private final UserRepository userRepository;
        private final AppProperties appProperties;

        // ── INIT ON STARTUP ───────────────────────────────────
        // Called ONCE when the app starts.
        // Creates the Excel file only if it doesn't already exist.
        // If the file exists — it is NOT touched, data is preserved.
        public void initExcelOnStartup() {
                Path excelPath = appProperties.resolveExcelPath();
                File file = excelPath.toFile();

                if (file.exists()) {
                        log.info("✅ Excel file already exists — no changes made: {}", excelPath);
                        return;
                }

                log.info("📄 Excel file not found. Creating fresh file...");
                saveExcelToLocalMachine(); // creates with current DB users
        }

        // ── SAVE TO LOCAL MACHINE (called on every register) ──
        // Reads all users from DB and writes to Excel.
        // Since DB is the source of truth, data is always safe on restart.
        // Location: C:\Users\YourName\VRNT_Data\vrnt_users.xlsx
        public void saveExcelToLocalMachine() {
                try {
                        List<User> users = userRepository.findAll();

                        Path excelPath = appProperties.resolveExcelPath();
                        Path folderPath = excelPath.getParent();

                        if (folderPath != null && !Files.exists(folderPath)) {
                                Files.createDirectories(folderPath);
                                log.info("📁 Created folder: {}", folderPath);
                        }

                        // Build workbook
                        try (XSSFWorkbook workbook = new XSSFWorkbook()) {

                                Sheet sheet = workbook.createSheet("All Users");

                                // ── Header style ──────────────────────────
                                CellStyle headerStyle = workbook.createCellStyle();
                                headerStyle.setFillForegroundColor(
                                                IndexedColors.ROYAL_BLUE.getIndex());
                                headerStyle.setFillPattern(
                                                FillPatternType.SOLID_FOREGROUND);
                                Font headerFont = workbook.createFont();
                                headerFont.setBold(true);
                                headerFont.setColor(IndexedColors.WHITE.getIndex());
                                headerStyle.setFont(headerFont);

                                // ── Headers ───────────────────────────────
                                Row headerRow = sheet.createRow(0);
                                String[] headers = {
                                                "First Name", "Last Name", "Mobile", "Email", "Role",
                                                "Username", "Street Address", "City", "State", "Postal Code",
                                                "Aadhaar", "Date of Birth", "Vedham", "Shaka", "Gothram",
                                                "Soothram", "Patasalai", "Veda Adhyapakar", "Certified In",
                                                "Year of Certification", "Registered At"
                                };
                                for (int i = 0; i < headers.length; i++) {
                                        Cell cell = headerRow.createCell(i);
                                        cell.setCellValue(headers[i]);
                                        cell.setCellStyle(headerStyle);
                                        sheet.setColumnWidth(i, 22 * 256);
                                }

                                // ── Data rows ─────────────────────────────
                                CellStyle dataStyle = workbook.createCellStyle();
                                dataStyle.setBorderBottom(BorderStyle.THIN);
                                dataStyle.setBorderTop(BorderStyle.THIN);
                                dataStyle.setBorderLeft(BorderStyle.THIN);
                                dataStyle.setBorderRight(BorderStyle.THIN);

                                // Alternate row color
                                CellStyle altStyle = workbook.createCellStyle();
                                altStyle.cloneStyleFrom(dataStyle);
                                altStyle.setFillForegroundColor(
                                                IndexedColors.LIGHT_YELLOW.getIndex());
                                altStyle.setFillPattern(
                                                FillPatternType.SOLID_FOREGROUND);

                                int rowNum = 1;
                                for (User user : users) {
                                        Row row = sheet.createRow(rowNum);
                                        CellStyle style = (rowNum % 2 == 0) ? altStyle : dataStyle;

                                        createCell(row, 0,
                                                        user.getFirstName(), style);
                                        createCell(row, 1,
                                                        user.getLastName(), style);
                                        createCell(row, 2,
                                                        user.getMobile(), style);
                                        createCell(row, 3,
                                                        user.getEmail(), style);
                                        createCell(row, 4,
                                                        user.getRole(), style);
                                        createCell(row, 5,
                                                        user.getUsername(), style);
                                        createCell(row, 6,
                                                        user.getStreet1(), style);
                                        createCell(row, 7,
                                                        user.getCity(), style);
                                        createCell(row, 8,
                                                        user.getState(), style);
                                        createCell(row, 9,
                                                        user.getPostalCode(), style);
                                        createCell(row, 10,
                                                        user.getAadhaar(), style);
                                        createCell(row, 11,
                                                        user.getDateOfBirth() != null
                                                                        ? user.getDateOfBirth().toString()
                                                                        : "-",
                                                        style);
                                        createCell(row, 12,
                                                        user.getVedham(), style);
                                        createCell(row, 13,
                                                        user.getShaka(), style);
                                        createCell(row, 14,
                                                        user.getGothram(), style);
                                        createCell(row, 15,
                                                        user.getSoothram(), style);
                                        createCell(row, 16,
                                                        user.getPatasalai(), style);
                                        createCell(row, 17,
                                                        user.getAdhyapakarName(), style);
                                        createCell(row, 18,
                                                        user.getCertifiedIn(), style);
                                        createCell(row, 19,
                                                        user.getYearOfCertification(), style);
                                        createCell(row, 20,
                                                        user.getCreatedAt() != null
                                                                        ? user.getCreatedAt().toString()
                                                                        : "-",
                                                        style);
                                        rowNum++;
                                }

                                // ── Write to local file ───────────────────
                                try (FileOutputStream fos = new FileOutputStream(excelPath.toFile())) {
                                        workbook.write(fos);
                                }

                                log.info("✅ Excel saved locally: {} ({} users)", excelPath, users.size());
                        }

                } catch (IOException e) {
                        // Log error but don't crash the registration flow
                        log.error("❌ Failed to save Excel locally: {}",
                                        e.getMessage());
                }
        }

        // ── EXPORT ALL USERS — for download via browser ───────
        public ByteArrayInputStream exportUsersToExcel() {

                List<User> users = userRepository.findAll();

                try (XSSFWorkbook workbook = new XSSFWorkbook()) {

                        Sheet sheet = workbook.createSheet("Users");

                        // Header style
                        CellStyle headerStyle = workbook.createCellStyle();
                        headerStyle.setFillForegroundColor(
                                        IndexedColors.ROYAL_BLUE.getIndex());
                        headerStyle.setFillPattern(
                                        FillPatternType.SOLID_FOREGROUND);
                        Font headerFont = workbook.createFont();
                        headerFont.setBold(true);
                        headerFont.setColor(IndexedColors.WHITE.getIndex());
                        headerStyle.setFont(headerFont);

                        // Headers
                        Row headerRow = sheet.createRow(0);
                        String[] headers = {
                                        "First Name", "Last Name", "Mobile", "Email", "Role",
                                        "Username", "Street Address", "City", "State", "Postal Code",
                                        "Aadhaar", "Date of Birth", "Vedham", "Shaka", "Gothram",
                                        "Soothram", "Patasalai", "Veda Adhyapakar", "Certified In",
                                        "Year of Certification", "Registered At"
                        };
                        for (int i = 0; i < headers.length; i++) {
                                Cell cell = headerRow.createCell(i);
                                cell.setCellValue(headers[i]);
                                cell.setCellStyle(headerStyle);
                                sheet.setColumnWidth(i, 20 * 256);
                        }

                        // Data style
                        CellStyle dataStyle = workbook.createCellStyle();
                        dataStyle.setBorderBottom(BorderStyle.THIN);
                        dataStyle.setBorderTop(BorderStyle.THIN);
                        dataStyle.setBorderLeft(BorderStyle.THIN);
                        dataStyle.setBorderRight(BorderStyle.THIN);

                        // Data rows
                        int rowNum = 1;
                        for (User user : users) {
                                Row row = sheet.createRow(rowNum++);
                                createCell(row, 0,
                                                user.getFirstName(), dataStyle);
                                createCell(row, 1,
                                                user.getLastName(), dataStyle);
                                createCell(row, 2,
                                                user.getMobile(), dataStyle);
                                createCell(row, 3,
                                                user.getEmail(), dataStyle);
                                createCell(row, 4,
                                                user.getRole(), dataStyle);
                                createCell(row, 5,
                                                user.getUsername(), dataStyle);
                                createCell(row, 6,
                                                user.getStreet1(), dataStyle);
                                createCell(row, 7,
                                                user.getCity(), dataStyle);
                                createCell(row, 8,
                                                user.getState(), dataStyle);
                                createCell(row, 9,
                                                user.getPostalCode(), dataStyle);
                                createCell(row, 10,
                                                user.getAadhaar(), dataStyle);
                                createCell(row, 11,
                                                user.getDateOfBirth() != null
                                                                ? user.getDateOfBirth().toString()
                                                                : "-",
                                                dataStyle);
                                createCell(row, 12,
                                                user.getVedham(), dataStyle);
                                createCell(row, 13,
                                                user.getShaka(), dataStyle);
                                createCell(row, 14,
                                                user.getGothram(), dataStyle);
                                createCell(row, 15,
                                                user.getSoothram(), dataStyle);
                                createCell(row, 16,
                                                user.getPatasalai(), dataStyle);
                                createCell(row, 17,
                                                user.getAdhyapakarName(), dataStyle);
                                createCell(row, 18,
                                                user.getCertifiedIn(), dataStyle);
                                createCell(row, 19,
                                                user.getYearOfCertification(), dataStyle);
                                createCell(row, 20,
                                                user.getCreatedAt() != null
                                                                ? user.getCreatedAt().toString()
                                                                : "-",
                                                dataStyle);
                        }

                        ByteArrayOutputStream out = new ByteArrayOutputStream();
                        workbook.write(out);
                        log.info("📥 Excel exported for download — {} users",
                                        users.size());
                        return new ByteArrayInputStream(out.toByteArray());

                } catch (IOException e) {
                        throw new RuntimeException(
                                        "Failed to export Excel: " + e.getMessage());
                }
        }

        // ── EXPORT BY ROLE — for download via browser ─────────
        public ByteArrayInputStream exportUsersByRole(String role) {

                List<User> users = userRepository.findByRole(role);

                try (XSSFWorkbook workbook = new XSSFWorkbook()) {

                        Sheet sheet = workbook.createSheet(
                                        role.toUpperCase() + "S");

                        // Header style
                        CellStyle headerStyle = workbook.createCellStyle();
                        headerStyle.setFillForegroundColor(
                                        IndexedColors.GREEN.getIndex());
                        headerStyle.setFillPattern(
                                        FillPatternType.SOLID_FOREGROUND);
                        Font headerFont = workbook.createFont();
                        headerFont.setBold(true);
                        headerFont.setColor(IndexedColors.WHITE.getIndex());
                        headerStyle.setFont(headerFont);

                        // Headers
                        Row headerRow = sheet.createRow(0);
                        String[] headers = {
                                        "First Name", "Last Name", "Mobile", "Email", "Role",
                                        "Username", "Street Address", "City", "State", "Postal Code",
                                        "Aadhaar", "Date of Birth", "Vedham", "Shaka", "Gothram",
                                        "Soothram", "Patasalai", "Veda Adhyapakar", "Certified In",
                                        "Year of Certification", "Registered At"
                        };
                        for (int i = 0; i < headers.length; i++) {
                                Cell cell = headerRow.createCell(i);
                                cell.setCellValue(headers[i]);
                                cell.setCellStyle(headerStyle);
                                sheet.setColumnWidth(i, 20 * 256);
                        }

                        // Data rows
                        int rowNum = 1;
                        for (User user : users) {
                                Row row = sheet.createRow(rowNum++);
                                row.createCell(0).setCellValue(user.getFirstName() != null ? user.getFirstName() : "-");
                                row.createCell(1).setCellValue(user.getLastName() != null ? user.getLastName() : "-");
                                row.createCell(2).setCellValue(user.getMobile() != null ? user.getMobile() : "-");
                                row.createCell(3).setCellValue(user.getEmail() != null ? user.getEmail() : "-");
                                row.createCell(4).setCellValue(user.getRole() != null ? user.getRole() : "-");
                                row.createCell(5).setCellValue(user.getUsername() != null ? user.getUsername() : "-");
                                row.createCell(6).setCellValue(user.getStreet1() != null ? user.getStreet1() : "-");
                                row.createCell(7).setCellValue(user.getCity() != null ? user.getCity() : "-");
                                row.createCell(8).setCellValue(user.getState() != null ? user.getState() : "-");
                                row.createCell(9).setCellValue(
                                                user.getPostalCode() != null ? user.getPostalCode() : "-");
                                row.createCell(10).setCellValue(user.getAadhaar() != null ? user.getAadhaar() : "-");
                                row.createCell(11).setCellValue(
                                                user.getDateOfBirth() != null ? user.getDateOfBirth().toString() : "-");
                                row.createCell(12).setCellValue(user.getVedham() != null ? user.getVedham() : "-");
                                row.createCell(13).setCellValue(user.getShaka() != null ? user.getShaka() : "-");
                                row.createCell(14).setCellValue(user.getGothram() != null ? user.getGothram() : "-");
                                row.createCell(15).setCellValue(user.getSoothram() != null ? user.getSoothram() : "-");
                                row.createCell(16)
                                                .setCellValue(user.getPatasalai() != null ? user.getPatasalai() : "-");
                                row.createCell(17).setCellValue(
                                                user.getAdhyapakarName() != null ? user.getAdhyapakarName() : "-");
                                row.createCell(18).setCellValue(
                                                user.getCertifiedIn() != null ? user.getCertifiedIn() : "-");
                                row.createCell(19)
                                                .setCellValue(user.getYearOfCertification() != null
                                                                ? user.getYearOfCertification()
                                                                : "-");
                                row.createCell(20).setCellValue(
                                                user.getCreatedAt() != null ? user.getCreatedAt().toString() : "-");
                        }

                        ByteArrayOutputStream out = new ByteArrayOutputStream();
                        workbook.write(out);
                        log.info("📥 Excel exported {} {}s", users.size(), role);
                        return new ByteArrayInputStream(out.toByteArray());

                } catch (IOException e) {
                        throw new RuntimeException(
                                        "Failed to export Excel: " + e.getMessage());
                }
        }

        // ── HELPER ────────────────────────────────────────────
        private void createCell(Row row, int col,
                        String value, CellStyle style) {
                Cell cell = row.createCell(col);
                cell.setCellValue(value != null ? value : "-");
                cell.setCellStyle(style);
        }
}
