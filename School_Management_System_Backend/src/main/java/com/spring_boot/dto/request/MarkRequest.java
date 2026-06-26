package com.spring_boot.dto.request;

//import org.hibernate.validator.constraints.Range;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class MarkRequest {

    @NotNull(message = "Student ID is required.")
    private Integer studentId;

    @NotNull(message = "Subject ID is required.")
    private Integer subjectId;

    @NotNull(message = "Exam ID is required.")
    private Integer examId;

    @NotNull(message = "Score is required.")
//  @Range(min = 0, max = 100, message = "Score must be between 0 and 100")
    @Min(value = 0, message = "Score must be at least 0.")
    @Max(value = 100, message = "Score must not exceed 100.")
    private Integer score;

    // No-args constructor
    public MarkRequest() {
    }

    // Getters and Setters

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public Integer getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Integer subjectId) {
        this.subjectId = subjectId;
    }

    public Integer getExamId() {
        return examId;
    }

    public void setExamId(Integer examId) {
        this.examId = examId;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }
}