package com.example.steam.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameResponse {
    private Long id;
    private String name;
    private String description;
    private String genre;
    private BigDecimal price;
    private String imageUrl;
    private LocalDate releaseDate; //AAAA-MM-DD
    private String developerStudioName; //viene de developer.studio_name
}

/*
 {
    "id": 1,
    "name": "Juego Increíble",
    "description": "Una aventura épica.",
    "genre": "Fantasía",
    "price": 49.99,
    "imageUrl": "http://example.com/image.png",
    "releaseDate": "2024-10-28",
    "developerStudioName": "Estudio Fantástico"
}
 */