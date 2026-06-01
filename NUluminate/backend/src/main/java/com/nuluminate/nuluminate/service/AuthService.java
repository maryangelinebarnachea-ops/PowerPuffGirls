package com.nuluminate.nuluminate.service;
import com.nuluminate.nuluminate.dto.ApiResponseDTO;
import com.nuluminate.nuluminate.dto.LoginRequestDTO;
public interface AuthService {
    ApiResponseDTO<Object> register(LoginRequestDTO dto);
    ApiResponseDTO<Object> login(LoginRequestDTO dto);
}
