package com.example.steam.service.impl;

import com.example.steam.model.User;
import com.example.steam.repository.UserRepository;
import com.example.steam.service.UserServiceInterface;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserServiceInterface {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User getUserByName(String name) {
        Optional<User> user = userRepository.findByName(name);

        return user.orElse(null);
    }
    public User loadUserByEmail(String email){
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
