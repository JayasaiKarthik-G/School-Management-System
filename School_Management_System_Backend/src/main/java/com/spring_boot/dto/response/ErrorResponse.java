package com.spring_boot.dto.response;

/**
 * Standard error response envelope returned by the GlobalExceptionHandler
 * for all error scenarios (4xx, 5xx).
 */
public class ErrorResponse {

    private String status = "error";
    private String errorCode;
    private String message;
    private String timestamp;
    private String path;

    // No-args constructor
    public ErrorResponse() {
    }

    // All-args constructor
    public ErrorResponse(String status, String errorCode, String message,
                         String timestamp, String path) {
        this.status = status;
        this.errorCode = errorCode;
        this.message = message;
        this.timestamp = timestamp;
        this.path = path;
    }

    // Custom constructor (status always "error")
    public ErrorResponse(String errorCode, String message,
                         String timestamp, String path) {
        this.status = "error";
        this.errorCode = errorCode;
        this.message = message;
        this.timestamp = timestamp;
        this.path = path;
    }

    // Getters and Setters

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
}