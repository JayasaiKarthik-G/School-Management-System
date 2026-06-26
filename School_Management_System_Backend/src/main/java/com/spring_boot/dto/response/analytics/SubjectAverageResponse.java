package com.spring_boot.dto.response.analytics;

/**
 * Response DTO for GET /api/performance/subjects/averages
 * Aggregate statistics per subject across all exams.
 */
public class SubjectAverageResponse {

    private Integer subjectId;
    private String subjectName;
    private Double averageScore;
    private Long totalMarksRecorded;
    private Integer highestScore;
    private Integer lowestScore;

    // ================= Constructors =================

    public SubjectAverageResponse() {
    }

    public SubjectAverageResponse(Integer subjectId, String subjectName,
                                  Double averageScore, Long totalMarksRecorded,
                                  Integer highestScore, Integer lowestScore) {
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.averageScore = averageScore;
        this.totalMarksRecorded = totalMarksRecorded;
        this.highestScore = highestScore;
        this.lowestScore = lowestScore;
    }

    // ================= Getters & Setters =================

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

    public Double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(Double averageScore) {
        this.averageScore = averageScore;
    }

    public Long getTotalMarksRecorded() {
        return totalMarksRecorded;
    }

    public void setTotalMarksRecorded(Long totalMarksRecorded) {
        this.totalMarksRecorded = totalMarksRecorded;
    }

    public Integer getHighestScore() {
        return highestScore;
    }

    public void setHighestScore(Integer highestScore) {
        this.highestScore = highestScore;
    }

    public Integer getLowestScore() {
        return lowestScore;
    }

    public void setLowestScore(Integer lowestScore) {
        this.lowestScore = lowestScore;
    }
}