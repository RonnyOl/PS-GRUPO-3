package com.example.steam.service.impl;

import com.example.steam.model.Category;
import com.example.steam.model.Game;
import com.example.steam.model.Library;
import com.example.steam.model.User;
import com.example.steam.model.dto.ResponseGameDto;
import com.example.steam.model.dto.ResponseUserInformationDto;
import com.example.steam.repository.LibraryRepository;
import com.example.steam.repository.UserRepository;
import com.example.steam.service.UserServiceInterface;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserServiceInterface {

    private final UserRepository userRepository;
    private final LibraryServiceImpl libraryService;

    public UserServiceImpl(UserRepository userRepository, LibraryServiceImpl libraryService) {
        this.userRepository = userRepository;
        this.libraryService = libraryService;
    }

    @Override
    public User getUserByName(String name) {
        Optional<User> user = userRepository.findByName(name);

        return user.orElse(null);
    }
    public User loadUserByEmail(String email){
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public ResponseUserInformationDto getUserInformation(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Game> userGames = libraryService.findOwnedGamesByUser(email);

        List<ResponseGameDto> responseGameDtos = userGames.stream()
                .map(game -> new ResponseGameDto(
                        game.getIdGame().toString(),
                        game.getName(),
                        game.getDescription(),
                        game.getPrice().doubleValue(),
                        game.getDeveloper().getStudioName(),
                        game.getImageUrl(),
                        game.getCategories()
                                .stream()
                                .map(Category::getName)
                                .toList(),
                        game.getReleaseDate()
                ))
                .toList();

        return new ResponseUserInformationDto(
                user.getName(),
                user.getBalance(),
                responseGameDtos
        );


    }
}
