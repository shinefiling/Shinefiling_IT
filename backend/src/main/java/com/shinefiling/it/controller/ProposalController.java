package com.shinefiling.it.controller;

import com.shinefiling.it.model.Proposal;
import com.shinefiling.it.service.ProposalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proposals")
@RequiredArgsConstructor
public class ProposalController {
    private final ProposalService proposalService;

    @PostMapping("/project/{projectId}/freelancer/{freelancerId}")
    public ResponseEntity<Proposal> submitProposal(
            @PathVariable Long projectId,
            @PathVariable Long freelancerId,
            @RequestBody Proposal proposal) {
        return ResponseEntity.ok(proposalService.submitProposal(projectId, freelancerId, proposal));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Proposal>> getProposalsByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(proposalService.getProposalsByProject(projectId));
    }

    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<List<Proposal>> getProposalsByFreelancer(@PathVariable Long freelancerId) {
        return ResponseEntity.ok(proposalService.getProposalsByFreelancer(freelancerId));
    }

    @PatchMapping("/{proposalId}/status")
    public ResponseEntity<Proposal> updateProposalStatus(
            @PathVariable Long proposalId,
            @RequestParam String status) {
        return ResponseEntity.ok(proposalService.updateProposalStatus(proposalId, status));
    }

    @PostMapping("/{proposalId}/accept")
    public ResponseEntity<Proposal> acceptProposal(@PathVariable Long proposalId) {
        return ResponseEntity.ok(proposalService.acceptProposal(proposalId));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Proposal>> getProposalsByClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(proposalService.getProposalsByClient(clientId));
    }
}
