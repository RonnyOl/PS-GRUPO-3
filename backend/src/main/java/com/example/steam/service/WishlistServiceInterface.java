package com.example.steam.service;

import com.example.steam.dto.GameResponse;
import com.example.steam.dto.PublishGameRequest;
import com.example.steam.model.Game;
import com.example.steam.model.User;
import com.example.steam.model.dto.ResponseGameDto;

import java.math.BigDecimal;
import java.util.List;

public interface WishlistServiceInterface {

        void addToWishlist(User user, Integer gameId);

        void removeFromWishlist(User user, Integer gameId);

        List<ResponseGameDto> getWishlistGames(User user);
}
