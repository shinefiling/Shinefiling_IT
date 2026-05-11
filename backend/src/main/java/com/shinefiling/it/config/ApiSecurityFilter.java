package com.shinefiling.it.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class ApiSecurityFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String path = httpRequest.getRequestURI();
        String method = httpRequest.getMethod();
        String origin = httpRequest.getHeader("Origin");
        
        // Comprehensive CORS support for both Dev and Production
        if (origin != null) {
            boolean isAllowedOrigin = origin.equals("http://localhost:5173") || 
                                    origin.equals("http://localhost:3000") ||
                                    origin.equals("https://shinefiling.com") ||
                                    origin.equals("http://shinefiling.com") ||
                                    origin.equals("https://www.shinefiling.com");
            
            if (isAllowedOrigin) {
                httpResponse.setHeader("Access-Control-Allow-Origin", origin);
                httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
                httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
                httpResponse.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Requested-With, Authorization, Accept");
            }
        }

        // Allow OPTIONS requests for CORS preflight
        if ("OPTIONS".equalsIgnoreCase(method)) {
            httpResponse.setStatus(HttpServletResponse.SC_OK);
            return;
        }
        
        // Protect /api routes (using contains to handle subdirectories like /ITfreelancers/api)
        if (path.contains("/api/")) {
            String appIdentity = httpRequest.getHeader("X-Requested-With");
            
            // Allow if it's an AJAX request or if it's from our allowed origins
            if (appIdentity == null || !appIdentity.equalsIgnoreCase("XMLHttpRequest")) {
                // If it's a POST/PUT/DELETE, we are more strict. GET might be okay for some things but let's stay safe.
                // However, some modern fetch implementations might not send X-Requested-With.
                // Let's allow it if the origin is one of ours.
                if (origin == null || !(origin.contains("shinefiling.com") || origin.contains("localhost"))) {
                    httpResponse.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    httpResponse.setContentType("application/json");
                    httpResponse.getWriter().write("{\"error\": \"Access restricted. Please use the official platform.\"}");
                    return;
                }
            }
        }

        chain.doFilter(request, response);
    }
}
