package com.shinefiling.it.repository;

import com.shinefiling.it.model.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByFreelancerEmailOrderByCreatedAtDesc(String email);
}
