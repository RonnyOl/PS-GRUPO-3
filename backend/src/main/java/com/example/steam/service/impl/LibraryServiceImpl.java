package com.example.steam.service.impl;

import com.example.steam.model.Game;
import com.example.steam.repository.LibraryRepository;
import com.example.steam.service.LibraryServiceInterface;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LibraryServiceImpl implements LibraryServiceInterface {

    private final LibraryRepository libraryRepository;

    public LibraryServiceImpl(LibraryRepository libraryRepository) {
        this.libraryRepository = libraryRepository;
    }


    @Transactional(readOnly = true)
    public List<Integer> findOwnedGamesInSelection(Integer userId, List<Integer> gameIdsToCheck) {
        return libraryRepository.findOwnedGameIdsByUserIdAndGameIds(userId, gameIdsToCheck);
    }

    @Override
    public List<Game> findOwnedGamesByUser(String email) {
        return libraryRepository.findAllGamesByUserEmail(email);
    }
}
