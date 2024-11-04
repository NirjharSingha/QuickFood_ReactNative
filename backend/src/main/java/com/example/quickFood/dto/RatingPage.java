package com.example.quickFood.dto;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RatingPage {
    private String restaurantName;
    private byte[] restaurantPic;
    List<IdNameImgDto> menuItems;
}
