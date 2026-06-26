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

import com.spring_boot.dto.request.MarkRequest;
import com.spring_boot.dto.request.MarkUpdateRequest;
import com.spring_boot.dto.response.ApiResponse;
import com.spring_boot.dto.response.MarkResponse;
import com.spring_boot.service.MarkService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/marks")
public class MarkController {

    private static final Logger log = LoggerFactory.getLogger(MarkController.class);

    private final MarkService markService;

    // Constructor Injection (replacing @RequiredArgsConstructor)
    public MarkController(MarkService markService) {
        this.markService = markService;
    }

    /**
     * 4.1 GET /api/marks
     * Retrieve marks with optional query filters:
     *   ?studentId={id}  — filter by student
     *   ?subjectId={id}  — filter by subject
     *   ?examId={id}     — filter by exam
     *   ?minScore={n}    — return only marks above this threshold
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<MarkResponse>>> getAllMarks(
            @RequestParam(required = false) Integer studentId,
            @RequestParam(required = false) Integer subjectId,
            @RequestParam(required = false) Integer examId,
            @RequestParam(required = false) Integer minScore) {

        log.info("GET /api/marks — filters: studentId={}, subjectId={}, examId={}, minScore={}",
                studentId, subjectId, examId, minScore);

        List<MarkResponse> marks = markService.getAllMarks(studentId, subjectId, examId, minScore);
        return ResponseEntity.ok(ApiResponse.success(marks, marks.size()));
    }

    
    @GetMapping("/{markId}")
    public ResponseEntity<ApiResponse<MarkResponse>> getMarkById(
            @PathVariable Integer markId) {

        log.info("GET /api/marks/{}", markId);
        return ResponseEntity.ok(ApiResponse.success(markService.getMarkById(markId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MarkResponse>> createMark(
            @Valid @RequestBody MarkRequest request) {

        log.info("POST /api/marks");
        MarkResponse created = markService.createMark(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Mark recorded successfully.", created));
    }

  
    @PutMapping("/{markId}")
    public ResponseEntity<ApiResponse<MarkResponse>> updateMark(
            @PathVariable Integer markId,
            @Valid @RequestBody MarkUpdateRequest request) {

        log.info("PUT /api/marks/{}", markId);
        MarkResponse updated = markService.updateMark(markId, request);

        return ResponseEntity.ok(ApiResponse.success("Mark updated successfully.", updated));
    }

    
    @DeleteMapping("/{markId}")
    public ResponseEntity<ApiResponse<Void>> deleteMark(
            @PathVariable Integer markId) {

        log.info("DELETE /api/marks/{}", markId);
        markService.deleteMark(markId);

        return ResponseEntity.ok(
                ApiResponse.success("Mark with ID " + markId + " has been deleted successfully."));
    }
}