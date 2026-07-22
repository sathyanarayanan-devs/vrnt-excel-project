package com.example.Vrnt.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    private Long id;

    // Personal Details
    private String firstName;
    private String lastName;
    private String mobile;
    private String email;
    private String role;
    private String username;

    @JsonIgnore
    private String password;

    private String gender;
    private String department;

    // Address Details
    private String street1;
    private String street2;
    private String city;
    private String state;
    private String postalCode;

    // Identification
    private String aadhaar;
    private LocalDate dateOfBirth;

    // Vedic Details
    private String vedham;
    private String shaka;
    private String gothram;
    private String soothram;
    private String patasalai;
    private String adhyapakarName;
    private String certifiedIn;
    private String yearOfCertification;

    // Document paths
    private String certificatePath;
    private String photoPath;

    // Status and timestamps
    private String status; // PENDING, APPROVED, REJECTED
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public String getFullName() {
        String first = firstName != null ? firstName : "";
        String last = lastName != null ? lastName : "";
        return (first + " " + last).trim();
    }

    public void markCreated() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "PENDING";
        }
    }

    public void markUpdated() {
        this.updatedAt = LocalDateTime.now();
    }
}