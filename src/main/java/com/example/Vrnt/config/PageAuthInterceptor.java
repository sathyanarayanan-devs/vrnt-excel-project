package com.example.Vrnt.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class PageAuthInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String requestUri = request.getRequestURI();
        if (requestUri == null || requestUri.isBlank()) {
            return true;
        }

        String normalizedPath = requestUri.replaceFirst("^/++", "/");
        if (isPublicPath(normalizedPath)) {
            return true;
        }

        if (!normalizedPath.endsWith(".html")) {
            return true;
        }

        if (hasValidSession(request)) {
            return true;
        }

        response.sendRedirect(request.getContextPath() + "/login.html");
        return false;
    }

    private boolean isPublicPath(String requestUri) {
        return requestUri.equals("/")
                || requestUri.equals("/index")
                || requestUri.equals("/index.html")
                || requestUri.equals("/login")
                || requestUri.equals("/login.html")
                || requestUri.equals("/register")
                || requestUri.equals("/register.html")
                || requestUri.equals("/preview")
                || requestUri.equals("/preview.html")
                || requestUri.equals("/success")
                || requestUri.equals("/success.html")
                || requestUri.equals("/forgetpwd")
                || requestUri.equals("/forgetpwd.html")
                || requestUri.startsWith("/api/")
                || requestUri.startsWith("/styles/")
                || requestUri.startsWith("/scripts/")
                || requestUri.startsWith("/images/")
                || requestUri.startsWith("/css/");
    }

    private boolean hasValidSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return false;
        }

        Object loggedInUser = session.getAttribute("loggedInUser");
        return loggedInUser != null && !String.valueOf(loggedInUser).isBlank();
    }
}
