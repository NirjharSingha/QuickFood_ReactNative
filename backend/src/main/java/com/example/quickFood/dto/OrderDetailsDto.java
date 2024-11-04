package com.example.quickFood.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderDetailsDto {
    private int menuId;
    private String menuName;
    private double price;
    private byte[] image;
    private int quantity;
}
