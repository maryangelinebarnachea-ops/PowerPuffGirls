package com.nuluminate.nuluminate.repository;
import com.nuluminate.nuluminate.entity.WellnessCheckIn;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface WellnessCheckInRepository extends JpaRepository<WellnessCheckIn, Long> {
    List<WellnessCheckIn> findByUserIdAndIsAnonymousFalse(Long userId);
    List<WellnessCheckIn> findByIsAnonymousFalse();
}
