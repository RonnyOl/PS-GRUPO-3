package com.example.steam.service;




public interface JwtServiceInterface {
    String generateToken(String email);
    String extractEmail(String token);
}