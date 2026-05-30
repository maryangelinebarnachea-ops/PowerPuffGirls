package com.nuluminate.nuluminate.repository;

import com.nuluminate.nuluminate.entity.WellnessCheckIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface WellnessCheckInRepository extends JpaRepository<WellnessCheckIn, Long> {

    List<WellnessCheckIn> findByUserIdAndIsAnonymousFalse(Long userId);

    @Query("SELECT w.mood, COUNT(w) FROM WellnessCheckIn w GROUP BY w.mood")
    List<Object[]> getMoodDistribution();

    @Query("SELECT AVG(w.stressLevel) FROM WellnessCheckIn w")
    Double getAverageStressLevel();
}