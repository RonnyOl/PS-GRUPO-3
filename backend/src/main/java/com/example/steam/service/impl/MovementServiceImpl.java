package com.example.steam.service.impl;

import com.example.steam.model.Transaction;
import com.example.steam.repository.MovementRepository;
import com.example.steam.service.MovementServiceInterface;
import org.springframework.stereotype.Service;

@Service
public class MovementServiceImpl implements MovementServiceInterface {

    private final MovementRepository movementRepository;

    public MovementServiceImpl(MovementRepository movementRepository) {
        this.movementRepository = movementRepository;
    }

    @Override
    public Transaction createTransaction(Transaction movement) {

        return movementRepository.save(movement);

    }
}
