package com.spring_boot.dto.response;

public class StudentResponse {

    private Integer studentId;
    private String firstName;
    private String lastName;
    private Integer enrollmentYear;
    private String fullName;

    // No-args constructor
    public StudentResponse() {
    }

    // All-args constructor
    public StudentResponse(Integer studentId, String firstName,
                           String lastName, Integer enrollmentYear,
                           String fullName) {
        this.studentId = studentId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.enrollmentYear = enrollmentYear;
        this.fullName = fullName;
    }

    // Getters and Setters

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Integer getEnrollmentYear() {
        return enrollmentYear;
    }

    public void setEnrollmentYear(Integer enrollmentYear) {
        this.enrollmentYear = enrollmentYear;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}