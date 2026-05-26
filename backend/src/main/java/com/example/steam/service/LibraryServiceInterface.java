package com.example.steam.service;

import com.example.steam.model.Game;

import java.util.List;

public interface LibraryServiceInterface {

    List<Integer> findOwnedGamesInSelection(Integer userId, List<Integer> gameIdsToCheck);

    List<Game> findOwnedGamesByUser(String email);
}
