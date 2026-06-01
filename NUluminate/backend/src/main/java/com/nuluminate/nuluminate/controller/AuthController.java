package com.nuluminate.nuluminate.controller;
import com.nuluminate.nuluminate.dto.ApiResponseDTO;
import com.nuluminate.nuluminate.dto.LoginRequestDTO;
import com.nuluminate.nuluminate.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:5175")
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    @PostMapping("/register")
    public ResponseEntity<ApiResponseDTO<Object>> register(
            @RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(authService.register(dto));
    }
    @PostMapping("/login")
    public ResponseEntity<ApiResponseDTO<Object>> login(
            @RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }
}
