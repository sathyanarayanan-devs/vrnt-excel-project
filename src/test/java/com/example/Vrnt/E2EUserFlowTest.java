package com.example.Vrnt;

import com.example.Vrnt.config.AppProperties;
import com.example.Vrnt.dto.LoginRequest;
import com.example.Vrnt.dto.LoginResponse;
import com.example.Vrnt.service.ExcelService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "app.normalExcelPath=./target/test-data/normal_users-e2e.xlsx",
        "app.adminExcelPath=./target/test-data/admin_users-e2e.xlsx"
})
@AutoConfigureMockMvc
class E2EUserFlowTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ExcelService excelService;

    @Autowired
    private AppProperties appProperties;

    @BeforeEach
    void setUp() throws Exception {
        Path normalExcelPath = appProperties.resolveNormalExcelPath();
        Path adminExcelPath = appProperties.resolveAdminExcelPath();
        Files.createDirectories(normalExcelPath.getParent());
        Files.createDirectories(adminExcelPath.getParent());
        Files.deleteIfExists(normalExcelPath);
        Files.deleteIfExists(adminExcelPath);
    }

    @Test
    void shouldRegisterUsersAndReadDashboardSearchAndExportDataFromExcel() throws Exception {
        assertTrue(excelService.getAllUsers().isEmpty(), "No demo users should be present at startup");

        registerUser("Normal", "User", "9000000001", "normal.user@example.com", "NormalPass123!");

        assertTrue(Files.exists(appProperties.resolveNormalExcelPath()));
        assertTrue(Files.exists(appProperties.resolveAdminExcelPath()));
        assertTrue(excelService.getAllUsers().size() == 1, "The normal user should be stored in the Excel workbook");

        LoginResponse normalLogin = loginAndReturn("normal.user@example.com", "NormalPass123!");
        assertTrue(normalLogin.getRole().equalsIgnoreCase("normal"));

        String normalToken = normalLogin.getToken();
        mockMvc.perform(get("/api/auth/user-details")
                .header("Authorization", "Bearer " + normalToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.email").value("normal.user@example.com"));

        registerUser("Admin", "User", "9000000002", "admin.user@vrnt.org", "AdminPass123!");

        LoginResponse adminLogin = loginAndReturn("admin.user@vrnt.org", "AdminPass123!");
        assertTrue(adminLogin.getRole().equalsIgnoreCase("admin"));

        String adminToken = adminLogin.getToken();
        mockMvc.perform(get("/api/auth/users/count")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.count").value(2));

        mockMvc.perform(get("/api/auth/users")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", org.hamcrest.Matchers.hasSize(2)))
                .andExpect(jsonPath("$[0].email").exists())
                .andExpect(jsonPath("$[1].email").exists());

        mockMvc.perform(get("/api/auth/users")
                .header("Authorization", "Bearer " + adminToken)
                .param("query", "normal"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", org.hamcrest.Matchers.hasSize(1)))
                .andExpect(jsonPath("$[0].email").value("normal.user@example.com"));

        mockMvc.perform(get("/api/admin/excel/export/all")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(
                        header().string("Content-Disposition",
                                org.hamcrest.Matchers.containsString("attachment; filename=all_users.xlsx")))
                .andExpect(header().string("Content-Type",
                        org.hamcrest.Matchers
                                .containsString("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")));
    }

    private void registerUser(String firstName, String lastName, String mobile, String email, String password)
            throws Exception {
        mockMvc.perform(multipart("/api/auth/register")
                .file(new MockMultipartFile("certFile", "cert.pdf", MediaType.APPLICATION_OCTET_STREAM_VALUE,
                        new byte[0]))
                .file(new MockMultipartFile("photoFile", "photo.png", MediaType.APPLICATION_OCTET_STREAM_VALUE,
                        new byte[0]))
                .param("firstName", firstName)
                .param("lastName", lastName)
                .param("mobile", mobile)
                .param("email", email)
                .param("password", password)
                .param("street1", "123 Main Street")
                .param("street2", "Unit 1")
                .param("city", "Chennai")
                .param("state", "Tamil Nadu")
                .param("postalCode", "600001")
                .param("aadhaar", mobile.equals("9000000001") ? "900000000123" : "900000000124")
                .param("dateOfBirth", "1990-01-01")
                .param("vedham", "Rig Veda")
                .param("shaka", "Shaka 1")
                .param("gothram", "Gothram")
                .param("soothram", "Soothram")
                .param("patasalai", "Patasalai")
                .param("adhyapakarName", "Teacher")
                .param("certifiedIn", "Veda")
                .param("yearOfCertification", "2020"))
                .andExpect(status().isCreated());
    }

    private LoginResponse loginAndReturn(String username, String password) throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername(username);
        request.setPassword(password);

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode body = objectMapper.readTree(result.getResponse().getContentAsString());
        return objectMapper.treeToValue(body.get("data"), LoginResponse.class);
    }
}
