package com.example.quickFood.controllers;

import com.example.quickFood.dto.RatingDto;
import com.example.quickFood.dto.RatingPage;
import com.example.quickFood.services.impl.ReviewServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/review")
@CrossOrigin
public class ReviewController {
    @Autowired
    private ReviewServiceImpl reviewService;

    @GetMapping("/getReviewPage")
    public ResponseEntity<RatingPage> getReviewPage(@RequestParam int orderId) {
        return reviewService.getReviewPage(orderId);
    }

    @PostMapping("/submitReview")
    public ResponseEntity<String> submitReview(@RequestParam int orderId, @RequestBody List<RatingDto> rating) {
        return reviewService.submitReview(orderId, rating);
    }

    @GetMapping("/restaurantRating")
    public ResponseEntity<Double> getRestaurantRating(@RequestParam String restaurantId) {
        return reviewService.getRestaurantRating(restaurantId);
    }

    @GetMapping("/menuRating")
    public ResponseEntity<Double> getMenuRating(@RequestParam int menuId) {
        return reviewService.getMenuRating(menuId);
    }
}
