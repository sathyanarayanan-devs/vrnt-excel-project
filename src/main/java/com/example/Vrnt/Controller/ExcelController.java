package com.example.Vrnt.Controller;

import com.example.Vrnt.model.User;
import com.example.Vrnt.security.JwtUtil;
import com.example.Vrnt.service.ExcelService;
import com.example.Vrnt.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.InputStream;

@RestController
@RequestMapping("/api/admin/excel")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ExcelController {

        private final ExcelService excelService;
        private final UserService userService;
        private final JwtUtil jwtUtil;

        private void validateAdmin(String username,
                        @RequestHeader(name = "Authorization", required = false) String authorizationHeader) {
                String resolvedUsername = username;

                if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                        String token = authorizationHeader.trim();
                        if (!jwtUtil.validateToken(token)) {
                                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired token");
                        }

                        String tokenRole = jwtUtil.extractRole(token);
                        if (!"admin".equalsIgnoreCase(tokenRole)) {
                                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied — Admins only");
                        }

                        if (resolvedUsername == null || resolvedUsername.isBlank()) {
                                resolvedUsername = jwtUtil.extractUsername(token);
                        }
                }

                if ((resolvedUsername == null || resolvedUsername.isBlank())
                                && (authorizationHeader == null || !authorizationHeader.startsWith("Bearer "))) {
                        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing or invalid admin identity");
                }

                if (resolvedUsername != null && !resolvedUsername.isBlank()) {
                        User user = resolveUser(resolvedUsername);
                        if (user != null && !"admin".equalsIgnoreCase(user.getRole())) {
                                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied — Admins only");
                        }
                }
        }

        private User resolveUser(String value) {
                if (value == null || value.isBlank()) {
                        return null;
                }

                try {
                        return userService.getUserByUsername(value);
                } catch (RuntimeException ignored) {
                        try {
                                return userService.getUserByEmail(value);
                        } catch (RuntimeException ignoredAgain) {
                                return null;
                        }
                }
        }

        @GetMapping("/export/all")
        public ResponseEntity<InputStreamResource> exportAll(
                        @RequestParam(required = false) String username,
                        @RequestHeader(name = "Authorization", required = false) String authorizationHeader) {

                validateAdmin(username, authorizationHeader);

                InputStream stream = excelService.exportUsersToExcel();
                InputStreamResource resource = new InputStreamResource(
                                stream != null ? stream : new java.io.ByteArrayInputStream(new byte[0]));

                HttpHeaders headers = new HttpHeaders();
                headers.add("Content-Disposition", "attachment; filename=all_users.xlsx");
                headers.add("Access-Control-Expose-Headers", "Content-Disposition");

                return ResponseEntity
                                .status(HttpStatus.OK)
                                .headers(headers)
                                .contentType(MediaType.parseMediaType(
                                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                                .body(resource);
        }

        @GetMapping("/export/normals")
        public ResponseEntity<InputStreamResource> exportNormals(
                        @RequestParam(required = false) String username,
                        @RequestHeader(name = "Authorization", required = false) String authorizationHeader) {

                validateAdmin(username, authorizationHeader);

                InputStream stream = excelService.exportUsersByRole("normal");
                InputStreamResource resource = new InputStreamResource(
                                stream != null ? stream : new java.io.ByteArrayInputStream(new byte[0]));

                HttpHeaders headers = new HttpHeaders();
                headers.add("Content-Disposition", "attachment; filename=normal_users.xlsx");
                headers.add("Access-Control-Expose-Headers", "Content-Disposition");

                return ResponseEntity
                                .status(HttpStatus.OK)
                                .headers(headers)
                                .contentType(MediaType.parseMediaType(
                                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                                .body(resource);
        }

        @GetMapping("/export/admins")
        public ResponseEntity<InputStreamResource> exportAdmins(
                        @RequestParam(required = false) String username,
                        @RequestHeader(name = "Authorization", required = false) String authorizationHeader) {

                validateAdmin(username, authorizationHeader);

                InputStream stream = excelService.exportUsersByRole("admin");
                InputStreamResource resource = new InputStreamResource(
                                stream != null ? stream : new java.io.ByteArrayInputStream(new byte[0]));

                HttpHeaders headers = new HttpHeaders();
                headers.add("Content-Disposition", "attachment; filename=admin_users.xlsx");
                headers.add("Access-Control-Expose-Headers", "Content-Disposition");

                return ResponseEntity
                                .status(HttpStatus.OK)
                                .headers(headers)
                                .contentType(MediaType.parseMediaType(
                                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                                .body(resource);
        }
}
