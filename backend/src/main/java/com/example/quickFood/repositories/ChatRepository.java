package com.example.quickFood.repositories;

import com.example.quickFood.enums.Reaction;
import com.example.quickFood.models.Chat;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Integer> {
    Page<Chat> findByRoomId(Integer roomId, Pageable pageable);

    void deleteByRoomId(Integer roomId);

    @Query("SELECT COUNT(c) FROM Chat c WHERE c.room.id = :roomId AND c.isSeen = false AND c.receiver.id = :userId")
    Integer getUnseenCount(int roomId, String userId);

    @Modifying
    @Transactional
    @Query("UPDATE Chat c SET c.isSeen = true WHERE c.room.id = :roomId AND c.receiver.id = :userId")
    void makeSeen(int roomId, String userId);

    @Query("SELECT c.reaction FROM Chat c WHERE c.id = :chatId")
    Reaction chatReaction(int chatId);

    @Modifying
    @Transactional
    @Query("UPDATE Chat c SET c.reaction = :reaction WHERE c.id = :chatId")
    void updateReaction(int chatId, Reaction reaction);

    @Query("SELECT c.timestamp FROM Chat c WHERE c.room.id = :roomId ORDER BY c.timestamp DESC LIMIT 1")
    Timestamp getLastChatTime(int roomId);
}
