package com.spring_boot.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Generic API response wrapper for all successful responses.
 * Fields are excluded from JSON output if null, keeping responses clean.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private String status;
    private String message;
    private T data;
    private Integer totalCount;

    // No-args constructor
    public ApiResponse() {
    }

    // Getters and Setters

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public Integer getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(Integer totalCount) {
        this.totalCount = totalCount;
    }

    /** Used for single object success responses (GET by ID, PUT) */
    public static <T> ApiResponse<T> success(T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setStatus("success");
        response.setData(data);
        return response;
    }

    /** Used for list responses (GET all) */
    public static <T> ApiResponse<T> success(T data, int totalCount) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setStatus("success");
        response.setData(data);
        response.setTotalCount(totalCount);
        return response;
    }

    /** Used for create/update responses with a message */
    public static <T> ApiResponse<T> success(String message, T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setStatus("success");
        response.setMessage(message);
        response.setData(data);
        return response;
    }

    /** Used for delete responses (no data, only a message) */
    public static <T> ApiResponse<T> success(String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setStatus("success");
        response.setMessage(message);
        return response;
    }
}