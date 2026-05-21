package com.example.steam.repository;

import com.example.steam.model.Biblioteca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LibraryRepository extends JpaRepository<Biblioteca, Integer> {
}
