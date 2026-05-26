package com.example.steam.repository;

import com.example.steam.model.Game;
import com.example.steam.model.Library;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LibraryRepository extends JpaRepository<Library, Integer> {

    @Query("SELECT l.game.idGame FROM Library l WHERE l.user.idUser = :idUser AND l.game.idGame IN :idGames")
    List<Integer> findOwnedGameIdsByUserIdAndGameIds(
            @Param("idUser") Integer idUser,
            @Param("idGames") List<Integer> idGames
    );

    @Query("SELECT l.game FROM Library l WHERE l.user.email = :email")
    List<Game> findAllGamesByUserEmail(@Param("email") String email);
}
