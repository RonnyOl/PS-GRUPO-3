package com.example.steam.service;

import com.example.steam.model.Game;
import com.example.steam.model.dto.ResponseGameDto;

import java.util.List;

public interface GameServiceInterface {

     Game getGame(Integer gameId);
     void validateGamesExists(List<Integer> gamesIds);
     List<Game> getGames(List<Integer> gamesIds);
     List<Game> getAllGames();
     List<String> getTitlesByIds(List<Integer> gameIds);

     ResponseGameDto getGameToApi(Integer gameId);
     List<ResponseGameDto> getGamesToApi(List<Integer> gamesIds);
     List<ResponseGameDto> getAllGamesToApi();
}
