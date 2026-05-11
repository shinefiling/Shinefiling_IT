package com.shinefiling.it.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "freelancer_profiles")
@Data
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    private String username;
    private String professionalHeadline;
    
    @Column(columnDefinition = "TEXT")
    private String summary;
    
    private String location;
    private String phone;
    private Double hourlyRate;
    private String availability;
    private String profilePicture;

    @ElementCollection
    @CollectionTable(name = "profile_skills", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "skill")
    private List<String> skills = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "profile_experience", joinColumns = @JoinColumn(name = "profile_id"))
    private List<Experience> experience = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "profile_education", joinColumns = @JoinColumn(name = "profile_id"))
    private List<Education> education = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "profile_portfolio", joinColumns = @JoinColumn(name = "profile_id"))
    private List<PortfolioItem> portfolio = new ArrayList<>();

    private Boolean identityVerified = false;
    private Boolean paymentVerified = false;
    private Boolean phoneVerified = false;
    private Boolean emailVerified = false;
    
    private Double walletBalance = 0.0;
    private Integer reviewsCount = 0;
    private Integer completionRate = 0;

    private LocalDateTime createdAt;
    private LocalDateTime joinedDate;
    private LocalDateTime lastActiveTime;
    private String lastActiveDevice;
    private String lastActiveLocation;


    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (joinedDate == null) {
            joinedDate = LocalDateTime.now();
        }
    }
}
