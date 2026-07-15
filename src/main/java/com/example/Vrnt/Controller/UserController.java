package com.example.Vrnt.Controller;

import com.example.Vrnt.dto.ApiResponse;
import com.example.Vrnt.dto.LoginRequest;
import com.example.Vrnt.dto.LoginResponse;
import com.example.Vrnt.dto.RegisterRequest;
import com.example.Vrnt.dto.RegisterResponse;
import com.example.Vrnt.model.User;
import com.example.Vrnt.security.JwtUtil;
import com.example.Vrnt.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // allow requests from your HTML front-end
@RequiredArgsConstructor
public class UserController {

        private final UserService userService;
        private final JwtUtil jwtUtil;

        /**
         * POST /api/auth/register
         * Accepts multipart/form-data with file uploads
         */
        @PostMapping(value = "/register", consumes = { "multipart/form-data" })
        public ResponseEntity<ApiResponse<RegisterResponse>> register(
                        @Valid @ModelAttribute RegisterRequest request,
                        @RequestParam(name = "certFile", required = false) MultipartFile certFile,
                        @RequestParam(name = "photoFile", required = false) MultipartFile photoFile)
                        throws IOException {

                // Attach files to request
                request.setCertFile(certFile);
                request.setPhotoFile(photoFile);

                log.info("Registration request received for email: {}", request.getEmail());

                RegisterResponse response = userService.register(request);

                return ResponseEntity
                                .status(HttpStatus.CREATED)
                                .body(ApiResponse.ok("Registration successful! Welcome, " + response.getFullName(),
                                                response));
        }

