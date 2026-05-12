package com.shinefiling.it.repository;

import com.shinefiling.it.model.Proposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    List<Proposal> findByProjectId(Long projectId);
    List<Proposal> findByFreelancerId(Long freelancerId);

    @Query("SELECT p FROM Proposal p WHERE p.project.client.id = :clientId")
    List<Proposal> findByProjectClientId(@Param("clientId") Long clientId);
}
