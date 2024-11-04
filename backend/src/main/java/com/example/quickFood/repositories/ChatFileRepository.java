package com.example.quickFood.repositories;

import com.example.quickFood.models.ChatFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ChatFileRepository extends JpaRepository<ChatFile, Integer> {
    List<ChatFile> findByChatId(Integer chatId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM chat_files WHERE chat_id IN (SELECT chat_id FROM chats WHERE room_id = :roomId)", nativeQuery = true)
    void deleteChatFiles(@Param("roomId") int roomId);

    void deleteByChatId(int chatId);

    @Query("SELECT c.id FROM ChatFile c WHERE c.chat.id = :chatId")
    List<Integer> getPrevFilesByChatId(int chatId);
}
