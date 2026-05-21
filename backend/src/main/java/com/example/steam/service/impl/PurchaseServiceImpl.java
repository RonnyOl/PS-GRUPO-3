package com.example.steam.service.impl;

import com.example.steam.model.Compra;
import com.example.steam.model.CompraDetalle;
import com.example.steam.model.Juego;
import com.example.steam.model.Usuario;
import com.example.steam.model.dto.RequestBuyDTO;
import com.example.steam.model.dto.ResponseBuyDTO;
import com.example.steam.repository.PurchaseDetailRepository;
import com.example.steam.repository.PurchaseRepository;
import com.example.steam.service.PurchaseServiceInterface;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PurchaseServiceImpl implements PurchaseServiceInterface {

    private final PurchaseRepository purchaseRepository;
    private final PurchaseDetailRepository purchaseDetailRepository;
    private final UserServiceImpl userService;
    private final GameServiceImpl gameService;

    public PurchaseServiceImpl(PurchaseRepository purchaseRepository, PurchaseDetailRepository purchaseDetailRepository, PurchaseDetailRepository purchaseDetailRepository1, UserServiceImpl userService, GameServiceImpl gameService) {
        this.purchaseRepository = purchaseRepository;
        this.purchaseDetailRepository = purchaseDetailRepository1;
        this.userService = userService;
        this.gameService = gameService;
    }

    @Override
    @Transactional
    public ResponseBuyDTO purchaseGame(RequestBuyDTO requestBuyDTO) {

        Usuario user = userService.getUsuarioByUsername(requestBuyDTO.user());

        var uniqueGameIds = requestBuyDTO.gamesIds().stream().distinct().toList();

        List<Juego> targetGames = gameService.getGames(uniqueGameIds);

        try{
            gameService.validateGamesExists(requestBuyDTO.gamesIds());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        if(!validateAmountBalance(user.getSaldo(), requestBuyDTO.totalPrice())){
            throw new RuntimeException("Saldo insuficiente para realizar la compra.");
        }

        Compra savedPurchase = purchaseRepository.save(createPurchase(user, BigDecimal.valueOf(requestBuyDTO.totalPrice())));))));

        List<CompraDetalle> purchaseDetail = purchaseDetailRepository.

        return null;
    }

    private boolean validateAmountBalance(BigDecimal balance, Double totalPrice){
        return balance.compareTo(BigDecimal.valueOf(totalPrice)) >= 0;
    }

    private Compra createPurchase(Usuario buyer, BigDecimal totalAmount){
        Compra purchase = new Compra();
        purchase.setTotal(totalAmount);
        purchase.setUsuario(buyer);
        purchase.setFechaCompra(LocalDateTime.now());
        purchase.setMetodoPago("Saldo en cuenta");

        return purchase;
    }

}