package com.example.steam.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "biblioteca", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"usuario_id", "juego_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Biblioteca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_biblioteca")
    private Integer idBiblioteca;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "juego_id", nullable = false)
    private Juego juego;

    @Column(name = "horas_jugadas", precision = 10, scale = 1)
    private BigDecimal horasJugadas = BigDecimal.ZERO;

    private Boolean instalado = false;

    private Boolean favorito = false;

    @Column(name = "fecha_adquisicion", insertable = false, updatable = false)
    private LocalDateTime fechaAdquisicion;
}
