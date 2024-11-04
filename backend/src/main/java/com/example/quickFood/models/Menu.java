package com.example.quickFood.models;

import com.example.quickFood.enums.Category;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "menu",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"restaurant_id", "name"}, name = "unique_name_per_restaurant")
        }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Menu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // strategy to auto-increment
    private int id;

    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id") // Foreign key mapping
    private Restaurant restaurant;

    private double price;

    @Enumerated(EnumType.STRING)
    private Category category;

    @Lob
    @Column(name = "image", columnDefinition = "LONGBLOB")
    private byte[] image;

    private int quantity;
}
