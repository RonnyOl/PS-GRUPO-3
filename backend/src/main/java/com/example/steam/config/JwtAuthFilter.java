package com.example.steam.config;

import com.example.steam.model.User;
import com.example.steam.service.JwtServiceInterface;
import com.example.steam.service.UserServiceInterface;
import com.example.steam.service.impl.JwtServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtServiceInterface jwtService;
    private final UserServiceInterface userService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String token = null;

        if (request.getCookies() != null) {

            for (Cookie cookie : request.getCookies()) {

                if (cookie.getName().equals("token")) {
                    token = cookie.getValue();
                }
            }
        }

        try {

            if (token != null) {

                String email = jwtService.extractEmail(token);

                if (
                        email != null &&
                                SecurityContextHolder.getContext().getAuthentication() == null
                ) {

                    User user = userService.loadUserByEmail(email);

                    if (jwtService.isTokenValid(token, user)) {

                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(
                                        user,
                                        null,
                                        user.getAuthorities()
                                );

                        authToken.setDetails(
                                new WebAuthenticationDetailsSource()
                                        .buildDetails(request)
                        );

                        SecurityContextHolder.getContext()
                                .setAuthentication(authToken);
                    }
                }
            }

        } catch (Exception e) {

            SecurityContextHolder.clearContext();

        }

        filterChain.doFilter(request, response);
    }
}