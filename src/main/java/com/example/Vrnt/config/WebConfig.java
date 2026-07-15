package com.example.Vrnt.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final PageAuthInterceptor pageAuthInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(pageAuthInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns("/api/**", "/styles/**", "/scripts/**", "/css/**", "/images/**",
                        "/", "/index", "/index.html", "/login", "/login.html", "/register",
                        "/register.html", "/preview", "/preview.html", "/success", "/success.html",
                        "/forgetpwd", "/forgetpwd.html");
    }
}
