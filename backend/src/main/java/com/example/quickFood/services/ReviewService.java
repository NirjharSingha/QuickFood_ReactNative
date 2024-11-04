package com.example.quickFood.services;

import com.example.quickFood.dto.RatingDto;
import com.example.quickFood.dto.RatingPage;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ReviewService {
    ResponseEntity<RatingPage> getReviewPage(int orderId);

    ResponseEntity<String> submitReview(int orderId, List<RatingDto> rating);

    ResponseEntity<Double> getRestaurantRating(String restaurantId);

    ResponseEntity<Double> getMenuRating(int menuId);
}
