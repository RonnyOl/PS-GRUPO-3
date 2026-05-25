package com.example.steam.service;


import com.example.steam.model.dto.RequestCreateCategoryDto;
import com.example.steam.model.dto.ResponseCategoryDTO;

import java.util.List;

public interface CategoryServiceInterface {
    List<ResponseCategoryDTO> getAllToApi();
    ResponseCategoryDTO createCategory(RequestCreateCategoryDto request);
}