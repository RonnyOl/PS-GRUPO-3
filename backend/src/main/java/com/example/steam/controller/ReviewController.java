package com.example.steam.controller;

import com.example.steam.model.dto.RequestReviewDTO;
import com.example.steam.service.ReviewServiceInterface;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewServiceInterface reviewService;

    @PostMapping("/user/{email}")
    public ResponseEntity<String> postReview(
            @PathVariable String email,
            @Valid @RequestBody RequestReviewDTO requestReviewDto) {

        reviewService.createReview(email, requestReviewDto);
        return new ResponseEntity<>("¡Review publicada con éxito!", HttpStatus.CREATED);
    }
}