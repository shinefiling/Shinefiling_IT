package com.shinefiling.it.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id")
    private User client;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String role;
    private String category;
    private String experienceLevel;
    private String duration;

    @ElementCollection
    @CollectionTable(name = "project_skills", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "skill")
    private List<String> skills;

    private String paymentType; // fixed, hourly
    private String currency;
    private Double budgetAmount;
    private String projectType; // standard, recruiter

    @ElementCollection
    @CollectionTable(name = "project_upgrades", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "upgrade")
    private List<String> upgrades;

    @Column(name = "posted_at")
    private LocalDateTime postedAt;

    @Builder.Default
    private Integer bidCount = 0;

    @PrePersist
    protected void onPost() {
        postedAt = LocalDateTime.now();
    }

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Proposal> proposals;
}
