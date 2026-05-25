package com.example.steam.controller;

import com.example.steam.dto.AuthResponse;
import com.example.steam.dto.DevRegisterRequest;
import com.example.steam.dto.LoginRequest;
import com.example.steam.dto.RegisterRequest;
import com.example.steam.model.User;
import com.example.steam.model.dto.ResponseUserDTO;
import com.example.steam.service.AuthServiceInterface;
import com.example.steam.service.impl.AuthServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
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

    @PostMapping("/registerdev")
    public AuthResponse registerDev(
            @RequestBody DevRegisterRequest request
    ) {
        return authService.registerDev(request);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        return authService.login(request, response);
    }

    @GetMapping("/user/me")
    public ResponseUserDTO getCurrentUser(Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        System.out.println("User: " + user.getUsername() + ", Email: " + user.getEmail() + ", Role: " + user.getRole());
        return new ResponseUserDTO(
                user.getEmail(),
                user.getUsername(),
                user.getRole()
        );
    }
}