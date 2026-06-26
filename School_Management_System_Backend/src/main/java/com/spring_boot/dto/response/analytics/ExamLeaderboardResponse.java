package com.spring_boot.dto.response.analytics;

import java.util.List;

/**
 * Response DTO for GET /api/reports/exams/{examId}/leaderboard
 * Students ranked by total score in a specific exam.
 */
public class ExamLeaderboardResponse {

    private ExamRef exam;
    private List<LeaderboardEntry> leaderboard;

    // No-args constructor
    public ExamLeaderboardResponse() {
    }

    // All-args constructor
    public ExamLeaderboardResponse(ExamRef exam, List<LeaderboardEntry> leaderboard) {
        this.exam = exam;
        this.leaderboard = leaderboard;
    }

    // Getters and Setters

    public ExamRef getExam() {
        return exam;
    }

    public void setExam(ExamRef exam) {
        this.exam = exam;
    }

    public List<LeaderboardEntry> getLeaderboard() {
        return leaderboard;
    }

    public void setLeaderboard(List<LeaderboardEntry> leaderboard) {
        this.leaderboard = leaderboard;
    }

    // -------------------------------------------------------
    // Nested Classes
    // -------------------------------------------------------

    public static class ExamRef {

        private Integer examId;
        private String examName;

        public ExamRef() {
        }

        public ExamRef(Integer examId, String examName) {
            this.examId = examId;
            this.examName = examName;
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
    }

    public static class LeaderboardEntry {

        private Integer rank;
        private StudentRef student;
        private Long totalScore;
        private Long subjectsAttempted;

        public LeaderboardEntry() {
        }

        public LeaderboardEntry(Integer rank, StudentRef student,
                                Long totalScore, Long subjectsAttempted) {
            this.rank = rank;
            this.student = student;
            this.totalScore = totalScore;
            this.subjectsAttempted = subjectsAttempted;
        }

        public Integer getRank() {
            return rank;
        }

        public void setRank(Integer rank) {
            this.rank = rank;
        }

        public StudentRef getStudent() {
            return student;
        }

        public void setStudent(StudentRef student) {
            this.student = student;
        }

        public Long getTotalScore() {
            return totalScore;
        }

        public void setTotalScore(Long totalScore) {
            this.totalScore = totalScore;
        }

        public Long getSubjectsAttempted() {
            return subjectsAttempted;
        }

        public void setSubjectsAttempted(Long subjectsAttempted) {
            this.subjectsAttempted = subjectsAttempted;
        }
    }

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
}