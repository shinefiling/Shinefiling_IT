package com.shinefiling.it.controller;

import com.shinefiling.it.model.*;
import com.shinefiling.it.repository.ProfileRepository;
import com.shinefiling.it.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class DashboardController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @GetMapping("/transactions/{email}")
    public List<Transaction> getTransactions(@PathVariable String email) {
        return transactionRepository.findByUserEmailOrderByCreatedAtDesc(email);
    }

    @PostMapping("/transactions")
    public Transaction createTransaction(@RequestBody Transaction transaction) {
        // Update user balance as well
        profileRepository.findByEmail(transaction.getUserEmail()).ifPresent(profile -> {
            Double currentBalance = profile.getWalletBalance() != null ? profile.getWalletBalance() : 0.0;
            if ("IN".equals(transaction.getType())) {
                profile.setWalletBalance(currentBalance + transaction.getAmount());
            } else if ("OUT".equals(transaction.getType())) {
                profile.setWalletBalance(currentBalance - transaction.getAmount());
            }
            profileRepository.save(profile);
        });
        return transactionRepository.save(transaction);
    }
}
