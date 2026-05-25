package com.example.steam.controller;

import com.example.steam.service.GameServiceInterface;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/games")
@CrossOrigin(origins = "http://localhost:3000")
public class GameController {

    private final GameServiceInterface gameService;


    public GameController(GameServiceInterface gameService) {
        this.gameService = gameService;
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllGames() {
        return ResponseEntity.ok(gameService.getAllGamesToApi());
    }
}
