package com.example.steam.controller;

import com.example.steam.dto.GameResponse;
import com.example.steam.dto.PublishGameRequest;
import com.example.steam.service.GameServiceInterface;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/v1/games")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class GameController {

    private final GameServiceInterface gameService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllGames() {
        return ResponseEntity.ok(gameService.getAllGamesToApi());
    }

    @PostMapping("/publish")
    public ResponseEntity<GameResponse> publishGame(@Valid @RequestBody PublishGameRequest request) {
        GameResponse newGame = gameService.publishGame(request);
        return new ResponseEntity<>(newGame, HttpStatus.CREATED);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchGames(@RequestParam String name) {
        return ResponseEntity.ok(gameService.searchGames(name));
    }

}
