package com.example.quickFood.repositories;

import com.example.quickFood.dto.IdNameImgDto;
import com.example.quickFood.enums.PaymentMethod;
import com.example.quickFood.models.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, String> {
    Optional<Restaurant> findById(String resId);

    List<Restaurant> findByOwnerId(String owner);

    @Query("SELECT new com.example.quickFood.dto.IdNameImgDto(r.id, r.name, r.image) FROM Restaurant r WHERE LOWER(r.name) LIKE %:name%")
    List<IdNameImgDto> searchRestaurant(@Param("name") String name);

    @Query("SELECT r.name FROM Restaurant r WHERE r.id = :id")
    String restaurantName(@Param("id") String id);

    @Query("SELECT SUM(o.price) FROM Order o " +
            "WHERE o.restaurant.id = :restaurantId " +
            "AND o.paymentMethod <> :paymentMethod " +
            "AND o.orderPlaced BETWEEN :startOfDay AND :endOfDay")
    Double getRestaurantSale(@Param("restaurantId") String restaurantId,
                             @Param("startOfDay") Timestamp startOfDay,
                             @Param("endOfDay") Timestamp endOfDay,
                             @Param("paymentMethod") PaymentMethod paymentMethod);

    @Query("SELECT NEW org.springframework.data.util.Pair(od.menu.name, SUM(od.quantity) * od.menu.price) " +
            "FROM OrderDetails od WHERE od.order.restaurant.id = :restaurantId " +
            "AND od.order.paymentMethod <> :paymentMethod " +
            "GROUP BY od.menu.name, od.menu.price " +
            "ORDER BY SUM(od.quantity) * od.menu.price DESC")
    List<Pair<String, Double>> findTopSoldItems(@Param("restaurantId") String restaurantId,
                                                @Param("paymentMethod") PaymentMethod paymentMethod);

    @Query("SELECT NEW org.springframework.data.util.Pair(r.menu.name, AVG(r.rating)) " +
            "FROM Review r WHERE r.menu.restaurant.id = :restaurantId " +
            "GROUP BY r.menu.name " +
            "ORDER BY AVG(r.rating) DESC")
    List<Pair<String, Double>> findTopReviewedItems(@Param("restaurantId") String restaurantId);

    @Query("SELECT COUNT(O) FROM Order O WHERE O.restaurant.id = :restaurantId AND O.isPrepared = TRUE AND O.deliveryTaken IS NULL AND O.cancelled IS NULL")
    Double findPreparedPendingOrdersToday(@Param("restaurantId") String restaurantId);

    @Query("SELECT COUNT(O) FROM Order O WHERE O.restaurant.id = :restaurantId AND O.isPrepared = FALSE AND O.deliveryTaken IS NULL AND O.cancelled IS NULL")
    Double findUnPreparedPendingOrdersToday(@Param("restaurantId") String restaurantId);

    @Query("SELECT NEW com.example.quickFood.dto.IdNameImgDto(r.id, r.name, r.image) FROM Restaurant r")
    List<IdNameImgDto> getAllRestaurants();

    @Query("SELECT SUM(o.price) FROM Order o " +
            "WHERE o.orderPlaced BETWEEN :startOfDay AND :endOfDay " +
            "AND o.paymentMethod <> :paymentMethod")
    Double getSale(@Param("startOfDay") Timestamp startOfDay,
                   @Param("endOfDay") Timestamp endOfDay,
                   @Param("paymentMethod") PaymentMethod paymentMethod);

    @Query("SELECT NEW org.springframework.data.util.Pair(o.restaurant.name, SUM(o.price)) FROM Order o " +
            "WHERE o.paymentMethod <> :paymentMethod " +
            "GROUP BY o.restaurant.name " +
            "ORDER BY SUM(o.price) DESC")
    List<Pair<String, Double>> topSellingRestaurants(@Param("paymentMethod") PaymentMethod paymentMethod);

    @Query("SELECT NEW org.springframework.data.util.Pair(r.menu.restaurant.name, AVG(r.rating)) " +
            "FROM Review r " +
            "GROUP BY r.menu.restaurant.name " +
            "ORDER BY AVG(r.rating) DESC")
    List<Pair<String, Double>> topReviewedRestaurants();
}
