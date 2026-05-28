package com.example.steam.service;

import com.example.steam.model.dto.RequestReviewDTO;

public interface ReviewServiceInterface {

    public void createReview(String email, RequestReviewDTO dto);
}
