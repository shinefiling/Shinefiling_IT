package com.shinefiling.it.repository;

import com.shinefiling.it.model.NotificationTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface NotificationTemplateRepository extends JpaRepository<NotificationTemplate, Long> {
    List<NotificationTemplate> findByType(String type);
    Optional<NotificationTemplate> findByName(String name);
}
