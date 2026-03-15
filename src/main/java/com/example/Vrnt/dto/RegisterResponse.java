package com.example.Vrnt.dto;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
@Data
@Builder
public class RegisterResponse {
    private Long id;
    private String role;
    private String username;
    private String fullName;
    private String email;
    private String gender;
    private String department;
    private LocalDateTime createdAt;
}