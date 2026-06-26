package com.spring_boot.dto.response.analytics;

/**
 * Response DTO for GET /api/performance/top-performers
 * Each entry represents one top-scoring mark record, ranked.
 */
public class TopPerformerResponse {

    private Integer rank;
    private StudentRef student;
    private ExamRef exam;
    private SubjectRef subject;
    private Integer highestScore;

    // ================= Constructors =================

    public TopPerformerResponse() {
    }

    public TopPerformerResponse(Integer rank, StudentRef student,
                                ExamRef exam, SubjectRef subject,
                                Integer highestScore) {
        this.rank = rank;
        this.student = student;
        this.exam = exam;
        this.subject = subject;
        this.highestScore = highestScore;
    }

    // ================= Getters & Setters =================

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

    public ExamRef getExam() {
        return exam;
    }

    public void setExam(ExamRef exam) {
        this.exam = exam;
    }

    public SubjectRef getSubject() {
        return subject;
    }

    public void setSubject(SubjectRef subject) {
        this.subject = subject;
    }

    public Integer getHighestScore() {
        return highestScore;
    }

    public void setHighestScore(Integer highestScore) {
        this.highestScore = highestScore;
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

    public static class ExamRef {

        private String examName;

        public ExamRef() {
        }

        public ExamRef(String examName) {
            this.examName = examName;
        }

        public String getExamName() {
            return examName;
        }

        public void setExamName(String examName) {
            this.examName = examName;
        }
    }

    public static class SubjectRef {

        private String subjectName;

        public SubjectRef() {
        }

        public SubjectRef(String subjectName) {
            this.subjectName = subjectName;
        }

        public String getSubjectName() {
            return subjectName;
        }

        public void setSubjectName(String subjectName) {
            this.subjectName = subjectName;
        }
    }
}