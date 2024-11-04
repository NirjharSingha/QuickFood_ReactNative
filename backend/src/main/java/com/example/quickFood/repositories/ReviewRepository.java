package com.example.quickFood.repositories;

import com.example.quickFood.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    @Query(value = "SELECT AVG(rating) FROM reviews WHERE menu_id IN (SELECT id FROM menu WHERE restaurant_id = :restaurantId)", nativeQuery = true)
    Double getRestaurantRating(@Param("restaurantId") String restaurantId);

    @Query(value = "SELECT AVG(rating) FROM reviews WHERE menu_id = :menuId", nativeQuery = true)
    Double getMenuRating(@Param("menuId") int menuId);
}
