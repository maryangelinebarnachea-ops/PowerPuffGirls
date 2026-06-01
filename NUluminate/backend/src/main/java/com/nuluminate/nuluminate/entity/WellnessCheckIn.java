package com.nuluminate.nuluminate.entity;
import jakarta.persistence.*;
import java.time.Instant;
@Entity
@Table(name = "wellness_check_in")
public class WellnessCheckIn extends BaseEntity {
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Mood mood;
    @Column(nullable = false)
    private Integer stressLevel;
    @Column(nullable = false)
    private Boolean isAnonymous;
    @Column(nullable = false)
    private Instant submittedAt;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;
    public enum Mood { HAPPY, OKAY, STRESSED, EXHAUSTED }
    public Mood getMood() { return mood; }
    public void setMood(Mood mood) { this.mood = mood; }
    public Integer getStressLevel() { return stressLevel; }
    public void setStressLevel(Integer stressLevel) { this.stressLevel = stressLevel; }
    public Boolean getIsAnonymous() { return isAnonymous; }
    public void setIsAnonymous(Boolean isAnonymous) { this.isAnonymous = isAnonymous; }
    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
