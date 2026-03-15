package com.example.Vrnt.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {

    private Long id;
    private String username;
    private String fullName;
    private String role;
    private String department;
    private String token;        // JWT token sent to frontend
    private String tokenType;    // always "Bearer"
}