package com.example.steam.repository;

import com.example.steam.model.Desarrollador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface DeveloperRepository extends JpaRepository<Desarrollador, Integer> {
    @Modifying
    @Query("UPDATE Desarrollador d SET d.fondos = d.fondos + :monto WHERE d.idDesarrollador = :idDesarrollador")
    int updateFunds(
            @Param("idDesarrollador") Integer idDesarrollador,
            @Param("monto") BigDecimal monto
    );
}
