package com.example.steam.repository;

import com.example.steam.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByName(String username);
    Optional<User> findByEmail(String email);
    @Modifying
    @Query("UPDATE User u SET u.balance = u.balance + :amount WHERE u.idUser = :idUser")
    int updateBalance(@Param("idUser") Integer idUser, @Param("amount") BigDecimal monto);

}
