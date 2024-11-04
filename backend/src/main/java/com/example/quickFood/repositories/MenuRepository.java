package com.example.quickFood.repositories;

import com.example.quickFood.models.Menu;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Integer> {
    Optional<Menu> findById(int id);

    List<Menu> findAllByIdIn(List<Integer> ids);

    Page<Menu> findByRestaurantId(String restaurantId, Pageable pageable);

    @Query(value = "SELECT id,\n" +
            "    restaurant_id,\n" +
            "    name,\n" +
            "    price,\n" +
            "    category,\n" +
            "    image,\n" +
            "    quantity\n" +
            "FROM menu\n" +
            "WHERE (\n" +
            "        LOWER(name) LIKE LOWER(CONCAT('%', :nameParam, '%'))\n" +
            "        OR :nameParam = ''\n" +
            "    )\n" +
            "    AND (restaurant_id = :resIdParam)\n" +
            "    AND (\n" +
            "        price <= CAST(:priceParam AS DECIMAL(7, 2))\n" +
            "        OR :priceParam = ''\n" +
            "    )\n" +
            "    AND (\n" +
            "        LOWER(category) LIKE LOWER(:categoryParam)\n" +
            "        OR :categoryParam = ''\n" +
            "    )\n" +
            "    AND (\n" +
            "           (SELECT AVG(rating)\n" +
            "            FROM reviews\n" +
            "            WHERE rating IS NOT NULL\n" +
            "                AND reviews.menu_id = menu.id\n" +
            "        ) >= CAST(:ratingParam AS DECIMAL(3, 2))\n" +
            "        OR :ratingParam = ''\n" +
            "    )\n" +
            "    AND quantity > 0", nativeQuery = true)
    Page<Menu> filteredMenu(@Param("nameParam") String nameParam,
            @Param("resIdParam") String resIdParam,
            @Param("priceParam") String priceParam,
            @Param("categoryParam") String categoryParam,
            @Param("ratingParam") String ratingParam,
            Pageable pageable);

    @Query(value = "SELECT m.quantity FROM menu m WHERE m.id = :menuId", nativeQuery = true)
    Integer findAvailableQuantity(@Param("menuId") Integer menuId);

}
