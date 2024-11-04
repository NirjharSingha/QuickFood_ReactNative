package com.example.quickFood.dto;

import com.example.quickFood.enums.PaymentMethod;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PlaceOrder {
    private String userId;
    private String restaurantId;
    private String deliveryAddress;
    private int deliveryTime;
    private double deliveryFee;
    private double price;
    private PaymentMethod paymentMethod;
    private List<OrderQuantity> orderQuantities;
    private double latitude;
    private double longitude;
    private double riderTip;
}
