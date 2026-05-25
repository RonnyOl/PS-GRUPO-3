package com.example.steam.service.impl;


import com.example.steam.dto.AuthResponse;
import com.example.steam.dto.DevRegisterRequest;
import com.example.steam.dto.LoginRequest;
import com.example.steam.dto.RegisterRequest;
import com.example.steam.model.Developer;
import com.example.steam.model.User;
import com.example.steam.repository.DeveloperRepository;
import com.example.steam.repository.UserRepository;
import com.example.steam.service.AuthServiceInterface;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthServiceInterface {

    private final UserRepository userRepository;
    private final DeveloperRepository developerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtServiceImpl jwtServiceImpl;

    public AuthResponse registerDev(DevRegisterRequest request) {

        try {
            User user = new User();
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole("ROLE_DEVELOPER");
            user.setName(request.getName());

            userRepository.save(user);
            Developer developer = new Developer();
            developer.setUser(user);
            developer.setStudioName(request.getStudioName());
            developer.setTaxCode(request.getTaxCode());

            developerRepository.save(developer);

            String token = jwtServiceImpl.generateToken(user);
            return new AuthResponse(token);

        } catch (DataIntegrityViolationException e) {
            // Captura el error de clave duplicada de la base de datos
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "El correo electrónico ya se encuentra registrado."
            );
        }
    }

    public AuthResponse register(RegisterRequest request) {

        try {
            User user = new User();
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole("ROLE_USER");
            user.setName(request.getName());

            // El guardado va a fallar acá si el email está duplicado
            userRepository.save(user);

            String token = jwtServiceImpl.generateToken(user);
            return new AuthResponse(token);

        } catch (DataIntegrityViolationException e) {
            // Captura el error de clave duplicada de la base de datos
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "El correo electrónico ya se encuentra registrado."
            );
        }
    }

    public AuthResponse login(LoginRequest request, HttpServletResponse response) {

        User user = (User) userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean validPassword = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!validPassword) {
            throw new RuntimeException("Password incorrecta");
        }

        String token = jwtServiceImpl.generateToken(user);

        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(false) // true en producción con HTTPS
                .path("/")
                .maxAge(60 * 60 * 24) // 1 día
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return new AuthResponse("Login exitoso");
    }
}
