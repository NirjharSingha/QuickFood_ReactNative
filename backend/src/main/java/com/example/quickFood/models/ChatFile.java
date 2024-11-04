package com.example.quickFood.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chat_files")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ChatFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_id")
    private Chat chat;

    @Lob
    @Column(name = "data", columnDefinition = "LONGBLOB")
    private byte[] data;

    private String fileType;
}
