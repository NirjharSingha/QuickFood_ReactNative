package com.example.quickFood.controllers;

import com.example.quickFood.dto.*;
import com.example.quickFood.services.impl.AuthServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    @Autowired
    private final AuthServiceImpl authenticationService;

    @PostMapping("/signup")
    public ResponseEntity<JwtAuthResponse> userSignup(@RequestBody SignupDto request) {
        return authenticationService.userSignup(request);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> userLogin(@RequestBody LoginDto request) {
        return authenticationService.userLogin(request);
    }

    @PostMapping("/googleAuth")
    public ResponseEntity<JwtAuthResponse> googleAuth(@RequestBody GoogleAuth request) {
        return authenticationService.googleAuth(request);
    }

    @PostMapping("/saveOtp")
    public ResponseEntity<String> saveOtp(@RequestBody OTPDto request) {
        return authenticationService.saveOtp(request);
    }

    @PostMapping("/verifyOtp")
    public ResponseEntity<JwtAuthResponse> verifyOtp(@RequestBody OTPDto request, @RequestParam String username, @RequestParam String password) {
        return authenticationService.verifyOtp(request, username, password);
    }

    @PostMapping("/signupReactNative")
    public ResponseEntity<JwtAuthResponse> userSignupReactNative(@RequestBody SignupDto request) {
        return authenticationService.userSignupReactNative(request);
    }

}