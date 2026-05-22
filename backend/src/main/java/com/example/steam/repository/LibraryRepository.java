package com.example.steam.repository;

import com.example.steam.model.Biblioteca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LibraryRepository extends JpaRepository<Biblioteca, Integer> {

    @Query("SELECT b.juego.idJuego FROM Biblioteca b WHERE b.usuario.idUsuario = :idUsuario AND b.juego.idJuego IN :idJuegos")
    List<Integer> findOwnedGameIdsByUserIdAndGameIds(
            @Param("idUsuario") Integer idUsuario,
            @Param("idJuegos") List<Integer> idJuegos
    );
}
