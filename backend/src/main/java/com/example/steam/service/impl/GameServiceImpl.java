package com.example.steam.service.impl;

import com.example.steam.model.Game;
import com.example.steam.model.dto.ResponseGameDto;
import com.example.steam.repository.GameRepository;
import com.example.steam.service.GameServiceInterface;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public ResponseGameDto getGameToApi(Integer gameId) {

        Game game = gameRepository.findById(gameId).orElse(null);
        if (game == null) {
            throw new RuntimeException("El juego con ID " + gameId + " no existe.");
        }

        return new ResponseGameDto(
                game.getIdGame().toString(),
                game.getName(),
                game.getDescription(),
                game.getPrice().doubleValue(),
                game.getGenre(),
                game.getDeveloper().getStudioName(),
                game.getImageUrl()
        );
    }

    @Override
    public List<ResponseGameDto> getGamesToApi(List<Integer> gamesIds) {
        List<Game> games = gameRepository.findAllByIdGameIn(gamesIds);

        return games.stream().map(game -> new ResponseGameDto(
                game.getIdGame().toString(),
                game.getName(),
                game.getDescription(),
                game.getPrice().doubleValue(),
                game.getGenre(),
                game.getDeveloper().getStudioName(),
                game.getImageUrl()
        )).toList();
    }

    @Override
    public List<ResponseGameDto> getAllGamesToApi() {
        List<Game> games = gameRepository.findAll();

        return games.stream().map(game -> new ResponseGameDto(
                game.getIdGame().toString(),
                game.getName(),
                game.getDescription(),
                game.getPrice().doubleValue(),
                game.getGenre(),
                game.getDeveloper().getStudioName(),
                game.getImageUrl()
        )).toList();
    }

    @Override
    public Game getGame(Integer gameId) {
        return gameRepository.findById(gameId).orElse(null);
    }

    @Override
    public List<Game> getGames(List<Integer> gamesIds) {
        return gameRepository.findAllByIdGameIn(gamesIds);
    }

    @Override
    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getTitlesByIds(List<Integer> gameIds) {
        if (gameIds == null || gameIds.isEmpty()) {
            return List.of();
        }
        List<String> titles = gameRepository.findNamesByIdsIn(gameIds);
        return List.copyOf(titles);
    }

    @Override
    public void validateGamesExists(List<Integer> gamesIds) {
        if (gamesIds == null || gamesIds.isEmpty()) {
            throw new IllegalArgumentException("La lista de juegos no puede estar vacía.");
        }

        Set<Integer> uniqueIdsToValidate = Set.copyOf(gamesIds);

        List<Game> existingGames = gameRepository.findAllByIdGameIn(List.copyOf(uniqueIdsToValidate));

        if (existingGames.size() != uniqueIdsToValidate.size()) {

            Set<Integer> existingIds = existingGames.stream()
                    .map(Game::getIdGame)
                    .collect(Collectors.toSet());

            List<Integer> missingIds = uniqueIdsToValidate.stream()
                    .filter(id -> !existingIds.contains(id))
                    .toList();

            throw new RuntimeException("Los siguientes juegos no existen en el catálogo: " + missingIds);
        }
    }
}
