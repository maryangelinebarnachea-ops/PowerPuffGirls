package com.nuluminate.nuluminate.service;
import com.nuluminate.nuluminate.dto.ApiResponseDTO;
import com.nuluminate.nuluminate.dto.CheckInRequestDTO;
import java.util.List;
public interface CheckInService {
    ApiResponseDTO<Void> submit(CheckInRequestDTO dto, Long userId);
    ApiResponseDTO<List<?>> getMyHistory(Long userId);
    ApiResponseDTO<List<?>> getAllCheckins();
}
