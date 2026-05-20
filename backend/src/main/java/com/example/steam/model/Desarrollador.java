package com.example.steam.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "desarrollador")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Desarrollador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_desarrollador")
    private Integer idDesarrollador;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @Column(name = "nombre_estudio", nullable = false, length = 150)
    private String nombreEstudio;

    @Column(name = "codigo_fiscal", length = 50)
    private String codigoFiscal;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(precision = 10, scale = 2)
    private BigDecimal fondos = BigDecimal.ZERO;

    @Column(name = "sitio_web", length = 255)
    private String sitioWeb;
}