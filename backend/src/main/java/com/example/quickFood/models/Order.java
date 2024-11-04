package com.example.quickFood.models;

import com.example.quickFood.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Entity
@Table(name = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rider_id")
    private User rider;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;

    private double price;
    private String deliveryAddress;
    private int deliveryTime;
    private double deliveryFee;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    private Timestamp orderPlaced;
    private Timestamp deliveryTaken;
    private Timestamp userNotified;
    private Timestamp deliveryCompleted;
    private Timestamp cancelled;
    private boolean isPrepared;

    @Lob
    @Column(length = 1024)
    private String complain;

    private double latitude;
    private double longitude;
    private double riderTip;
}
