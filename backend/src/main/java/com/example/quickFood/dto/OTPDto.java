package com.example.quickFood.dto;

import lombok.*;

import java.sql.Timestamp;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OTPDto {
    private int id;
    private String userEmail;
    private String otp;
    private Timestamp timestamp;
}
