package com.shinefiling.it.repository;

import com.shinefiling.it.model.Escrow;
import com.shinefiling.it.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EscrowRepository extends JpaRepository<Escrow, Long> {
    List<Escrow> findAllByClient(User client);
    List<Escrow> findAllByFreelancer(User freelancer);
    List<Escrow> findAllByProjectId(Long projectId);
}
