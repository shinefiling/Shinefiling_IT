package com.shinefiling.it.repository;

import com.shinefiling.it.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByFeaturedTrue();
    List<Job> findByTitleContainingIgnoreCase(String title);
    List<Job> findByUserEmail(String userEmail);

    @Query("SELECT j FROM Job j WHERE " +
           "(:query IS NULL OR :query = '' OR LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:categories IS NULL OR j.category IN :categories) AND " +
           "(:englishLevels IS NULL OR j.englishLevel IN :englishLevels) AND " +
           "(:maxPrice IS NULL OR j.price <= :maxPrice)")
    List<Job> searchJobs(@Param("query") String query, 
                         @Param("categories") List<String> categories, 
                         @Param("englishLevels") List<String> englishLevels,
                         @Param("maxPrice") Double maxPrice);
}
