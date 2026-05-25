package com.example.steam.service;


import com.example.steam.model.User;

public interface JwtServiceInterface {
    String generateToken(User user);
    String extractEmail(String token);
    boolean isTokenValid(String token, User user);

}