package com.shinefiling.it.repository;

import com.shinefiling.it.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByClientEmail(String clientEmail);
    List<JobApplication> findByFreelancerId(Long freelancerId);
}
