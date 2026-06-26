package com.spring_boot.dto.response.analytics;

import java.util.List;

/**
 * Response DTO for GET /api/performance/exams/{examId}/pass-fail
 * Pass/Fail status for all students in a given exam.
 */
public class PassFailReportResponse {

    private ExamRef exam;
    private Integer passThreshold;
    private Summary summary;
    private List<StudentResult> results;

    // No-args constructor
    public PassFailReportResponse() {
    }

    // All-args constructor
    public PassFailReportResponse(ExamRef exam, Integer passThreshold,
                                  Summary summary, List<StudentResult> results) {
        this.exam = exam;
        this.passThreshold = passThreshold;
        this.summary = summary;
        this.results = results;
    }

    // Getters and Setters

    public ExamRef getExam() {
        return exam;
    }

    public void setExam(ExamRef exam) {
        this.exam = exam;
    }

    public Integer getPassThreshold() {
        return passThreshold;
    }

    public void setPassThreshold(Integer passThreshold) {
        this.passThreshold = passThreshold;
    }

    public Summary getSummary() {
        return summary;
    }

    public void setSummary(Summary summary) {
        this.summary = summary;
    }

    public List<StudentResult> getResults() {
        return results;
    }

    public void setResults(List<StudentResult> results) {
        this.results = results;
    }

    // -------------------------------------------------------
    // Nested Classes
    // -------------------------------------------------------

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

    public static class Summary {

        private Integer totalStudents;
        private Integer passed;
        private Integer failed;
        private Double passPercentage;

        public Summary() {
        }

        public Summary(Integer totalStudents, Integer passed,
                       Integer failed, Double passPercentage) {
            this.totalStudents = totalStudents;
            this.passed = passed;
            this.failed = failed;
            this.passPercentage = passPercentage;
        }

        public Integer getTotalStudents() {
            return totalStudents;
        }

        public void setTotalStudents(Integer totalStudents) {
            this.totalStudents = totalStudents;
        }

        public Integer getPassed() {
            return passed;
        }

        public void setPassed(Integer passed) {
            this.passed = passed;
        }

        public Integer getFailed() {
            return failed;
        }

        public void setFailed(Integer failed) {
            this.failed = failed;
        }

        public Double getPassPercentage() {
            return passPercentage;
        }

        public void setPassPercentage(Double passPercentage) {
            this.passPercentage = passPercentage;
        }
    }

    public static class StudentResult {

        private StudentRef student;
        private List<SubjectResult> subjectResults;
        private String overallStatus;

        public StudentResult() {
        }

        public StudentResult(StudentRef student,
                             List<SubjectResult> subjectResults,
                             String overallStatus) {
            this.student = student;
            this.subjectResults = subjectResults;
            this.overallStatus = overallStatus;
        }

        public StudentRef getStudent() {
            return student;
        }

        public void setStudent(StudentRef student) {
            this.student = student;
        }

        public List<SubjectResult> getSubjectResults() {
            return subjectResults;
        }

        public void setSubjectResults(List<SubjectResult> subjectResults) {
            this.subjectResults = subjectResults;
        }

        public String getOverallStatus() {
            return overallStatus;
        }

        public void setOverallStatus(String overallStatus) {
            this.overallStatus = overallStatus;
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

    public static class SubjectResult {

        private String subjectName;
        private Integer score;
        private String status;

        public SubjectResult() {
        }

        public SubjectResult(String subjectName, Integer score, String status) {
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