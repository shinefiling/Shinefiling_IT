package com.shinefiling.it.repository;

import com.shinefiling.it.model.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    News findTopByOrderByUpdatedAtDesc();
}
