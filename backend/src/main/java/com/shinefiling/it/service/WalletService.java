package com.shinefiling.it.service;

import com.shinefiling.it.model.Transaction;
import com.shinefiling.it.model.User;
import com.shinefiling.it.repository.TransactionRepository;
import com.shinefiling.it.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WalletService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public Double getBalance(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getWalletBalance() != null ? user.getWalletBalance() : 0.0;
    }

    @Transactional
    public void deposit(Long userId, Double amount, String referenceId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Double currentBalance = user.getWalletBalance() != null ? user.getWalletBalance() : 0.0;
        user.setWalletBalance(currentBalance + amount);
        userRepository.save(user);

        Transaction tx = Transaction.builder()
                .user(user)
                .amount(amount)
                .type("DEPOSIT")
                .status("SUCCESS")
                .referenceId(referenceId)
                .description("Wallet Deposit via Razorpay")
                .build();
        transactionRepository.save(tx);
    }

    public List<Transaction> getTransactionHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return transactionRepository.findAllByUserOrderByCreatedAtDesc(user);
    }
}
