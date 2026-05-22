package com.example.steam.repository;

import com.example.steam.model.Juego;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends JpaRepository<Juego, Integer> {
    List<Juego> findAllByIdJuegoIn(List<Integer> ids);

    @Query("SELECT j.nombre FROM Juego j WHERE j.idJuego IN :ids")
    List<String> findNombresByIdsIn(@Param("ids") List<Integer> ids);
}
