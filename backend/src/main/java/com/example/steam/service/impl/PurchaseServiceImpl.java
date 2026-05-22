package com.example.steam.service.impl;

import com.example.steam.model.*;
import com.example.steam.model.dto.RequestBuyDTO;
import com.example.steam.model.dto.ResponseBuyDTO;
import com.example.steam.repository.*;
import com.example.steam.service.PurchaseServiceInterface;
import jakarta.transaction.Transactional;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PurchaseServiceImpl implements PurchaseServiceInterface {

    private final PurchaseRepository purchaseRepository;
    private final PurchaseDetailRepository purchaseDetailRepository;
    private final UserRepository userRepository;
    private final DeveloperRepository developerRepository;
    private final UserServiceImpl userService;
    private final GameServiceImpl gameService;
    private final MovementServiceImpl movementService;
    private final LibraryServiceImpl libraryService;
    private final LibraryRepository libraryRepository;

    public PurchaseServiceImpl
            (PurchaseRepository purchaseRepository,
             PurchaseDetailRepository purchaseDetailRepository,
             UserServiceImpl userService,
             GameServiceImpl gameService,
             UserRepository userRepository,
             DeveloperRepository developerRepository,
             MovementServiceImpl movementService,
             LibraryServiceImpl libraryService, LibraryRepository libraryRepository) {
        this.purchaseRepository = purchaseRepository;
        this.purchaseDetailRepository = purchaseDetailRepository;
        this.userService = userService;
        this.gameService = gameService;
        this.userRepository = userRepository;
        this.developerRepository = developerRepository;
        this.movementService = movementService;
        this.libraryService = libraryService;
        this.libraryRepository = libraryRepository;
    }

    @Override
    @Transactional
    public ResponseBuyDTO purchaseGame(RequestBuyDTO requestBuyDTO) {

        Usuario user = userService.getUsuarioByUsername(requestBuyDTO.user());

        var uniqueGameIds = requestBuyDTO.gamesIds().stream().distinct().toList();

        List<Juego> targetGames = gameService.getGames(uniqueGameIds);

        processPurchase(requestBuyDTO, user);

        try{
            gameService.validateGamesExists(requestBuyDTO.gamesIds());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        if(!validateAmountBalance(user.getSaldo(), requestBuyDTO.totalPrice())){
            throw new RuntimeException("Saldo insuficiente para realizar la compra.");
        }

        Compra savedPurchase = createPurchase(user, BigDecimal.valueOf(requestBuyDTO.totalPrice()));
        purchaseRepository.save(savedPurchase);
        
        List<CompraDetalle> purchaseDetail = createPurchaseDetail(targetGames, savedPurchase);
        purchaseDetailRepository.saveAll(purchaseDetail);

        List<Biblioteca> gamesToAdd = getGamesToAdd(targetGames, user);
        libraryRepository.saveAll(gamesToAdd);


        Movimiento movement = createPurchaseMovement(requestBuyDTO, user, savedPurchase);
        movementService.createTransaction(movement);

        int updatedUsers = userRepository.updateSaldo(user.getIdUsuario(), BigDecimal.valueOf(requestBuyDTO.totalPrice()).negate());

        if(updatedUsers==0){
            throw new RuntimeException("Error al actualizar el saldo del usuario. La compra no se ha realizado.");
        }

        Map <Desarrollador, BigDecimal> earningsByDev = getEarningsByDev(targetGames);

        sendEarningsToDev(earningsByDev);

        BigDecimal remainingBalance = user.getSaldo().subtract(BigDecimal.valueOf(requestBuyDTO.totalPrice()));

        return new ResponseBuyDTO(savedPurchase.getIdCompra().toString(),
                                    savedPurchase.getFechaCompra(),
                                    remainingBalance.doubleValue(),
                                    requestBuyDTO.totalPrice(),
                                    gamesToAdd.stream().map(entry -> entry.getJuego().getNombre()).toList());
    }

    private void sendEarningsToDev(Map<Desarrollador, BigDecimal> earningsByDev) {
        earningsByDev.forEach((developer, payout) -> {
            int updatedDevs = developerRepository.updateFunds(developer.getIdDesarrollador(), payout);
            if (updatedDevs == 0) {
                throw new RuntimeException("Error al actualizar los fondos del desarrollador " + developer.getNombreEstudio() + ". La compra no se ha realizado.");
            }
        });
    }

    @NonNull
    private static Map<Desarrollador, BigDecimal> getEarningsByDev(List<Juego> targetGames) {
        return targetGames.stream()
                .collect(Collectors.groupingBy(Juego::getDesarrollador,
                        Collectors.mapping(Juego::getPrecio, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))));
    }

    private Movimiento createPurchaseMovement(RequestBuyDTO requestBuyDTO, Usuario user, Compra savedPurchase) {
        Movimiento movement = new Movimiento();
        movement.setUsuario(user);
        BigDecimal negate = BigDecimal.valueOf(requestBuyDTO.totalPrice()).negate();
        movement.setMonto(negate);
        movement.setDescripcion("Compra de juegos. Orden ID: " + savedPurchase.getIdCompra());
        movement.setFechaMovimiento(LocalDateTime.now());
        movement.setTipo(TipoMovimiento.EGRESO);
        return movement;
    }

    private boolean validateAmountBalance(BigDecimal balance, Double totalPrice){
        return balance.compareTo(BigDecimal.valueOf(totalPrice)) >= 0;
    }

    @NonNull
    private Compra createPurchase(Usuario buyer, BigDecimal totalAmount){
        Compra purchase = new Compra();
        purchase.setTotal(totalAmount);
        purchase.setUsuario(buyer);
        purchase.setFechaCompra(LocalDateTime.now());
        purchase.setMetodoPago("Saldo en cuenta");

        return purchase;
    }

    @NonNull
    private List<CompraDetalle> createPurchaseDetail(List<Juego> targetGames, Compra savedPurchase){
        return targetGames.stream().map(game -> {
            CompraDetalle detail = new CompraDetalle();
            detail.setCompra(savedPurchase);
            detail.setJuego(game);
            detail.setPrecio(game.getPrecio());
            return detail;
        }).toList();
    }
    
    @NonNull
    private static List<Biblioteca> getGamesToAdd(List<Juego> targetGames, Usuario user) {
        return targetGames.stream().map(game -> {
            Biblioteca libraryEntry = new Biblioteca();
            libraryEntry.setUsuario(user);
            libraryEntry.setJuego(game);
            libraryEntry.setFechaAdquisicion(LocalDateTime.now());
            return libraryEntry;
        }).toList();
    }
    @Transactional
    public void processPurchase(RequestBuyDTO request, Usuario user) {
        var cartGameIds = request.gamesIds().stream().distinct().toList();

        List<Integer> alreadyOwnedIds = libraryService.findOwnedGamesInSelection(user.getIdUsuario(), cartGameIds);

        if (!alreadyOwnedIds.isEmpty()) {
            var duplicateTitles = gameService.getTitlesByIds(alreadyOwnedIds);

            throw new RuntimeException(
                    "Compra rechazada. Ya posees los siguientes títulos en tu cuenta: " + duplicateTitles
            );
        }
    }
}