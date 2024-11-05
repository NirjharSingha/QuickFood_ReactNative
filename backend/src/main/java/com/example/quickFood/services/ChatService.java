package com.example.quickFood.services;

import com.example.quickFood.dto.*;
import com.example.quickFood.enums.Reaction;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ChatService {
    ResponseEntity<List<ChatDto>> getChats(int page, int size, int roomId);

    void deleteChats(int roomId);

    ResponseEntity<ChatDto> addChat(ChatDto chatDto, List<ChatFileDto> chatFiles);

    ResponseEntity<List<ChatUserDto>> getChatUsers(String userId);

    ResponseEntity<ChatRoomInit> chatRoomInit(int roomId, String userId);

    ResponseEntity<String> deleteChatById(int chatId, int roomId);

    ResponseEntity<String> updateReaction(int chatId, int roomId, Reaction reaction);

    ResponseEntity<ChatDto> updateChat(ChatDto chatDto, List<ChatFileDto> chatFiles);

    ResponseEntity<ChatDto> getChatById(int chatId, int roomId);

    ResponseEntity<String> socketChat_ReactNative(SocketData socketData);
}
