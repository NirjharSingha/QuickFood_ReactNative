package com.example.quickFood.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ChatFileDto {
    private int id;
    private byte[] data;
    private String fileType;
}
