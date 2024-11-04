package com.example.quickFood.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rider_status")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RiderStatus {
    @Id
    private String id;

    private boolean isAvailable;
}
