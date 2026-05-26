package com.example.steam.service;

import com.example.steam.model.User;
import com.example.steam.model.dto.ResponseUserInformationDto;

public interface UserServiceInterface {
    User getUserByName(String name);
    User loadUserByEmail(String email);
    ResponseUserInformationDto getUserInformation(String email);
}
