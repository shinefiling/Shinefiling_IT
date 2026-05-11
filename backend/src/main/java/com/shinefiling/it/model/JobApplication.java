package com.shinefiling.it.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "job_applications")
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long jobId;
    private String jobTitle;
    private String company;

    private String fullName;
    private String email;
    private String phone;
    private String location;

    private String experience;
    @Column(columnDefinition = "TEXT")
    private String skills;
    private String portfolio;
    private String linkedin;

    @Column(columnDefinition = "TEXT")
    private String coverLetter;
    
    private String resumeFileName;

    private LocalDateTime submittedAt;

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
    }
}
