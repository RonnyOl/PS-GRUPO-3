package com.example.steam.controller;

import com.example.steam.model.dto.RequestBuyDTO;
import com.example.steam.model.dto.ResponseBuyDTO;
import com.example.steam.service.PurchaseServiceInterface;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/purchases")
public class PurchaseController {

    private final PurchaseServiceInterface purchaseService;

    public PurchaseController(PurchaseServiceInterface purchaseService){
        this.purchaseService = purchaseService;
    }

    @PostMapping("")
    public ResponseEntity<ResponseBuyDTO> buyGame(@RequestBody RequestBuyDTO requestBuyDTO) {
        ResponseBuyDTO response = purchaseService.purchaseGame(requestBuyDTO);
        return ResponseEntity.ok(response);
    }
}
