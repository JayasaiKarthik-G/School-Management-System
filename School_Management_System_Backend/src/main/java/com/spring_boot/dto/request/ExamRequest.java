package com.spring_boot.dto.request;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ExamRequest {

    @NotBlank(message = "Exam name is required and must not be blank.")
    @Size(max = 50, message = "Exam name must not exceed 50 characters")
    @Pattern(regexp = "^[A-Za-z0-9 ]+$", message = "Exam name must contain only letters, numbers, and spaces")
    private String examName;

    @NotNull(message = "Exam date is required.")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate examDate;

    // No-args constructor
    public ExamRequest() {
    }

    // Getters and Setters

    public String getExamName() {
        return examName;
    }

    public void setExamName(String examName) {
        this.examName = examName;
    }

    public LocalDate getExamDate() {
        return examDate;
    }

    public void setExamDate(LocalDate examDate) {
        this.examDate = examDate;
    }
}