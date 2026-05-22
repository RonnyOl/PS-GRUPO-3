package com.example.steam.repository;

import com.example.steam.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByNombre(String username);
    Optional<Usuario> findByEmail(String email);
    @Modifying
    @Query("UPDATE Usuario u SET u.saldo = u.saldo + :monto WHERE u.idUsuario = :idUsuario")
    int updateSaldo(@Param("idUsuario") Integer idUsuario, @Param("monto") BigDecimal monto);

}
