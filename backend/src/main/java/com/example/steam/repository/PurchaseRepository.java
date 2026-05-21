package com.example.steam.repository;

import com.example.steam.model.Compra;
import com.example.steam.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface PurchaseRepository extends JpaRepository<Compra, Integer> {
    Compra findByUsuarioAndFechaCompra(Usuario user, LocalDate fecha);
}
