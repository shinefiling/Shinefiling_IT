package com.shinefiling.it.controller;

import com.shinefiling.it.model.JobApplication;
import com.shinefiling.it.repository.JobApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-applications")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class JobApplicationController {

    @Autowired
    private JobApplicationRepository repository;

    @PostMapping
    public JobApplication apply(@RequestBody JobApplication application) {
        return repository.save(application);
    }

    @GetMapping
    public List<JobApplication> getAllApplications() {
        return repository.findAll();
    }

    @GetMapping("/job/{jobId}")
    public List<JobApplication> getApplicationsByJobId(@PathVariable Long jobId) {
        return repository.findAll().stream()
                .filter(a -> a.getJobId().equals(jobId))
                .toList();
    }

    @GetMapping("/client/{email}")
    public List<JobApplication> getApplicationsByClientEmail(@PathVariable String email) {
        return repository.findByClientEmail(email);
    }

    @GetMapping("/freelancer/{id}")
    public List<JobApplication> getApplicationsByFreelancerId(@PathVariable Long id) {
        return repository.findByFreelancerId(id);
    }
}
