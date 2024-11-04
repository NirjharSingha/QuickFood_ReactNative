package com.example.quickFood.dto;

import lombok.*;

import java.sql.Timestamp;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DeliveryTimes {
    private int id;
    private Timestamp orderPlaced;
    private Timestamp deliveryCompleted;
    private String complain;
    private int deliveryTime;
}
