package com.spring_boot.exception;

import java.time.Instant;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import com.spring_boot.constants.ErrorCodes;
import com.spring_boot.dto.response.ErrorResponse;

import jakarta.servlet.http.HttpServletRequest;


@RestControllerAdvice
public class GlobalExceptionHandler {


    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);


    // ------------------------------------------------------------------
    // 404 Not Found
    // ------------------------------------------------------------------


    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
            ResourceNotFoundException ex, HttpServletRequest request) {


        log.warn("Resource not found: [{}] {} - Path: {}",
                ex.getErrorCode(), ex.getMessage(), request.getRequestURI());


        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(buildError(ex.getErrorCode(), ex.getMessage(), request.getRequestURI()));
    }


    // ------------------------------------------------------------------
    // 409 Conflict — Duplicate Mark
    // ------------------------------------------------------------------


    @ExceptionHandler(DuplicateMarkException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateMarkException(
            DuplicateMarkException ex, HttpServletRequest request) {


        log.warn("Duplicate mark: {} - Path: {}", ex.getMessage(), request.getRequestURI());


        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(buildError(ex.getErrorCode(), ex.getMessage(), request.getRequestURI()));
    }


    // ------------------------------------------------------------------
    // 409 Conflict — Referential Integrity
    // ------------------------------------------------------------------


    @ExceptionHandler(ResourceConflictException.class)
    public ResponseEntity<ErrorResponse> handleResourceConflictException(
            ResourceConflictException ex, HttpServletRequest request) {


        log.warn("Resource conflict: [{}] {} - Path: {}",
                ex.getErrorCode(), ex.getMessage(), request.getRequestURI());


        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(buildError(ex.getErrorCode(), ex.getMessage(), request.getRequestURI()));
    }


    // ------------------------------------------------------------------
    // 422 Validation Error
    // ------------------------------------------------------------------


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex, HttpServletRequest request) {


        String details = ex.getBindingResult().getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));


        log.warn("Validation failed on {}: {}", request.getRequestURI(), details);


        return ResponseEntity
                .status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(buildError(ErrorCodes.VALIDATION_ERROR, details, request.getRequestURI()));
    }


    // ------------------------------------------------------------------
    // 400 Bad Request — JSON Error
    // ------------------------------------------------------------------


    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex, HttpServletRequest request) {


        log.warn("Malformed request body on {}: {}", request.getRequestURI(), ex.getMessage());


        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(buildError(
                        ErrorCodes.MALFORMED_REQUEST,
                        "Request body is missing or malformed.",
                        request.getRequestURI()
                ));
    }


    // ------------------------------------------------------------------
    // 400 Missing Param
    // ------------------------------------------------------------------


    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingParams(
            MissingServletRequestParameterException ex, HttpServletRequest request) {


        log.warn("Missing parameter '{}' on {}", ex.getParameterName(), request.getRequestURI());


        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(buildError(
                        ErrorCodes.MISSING_PARAMETER,
                        "Required query parameter '" + ex.getParameterName() + "' is missing.",
                        request.getRequestURI()
                ));
    }


    // ------------------------------------------------------------------
    // 400 Type Mismatch
    // ------------------------------------------------------------------


    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex, HttpServletRequest request) {


        String msg = String.format(
                "Parameter '%s' must be of type %s.",
                ex.getName(),
                ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "unknown"
        );


        log.warn("Type mismatch on {}: {}", request.getRequestURI(), msg);


        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(buildError(ErrorCodes.TYPE_MISMATCH, msg, request.getRequestURI()));
    }


    // ------------------------------------------------------------------
    // 500 Internal Error
    // ------------------------------------------------------------------


    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex, HttpServletRequest request) {


        log.error("Unexpected error on {}: {}", request.getRequestURI(), ex.getMessage(), ex);


        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(buildError(
                        ErrorCodes.INTERNAL_SERVER_ERROR,
                        "An unexpected error occurred. Please try again later.",
                        request.getRequestURI()
                ));
    }


    // ------------------------------------------------------------------
    // Helper
    // ------------------------------------------------------------------


    private ErrorResponse buildError(String errorCode, String message, String path) {
        return new ErrorResponse(
                errorCode,
                message,
                Instant.now().toString(),
                path
        );
    }
}