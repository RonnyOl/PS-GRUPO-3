package com.example.steam.service.impl;


import com.example.steam.dto.AuthResponse;
import com.example.steam.dto.LoginRequest;
import com.example.steam.dto.RegisterRequest;
import com.example.steam.model.User;
import com.example.steam.repository.UserRepository;
import com.example.steam.service.AuthServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthServiceInterface {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtServiceImpl jwtServiceImpl;

    public AuthResponse register(RegisterRequest request) {

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        userRepository.save(user);

        String token = jwtServiceImpl.generateToken(user.getEmail());

        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest request) {

        User user = (User) userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean validPassword = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!validPassword) {
            throw new RuntimeException("Password incorrecta");
        }

        String token = jwtServiceImpl.generateToken(user.getEmail());

        return new AuthResponse(token);
    }
}
