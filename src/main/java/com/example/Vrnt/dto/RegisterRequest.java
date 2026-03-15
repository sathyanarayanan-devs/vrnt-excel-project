package com.example.Vrnt.dto;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data
public class RegisterRequest {

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "student|teacher", message = "Role must be 'student' or 'teacher'")
    private String role;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
    private String username;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String emailAddress;

    @NotBlank(message = "Gender is required")
    @Pattern(regexp = "male|female|other", message = "Invalid gender")
    private String gender;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;
}