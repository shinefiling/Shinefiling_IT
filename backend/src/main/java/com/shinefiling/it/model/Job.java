package com.shinefiling.it.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String company;

    @Column(name = "user_email")
    private String userEmail;

    @Column(nullable = false)
    private Double price;

    private String type; // Hourly, Fixed

    @ElementCollection
    @CollectionTable(name = "job_tags", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "tag")
    private List<String> tags;

    private String expiry; // Store as string for now to match UI "EXPIRED", "1 Month"

    private String proposals; // e.g., "1 Received"

    private String location;

    private String experience; // e.g., "1-3 Years"
    private String role; // e.g., "Full Stack Developer"
    private String category; // e.g., "Web Development"
    private String englishLevel; // e.g., "Professional", "Fluent"
    
    private boolean featured;


    @Column(name = "posted_at")
    private LocalDateTime postedAt;

    @PrePersist
    protected void onPost() {
        postedAt = LocalDateTime.now();
    }
}
