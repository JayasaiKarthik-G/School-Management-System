package com.spring_boot.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spring_boot.dto.response.ApiResponse;
import com.spring_boot.dto.response.analytics.ExamLeaderboardResponse;
import com.spring_boot.dto.response.analytics.ExamSummaryResponse;
import com.spring_boot.dto.response.analytics.StudentCompareResponse;
import com.spring_boot.dto.response.analytics.StudentTrendResponse;
import com.spring_boot.service.ReportService;

import jakarta.validation.constraints.Min;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private static final Logger log = LoggerFactory.getLogger(ReportController.class);

    private final ReportService reportService;

    // Constructor Injection (replacing @RequiredArgsConstructor)
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    /**
     * 6.1 GET /api/reports/exams/{examId}/leaderboard
     * Rank all students by their total score in a specific exam.
     */
    @GetMapping("/exams/{examId}/leaderboard")
    public ResponseEntity<ApiResponse<ExamLeaderboardResponse>> getExamLeaderboard(
            @PathVariable Integer examId) {

        log.info("GET /api/reports/exams/{}/leaderboard", examId);

        ExamLeaderboardResponse leaderboard =
                reportService.getExamLeaderboard(examId);

        return ResponseEntity.ok(ApiResponse.success(leaderboard));
    }

    /**
     * 6.2 GET /api/reports/exams/summary
     * Returns exams where the total score sum exceeds a given threshold.
     * Supports optional query parameter:
     *   ?minTotalScore={n} — only return exams where sum of scores >= this value (default: 0)
     *   
     * Example URLs:
     *   http://localhost:8080/api/reports/exams/summary
     *   http://localhost:8080/api/reports/exams/summary?minTotalScore=1
     */
    @GetMapping("/exams/summary")
    public ResponseEntity<ApiResponse<List<ExamSummaryResponse>>> getExamSummary(
            @RequestParam(required = false, defaultValue = "0") @Min(0) Integer minTotalScore) {

        log.info("GET /api/reports/exams/summary — minTotalScore={}", minTotalScore);

        List<ExamSummaryResponse> summary =
                reportService.getExamSummary(minTotalScore);

        return ResponseEntity.ok(ApiResponse.success(summary, summary.size()));
    }

    /**
     * 6.3 GET /api/reports/students/compare
     * Side-by-side performance comparison between two students.
     * Required query parameters:
     *   ?studentIdA={id} — first student ID
     *   ?studentIdB={id} — second student ID
     * Optional:
     *   ?examId={id}     — limit comparison to a specific exam (default: 0)
     *   
     * Example URLs:
     *   http://localhost:8080/api/reports/students/comapre
     *   http://localhost:8080/api/reports/students/compare?studentIdA=1&studentIdB=2&examId=1
     */
    @GetMapping("/students/compare")
    public ResponseEntity<ApiResponse<StudentCompareResponse>> compareStudents(
            @RequestParam Integer studentIdA,
            @RequestParam Integer studentIdB,
            @RequestParam(required = true, defaultValue = "0") @Min(0) Integer examId) {

        log.info("GET /api/reports/students/compare — studentIdA={}, studentIdB={}, examId={}",
                studentIdA, studentIdB, examId);

        StudentCompareResponse comparison =
                reportService.compareStudents(studentIdA, studentIdB, examId);

        return ResponseEntity.ok(ApiResponse.success(comparison));
    }

    /**
     * 6.4 GET /api/reports/students/{studentId}/trend
     * Track a student's score progression over multiple exam events.
     * Optional query parameter:
     *   ?subjectId={id} — scope trend to a specific subject (default: 0)
     *   
     * Example URLs:
     *   http://localhost:8080/api/reports/students/{studentId}/trend
     *   http://localhost:8080/api/reports/students/{studentId}/trend?subjectId=1
     */
    @GetMapping("/students/{studentId}/trend")
    public ResponseEntity<ApiResponse<StudentTrendResponse>> getStudentTrend(
            @PathVariable Integer studentId,
            @RequestParam(required = false, defaultValue = "0") @Min(0) Integer subjectId) {

        log.info("GET /api/reports/students/{}/trend — subjectId={}", studentId, subjectId);

        StudentTrendResponse trend =
                reportService.getStudentTrend(studentId, subjectId);

        return ResponseEntity.ok(ApiResponse.success(trend));
    }
}