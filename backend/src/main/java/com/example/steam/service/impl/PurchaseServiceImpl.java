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

        User user = userService.getUserByName(requestBuyDTO.user());

        var uniqueGameIds = requestBuyDTO.gamesIds().stream().distinct().toList();

        List<Game> targetGames = gameService.getGames(uniqueGameIds);

        processPurchase(requestBuyDTO, user);

        try{
            gameService.validateGamesExists(requestBuyDTO.gamesIds());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        if(!validateAmountBalance(user.getBalance(), requestBuyDTO.totalPrice())){
            throw new RuntimeException("Saldo insuficiente para realizar la compra.");
        }

        Purchase savedPurchase = createPurchase(user, BigDecimal.valueOf(requestBuyDTO.totalPrice()));
        purchaseRepository.save(savedPurchase);
        
        List<PurchaseDetails> purchaseDetail = createPurchaseDetail(targetGames, savedPurchase);
        purchaseDetailRepository.saveAll(purchaseDetail);

        List<Library> gamesToAdd = getGamesToAdd(targetGames, user);
        libraryRepository.saveAll(gamesToAdd);


        Transaction movement = createPurchaseMovement(requestBuyDTO, user, savedPurchase);
        movementService.createTransaction(movement);

        int updatedUsers = userRepository.updateBalance(user.getIdUser(), BigDecimal.valueOf(requestBuyDTO.totalPrice()).negate());

        if(updatedUsers==0){
            throw new RuntimeException("Error al actualizar el saldo del usuario. La compra no se ha realizado.");
        }

        Map <Developer, BigDecimal> earningsByDev = getEarningsByDev(targetGames);

        sendEarningsToDev(earningsByDev);

        BigDecimal remainingBalance = user.getBalance().subtract(BigDecimal.valueOf(requestBuyDTO.totalPrice()));

        return new ResponseBuyDTO(savedPurchase.getIdPurchase().toString(),
                                    savedPurchase.getPurchaseDate(),
                                    remainingBalance.doubleValue(),
                                    requestBuyDTO.totalPrice(),
                                    gamesToAdd.stream().map(entry -> entry.getGame().getName()).toList());
    }

    private void sendEarningsToDev(Map<Developer, BigDecimal> earningsByDev) {
        earningsByDev.forEach((developer, payout) -> {
            int updatedDevs = developerRepository.updateFunds(developer.getIdDeveloper(), payout);
            if (updatedDevs == 0) {
                throw new RuntimeException("Error al actualizar los fondos del desarrollador " + developer.getStudioName() + ". La compra no se ha realizado.");
            }
        });
    }

    @NonNull
    private static Map<Developer, BigDecimal> getEarningsByDev(List<Game> targetGames) {
        return targetGames.stream()
                .collect(Collectors.groupingBy(Game::getDeveloper,
                        Collectors.mapping(Game::getPrice, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))));
    }

    private Transaction createPurchaseMovement(RequestBuyDTO requestBuyDTO, User user, Purchase savedPurchase) {
        Transaction movement = new Transaction();
        movement.setUser(user);
        BigDecimal negate = BigDecimal.valueOf(requestBuyDTO.totalPrice()).negate();
        movement.setAmount(negate);
        movement.setDescription("Compra de juegos. Orden ID: " + savedPurchase.getIdPurchase());
        movement.setTransactionDate(LocalDateTime.now());
        movement.setType(TransactionType.WITHDRAWAL);
        return movement;
    }

    private boolean validateAmountBalance(BigDecimal balance, Double totalPrice){
        return balance.compareTo(BigDecimal.valueOf(totalPrice)) >= 0;
    }

    @NonNull
    private Purchase createPurchase(User buyer, BigDecimal totalAmount){
        Purchase purchase = new Purchase();
        purchase.setTotal(totalAmount);
        purchase.setUser(buyer);
        purchase.setPurchaseDate(LocalDateTime.now());
        purchase.setPaymentMethod("Saldo en cuenta");

        return purchase;
    }

    @NonNull
    private List<PurchaseDetails> createPurchaseDetail(List<Game> targetGames, Purchase savedPurchase){
        return targetGames.stream().map(game -> {
            PurchaseDetails detail = new PurchaseDetails();
            detail.setPurchase(savedPurchase);
            detail.setGame(game);
            detail.setPrice(game.getPrice());
            return detail;
        }).toList();
    }
    
    @NonNull
    private static List<Library> getGamesToAdd(List<Game> targetGames, User user) {
        return targetGames.stream().map(game -> {
            Library libraryEntry = new Library();
            libraryEntry.setUser(user);
            libraryEntry.setGame(game);
            libraryEntry.setAcquisitionDate(LocalDateTime.now());
            return libraryEntry;
        }).toList();
    }
    @Transactional
    public void processPurchase(RequestBuyDTO request, User user) {
        var cartGameIds = request.gamesIds().stream().distinct().toList();

        List<Integer> alreadyOwnedIds = libraryService.findOwnedGamesInSelection(user.getIdUser(), cartGameIds);

        if (!alreadyOwnedIds.isEmpty()) {
            var duplicateTitles = gameService.getTitlesByIds(alreadyOwnedIds);

            throw new RuntimeException(
                    "Compra rechazada. Ya posees los siguientes títulos en tu cuenta: " + duplicateTitles
            );
        }
    }
}