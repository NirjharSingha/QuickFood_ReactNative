package com.example.quickFood.services.impl;

import com.example.quickFood.dto.*;
import com.example.quickFood.enums.Role;
import com.example.quickFood.models.RiderStatus;
import com.example.quickFood.models.User;
import com.example.quickFood.repositories.OrderRepository;
import com.example.quickFood.repositories.RiderStatusRepository;
import com.example.quickFood.repositories.UserRepository;
import com.example.quickFood.services.UserService;
import lombok.RequiredArgsConstructor;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private final OrderRepository orderRepository;
  
    private final RiderStatusRepository riderStatusRepository;

    public UserDetailsService userDetailsService() {
        return new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String username) {
                return userRepository.findById(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            }
        };
    }

    @Override
    public void addUser(SignupDto signupDto) {
        if (userRepository.findById(signupDto.getId()).isPresent()) {
            throw new RuntimeException("Id already exists");
        }
        User user = new User(signupDto.getId(), signupDto.getName(), signupDto.getPassword(), signupDto.getRole(), null,
                null, new Timestamp(System.currentTimeMillis()), null);
        userRepository.save(user);

        if (signupDto.getRole() == Role.RIDER) {
            riderStatusRepository.save(new RiderStatus(signupDto.getId(), true));
        }
    }

    @Override
    public ResponseEntity<String> updateUser(UpdateProfileDto updateProfileDto) {
        try {
            User existingUser = userRepository.findById(updateProfileDto.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            if (existingUser != null) {
                if (updateProfileDto.getProfilePic() == null) {
                    updateProfileDto.setProfilePic(existingUser.getProfilePic());
                }
                User user = new User(updateProfileDto.getId(), updateProfileDto.getName(), existingUser.getPassword(),
                        existingUser.getRole(), updateProfileDto.getAddress(), updateProfileDto.getMobile(),
                        existingUser.getRegDate(), updateProfileDto.getProfilePic());
                userRepository.save(user);
                return ResponseEntity.ok("User updated successfully");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update user");
        }
    }

    @Override
    public ResponseEntity<String> updatePassword(LoginDto loginDto) {
        User existingUser = userRepository.findById(loginDto.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (existingUser != null) {
            String hashedPassword = passwordEncoder.encode(loginDto.getPassword());
            User user = new User(existingUser.getId(), existingUser.getName(), hashedPassword, existingUser.getRole(),
                    existingUser.getAddress(), existingUser.getMobile(), existingUser.getRegDate(),
                    existingUser.getProfilePic());
            userRepository.save(user);
            return ResponseEntity.ok("Password updated successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    public void addOAuthUser(GoogleAuth googleAuth) {
        User user = new User(googleAuth.getId(), googleAuth.getName(), null, Role.USER, null, null,
                new Timestamp(System.currentTimeMillis()), null);
        userRepository.save(user);
    }

    @Override
    public ResponseEntity<Integer> profilePercentage(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (user != null) {
            int percentage = 40;
            if (user.getProfilePic() != null) {
                percentage += 20;
            }
            if (user.getAddress() != null) {
                percentage += 20;
            }
            if (user.getMobile() != null) {
                percentage += 20;
            }
            return ResponseEntity.ok(percentage);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    public ResponseEntity<User> getUser(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (user != null) {
            if (user.getAddress() == null) {
                user.setAddress("");
            }
            if (user.getMobile() == null) {
                user.setMobile("");
            }
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    public List<IdNameImgDto> getAllRiders() {
        return userRepository.findAllRiders();
    }


    @Override
    public List<DeliveryAnalytics> getWeeklyDeliveryStatus(String riderId, String timestampString) {
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

            List<DeliveryTimes> deliveryTimesList = orderRepository.getDeliveryTimesById(riderId,startTimestamp, endTimestamp);

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
    public List<DeliveryAnalytics> getMonthlyDeliveryStatus(String riderId) {
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

            List<DeliveryTimes> deliveryTimesList = orderRepository.getDeliveryTimesById(riderId,startTimestamp, endTimestamp);

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

    @Override
    public List<Pair<String, Integer>> allDelivery(String riderId) {
        List<DeliveryTimes> deliveryTimesList = orderRepository.getAllDeliveryById(riderId);
        List<Pair<String, Integer>> result = new ArrayList<>();

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

        result.add(Pair.of("No issues", successOrders));
        result.add(Pair.of("Late delivery", lateOrders));
        result.add(Pair.of("Complaint", complaint));
        result.add(Pair.of("Late+Complaint", bothIssues));

        return result;
    }
}
