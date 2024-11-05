package com.example.quickFood.controllers;

import com.example.quickFood.dto.*;
import com.example.quickFood.enums.Reaction;
import com.example.quickFood.services.impl.ChatServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/chat")
@CrossOrigin
public class ChatController {
    @Autowired
    private ChatServiceImpl chatService;

    @GetMapping("/getChats")
    public ResponseEntity<List<ChatDto>> getChats(@RequestParam int page, @RequestParam int size, @RequestParam int roomId) {
        return chatService.getChats(page, size, roomId);
    }

    @GetMapping("/getChatUsers")
    public ResponseEntity<List<ChatUserDto>> getChatUsers(@RequestParam String userId) {
        return chatService.getChatUsers(userId);
    }

    @DeleteMapping("/deleteChatById")
    public ResponseEntity<String> deleteChatById(@RequestParam int chatId, @RequestParam int roomId) {
        return chatService.deleteChatById(chatId, roomId);
    }

    @PostMapping("/addChat")
    public ResponseEntity<ChatDto> addChat(@RequestParam(value = "chatAttachments", required = false) MultipartFile[] files,
                                           @ModelAttribute ChatDto chatDto) {
        try {
            List<ChatFileDto> chatFiles = new ArrayList<>();
            if (files != null) {
                for (MultipartFile file : files) {
                    if (!file.isEmpty()) {
                        chatFiles.add(ChatFileDto.builder()
                                .data(file.getBytes())
                                .fileType(file.getContentType())
                                .build());
                    }
                }
            }
            return chatService.addChat(chatDto, chatFiles);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/chatRoomInit")
    public ResponseEntity<ChatRoomInit> chatRoomInit(@RequestParam int roomId, @RequestParam String userId) {
        return chatService.chatRoomInit(roomId, userId);
    }

    @PutMapping("/reaction")
    public ResponseEntity<String> updateReaction(@RequestParam int chatId, @RequestParam int roomId, @RequestParam Reaction reaction) {
        return chatService.updateReaction(chatId, roomId, reaction);
    }

    @PutMapping("/updateChat")
    public ResponseEntity<ChatDto> updateChat(@RequestParam(value = "chatAttachments", required = false) MultipartFile[] files,
                                           @ModelAttribute ChatDto chatDto) {
        try {
            List<ChatFileDto> chatFiles = new ArrayList<>();
            if (files != null) {
                for (MultipartFile file : files) {
                    if (!file.isEmpty()) {
                        chatFiles.add(ChatFileDto.builder()
                                .data(file.getBytes())
                                .fileType(file.getContentType())
                                .build());
                    }
                }
            }
            return chatService.updateChat(chatDto, chatFiles);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/getChatById")
    public ResponseEntity<ChatDto> getChatById(@RequestParam int chatId, @RequestParam int roomId) {
        return chatService.getChatById(chatId, roomId);
    }

    @PostMapping("/socketChat_ReactNative")
    public ResponseEntity<String> socketChat_ReactNative(@RequestBody SocketData socketData) {
        return chatService.socketChat_ReactNative(socketData);
    }

}
