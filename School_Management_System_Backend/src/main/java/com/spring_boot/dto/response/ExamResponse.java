package com.spring_boot.dto.response;

import java.time.LocalDate;

public class ExamResponse {

    private Integer examId;
    private String examName;
    private LocalDate examDate;

    // No-args constructor
    public ExamResponse() {
    }

    // All-args constructor
    public ExamResponse(Integer examId, String examName, LocalDate examDate) {
        this.examId = examId;
        this.examName = examName;
        this.examDate = examDate;
    }

    // Getters and Setters

    public Integer getExamId() {
        return examId;
    }

    public void setExamId(Integer examId) {
        this.examId = examId;
    }

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