        // POST /api/auth/login
        @PostMapping("/login")
        public ResponseEntity<ApiResponse<LoginResponse>> login(
                        @Valid @RequestBody LoginRequest request,
                        HttpServletRequest servletRequest) {

                try {
                        LoginResponse response = userService.login(request);
                        HttpSession session = servletRequest.getSession(true);
                        session.setAttribute("loggedInUser", response.getUsername());
                        session.setAttribute("userRole", response.getRole());
                        return ResponseEntity.ok(
                                        ApiResponse.ok(
                                                        "Login successful! Welcome back, "
                                                                        + response.getFullName(),
                                                        response));
                } catch (IllegalArgumentException ex) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body(ApiResponse.fail(ex.getMessage()));
                }
        }

        @PostMapping("/logout")
        public ResponseEntity<ApiResponse<String>> logout(HttpServletRequest servletRequest) {
                HttpSession session = servletRequest.getSession(false);
                if (session != null) {
                        session.invalidate();
                }
                return ResponseEntity.ok(ApiResponse.ok("Logged out successfully", "OK"));
        }

        @GetMapping("/user-details")
        public ResponseEntity<ApiResponse<RegisterResponse>> getUserDetails(
                        @RequestHeader(name = "Authorization", required = false) String authorizationHeader) {

                if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body(ApiResponse.fail("Missing or invalid authorization header"));
                }

                if (!jwtUtil.validateToken(authorizationHeader)) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body(ApiResponse.fail("Invalid or expired token"));
                }

                String username = jwtUtil.extractUsername(authorizationHeader);
                try {
                        RegisterResponse userDetails = userService.getUserDetails(username);
                        return ResponseEntity.ok(ApiResponse.ok("User details loaded", userDetails));
                } catch (RuntimeException ex) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                        .body(ApiResponse.fail("User profile not found"));
                }
        }

        @GetMapping("/users/count")
        public ResponseEntity<ApiResponse<Map<String, Long>>> getUserCount(
                        @RequestHeader(name = "Authorization", required = false) String authorizationHeader) {

                if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body(ApiResponse.fail("Missing or invalid authorization header"));
                }

                if (!jwtUtil.validateToken(authorizationHeader)) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body(ApiResponse.fail("Invalid or expired token"));
                }

                String tokenUsername = jwtUtil.extractUsername(authorizationHeader);
                String tokenRole = jwtUtil.extractRole(authorizationHeader);

                if (!"admin".equalsIgnoreCase(tokenRole)) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                        .body(ApiResponse.fail("Access Denied - Admins only"));
                }

                User requestingUser = userService.getUserByUsername(tokenUsername);
                if (requestingUser == null || !"admin".equalsIgnoreCase(requestingUser.getRole())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                        .body(ApiResponse.fail("Access Denied - Admins only"));
                }

                return ResponseEntity
                                .ok(ApiResponse.ok("User count loaded", Map.of("count", userService.countUsers())));
        }

        @GetMapping("/users")
        public ResponseEntity<?> getAllUsers(
                        @RequestParam(required = false) String username,
                        @RequestParam(required = false) String role,
                        @RequestParam(required = false, name = "query") String query,
                        @RequestParam(required = false) String firstName,
                        @RequestParam(required = false) String lastName,
                        @RequestParam(required = false) String mobile,
                        @RequestParam(required = false) String email,
                        @RequestParam(required = false) String street1,
                        @RequestParam(required = false) String street2,
                        @RequestParam(required = false) String city,
                        @RequestParam(required = false) String state,
                        @RequestParam(required = false) String postalCode,
                        @RequestParam(required = false) String aadhaar,
                        @RequestParam(required = false) String dateOfBirth,
                        @RequestParam(required = false) String vedham,
                        @RequestParam(required = false) String shaka,
                        @RequestParam(required = false) String gothram,
                        @RequestParam(required = false) String soothram,
                        @RequestParam(required = false) String patasalai,
                        @RequestParam(required = false) String adhyapakarName,
                        @RequestParam(required = false) String certifiedIn,
                        @RequestParam(required = false) String yearOfCertification,
                        @RequestHeader(name = "Authorization", required = false) String authorizationHeader) {

                if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body(ApiResponse.fail("Missing or invalid authorization header"));
                }

                if (!jwtUtil.validateToken(authorizationHeader)) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body(ApiResponse.fail("Invalid or expired token"));
                }

                String tokenUsername = jwtUtil.extractUsername(authorizationHeader);
                String tokenRole = jwtUtil.extractRole(authorizationHeader);

                if (tokenUsername == null || tokenUsername.isBlank()) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body(ApiResponse.fail("Invalid token subject"));
                }

                if (!"admin".equalsIgnoreCase(tokenRole)) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                        .body(ApiResponse.fail("Access Denied - Admins only"));
                }

                User requestingUser = userService.getUserByUsername(tokenUsername);
                if (requestingUser == null || !"admin".equalsIgnoreCase(requestingUser.getRole())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                        .body(ApiResponse.fail("Access Denied - Admins only"));
                }

                Map<String, String> filters = new HashMap<>();
                putIfPresent(filters, "firstName", firstName);
                putIfPresent(filters, "lastName", lastName);
                putIfPresent(filters, "mobile", mobile);
                putIfPresent(filters, "email", email);
                putIfPresent(filters, "street1", street1);
                putIfPresent(filters, "street2", street2);
                putIfPresent(filters, "city", city);
                putIfPresent(filters, "state", state);
                putIfPresent(filters, "postalCode", postalCode);
                putIfPresent(filters, "aadhaar", aadhaar);
                putIfPresent(filters, "dateOfBirth", dateOfBirth);
                putIfPresent(filters, "vedham", vedham);
                putIfPresent(filters, "shaka", shaka);
                putIfPresent(filters, "gothram", gothram);
                putIfPresent(filters, "soothram", soothram);
                putIfPresent(filters, "patasalai", patasalai);
                putIfPresent(filters, "adhyapakarName", adhyapakarName);
                putIfPresent(filters, "certifiedIn", certifiedIn);
                putIfPresent(filters, "yearOfCertification", yearOfCertification);

                List<User> users = userService.getUsers(role, query, filters);
                users.forEach(u -> u.setPassword(null));
                return ResponseEntity.ok(users);
        }

        @GetMapping("/files/{filename:.+}")
        public ResponseEntity<Resource> downloadFile(@PathVariable String filename) throws IOException {
                Path filePath = Paths.get("uploads").resolve(filename).normalize();
                if (!Files.exists(filePath) || !Files.isRegularFile(filePath)) {
                        return ResponseEntity.notFound().build();
                }

                Resource resource = new FileSystemResource(filePath.toFile());
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                        contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
                }

                return ResponseEntity.ok()
                                .contentType(MediaType.parseMediaType(contentType))
                                .header(HttpHeaders.CONTENT_DISPOSITION,
                                                "attachment; filename=\"" + filePath.getFileName() + "\"")
                                .body(resource);
        }

        private void putIfPresent(Map<String, String> filters, String key, String value) {
                if (value != null && !value.isBlank()) {
                        filters.put(key, value.trim());
                }
        }
}