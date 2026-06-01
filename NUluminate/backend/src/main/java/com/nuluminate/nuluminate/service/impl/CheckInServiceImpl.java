package com.nuluminate.nuluminate.service.impl;
import com.nuluminate.nuluminate.dto.ApiResponseDTO;
import com.nuluminate.nuluminate.dto.CheckInRequestDTO;
import com.nuluminate.nuluminate.entity.User;
import com.nuluminate.nuluminate.entity.WellnessCheckIn;
import com.nuluminate.nuluminate.repository.UserRepository;
import com.nuluminate.nuluminate.repository.WellnessCheckInRepository;
import com.nuluminate.nuluminate.service.CheckInService;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;
@Service
public class CheckInServiceImpl implements CheckInService {
    private final WellnessCheckInRepository checkInRepository;
    private final UserRepository userRepository;
    public CheckInServiceImpl(WellnessCheckInRepository checkInRepository,
                               UserRepository userRepository) {
        this.checkInRepository = checkInRepository;
        this.userRepository = userRepository;
    }
    @Override
    public ApiResponseDTO<Void> submit(CheckInRequestDTO dto, Long userId) {
        WellnessCheckIn entry = new WellnessCheckIn();
        entry.setMood(WellnessCheckIn.Mood.valueOf(dto.getMood()));
        entry.setStressLevel(dto.getStressLevel());
        entry.setIsAnonymous(dto.getIsAnonymous());
        entry.setSubmittedAt(Instant.now());
        if (dto.getIsAnonymous()) {
            entry.setUser(null);
        } else {
            User user = userRepository.findById(userId).orElse(null);
            entry.setUser(user);
        }
        checkInRepository.save(entry);
        return ApiResponseDTO.success("Check-in submitted", null);
    }
    @Override
    public ApiResponseDTO<List<?>> getMyHistory(Long userId) {
        List<WellnessCheckIn> history =
            checkInRepository.findByUserIdAndIsAnonymousFalse(userId);
        return ApiResponseDTO.success("History retrieved", history);
    }
    @Override
    public ApiResponseDTO<List<?>> getAllCheckins() {
        List<WellnessCheckIn> all = checkInRepository.findByIsAnonymousFalse();
        return ApiResponseDTO.success("All check-ins retrieved", all);
    }
}
