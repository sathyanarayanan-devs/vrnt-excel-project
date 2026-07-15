package com.example.Vrnt.Controller;

import com.example.Vrnt.dto.LoginRequest;
import com.example.Vrnt.dto.RegisterResponse;
import com.example.Vrnt.model.User;
import com.example.Vrnt.security.JwtUtil;
import com.example.Vrnt.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtUtil jwtUtil;

    @Test
    void getUserDetailsReturnsProfileDataForAuthenticatedUser() throws Exception {
        RegisterResponse profile = RegisterResponse.builder()
                .firstName("Anand")
                .lastName("Rao")
                .email("anand@example.com")
                .mobile("9876543210")
                .aadhaar("123456789012")
                .city("Chennai")
                .state("Tamil Nadu")
                .vedham("Rigveda")
                .gothram("Bharadhwaja")
                .certifiedIn("Veda")
                .yearOfCertification("2023")
                .dateOfBirth(LocalDate.of(1990, 4, 14))
                .build();

        when(jwtUtil.validateToken("Bearer test-token")).thenReturn(true);
        when(jwtUtil.extractUsername("Bearer test-token")).thenReturn("anand");
        when(jwtUtil.extractRole("Bearer test-token")).thenReturn("normal");
        when(userService.getUserDetails("anand")).thenReturn(profile);

        mockMvc.perform(get("/api/auth/user-details")
                .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.firstName").value("Anand"))
                .andExpect(jsonPath("$.data.email").value("anand@example.com"));
    }

    @Test
    void getUserDetailsReturnsNotFoundWhenUserIsMissing() throws Exception {
        when(jwtUtil.validateToken("Bearer missing-token")).thenReturn(true);
        when(jwtUtil.extractUsername("Bearer missing-token")).thenReturn("missing-user");
        when(userService.getUserDetails("missing-user")).thenThrow(new RuntimeException("User not found"));

        mockMvc.perform(get("/api/auth/user-details")
                .header("Authorization", "Bearer missing-token"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void loginReturnsUnauthorizedForInvalidCredentials() throws Exception {
        when(userService.login(any(LoginRequest.class)))
                .thenThrow(new IllegalArgumentException("Invalid username or password"));

        mockMvc.perform(post("/api/auth/login")
                .contentType("application/json")
                .content("{\"username\":\"bad-user\",\"password\":\"wrong-password\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void getUserCountReturnsCountForAdminRequests() throws Exception {
        when(jwtUtil.validateToken("Bearer admin-token")).thenReturn(true);
        when(jwtUtil.extractUsername("Bearer admin-token")).thenReturn("admin");
        when(jwtUtil.extractRole("Bearer admin-token")).thenReturn("admin");
        when(userService.getUserByUsername("admin")).thenReturn(User.builder().username("admin").role("admin").build());
        when(userService.countUsers()).thenReturn(3L);

        mockMvc.perform(get("/api/auth/users/count")
                .header("Authorization", "Bearer admin-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.count").value(3));
    }
}
