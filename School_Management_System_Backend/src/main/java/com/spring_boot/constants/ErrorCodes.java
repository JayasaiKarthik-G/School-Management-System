package com.spring_boot.constants;

/**
 * Centralised error code constants used across exception classes, services,
 * and the Global Exception Handler to ensure consistent error identifiers
 * in every API error response.
 */
public final class ErrorCodes {

    private ErrorCodes() {
        // utility class — not instantiable
    }

    // ── Entity-not-found ──────────────────────────────────────────────────────
    public static final String STUDENT_NOT_FOUND     = "STUDENT_NOT_FOUND";
    public static final String SUBJECT_NOT_FOUND     = "SUBJECT_NOT_FOUND";
    public static final String EXAM_NOT_FOUND        = "EXAM_NOT_FOUND";
    public static final String MARK_NOT_FOUND        = "MARK_NOT_FOUND";

    // ── Duplicate / conflict ──────────────────────────────────────────────────
    public static final String DUPLICATE_STUDENT 	 = "DUPLICATE_STUDENT";
    public static final String DUPLICATE_MARK        = "DUPLICATE_MARK";
    public static final String STUDENT_HAS_MARKS     = "STUDENT_HAS_MARKS";
    public static final String SUBJECT_HAS_MARKS     = "SUBJECT_HAS_MARKS";
    public static final String EXAM_HAS_MARKS        = "EXAM_HAS_MARKS";

    // ── Request / validation ──────────────────────────────────────────────────
    public static final String VALIDATION_ERROR      = "VALIDATION_ERROR";
    public static final String MALFORMED_REQUEST     = "MALFORMED_REQUEST";
    public static final String MISSING_PARAMETER     = "MISSING_PARAMETER";
    public static final String TYPE_MISMATCH         = "TYPE_MISMATCH";

    // ── Server ────────────────────────────────────────────────────────────────
    public static final String INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";
}