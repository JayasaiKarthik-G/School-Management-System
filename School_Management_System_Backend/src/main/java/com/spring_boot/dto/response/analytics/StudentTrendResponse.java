package com.spring_boot.dto.response.analytics;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Response DTO for GET /api/reports/students/{studentId}/trend
 * Score progression over multiple exams for a student, optionally scoped to a subject.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StudentTrendResponse {

    private StudentRef student;
    private SubjectRef subject;
    private List<TrendEntry> trend;
    private String trendDirection;
    private Double changePercent;

    // ================= Constructors =================

    public StudentTrendResponse() {
    }

    public StudentTrendResponse(StudentRef student, SubjectRef subject,
                                List<TrendEntry> trend, String trendDirection,
                                Double changePercent) {
        this.student = student;
        this.subject = subject;
        this.trend = trend;
        this.trendDirection = trendDirection;
        this.changePercent = changePercent;
    }

    // ================= Getters & Setters =================

    public StudentRef getStudent() {
        return student;
    }

    public void setStudent(StudentRef student) {
        this.student = student;
    }

    public SubjectRef getSubject() {
        return subject;
    }

    public void setSubject(SubjectRef subject) {
        this.subject = subject;
    }

    public List<TrendEntry> getTrend() {
        return trend;
    }

    public void setTrend(List<TrendEntry> trend) {
        this.trend = trend;
    }

    public String getTrendDirection() {
        return trendDirection;
    }

    public void setTrendDirection(String trendDirection) {
        this.trendDirection = trendDirection;
    }

    public Double getChangePercent() {
        return changePercent;
    }

    public void setChangePercent(Double changePercent) {
        this.changePercent = changePercent;
    }

    // ================= Inner Classes =================

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

    public static class SubjectRef {

        private Integer subjectId;
        private String subjectName;

        public SubjectRef() {
        }

        public SubjectRef(Integer subjectId, String subjectName) {
            this.subjectId = subjectId;
            this.subjectName = subjectName;
        }

        public Integer getSubjectId() {
            return subjectId;
        }

        public void setSubjectId(Integer subjectId) {
            this.subjectId = subjectId;
        }

        public String getSubjectName() {
            return subjectName;
        }

        public void setSubjectName(String subjectName) {
            this.subjectName = subjectName;
        }
    }

    public static class TrendEntry {

        private Integer examId;
        private String examName;
        private String examDate;
        private Integer score;

        public TrendEntry() {
        }

        public TrendEntry(Integer examId, String examName,
                          String examDate, Integer score) {
            this.examId = examId;
            this.examName = examName;
            this.examDate = examDate;
            this.score = score;
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

        public Integer getScore() {
            return score;
        }

        public void setScore(Integer score) {
            this.score = score;
        }
    }
}