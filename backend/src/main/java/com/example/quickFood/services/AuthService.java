package com.example.quickFood.services;

import com.example.quickFood.dto.*;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity<JwtAuthResponse> userSignup(SignupDto request);

    ResponseEntity<JwtAuthResponse> userLogin(LoginDto request);

    ResponseEntity<JwtAuthResponse> googleAuth(GoogleAuth request);

    ResponseEntity<String> saveOtp(OTPDto request);

    ResponseEntity<JwtAuthResponse> verifyOtp(OTPDto request, String username, String password);

    ResponseEntity<JwtAuthResponse> userSignupReactNative(SignupDto request);
}
