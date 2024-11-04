package com.example.quickFood.services.impl;

import com.example.quickFood.dto.DeliveryAnalytics;
import com.example.quickFood.dto.DeliveryTimes;
import com.example.quickFood.enums.PaymentMethod;
import com.example.quickFood.repositories.OrderRepository;
import com.example.quickFood.repositories.RestaurantRepository;
import com.example.quickFood.services.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final RestaurantRepository restaurantRepository;
    private final OrderRepository orderRepository;

    @Override
    public List<Pair<String, Double>> getWeeklySale(String timestampString) {
        List<Pair<String, Double>> saleList = new ArrayList<>();

        for (int i = 0; i < 7; i++) {

            // Parse the ISO string to LocalDate
            LocalDateTime dateTime = LocalDateTime.parse(timestampString, DateTimeFormatter.ISO_DATE_TIME);
            dateTime = dateTime.minusDays(i - 1);
            LocalDate date = dateTime.toLocalDate();
            DayOfWeek dayOfWeek = dateTime.getDayOfWeek();

            // Get start and end timestamps for the given date
            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

            // Set nanoseconds to maximum value for end of the day
            endOfDay = endOfDay.withNano(999999999);

            Timestamp startTimestamp = Timestamp.valueOf(startOfDay);
            Timestamp endTimestamp = Timestamp.valueOf(endOfDay);

            Double value = restaurantRepository.getSale(startTimestamp, endTimestamp, PaymentMethod.REFUNDED);
            if (value ==  null) {
                value = 0.0;
            }
            saleList.add(Pair.of(dayOfWeek.toString(), value));

        }

        return saleList;
    }

    @Override
    public List<Pair<String, Double>> getMonthlySale() {
        List<Pair<String, Double>> saleList = new ArrayList<>();
        LocalDateTime currentDateTime = LocalDateTime.now();

        for (int i = 0; i < 6; i++) {
            // Adjust current month based on the iteration
            LocalDateTime dateTime = currentDateTime.minusMonths(i);
            int year = dateTime.getYear();
            Month month = dateTime.getMonth();

            // Calculate start and end timestamps for the month
            LocalDateTime startOfMonth = LocalDateTime.of(year, month, 1, 0, 0, 0);
            LocalDateTime endOfMonth = startOfMonth.plusMonths(1).minusNanos(1);

            // Convert LocalDateTime to Timestamp
            Timestamp startTimestamp = Timestamp.valueOf(startOfMonth);
            Timestamp endTimestamp = Timestamp.valueOf(endOfMonth);

            // Get the total sale for the month
            Double value = restaurantRepository.getSale(startTimestamp, endTimestamp, PaymentMethod.REFUNDED);
            if (value == null) {
                value = 0.0;
            }

            // Add the month and sale value to the list
            saleList.add(Pair.of(month.toString(), value));
        }

        return saleList;
    }

    @Override
    public List<Pair<String, Double>> topSellingRestaurants() {
        List<Pair<String, Double>> topSellingRestaurants = restaurantRepository.topSellingRestaurants(PaymentMethod.REFUNDED);
        List<Pair<String, Double>> topSellingRestaurantsCopy = new ArrayList<>();

        int ct = 0;
        for (Pair<String, Double> pair : topSellingRestaurants) {
            topSellingRestaurantsCopy.add(Pair.of(pair.getFirst(), pair.getSecond()));
            ct++;
            if (ct == 5) {
                break;
            }
        }

        if(topSellingRestaurants.size() > 5) {
            double total = 0.0;
            for (int i = 5; i < topSellingRestaurants.size(); i++) {
                total += topSellingRestaurants.get(i).getSecond();
            }
            topSellingRestaurantsCopy.add(Pair.of("Others", total));
        }

        return topSellingRestaurantsCopy;
    }

    @Override
    public List<Pair<String, Double>> findTopReviewedRestaurants(String flag) {
        List<Pair<String, Double>> topReviewedItems = restaurantRepository.topReviewedRestaurants();
        if (Objects.equals(flag, "worst")) {
            Collections.reverse(topReviewedItems);
        }

        if (topReviewedItems.size() > 5) {
            return topReviewedItems.subList(0, 5);
        } else {
            return topReviewedItems;
        }
    }

    @Override
    public List<DeliveryAnalytics> getWeeklyDeliveryStatus(String timestampString) {
        List<DeliveryAnalytics> deliveryAnalyticsList = new ArrayList<>();

        for (int i = 0; i < 7; i++) {
            LocalDateTime dateTime = LocalDateTime.parse(timestampString, DateTimeFormatter.ISO_DATE_TIME);
            dateTime = dateTime.minusDays(i - 1);
            LocalDate date = dateTime.toLocalDate();
            DayOfWeek dayOfWeek = dateTime.getDayOfWeek();

            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
            endOfDay = endOfDay.withNano(999999999);

            Timestamp startTimestamp = Timestamp.valueOf(startOfDay);
            Timestamp endTimestamp = Timestamp.valueOf(endOfDay);

            List<DeliveryTimes> deliveryTimesList = orderRepository.getDeliveryTimes(startTimestamp, endTimestamp);

            int successOrders = 0;
            int lateOrders = 0;
            int complaint = 0;
            int bothIssues = 0;

            for (DeliveryTimes deliveryTimes : deliveryTimesList) {
                Timestamp orderPlaced = deliveryTimes.getOrderPlaced();
                Timestamp deliveryCompleted = deliveryTimes.getDeliveryCompleted();

                Long orderPlacedTime = orderPlaced.getTime();
                Long deliveryCompletedTime = deliveryCompleted.getTime();

                long diff = deliveryCompletedTime - orderPlacedTime;
                long deliveryTime = deliveryTimes.getDeliveryTime() * 60 * 1000L;

                String complain = deliveryTimes.getComplain();

                if(diff <= deliveryTime && (complain == null || complain.isEmpty())) {
                    successOrders++;
                } else if(diff > deliveryTime && (complain == null || complain.isEmpty())) {
                    lateOrders++;
                } else if(diff <= deliveryTime) {
                    complaint++;
                } else {
                    bothIssues++;
                }
            }

            DeliveryAnalytics deliveryAnalytics = new DeliveryAnalytics(dayOfWeek.toString(), successOrders, lateOrders, complaint, bothIssues);
            deliveryAnalyticsList.add(deliveryAnalytics);
        }

        return deliveryAnalyticsList;
    }

    @Override
    public List<DeliveryAnalytics> getMonthlyDeliveryStatus() {
        List<DeliveryAnalytics> deliveryAnalyticsList = new ArrayList<>();
        LocalDateTime currentDateTime = LocalDateTime.now();

        for (int i = 0; i < 6; i++) {
            // Adjust current month based on the iteration
            LocalDateTime dateTime = currentDateTime.minusMonths(i);
            int year = dateTime.getYear();
            Month month = dateTime.getMonth();

            // Calculate start and end timestamps for the month
            LocalDateTime startOfMonth = LocalDateTime.of(year, month, 1, 0, 0, 0);
            LocalDateTime endOfMonth = startOfMonth.plusMonths(1).minusNanos(1);

            // Convert LocalDateTime to Timestamp
            Timestamp startTimestamp = Timestamp.valueOf(startOfMonth);
            Timestamp endTimestamp = Timestamp.valueOf(endOfMonth);

            List<DeliveryTimes> deliveryTimesList = orderRepository.getDeliveryTimes(startTimestamp, endTimestamp);

            int successOrders = 0;
            int lateOrders = 0;
            int complaint = 0;
            int bothIssues = 0;

            for (DeliveryTimes deliveryTimes : deliveryTimesList) {
                Timestamp orderPlaced = deliveryTimes.getOrderPlaced();
                Timestamp deliveryCompleted = deliveryTimes.getDeliveryCompleted();

                Long orderPlacedTime = orderPlaced.getTime();
                Long deliveryCompletedTime = deliveryCompleted.getTime();

                long diff = deliveryCompletedTime - orderPlacedTime;
                long deliveryTime = deliveryTimes.getDeliveryTime() * 60 * 1000L;

                String complain = deliveryTimes.getComplain();

                if(diff <= deliveryTime && (complain == null || complain.isEmpty())) {
                    successOrders++;
                } else if(diff > deliveryTime && (complain == null || complain.isEmpty())) {
                    lateOrders++;
                } else if(diff <= deliveryTime) {
                    complaint++;
                } else {
                    bothIssues++;
                }
            }

            DeliveryAnalytics deliveryAnalytics = new DeliveryAnalytics(month.toString(), successOrders, lateOrders, complaint, bothIssues);
            deliveryAnalyticsList.add(deliveryAnalytics);
        }

        return deliveryAnalyticsList;
    }
}
