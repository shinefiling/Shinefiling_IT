package com.shinefiling.it.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String userEmail; // Keep this for dashboard compatibility
    private String title;
    private Double amount;
    private String type; // IN, OUT, FEE, DEPOSIT, WITHDRAW
    private String status; // SUCCESS, PENDING, FAILED, COMPLETED
    private String referenceId;
    private String description;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (user != null && userEmail == null) {
            userEmail = user.getEmail();
        }
    }
}
