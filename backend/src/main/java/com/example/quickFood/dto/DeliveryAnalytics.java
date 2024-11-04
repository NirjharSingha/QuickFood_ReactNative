package com.example.quickFood.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DeliveryAnalytics {
    private String name;
    private int successDeliveries;
    private int lateDeliveries;
    private int complaintDeliveries;
    private int bothIssues;
}
