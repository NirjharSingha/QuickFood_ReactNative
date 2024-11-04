package com.example.quickFood.services;

import com.example.quickFood.dto.OrderCard;
import com.example.quickFood.dto.OrderDataPage;
import com.example.quickFood.dto.PlaceOrder;
import com.example.quickFood.dto.RiderDelivery;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface OrderService {
    List<OrderCard> getOrderCard(String id, String flag);

    ResponseEntity<String> placeOrder(PlaceOrder placeOrder);

    ResponseEntity<OrderDataPage> getOrderDataPage(int orderId);

    ResponseEntity<String> markAsPrepared(int orderId);

    ResponseEntity<RiderDelivery> getDeliveryOfRider(String riderId);

    ResponseEntity<String> updateStatus(int orderId, int status);

    ResponseEntity<String> complaint(int orderId, String complain);

    Integer isRefundable(int orderId);

    String cancelOrder(Pair<Integer, Boolean> data);
}
