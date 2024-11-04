package com.example.quickFood.services.impl;

import com.example.quickFood.dto.RatingDto;
import com.example.quickFood.dto.RatingPage;
import com.example.quickFood.dto.IdNameImgDto;
import com.example.quickFood.models.Menu;
import com.example.quickFood.models.Order;
import com.example.quickFood.models.OrderDetails;
import com.example.quickFood.models.Review;
import com.example.quickFood.repositories.MenuRepository;
import com.example.quickFood.repositories.OrderDetailsRepository;
import com.example.quickFood.repositories.OrderRepository;
import com.example.quickFood.repositories.ReviewRepository;
import com.example.quickFood.services.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private final OrderRepository orderRepository;

    @Autowired
    private final OrderDetailsRepository orderDetailsRepository;

    @Autowired
    private final ReviewRepository reviewRepository;

    @Autowired
    private final MenuRepository menuRepository;

    @Override
    public ResponseEntity<RatingPage> getReviewPage(int orderId) {
        Order order = orderRepository.findById(orderId).get();
        String restaurantName = order.getRestaurant().getName();
        byte[] restaurantPic = order.getRestaurant().getImage();

        List<OrderDetails> orderDetails = orderDetailsRepository.findByOrderId(orderId);
        List<IdNameImgDto> menuItems = new ArrayList<>();
        for (OrderDetails orderDetail : orderDetails) {
            IdNameImgDto menu = new IdNameImgDto(Integer.toString(orderDetail.getMenu().getId()), orderDetail.getMenu().getName(), orderDetail.getMenu().getImage());
            menuItems.add(menu);
        }

        RatingPage ratingPage = new RatingPage(restaurantName, restaurantPic, menuItems);
        return ResponseEntity.ok(ratingPage);
    }

    @Override
    @Transactional
    public ResponseEntity<String> submitReview(int orderId, List<RatingDto> rating) {
        Order order = orderRepository.findById(orderId).get();
        for (RatingDto ratingDto : rating) {
            if (ratingDto.getRating() != 0.0) {
                Menu menu = menuRepository.findById(ratingDto.getMenuId()).get();
                Review review = Review.builder()
                        .order(order)
                        .menu(menu)
                        .rating(ratingDto.getRating())
                        .timestamp(new Timestamp(System.currentTimeMillis()))
                        .build();
                reviewRepository.save(review);
            }
        }
        return ResponseEntity.ok("Review submitted successfully");
    }

    @Override
    public ResponseEntity<Double> getRestaurantRating(String restaurantId) {
        return ResponseEntity.ok(reviewRepository.getRestaurantRating(restaurantId));
    }

    @Override
    public ResponseEntity<Double> getMenuRating(int menuId) {
        return ResponseEntity.ok(reviewRepository.getMenuRating(menuId));
    }
}
