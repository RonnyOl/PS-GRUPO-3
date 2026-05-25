package com.example.steam.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublishGameRequest {

    @NotBlank(message = "El nombre del juego no puede estar vacío.")
    @Size(max = 150, message = "El nombre del juego no puede exceder los 150 caracteres.")
    private String name;

    @NotBlank(message = "La descripción no puede estar vacía.")
    private String description;

    @NotBlank(message = "El género no puede estar vacío.")
    private String genre;

    @NotNull(message = "El precio es obligatorio.")
    @Positive(message = "El precio debe ser un valor positivo.")
    private BigDecimal price;

    @URL(message = "La URL de la imagen no es válida.")
    private String imageUrl;

    private LocalDate releaseDate;

    @NotNull(message = "El ID del desarrollador es obligatorio.")
    private Integer developerId;
}