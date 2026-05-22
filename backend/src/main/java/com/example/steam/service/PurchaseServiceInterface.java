package com.example.steam.service;

import com.example.steam.model.dto.RequestBuyDTO;
import com.example.steam.model.dto.ResponseBuyDTO;

public interface PurchaseServiceInterface {

    ResponseBuyDTO purchaseGame(RequestBuyDTO requestBuyDTO);
}
