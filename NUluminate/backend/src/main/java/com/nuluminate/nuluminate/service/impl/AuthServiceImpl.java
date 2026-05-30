package com.nuluminate.nuluminate.service.impl;

import com.nuluminate.nuluminate.dto.ApiResponseDTO;
import com.nuluminate.nuluminate.dto.LoginRequestDTO;
import com.nuluminate.nuluminate.entity.User;
import com.nuluminate.nuluminate.repository.UserRepository;
import com.nuluminate.nuluminate.service.AuthService;
import com.nuluminate.nuluminate.validator.EmailValidator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final EmailValidator emailValidator;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserRepository userRepository,
                           EmailValidator emailValidator,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.emailValidator = emailValidator;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public ApiResponseDTO<String> register(LoginRequestDTO dto) {
        if (!emailValidator.isValid(dto.getEmail())) {
            return ApiResponseDTO.error("Only @nu-laguna.edu.ph emails are allowed");
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            return ApiResponseDTO.error("Email already registered");
        }
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(User.Role.STUDENT);
        userRepository.save(user);
        return ApiResponseDTO.success("Registration successful", null);
    }

    @Override
    public ApiResponseDTO<String> login(LoginRequestDTO dto) {
        User user = userRepository.findByEmail(dto.getEmail()).orElse(null);
        if (user == null || !passwordEncoder.matches(
                dto.getPassword(), user.getPassword())) {
            return ApiResponseDTO.error("Invalid credentials");
        }
        return ApiResponseDTO.success("Login successful", "token-placeholder");
    }
}