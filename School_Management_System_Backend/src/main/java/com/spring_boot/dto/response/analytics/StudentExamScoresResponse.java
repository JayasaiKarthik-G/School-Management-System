package com.spring_boot.dto.response.analytics;

import java.util.List;

/**
 * Response DTO for GET /api/performance/students/{studentId}/exams/{examId}
 * All subject scores for one student in one specific exam.
 */
public class StudentExamScoresResponse {

    private StudentRef student;
    private ExamRef exam;
    private List<SubjectScore> scores;
    private Integer totalScore;
    private Double averageScore;

    // No-args constructor
    public StudentExamScoresResponse() {
    }

    // All-args constructor
    public StudentExamScoresResponse(StudentRef student,
                                     ExamRef exam,
                                     List<SubjectScore> scores,
                                     Integer totalScore,
                                     Double averageScore) {
        this.student = student;
        this.exam = exam;
        this.scores = scores;
        this.totalScore = totalScore;
        this.averageScore = averageScore;
    }

    // Getters and Setters

    public StudentRef getStudent() {
        return student;
    }

    public void setStudent(StudentRef student) {
        this.student = student;
    }

    public ExamRef getExam() {
        return exam;
    }

    public void setExam(ExamRef exam) {
        this.exam = exam;
    }

    public List<SubjectScore> getScores() {
        return scores;
    }

    public void setScores(List<SubjectScore> scores) {
        this.scores = scores;
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

    // -------------------------------------------------------
    // Nested Classes
    // -------------------------------------------------------

    public static class StudentRef {

        private Integer studentId;
        private String fullName;

        public StudentRef() {
        }

        public StudentRef(Integer studentId, String fullName) {
            this.studentId = studentId;
            this.fullName = fullName;
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
    }

    public static class ExamRef {

        private Integer examId;
        private String examName;
        private String examDate;

        public ExamRef() {
        }

        public ExamRef(Integer examId, String examName, String examDate) {
            this.examId = examId;
            this.examName = examName;
            this.examDate = examDate;
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
    }

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