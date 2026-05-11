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
import java.util.Collections;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;

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

    @Value("${google.client.id}")
    private String googleClientId;

    public User googleLogin(String idTokenString, String requestedRole) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String pictureUrl = (String) payload.get("picture");

                Optional<User> userOpt = userRepository.findByEmail(email);
                if (userOpt.isPresent()) {
                    return userOpt.get();
                } else {
                    // Create new user
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setFullName(name);
                    newUser.setUsername(email.split("@")[0]);
                    newUser.setPassword(passwordEncoder.encode(Random.class.getName())); // Random password
                    newUser.setUserRole(requestedRole != null ? requestedRole : "FREELANCER");
                    newUser.setVerified(true);
                    User savedUser = userRepository.save(newUser);

                    // Create Profile
                    Profile profile = new Profile();
                    profile.setEmail(email);
                    profile.setFullName(name);
                    profile.setUsername(newUser.getUsername());
                    profile.setProfilePicture(pictureUrl);
                    profile.setEmailVerified(true);
                    profileRepository.save(profile);

                    return savedUser;
                }
            } else {
                throw new RuntimeException("Invalid ID token.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error verifying Google token: " + e.getMessage());
        }
    }
    public User processGoogleLoginRaw(String email, String name, String googleId, String requestedRole, String profileImage) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            return userOpt.get();
        } else {
            // Create new user
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFullName(name);
            newUser.setUsername(email.split("@")[0]);
            newUser.setPassword(passwordEncoder.encode(googleId)); // Use googleId as partial basis for random pass
            newUser.setUserRole(requestedRole != null ? requestedRole : "FREELANCER");
            newUser.setVerified(true);
            User savedUser = userRepository.save(newUser);

            // Create Profile
            Profile profile = new Profile();
            profile.setEmail(email);
            profile.setFullName(name);
            profile.setUsername(newUser.getUsername());
            profile.setProfilePicture(profileImage);
            profile.setEmailVerified(true);
            profileRepository.save(profile);

            return savedUser;
        }
    }
}
