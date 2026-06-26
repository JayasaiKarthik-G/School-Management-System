package com.spring_boot.dto.response.analytics;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Response DTO for GET /api/reports/students/compare
 * Side-by-side performance comparison between two students.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StudentCompareResponse {

    private StudentDetail studentA;
    private StudentDetail studentB;
    private Winner winner;

    // No-args constructor
    public StudentCompareResponse() {
    }

    // All-args constructor
    public StudentCompareResponse(StudentDetail studentA,
                                  StudentDetail studentB,
                                  Winner winner) {
        this.studentA = studentA;
        this.studentB = studentB;
        this.winner = winner;
    }

    // Getters and Setters

    public StudentDetail getStudentA() {
        return studentA;
    }

    public void setStudentA(StudentDetail studentA) {
        this.studentA = studentA;
    }

    public StudentDetail getStudentB() {
        return studentB;
    }

    public void setStudentB(StudentDetail studentB) {
        this.studentB = studentB;
    }

    public Winner getWinner() {
        return winner;
    }

    public void setWinner(Winner winner) {
        this.winner = winner;
    }

    // -------------------------------------------------------
    // Nested Classes
    // -------------------------------------------------------

    public static class StudentDetail {

        private StudentRef student;
        private Double overallAverage;
        private List<SubjectAverage> subjectAverages;

        public StudentDetail() {
        }

        public StudentDetail(StudentRef student,
                             Double overallAverage,
                             List<SubjectAverage> subjectAverages) {
            this.student = student;
            this.overallAverage = overallAverage;
            this.subjectAverages = subjectAverages;
        }

        public StudentRef getStudent() {
            return student;
        }

        public void setStudent(StudentRef student) {
            this.student = student;
        }

        public Double getOverallAverage() {
            return overallAverage;
        }

        public void setOverallAverage(Double overallAverage) {
            this.overallAverage = overallAverage;
        }

        public List<SubjectAverage> getSubjectAverages() {
            return subjectAverages;
        }

        public void setSubjectAverages(List<SubjectAverage> subjectAverages) {
            this.subjectAverages = subjectAverages;
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

    public static class SubjectAverage {

        private String subjectName;
        private Double average;

        public SubjectAverage() {
        }

        public SubjectAverage(String subjectName, Double average) {
            this.subjectName = subjectName;
            this.average = average;
        }

        public String getSubjectName() {
            return subjectName;
        }

        public void setSubjectName(String subjectName) {
            this.subjectName = subjectName;
        }

        public Double getAverage() {
            return average;
        }

        public void setAverage(Double average) {
            this.average = average;
        }
    }

    public static class Winner {

        private Integer studentId;
        private String fullName;
        private Double margin;

        public Winner() {
        }

        public Winner(Integer studentId, String fullName, Double margin) {
            this.studentId = studentId;
            this.fullName = fullName;
            this.margin = margin;
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

        public Double getMargin() {
            return margin;
        }

        public void setMargin(Double margin) {
            this.margin = margin;
        }
    }
}