package com.example.quickFood.repositories;

import com.example.quickFood.models.RiderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RiderStatusRepository extends JpaRepository<RiderStatus, String> {
    @Query(value = "SELECT id FROM rider_status WHERE is_available = true LIMIT 1", nativeQuery = true)
    String findAvailableRider();
}
