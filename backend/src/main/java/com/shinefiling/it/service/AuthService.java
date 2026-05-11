package com.shinefiling.it.service;

import com.shinefiling.it.model.User;
import com.shinefiling.it.model.Profile;
import com.shinefiling.it.repository.UserRepository;
import com.shinefiling.it.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private TemplateService templateService;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public User register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        
        // Generate OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        // Hash the password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Set default role if not provided
        if (user.getUserRole() == null || user.getUserRole().isEmpty()) {
            user.setUserRole("FREELANCER");
        }

        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        user.setVerified(false);

        User savedUser = userRepository.save(user);

        // Create a basic profile for the new user
        Profile profile = new Profile();
        profile.setEmail(user.getEmail());
        profile.setFullName(user.getFullName());
        profile.setUsername(user.getUsername());
        profile.setEmailVerified(false);
        profileRepository.save(profile);

        // Send OTP Email
        Map<String, String> vars = new HashMap<>();
        vars.put("otp", otp);
        templateService.sendTemplatedEmail(user.getEmail(), "EMAIL_VERIFICATION_OTP", vars);

        return savedUser;
    }

    public boolean verifyOtp(String email, String otp) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getOtp() != null && user.getOtp().equals(otp) &&
                    user.getOtpExpiry().isAfter(LocalDateTime.now())) {
                user.setVerified(true);
                user.setOtp(null); // Clear OTP
                user.setOtpExpiry(null);
                userRepository.save(user);
                
                // Send Welcome Email
                Map<String, String> vars = new HashMap<>();
                vars.put("name", user.getFullName());
                templateService.sendTemplatedEmail(user.getEmail(), "WELCOME_EMAIL", vars);
                
                return true;
            }
        }
        return false;
    }

    public void resendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Account not found with this email."));

        String otp = String.format("%06d", new Random().nextInt(999999));
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        Map<String, String> vars = new HashMap<>();
        vars.put("otp", otp);
        templateService.sendTemplatedEmail(user.getEmail(), "EMAIL_VERIFICATION_OTP", vars);
    }

    public Optional<User> login(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            if (!user.get().isVerified()) {
                throw new RuntimeException("Email not verified");
            }
            return user;
        }
        return Optional.empty();
    }

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Account not found with this email."));

        String otp = String.format("%06d", new Random().nextInt(999999));
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        Map<String, String> vars = new HashMap<>();
        vars.put("otp", otp);
        templateService.sendTemplatedEmail(user.getEmail(), "PASSWORD_RESET_OTP", vars);
    }

    public boolean verifyResetOtp(String email, String otp) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return user.getOtp() != null && user.getOtp().equals(otp) &&
                    user.getOtpExpiry().isAfter(LocalDateTime.now());
        }
        return false;
    }

    public void resetPassword(String email, String otp, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getOtp() == null || !user.getOtp().equals(otp) ||
                user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);
    }
}
