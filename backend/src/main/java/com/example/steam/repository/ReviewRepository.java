package com.example.steam.repository;

import com.example.steam.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {

    @Query("SELECT r FROM Review r JOIN FETCH r.user WHERE r.game.idGame = :idGame")
    List<Review> findReviewsByGameId(@Param("idGame") Integer idGame);

    boolean existsByUser_EmailAndGame_IdGame(String email, Integer idGame);
}
