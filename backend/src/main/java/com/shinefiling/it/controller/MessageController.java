package com.shinefiling.it.controller;

import com.shinefiling.it.model.ChatMessage;
import com.shinefiling.it.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class MessageController {

    @Autowired
    private ChatMessageRepository messageRepository;

    @Autowired
    private com.shinefiling.it.repository.UserRepository userRepository;

    @Autowired
    private com.shinefiling.it.service.NotificationService notificationService;

    @GetMapping("/inbox/{email}")
    public List<ChatMessage> getInbox(@PathVariable String email) {
        return messageRepository.findByReceiverEmailOrderBySentAtDesc(email);
    }

    @GetMapping("/conversation")
    public List<ChatMessage> getConversation(@RequestParam String user1, @RequestParam String user2) {
        return messageRepository.findConversation(user1, user2);
    }

    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody ChatMessage message) {
        ChatMessage savedMessage = messageRepository.save(message);
        
        // Create notification for receiver
        userRepository.findByEmail(message.getReceiverEmail()).ifPresent(receiver -> {
            notificationService.createNotification(
                receiver, 
                "New Message", 
                "You received a new message from " + message.getSenderEmail()
            );
        });
        
        return ResponseEntity.ok(savedMessage);
    }
}
