package com.example.steam.service;

import java.util.List;

public interface LibraryServiceInterface {

    List<Integer> findOwnedGamesInSelection(Integer userId, List<Integer> gameIdsToCheck);
}
