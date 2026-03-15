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

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;

@Slf4j
@Service

@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil        jwtUtil;
    private final ExcelService   excelService; // ✅ injected for local Excel save

    // ── REGISTER ──────────────────────────────────────────
    public RegisterResponse register(RegisterRequest request) {

        // 1. Password match check
        if (!request.getPassword()
                    .equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException(
                    "Passwords do not match");
        }

        // 2. Duplicate checks
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException(
                    "Username '" + request.getUsername()
                    + "' is already taken");
        }
        if (userRepository.existsByEmail(request.getEmailAddress())) {
            throw new UserAlreadyExistsException(
                    "An account with email '"
                    + request.getEmailAddress()
                    + "' already exists");
        }

        // 3. Build and save to MySQL
        User user = User.builder()
                .role(request.getRole())
                .username(request.getUsername().toLowerCase())
                .fullName(request.getFullName())
                .email(request.getEmailAddress().toLowerCase())
                .gender(request.getGender())
                .department(request.getDepartment())
                .password(hashPassword(request.getPassword()))
                .build();

        User saved = userRepository.save(user);
        log.info("✅ User saved to MySQL: [{}] {}",
                saved.getRole(), saved.getUsername());

        // 4. ✅ Auto-save ALL users to Excel on local machine
        // Location: C:\Users\YourName\VRNT_Data\vrnt_users.xlsx
        excelService.saveExcelToLocalMachine();
        log.info("✅ Excel file updated on local machine");

        // 5. Return response without password
        return toResponse(saved);
    }

    // ── LOGIN ─────────────────────────────────────────────
    public LoginResponse login(LoginRequest request) {

        User user = userRepository
                .findByUsername(request.getUsername().toLowerCase())
                .orElseThrow(() -> new RuntimeException(
                        "Invalid username or password"));

        if (!user.getPassword()
                .equals(hashPassword(request.getPassword()))) {
            throw new RuntimeException(
                    "Invalid username or password");
        }

        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole()
        );

        log.info("User logged in: [{}] {}",
                user.getRole(), user.getUsername());

        return LoginResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole())
                .department(user.getDepartment())
                .token(token)
                .tokenType("Bearer")
                .build();
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

    // ── GET USER BY USERNAME ──────────────────────────────
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException(
                        "User not found: " + username));
    }

    // ── DELETE USER ───────────────────────────────────────
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException(
                    "User not found with id: " + id);
        }
        userRepository.deleteById(id);
        log.info("User deleted with id: {}", id);

        // ✅ Update Excel after delete too
        excelService.saveExcelToLocalMachine();
    }

    // ── HELPERS ───────────────────────────────────────────
    private RegisterResponse toResponse(User user) {
        return RegisterResponse.builder()
                .id(user.getId())
                .role(user.getRole())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .gender(user.getGender())
                .department(user.getDepartment())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private String hashPassword(String password) {
        try {
            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(
                    password.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(
                    "Failed to hash password", e);
        }
    }
}
