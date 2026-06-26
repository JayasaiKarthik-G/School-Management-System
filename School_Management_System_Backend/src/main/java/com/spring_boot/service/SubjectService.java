package com.spring_boot.service;

import java.util.List;

import com.spring_boot.dto.request.SubjectRequest;
import com.spring_boot.dto.response.SubjectResponse;
import com.spring_boot.entity.Subject;

/**
 * Contract for subject CRUD operations.
 * Implemented by {@link com.codegnan.schoolms.service.impl.SubjectServiceImpl}.
 */
public interface SubjectService {

    /**
     * Returns all subjects in the system.
     *
     * @return list of subject response DTOs
     */
    List<SubjectResponse> getAllSubjects();

    /**
     * Retrieves a single subject by primary key.
     *
     * @param subjectId the subject's ID
     * @return subject response DTO
     * @throws com.codegnan.schoolms.exception.ResourceNotFoundException if not found
     */
    SubjectResponse getSubjectById(Integer subjectId);

    /**
     * Creates and persists a new subject record.
     *
     * @param request validated inbound payload
     * @return the created subject as a response DTO
     */
    SubjectResponse createSubject(SubjectRequest request);

    /**
     * Updates an existing subject record.
     *
     * @param subjectId the subject's ID
     * @param request   validated inbound payload
     * @return the updated subject as a response DTO
     * @throws com.codegnan.schoolms.exception.ResourceNotFoundException if not found
     */
    SubjectResponse updateSubject(Integer subjectId, SubjectRequest request);

    /**
     * Deletes a subject record.
     *
     * @param subjectId the subject's ID
     * @throws com.codegnan.schoolms.exception.ResourceNotFoundException  if not found
     * @throws com.codegnan.schoolms.exception.ResourceConflictException if the subject has associated marks
     */
    void deleteSubject(Integer subjectId);

    /**
     * Retrieves the {@link Subject} JPA entity or throws if absent.
     * Shared with MarkService.
     *
     * @param subjectId the subject's ID
     * @return the found entity
     * @throws com.codegnan.schoolms.exception.ResourceNotFoundException if not found
     */
    Subject findSubjectOrThrow(Integer subjectId);
}