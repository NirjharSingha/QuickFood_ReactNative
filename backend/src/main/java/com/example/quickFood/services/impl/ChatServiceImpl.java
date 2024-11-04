package com.example.quickFood.services.impl;

import com.example.quickFood.dto.*;
import com.example.quickFood.enums.Reaction;
import com.example.quickFood.models.Chat;
import com.example.quickFood.models.ChatFile;
import com.example.quickFood.models.Order;
import com.example.quickFood.models.User;
import com.example.quickFood.repositories.ChatFileRepository;
import com.example.quickFood.repositories.ChatRepository;
import com.example.quickFood.repositories.OrderRepository;
import com.example.quickFood.services.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.*;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {
    @Autowired
    private final ChatRepository chatRepository;
    @Autowired
    private final ChatFileRepository chatFileRepository;
    @Autowired
    private final OrderRepository orderRepository;

    @Override
    public ResponseEntity<List<ChatDto>> getChats(int page, int size, int roomId) {
        Order order = orderRepository.findById(roomId).get();
        if (order.getDeliveryCompleted() != null || order.getCancelled() != null) {
            return ResponseEntity.notFound().build();
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Chat> chatPage = chatRepository.findByRoomId(roomId, pageable);

        if (chatPage.hasContent()) {
            List<Chat> chatList = chatPage.getContent();
            List<ChatDto> chatDtoList = new ArrayList<>();

            for (Chat chat : chatList) {
                List<ChatFile> chatFileList = chatFileRepository.findByChatId(chat.getId());
                List<ChatFileDto> chatFileDtoList = new ArrayList<>();
                for (ChatFile chatFile : chatFileList) {
                    ChatFileDto chatFileDto = ChatFileDto.builder()
                            .id(chatFile.getId())
                            .data(chatFile.getData())
                            .fileType(chatFile.getFileType())
                            .build();
                    chatFileDtoList.add(chatFileDto);
                }

                ChatDto chatDto = ChatDto.builder()
                        .id(chat.getId())
                        .roomId(chat.getRoom().getId())
                        .senderId(chat.getSender().getId())
                        .receiverId(chat.getReceiver().getId())
                        .message(chat.getMessage())
                        .timestamp(chat.getTimestamp())
                        .isEdited(chat.isEdited())
                        .isSeen(chat.isSeen())
                        .reaction(chat.getReaction())
                        .files(chatFileDtoList)
                        .build();

                chatDtoList.add(chatDto);
            }

            return ResponseEntity.ok(chatDtoList);
        }

        return ResponseEntity.ok(new ArrayList<>());
    }

    @Override
    @Transactional
    public void deleteChats(int roomId) {
        chatFileRepository.deleteChatFiles(roomId);
        chatRepository.deleteByRoomId(roomId);
    }

    @Override
    public ResponseEntity<ChatDto> addChat(ChatDto chatDto, List<ChatFileDto> chatFiles) {
        Order order = orderRepository.findById(chatDto.getRoomId()).get();
        if (order.getDeliveryCompleted() != null || order.getCancelled() != null) {
            return ResponseEntity.notFound().build();
        }

        User customer = order.getUser();
        User rider = order.getRider();

        User sender;
        User receiver;

        if (Objects.equals(customer.getId(), chatDto.getSenderId())) {
            sender = customer;
            receiver = rider;
        } else {
            sender = rider;
            receiver = customer;
        }

        Chat chat = Chat.builder()
                .room(order)
                .sender(sender)
                .receiver(receiver)
                .message(chatDto.getMessage())
                .isSeen(false)
                .timestamp(new Timestamp(System.currentTimeMillis()))
                .isEdited(false)
                .reaction(chatDto.getReaction())
                .build();

        Chat savedChat = chatRepository.save(chat);
        List<ChatFileDto> savedFiles = new ArrayList<>();

        for (ChatFileDto chatFile : chatFiles) {
            ChatFile savedFile = chatFileRepository.save(ChatFile.builder()
                    .chat(savedChat)
                    .data(chatFile.getData())
                    .fileType(chatFile.getFileType())
                    .build());

            savedFiles.add(new ChatFileDto(savedFile.getId(), savedFile.getData(), savedFile.getFileType()));
        }

        ChatDto chatDto1 = ChatDto.builder()
                .id(savedChat.getId())
                .roomId(savedChat.getRoom().getId())
                .senderId(savedChat.getSender().getId())
                .receiverId(savedChat.getReceiver().getId())
                .message(savedChat.getMessage())
                .timestamp(savedChat.getTimestamp())
                .isEdited(savedChat.isEdited())
                .isSeen(savedChat.isSeen())
                .reaction(savedChat.getReaction())
                .files(savedFiles)
                .build();

        return ResponseEntity.ok(chatDto1);
    }

    @Override
    public ResponseEntity<List<ChatUserDto>> getChatUsers(String userId) {
        List<ChatUserDto> chatUserDtoList = orderRepository.getChatUsers(userId);
        List<Pair<Integer, Timestamp>> lastChatTimeList = new ArrayList<>();
        for (ChatUserDto chatUserDto : chatUserDtoList) {
            chatUserDto.setUnseenCount(chatRepository.getUnseenCount(chatUserDto.getRoomId(), userId));
            Timestamp lastChatTime = chatRepository.getLastChatTime(chatUserDto.getRoomId());
            lastChatTimeList.add(Pair.of(chatUserDto.getRoomId(), Objects.requireNonNullElseGet(lastChatTime, () -> new Timestamp(0))));
        }

        // Create a map to store roomId and lastChatTime
        Map<Integer, Timestamp> lastChatTimeMap = new HashMap<>();
        for (Pair<Integer, Timestamp> pair : lastChatTimeList) {
            lastChatTimeMap.put(pair.getFirst(), pair.getSecond());
        }

        // Sort chatUserDtoList based on the lastChatTime in the map
        chatUserDtoList.sort((dto1, dto2) -> {
            Timestamp lastChatTime1 = lastChatTimeMap.get(dto1.getRoomId());
            Timestamp lastChatTime2 = lastChatTimeMap.get(dto2.getRoomId());
            return lastChatTime2.compareTo(lastChatTime1); // For descending order
        });

        return ResponseEntity.ok(chatUserDtoList);
    }

    @Override
    @Transactional
    public ResponseEntity<ChatRoomInit> chatRoomInit(int roomId, String userId) {
        Order order = orderRepository.findById(roomId).get();
        if (order.getDeliveryCompleted() != null || order.getCancelled() != null) {
            return ResponseEntity.notFound().build();
        }
        User customer = order.getUser();
        User rider = order.getRider();

        IdNameImgDto firstUser, secondUser;
        if(customer.getId().equals(userId)) {
            firstUser = new IdNameImgDto(customer.getId(), customer.getName(), customer.getProfilePic());
            secondUser = new IdNameImgDto(rider.getId(), rider.getName(), rider.getProfilePic());
        } else {
            secondUser = new IdNameImgDto(customer.getId(), customer.getName(), customer.getProfilePic());
            firstUser = new IdNameImgDto(rider.getId(), rider.getName(), rider.getProfilePic());
        }

        int unseenCount = chatRepository.getUnseenCount(roomId, userId);
        if(unseenCount > 0) {
            chatRepository.makeSeen(roomId, userId);
        }

        return ResponseEntity.ok(new ChatRoomInit(firstUser, secondUser, unseenCount));
    }

    @Override
    @Transactional
    public ResponseEntity<String> deleteChatById(int chatId, int roomId) {
        Order order = orderRepository.findById(roomId).get();
        if (order.getDeliveryCompleted() != null || order.getCancelled() != null) {
            return ResponseEntity.notFound().build();
        }
        chatFileRepository.deleteByChatId(chatId);
        chatRepository.deleteById(chatId);
        return ResponseEntity.ok("Chat deleted successfully");
    }

    @Override
    @Transactional
    public ResponseEntity<String> updateReaction(int chatId, int roomId, Reaction reaction) {
        Order order = orderRepository.findById(roomId).get();
        if (order.getDeliveryCompleted() != null || order.getCancelled() != null) {
            return ResponseEntity.notFound().build();
        }

        Reaction prevReaction = chatRepository.chatReaction(chatId);
        System.out.println(prevReaction);
        System.out.println(reaction);
        if (prevReaction == reaction) {
            chatRepository.updateReaction(chatId, null);
        } else {
            chatRepository.updateReaction(chatId, reaction);
        }
        return ResponseEntity.ok("Reaction updated successfully");
    }

    @Override
    @Transactional
    public ResponseEntity<ChatDto> updateChat(ChatDto chatDto, List<ChatFileDto> chatFiles) {
        Order order = orderRepository.findById(chatDto.getRoomId()).get();
        if (order.getDeliveryCompleted() != null || order.getCancelled() != null) {
            return ResponseEntity.notFound().build();
        }

        Chat chat = chatRepository.findById(chatDto.getId()).get();
        chat.setMessage(chatDto.getMessage());
        chat.setEdited(true);
        chatRepository.save(chat);

        List<Integer> prevAttachments = chatFileRepository.getPrevFilesByChatId(chat.getId());
        for (Integer prevAttachment : prevAttachments) {
            if (!chatDto.getPrevFiles().contains(prevAttachment)) {
                chatFileRepository.deleteById(prevAttachment);
            }
        }

        List<ChatFile> filesNotDeleted = chatFileRepository.findByChatId(chat.getId());
        List<ChatFileDto> savedFiles = new ArrayList<>();
        for (ChatFile file : filesNotDeleted) {
            savedFiles.add(new ChatFileDto(file.getId(), file.getData(), file.getFileType()));
        }

        for (ChatFileDto chatFile : chatFiles) {
            ChatFile savedFile = chatFileRepository.save(ChatFile.builder()
                    .chat(chat)
                    .data(chatFile.getData())
                    .fileType(chatFile.getFileType())
                    .build());

            savedFiles.add(new ChatFileDto(savedFile.getId(), savedFile.getData(), savedFile.getFileType()));
        }

        ChatDto chatDto1 = ChatDto.builder()
                .id(chat.getId())
                .roomId(chat.getRoom().getId())
                .senderId(chat.getSender().getId())
                .receiverId(chat.getReceiver().getId())
                .message(chat.getMessage())
                .timestamp(chat.getTimestamp())
                .isEdited(chat.isEdited())
                .isSeen(chat.isSeen())
                .reaction(chat.getReaction())
                .files(savedFiles)
                .build();

        return ResponseEntity.ok(chatDto1);
    }

    @Override
    @Transactional
    public ResponseEntity<ChatDto> getChatById(int chatId, int roomId) {
        Order order = orderRepository.findById(roomId).get();
        if (order.getDeliveryCompleted() != null || order.getCancelled() != null) {
            return ResponseEntity.notFound().build();
        }

        Chat chat = chatRepository.findById(chatId).get();
        if (!chat.isSeen()) {
            chat.setSeen(true);
            chatRepository.save(chat);
        }

        List<ChatFile> chatFileList = chatFileRepository.findByChatId(chat.getId());
        List<ChatFileDto> chatFileDtoList = new ArrayList<>();
        for (ChatFile chatFile : chatFileList) {
            ChatFileDto chatFileDto = ChatFileDto.builder()
                    .id(chatFile.getId())
                    .data(chatFile.getData())
                    .fileType(chatFile.getFileType())
                    .build();
            chatFileDtoList.add(chatFileDto);
        }

        ChatDto chatDto = ChatDto.builder()
                .id(chat.getId())
                .roomId(chat.getRoom().getId())
                .senderId(chat.getSender().getId())
                .receiverId(chat.getReceiver().getId())
                .message(chat.getMessage())
                .timestamp(chat.getTimestamp())
                .isEdited(chat.isEdited())
                .isSeen(true)
                .reaction(chat.getReaction())
                .files(chatFileDtoList)
                .build();

        return ResponseEntity.ok(chatDto);
    }
}
