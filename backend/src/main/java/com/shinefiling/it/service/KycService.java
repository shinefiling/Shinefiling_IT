package com.shinefiling.it.service;

import com.shinefiling.it.model.KycSubmission;
import com.shinefiling.it.model.Transaction;
import com.shinefiling.it.model.User;
import com.shinefiling.it.repository.KycSubmissionRepository;
import com.shinefiling.it.repository.TransactionRepository;
import com.shinefiling.it.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class KycService {

    @Autowired
    private KycSubmissionRepository kycSubmissionRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public KycSubmission submitKyc(Long userId, String docType, String frontUrl, String backUrl, String selfieUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getWalletBalance() < 99.0) {
            throw new RuntimeException("Insufficient wallet balance for KYC fee (₹99)");
        }

        // Deduct fee
        user.setWalletBalance(user.getWalletBalance() - 99.0);
        user.setKycStatus("PENDING");
        userRepository.save(user);

        // Log transaction
        Transaction feeTx = Transaction.builder()
                .user(user)
                .amount(99.0)
                .type("KYC_FEE")
                .status("SUCCESS")
                .description("Identity Verification Fee")
                .build();
        transactionRepository.save(feeTx);

        // Create submission
        KycSubmission submission = KycSubmission.builder()
                .user(user)
                .documentType(docType)
                .frontImageUrl(frontUrl)
                .backImageUrl(backUrl)
                .selfieUrl(selfieUrl)
                .status("PENDING")
                .submittedAt(LocalDateTime.now())
                .build();

        return kycSubmissionRepository.save(submission);
    }

    public List<KycSubmission> getPendingSubmissions() {
        return kycSubmissionRepository.findAllByStatus("PENDING");
    }

    @Transactional
    public void reviewKyc(Long submissionId, String status, String reason) {
        KycSubmission submission = kycSubmissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        User user = submission.getUser();

        if ("APPROVED".equals(status)) {
            submission.setStatus("APPROVED");
            user.setKycStatus("APPROVED");
            user.setKycVerified(true);
        } else {
            submission.setStatus("REJECTED");
            submission.setRejectionReason(reason);
            user.setKycStatus("REJECTED");
            
            // Refund fee on rejection
            user.setWalletBalance(user.getWalletBalance() + 99.0);
            
            Transaction refundTx = Transaction.builder()
                    .user(user)
                    .amount(99.0)
                    .type("REFUND")
                    .status("SUCCESS")
                    .description("KYC Fee Refunded due to rejection: " + reason)
                    .build();
            transactionRepository.save(refundTx);
        }

        submission.setReviewedAt(LocalDateTime.now());
        kycSubmissionRepository.save(submission);
        userRepository.save(user);
    }
}
