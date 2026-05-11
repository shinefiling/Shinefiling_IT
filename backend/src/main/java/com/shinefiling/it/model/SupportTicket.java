package com.shinefiling.it.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "support_tickets")
@Data
public class SupportTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;
    private String topic;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String status; // OPEN, RESOLVED, CLOSED
    private String priority; // LOW, MEDIUM, HIGH
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = "OPEN";
    }
}
