package com.example.steam.repository;

import com.example.steam.model.CompraDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseDetailRepository extends JpaRepository<CompraDetalle, Integer> {

}
