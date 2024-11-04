package com.example.quickFood.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ChatRoomInit {
    IdNameImgDto firstUser;
    IdNameImgDto secondUser;
    int unseenCount;
}
