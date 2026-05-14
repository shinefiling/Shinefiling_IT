package com.shinefiling.it.controller;

import com.shinefiling.it.model.User;
import com.shinefiling.it.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User newUser = authService.register(user);
            return ResponseEntity.ok(newUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");
            Optional<User> user = authService.login(email, password);
            if (user.isPresent()) {
                return ResponseEntity.ok(user.get());
            } else {
                return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
            }
        } catch (RuntimeException e) {
            if ("Email not verified".equals(e.getMessage())) {
                return ResponseEntity.status(403).body(Map.of("message", e.getMessage(), "email", request.get("email")));
            }
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String otp = payload.get("otp");
        if (authService.verifyOtp(email, otp)) {
            return ResponseEntity.ok(Map.of("message", "Verification successful"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired OTP"));
        }
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        try {
            authService.resendOtp(email);
            return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> payload) {
        try {
            authService.forgotPassword(payload.get("email"));
            return ResponseEntity.ok(Map.of("message", "OTP sent to your email"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/verify-reset-otp")
    public ResponseEntity<?> verifyResetOtp(@RequestBody Map<String, String> payload) {
        if (authService.verifyResetOtp(payload.get("email"), payload.get("otp"))) {
            return ResponseEntity.ok(Map.of("message", "OTP verified"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired OTP"));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
        try {
            authService.resetPassword(payload.get("email"), payload.get("otp"), payload.get("password"));
            return ResponseEntity.ok(Map.of("message", "Password reset successful"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, Object> payload) {
        try {
            String token = (String) payload.get("token");
            String email = (String) payload.get("email");
            String name = (String) payload.get("name");
            String googleId = (String) payload.get("googleId");
            String role = (String) payload.get("userRole");
            String profileImage = (String) payload.get("profileImage");
            Object isSignupObj = payload.get("isSignup");
            boolean isSignup = isSignupObj != null && (boolean) isSignupObj;

            User user;
            if (token != null && !token.isEmpty()) {
                // Secure path: verify ID token
                user = authService.googleLogin(token, role, isSignup);
            } else if (email != null && googleId != null) {
                // Fallback path: trust raw info (similar to shinefiling-web)
                user = authService.processGoogleLoginRaw(email, name, googleId, role, profileImage, isSignup);
            } else {
                throw new RuntimeException("Invalid Google login request");
            }
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            e.printStackTrace(); // This will show the error in your terminal/logs
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        }
    }
}
