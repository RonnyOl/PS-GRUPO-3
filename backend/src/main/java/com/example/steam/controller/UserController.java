package com.example.steam.controller;

import com.example.steam.model.dto.ResponseUserInformationDto;
import com.example.steam.service.UserServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/users")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class UserController {

    private final UserServiceInterface userServiceInterface;

    @GetMapping("/information")
    ResponseEntity<ResponseUserInformationDto> getUserInformation(@RequestParam String email){
        return ResponseEntity.ok(userServiceInterface.getUserInformation(email));
    }

}
