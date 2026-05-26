package com.example.steam.service.impl;

import com.example.steam.dto.GameResponse;
import com.example.steam.dto.PublishGameRequest;
import com.example.steam.model.Category;
import com.example.steam.model.Developer;
import com.example.steam.model.Game;
import com.example.steam.model.User;
import com.example.steam.model.dto.ResponseGameDto;
import com.example.steam.repository.CategoryRepository;
import com.example.steam.repository.DeveloperRepository;
import com.example.steam.repository.GameRepository;
import com.example.steam.service.GameServiceInterface;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Service
public class GameServiceImpl implements GameServiceInterface {

    private final GameRepository gameRepository;
    private final DeveloperRepository developerRepository;
    private final CategoryRepository categoryRepository;

    public GameServiceImpl(GameRepository gameRepository, DeveloperRepository developerRepository, CategoryRepository categoryRepository) {
        this.gameRepository = gameRepository;
        this.developerRepository = developerRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional(readOnly = true)
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
                        game.getDeveloper().getStudioName(),
                        game.getImageUrl(),
                        game.getCategories()
                                .stream()
                                .map(Category::getName)
                                .toList(),
                        game.getReleaseDate()
                );
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResponseGameDto> getGamesToApi(List<Integer> gamesIds) {
        List<Game> games = gameRepository.findAllByIdGameIn(gamesIds);

        return games.stream()
                .map(game -> new ResponseGameDto(
                        game.getIdGame().toString(),
                        game.getName(),
                        game.getDescription(),
                        game.getPrice().doubleValue(),
                        game.getDeveloper().getStudioName(),
                        game.getImageUrl(),
                        game.getCategories()
                                .stream()
                                .map(Category::getName)
                                .toList(),
                        game.getReleaseDate()
                ))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResponseGameDto> getAllGamesToApi() {
        List<Game> games = gameRepository.findAll();

        return games.stream()
                .map(game -> new ResponseGameDto(
                        game.getIdGame().toString(),
                        game.getName(),
                        game.getDescription(),
                        game.getPrice().doubleValue(),
                        game.getDeveloper().getStudioName(),
                        game.getImageUrl(),
                        game.getCategories()
                                .stream()
                                .map(Category::getName)
                                .toList(),
                        game.getReleaseDate()
                ))
                .toList();
    }

    @Override
    @Transactional
    public GameResponse publishGame(PublishGameRequest request, User currentUser) {

        Developer developer = currentUser.getDeveloper();

        if (developer == null) {
            throw new RuntimeException("El usuario no es un desarrollador registrado.");
        }

        List<Category> categories = categoryRepository.findAllById(request.getCategoryIds());
        // 2. Crear la entidad Game a partir del DTO
        Game game = Game.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .releaseDate(request.getReleaseDate())
                .developer(developer)
                .categories(categories)
                .build();

        // 3. Guardar el juego en la base de datos
        Game savedGame = gameRepository.save(game);

        // 4. Mapear la entidad guardada al DTO de respuesta
        return new GameResponse(
                Long.valueOf(savedGame.getIdGame()),
                savedGame.getName(),
                Collections.singletonList(savedGame.getCategories().toString()), savedGame.getPrice(), savedGame.getImageUrl(),
                savedGame.getReleaseDate(), savedGame.getDeveloper().getStudioName());
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

    @Override
    @Transactional(readOnly = true)
    public List<ResponseGameDto> searchGames(String name) {

        List<Game> games = gameRepository.findByNameContainingIgnoreCase(name);

        return games.stream()
                .map(game -> new ResponseGameDto(
                        game.getIdGame().toString(),
                        game.getName(),
                        game.getDescription(),
                        game.getPrice().doubleValue(),
                        game.getDeveloper().getStudioName(),
                        game.getImageUrl(),
                        game.getCategories()
                                .stream()
                                .map(Category::getName)
                                .toList(),
                        game.getReleaseDate()
                ))
                .toList();
    }
}
