package com.shinefiling.it.service;

import com.shinefiling.it.model.*;
import com.shinefiling.it.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EscrowService {

    @Autowired
    private EscrowRepository escrowRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Transactional
    public Escrow createEscrow(Long projectId, Long clientId, Long freelancerId, Double amount) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        User freelancer = userRepository.findById(freelancerId)
                .orElseThrow(() -> new RuntimeException("Freelancer not found"));
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (client.getWalletBalance() < amount) {
            throw new RuntimeException("Insufficient wallet balance");
        }

        // Deduct from client
        client.setWalletBalance(client.getWalletBalance() - amount);
        userRepository.save(client);

        // Record transaction for client
        Transaction txClient = Transaction.builder()
                .user(client)
                .amount(amount)
                .type("OUT")
                .status("SUCCESS")
                .title("Escrow Payment")
                .description("Funds held in escrow for project: " + project.getTitle())
                .build();
        transactionRepository.save(txClient);

        Escrow escrow = Escrow.builder()
                .project(project)
                .client(client)
                .freelancer(freelancer)
                .amount(amount)
                .status("HELD")
                .build();

        return escrowRepository.save(escrow);
    }

    @Transactional
    public Escrow releaseEscrow(Long escrowId) {
        Escrow escrow = escrowRepository.findById(escrowId)
                .orElseThrow(() -> new RuntimeException("Escrow not found"));

        if (!"HELD".equals(escrow.getStatus())) {
            throw new RuntimeException("Escrow is not in HELD status");
        }

        User freelancer = escrow.getFreelancer();
        freelancer.setWalletBalance((freelancer.getWalletBalance() != null ? freelancer.getWalletBalance() : 0.0) + escrow.getAmount());
        userRepository.save(freelancer);

        // Record transaction for freelancer
        Transaction txFreelancer = Transaction.builder()
                .user(freelancer)
                .amount(escrow.getAmount())
                .type("IN")
                .status("SUCCESS")
                .title("Escrow Release")
                .description("Funds released from escrow for project: " + escrow.getProject().getTitle())
                .build();
        transactionRepository.save(txFreelancer);

        escrow.setStatus("RELEASED");
        return escrowRepository.save(escrow);
    }

    @Transactional
    public Escrow refundEscrow(Long escrowId) {
        Escrow escrow = escrowRepository.findById(escrowId)
                .orElseThrow(() -> new RuntimeException("Escrow not found"));

        if (!"HELD".equals(escrow.getStatus())) {
            throw new RuntimeException("Escrow is not in HELD status");
        }

        User client = escrow.getClient();
        client.setWalletBalance(client.getWalletBalance() + escrow.getAmount());
        userRepository.save(client);

        // Record transaction for client
        Transaction txClient = Transaction.builder()
                .user(client)
                .amount(escrow.getAmount())
                .type("IN")
                .status("SUCCESS")
                .title("Escrow Refund")
                .description("Funds refunded from escrow for project: " + escrow.getProject().getTitle())
                .build();
        transactionRepository.save(txClient);

        escrow.setStatus("REFUNDED");
        return escrowRepository.save(escrow);
    }

    public List<Escrow> getEscrowsByClient(Long clientId) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        return escrowRepository.findAllByClient(client);
    }

    public List<Escrow> getEscrowsByFreelancer(Long freelancerId) {
        User freelancer = userRepository.findById(freelancerId)
                .orElseThrow(() -> new RuntimeException("Freelancer not found"));
        return escrowRepository.findAllByFreelancer(freelancer);
    }
}
