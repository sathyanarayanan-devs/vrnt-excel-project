package com.example.Vrnt.service;

import com.example.Vrnt.model.User;
import com.example.Vrnt.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExcelService {

    private final UserRepository userRepository;

    // ── LOCAL FILE PATH ───────────────────────────────────
    // Location: C:\Users\YourName\VRNT_Data\vrnt_users.xlsx
    private static final String LOCAL_EXCEL_PATH =
            System.getProperty("user.home") +
                    File.separator + "VRNT_Data" +
                    File.separator + "vrnt_users.xlsx";

    // ── INIT ON STARTUP ───────────────────────────────────
    // Called ONCE when the app starts.
    // Creates the Excel file only if it doesn't already exist.
    // If the file exists — it is NOT touched, data is preserved.
    public void initExcelOnStartup() {
        File file = new File(LOCAL_EXCEL_PATH);

        if (file.exists()) {
            log.info("✅ Excel file already exists — no changes made: {}",
                    LOCAL_EXCEL_PATH);
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

            // Create folder if it doesn't exist
            Path folderPath = Paths.get(
                    System.getProperty("user.home") +
                            File.separator + "VRNT_Data");

            if (!Files.exists(folderPath)) {
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
                        "ID", "Role", "Username",
                        "Full Name", "Email",
                        "Gender", "Department", "Registered At"
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
                    CellStyle style =
                            (rowNum % 2 == 0) ? altStyle : dataStyle;

                    createCell(row, 0,
                            String.valueOf(user.getId()), style);
                    createCell(row, 1,
                            user.getRole(), style);
                    createCell(row, 2,
                            user.getUsername(), style);
                    createCell(row, 3,
                            user.getFullName(), style);
                    createCell(row, 4,
                            user.getEmail(), style);
                    createCell(row, 5,
                            user.getGender(), style);
                    createCell(row, 6,
                            user.getDepartment(), style);
                    createCell(row, 7,
                            user.getCreatedAt() != null
                                    ? user.getCreatedAt().toString()
                                    : "-", style);
                    rowNum++;
                }

                // ── Write to local file ───────────────────
                try (FileOutputStream fos =
                             new FileOutputStream(LOCAL_EXCEL_PATH)) {
                    workbook.write(fos);
                }

                log.info(
                        "✅ Excel saved locally: {} ({} users)",
                        LOCAL_EXCEL_PATH, users.size());
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
                    "ID", "Role", "Username",
                    "Full Name", "Email",
                    "Gender", "Department", "Created At"
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
                        String.valueOf(user.getId()),   dataStyle);
                createCell(row, 1,
                        user.getRole(),                 dataStyle);
                createCell(row, 2,
                        user.getUsername(),             dataStyle);
                createCell(row, 3,
                        user.getFullName(),             dataStyle);
                createCell(row, 4,
                        user.getEmail(),                dataStyle);
                createCell(row, 5,
                        user.getGender(),               dataStyle);
                createCell(row, 6,
                        user.getDepartment(),           dataStyle);
                createCell(row, 7,
                        user.getCreatedAt() != null
                                ? user.getCreatedAt().toString()
                                : "-",                      dataStyle);
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
                    "ID", "Username", "Full Name",
                    "Email", "Gender", "Department", "Created At"
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
                row.createCell(0).setCellValue(user.getId());
                row.createCell(1).setCellValue(user.getUsername());
                row.createCell(2).setCellValue(user.getFullName());
                row.createCell(3).setCellValue(user.getEmail());
                row.createCell(4).setCellValue(user.getGender());
                row.createCell(5).setCellValue(user.getDepartment());
                row.createCell(6).setCellValue(
                        user.getCreatedAt() != null
                                ? user.getCreatedAt().toString()
                                : "-");
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
