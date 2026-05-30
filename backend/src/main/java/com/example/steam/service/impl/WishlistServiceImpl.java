package com.example.steam.service.impl;

import com.example.steam.model.Game;
import com.example.steam.model.User;
import com.example.steam.model.Wishlist;
import com.example.steam.model.dto.ResponseGameDto;
import com.example.steam.repository.GameRepository;
import com.example.steam.repository.UserRepository;
import com.example.steam.repository.WishlistRepository;
import com.example.steam.service.WishlistServiceInterface;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class WishlistServiceImpl implements WishlistServiceInterface {
    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final WishlistRepository wishlistRepository;

    @Override
    public void addToWishlist(User user, Integer gameId) {

        Game game = gameRepository.findById(gameId).orElseThrow(() -> new RuntimeException("Juego no encontrado"));

        if (wishlistRepository.existsByUserAndGame(user, game)) {
            throw new RuntimeException("El juego ya está en la wishlist del usuario");
        }

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setGame(game);

        wishlistRepository.save(wishlist);
    }

    @Override
    public void removeFromWishlist(User user, Integer gameId) {

        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Juego no encontrado"));

        if (!wishlistRepository.existsByUserAndGame(user, game)) {
            throw new RuntimeException("El juego no está en la wishlist");
        }

        wishlistRepository.deleteByUserAndGame(user, game);
    }

    @Override
    public List<ResponseGameDto> getWishlistGames(User user) {

        List<Wishlist> wishlistItems = wishlistRepository.findByUser(user);

        return wishlistItems.stream()
                .map(Wishlist::getGame)
                .map(game -> new ResponseGameDto(
                        game.getIdGame().toString(),
                        game.getName(),
                        game.getDescription(),
                        game.getPrice().doubleValue(),
                        game.getDeveloper().getStudioName(),
                        game.getImageUrl(),
                        game.getCategories()
                                .stream()
                                .map(category -> category.getName())
                                .toList(),
                        game.getReleaseDate()
                ))
                .toList();
    }
}
