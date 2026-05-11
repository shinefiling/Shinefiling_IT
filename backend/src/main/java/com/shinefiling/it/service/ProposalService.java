package com.shinefiling.it.service;

import com.shinefiling.it.model.Project;
import com.shinefiling.it.model.Proposal;
import com.shinefiling.it.model.User;
import com.shinefiling.it.repository.ProjectRepository;
import com.shinefiling.it.repository.ProposalRepository;
import com.shinefiling.it.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProposalService {
    private final ProposalRepository proposalRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public Proposal submitProposal(Long projectId, Long freelancerId, Proposal proposalRequest) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        User freelancer = userRepository.findById(freelancerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Proposal proposal = Proposal.builder()
                .project(project)
                .freelancer(freelancer)
                .bidAmount(proposalRequest.getBidAmount())
                .deliveryTime(proposalRequest.getDeliveryTime())
                .coverLetter(proposalRequest.getCoverLetter())
                .status("PENDING")
                .build();

        project.setBidCount((project.getBidCount() == null ? 0 : project.getBidCount()) + 1);
        projectRepository.save(project);

        Proposal savedProposal = proposalRepository.save(proposal);

        // Notify project owner
        if (project.getClient() != null) {
            String freelancerName = freelancer.getFullName() != null ? freelancer.getFullName() : freelancer.getUsername();
            String title = "New Bidding Project Alert";
            String message = freelancerName + " has placed a bid on your project: " + project.getTitle();
            notificationService.createNotification(project.getClient(), title, message);
        }

        // Notify freelancer (Confirmation)
        notificationService.createNotification(freelancer, "Proposal Submitted", "Your proposal for '" + project.getTitle() + "' has been successfully submitted.");

        return savedProposal;
    }

    public List<Proposal> getProposalsByProject(Long projectId) {
        return proposalRepository.findByProjectId(projectId);
    }

    public List<Proposal> getProposalsByFreelancer(Long freelancerId) {
        return proposalRepository.findByFreelancerId(freelancerId);
    }

    @Transactional
    public Proposal updateProposalStatus(Long proposalId, String status) {
        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found"));
        proposal.setStatus(status);
        return proposalRepository.save(proposal);
    }
}
