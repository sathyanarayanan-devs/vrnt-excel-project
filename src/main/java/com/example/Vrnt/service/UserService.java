package com.example.Vrnt.service;

import com.example.Vrnt.dto.RegisterRequest;
import com.example.Vrnt.dto.RegisterResponse;
import com.example.Vrnt.exception.UserAlreadyExistsException;
import com.example.Vrnt.model.User;
import com.example.Vrnt.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ExcelService excelService;

    private final String UPLOAD_DIR = "uploads/";

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

        User saved = userRepository.save(user);
        log.info("✅ User saved to MySQL: [{}] {} {}",
                saved.getFirstName(), saved.getLastName(), saved.getEmail());

        // 4. Auto-save ALL users to Excel on local machine
        excelService.saveExcelToLocalMachine();
        log.info("✅ Excel file updated on local machine");

        // 5. Return response without sensitive data
        return toResponse(saved);
    }

    // ── GET ALL USERS ─────────────────────────────────────
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ── GET USER BY ID ────────────────────────────────────
    public User getUserById(Long id) {
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
        return userRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrMobileContaining(
                keyword, keyword, keyword, keyword);
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
                .fullName(user.getFirstName() + " " + user.getLastName())
                .mobile(user.getMobile())
                .email(user.getEmail())
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