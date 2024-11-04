package com.example.quickFood.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RestaurantDto {
    private String id;
    private String name;
    private String owner;
    private String address;
    private String mobile;
    private byte[] image;
}
