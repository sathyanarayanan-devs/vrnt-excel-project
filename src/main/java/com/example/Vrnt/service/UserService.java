package com.example.Vrnt.service;

import com.example.Vrnt.dto.LoginRequest;
import com.example.Vrnt.dto.LoginResponse;
import com.example.Vrnt.dto.RegisterRequest;
import com.example.Vrnt.dto.RegisterResponse;
import com.example.Vrnt.exception.UserAlreadyExistsException;
import com.example.Vrnt.model.User;
import com.example.Vrnt.Repository.UserRepository;
import com.example.Vrnt.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ExcelService excelService;
    private final JwtUtil jwtUtil;

    private static final String UPLOAD_DIR = "uploads/";
    private static final String NORMAL_ROLE = "normal";
    private static final String ADMIN_ROLE = "admin";
    private static final String ADMIN_EMAIL_DOMAIN = "@vrnt.org";

    // ── REGISTER WITH FILES ──────────────────────────────────────────
    public RegisterResponse register(RegisterRequest request) throws IOException {

        // Get files from request
        MultipartFile certFile = request.getCertFile();
        MultipartFile photoFile = request.getPhotoFile();

        // 1. Duplicate checks
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException(
                    "An account with email '" + request.getEmail() + "' already exists");
        }
        if (userRepository.existsByMobile(request.getMobile())) {
            throw new UserAlreadyExistsException(
                    "Mobile number '" + request.getMobile() + "' is already registered");
        }
        if (userRepository.existsByAadhaar(request.getAadhaar())) {
            throw new UserAlreadyExistsException(
                    "Aadhaar number '" + request.getAadhaar() + "' is already registered");
        }

        // 2. Save files
        String certPath = certFile != null && !certFile.isEmpty() ? saveFile(certFile) : null;
        String photoPath = photoFile != null && !photoFile.isEmpty() ? saveFile(photoFile) : null;

        // 3. Build and save to MySQL
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .mobile(request.getMobile())
                .email(request.getEmail().toLowerCase())
                .password(request.getPassword())
                .street1(request.getStreet1())
                .street2(request.getStreet2())
                .city(request.getCity())
                .state(request.getState())
                .postalCode(request.getPostalCode())
                .aadhaar(request.getAadhaar())
                .dateOfBirth(request.getDateOfBirth())
                .vedham(request.getVedham())
                .shaka(request.getShaka())
                .gothram(request.getGothram())
                .soothram(request.getSoothram())
                .patasalai(request.getPatasalai())
                .adhyapakarName(request.getAdhyapakarName())
                .certifiedIn(request.getCertifiedIn())
                .yearOfCertification(request.getYearOfCertification())
                .certificatePath(certPath)
                .photoPath(photoPath)
                .status("PENDING")
                .build();

        if (request.getEmail() != null) {
            String username = request.getEmail().contains("@")
                    ? request.getEmail().substring(0, request.getEmail().indexOf('@'))
                    : request.getEmail();
            if (!userRepository.existsByUsername(username)) {
                user.setUsername(username);
            } else {
                user.setUsername(username + UUID.randomUUID().toString().substring(0, 6));
            }
        }

        user.setRole(determineRole(user.getEmail()));

        User saved = userRepository.save(user);
        log.info("✅ User saved to MySQL: [{}] {} {}",
                saved.getFirstName(), saved.getLastName(), saved.getEmail());

        // 4. Auto-save ALL users to Excel on local machine
        excelService.saveExcelToLocalMachine();
        log.info("✅ Excel file updated on local machine");

        // 5. Return response without sensitive data
        return toResponse(saved);
    }

    public LoginResponse login(LoginRequest request) {
        String usernameOrEmail = request.getUsername().trim();

        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Invalid username or password"));

        if (user.getPassword() == null || !user.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        return LoginResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole())
                .department(user.getDepartment())
                .token(jwtUtil.generateToken(user.getUsername(), user.getRole()))
                .tokenType("Bearer")
                .build();
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException(
                        "User not found with username: " + username));
    }

    public RegisterResponse getUserDetails(String usernameOrEmail) {
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new RuntimeException(
                        "User not found with identifier: " + usernameOrEmail));
        return toResponse(user);
    }

    public long countUsers() {
        return userRepository.count();
    }

    // ── ROLE DECISION HELPERS ─────────────────────────────
    private String determineRole(String email) {
        if (email == null) {
            return NORMAL_ROLE;
        }
        return email.toLowerCase().endsWith(ADMIN_EMAIL_DOMAIN)
                ? ADMIN_ROLE
                : NORMAL_ROLE;
    }

    // ── GET ALL USERS ─────────────────────────────────────
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getUsers(String role, String query) {
        return getUsers(role, query, Map.of());
    }

    public List<User> getUsers(String role, String query, Map<String, String> filters) {
        List<User> users = getAllUsers();
        if (filters == null) {
            filters = Map.of();
        }

        boolean hasRole = role != null && !role.isBlank();
        boolean hasQuery = query != null && !query.isBlank();

        if (hasRole) {
            users = users.stream()
                    .filter(user -> user.getRole() != null && user.getRole().equalsIgnoreCase(role))
                    .toList();
        }

        if (hasQuery) {
            users = users.stream()
                    .filter(user -> matchesKeyword(user, query))
                    .toList();
        }

        for (Map.Entry<String, String> entry : filters.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            if (value == null || value.isBlank()) {
                continue;
            }
            users = users.stream()
                    .filter(user -> matchesFilter(user, key, value))
                    .toList();
        }

        return users;
    }

    // ── GET USER BY ID ────────────────────────────────────
    public User getUserById(Long id) {
        if (id == null) {
            throw new RuntimeException("User id cannot be null");
        }
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "User not found with id: " + id));
    }

    // ── GET USER BY EMAIL ─────────────────────────────────
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(
                        "User not found with email: " + email));
    }

    // ── GET USER BY MOBILE ────────────────────────────────
    public User getUserByMobile(String mobile) {
        return userRepository.findByMobile(mobile)
                .orElseThrow(() -> new RuntimeException(
                        "User not found with mobile: " + mobile));
    }

    // ── GET USERS BY STATUS ───────────────────────────────
    public List<User> getUsersByStatus(String status) {
        return userRepository.findByStatus(status);
    }

    // ── UPDATE USER STATUS ────────────────────────────────
    public User updateUserStatus(Long id, String status) {
        User user = getUserById(id);
        user.setStatus(status);
        user.setUpdatedAt(LocalDateTime.now());
        User updated = userRepository.save(user);

        // Update Excel after status change
        excelService.saveExcelToLocalMachine();
        log.info("User status updated: {} -> {}", user.getEmail(), status);

        return updated;
    }

    // ── UPDATE USER DETAILS ───────────────────────────────
    public RegisterResponse updateUser(Long id, RegisterRequest request) throws IOException {

        User existingUser = getUserById(id);

        // Update fields
        existingUser.setFirstName(request.getFirstName());
        existingUser.setLastName(request.getLastName());
        existingUser.setMobile(request.getMobile());
        existingUser.setEmail(request.getEmail().toLowerCase());
        existingUser.setStreet1(request.getStreet1());
        existingUser.setStreet2(request.getStreet2());
        existingUser.setCity(request.getCity());
        existingUser.setState(request.getState());
        existingUser.setPostalCode(request.getPostalCode());
        existingUser.setAadhaar(request.getAadhaar());
        existingUser.setDateOfBirth(request.getDateOfBirth());
        existingUser.setVedham(request.getVedham());
        existingUser.setShaka(request.getShaka());
        existingUser.setGothram(request.getGothram());
        existingUser.setSoothram(request.getSoothram());
        existingUser.setPatasalai(request.getPatasalai());
        existingUser.setAdhyapakarName(request.getAdhyapakarName());
        existingUser.setCertifiedIn(request.getCertifiedIn());
        existingUser.setYearOfCertification(request.getYearOfCertification());

        // Update files if new ones are provided
        if (request.getCertFile() != null && !request.getCertFile().isEmpty()) {
            deleteFile(existingUser.getCertificatePath());
            existingUser.setCertificatePath(saveFile(request.getCertFile()));
        }

        if (request.getPhotoFile() != null && !request.getPhotoFile().isEmpty()) {
            deleteFile(existingUser.getPhotoPath());
            existingUser.setPhotoPath(saveFile(request.getPhotoFile()));
        }

        existingUser.setUpdatedAt(LocalDateTime.now());

        User updated = userRepository.save(existingUser);

        // Update Excel
        excelService.saveExcelToLocalMachine();
        log.info("User updated: {}", updated.getEmail());

        return toResponse(updated);
    }

    // ── DELETE USER ───────────────────────────────────────
    public void deleteUser(Long id) {
        if (id == null) {
            throw new RuntimeException("User id cannot be null");
        }
        User user = getUserById(id);

        // Delete associated files
        deleteFile(user.getCertificatePath());
        deleteFile(user.getPhotoPath());

        userRepository.deleteById(id);
        log.info("User deleted with id: {}", id);

        // Update Excel after delete
        excelService.saveExcelToLocalMachine();
    }

    // ── SEARCH USERS ──────────────────────────────────────
    public List<User> searchUsers(String keyword) {
        return userRepository
                .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrMobileContainingOrUsernameContainingIgnoreCase(
                        keyword, keyword, keyword, keyword, keyword);
    }

    private boolean matchesKeyword(User user, String keyword) {
        String normalized = keyword.trim().toLowerCase();
        return contains(user.getFirstName(), normalized)
                || contains(user.getLastName(), normalized)
                || contains(user.getEmail(), normalized)
                || contains(user.getMobile(), normalized)
                || contains(user.getUsername(), normalized)
                || contains(user.getAadhaar(), normalized)
                || contains(user.getState(), normalized)
                || contains(user.getCity(), normalized)
                || contains(user.getVedham(), normalized)
                || contains(user.getGothram(), normalized)
                || contains(user.getPatasalai(), normalized)
                || contains(user.getAdhyapakarName(), normalized)
                || contains(user.getCertifiedIn(), normalized);
    }

    private boolean matchesFilter(User user, String key, String value) {
        String expected = value.trim().toLowerCase();
        return switch (key) {
            case "firstName" -> contains(user.getFirstName(), expected);
            case "lastName" -> contains(user.getLastName(), expected);
            case "mobile" -> contains(user.getMobile(), expected);
            case "email" -> contains(user.getEmail(), expected);
            case "street1" -> contains(user.getStreet1(), expected);
            case "street2" -> contains(user.getStreet2(), expected);
            case "city" -> contains(user.getCity(), expected);
            case "state" -> contains(user.getState(), expected);
            case "postalCode" -> contains(user.getPostalCode(), expected);
            case "aadhaar" -> contains(user.getAadhaar(), expected);
            case "dateOfBirth" -> {
                try {
                    LocalDate requestedDate = LocalDate.parse(value.trim());
                    yield user.getDateOfBirth() != null && user.getDateOfBirth().equals(requestedDate);
                } catch (Exception ex) {
                    yield false;
                }
            }
            case "vedham" -> contains(user.getVedham(), expected);
            case "shaka" -> contains(user.getShaka(), expected);
            case "gothram" -> contains(user.getGothram(), expected);
            case "soothram" -> contains(user.getSoothram(), expected);
            case "patasalai" -> contains(user.getPatasalai(), expected);
            case "adhyapakarName" -> contains(user.getAdhyapakarName(), expected);
            case "certifiedIn" -> contains(user.getCertifiedIn(), expected);
            case "yearOfCertification" -> contains(user.getYearOfCertification(), expected);
            default -> true;
        };
    }

    private boolean contains(String value, String expected) {
        return value != null && value.toLowerCase().contains(expected);
    }

    // ── GET USERS BY DATE RANGE ───────────────────────────
    public List<User> getUsersByDateRange(LocalDateTime start, LocalDateTime end) {
        return userRepository.findByCreatedAtBetween(start, end);
    }

    // ── HELPERS ───────────────────────────────────────────
    private RegisterResponse toResponse(User user) {
        return RegisterResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .mobile(user.getMobile())
                .email(user.getEmail())
                .aadhaar(user.getAadhaar())
                .dateOfBirth(user.getDateOfBirth())
                .city(user.getCity())
                .state(user.getState())
                .postalCode(user.getPostalCode())
                .street1(user.getStreet1())
                .street2(user.getStreet2())
                .vedham(user.getVedham())
                .shaka(user.getShaka())
                .gothram(user.getGothram())
                .soothram(user.getSoothram())
                .patasalai(user.getPatasalai())
                .adhyapakarName(user.getAdhyapakarName())
                .certifiedIn(user.getCertifiedIn())
                .yearOfCertification(user.getYearOfCertification())
                .role(user.getRole())
                .department(user.getDepartment())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .certificatePath(user.getCertificatePath())
                .photoPath(user.getPhotoPath())
                .build();
    }

    private String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String fileName = UUID.randomUUID().toString() + "_" +
                System.currentTimeMillis() + "_" +
                file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);

        // Save file
        Files.copy(file.getInputStream(), filePath);

        return filePath.toString();
    }

    private void deleteFile(String filePath) {
        if (filePath != null) {
            try {
                Path path = Paths.get(filePath);
                Files.deleteIfExists(path);
            } catch (IOException e) {
                log.warn("Failed to delete file: {}", filePath, e);
            }
        }
    }
}