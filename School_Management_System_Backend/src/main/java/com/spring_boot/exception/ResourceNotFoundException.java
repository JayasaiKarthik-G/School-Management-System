package com.spring_boot.exception;

/**
 * Thrown when a requested resource (Student, Subject, Exam, Mark) is not found.
 * Mapped to HTTP 404 Not Found by the GlobalExceptionHandler.
 */
@SuppressWarnings("serial")
public class ResourceNotFoundException extends RuntimeException {

    private final String errorCode;

    public ResourceNotFoundException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}