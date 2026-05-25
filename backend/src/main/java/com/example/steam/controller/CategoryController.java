package com.example.steam.controller;

import com.example.steam.model.dto.RequestCreateCategoryDto;
import com.example.steam.model.dto.ResponseCategoryDTO;
import com.example.steam.service.CategoryServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryServiceInterface categoryService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(categoryService.getAllToApi());
    }

    @PostMapping
    public ResponseEntity<ResponseCategoryDTO> create(
            @RequestBody RequestCreateCategoryDto request
    ) {
        return new ResponseEntity<>(categoryService.createCategory(request), HttpStatus.CREATED);
    }
}