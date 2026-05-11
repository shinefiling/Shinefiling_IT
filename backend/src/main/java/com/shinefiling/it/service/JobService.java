package com.shinefiling.it.service;

import com.shinefiling.it.model.Job;
import com.shinefiling.it.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public List<Job> getFeaturedJobs() {
        return jobRepository.findByFeaturedTrue();
    }

    public Job createJob(Job job) {
        return jobRepository.save(job);
    }

    public List<Job> searchJobs(String query, List<String> categories, List<String> englishLevels, Double maxPrice) {
        return jobRepository.searchJobs(query, categories, englishLevels, maxPrice);
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id).orElse(null);
    }
    

}
