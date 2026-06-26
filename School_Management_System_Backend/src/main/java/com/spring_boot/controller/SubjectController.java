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
import org.springframework.web.bind.annotation.RestController;

import com.spring_boot.dto.request.SubjectRequest;
import com.spring_boot.dto.response.ApiResponse;
import com.spring_boot.dto.response.SubjectResponse;
import com.spring_boot.service.SubjectService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private static final Logger log = LoggerFactory.getLogger(SubjectController.class);

    private final SubjectService subjectService;

    // Constructor Injection (replacing @RequiredArgsConstructor)
    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    /**
     * 2.1 GET /api/subjects
     * Retrieve the full list of subjects offered.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<SubjectResponse>>> getAllSubjects() {

        log.info("GET /api/subjects");

        List<SubjectResponse> subjects = subjectService.getAllSubjects();
        return ResponseEntity.ok(ApiResponse.success(subjects, subjects.size()));
    }

    /**
     * 2.2 GET /api/subjects/{subjectId}
     * Retrieve a single subject by ID.
     */
    @GetMapping("/{subjectId}")
    public ResponseEntity<ApiResponse<SubjectResponse>> getSubjectById(
            @PathVariable Integer subjectId) {

        log.info("GET /api/subjects/{}", subjectId);

        return ResponseEntity.ok(
                ApiResponse.success(subjectService.getSubjectById(subjectId)));
    }

    /**
     * 2.3 POST /api/subjects
     * Add a new subject to the curriculum.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<SubjectResponse>> createSubject(
            @Valid @RequestBody SubjectRequest request) {

        log.info("POST /api/subjects");

        SubjectResponse created = subjectService.createSubject(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Subject created successfully.", created));
    }

    /**
     * 2.4 PUT /api/subjects/{subjectId}
     * Rename or update an existing subject.
     */
    @PutMapping("/{subjectId}")
    public ResponseEntity<ApiResponse<SubjectResponse>> updateSubject(
            @PathVariable Integer subjectId,
            @Valid @RequestBody SubjectRequest request) {

        log.info("PUT /api/subjects/{}", subjectId);

        SubjectResponse updated = subjectService.updateSubject(subjectId, request);

        return ResponseEntity.ok(
                ApiResponse.success("Subject updated successfully.", updated));
    }

    /**
     * 2.5 DELETE /api/subjects/{subjectId}
     * Remove a subject from the system.
     */
    @DeleteMapping("/{subjectId}")
    public ResponseEntity<ApiResponse<Void>> deleteSubject(
            @PathVariable Integer subjectId) {

        log.info("DELETE /api/subjects/{}", subjectId);

        subjectService.deleteSubject(subjectId);

        return ResponseEntity.ok(
                ApiResponse.success("Subject with ID " + subjectId + " has been deleted successfully."));
    }
}