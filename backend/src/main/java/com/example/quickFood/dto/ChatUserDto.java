package com.example.quickFood.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ChatUserDto {
    private int roomId;
    private String userId;
    private String name;
    private byte[] image;
    private int unseenCount;

    public ChatUserDto(int roomId, String userId, String name, byte[] image) {
        this.roomId = roomId;
        this.userId = userId;
        this.name = name;
        this.image = image;
    }
}
