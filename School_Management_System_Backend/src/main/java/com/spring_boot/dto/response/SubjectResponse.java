package com.spring_boot.dto.response;

public class SubjectResponse {

    private Integer subjectId;
    private String subjectName;

    // No-args constructor
    public SubjectResponse() {
    }

    // All-args constructor
    public SubjectResponse(Integer subjectId, String subjectName) {
        this.subjectId = subjectId;
        this.subjectName = subjectName;
    }

    // Getters and Setters

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