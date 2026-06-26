package com.spring_boot.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class SubjectRequest {

    @NotBlank(message = "Subject name is required and must not be blank.")
    @Size(max = 50, message = "Subject name must not exceed 50 characters")
    @Pattern(regexp = "^[A-Za-z ]+$", message = "Only letters and spaces allowed")
    private String subjectName;

    // No-args constructor
    public SubjectRequest() {
    }

    // Getter
    public String getSubjectName() {
        return subjectName;
    }

    // Setter
    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }
}