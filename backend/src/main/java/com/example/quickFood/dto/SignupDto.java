package com.example.quickFood.dto;

import com.example.quickFood.enums.Role;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SignupDto {
    private String id;
    private String name;
    private String password;
    private Role role;
}
