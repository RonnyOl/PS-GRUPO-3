package com.example.steam.service;

import com.example.steam.model.Juego;
import com.example.steam.model.dto.ResponseGameDto;

import java.util.List;

public interface GameServiceInterface {

     Juego getGame(Integer gameId);
     void validateGamesExists(List<Integer> gamesIds);
     List<Juego> getGames(List<Integer> gamesIds);
     List<Juego> getAllGames();
     List<String> getTitlesByIds(List<Integer> gameIds);

     ResponseGameDto getGameToApi(Integer gameId);
     List<ResponseGameDto> getGamesToApi(List<Integer> gamesIds);
     List<ResponseGameDto> getAllGamesToApi();
}
