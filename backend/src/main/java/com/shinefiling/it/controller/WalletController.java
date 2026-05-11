package com.shinefiling.it.controller;

import com.shinefiling.it.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @GetMapping("/balance/{userId}")
    public ResponseEntity<?> getBalance(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(Map.of("balance", walletService.getBalance(userId)));
        } catch (Exception e) {
            String errorMsg = (e != null && e.getMessage() != null) ? e.getMessage() : "An unexpected error occurred";
            return ResponseEntity.badRequest().body(Map.of("message", errorMsg));
        }
    }

    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@RequestBody Map<String, Object> payload) {
        try {
            Long userId = Long.parseLong(payload.get("userId").toString());
            Double amount = Double.parseDouble(payload.get("amount").toString());
            String referenceId = payload.get("referenceId").toString();

            walletService.deposit(userId, amount, referenceId);
            return ResponseEntity.ok(Map.of("message", "Deposit successful"));
        } catch (Exception e) {
            String errorMsg = (e != null && e.getMessage() != null) ? e.getMessage() : "An unexpected error occurred";
            return ResponseEntity.badRequest().body(Map.of("message", errorMsg));
        }
    }

    @GetMapping("/transactions/{userId}")
    public ResponseEntity<?> getTransactions(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(walletService.getTransactionHistory(userId));
        } catch (Exception e) {
            String errorMsg = (e != null && e.getMessage() != null) ? e.getMessage() : "An unexpected error occurred";
            return ResponseEntity.badRequest().body(Map.of("message", errorMsg));
        }
    }
}
