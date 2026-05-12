package com.shinefiling.it.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String senderEmail;
    private String receiverEmail;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    private LocalDateTime sentAt;
    
    @Builder.Default
    private boolean isRead = false;

    @PrePersist
    protected void onSend() {
        sentAt = LocalDateTime.now();
    }
}
