package com.example.Vrnt.integration;

import com.example.Vrnt.model.User;
import com.example.Vrnt.security.JwtUtil;
import com.example.Vrnt.service.ExcelService;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@SuppressWarnings("nullness")
public class E2EIntegrationTests {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ExcelService excelService;

        @Autowired
        private JwtUtil jwtUtil;

        @BeforeEach
        void setup() {
                excelService.updateUsers(List.of());

                // Seed an admin and a normal user
                User admin = User.builder()
                                .firstName("Admin")
                                .lastName("User")
                                .email("admin@vrnt.org")
                                .username("admin")
                                .password("password")
                                .role("admin")
                                .mobile("9123456789")
                                .street1("Admin Street 1")
                                .city("Bengaluru")
                                .state("Karnataka")
                                .postalCode("560001")
                                .aadhaar("223344556677")
                                .dateOfBirth(java.time.LocalDate.now().minusYears(30))
                                .vedham("Veda")
                                .gothram("G1")
                                .status("APPROVED")
                                .build();

                User normal = User.builder()
                                .firstName("Normal")
                                .lastName("User")
                                .email("alice@example.com")
                                .username("alice")
                                .password("password")
                                .role("normal")
                                .mobile("9988776655")
                                .street1("Main Street")
                                .city("Chennai")
                                .state("Tamil Nadu")
                                .postalCode("600001")
                                .aadhaar("334455667788")
                                .dateOfBirth(java.time.LocalDate.now().minusYears(25))
                                .vedham("Veda")
                                .gothram("G2")
                                .status("PENDING")
                                .build();

                excelService.addUser(admin);
                excelService.addUser(normal);
        }

        @Test
        void registrationValidationRejectsBadData() throws Exception {
                MockMultipartFile cert = new MockMultipartFile("certFile", "cert.pdf",
                                "application/pdf", "dummy".getBytes(StandardCharsets.UTF_8));

                MockMultipartFile photo = new MockMultipartFile("photoFile", "photo.jpg",
                                "image/jpeg", "dummy".getBytes(StandardCharsets.UTF_8));

                // Missing required fields and invalid mobile
                MockMultipartFile firstName = new MockMultipartFile("firstName", "firstName", "text/plain",
                                "A".getBytes());
                MockMultipartFile lastName = new MockMultipartFile("lastName", "lastName", "text/plain",
                                "B".getBytes());
                MockMultipartFile mobile = new MockMultipartFile("mobile", "mobile", "text/plain", "123".getBytes());
                MockMultipartFile email = new MockMultipartFile("email", "email", "text/plain",
                                "not-an-email".getBytes());
                MockMultipartFile street1 = new MockMultipartFile("street1", "street1", "text/plain",
                                "addr".getBytes());
                MockMultipartFile city = new MockMultipartFile("city", "city", "text/plain", "City".getBytes());
                MockMultipartFile state = new MockMultipartFile("state", "state", "text/plain", "State".getBytes());
                MockMultipartFile postalCode = new MockMultipartFile("postalCode", "postalCode", "text/plain",
                                "000000".getBytes());
                MockMultipartFile aadhaar = new MockMultipartFile("aadhaar", "aadhaar", "text/plain",
                                "000000000000".getBytes());
                MockMultipartFile dateOfBirth = new MockMultipartFile("dateOfBirth", "dateOfBirth", "text/plain",
                                "2025-01-01".getBytes());
                MockMultipartFile password = new MockMultipartFile("password", "password", "text/plain",
                                "123".getBytes());
                MockMultipartFile vedham = new MockMultipartFile("vedham", "vedham", "text/plain", "V1".getBytes());

                MediaType multipartType = MediaType.MULTIPART_FORM_DATA;
                if (multipartType == null) {
                        throw new IllegalStateException("multipart media type should be available");
                }

                mockMvc.perform(multipart("/api/auth/register")
                                .file(cert)
                                .file(photo)
                                .file(firstName)
                                .file(lastName)
                                .file(mobile)
                                .file(email)
                                .file(street1)
                                .file(city)
                                .file(state)
                                .file(postalCode)
                                .file(aadhaar)
                                .file(dateOfBirth)
                                .file(password)
                                .file(vedham)
                                .contentType(multipartType))
                                .andExpect(status().isBadRequest());
        }

        @Test
        void adminSearchEndpoint_filtersAndAuthorization() throws Exception {
                // Generate admin token for admin user
                String token = jwtUtil.generateToken("admin", "admin");

                // Search for normal users by query 'alice'
                mockMvc.perform(get("/api/auth/users")
                                .header("Authorization", "Bearer " + token)
                                .param("username", "admin")
                                .param("query", "alice"))
                                .andExpect(status().isOk());

                // Build token for normal user - should be forbidden
                String normalToken = jwtUtil.generateToken("alice", "normal");
                mockMvc.perform(get("/api/auth/users")
                                .header("Authorization", "Bearer " + normalToken)
                                .param("username", "alice"))
                                .andExpect(status().isForbidden());
        }

        @Test
        void excelExportEndpoints_allowAdminTokenWithoutUsernameParam() throws Exception {
                String token = jwtUtil.generateToken("admin", "admin");

                var mvcResult = mockMvc.perform(get("/api/admin/excel/export/all")
                                .header("Authorization", "Bearer " + token))
                                .andExpect(status().isOk())
                                .andReturn();

                byte[] content = mvcResult.getResponse().getContentAsByteArray();
                assertThat(content).isNotEmpty();
        }

        @Test
        void excelExportEndpoints_produceValidWorkbook_and_noFormulaCells() throws Exception {
                String token = jwtUtil.generateToken("admin", "admin");

                // Call export all
                var mvcResult = mockMvc.perform(get("/api/admin/excel/export/all")
                                .param("username", "admin")
                                .header("Authorization", "Bearer " + token))
                                .andExpect(status().isOk())
                                .andReturn();

                byte[] content = mvcResult.getResponse().getContentAsByteArray();
                assertThat(content).isNotEmpty();

                try (XSSFWorkbook workbook = new XSSFWorkbook(new ByteArrayInputStream(content))) {
                        assertThat(workbook.getNumberOfSheets()).isGreaterThan(0);
                        var sheet = workbook.getSheetAt(0);
                        // Check header row exists
                        Row header = sheet.getRow(0);
                        assertThat(header).isNotNull();
                        // Check first data row, ensure no formula cells (protect against formula
                        // injection)
                        if (sheet.getLastRowNum() >= 1) {
                                Row data = sheet.getRow(1);
                                assertThat(data).isNotNull();
                                for (Cell cell : data) {
                                        // Cell should not be formula type
                                        assertThat(cell.getCellType())
                                                        .isNotEqualTo(org.apache.poi.ss.usermodel.CellType.FORMULA);
                                }
                        }
                }
        }
}
