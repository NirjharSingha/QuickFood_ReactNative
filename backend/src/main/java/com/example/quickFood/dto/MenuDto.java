package com.example.quickFood.dto;

import com.example.quickFood.enums.Category;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MenuDto {
    private int id;
    private String restaurantId;
    private String name;
    private double price;
    private Category category;
    private byte[] image;
    private int quantity;
}
