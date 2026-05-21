package com.example.steam.repository;

import com.example.steam.model.Juego;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends JpaRepository<Juego, Integer> {
    List<Juego> findAllByIdIn(List<Integer> ids);
}
