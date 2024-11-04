package com.example.quickFood.models;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Entity
@Table(name = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // strategy to auto-increment
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // Foreign key mapping
    private User user;

    @Lob
    @Column(length = 512)
    private String description;
    private Timestamp timestamp;
    private boolean isSeen;
}
