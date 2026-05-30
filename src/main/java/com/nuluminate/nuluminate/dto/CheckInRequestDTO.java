package com.nuluminate.nuluminate.dto;

public class CheckInRequestDTO {
    private String mood;
    private Integer stressLevel;
    private Boolean isAnonymous;

    public String getMood() { return mood; }
    public void setMood(String mood) { this.mood = mood; }

    public Integer getStressLevel() { return stressLevel; }
    public void setStressLevel(Integer stressLevel) { this.stressLevel = stressLevel; }

    public Boolean getIsAnonymous() { return isAnonymous; }
    public void setIsAnonymous(Boolean isAnonymous) { this.isAnonymous = isAnonymous; }
}