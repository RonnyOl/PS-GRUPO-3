package com.example.steam.service;

import com.example.steam.model.User;

public interface UserServiceInterface {
    User getUserByName(String name);
    User loadUserByEmail(String email);
}
