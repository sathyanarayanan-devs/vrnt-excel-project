package com.example.Vrnt.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
public class RegisterRequest {

    // Personal Details
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "First name should contain only letters and spaces")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Last name should contain only letters and spaces")
    private String lastName;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Mobile number must be a valid 10-digit Indian number starting with 6-9")
    private String mobile;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Size(max = 150, message = "Email must not exceed 150 characters")
    private String email;

    // Address Details
    @NotBlank(message = "Street address is required")
    @Size(max = 255, message = "Street address must not exceed 255 characters")
    private String street1;

    @Size(max = 255, message = "Street address line 2 must not exceed 255 characters")
    private String street2;

    @NotBlank(message = "City/Town is required")
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @NotBlank(message = "State is required")
    @Size(max = 100, message = "State must not exceed 100 characters")
    private String state;

    @NotBlank(message = "PIN code is required")
    @Pattern(regexp = "^[1-9][0-9]{5}$", message = "PIN code must be a valid 6-digit Indian postal code")
    private String postalCode;

    // Identification
    @NotBlank(message = "Aadhaar number is required")
    @Pattern(regexp = "^[2-9]{1}[0-9]{11}$", message = "Aadhaar number must be a valid 12-digit number")
    private String aadhaar;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;

    // Vedic Details
    @NotBlank(message = "Vedham is required")
    @Size(max = 50, message = "Vedham must not exceed 50 characters")
    private String vedham;

    @Size(max = 50, message = "Shaka must not exceed 50 characters")
    private String shaka;

    @NotBlank(message = "Gothram is required")
    @Size(max = 50, message = "Gothram must not exceed 50 characters")
    private String gothram;

    @Size(max = 50, message = "Soothram must not exceed 50 characters")
    private String soothram;

    @Size(max = 255, message = "Patasalai must not exceed 255 characters")
    private String patasalai;

    @Size(max = 255, message = "Adhyapakar name must not exceed 255 characters")
    private String adhyapakarName;

    @Size(max = 255, message = "Certified in must not exceed 255 characters")
    private String certifiedIn;

    @Pattern(regexp = "^(19|20)\\d{2}$", message = "Year must be a valid 4-digit year (1900-2099)")
    private String yearOfCertification;

    // File uploads (handled separately in controller)
    private MultipartFile certFile;
    private MultipartFile photoFile;

    // Helper method to get full name
    public String getFullName() {
        return (firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "");
    }
}