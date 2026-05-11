package com.shinefiling.it.controller;

import com.shinefiling.it.model.KycSubmission;
import com.shinefiling.it.service.KycService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/kyc")
public class KycController {

    @Autowired
    private KycService kycService;

    @PostMapping("/submit")
    public ResponseEntity<?> submit(@RequestBody Map<String, String> payload) {
        try {
            Long userId = Long.parseLong(payload.get("userId"));
            String docType = payload.get("documentType");
            String frontUrl = payload.get("frontImageUrl");
            String backUrl = payload.get("backImageUrl");
            String selfieUrl = payload.get("selfieUrl");

            KycSubmission submission = kycService.submitKyc(userId, docType, frontUrl, backUrl, selfieUrl);
            return ResponseEntity.ok(submission);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/admin/pending")
    public ResponseEntity<?> getPending() {
        return ResponseEntity.ok(kycService.getPendingSubmissions());
    }

    @PostMapping("/admin/review")
    public ResponseEntity<?> review(@RequestBody Map<String, String> payload) {
        try {
            Long submissionId = Long.parseLong(payload.get("submissionId"));
            String status = payload.get("status");
            String reason = payload.get("reason");

            kycService.reviewKyc(submissionId, status, reason);
            return ResponseEntity.ok(Map.of("message", "Review completed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
