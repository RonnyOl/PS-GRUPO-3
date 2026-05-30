package com.example.steam.model.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RequestReviewDTO(
        @NotNull(message = "El ID del juego es obligatorio")
        Integer gameId,

        @NotNull(message = "La puntuación es obligatoria")
        @Min(value = 1, message = "La puntuación mínima es 1")
        @Max(value = 5, message = "La puntuación máxima es 5")
        Integer score,

        @NotBlank(message = "El comentario no puede estar vacío")
        String comment
) {}
