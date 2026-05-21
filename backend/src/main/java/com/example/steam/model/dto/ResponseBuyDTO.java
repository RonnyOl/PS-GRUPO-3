package com.example.steam.model.dto;

import java.time.LocalDateTime;

public record ResponseBuyDTO(LocalDateTime buyDate, Double remainingBalance, Double price, String paymentMethod, String game) {

}
