package com.example.quickFood.controllers;

import com.example.quickFood.dto.NotificationDto;
import com.example.quickFood.services.impl.NotificationServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notification")
@CrossOrigin
public class NotificationController {
    @Autowired
    private NotificationServiceImpl notificationService;

    @GetMapping("/getNotifications")
    public ResponseEntity<List<NotificationDto>> getNotifications(@RequestParam String userId) {
        return notificationService.getNotifications(userId);
    }

    @PostMapping("/addNotification")
    public ResponseEntity<String> addNotification(@RequestParam String userId, @RequestParam String message) {
        return notificationService.addNotification(userId, message);
    }

    @DeleteMapping("/deleteByNotificationId")
    public ResponseEntity<String> deleteByNotificationId(@RequestParam int notificationId) {
        return notificationService.deleteByNotificationId(notificationId);
    }

    @DeleteMapping("/deleteByUserId")
    public ResponseEntity<String> deleteByUserId(@RequestParam String userId) {
        return notificationService.deleteByUserId(userId);
    }

    @GetMapping("/getUnseenNotificationCount")
    public ResponseEntity<Integer> getUnseenNotificationCount(@RequestParam String userId) {
        return notificationService.getUnseenNotificationCount(userId);
    }
}
