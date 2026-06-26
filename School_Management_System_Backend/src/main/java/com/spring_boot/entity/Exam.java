package com.spring_boot.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "exams")
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exam_id")
    private Integer examId;

    @Column(name = "exam_name", nullable = false, length = 50, unique = true)
    private String examName;

    @Column(name = "exam_date", nullable = false)
    private LocalDate examDate;

    // ================= Constructors =================

    public Exam() {
    }

    public Exam(Integer examId, String examName, LocalDate examDate) {
        this.examId = examId;
        this.examName = examName;
        this.examDate = examDate;
    }

    // ================= Getters & Setters =================

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

    // ================= toString =================

    @Override
    public String toString() {
        return "Exam{" +
                "examId=" + examId +
                ", examName='" + examName + '\'' +
                ", examDate=" + examDate +
                '}';
    }
}
