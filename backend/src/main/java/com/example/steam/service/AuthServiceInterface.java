package com.example.steam.service;


import com.example.steam.dto.AuthResponse;
import com.example.steam.dto.LoginRequest;
import com.example.steam.dto.RegisterRequest;

public interface AuthServiceInterface {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}