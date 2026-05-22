package com.example.steam.model.dto;

import com.example.steam.model.Juego;

public record ResponseGameDto(String id, String name, String description, Double price, String genre, String company) {
}
