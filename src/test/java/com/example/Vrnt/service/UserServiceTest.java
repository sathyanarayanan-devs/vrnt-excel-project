package com.example.Vrnt.service;

import com.example.Vrnt.dto.LoginRequest;
import com.example.Vrnt.dto.LoginResponse;
import com.example.Vrnt.dto.RegisterRequest;
import com.example.Vrnt.dto.RegisterResponse;
import com.example.Vrnt.exception.UserAlreadyExistsException;
import com.example.Vrnt.model.User;
import com.example.Vrnt.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("nullness")
class UserServiceTest {

    @Mock
    private ExcelService excelService;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private UserService userService;

    private RegisterRequest validRequest;

    @BeforeEach
    void setUp() {
        validRequest = new RegisterRequest();
        validRequest.setFirstName("Arun");
        validRequest.setLastName("Kumar");
        validRequest.setMobile("9876543210");
        validRequest.setEmail("arun@example.com");
        validRequest.setPassword("Secret123");
        validRequest.setStreet1("123 Main Street");
        validRequest.setStreet2("Apartment 5");
        validRequest.setCity("Chennai");
        validRequest.setState("Tamil Nadu");
        validRequest.setPostalCode("600001");
        validRequest.setAadhaar("234567890123");
        validRequest.setDateOfBirth(LocalDate.of(1990, 1, 1));
        validRequest.setVedham("Rigveda");
        validRequest.setShaka("Saka");
        validRequest.setGothram("Vasishta");
        validRequest.setSoothram("Soothram");
        validRequest.setPatasalai("Patasalai");
        validRequest.setAdhyapakarName("Guruji");
        validRequest.setCertifiedIn("Vedic Studies");
        validRequest.setYearOfCertification("2020");
        validRequest.setCertFile(new MockMultipartFile("certFile", "cert.pdf", "application/pdf", "cert".getBytes()));
        validRequest.setPhotoFile(new MockMultipartFile("photoFile", "photo.png", "image/png", "photo".getBytes()));
    }

    @Test
    void registerUserWithDefaultNormalRole() throws IOException {
        when(excelService.existsByEmail(anyString())).thenReturn(false);
        when(excelService.existsByMobile(anyString())).thenReturn(false);
        when(excelService.existsByAadhaar(anyString())).thenReturn(false);
        when(excelService.existsByUsername(anyString())).thenReturn(false);

        RegisterResponse response = userService.register(validRequest);

        assertNotNull(response);
        assertEquals("normal", response.getRole());
        assertNotNull(response.getUsername());
        assertEquals("arun@example.com", response.getEmail());

        verify(excelService).addUser(any(User.class));
    }

    @Test
    void registerUserWithAdminRoleBasedOnEmailDomain() throws IOException {
        validRequest.setEmail("admin@vrnt.org");

        when(excelService.existsByEmail(anyString())).thenReturn(false);
        when(excelService.existsByMobile(anyString())).thenReturn(false);
        when(excelService.existsByAadhaar(anyString())).thenReturn(false);
        when(excelService.existsByUsername(anyString())).thenReturn(false);

        RegisterResponse response = userService.register(validRequest);

        assertNotNull(response);
        assertEquals("admin", response.getRole());
        assertNotNull(response.getUsername());
        assertEquals("admin@vrnt.org", response.getEmail());

        verify(excelService).addUser(any(User.class));
    }

    @Test
    void registerUserFailsWhenEmailAlreadyExists() {
        when(excelService.existsByEmail(anyString())).thenReturn(true);

        UserAlreadyExistsException exception = assertThrows(UserAlreadyExistsException.class,
                () -> userService.register(validRequest));

        assertTrue(exception.getMessage().contains("already exists"));
    }

    @Test
    void loginReturnsTokenForValidCredentials() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("arun@example.com");
        loginRequest.setPassword("Secret123");

        User user = User.builder()
                .id(1L)
                .username("arun")
                .email("arun@example.com")
                .password("Secret123")
                .role("normal")
                .department("Vedic Studies")
                .firstName("Arun")
                .lastName("Kumar")
                .build();

        when(excelService.findByUsernameOrEmail("arun@example.com", "arun@example.com"))
                .thenReturn(user);
        when(jwtUtil.generateToken("arun", "normal")).thenReturn("jwt-token");

        LoginResponse response = userService.login(loginRequest);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals("normal", response.getRole());
        assertEquals("arun", response.getUsername());
    }

    @Test
    void loginFailsWithInvalidPassword() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("arun@example.com");
        loginRequest.setPassword("WrongPassword");

        User user = User.builder()
                .id(1L)
                .username("arun")
                .email("arun@example.com")
                .password("Secret123")
                .role("normal")
                .build();

        when(excelService.findByUsernameOrEmail("arun@example.com", "arun@example.com"))
                .thenReturn(user);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> userService.login(loginRequest));

        assertEquals("Invalid username or password", exception.getMessage());
    }

    @Test
    void loginFailsWhenUserNotFound() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("unknown@example.com");
        loginRequest.setPassword("Secret123");

        when(excelService.findByUsernameOrEmail("unknown@example.com", "unknown@example.com"))
                .thenReturn(null);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> userService.login(loginRequest));

        assertEquals("Invalid username or password", exception.getMessage());
    }
}
