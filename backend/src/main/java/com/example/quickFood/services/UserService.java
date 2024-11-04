package com.example.quickFood.services;

import com.example.quickFood.dto.*;
import com.example.quickFood.models.User;
import java.util.*;

import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;

public interface UserService {
    void addUser(SignupDto user);

    ResponseEntity<String> updateUser(UpdateProfileDto updateProfileDto);

    ResponseEntity<String> updatePassword(LoginDto loginDto);

    void addOAuthUser(GoogleAuth user);

    ResponseEntity<Integer> profilePercentage(String userId);

    ResponseEntity<User> getUser(String userId);

    List<IdNameImgDto> getAllRiders();

    List<DeliveryAnalytics> getWeeklyDeliveryStatus(String riderId,String timestampString);

    List<DeliveryAnalytics> getMonthlyDeliveryStatus(String riderId);

    List<Pair<String, Integer>> allDelivery(String riderId);
}
