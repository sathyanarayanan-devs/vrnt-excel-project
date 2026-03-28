package com.example.Vrnt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String fullName; // Computed field
    private String mobile;
    private String email;
    private String city;
    private String state;
    private String postalCode;
    private String vedham;
    private String gothram;
    private String status;
    private LocalDateTime createdAt;
    private String certificatePath;
    private String photoPath;

    // Optional fields for detailed response
    private String street1;
    private String street2;
    private String shaka;
    private String soothram;
    private String patasalai;
    private String adhyapakarName;
    private String certifiedIn;
    private String yearOfCertification;
}