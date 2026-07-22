package com.example.Vrnt.service;

import com.example.Vrnt.config.AppProperties;
import com.example.Vrnt.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExcelService {

        private final AppProperties appProperties;
        private static final String SHEET_NAME = "All Users";
        private static final String[] HEADERS = {
                        "First Name", "Last Name", "Mobile", "Email", "Role",
                        "Username", "Street Address", "City", "State", "Postal Code",
                        "Aadhaar", "Date of Birth", "Vedham", "Shaka", "Gothram",
                        "Soothram", "Patasalai", "Veda Adhyapakar", "Certified In",
                        "Year of Certification", "Registered At", "Password"
        };

        public void initExcelOnStartup() {
                ensureWorkbookExists(appProperties.resolveNormalExcelPath());
                ensureWorkbookExists(appProperties.resolveAdminExcelPath());
        }

        private boolean workbookHasData(Path excelPath) {
                if (!Files.exists(excelPath)) {
                        return false;
                }

                try (InputStream inputStream = Files.newInputStream(excelPath)) {
                        Workbook workbook = WorkbookFactory.create(inputStream);
                        Sheet sheet = workbook.getSheet(SHEET_NAME);
                        boolean hasData = sheet != null && sheet.getLastRowNum() > 0;
                        workbook.close();
                        return hasData;
                } catch (org.apache.poi.EmptyFileException e) {
                        return false;
                } catch (IOException e) {
                        log.warn("⚠️ Could not inspect Excel workbook {}: {}", excelPath, e.getMessage());
                        return false;
                }
        }

        private List<User> seedUsersForWorkbook(Path excelPath) {
                return List.of();
        }

        public void saveExcelToLocalMachine() {
                saveExcelToLocalMachine(getAllUsers());
        }

        public void saveExcelToLocalMachine(List<User> users) {
                if (users == null) {
                        users = new ArrayList<>();
                }

                List<User> normalUsers = users.stream()
                                .filter(this::isNormalRole)
                                .toList();
                List<User> adminUsers = users.stream()
                                .filter(this::isAdminRole)
                                .toList();

                saveUsersToWorkbook(appProperties.resolveNormalExcelPath(), normalUsers);
                saveUsersToWorkbook(appProperties.resolveAdminExcelPath(), adminUsers);
        }

        private void ensureWorkbookExists(Path excelPath) {
                File file = excelPath.toFile();
                List<User> existingUsers = readUsersFromWorkbook(excelPath);
                List<User> cleanedUsers = existingUsers.stream()
                                .filter(user -> !isKnownDemoUser(user))
                                .toList();
                List<User> seedUsers = seedUsersForWorkbook(excelPath);
                List<User> mergedUsers = new ArrayList<>();
                boolean changed = false;

                if (cleanedUsers.size() != existingUsers.size()) {
                        changed = true;
                }

                for (User existingUser : cleanedUsers) {
                        boolean replaced = false;
                        for (User seedUser : seedUsers) {
                                if (matchesSeedUser(existingUser, seedUser)) {
                                        mergedUsers.add(seedUser);
                                        changed = true;
                                        replaced = true;
                                        break;
                                }
                        }
                        if (!replaced) {
                                mergedUsers.add(existingUser);
                        }
                }

                for (User seedUser : seedUsers) {
                        boolean exists = mergedUsers.stream()
                                        .anyMatch(existing -> matchesSeedUser(existing, seedUser));
                        if (!exists) {
                                mergedUsers.add(seedUser);
                                changed = true;
                        }
                }

                if (file.exists() && workbookHasData(excelPath) && !changed) {
                        log.info("✅ Excel file already exists with data and seed users — no changes made: {}",
                                        excelPath);
                        return;
                }

                log.info("📄 Excel file not found, empty, or missing seed users. Writing default Excel users...");
                saveUsersToWorkbook(excelPath, mergedUsers);
        }

        private boolean matchesSeedUser(User candidate, User seedUser) {
                if (candidate == null || seedUser == null) {
                        return false;
                }

                boolean sameEmail = seedUser.getEmail() != null
                                && seedUser.getEmail().equalsIgnoreCase(candidate.getEmail());
                boolean sameUsername = seedUser.getUsername() != null
                                && seedUser.getUsername().equalsIgnoreCase(candidate.getUsername());
                return sameEmail || sameUsername;
        }

        private boolean isKnownDemoUser(User user) {
                if (user == null) {
                        return false;
                }

                String email = user.getEmail();
                String username = user.getUsername();
                return (email != null && (email.equalsIgnoreCase("admin.demo@vrnt.org")
                                || email.equalsIgnoreCase("demo.user@example.com")
                                || email.equalsIgnoreCase("alice@example.com")))
                                || (username != null && (username.equalsIgnoreCase("admin.demo")
                                                || username.equalsIgnoreCase("demo.user")
                                                || username.equalsIgnoreCase("alice")));
        }

        private void saveUsersToWorkbook(Path excelPath, List<User> users) {
                try {
                        Path folderPath = excelPath.getParent();

                        if (folderPath != null && !Files.exists(folderPath)) {
                                Files.createDirectories(folderPath);
                                log.info("📁 Created folder: {}", folderPath);
                        }

                        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
                                Sheet sheet = workbook.createSheet(SHEET_NAME);

                                CellStyle headerStyle = workbook.createCellStyle();
                                headerStyle.setFillForegroundColor(IndexedColors.ROYAL_BLUE.getIndex());
                                headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
                                Font headerFont = workbook.createFont();
                                headerFont.setBold(true);
                                headerFont.setColor(IndexedColors.WHITE.getIndex());
                                headerStyle.setFont(headerFont);

                                Row headerRow = sheet.createRow(0);
                                for (int i = 0; i < HEADERS.length; i++) {
                                        Cell cell = headerRow.createCell(i);
                                        cell.setCellValue(HEADERS[i]);
                                        cell.setCellStyle(headerStyle);
                                        sheet.setColumnWidth(i, 22 * 256);
                                }

                                CellStyle dataStyle = workbook.createCellStyle();
                                dataStyle.setBorderBottom(BorderStyle.THIN);
                                dataStyle.setBorderTop(BorderStyle.THIN);
                                dataStyle.setBorderLeft(BorderStyle.THIN);
                                dataStyle.setBorderRight(BorderStyle.THIN);

                                CellStyle altStyle = workbook.createCellStyle();
                                altStyle.cloneStyleFrom(dataStyle);
                                altStyle.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
                                altStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

                                int rowNum = 1;
                                for (User user : users) {
                                        Row row = sheet.createRow(rowNum);
                                        CellStyle style = (rowNum % 2 == 0) ? altStyle : dataStyle;
                                        createCell(row, 0, user.getFirstName(), style);
                                        createCell(row, 1, user.getLastName(), style);
                                        createCell(row, 2, user.getMobile(), style);
                                        createCell(row, 3, user.getEmail(), style);
                                        createCell(row, 4, user.getRole(), style);
                                        createCell(row, 5, user.getUsername(), style);
                                        createCell(row, 6, user.getStreet1(), style);
                                        createCell(row, 7, user.getCity(), style);
                                        createCell(row, 8, user.getState(), style);
                                        createCell(row, 9, user.getPostalCode(), style);
                                        createCell(row, 10, user.getAadhaar(), style);
                                        createCell(row, 11,
                                                        user.getDateOfBirth() != null ? user.getDateOfBirth().toString()
                                                                        : "-",
                                                        style);
                                        createCell(row, 12, user.getVedham(), style);
                                        createCell(row, 13, user.getShaka(), style);
                                        createCell(row, 14, user.getGothram(), style);
                                        createCell(row, 15, user.getSoothram(), style);
                                        createCell(row, 16, user.getPatasalai(), style);
                                        createCell(row, 17, user.getAdhyapakarName(), style);
                                        createCell(row, 18, user.getCertifiedIn(), style);
                                        createCell(row, 19, user.getYearOfCertification(), style);
                                        createCell(row, 20, user.getCreatedAt() != null ? user.getCreatedAt().toString()
                                                        : "-", style);
                                        createCell(row, 21, user.getPassword(), style);
                                        rowNum++;
                                }

                                try (FileOutputStream fos = new FileOutputStream(excelPath.toFile())) {
                                        workbook.write(fos);
                                }

                                log.info("✅ Excel saved locally: {} ({} users)", excelPath, users.size());
                        }
                } catch (IOException e) {
                        log.error("❌ Failed to save Excel locally: {}", e.getMessage());
                }
        }

        public List<User> getAllUsers() {
                List<User> users = new ArrayList<>();
                users.addAll(readUsersFromWorkbook(appProperties.resolveNormalExcelPath()));
                users.addAll(readUsersFromWorkbook(appProperties.resolveAdminExcelPath()));
                return users;
        }

        private List<User> readUsersFromWorkbook(Path excelPath) {
                if (!Files.exists(excelPath)) {
                        saveUsersToWorkbook(excelPath, new ArrayList<>());
                        return new ArrayList<>();
                }

                if (excelPath.toFile().length() == 0) {
                        return new ArrayList<>();
                }

                try (InputStream inputStream = Files.newInputStream(excelPath)) {
                        Workbook workbook = WorkbookFactory.create(inputStream);
                        Sheet sheet = workbook.getSheet(SHEET_NAME);
                        List<User> users = new ArrayList<>();
                        if (sheet == null) {
                                workbook.close();
                                return users;
                        }

                        for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                                Row row = sheet.getRow(rowIndex);
                                if (row == null) {
                                        continue;
                                }
                                User user = mapRowToUser(row);
                                if (user != null) {
                                        users.add(user);
                                }
                        }
                        workbook.close();
                        return users;
                } catch (org.apache.poi.EmptyFileException e) {
                        return new ArrayList<>();
                } catch (IOException e) {
                        log.error("❌ Failed to read users from Excel: {}", e.getMessage());
                        return new ArrayList<>();
                }
        }

        public void addUser(User user) {
                if (user == null) {
                        return;
                }
                if (user.getId() == null) {
                        user.setId(System.currentTimeMillis());
                }
                if (user.getCreatedAt() == null) {
                        user.setCreatedAt(LocalDateTime.now());
                }
                if (user.getUpdatedAt() == null) {
                        user.setUpdatedAt(LocalDateTime.now());
                }
                List<User> users = new ArrayList<>(getAllUsers());
                users.add(user);
                saveExcelToLocalMachine(users);
        }

        public void updateUsers(List<User> users) {
                saveExcelToLocalMachine(users);
        }

        public boolean existsByEmail(String email) {
                return getAllUsers().stream()
                                .anyMatch(user -> email != null && email.equalsIgnoreCase(user.getEmail()));
        }

        public boolean existsByMobile(String mobile) {
                return getAllUsers().stream().anyMatch(user -> mobile != null && mobile.equals(user.getMobile()));
        }

        public boolean existsByAadhaar(String aadhaar) {
                return getAllUsers().stream().anyMatch(user -> aadhaar != null && aadhaar.equals(user.getAadhaar()));
        }

        public boolean existsByUsername(String username) {
                return getAllUsers().stream()
                                .anyMatch(user -> username != null && username.equalsIgnoreCase(user.getUsername()));
        }

        public User findByUsernameOrEmail(String username, String email) {
                return getAllUsers().stream()
                                .filter(user -> (username != null && username.equalsIgnoreCase(user.getUsername()))
                                                || (email != null && email.equalsIgnoreCase(user.getEmail())))
                                .findFirst()
                                .orElse(null);
        }

        public User findByUsername(String username) {
                return getAllUsers().stream()
                                .filter(user -> username != null && username.equalsIgnoreCase(user.getUsername()))
                                .findFirst()
                                .orElse(null);
        }

        public User findByEmail(String email) {
                return getAllUsers().stream()
                                .filter(user -> email != null && email.equalsIgnoreCase(user.getEmail()))
                                .findFirst()
                                .orElse(null);
        }

        public User findByMobile(String mobile) {
                return getAllUsers().stream()
                                .filter(user -> mobile != null && mobile.equals(user.getMobile()))
                                .findFirst()
                                .orElse(null);
        }

        public long countUsers() {
                return getAllUsers().size();
        }

        public List<User> findByRole(String role) {
                return getAllUsers().stream()
                                .filter(user -> role != null && role.equalsIgnoreCase(user.getRole()))
                                .toList();
        }

        public ByteArrayInputStream exportUsersToExcel() {
                List<User> users = getAllUsers();
                try (XSSFWorkbook workbook = new XSSFWorkbook()) {
                        Sheet sheet = workbook.createSheet("Users");
                        CellStyle headerStyle = workbook.createCellStyle();
                        headerStyle.setFillForegroundColor(IndexedColors.ROYAL_BLUE.getIndex());
                        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
                        Font headerFont = workbook.createFont();
                        headerFont.setBold(true);
                        headerFont.setColor(IndexedColors.WHITE.getIndex());
                        headerStyle.setFont(headerFont);

                        Row headerRow = sheet.createRow(0);
                        for (int i = 0; i < HEADERS.length; i++) {
                                Cell cell = headerRow.createCell(i);
                                cell.setCellValue(HEADERS[i]);
                                cell.setCellStyle(headerStyle);
                                sheet.setColumnWidth(i, 20 * 256);
                        }

                        CellStyle dataStyle = workbook.createCellStyle();
                        dataStyle.setBorderBottom(BorderStyle.THIN);
                        dataStyle.setBorderTop(BorderStyle.THIN);
                        dataStyle.setBorderLeft(BorderStyle.THIN);
                        dataStyle.setBorderRight(BorderStyle.THIN);

                        int rowNum = 1;
                        for (User user : users) {
                                Row row = sheet.createRow(rowNum++);
                                createCell(row, 0, user.getFirstName(), dataStyle);
                                createCell(row, 1, user.getLastName(), dataStyle);
                                createCell(row, 2, user.getMobile(), dataStyle);
                                createCell(row, 3, user.getEmail(), dataStyle);
                                createCell(row, 4, user.getRole(), dataStyle);
                                createCell(row, 5, user.getUsername(), dataStyle);
                                createCell(row, 6, user.getStreet1(), dataStyle);
                                createCell(row, 7, user.getCity(), dataStyle);
                                createCell(row, 8, user.getState(), dataStyle);
                                createCell(row, 9, user.getPostalCode(), dataStyle);
                                createCell(row, 10, user.getAadhaar(), dataStyle);
                                createCell(row, 11,
                                                user.getDateOfBirth() != null ? user.getDateOfBirth().toString() : "-",
                                                dataStyle);
                                createCell(row, 12, user.getVedham(), dataStyle);
                                createCell(row, 13, user.getShaka(), dataStyle);
                                createCell(row, 14, user.getGothram(), dataStyle);
                                createCell(row, 15, user.getSoothram(), dataStyle);
                                createCell(row, 16, user.getPatasalai(), dataStyle);
                                createCell(row, 17, user.getAdhyapakarName(), dataStyle);
                                createCell(row, 18, user.getCertifiedIn(), dataStyle);
                                createCell(row, 19, user.getYearOfCertification(), dataStyle);
                                createCell(row, 20, user.getCreatedAt() != null ? user.getCreatedAt().toString() : "-",
                                                dataStyle);
                                createCell(row, 21, user.getPassword(), dataStyle);
                        }

                        ByteArrayOutputStream out = new ByteArrayOutputStream();
                        workbook.write(out);
                        log.info("📥 Excel exported for download — {} users", users.size());
                        return new ByteArrayInputStream(out.toByteArray());
                } catch (IOException e) {
                        throw new RuntimeException("Failed to export Excel: " + e.getMessage());
                }
        }

        public ByteArrayInputStream exportUsersByRole(String role) {
                List<User> users = findByRole(role);
                try (XSSFWorkbook workbook = new XSSFWorkbook()) {
                        Sheet sheet = workbook.createSheet(role.toUpperCase() + "S");
                        CellStyle headerStyle = workbook.createCellStyle();
                        headerStyle.setFillForegroundColor(IndexedColors.GREEN.getIndex());
                        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
                        Font headerFont = workbook.createFont();
                        headerFont.setBold(true);
                        headerFont.setColor(IndexedColors.WHITE.getIndex());
                        headerStyle.setFont(headerFont);

                        Row headerRow = sheet.createRow(0);
                        for (int i = 0; i < HEADERS.length; i++) {
                                Cell cell = headerRow.createCell(i);
                                cell.setCellValue(HEADERS[i]);
                                cell.setCellStyle(headerStyle);
                                sheet.setColumnWidth(i, 20 * 256);
                        }

                        CellStyle dataStyle = workbook.createCellStyle();
                        dataStyle.setBorderBottom(BorderStyle.THIN);
                        dataStyle.setBorderTop(BorderStyle.THIN);
                        dataStyle.setBorderLeft(BorderStyle.THIN);
                        dataStyle.setBorderRight(BorderStyle.THIN);

                        int rowNum = 1;
                        for (User user : users) {
                                Row row = sheet.createRow(rowNum++);
                                createCell(row, 0, user.getFirstName(), dataStyle);
                                createCell(row, 1, user.getLastName(), dataStyle);
                                createCell(row, 2, user.getMobile(), dataStyle);
                                createCell(row, 3, user.getEmail(), dataStyle);
                                createCell(row, 4, user.getRole(), dataStyle);
                                createCell(row, 5, user.getUsername(), dataStyle);
                                createCell(row, 6, user.getStreet1(), dataStyle);
                                createCell(row, 7, user.getCity(), dataStyle);
                                createCell(row, 8, user.getState(), dataStyle);
                                createCell(row, 9, user.getPostalCode(), dataStyle);
                                createCell(row, 10, user.getAadhaar(), dataStyle);
                                createCell(row, 11,
                                                user.getDateOfBirth() != null ? user.getDateOfBirth().toString() : "-",
                                                dataStyle);
                                createCell(row, 12, user.getVedham(), dataStyle);
                                createCell(row, 13, user.getShaka(), dataStyle);
                                createCell(row, 14, user.getGothram(), dataStyle);
                                createCell(row, 15, user.getSoothram(), dataStyle);
                                createCell(row, 16, user.getPatasalai(), dataStyle);
                                createCell(row, 17, user.getAdhyapakarName(), dataStyle);
                                createCell(row, 18, user.getCertifiedIn(), dataStyle);
                                createCell(row, 19, user.getYearOfCertification(), dataStyle);
                                createCell(row, 20, user.getCreatedAt() != null ? user.getCreatedAt().toString() : "-",
                                                dataStyle);
                                createCell(row, 21, user.getPassword(), dataStyle);
                        }

                        ByteArrayOutputStream out = new ByteArrayOutputStream();
                        workbook.write(out);
                        return new ByteArrayInputStream(out.toByteArray());
                } catch (IOException e) {
                        throw new RuntimeException("Failed to export Excel: " + e.getMessage());
                }
        }

        private boolean isAdminRole(User user) {
                return user != null && "admin".equalsIgnoreCase(user.getRole());
        }

        private boolean isNormalRole(User user) {
                return user != null && !isAdminRole(user);
        }

        private void createCell(Row row, int index, String value, CellStyle style) {
                Cell cell = row.createCell(index);
                cell.setCellStyle(style);
                cell.setCellValue(value != null ? value : "-");
        }

        private User mapRowToUser(Row row) {
                User user = new User();
                user.setFirstName(getCellValue(row.getCell(0)));
                user.setLastName(getCellValue(row.getCell(1)));
                user.setMobile(getCellValue(row.getCell(2)));
                user.setEmail(getCellValue(row.getCell(3)));
                user.setRole(getCellValue(row.getCell(4)));
                user.setUsername(getCellValue(row.getCell(5)));
                user.setStreet1(getCellValue(row.getCell(6)));
                user.setCity(getCellValue(row.getCell(7)));
                user.setState(getCellValue(row.getCell(8)));
                user.setPostalCode(getCellValue(row.getCell(9)));
                user.setAadhaar(getCellValue(row.getCell(10)));
                user.setDateOfBirth(parseDate(getCellValue(row.getCell(11))));
                user.setVedham(getCellValue(row.getCell(12)));
                user.setShaka(getCellValue(row.getCell(13)));
                user.setGothram(getCellValue(row.getCell(14)));
                user.setSoothram(getCellValue(row.getCell(15)));
                user.setPatasalai(getCellValue(row.getCell(16)));
                user.setAdhyapakarName(getCellValue(row.getCell(17)));
                user.setCertifiedIn(getCellValue(row.getCell(18)));
                user.setYearOfCertification(getCellValue(row.getCell(19)));
                user.setCreatedAt(parseDateTime(getCellValue(row.getCell(20))));
                user.setPassword(getCellValue(row.getCell(21)));
                user.setUpdatedAt(user.getCreatedAt());

                if (user.getEmail() == null || user.getEmail().isBlank()) {
                        return null;
                }
                return user;
        }

        private String getCellValue(Cell cell) {
                if (cell == null) {
                        return null;
                }
                return switch (cell.getCellType()) {
                        case STRING -> cell.getStringCellValue();
                        case NUMERIC -> Double.toString(cell.getNumericCellValue());
                        case BOOLEAN -> Boolean.toString(cell.getBooleanCellValue());
                        case FORMULA -> cell.getCellFormula();
                        default -> "";
                };
        }

        private LocalDate parseDate(String value) {
                if (value == null || value.isBlank() || "-".equals(value)) {
                        return null;
                }
                try {
                        return LocalDate.parse(value);
                } catch (Exception ignored) {
                        return null;
                }
        }

        private LocalDateTime parseDateTime(String value) {
                if (value == null || value.isBlank() || "-".equals(value)) {
                        return null;
                }
                try {
                        return LocalDateTime.parse(value);
                } catch (Exception ignored) {
                        return null;
                }
        }
}
