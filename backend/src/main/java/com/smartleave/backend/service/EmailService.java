package com.smartleave.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async("emailTaskExecutor")
    public void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("dummy@gmail.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            
            // In a real application, this would send the email.
            // mailSender.send(message);
            log.info("Email sent to: {} with subject: {}", to, subject);
            log.info("Body: {}", text);
        } catch (Exception e) {
            log.error("Failed to send email to: {}", to, e);
        }
    }

    public void sendLeaveApprovalEmail(String to, String applicantName, String status) {
        String subject = "Leave Application " + status;
        String text = String.format("Dear %s,\n\nYour leave application has been %s.\n\nBest regards,\nHR Team", applicantName, status);
        sendEmail(to, subject, text);
    }

    public void sendComplaintResolutionEmail(String to, String applicantName, String subjectStr) {
        String subject = "Complaint Resolved: " + subjectStr;
        String text = String.format("Dear %s,\n\nYour complaint regarding '%s' has been successfully resolved.\n\nBest regards,\nHR Team", applicantName, subjectStr);
        sendEmail(to, subject, text);
    }
}
