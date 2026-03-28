package com.example.Vrnt.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
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
@Entity
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_email", columnNames = "email"),
                @UniqueConstraint(name = "uk_mobile", columnNames = "mobile"),
                @UniqueConstraint(name = "uk_aadhaar", columnNames = "aadhaar")
        }
)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Personal Details
    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(nullable = false, unique = true, length = 10)
    private String mobile;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    // Address Details
    @Column(name = "street1", nullable = false, length = 255)
    private String street1;

    @Column(name = "street2", length = 255)
    private String street2;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(name = "postal_code", nullable = false, length = 6)
    private String postalCode;

    // Identification
    @Column(nullable = false, unique = true, length = 12)
    private String aadhaar;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    // Vedic Details
    @Column(nullable = false, length = 50)
    private String vedham;

    @Column(length = 50)
    private String shaka;

    @Column(nullable = false, length = 50)
    private String gothram;

    @Column(length = 50)
    private String soothram;

    @Column(length = 255)
    private String patasalai;

    @Column(name = "adhyapakar_name", length = 255)
    private String adhyapakarName;

    @Column(name = "certified_in", length = 255)
    private String certifiedIn;

    @Column(name = "year_of_certification", length = 4)
    private String yearOfCertification;

    // Document paths
    @Column(name = "certificate_path", length = 500)
    private String certificatePath;

    @Column(name = "photo_path", length = 500)
    private String photoPath;

    // Status and timestamps
    @Column(nullable = false)
    private String status; // PENDING, APPROVED, REJECTED

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "PENDING";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}