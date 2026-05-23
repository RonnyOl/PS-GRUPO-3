package com.example.steam.repository;

import com.example.steam.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovementRepository extends JpaRepository<Transaction, Integer> {
}
