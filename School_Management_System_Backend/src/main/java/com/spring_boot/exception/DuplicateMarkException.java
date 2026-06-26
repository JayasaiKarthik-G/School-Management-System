package com.spring_boot.exception;

import com.spring_boot.constants.ErrorCodes;

/**
 * Thrown when a mark record already exists for the same
 * Student + Subject + Exam combination.
 * Mapped to HTTP 409 Conflict by the GlobalExceptionHandler.
 */
@SuppressWarnings("serial")
public class DuplicateMarkException extends RuntimeException {

    public DuplicateMarkException(String message) {
        super(message);
    }

    public String getErrorCode() {
        return ErrorCodes.DUPLICATE_MARK;
    }
}