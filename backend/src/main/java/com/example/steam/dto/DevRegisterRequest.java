package com.example.steam.dto;

import lombok.Data;

@Data
public class DevRegisterRequest {
    private String name;
    private String email;
    private String password;
    private String taxCode;
    private String studioName;

}
