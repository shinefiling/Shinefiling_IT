package com.shinefiling.it.config;

import com.shinefiling.it.model.NotificationTemplate;
import com.shinefiling.it.repository.NotificationTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private NotificationTemplateRepository templateRepository;

    @Override
    public void run(String... args) throws Exception {
        initializeTemplates();
    }

    private void initializeTemplates() {
        createOrUpdateTemplate("EMAIL_VERIFICATION_OTP", "EMAIL", "Verify your email - ShineFiling",
                "Hello,\n\n" +
                "Your One-Time Password (OTP) for account verification is:\n\n" +
                "<strong style='font-size: 24px; color: #F97316;'>{{otp}}</strong>\n\n" +
                "This code expires in 10 minutes. If you did not request this, please ignore this email.\n\n" +
                "Best Regards,\n" +
                "The ShineFiling Team", "otp");
        
        createOrUpdateTemplate("WELCOME_EMAIL", "EMAIL", "Welcome to ShineFiling IT Freelancer Platform",
                "Hello {{name}},\n\n" +
                "Welcome to ShineFiling! We are excited to have you on board. Your professional journey starts here.\n\n" +
                "Please complete your profile to start receiving job opportunities.\n\n" +
                "Best Regards,\n" +
                "The ShineFiling Team", "name");

        createOrUpdateTemplate("PASSWORD_RESET_OTP", "EMAIL", "Reset your password - ShineFiling",
                "Hello,\n\n" +
                "Your One-Time Password (OTP) for resetting your password is:\n\n" +
                "<strong style='font-size: 24px; color: #F97316;'>{{otp}}</strong>\n\n" +
                "This code expires in 10 minutes. If you did not request this, please ignore this email and secure your account.\n\n" +
                "Best Regards,\n" +
                "The ShineFiling Team", "otp");
    }

    private void createOrUpdateTemplate(String name, String type, String subject, String body, String variables) {
        templateRepository.findByName(name).ifPresentOrElse(
            template -> {
                template.setSubject(subject);
                template.setBody(body);
                template.setVariables(variables);
                template.setUpdatedAt(LocalDateTime.now());
                templateRepository.save(template);
            },
            () -> {
                NotificationTemplate template = new NotificationTemplate();
                template.setName(name);
                template.setType(type);
                template.setSubject(subject);
                template.setBody(body);
                template.setVariables(variables);
                template.setActive(true);
                template.setUpdatedAt(LocalDateTime.now());
                templateRepository.save(template);
            }
        );
    }
}
