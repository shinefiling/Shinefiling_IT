package com.shinefiling.it.controller;

import com.shinefiling.it.model.Job;
import com.shinefiling.it.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class JobController {

    @Autowired
    private JobService jobService;

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
}
