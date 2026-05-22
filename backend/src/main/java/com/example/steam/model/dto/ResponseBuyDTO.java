package com.example.steam.model.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ResponseBuyDTO(String idCompra, LocalDateTime buyDate, Double remainingBalance, Double price, List<String> games) {

}
