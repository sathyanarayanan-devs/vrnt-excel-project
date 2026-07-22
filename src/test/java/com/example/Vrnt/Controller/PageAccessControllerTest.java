package com.example.Vrnt.Controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class PageAccessControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void protectedPageWithoutAuthRedirectsToLogin() throws Exception {
        mockMvc.perform(get("/user-dashboard.html"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/login.html"));
    }

    @Test
    void previewHtmlPageIsServedDirectly() throws Exception {
        mockMvc.perform(get("/preview.html"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Review Your Application")));
    }

    @Test
    void successHtmlPageIsServedDirectly() throws Exception {
        mockMvc.perform(get("/success.html"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Application Submitted")));
    }

    @Test
    void previewRouteRedirectsToPreviewHtml() throws Exception {
        mockMvc.perform(get("/preview"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/preview.html"));
    }

    @Test
    void successRouteRedirectsToSuccessHtml() throws Exception {
        mockMvc.perform(get("/success"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/success.html"));
    }
}
