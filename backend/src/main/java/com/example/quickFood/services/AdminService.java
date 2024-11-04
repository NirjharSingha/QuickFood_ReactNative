package com.example.quickFood.services;

import com.example.quickFood.dto.DeliveryAnalytics;
import org.springframework.data.util.Pair;

import java.util.List;

public interface AdminService {
    List<Pair<String, Double>> getWeeklySale(String timestampString);

    List<Pair<String, Double>> getMonthlySale();

    List<Pair<String, Double>> topSellingRestaurants();

    List<Pair<String, Double>> findTopReviewedRestaurants(String flag);

    List<DeliveryAnalytics> getWeeklyDeliveryStatus(String timestampString);

    List<DeliveryAnalytics> getMonthlyDeliveryStatus();
}
