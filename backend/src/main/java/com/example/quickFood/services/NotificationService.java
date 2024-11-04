package com.example.quickFood.services;

import com.example.quickFood.dto.NotificationDto;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface NotificationService {
    ResponseEntity<List<NotificationDto>> getNotifications(String userId);

    ResponseEntity<String> addNotification(String userId, String message);

    ResponseEntity<String> deleteByNotificationId(int notificationId);

    ResponseEntity<String> deleteByUserId(String userId);

    ResponseEntity<Integer> getUnseenNotificationCount(String userId);
}
