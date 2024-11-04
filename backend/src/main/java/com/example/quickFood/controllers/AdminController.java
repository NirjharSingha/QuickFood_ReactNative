package com.example.quickFood.controllers;

import com.example.quickFood.dto.DeliveryAnalytics;
import com.example.quickFood.services.impl.AdminServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private AdminServiceImpl adminService;

    @GetMapping("/getWeeklySale")
    public ResponseEntity<List<Pair<String, Double>>> getWeeklySale(@RequestParam("timestampString") String timestampString) {
        return ResponseEntity.ok(adminService.getWeeklySale(timestampString));
    }

    @GetMapping("/getMonthlySale")
    public ResponseEntity<List<Pair<String, Double>>> getMonthlySale() {
        return ResponseEntity.ok(adminService.getMonthlySale());
    }

    @GetMapping("/salePerRestaurant")
    public ResponseEntity<List<Pair<String, Double>>> getSalePerRestaurant() {
        return ResponseEntity.ok(adminService.topSellingRestaurants());
    }

    @GetMapping("/topReviewedRestaurants")
    public ResponseEntity<List<Pair<String, Double>>> getTopReviewedRestaurants(@RequestParam("flag") String flag) {
        return ResponseEntity.ok(adminService.findTopReviewedRestaurants(flag));
    }

    @GetMapping("/weeklyDeliveryStatus")
    public ResponseEntity<List<DeliveryAnalytics>> getWeeklyDeliveryStatus(@RequestParam("timestampString") String timestampString) {
        return ResponseEntity.ok(adminService.getWeeklyDeliveryStatus(timestampString));
    }

    @GetMapping("/monthlyDeliveryStatus")
    public ResponseEntity<List<DeliveryAnalytics>> getMonthlyDeliveryStatus() {
        return ResponseEntity.ok(adminService.getMonthlyDeliveryStatus());
    }
}
