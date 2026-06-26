package com.spring_boot.service;

import java.util.List;

import com.spring_boot.dto.response.analytics.ExamSummaryResponse;
import com.spring_boot.dto.response.analytics.PassFailReportResponse;
import com.spring_boot.dto.response.analytics.StudentExamScoresResponse;
import com.spring_boot.dto.response.analytics.StudentFullPerformanceResponse;
import com.spring_boot.dto.response.analytics.SubjectAverageResponse;
import com.spring_boot.dto.response.analytics.TopPerformerResponse;

/**
 * Contract for performance analytics operations.
 * Implemented by {@link com.spring_boot.service.impl.PerformanceServiceImpl}.
 */
public interface PerformanceService {

    /**
     * Builds a full performance report for a student across all exams and subjects.
     *
     * @param studentId the student's ID
     * @return complete performance report DTO
     */
    StudentFullPerformanceResponse getFullPerformanceReport(Integer studentId);

    /**
     * Returns all subject scores for one student in one specific exam.
     *
     * @param studentId the student's ID
     * @param examId    the exam's ID
     * @return exam-scoped performance DTO
     */
    StudentExamScoresResponse getStudentPerformanceInExam(Integer studentId, Integer examId);

    /**
     * Calculates the average score for every subject across all recorded marks.
     *
     * @return list of subject-average response DTOs
     */
    List<SubjectAverageResponse> getSubjectAverages();

    /**
     * Returns the students with the highest single-subject scores.
     *
     * @param limit  maximum number of performers to return (defaults to 5 if null)
     * @param examId optional filter to scope results to a specific exam
     * @return ranked list of top-performer response DTOs
     */
    List<TopPerformerResponse> getTopPerformers(Integer limit, Integer examId);

    /**
     * Produces a pass/fail report for all students in a given exam.
     *
     * @param examId        the exam's ID
     * @param passThreshold minimum score to be considered a pass (defaults to 70 if null)
     * @return pass/fail report DTO
     */
    PassFailReportResponse getPassFailReport(Integer examId, Integer passThreshold);

    /**
     * Returns exam-wise summary filtered by minimum total score.
     *
     * @param minTotalScore minimum total score filter (optional)
     * @return list of exam summary response DTOs
     */
    List<ExamSummaryResponse> getExamSummary(Integer minTotalScore);
}