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
        
        // Set CORS headers for all responses processed by this filter
        String origin = httpRequest.getHeader("Origin");
        if (origin != null && (origin.equals("http://localhost:5173") || origin.equals("http://localhost:3000"))) {
            httpResponse.setHeader("Access-Control-Allow-Origin", origin);
            httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
            httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
            httpResponse.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Requested-With, Authorization");
        }

        // Allow OPTIONS requests for CORS preflight
        if ("OPTIONS".equalsIgnoreCase(method)) {
            httpResponse.setStatus(HttpServletResponse.SC_OK);
            return;
        }
        
        // Only protect /api routes
        if (path.startsWith("/api/")) {
            String appIdentity = httpRequest.getHeader("X-Requested-With");
            
            // Block if not an AJAX/programmatic request (Direct browser access)
            if (appIdentity == null || !appIdentity.equalsIgnoreCase("XMLHttpRequest")) {
                httpResponse.setStatus(HttpServletResponse.SC_FORBIDDEN);
                httpResponse.setContentType("application/json");
                httpResponse.getWriter().write("{\"error\": \"Direct browser access is restricted. Please use the official Shinefiling Platform.\"}");
                return;
            }
        }

        chain.doFilter(request, response);
    }
}
