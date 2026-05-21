package com.example.steam.service.impl;

import com.example.steam.model.Juego;
import com.example.steam.repository.GameRepository;
import com.example.steam.service.GameServiceInterface;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class GameServiceImpl implements GameServiceInterface {

    private final GameRepository gameRepository;

    public GameServiceImpl(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @Override
    public Juego getGame(Integer gameId) {
        return gameRepository.findById(gameId).orElse(null);
    }

    @Override
    public List<Juego> getGames(List<Integer> gamesIds) {
        return gameRepository.findAllByIdIn(gamesIds);
    }

    @Override
    public void validateGamesExists(List<Integer> gamesIds) {
        if (gamesIds == null || gamesIds.isEmpty()) {
            throw new IllegalArgumentException("La lista de juegos no puede estar vacía.");
        }

        Set<Integer> uniqueIdsToValidate = Set.copyOf(gamesIds);

        List<Juego> existingGames = gameRepository.findAllByIdIn(List.copyOf(uniqueIdsToValidate));

        if (existingGames.size() != uniqueIdsToValidate.size()) {

            Set<Integer> existingIds = existingGames.stream()
                    .map(Juego::getIdJuego)
                    .collect(Collectors.toSet());

            List<Integer> missingIds = uniqueIdsToValidate.stream()
                    .filter(id -> !existingIds.contains(id))
                    .toList();

            throw new RuntimeException("Los siguientes juegos no existen en el catálogo: " + missingIds);
        }
    }
}
