package com.spring_boot.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class StudentRequest {

//	@NotNull(message = "First name is required and must not be null.")
    @NotBlank(message = "First name is required and must not be blank.") //check null values also
    @Size(max = 50, message = "First name must not exceed 50 characters")
    @Pattern(regexp = "^[A-Za-z]+$", message = "First name must contain only letters")
    private String firstName;

//  @NotNull(message = "Last name is required and must not be null.")
    @NotBlank(message = "Last name is required and must not be blank.")
    @Size(max = 50, message = "Last name must not exceed 50 characters")
    @Pattern(regexp = "^[A-Za-z ]+$", message = "Last name must contain only letters and spaces")
    private String lastName;

    @NotNull(message = "Enrollment year is required.")
    @Min(value = 1900, message = "Enrollment year must be 1900 or later.")
    @Max(value = 2100, message = "Enrollment year must be 2100 or earlier.")
    private Integer enrollmentYear;

    // No-args constructor
    public StudentRequest() {
    }

    // Getters and Setters

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
}