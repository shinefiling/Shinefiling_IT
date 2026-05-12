package com.shinefiling.it.repository;

import com.shinefiling.it.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByReceiverEmailOrderBySentAtDesc(String receiverEmail);
    
    @Query("SELECT m FROM ChatMessage m WHERE (m.senderEmail = :user1 AND m.receiverEmail = :user2) OR (m.senderEmail = :user2 AND m.receiverEmail = :user1) ORDER BY m.sentAt ASC")
    List<ChatMessage> findConversation(@Param("user1") String user1, @Param("user2") String user2);
}
