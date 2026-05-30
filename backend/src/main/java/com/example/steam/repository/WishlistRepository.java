package com.example.steam.repository;

import com.example.steam.model.Game;
import com.example.steam.model.Purchase;
import com.example.steam.model.User;
import com.example.steam.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {

    boolean existsByUserAndGame(User user, Game game);

    void deleteByUserAndGame(User user, Game game);

    List<Wishlist> findByUser(User user);
}
