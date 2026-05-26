package com.example.steam.model.dto;


import java.util.List;

public record RequestBuyDTO(String userName, List<Integer> gamesIds, String paymentMethod, double totalPrice) {

}
