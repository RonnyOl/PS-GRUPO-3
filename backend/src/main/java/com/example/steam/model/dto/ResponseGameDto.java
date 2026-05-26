package com.example.steam.model.dto;

import java.time.LocalDate;
import java.util.List;

public record ResponseGameDto(String id, String name, String description, Double price, String company, String imageUrl, List<String> categories, LocalDate releaseDate) {
}
