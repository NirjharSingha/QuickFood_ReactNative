package com.example.quickFood.services.impl;

import com.example.quickFood.dto.NotificationDto;
import com.example.quickFood.dto.SocketResponse;
import com.example.quickFood.models.Notification;
import com.example.quickFood.models.User;
import com.example.quickFood.repositories.NotificationRepository;
import com.example.quickFood.repositories.UserRepository;
import com.example.quickFood.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    @Autowired
    private final NotificationRepository notificationRepository;

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final SimpMessagingTemplate simpMessagingTemplate;


    @Override
    @Transactional
    public ResponseEntity<List<NotificationDto>> getNotifications(String userId) {
        try {
            List<Notification> notifications = notificationRepository.findByUserId(userId);
            List<NotificationDto> notificationDtoList = new ArrayList<>();
            for (Notification notification : notifications) {
                NotificationDto notificationDto = new NotificationDto(notification.getId(), notification.getDescription(), notification.getTimestamp(), notification.isSeen());
                notificationDtoList.add(notificationDto);
            }

            boolean hasUnseen = false;

            for (Notification notification : notifications) {
                if (!notification.isSeen()) {
                    hasUnseen = true;
                    notification.setSeen(true);
                }
            }
            if (hasUnseen) {
                notificationRepository.saveAll(notifications);
            }

            return ResponseEntity.ok(notificationDtoList);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Override
    public ResponseEntity<String> addNotification(String userId, String message) {
        try {
            Optional<User> optionalUser = userRepository.findById(userId);

            // Check if the User exists in the database
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();

                Notification notification = Notification
                        .builder()
                        .description(message)
                        .isSeen(false)
                        .timestamp(new Timestamp(System.currentTimeMillis()))
                        .user(user)
                        .build();
                notificationRepository.save(notification);
                return ResponseEntity.ok("Notification added");
            } else {
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Override
    public ResponseEntity<String> deleteByNotificationId(int notificationId) {
        try {
            notificationRepository.deleteById(notificationId);

            return ResponseEntity.ok("Notification deleted successfully.");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete notification.");
        }
    }

    @Transactional
    @Override
    public ResponseEntity<String> deleteByUserId(String userId) {
        try {
            notificationRepository.deleteByUserId(userId);
            return ResponseEntity.ok("Notifications deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete notifications.");
        }
    }

    @Override
    public ResponseEntity<Integer> getUnseenNotificationCount(String userId) {
        return ResponseEntity.ok(notificationRepository.countByUserIdAndIsSeen(userId, false));
    }

    public void sendNotificationToUser(String userId, String message) {
        String destination = "/user/" + userId + "/queue";
        SocketResponse socketResponse = SocketResponse.builder().title("Notification").notification(message).build();
        simpMessagingTemplate.convertAndSend(destination, socketResponse);
    }

}
