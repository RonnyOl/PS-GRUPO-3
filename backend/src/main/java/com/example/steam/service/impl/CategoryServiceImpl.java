package com.example.steam.service.impl;



import com.example.steam.model.Category;
import com.example.steam.model.dto.RequestCreateCategoryDto;
import com.example.steam.model.dto.ResponseCategoryDTO;
import com.example.steam.repository.CategoryRepository;
import com.example.steam.service.CategoryServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryServiceInterface {
    private final CategoryRepository categoryRepository;


    @Transactional(readOnly = true)
    public List<ResponseCategoryDTO> getAllToApi() {
        List<Category> categories = categoryRepository.findAll();

        return categories.stream().map(category -> new ResponseCategoryDTO(
                category.getIdCategory(),
                category.getName()
        )).toList();
    }

    @Override
    public ResponseCategoryDTO createCategory(RequestCreateCategoryDto request) {
        Category category = new Category();
        category.setName(request.name());

        Category savedCategory = categoryRepository.save(category);

        return new ResponseCategoryDTO(
                savedCategory.getIdCategory(),
                savedCategory.getName()
        );
    }


}
