package com.shinefiling.it.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "notification_templates")
public class NotificationTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // e.g. "EMAIL_VERIFICATION_OTP"
    private String type; // EMAIL, WHATSAPP, SMS

    private String subject; // Only for Email

    @Column(columnDefinition = "TEXT")
    private String body; // Content with {{placeholders}}

    // Comma separated list of variables e.g. "otp"
    private String variables;

    private boolean active = true;
    private LocalDateTime updatedAt = LocalDateTime.now();
}
