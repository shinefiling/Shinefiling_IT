package com.shinefiling.it.repository;

import com.shinefiling.it.model.Transaction;
import com.shinefiling.it.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserEmailOrderByCreatedAtDesc(String userEmail);
    List<Transaction> findAllByUserOrderByCreatedAtDesc(User user);
}
