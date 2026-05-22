package com.example.steam.service.impl;

import com.example.steam.model.Juego;
import com.example.steam.model.dto.ResponseGameDto;
import com.example.steam.repository.GameRepository;
import com.example.steam.service.GameServiceInterface;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Service
public class GameServiceImpl implements GameServiceInterface {

    private final GameRepository gameRepository;

    public GameServiceImpl(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @Override
    public ResponseGameDto getGameToApi(Integer gameId) {

        Juego game = gameRepository.findById(gameId).orElse(null);
        if (game == null) {
            throw new RuntimeException("El juego con ID " + gameId + " no existe.");
        }

        return new ResponseGameDto(
                game.getIdJuego().toString(),
                game.getNombre(),
                game.getDescripcion(),
                game.getPrecio().doubleValue(),
                game.getGenero(),
                game.getDesarrollador().getNombreEstudio()
        );
    }

    @Override
    public List<ResponseGameDto> getGamesToApi(List<Integer> gamesIds) {
        List<Juego> games = gameRepository.findAllByIdJuegoIn(gamesIds);

        return games.stream().map(game -> new ResponseGameDto(
                game.getIdJuego().toString(),
                game.getNombre(),
                game.getDescripcion(),
                game.getPrecio().doubleValue(),
                game.getGenero(),
                game.getDesarrollador().getNombreEstudio()
        )).toList();
    }

    @Override
    public List<ResponseGameDto> getAllGamesToApi() {
        List<Juego> games = gameRepository.findAll();

        return games.stream().map(game -> new ResponseGameDto(
                game.getIdJuego().toString(),
                game.getNombre(),
                game.getDescripcion(),
                game.getPrecio().doubleValue(),
                game.getGenero(),
                game.getDesarrollador().getNombreEstudio()
        )).toList();
    }

    @Override
    public Juego getGame(Integer gameId) {
        return gameRepository.findById(gameId).orElse(null);
    }

    @Override
    public List<Juego> getGames(List<Integer> gamesIds) {
        return gameRepository.findAllByIdJuegoIn(gamesIds);
    }

    @Override
    public List<Juego> getAllGames() {
        return gameRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getTitlesByIds(List<Integer> gameIds) {
        if (gameIds == null || gameIds.isEmpty()) {
            return List.of();
        }
        List<String> titles = gameRepository.findNombresByIdsIn(gameIds);
        return List.copyOf(titles);
    }

    @Override
    public void validateGamesExists(List<Integer> gamesIds) {
        if (gamesIds == null || gamesIds.isEmpty()) {
            throw new IllegalArgumentException("La lista de juegos no puede estar vacía.");
        }

        Set<Integer> uniqueIdsToValidate = Set.copyOf(gamesIds);

        List<Juego> existingGames = gameRepository.findAllByIdJuegoIn(List.copyOf(uniqueIdsToValidate));

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
