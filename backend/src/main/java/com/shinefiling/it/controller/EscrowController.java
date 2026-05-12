package com.shinefiling.it.controller;

import com.shinefiling.it.service.EscrowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/escrows")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class EscrowController {

    @Autowired
    private EscrowService escrowService;

    @PostMapping("/create")
    public ResponseEntity<?> createEscrow(@RequestBody Map<String, Object> payload) {
        try {
            Long projectId = Long.parseLong(payload.get("projectId").toString());
            Long clientId = Long.parseLong(payload.get("clientId").toString());
            Long freelancerId = Long.parseLong(payload.get("freelancerId").toString());
            Double amount = Double.parseDouble(payload.get("amount").toString());

            return ResponseEntity.ok(escrowService.createEscrow(projectId, clientId, freelancerId, amount));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{escrowId}/release")
    public ResponseEntity<?> releaseEscrow(@PathVariable Long escrowId) {
        try {
            return ResponseEntity.ok(escrowService.releaseEscrow(escrowId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{escrowId}/refund")
    public ResponseEntity<?> refundEscrow(@PathVariable Long escrowId) {
        try {
            return ResponseEntity.ok(escrowService.refundEscrow(escrowId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<?> getClientEscrows(@PathVariable Long clientId) {
        try {
            return ResponseEntity.ok(escrowService.getEscrowsByClient(clientId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<?> getFreelancerEscrows(@PathVariable Long freelancerId) {
        try {
            return ResponseEntity.ok(escrowService.getEscrowsByFreelancer(freelancerId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
