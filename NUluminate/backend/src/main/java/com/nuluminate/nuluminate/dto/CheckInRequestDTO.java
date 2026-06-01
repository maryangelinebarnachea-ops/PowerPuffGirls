package com.nuluminate.nuluminate.dto;
import jakarta.validation.constraints.*;
public class CheckInRequestDTO {
    @NotBlank(message = "Mood is required")
    @Pattern(regexp = "HAPPY|OKAY|STRESSED|EXHAUSTED", message = "Invalid mood value")
    private String mood;
    @NotNull(message = "Stress level is required")
    @Min(value = 1, message = "Stress level must be at least 1")
    @Max(value = 5, message = "Stress level must be at most 5")
    private Integer stressLevel;
    @NotNull(message = "Anonymous flag is required")
    private Boolean isAnonymous;
    public String getMood() { return mood; }
    public void setMood(String mood) { this.mood = mood; }
    public Integer getStressLevel() { return stressLevel; }
    public void setStressLevel(Integer stressLevel) { this.stressLevel = stressLevel; }
    public Boolean getIsAnonymous() { return isAnonymous; }
    public void setIsAnonymous(Boolean isAnonymous) { this.isAnonymous = isAnonymous; }
}
