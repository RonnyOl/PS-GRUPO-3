package com.example.steam.model.dto;

import java.math.BigDecimal;
import java.util.List;

public record ResponseGameDetailDto(Integer gameId, String name, String description, BigDecimal price, String developer, Long installed, Long favourite, List<ResponseReviewDTO> reviews) {

}
