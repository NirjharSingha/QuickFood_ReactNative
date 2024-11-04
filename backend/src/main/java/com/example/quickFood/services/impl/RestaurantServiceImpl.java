package com.example.quickFood.services.impl;

import com.example.quickFood.dto.IdNameImgDto;
import com.example.quickFood.dto.RestaurantDto;
import com.example.quickFood.enums.PaymentMethod;
import com.example.quickFood.models.Restaurant;
import com.example.quickFood.models.User;
import com.example.quickFood.repositories.RestaurantRepository;
import com.example.quickFood.repositories.UserRepository;
import com.example.quickFood.services.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {
    private final RestaurantRepository restaurantRepository;

    @Autowired
    private final UserRepository userRepository;

    @Override
    public ResponseEntity<String> addRestaurant(RestaurantDto restaurantDto) {
        if (restaurantRepository.findById(restaurantDto.getId()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Duplicate restaurant ID");
        } else {
            Optional<User> optionalUser = userRepository.findById(restaurantDto.getOwner());

            if (optionalUser.isPresent()) {
                User user = optionalUser.get();

                Restaurant restaurant = new Restaurant(restaurantDto.getId(), restaurantDto.getName(), user, restaurantDto.getAddress(), restaurantDto.getMobile(), new Timestamp(System.currentTimeMillis()), restaurantDto.getImage());
                restaurantRepository.save(restaurant);

                return ResponseEntity.ok("Restaurant added successfully");
            } else {
                return ResponseEntity.badRequest().build();
            }
        }
    }

    @Override
    public ResponseEntity<String> updateRestaurant(RestaurantDto restaurantDto) {
        if (restaurantRepository.findById(restaurantDto.getId()).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Restaurant not found");
        } else {
            Restaurant existingRestaurant = restaurantRepository.findById(restaurantDto.getId()).get();
            if (restaurantDto.getImage() != null) {
                existingRestaurant.setImage(restaurantDto.getImage());
            }

            Optional<User> optionalUser = userRepository.findById(restaurantDto.getOwner());
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                Restaurant restaurant = new Restaurant(restaurantDto.getId(), restaurantDto.getName(), user, restaurantDto.getAddress(), restaurantDto.getMobile(), existingRestaurant.getRegDate(), existingRestaurant.getImage());
                restaurantRepository.save(restaurant);

                return ResponseEntity.ok("Restaurant updated successfully");
            } else {
                return ResponseEntity.badRequest().build();
            }
        }
    }

    @Override
    public ResponseEntity<RestaurantDto> getRestaurantById(String id) {
        if (restaurantRepository.findById(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } else {
            Restaurant restaurant = restaurantRepository.findById(id).get();
            RestaurantDto restaurantDto = new RestaurantDto(restaurant.getId(), restaurant.getName(), restaurant.getOwner().getId(), restaurant.getAddress(), restaurant.getMobile(), restaurant.getImage());
            return ResponseEntity.ok(restaurantDto);
        }
    }

    @Override
    public ResponseEntity<List<RestaurantDto>> getRestaurantByOwner(String owner) {
        List<Restaurant> restaurants = restaurantRepository.findByOwnerId(owner);
        List<RestaurantDto> restaurantDtoList = new ArrayList<>();
        for (Restaurant restaurant : restaurants) {
            RestaurantDto restaurantDto = new RestaurantDto(restaurant.getId(), restaurant.getName(), restaurant.getOwner().getId(), restaurant.getAddress(), restaurant.getMobile(), restaurant.getImage());
            restaurantDtoList.add(restaurantDto);
        }
        return ResponseEntity.ok(restaurantDtoList);
    }

    @Override
    public List<RestaurantDto> getRestaurantsByPagination(Pageable pageable) {
        Page<Restaurant> restaurants = restaurantRepository.findAll(pageable);
        List<RestaurantDto> restaurantDtoList = new ArrayList<>();
        for (Restaurant restaurant : restaurants) {
            RestaurantDto restaurantDto = new RestaurantDto(restaurant.getId(), restaurant.getName(), restaurant.getOwner().getId(), restaurant.getAddress(), restaurant.getMobile(), restaurant.getImage());
            restaurantDtoList.add(restaurantDto);
        }
        return restaurantDtoList;
    }

    @Override
    public List<IdNameImgDto> searchRestaurant(String name) {
        return restaurantRepository.searchRestaurant(name);
    }

    @Override
    public String restaurantName(String resId) {
        return restaurantRepository.restaurantName(resId);
    }

    @Override
    public List<Pair<String, Double>> getWeeklyRestaurantSale(String resId, String timestampString) {
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

            Double value = restaurantRepository.getRestaurantSale(resId, startTimestamp, endTimestamp, PaymentMethod.REFUNDED);
            if (value ==  null) {
                value = 0.0;
            }
            saleList.add(Pair.of(dayOfWeek.toString(), value));

        }

        return saleList;
    }

    @Override
    public List<Pair<String, Double>> findTopSoldItems(String restaurantId) {
        List<Pair<String, Double>> topSoldItems = restaurantRepository.findTopSoldItems(restaurantId, PaymentMethod.REFUNDED);
        List<Pair<String, Double>> topSoldItemsCopy = new ArrayList<>();
        double total = 0.0;

        for (Pair<String, Double> pair : topSoldItems) {
            total += pair.getSecond();
        }

        int ct = 0;
        for (Pair<String, Double> pair : topSoldItems) {
            Double percentage = pair.getSecond() / total * 100;
            topSoldItemsCopy.add(Pair.of(pair.getFirst(), percentage));
            ct++;
            if (ct == 5) {
                break;
            }
        }

        double leftPercentage = 100.0;

        for (Pair<String, Double> pair : topSoldItemsCopy) {
            leftPercentage -= pair.getSecond();
        }

        if (leftPercentage > 0 && topSoldItemsCopy.size() > 0) {
            topSoldItemsCopy.add(Pair.of("Others", leftPercentage));
        }

        return topSoldItemsCopy;
    }

    @Override
    public List<Pair<String, Double>> findTopReviewedItems(String restaurantId, String flag) {
        List<Pair<String, Double>> topReviewedItems = restaurantRepository.findTopReviewedItems(restaurantId);
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
    public List<Pair<String, Double>> getMonthlyRestaurantSale(String resId) {
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
            Double value = restaurantRepository.getRestaurantSale(resId, startTimestamp, endTimestamp, PaymentMethod.REFUNDED);
            if (value == null) {
                value = 0.0;
            }

            // Add the month and sale value to the list
            saleList.add(Pair.of(month.toString(), value));
        }

        return saleList;
    }

    @Override
    public List<Pair<String, Double>> getPendingOrdersToday(String restaurantId) {
        Double preparedOrders = restaurantRepository.findPreparedPendingOrdersToday(restaurantId);
        Double unPreparedOrders = restaurantRepository.findUnPreparedPendingOrdersToday(restaurantId);

        if (preparedOrders == 0.0 && unPreparedOrders == 0.0) {
            return new ArrayList<>();
        } else {
            return Arrays.asList(Pair.of("Prepared", preparedOrders), Pair.of("Unprepared", unPreparedOrders));
        }
    }

    @Override
    public List<IdNameImgDto> getAllRestaurants() {
        return restaurantRepository.getAllRestaurants();
    }
}
