package com.shinefiling.it.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String fullName;
    
    private String userRole; // FREELANCER, CLIENT, ADMIN

    private String profilePicture;

    @Builder.Default
    private Double walletBalance = 0.0;

    @Builder.Default
    private String kycStatus = "NOT_SUBMITTED"; // NOT_SUBMITTED, PENDING, APPROVED, REJECTED

    @Builder.Default
    private boolean isKycVerified = false;

    @Builder.Default
    private Integer bidCredits = 10;

    private String otp;
    private java.time.LocalDateTime otpExpiry;
    @Builder.Default
    private boolean verified = false;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
    }
}
