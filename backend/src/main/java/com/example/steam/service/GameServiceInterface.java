package com.example.steam.service;

import com.example.steam.model.Juego;

import java.util.List;

public interface GameServiceInterface {

     Juego getGame(Integer gameId);
     void validateGamesExists(List<Integer> gamesIds);
     List<Juego> getGames(List<Integer> gamesIds);
}
