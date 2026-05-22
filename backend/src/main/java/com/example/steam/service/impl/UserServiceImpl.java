package com.example.steam.service.impl;

import com.example.steam.model.Usuario;
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
    public Usuario getUsuarioByUsername(String name) {
        Optional<Usuario> usuario = userRepository.findByNombre(name);

        return usuario.orElse(null);
    }
}
