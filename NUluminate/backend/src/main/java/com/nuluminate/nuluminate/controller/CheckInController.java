package com.nuluminate.nuluminate.controller;
import com.nuluminate.nuluminate.dto.ApiResponseDTO;
import com.nuluminate.nuluminate.dto.CheckInRequestDTO;
import com.nuluminate.nuluminate.service.CheckInService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.Valid;
import java.util.List;
@RestController
@CrossOrigin(origins = "http://localhost:5175")
public class CheckInController {
    private final CheckInService checkInService;
    public CheckInController(CheckInService checkInService) {
        this.checkInService = checkInService;
    }
    @PostMapping("/api/v1/checkins")
    public ResponseEntity<ApiResponseDTO<Void>> submit(
            @Valid @RequestBody CheckInRequestDTO dto,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        return ResponseEntity.ok(checkInService.submit(dto, userId));
    }
    @GetMapping("/api/v1/checkins/my-history")
    public ResponseEntity<ApiResponseDTO<List<?>>> getHistory(
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        return ResponseEntity.ok(checkInService.getMyHistory(userId));
    }
    @GetMapping("/api/v1/faculty/dashboard")
    public ResponseEntity<ApiResponseDTO<List<?>>> getDashboard() {
        return ResponseEntity.ok(checkInService.getAllCheckins());
    }
}

