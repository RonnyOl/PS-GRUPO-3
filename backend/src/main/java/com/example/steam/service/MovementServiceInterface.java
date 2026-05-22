package com.example.steam.service;

import com.example.steam.model.Movimiento;

public interface MovementServiceInterface {
    Movimiento createTransaction(Movimiento movement);
}
