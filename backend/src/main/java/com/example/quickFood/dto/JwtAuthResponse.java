package com.example.quickFood.dto;

import com.example.quickFood.enums.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtAuthResponse {
  private String token;
  @Enumerated(EnumType.STRING)
  private Role role;
  private String error;
}
