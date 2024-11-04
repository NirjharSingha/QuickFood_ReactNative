package com.example.quickFood.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SocketResponse {
    String title;
    String notification;
    ChatDto chatDto;
}
