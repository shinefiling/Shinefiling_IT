package com.shinefiling.it.controller;

import com.shinefiling.it.repository.ProjectRepository;
import com.shinefiling.it.repository.ProposalRepository;
import com.shinefiling.it.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProposalRepository proposalRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalUsers = userRepository.count();
        long totalProjects = projectRepository.count();
        long totalProposals = proposalRepository.count();
        
        long totalFreelancers = userRepository.findAll().stream()
                .filter(u -> "FREELANCER".equalsIgnoreCase(u.getUserRole()))
                .count();
        long totalClients = userRepository.findAll().stream()
                .filter(u -> "CLIENT".equalsIgnoreCase(u.getUserRole()))
                .count();

        stats.put("totalUsers", totalUsers);
        stats.put("totalProjects", totalProjects);
        stats.put("totalProposals", totalProposals);
        stats.put("totalFreelancers", totalFreelancers);
        stats.put("totalClients", totalClients);
        stats.put("totalRevenue", totalProjects * 500); // Mock revenue
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/projects")
    public ResponseEntity<?> getAllProjects() {
        return ResponseEntity.ok(projectRepository.findAll());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
