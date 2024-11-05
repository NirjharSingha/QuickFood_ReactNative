package com.example.quickFood.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SocketChat {
    private int id;
    private int roomId;
    private String reaction;
}
