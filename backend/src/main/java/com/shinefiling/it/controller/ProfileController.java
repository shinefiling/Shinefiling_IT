package com.shinefiling.it.controller;

import com.shinefiling.it.model.Profile;
import com.shinefiling.it.model.User;
import com.shinefiling.it.repository.ProfileRepository;
import com.shinefiling.it.repository.UserRepository;
import com.shinefiling.it.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ProfileController {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @GetMapping
    public List<Profile> getAllProfiles() {
        List<Profile> profiles = profileRepository.findAll();
        // Sync userRole for existing profiles that have it as null
        profiles.forEach(profile -> {
            if (profile.getUserRole() == null) {
                userRepository.findByEmail(profile.getEmail()).ifPresent(user -> {
                    profile.setUserRole(user.getUserRole());
                    profileRepository.save(profile);
                });
            }
        });
        return profiles;
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Profile> getProfileById(@PathVariable Long id) {
        return profileRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Profile> searchProfiles(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Double minRate,
            @RequestParam(required = false) Double maxRate,
            @RequestParam(required = false) List<String> skills) {
        return profileRepository.searchProfiles(query, minRate, maxRate, skills);
    }

    @GetMapping("/{email}")
    public ResponseEntity<Profile> getProfileByEmail(@PathVariable String email, jakarta.servlet.http.HttpServletRequest request) {
        return profileRepository.findByEmail(email)
                .map(profile -> {
                    // Dynamic Activity Tracking
                    String userAgent = request.getHeader("User-Agent");
                    String remoteAddr = request.getRemoteAddr();
                    
                    // Simple User-Agent detection logic
                    String systemInfo = "Unknown Device";
                    if (userAgent != null) {
                        if (userAgent.contains("Windows")) systemInfo = "Windows PC";
                        else if (userAgent.contains("Macintosh")) systemInfo = "Mac";
                        else if (userAgent.contains("iPhone")) systemInfo = "iPhone";
                        else if (userAgent.contains("Android")) systemInfo = "Android Device";
                        
                        if (userAgent.contains("Chrome")) systemInfo += " - Chrome";
                        else if (userAgent.contains("Firefox")) systemInfo += " - Firefox";
                        else if (userAgent.contains("Safari")) systemInfo += " - Safari";
                    }

                    profile.setLastActiveTime(java.time.LocalDateTime.now());
                    profile.setLastActiveDevice(systemInfo);
                    profile.setLastActiveLocation(remoteAddr.equals("0:0:0:0:0:0:0:1") || remoteAddr.equals("127.0.0.1") ? "Localhost (Chennai, TN)" : "IP: " + remoteAddr);
                    
                    profileRepository.save(profile);
                    return ResponseEntity.ok(profile);
                })
                .orElseGet(() -> {
                    // If profile doesn't exist, check if user exists and create basic profile
                    return userRepository.findByEmail(email)
                            .map(user -> {
                                Profile newProfile = new Profile();
                                newProfile.setEmail(user.getEmail());
                                newProfile.setFullName(user.getFullName());
                                newProfile.setUsername(user.getUsername());
                                newProfile.setUserRole(user.getUserRole());
                                newProfile.setEmailVerified(user.isVerified());
                                return ResponseEntity.ok(profileRepository.save(newProfile));
                            })
                            .orElse(ResponseEntity.notFound().build());
                });
    }

    @PostMapping
    public ResponseEntity<Profile> createOrUpdateProfile(@RequestBody Profile profile) {
        Optional<Profile> existingProfile = profileRepository.findByEmail(profile.getEmail());
        
        if (existingProfile.isPresent()) {
            Profile p = existingProfile.get();
            // Update fields
            p.setFullName(profile.getFullName());
            p.setProfessionalHeadline(profile.getProfessionalHeadline());
            p.setSummary(profile.getSummary());
            p.setHourlyRate(profile.getHourlyRate());
            p.setLocation(profile.getLocation());
            p.setSkills(profile.getSkills());
            p.setExperience(profile.getExperience());
            p.setEducation(profile.getEducation());
            p.setPortfolio(profile.getPortfolio());
            p.setProfilePicture(profile.getProfilePicture());
            p.setPhone(profile.getPhone());
            p.setUserRole(profile.getUserRole());
            
            return ResponseEntity.ok(profileRepository.save(p));
        } else {
            Profile savedProfile = profileRepository.save(profile);
            // Trigger Welcome Email for new profile
            try {
                emailService.sendWelcomeEmail(savedProfile.getEmail(), savedProfile.getFullName());
            } catch (Exception e) {
                System.err.println("Failed to send welcome email: " + e.getMessage());
            }
            return ResponseEntity.ok(savedProfile);
        }
    }

    @PutMapping("/{email}")
    public ResponseEntity<Profile> updateProfile(@PathVariable String email, @RequestBody Profile profileDetails) {
        return profileRepository.findByEmail(email)
                .map(profile -> {
                    profile.setFullName(profileDetails.getFullName());
                    profile.setProfessionalHeadline(profileDetails.getProfessionalHeadline());
                    profile.setSummary(profileDetails.getSummary());
                    profile.setHourlyRate(profileDetails.getHourlyRate());
                    profile.setLocation(profileDetails.getLocation());
                    profile.setSkills(profileDetails.getSkills());
                    profile.setExperience(profileDetails.getExperience());
                    profile.setEducation(profileDetails.getEducation());
                    profile.setPortfolio(profileDetails.getPortfolio());
                    profile.setProfilePicture(profileDetails.getProfilePicture());
                    profile.setPhone(profileDetails.getPhone());
                    return ResponseEntity.ok(profileRepository.save(profile));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestParam String email) {
        try {
            emailService.sendOtpEmail(email);
            return ResponseEntity.ok("OTP sent successfully to " + email);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error sending OTP: " + e.getMessage());
        }
    }

    @PostMapping("/upload-photo/{email}")
    public ResponseEntity<Profile> uploadPhoto(@PathVariable String email, @RequestParam("file") MultipartFile file) {
        return profileRepository.findByEmail(email)
                .map(profile -> {
                    try {
                        String uploadDir = "./uploads/";
                        Path uploadPath = Paths.get(uploadDir);
                        
                        if (!Files.exists(uploadPath)) {
                            Files.createDirectories(uploadPath);
                        }

                        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                        Path filePath = uploadPath.resolve(fileName);
                        Files.copy(file.getInputStream(), filePath);

                        String fileUrl = "/uploads/" + fileName;
                        profile.setProfilePicture(fileUrl);
                        
                        return ResponseEntity.ok(profileRepository.save(profile));
                    } catch (IOException e) {
                        return ResponseEntity.status(500).<Profile>build();
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
