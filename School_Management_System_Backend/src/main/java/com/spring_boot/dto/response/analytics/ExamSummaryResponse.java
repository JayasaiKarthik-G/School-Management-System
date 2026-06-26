package com.spring_boot.dto.response.analytics;

import java.time.LocalDate;

/**
 * Response DTO for GET /api/reports/exams/summary
 * Per-exam total score sum and student count, filtered by a minimum threshold.
 */
public class ExamSummaryResponse {

    private Integer examId;
    private String examName;
    private LocalDate examDate;
    private Long totalScoreSum;
    private Long studentsAppeared;

    // No-args constructor
    public ExamSummaryResponse() {
    }

    // All-args constructor
    public ExamSummaryResponse(Integer examId, String examName, LocalDate examDate,
                               Long totalScoreSum, Long studentsAppeared) {
        this.examId = examId;
        this.examName = examName;
        this.examDate = examDate;
        this.totalScoreSum = totalScoreSum;
        this.studentsAppeared = studentsAppeared;
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

    public Long getTotalScoreSum() {
        return totalScoreSum;
    }

    public void setTotalScoreSum(Long totalScoreSum) {
        this.totalScoreSum = totalScoreSum;
    }

    public Long getStudentsAppeared() {
        return studentsAppeared;
    }

    public void setStudentsAppeared(Long studentsAppeared) {
        this.studentsAppeared = studentsAppeared;
    }
}