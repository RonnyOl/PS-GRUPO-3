package com.example.steam.service.impl;

import com.example.steam.model.Game;
import com.example.steam.model.Library;
import com.example.steam.model.Review;
import com.example.steam.model.User;
import com.example.steam.model.dto.RequestReviewDTO;
import com.example.steam.repository.GameRepository;
import com.example.steam.repository.LibraryRepository;
import com.example.steam.repository.ReviewRepository;
import com.example.steam.repository.UserRepository;
import com.example.steam.service.ReviewServiceInterface;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ReviewServiceImpl implements ReviewServiceInterface {

    private final GameRepository gameRepository;
    private final LibraryRepository libraryRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    public ReviewServiceImpl(GameRepository gameRepository, LibraryRepository libraryRepository, ReviewRepository reviewRepository, UserRepository userRepository) {
        this.gameRepository = gameRepository;
        this.libraryRepository = libraryRepository;
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void createReview(String email, RequestReviewDTO dto) {

        // 1. Validar que el juego exista en el catálogo
        Game game = gameRepository.findById(dto.gameId())
                .orElseThrow(() -> new RuntimeException("El juego especificado no existe."));

        // 2. REGLA 1: Validar propiedad usando el EMAIL
        boolean hasGame = libraryRepository.existsByUser_EmailAndGame_IdGame(email, dto.gameId());
        if (!hasGame) {
            throw new IllegalStateException("No podés dejar una reseña de un juego que no está en tu biblioteca.");
        }

        // 3. REGLA 2: Validar duplicados usando el EMAIL
        boolean alreadyReviewed = reviewRepository.existsByUser_EmailAndGame_IdGame(email, dto.gameId());
        if (alreadyReviewed) {
            throw new IllegalStateException("Ya dejaste una opinión para este juego.");
        }

        // 4. Recién acá buscamos al usuario por email para asociarlo a la entidad final
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con el email: " + email));

        // 5. Guardamos la Review
        Review review = new Review();
        review.setUser(user);
        review.setGame(game);
        review.setScore(dto.score());
        review.setComment(dto.comment());
        review.setReviewDate(LocalDateTime.now());

        reviewRepository.save(review);
    }
}
