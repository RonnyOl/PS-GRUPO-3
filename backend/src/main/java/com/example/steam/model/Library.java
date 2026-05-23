package com.example.steam.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "library", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "game_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Library {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_library")
    private Integer idLibrary;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @Column(name = "hours_played", precision = 10, scale = 1)
    private BigDecimal hoursPlayed = BigDecimal.ZERO;

    private Boolean installed = false;

    private Boolean favorite = false;

    @Column(name = "acquisition_date", insertable = false, updatable = false)
    private LocalDateTime acquisitionDate;
}
