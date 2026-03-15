package com.example.Vrnt.Controller;

import com.example.Vrnt.service.ExcelService;
import com.example.Vrnt.service.UserService;
import com.example.Vrnt.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/api/admin/excel")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ExcelController {

    private final ExcelService excelService;
    private final UserService  userService;

    // ── TEACHER CHECK ─────────────────────────────────────
    private void validateTeacher(String username) {
        User user = userService.getUserByUsername(username);
        if (!user.getRole().equalsIgnoreCase("teacher")) {
            throw new RuntimeException(
                    "Access Denied — Teachers only");
        }
    }

    // ── EXPORT ALL USERS ──────────────────────────────────
    // GET /api/admin/excel/export/all?username=teacherUsername
    @GetMapping("/export/all")
    public ResponseEntity<InputStreamResource> exportAll(
            @RequestParam String username) {

        validateTeacher(username);

        ByteArrayInputStream stream =
                excelService.exportUsersToExcel();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition",
                "attachment; filename=all_users.xlsx");
        // ✅ Allow browser to read Content-Disposition header
        headers.add("Access-Control-Expose-Headers",
                "Content-Disposition");

        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(headers)
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-" +
                        "officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(stream));
    }

    // ── EXPORT STUDENTS ONLY ──────────────────────────────
    // GET /api/admin/excel/export/students?username=teacherUsername
    @GetMapping("/export/students")
    public ResponseEntity<InputStreamResource> exportStudents(
            @RequestParam String username) {

        validateTeacher(username);

        ByteArrayInputStream stream =
                excelService.exportUsersByRole("student");

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition",
                "attachment; filename=students.xlsx");
        headers.add("Access-Control-Expose-Headers",
                "Content-Disposition");

        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(headers)
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-" +
                        "officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(stream));
    }

    // ── EXPORT TEACHERS ONLY ──────────────────────────────
    // GET /api/admin/excel/export/teachers?username=teacherUsername
    @GetMapping("/export/teachers")
    public ResponseEntity<InputStreamResource> exportTeachers(
            @RequestParam String username) {

        validateTeacher(username);

        ByteArrayInputStream stream =
                excelService.exportUsersByRole("teacher");

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition",
                "attachment; filename=teachers.xlsx");
        headers.add("Access-Control-Expose-Headers",
                "Content-Disposition");

        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(headers)
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-" +
                        "officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(stream));
    }
}
