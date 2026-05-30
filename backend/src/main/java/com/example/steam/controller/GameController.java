package com.example.steam.controller;

import com.example.steam.dto.GameResponse;
import com.example.steam.dto.PublishGameRequest;
import com.example.steam.model.User;
import com.example.steam.model.dto.ResponseGameDetailDto;
import com.example.steam.model.dto.ResponseGameDetailDto;
import com.example.steam.model.dto.ResponseGameDto;
import com.example.steam.service.GameServiceInterface;
import com.example.steam.service.WishlistServiceInterface;
import jakarta.transaction.Transactional;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/v1/games")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class GameController {

    private final GameServiceInterface gameService;
    private final WishlistServiceInterface wishlistService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllGames(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice
    ) {
        return ResponseEntity.ok(
                gameService.getAllGamesToApi(categoryId, minPrice, maxPrice)
        );
    }

    @PostMapping("/publish")
    public ResponseEntity<GameResponse> publishGame(@Valid @RequestBody PublishGameRequest request, Authentication  authentication) {
        User user  = (User) authentication.getPrincipal();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        GameResponse newGame = gameService.publishGame(request, user);
        return new ResponseEntity<>(newGame, HttpStatus.CREATED);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ResponseGameDto>> searchGames(@RequestParam String name) {
        return ResponseEntity.ok(gameService.searchGames(name));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseGameDetailDto> searchGames(@PathVariable Integer id) {
        return ResponseEntity.ok(gameService.getGameDetail(id));
    }

    @PostMapping("/wishlist/add/{gameId}")
    public ResponseEntity<String> addToWishlist(
            @PathVariable Integer gameId,
            Authentication authentication
    ) {
        try {

            if (authentication == null ||
                    !(authentication.getPrincipal() instanceof User user)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Usuario no autenticado");
            }

            wishlistService.addToWishlist(user, gameId);

            return ResponseEntity.ok("Juego agregado a la wishlist");

        } catch (Exception e) {

            String mensajeError = e.getMessage();

            if ("Juego no encontrado".equals(mensajeError)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(mensajeError);
            }

            if ("El juego ya está en la wishlist del usuario".equals(mensajeError)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(mensajeError);
            }

            return ResponseEntity.badRequest()
                    .body(mensajeError);
        }
    }
    @DeleteMapping("/wishlist/remove/{gameId}")
    @Transactional
    public ResponseEntity<String> removeToWishlist(
            @PathVariable Integer gameId,
            Authentication authentication
    ) {
        try {

            User user = (User) authentication.getPrincipal();

            if (user == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Usuario no autenticado");
            }

            wishlistService.removeFromWishlist(user, gameId);

            return ResponseEntity.ok("Juego removido de la wishlist");

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/wishlist")
    public ResponseEntity<List<ResponseGameDto>> getWishlist(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        wishlistService.getWishlistGames(user);
        return ResponseEntity.ok(wishlistService.getWishlistGames(user));
    }
}
