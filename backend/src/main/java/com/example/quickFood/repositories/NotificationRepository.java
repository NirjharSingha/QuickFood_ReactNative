package com.example.quickFood.repositories;

import com.example.quickFood.models.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByUserId(String userId);

    void deleteByUserId(String userId);

    Integer countByUserIdAndIsSeen(String userId, boolean isSeen);
}
