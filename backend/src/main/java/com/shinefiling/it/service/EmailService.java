package com.shinefiling.it.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${mail.from.address}")
    private String fromEmail;

    @Async
    public void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);

            mailSender.send(message);
            log.info("Email sent successfully to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}. FALLBACK: Logging email content below.", to, e.getMessage());
            log.info("\n------------------------------------------------\n" +
                     "DEMO EMAIL LOG (Mail Server not connected)\n" +
                     "To: {}\n" +
                     "Subject: {}\n" +
                     "Body: \n{}\n" +
                     "------------------------------------------------", 
                     to, subject, body);
        }
    }

    public void sendWelcomeEmail(String to, String name) {
        String subject = "Welcome to Shinefiling - Your Technical Journey Begins!";
        String content = "Hello " + name + ",\n\n" +
                "Thank you for completing your professional profile on Shinefiling.\n" +
                "Our team is now reviewing your expertise. You will be notified once your profile is verified.\n\n" +
                "Best Regards,\n" +
                "The Shinefiling Team";
        sendEmail(to, subject, content);
    }

    public String sendOtpEmail(String to) {
        // Generate a random 6-digit OTP
        String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
        
        String subject = "Shinefiling Verification Code: " + otp;
        String content = "Hello,\n\n" +
                "Your One-Time Password (OTP) for Shinefiling account verification is:\n\n" +
                "[" + otp + "]\n\n" +
                "This code is valid for 10 minutes. Please do not share it with anyone.\n\n" +
                "Best Regards,\n" +
                "Shinefiling Security Team";
                
        sendEmail(to, subject, content);
        return otp;
    }
}
