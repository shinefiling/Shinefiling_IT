package com.shinefiling.it.repository;

import com.shinefiling.it.model.KycSubmission;
import com.shinefiling.it.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface KycSubmissionRepository extends JpaRepository<KycSubmission, Long> {
    Optional<KycSubmission> findTopByUserOrderBySubmittedAtDesc(User user);
    List<KycSubmission> findAllByStatus(String status);
}
