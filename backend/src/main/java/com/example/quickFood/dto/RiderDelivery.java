package com.example.quickFood.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RiderDelivery {
    private int orderId;
    private double latitude;
    private double longitude;
}
