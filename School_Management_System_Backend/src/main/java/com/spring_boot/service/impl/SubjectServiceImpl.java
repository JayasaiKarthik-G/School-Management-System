package com.spring_boot.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring_boot.constants.ErrorCodes;
import com.spring_boot.dto.request.SubjectRequest;
import com.spring_boot.dto.response.SubjectResponse;
import com.spring_boot.entity.Subject;
import com.spring_boot.exception.ResourceConflictException;
import com.spring_boot.exception.ResourceNotFoundException;
import com.spring_boot.repository.MarkRepository;
import com.spring_boot.repository.SubjectRepository;
import com.spring_boot.service.SubjectService;

@Service
public class SubjectServiceImpl implements SubjectService {

    private static final Logger log = LoggerFactory.getLogger(SubjectServiceImpl.class);

    private final SubjectRepository subjectRepository;
    private final MarkRepository markRepository;

    // Constructor Injection (replacing @RequiredArgsConstructor)
    public SubjectServiceImpl(SubjectRepository subjectRepository,
                              MarkRepository markRepository) {
        this.subjectRepository = subjectRepository;
        this.markRepository = markRepository;
    }

    // ------------------------------------------------------------------
    // GET /api/subjects
    // ------------------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public List<SubjectResponse> getAllSubjects() {

        log.debug("Fetching all subjects");

        return subjectRepository.findAll()
                .stream()
                .map(this::toSubjectResponse)
                .collect(Collectors.toList());
    }

    // ------------------------------------------------------------------
    // GET /api/subjects/{subjectId}
    // ------------------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public SubjectResponse getSubjectById(Integer subjectId) {

        log.debug("Fetching subject with ID: {}", subjectId);

        return toSubjectResponse(findSubjectOrThrow(subjectId));
    }

    // ------------------------------------------------------------------
    // POST /api/subjects
    // ------------------------------------------------------------------

    @Override
    @Transactional
    public SubjectResponse createSubject(SubjectRequest request) {

        log.info("Creating new subject: {}", request.getSubjectName());

        Subject subject = new Subject();
        subject.setSubjectName(request.getSubjectName().trim());

        Subject saved = subjectRepository.save(subject);

        log.info("Subject created with ID: {}", saved.getSubjectId());

        return toSubjectResponse(saved);
    }

    // ------------------------------------------------------------------
    // PUT /api/subjects/{subjectId}
    // ------------------------------------------------------------------

    @Override
    @Transactional
    public SubjectResponse updateSubject(Integer subjectId, SubjectRequest request) {

        log.info("Updating subject with ID: {}", subjectId);

        Subject subject = findSubjectOrThrow(subjectId);

        subject.setSubjectName(request.getSubjectName().trim());

        Subject updated = subjectRepository.save(subject);

        log.info("Subject updated: ID={}", subjectId);

        return toSubjectResponse(updated);
    }

    // ------------------------------------------------------------------
    // DELETE /api/subjects/{subjectId}
    // ------------------------------------------------------------------

    @Override
    @Transactional
    public void deleteSubject(Integer subjectId) {

        log.info("Attempting to delete subject with ID: {}", subjectId);

        Subject subject = findSubjectOrThrow(subjectId);

        long markCount = markRepository.countBySubjectSubjectId(subjectId);

        if (markCount > 0) {
            throw new ResourceConflictException(
                    ErrorCodes.SUBJECT_HAS_MARKS,
                    "Cannot delete Subject with ID " + subjectId +
                    " — it has " + markCount + " associated mark record(s). " +
                    "Remove all marks for this subject first."
            );
        }

        subjectRepository.delete(subject);

        log.info("Subject with ID {} deleted successfully.", subjectId);
    }

    // ------------------------------------------------------------------
    // Helper method
    // ------------------------------------------------------------------

    @Override
    public Subject findSubjectOrThrow(Integer subjectId) {

        return subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCodes.SUBJECT_NOT_FOUND,
                        "Subject with ID " + subjectId + " does not exist."
                ));
    }

    // ------------------------------------------------------------------
    // Mapping Method
    // ------------------------------------------------------------------

    private SubjectResponse toSubjectResponse(Subject subject) {

        return new SubjectResponse(
                subject.getSubjectId(),
                subject.getSubjectName()
        );
    }
}