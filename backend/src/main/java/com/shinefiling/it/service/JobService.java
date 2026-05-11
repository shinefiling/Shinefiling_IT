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
    
    public void seedJobs() {
        if (jobRepository.count() == 0) {
            Job j1 = Job.builder()
                .title("Senior Frontend Developer (React)")
                .description("We are looking for an expert React developer to lead our dashboard redesign. You will be responsible for architecture and performance optimization.")
                .company("ShineFiling Tech")
                .userEmail("shinefiling@gmail.com")
                .price(45000.0)
                .type("Fixed")
                .location("Bangalore / Remote")
                .experience("3-5 Years")
                .category("Web Development")
                .proposals("12 Received")
                .expiry("15 Days")
                .featured(true)
                .build();
                
            Job j2 = Job.builder()
                .title("Full Stack Java Engineer")
                .description("Join our core banking team to build secure and scalable microservices using Spring Boot and PostgreSQL.")
                .company("Global FinTech")
                .userEmail("admin@shinefiling.com")
                .price(65000.0)
                .type("Fixed")
                .location("Chennai")
                .experience("5+ Years")
                .category("Backend")
                .proposals("8 Received")
                .expiry("20 Days")
                .featured(true)
                .build();

            jobRepository.save(j1);
            jobRepository.save(j2);
        }
    }
}
