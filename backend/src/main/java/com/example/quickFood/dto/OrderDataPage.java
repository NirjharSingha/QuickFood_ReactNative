package com.example.quickFood.dto;

import com.example.quickFood.enums.PaymentMethod;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.sql.Timestamp;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderDataPage {
    private String customerName;
    private String restaurantName;
    private String riderName;
    private List<OrderDetailsDto> menuItems;
    private double price;
    private double deliveryFee;
    private int deliveryTime;
    private String deliveryAddress;

    @JsonProperty("isPrepared")
    private boolean isPrepared;

    private PaymentMethod paymentMethod;

    private Timestamp orderPlaced;
    private Timestamp deliveryTaken;
    private Timestamp userNotified;
    private Timestamp deliveryCompleted;
}
