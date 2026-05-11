package com.shinefiling.it.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "kyc_submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KycSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String documentType; // AADHAAR, PAN, PASSPORT, DRIVING_LICENSE
    private String frontImageUrl;
    private String backImageUrl;
    private String selfieUrl;
    
    private String status; // PENDING, APPROVED, REJECTED
    private String rejectionReason;

    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
        if (status == null) status = "PENDING";
    }
}
