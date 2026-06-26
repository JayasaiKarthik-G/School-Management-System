package com.spring_boot.dto.response.analytics;

import java.util.List;

public class StudentFullPerformanceResponse {

    private StudentDetail student;
    private Double overallAverage;
    private Integer totalExamsAppeared;
    private List<ExamPerformance> performance;

    // ================= Constructors =================

    public StudentFullPerformanceResponse() {
    }

    public StudentFullPerformanceResponse(StudentDetail student,
                                          Double overallAverage,
                                          Integer totalExamsAppeared,
                                          List<ExamPerformance> performance) {
        this.student = student;
        this.overallAverage = overallAverage;
        this.totalExamsAppeared = totalExamsAppeared;
        this.performance = performance;
    }

    // ================= Getters & Setters =================

    public StudentDetail getStudent() {
        return student;
    }

    public void setStudent(StudentDetail student) {
        this.student = student;
    }

    public Double getOverallAverage() {
        return overallAverage;
    }

    public void setOverallAverage(Double overallAverage) {
        this.overallAverage = overallAverage;
    }

    public Integer getTotalExamsAppeared() {
        return totalExamsAppeared;
    }

    public void setTotalExamsAppeared(Integer totalExamsAppeared) {
        this.totalExamsAppeared = totalExamsAppeared;
    }

    public List<ExamPerformance> getPerformance() {
        return performance;
    }

    public void setPerformance(List<ExamPerformance> performance) {
        this.performance = performance;
    }

    // =======================================================
    // Nested Classes
    // =======================================================

    // -------- Student Detail --------
    public static class StudentDetail {

        private Integer studentId;
        private String fullName;
        private Integer enrollmentYear;

        public StudentDetail() {
        }

        public StudentDetail(Integer studentId, String fullName, Integer enrollmentYear) {
            this.studentId = studentId;
            this.fullName = fullName;
            this.enrollmentYear = enrollmentYear;
        }

        public Integer getStudentId() {
            return studentId;
        }

        public void setStudentId(Integer studentId) {
            this.studentId = studentId;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public Integer getEnrollmentYear() {
            return enrollmentYear;
        }

        public void setEnrollmentYear(Integer enrollmentYear) {
            this.enrollmentYear = enrollmentYear;
        }
    }

    // -------- Exam Performance --------
    public static class ExamPerformance {

        private Integer examId;
        private String examName;
        private String examDate;
        private List<SubjectScore> subjectScores;
        private Integer totalScore;
        private Double averageScore;

        public ExamPerformance() {
        }

        public ExamPerformance(Integer examId, String examName, String examDate,
                               List<SubjectScore> subjectScores,
                               Integer totalScore, Double averageScore) {
            this.examId = examId;
            this.examName = examName;
            this.examDate = examDate;
            this.subjectScores = subjectScores;
            this.totalScore = totalScore;
            this.averageScore = averageScore;
        }

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

        public String getExamDate() {
            return examDate;
        }

        public void setExamDate(String examDate) {
            this.examDate = examDate;
        }

        public List<SubjectScore> getSubjectScores() {
            return subjectScores;
        }

        public void setSubjectScores(List<SubjectScore> subjectScores) {
            this.subjectScores = subjectScores;
        }

        public Integer getTotalScore() {
            return totalScore;
        }

        public void setTotalScore(Integer totalScore) {
            this.totalScore = totalScore;
        }

        public Double getAverageScore() {
            return averageScore;
        }

        public void setAverageScore(Double averageScore) {
            this.averageScore = averageScore;
        }
    }

    // -------- Subject Score --------
    public static class SubjectScore {

        private String subjectName;
        private Integer score;
        private String status;

        public SubjectScore() {
        }

        public SubjectScore(String subjectName, Integer score, String status) {
            this.subjectName = subjectName;
            this.score = score;
            this.status = status;
        }

        public String getSubjectName() {
            return subjectName;
        }

        public void setSubjectName(String subjectName) {
            this.subjectName = subjectName;
        }

        public Integer getScore() {
            return score;
        }

        public void setScore(Integer score) {
            this.score = score;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}