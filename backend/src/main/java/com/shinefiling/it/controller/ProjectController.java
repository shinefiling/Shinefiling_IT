package com.shinefiling.it.controller;

import com.shinefiling.it.model.Project;
import com.shinefiling.it.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @PostMapping("/post")
    public ResponseEntity<Project> postProject(@RequestBody Project project) {
        Project savedProject = projectRepository.save(project);
        return ResponseEntity.ok(savedProject);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectRepository.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Project>> getProjectsByClientId(@PathVariable Long clientId) {
        return ResponseEntity.ok(projectRepository.findByClientId(clientId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Project>> searchProjects(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) List<String> skills,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String experienceLevel) {
        
        // Fix for 400 error: if skills is empty, set to null to avoid "IN ()" SQL error
        List<String> skillsToSearch = (skills != null && skills.isEmpty()) ? null : skills;
        
        return ResponseEntity.ok(projectRepository.searchProjects(query, minPrice, maxPrice, skillsToSearch, category, experienceLevel));
    }
}
