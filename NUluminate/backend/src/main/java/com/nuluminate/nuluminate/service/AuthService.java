package com.nuluminate.nuluminate.service;

import com.nuluminate.nuluminate.dto.ApiResponseDTO;
import com.nuluminate.nuluminate.dto.LoginRequestDTO;

public interface AuthService {
    ApiResponseDTO<String> register(LoginRequestDTO dto);
    ApiResponseDTO<String> login(LoginRequestDTO dto);
}