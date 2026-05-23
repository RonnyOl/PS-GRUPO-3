package com.example.steam.repository;

import com.example.steam.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Integer> {
    List<Game> findAllByIdGameIn(List<Integer> ids);

    @Query("SELECT g.name FROM Game g WHERE g.idGame IN :ids")
    List<String> findNamesByIdsIn(@Param("ids") List<Integer> ids);
}
