package com.example.steam.service;


import com.example.steam.dto.AuthResponse;
import com.example.steam.dto.LoginRequest;
import com.example.steam.dto.RegisterRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthServiceInterface {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request, HttpServletResponse response);
}