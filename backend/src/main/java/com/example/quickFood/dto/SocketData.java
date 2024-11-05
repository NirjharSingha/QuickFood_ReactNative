package com.example.quickFood.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SocketData {
    private String title;
    private String topic;
    private String destination;
    private String notificationMessage;
    private String redirectUrl;
    private SocketChat chat;
    private Boolean typing;
}
