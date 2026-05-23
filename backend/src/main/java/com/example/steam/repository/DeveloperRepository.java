package com.example.steam.repository;

import com.example.steam.model.Developer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface DeveloperRepository extends JpaRepository<Developer, Integer> {
    @Modifying
    @Query("UPDATE Developer d SET d.funds = d.funds + :amount WHERE d.idDeveloper = :idDeveloper")
    int updateFunds(
            @Param("idDeveloper") Integer idDeveloper,
            @Param("amount") BigDecimal amount
    );
}
