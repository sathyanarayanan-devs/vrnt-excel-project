package com.example.Vrnt.Controller;

import com.example.Vrnt.dto.ApiResponse;
import com.example.Vrnt.dto.RegisterRequest;
import com.example.Vrnt.dto.RegisterResponse;
import com.example.Vrnt.service.UserService;
import com.example.Vrnt.model.User;
import java.util.List;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.Vrnt.dto.LoginRequest;
import com.example.Vrnt.dto.LoginResponse;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")   // allow requests from your HTML front-end
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * POST /api/auth/register
     * Body: JSON matching RegisterRequest
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponse>> register(
            @Valid @RequestBody RegisterRequest request) {

        RegisterResponse response = userService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Registration successful! Welcome, " + response.getFullName(), response)) ;
    }
    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(
                ApiResponse.ok(
                        "Login successful! Welcome back, "
                                + response.getFullName(), response));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@RequestParam String username) {
        User requestingUser = userService.getUserByUsername(username);

        if(!requestingUser.getRole().equalsIgnoreCase("teacher")){
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.fail("Access Denied - Teachers only"));
        }

        List<User> users = userService.getAllUsers();
        users.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(users);
    }
}