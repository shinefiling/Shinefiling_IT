package com.shinefiling.it.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "bids")
@Data
public class Bid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String freelancerEmail;
    private Long projectId;
    private String projectTitle;
    private Double bidAmount;
    private String status; // OPEN, AWARDED, CLOSED
    private Integer competitorCount;
    private Double avgBidAmount;
    private String bidRank; // e.g., Top 10%
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
