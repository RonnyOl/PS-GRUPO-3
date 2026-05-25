package com.example.steam.service;


import com.example.steam.model.User;

public interface JwtServiceInterface {
    String generateToken(String email);
    String extractEmail(String token);
    boolean isTokenValid(String token, User user);

}