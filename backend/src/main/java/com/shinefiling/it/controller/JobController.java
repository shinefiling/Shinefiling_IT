package com.shinefiling.it.controller;

import com.shinefiling.it.model.Job;
import com.shinefiling.it.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class JobController {

    @Autowired
    private JobService jobService;

    @Autowired
    private com.shinefiling.it.repository.UserRepository userRepository;

    @Autowired
    private com.shinefiling.it.service.NotificationService notificationService;

    @GetMapping
    public List<Job> getJobs() {
        return jobService.getAllJobs();
    }

    @PostMapping
    public Job postJob(@RequestBody Job job) {
        return jobService.createJob(job);
    }

    @GetMapping("/search")
    public List<Job> searchJobs(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) List<String> categories,
            @RequestParam(required = false) List<String> englishLevels,
            @RequestParam(required = false) Double maxPrice) {
        return jobService.searchJobs(query, categories, englishLevels, maxPrice);
    }

    @GetMapping("/{id}")
    public Job getJobById(@PathVariable Long id) {
        return jobService.getJobById(id);
    }

    @GetMapping("/client/{email}")
    public List<Job> getJobsByClientEmail(@PathVariable String email) {
        return jobService.getJobsByUserEmail(email);
    }

    @PostMapping("/{jobId}/invite/{freelancerId}")
    public ResponseEntity<String> inviteFreelancer(@PathVariable Long jobId, @PathVariable Long freelancerId) {
        Job job = jobService.getJobById(jobId);
        if (job == null) return ResponseEntity.notFound().build();

        userRepository.findById(freelancerId).ifPresent(freelancer -> {
            notificationService.createNotification(
                freelancer,
                "Job Invitation",
                "You have been invited to apply for the project: " + job.getTitle()
            );
        });

        return ResponseEntity.ok("Invitation sent successfully");
    }
}
