package com.example.steam.model.dto;

import java.util.List;

public record ResponseGameDto(String id, String name, String description, Double price, String company, String image_url, List<String> categories) {
}
