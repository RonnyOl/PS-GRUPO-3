package com.example.steam.model.dto;

import java.time.LocalDateTime;

public record ResponseReviewDTO(String userName, Integer score, String comment, LocalDateTime reviewDate) {
}
