package com.example.steam.controller;

import com.example.steam.dto.AuthResponse;
import com.example.steam.dto.LoginRequest;
import com.example.steam.dto.RegisterRequest;
import com.example.steam.service.AuthServiceInterface;
import com.example.steam.service.impl.AuthServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthServiceInterface authService;

    @PostMapping("/register")
    public AuthResponse register(
            @RequestBody RegisterRequest request
    ) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request
    ) {
        return authService.login(request);
    }
}