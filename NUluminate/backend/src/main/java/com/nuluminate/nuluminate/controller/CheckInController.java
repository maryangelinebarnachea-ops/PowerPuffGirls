package com.nuluminate.nuluminate.controller;

import com.nuluminate.nuluminate.dto.ApiResponseDTO;
import com.nuluminate.nuluminate.dto.CheckInRequestDTO;
import com.nuluminate.nuluminate.service.CheckInService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/checkins")
@CrossOrigin(origins = "http://localhost:5173")
public class CheckInController {

    private final CheckInService checkInService;

    public CheckInController(CheckInService checkInService) {
        this.checkInService = checkInService;
    }

    @PostMapping
    public ResponseEntity<ApiResponseDTO<Void>> submit(
            @RequestBody CheckInRequestDTO dto) {
        return ResponseEntity.ok(checkInService.submit(dto, 1L));
    }

    @GetMapping("/my-history")
    public ResponseEntity<ApiResponseDTO<List<?>>> getHistory() {
        return ResponseEntity.ok(checkInService.getMyHistory(1L));
    }
}