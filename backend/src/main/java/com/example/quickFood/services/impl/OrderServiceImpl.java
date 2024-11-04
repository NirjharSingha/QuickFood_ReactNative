package com.example.quickFood.services.impl;

import com.example.quickFood.dto.*;
import com.example.quickFood.enums.PaymentMethod;
import com.example.quickFood.models.*;
import com.example.quickFood.repositories.*;
import com.example.quickFood.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    @Autowired
    private final OrderRepository orderRepository;

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final RestaurantRepository restaurantRepository;

    @Autowired
    private final RiderStatusRepository riderStatusRepository;

    @Autowired
    private final OrderDetailsRepository orderDetailsRepository;

    @Autowired
    private final MenuRepository menuRepository;

    @Autowired
    private final MenuServiceImpl menuService;

    @Autowired
    private final NotificationServiceImpl notificationService;

    @Autowired
    private final ChatServiceImpl chatService;

    @Override
    public List<OrderCard> getOrderCard(String id, String flag) {
        List<Integer> orderIds = new ArrayList<>();
        if (Objects.equals(flag, "rating")) {
            orderIds = orderRepository.findOrdersToReview(id);
        } else if (Objects.equals(flag, "resPendingOrder")) {
            orderIds = orderRepository.findPendingOrderOfRestaurant(id);
        } else if (Objects.equals(flag, "userPendingOrder")) {
            orderIds = orderRepository.findPendingOrderOfUser(id);
        }

        List<OrderCard> orderCards = new ArrayList<>();

        for (int orderId : orderIds) {
            Order order = orderRepository.findById(orderId).get();
            OrderCard orderCard = new OrderCard(order.getId(), order.getRestaurant().getName(),
                    order.getRestaurant().getImage(), order.getPrice(), order.getPaymentMethod(), order.getOrderPlaced());
            orderCards.add(orderCard);
        }
        return orderCards;
    }

    @Override
    @Transactional
    public ResponseEntity<String> placeOrder(PlaceOrder placeOrder) {
        if (!menuService.validateOrderQuantity(placeOrder.getOrderQuantities())) {
            return ResponseEntity.badRequest().body("Food items out of stock");
        }
        String availableRider = riderStatusRepository.findAvailableRider();
        if (availableRider == null) {
            return ResponseEntity.badRequest().body("No available rider");
        }
        User user = userRepository.findById(placeOrder.getUserId()).get();
        User rider = userRepository.findById(availableRider).get();
        Restaurant restaurant = restaurantRepository.findById(placeOrder.getRestaurantId()).get();

        Order order = Order.builder()
                .user(user)
                .price(placeOrder.getPrice())
                .restaurant(restaurant)
                .rider(rider)
                .deliveryAddress(placeOrder.getDeliveryAddress())
                .deliveryFee(placeOrder.getDeliveryFee())
                .deliveryTime(placeOrder.getDeliveryTime())
                .paymentMethod(placeOrder.getPaymentMethod())
                .orderPlaced(new Timestamp(System.currentTimeMillis()))
                .latitude(placeOrder.getLatitude())
                .longitude(placeOrder.getLongitude())
                .riderTip(placeOrder.getRiderTip())
                .build();

        Order savedOrder = orderRepository.save(order);

        RiderStatus riderStatus = new RiderStatus(availableRider, false);
        riderStatusRepository.save(riderStatus);

        menuService.updateQuantity(placeOrder.getOrderQuantities());

        for (OrderQuantity orderQuantity : placeOrder.getOrderQuantities()) {
            OrderDetails orderDetails = OrderDetails.builder()
                    .order(savedOrder)
                    .menu(menuRepository.findById(orderQuantity.getId()).get())
                    .quantity(orderQuantity.getQuantity())
                    .build();
            orderDetailsRepository.save(orderDetails);
        }

        String riderNotification = "You have a new delivery from " + restaurant.getName() + " to customer " + user.getName() + " at place " + placeOrder.getDeliveryAddress() + " within " + placeOrder.getDeliveryTime() + " minutes";
        notificationService.addNotification(availableRider, riderNotification);
        notificationService.sendNotificationToUser(availableRider, "You have a new delivery");

        String restaurantNotification = "You have a new order from " + user.getName() + " with items worth " + placeOrder.getPrice();
        notificationService.addNotification(savedOrder.getRestaurant().getOwner().getId(), restaurantNotification);
        notificationService.sendNotificationToUser(savedOrder.getRestaurant().getOwner().getId(), "You have a new order");

        return ResponseEntity.ok("Order placed successfully");
    }

    @Override
    public ResponseEntity<OrderDataPage> getOrderDataPage(int orderId) {
        Order order = orderRepository.findById(orderId).get();
        List<OrderDetails> orderDetails = orderDetailsRepository.findByOrderId(orderId);
        List<OrderDetailsDto> menuItems = new ArrayList<>();
        for (OrderDetails orderDetail : orderDetails) {
            OrderDetailsDto menu = new OrderDetailsDto(orderDetail.getMenu().getId(), orderDetail.getMenu().getName(), orderDetail.getMenu().getPrice(), orderDetail.getMenu().getImage(), orderDetail.getQuantity());
            menuItems.add(menu);
        }
        OrderDataPage orderDataPage = new OrderDataPage(order.getUser().getName(), order.getRestaurant().getName(), order.getRider().getName(), menuItems, order.getPrice(), order.getDeliveryFee(), order.getDeliveryTime(), order.getDeliveryAddress(), order.isPrepared(), order.getPaymentMethod(), order.getOrderPlaced(), order.getDeliveryTaken(), order.getUserNotified(), order.getDeliveryCompleted());
        return ResponseEntity.ok(orderDataPage);
    }

    @Override
    @Transactional
    public ResponseEntity<String> markAsPrepared(int orderId) {
        Timestamp cancelled = orderRepository.getCancellationStatus(orderId);

        if(cancelled == null) {
            orderRepository.markAsPrepared(orderId);
            return ResponseEntity.ok("Order marked as prepared");
        } else {
            return ResponseEntity.ok("Cancelled order");
        }
    }

    @Override
    public ResponseEntity<RiderDelivery> getDeliveryOfRider(String riderId) {
        Integer orderId = orderRepository.getDeliveryOfRider(riderId);
        if (orderId != null) {
            Pair<Double, Double> address = orderRepository.getDeliveryAddress(orderId);

            return ResponseEntity.ok(RiderDelivery.builder()
                    .orderId(orderId)
                    .latitude(address.getFirst())
                    .longitude(address.getSecond())
                    .build());
        } else {
            // Handle the case when no order is found for the rider
            return ResponseEntity.notFound().build();
        }
    }


    @Override
    public ResponseEntity<String> updateStatus(int orderId, int status) {
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        Timestamp cancelled = orderRepository.getCancellationStatus(orderId);

        if (cancelled == null) {
            if (status == 0) {
                orderRepository.deliveryTaken(orderId, timestamp);
                notificationService.addNotification(orderRepository.findById(orderId).get().getUser().getId(), "Your order has been taken by the rider");
                notificationService.sendNotificationToUser(orderRepository.findById(orderId).get().getUser().getId(), "Your order has been taken by the rider");
            } else if (status == 1) {
                orderRepository.userNotified(orderId, timestamp);
                notificationService.addNotification(orderRepository.findById(orderId).get().getUser().getId(), "The rider has reached to the delivery location with the order");
                notificationService.sendNotificationToUser(orderRepository.findById(orderId).get().getUser().getId(), "The rider has reached to the delivery location with the order");
            } else if (status == 2) {
                orderRepository.deliveryCompleted(orderId, timestamp);
                notificationService.addNotification(orderRepository.findById(orderId).get().getUser().getId(), "Your order has been delivered successfully");
                notificationService.sendNotificationToUser(orderRepository.findById(orderId).get().getUser().getId(), "Your order has been delivered successfully");

                String riderId = orderRepository.findById(orderId).get().getRider().getId();
                riderStatusRepository.save(new RiderStatus(riderId, true));
                chatService.deleteChats(orderId);
            }
            return ResponseEntity.ok("Status updated");
        } else {
            return ResponseEntity.ok("Cancelled order");
        }
    }

    @Override
    public ResponseEntity<String> complaint(int orderId, String complain) {
        orderRepository.complain(orderId, complain);
        return ResponseEntity.ok("Complaint registered");
    }

    @Override
    public Integer isRefundable(int orderId) {
        Order order = orderRepository.findById(orderId).get();
        Timestamp orderPlaced = order.getOrderPlaced();
        Timestamp currentTime = new Timestamp(System.currentTimeMillis());
        int deliveryTime = order.getDeliveryTime();
        long diff = currentTime.getTime() - orderPlaced.getTime();
        long diffMinutes = diff / (60 * 1000);

        boolean isLate = diffMinutes > deliveryTime;
        PaymentMethod paymentMethod = order.getPaymentMethod();

        // 1 for late delivery and online payment, so get refund
        // 2 for late delivery and cash on delivery, so no need to pay
        // 3 for on time delivery and online payment, so no refund
        // 4 for on time delivery and cash on delivery, so cannot cancel

        if (isLate && paymentMethod == PaymentMethod.ONLINE) {
            return 1;
        } else if (isLate && paymentMethod == PaymentMethod.COD) {
            return 2;
        } else if (!isLate && paymentMethod == PaymentMethod.ONLINE) {
            return 3;
        } else {
            return 4;
        }
    }

    @Override
    public String cancelOrder(Pair<Integer, Boolean> data) {
        int orderId = data.getFirst();
        boolean isRefundable = data.getSecond();

        Timestamp currentTime = new Timestamp(System.currentTimeMillis());
        orderRepository.cancelOrder(orderId, currentTime);

        if (isRefundable) {
            orderRepository.refund(orderId, PaymentMethod.REFUNDED);
        }

        Order savedOrder = orderRepository.findById(orderId).get();

        String riderNotification = "The order you are delivering is cancelled";
        notificationService.addNotification(savedOrder.getRider().getId(), riderNotification);
        notificationService.sendNotificationToUser(savedOrder.getRider().getId(), "You have a new delivery");

        String restaurantNotification = "An order placed in your restaurant " + savedOrder.getRestaurant().getName() + " by the customer " + savedOrder.getUser().getName() + " is cancelled";
        notificationService.addNotification(savedOrder.getRestaurant().getOwner().getId(), restaurantNotification);
        notificationService.sendNotificationToUser(savedOrder.getRestaurant().getOwner().getId(), restaurantNotification);

        riderStatusRepository.save(new RiderStatus(savedOrder.getRider().getId(), true));
        chatService.deleteChats(orderId);

        return "Order cancelled successfully";
    }
}
