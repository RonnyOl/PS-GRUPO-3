package com.example.steam.model.dto;

import java.math.BigDecimal;
import java.util.List;

public record ResponseUserInformationDto (String userName, BigDecimal amountBalance, List<ResponseGameDto> games){
}
