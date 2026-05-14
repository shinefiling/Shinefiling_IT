package com.shinefiling.it.repository; 

import com.shinefiling.it.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByEmail(String email);
    Optional<Profile> findByUsername(String username);

    @Query("SELECT DISTINCT p FROM Profile p LEFT JOIN p.skills s WHERE " +
           "(p.userRole = 'FREELANCER' OR p.userRole IS NULL) AND " +
           "(:query IS NULL OR :query = '' OR LOWER(p.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.professionalHeadline) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:minRate IS NULL OR p.hourlyRate >= :minRate) AND " +
           "(:maxRate IS NULL OR p.hourlyRate <= :maxRate) AND " +
           "(:skills IS NULL OR s IN :skills) AND " +
           "(:location IS NULL OR :location = '' OR LOWER(p.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:industry IS NULL OR :industry = '' OR LOWER(p.industry) = LOWER(:industry))")
    List<Profile> searchProfiles(@Param("query") String query, 
                                @Param("minRate") Double minRate, 
                                @Param("maxRate") Double maxRate,
                                @Param("skills") List<String> skills,
                                @Param("location") String location,
                                @Param("industry") String industry);
}
