package com.shinefiling.it.repository;

import com.shinefiling.it.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByClientId(Long clientId);

    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN p.skills s WHERE " +
           "(:query IS NULL OR :query = '' OR LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:minPrice IS NULL OR p.budgetAmount >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.budgetAmount <= :maxPrice) AND " +
           "(:skills IS NULL OR s IN :skills) AND " +
           "(:category IS NULL OR :category = '' OR LOWER(p.category) = LOWER(:category)) AND " +
           "(:experienceLevel IS NULL OR :experienceLevel = '' OR LOWER(p.experienceLevel) = LOWER(:experienceLevel))")
    List<Project> searchProjects(@Param("query") String query, 
                                @Param("minPrice") Double minPrice, 
                                @Param("maxPrice") Double maxPrice,
                                @Param("skills") List<String> skills,
                                @Param("category") String category,
                                @Param("experienceLevel") String experienceLevel);
}
