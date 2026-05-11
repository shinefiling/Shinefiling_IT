package com.shinefiling.it.repository;

import com.shinefiling.it.model.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findByUserEmailOrderByCreatedAtDesc(String email);
}
