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
import com.spring_boot.dto.response.analytics.PassFailReportResponse;
import com.spring_boot.dto.response.analytics.StudentExamScoresResponse;
import com.spring_boot.dto.response.analytics.StudentFullPerformanceResponse;
import com.spring_boot.dto.response.analytics.SubjectAverageResponse;
import com.spring_boot.dto.response.analytics.TopPerformerResponse;
import com.spring_boot.service.PerformanceService;

import jakarta.validation.constraints.Min;

@RestController
@RequestMapping("/api/performance")
public class PerformanceController {

    private static final Logger log = LoggerFactory.getLogger(PerformanceController.class);

    private final PerformanceService performanceService;

    // Constructor Injection (replacing @RequiredArgsConstructor)
    public PerformanceController(PerformanceService performanceService) {
        this.performanceService = performanceService;
    }

    /**
     * 5.1 GET /api/performance/students/{studentId}
     * Detailed performance of a student across all subjects and exams.
     */
    @GetMapping("/students/{studentId}")
    public ResponseEntity<ApiResponse<StudentFullPerformanceResponse>> getFullPerformanceReport(
            @PathVariable Integer studentId) {

        log.info("GET /api/performance/students/{}", studentId);

        StudentFullPerformanceResponse report =
                performanceService.getFullPerformanceReport(studentId);

        return ResponseEntity.ok(ApiResponse.success(report));
    }

    /**
     * 5.2 GET /api/performance/students/{studentId}/exams/{examId}
     * All subject scores for one student in one specific exam.
     */
    @GetMapping("/students/{studentId}/exams/{examId}")
    public ResponseEntity<ApiResponse<StudentExamScoresResponse>> getStudentPerformanceInExam(
            @PathVariable Integer studentId,
            @PathVariable Integer examId) {

        log.info("GET /api/performance/students/{}/exams/{}", studentId, examId);

        StudentExamScoresResponse result =
                performanceService.getStudentPerformanceInExam(studentId, examId);

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    /**
     * 5.3 GET /api/performance/subjects/averages
     * Calculate average score for every subject across all exams.
     */
    @GetMapping("/subjects/averages")
    public ResponseEntity<ApiResponse<List<SubjectAverageResponse>>> getSubjectAverages() {

        log.info("GET /api/performance/subjects/averages");

        List<SubjectAverageResponse> averages =
                performanceService.getSubjectAverages();

        return ResponseEntity.ok(ApiResponse.success(averages, averages.size()));
    }

    /**
     * 5.4 GET /api/performance/top-performers
     * Returns the students with the highest single score across all exams.
     * Supports optional query parameters:
     *   ?limit={n}   — number of top performers to return (default: 5)
     *   ?examId={id} — scope top performers to a specific exam (default: 0)
     *   
     * Example URLs:
	 *   http://localhost:8080/api/performance/top-performers
	 *   http://localhost:8080/api/performance/top-performers?limit=5&examId=1
	 */
    @GetMapping("/top-performers")
    public ResponseEntity<ApiResponse<List<TopPerformerResponse>>> getTopPerformers(
            @RequestParam(required = false, defaultValue = "5") @Min(3) Integer limit,
            @RequestParam(required = false, defaultValue = "0") @Min(0) Integer examId) {

        log.info("GET /api/performance/top-performers — limit={}, examId={}", limit, examId);

        List<TopPerformerResponse> topPerformers =
                performanceService.getTopPerformers(limit, examId);

        return ResponseEntity.ok(ApiResponse.success(topPerformers, topPerformers.size()));
    }

    /**
     * 5.5 GET /api/performance/exams/{examId}/pass-fail
     * Pass/Fail status for all students in a given exam.
     * Supports optional query parameter:
     *   ?passThreshold={n} — minimum score to pass (default: 70)
     *   
     * Example URLs:
	 *   http://localhost:8080/api/performance/exams/1/pass-fail
	 *   http://localhost:8080/api/performance/exams/1/pass-fail?passThreshold=50
	 */
    @GetMapping("/exams/{examId}/pass-fail")
    public ResponseEntity<ApiResponse<PassFailReportResponse>> getPassFailReport(
            @PathVariable Integer examId,
            @RequestParam(required = false, defaultValue = "70") @Min(35) Integer passThreshold) {

        log.info("GET /api/performance/exams/{}/pass-fail — passThreshold={}", examId, passThreshold);

        PassFailReportResponse report =
                performanceService.getPassFailReport(examId, passThreshold);

        return ResponseEntity.ok(ApiResponse.success(report));
    }
    
}