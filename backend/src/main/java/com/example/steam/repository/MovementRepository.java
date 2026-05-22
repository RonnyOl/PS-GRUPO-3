package com.example.steam.repository;

import com.example.steam.model.Movimiento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovementRepository extends JpaRepository<Movimiento, Integer> {
}
