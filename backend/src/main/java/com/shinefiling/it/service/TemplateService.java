package com.shinefiling.it.service;

import com.shinefiling.it.model.NotificationTemplate;
import com.shinefiling.it.repository.NotificationTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class TemplateService {

    @Autowired
    private NotificationTemplateRepository templateRepository;

    @Autowired
    private EmailService emailService;

    public void sendTemplatedEmail(String to, String templateName, Map<String, String> variables) {
        Optional<NotificationTemplate> templateOpt = templateRepository.findByName(templateName);
        if (templateOpt.isPresent()) {
            NotificationTemplate template = templateOpt.get();
            if (template.isActive() && "EMAIL".equalsIgnoreCase(template.getType())) {
                String subject = replacePlaceholders(template.getSubject(), variables);
                String body = replacePlaceholders(template.getBody(), variables);
                String htmlLayout = wrapWithLayout(subject, body);
                emailService.sendEmail(to, subject, htmlLayout);
            }
        } else {
            System.err.println("Template not found: " + templateName);
        }
    }

    private String replacePlaceholders(String content, Map<String, String> variables) {
        if (content == null) return "";
        for (Map.Entry<String, String> entry : variables.entrySet()) {
            content = content.replace("{{" + entry.getKey() + "}}", entry.getValue());
        }
        return content;
    }

    private String wrapWithLayout(String title, String body) {
        // Replace newlines with <br> in body if it's text-based
        String htmlBody = body.replace("\n", "<br>");

        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "  body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f7f6; color: #333333; }" +
                "  .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }" +
                "  .header { background-color: #ffffff; padding: 30px; text-align: center; border-bottom: 1px solid #f1f5f9; }" +
                "  .content { padding: 40px; line-height: 1.6; font-size: 16px; }" +
                "  .footer { background-color: #f8fafc; padding: 30px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }" +
                "  .btn { display: inline-block; padding: 12px 24px; background-color: #F97316; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }" +
                "  .social-links { margin: 20px 0; text-align: center; }" +
                "  .social-links a { margin: 0 10px; text-decoration: none; display: inline-block; }" +
                "  .auto-notice { margin-top: 20px; padding-top: 20px; border-top: 1px dashed #cbd5e1; font-style: italic; color: #94a3b8; }" +
                "  h1 { font-size: 22px; margin-bottom: 20px; color: #043E52; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "  <div class='container'>" +
                "    <div class='header'>" +
                "      <img src='https://shinefiling.com/logo.png' alt='ShineFiling' style='height: 60px;'>" +
                "    </div>" +
                "    <div class='content'>" +
                "      <h1>" + title + "</h1>" +
                "      <div>" + htmlBody + "</div>" +
                "    </div>" +
                "    <div class='footer'>" +
                "      <div class='social-links'>" +
                "        <a href='#'><img src='https://cdn-icons-png.flaticon.com/512/733/733547.png' width='24' height='24' style='vertical-align:middle;margin:0 10px;'></a>" +
                "        <a href='#'><img src='https://cdn-icons-png.flaticon.com/512/2111/2111463.png' width='24' height='24' style='vertical-align:middle;margin:0 10px;'></a>" +
                "        <a href='#'><img src='https://cdn-icons-png.flaticon.com/512/3536/3536505.png' width='24' height='24' style='vertical-align:middle;margin:0 10px;'></a>" +
                "      </div>" +
                "      <div style='margin-top:15px;'>&copy; 2026 ShineFiling. All rights reserved.</div>" +
                "      <div class='auto-notice'>" +
                "        This is a system auto-generated email. Please do not reply to this email directly." +
                "      </div>" +
                "    </div>" +
                "  </div>" +
                "</body>" +
                "</html>";
    }
}
