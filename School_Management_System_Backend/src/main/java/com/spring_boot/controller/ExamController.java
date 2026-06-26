package com.spring_boot.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spring_boot.dto.request.ExamRequest;
import com.spring_boot.dto.response.ApiResponse;
import com.spring_boot.dto.response.ExamResponse;
import com.spring_boot.service.ExamService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    private static final Logger log = LoggerFactory.getLogger(ExamController.class);

    private final ExamService examService;

    // Constructor Injection (replacing @RequiredArgsConstructor)
    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    /**
     * 3.1 GET /api/exams
     * Retrieve all exam events.
     * Supports optional ?sort=date query parameter to sort by exam date descending.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ExamResponse>>> getAllExams(
            @RequestParam(name = "sort", required = false) String sort) {
        log.info("GET /api/exams, sort={}", sort);
        boolean sortByDate = "date".equalsIgnoreCase(sort);
        List<ExamResponse> exams = examService.getAllExams(sortByDate);
        return ResponseEntity.ok(ApiResponse.success(exams, exams.size()));
    }

    /**
     * 3.2 GET /api/exams/{examId}
     * Retrieve a specific exam event by its ID.
     */
    @GetMapping("/{examId}")
    public ResponseEntity<ApiResponse<ExamResponse>> getExamById(
            @PathVariable Integer examId) {
        log.info("GET /api/exams/{}", examId);
        return ResponseEntity.ok(ApiResponse.success(examService.getExamById(examId)));
    }

    /**
     * 3.3 POST /api/exams
     * Schedule a new exam event.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ExamResponse>> createExam(
            @Valid @RequestBody ExamRequest request) {
        log.info("POST /api/exams");
        ExamResponse created = examService.createExam(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Exam created successfully.", created));
    }

    /**
     * 3.4 PUT /api/exams/{examId}
     * Reschedule or rename an existing exam.
     */
    @PutMapping("/{examId}")
    public ResponseEntity<ApiResponse<ExamResponse>> updateExam(
            @PathVariable Integer examId,
            @Valid @RequestBody ExamRequest request) {
        log.info("PUT /api/exams/{}", examId);
        ExamResponse updated = examService.updateExam(examId, request);
        return ResponseEntity.ok(ApiResponse.success("Exam updated successfully.", updated));
    }

    /**
     * 3.5 DELETE /api/exams/{examId}
     * Remove an exam event record.
     */
    @DeleteMapping("/{examId}")
    public ResponseEntity<ApiResponse<Void>> deleteExam(
            @PathVariable Integer examId) {
        log.info("DELETE /api/exams/{}", examId);
        examService.deleteExam(examId);
        return ResponseEntity.ok(
                ApiResponse.success("Exam with ID " + examId + " has been deleted successfully."));
    }
}