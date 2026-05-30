package com.example.steam.service;

import com.example.steam.dto.GameResponse;
import com.example.steam.dto.PublishGameRequest;
import com.example.steam.model.Game;
import com.example.steam.model.User;
import com.example.steam.model.dto.ResponseGameDto;

import java.math.BigDecimal;
import java.util.List;

public interface GameServiceInterface {

    List<ResponseGameDto> searchGames(String name);

     Game getGame(Integer gameId);
     void validateGamesExists(List<Integer> gamesIds);
     List<Game> getGames(List<Integer> gamesIds);
     List<Game> getAllGames();
     List<String> getTitlesByIds(List<Integer> gameIds);

     ResponseGameDto getGameToApi(Integer gameId);
     List<ResponseGameDto> getGamesToApi(List<Integer> gamesIds);
 List<ResponseGameDto> getAllGamesToApi(
         Long categoryId,
         BigDecimal minPrice,
         BigDecimal maxPrice
 );

     GameResponse publishGame(PublishGameRequest request, User currentUser);
}
