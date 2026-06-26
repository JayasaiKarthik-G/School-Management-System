package com.spring_boot.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class MarkUpdateRequest {

    @NotNull(message = "Score is required.")
    @Min(value = 0, message = "Score must be at least 0.")
    @Max(value = 100, message = "Score must not exceed 100.")
    private Integer score;

    // No-args constructor
    public MarkUpdateRequest() {
    }

    // Getter
    public Integer getScore() {
        return score;
    }

    // Setter
    public void setScore(Integer score) {
        this.score = score;
    }
}