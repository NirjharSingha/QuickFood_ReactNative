package com.example.quickFood.models;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Entity
@Table(name = "restaurants")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Restaurant {
    @Id
    private String id;
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner") // Foreign key mapping
    private User owner;

    private String address;
    private String mobile;
    private Timestamp regDate;

    @Lob
    @Column(name = "image", columnDefinition = "LONGBLOB")
    protected byte[] image;
}
