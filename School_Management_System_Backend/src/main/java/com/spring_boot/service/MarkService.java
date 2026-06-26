package com.spring_boot.service;

import java.util.List;

import com.spring_boot.dto.request.MarkRequest;
import com.spring_boot.dto.request.MarkUpdateRequest;
import com.spring_boot.dto.response.MarkResponse;
import com.spring_boot.entity.Mark;

/**
 * Contract for mark CRUD operations.
 * Implemented by {@link com.codegnan.schoolms.service.impl.MarkServiceImpl}.
 */
public interface MarkService {

    /**
     * Returns all mark records, filtered by any combination of optional criteria.
     *
     * @param studentId optional filter by student ID
     * @param subjectId optional filter by subject ID
     * @param examId    optional filter by exam ID
     * @param minScore  optional minimum score (inclusive)
     * @return list of mark response DTOs
     */
    List<MarkResponse> getAllMarks(Integer studentId, Integer subjectId,
                                   Integer examId, Integer minScore);

    /**
     * Retrieves a single mark by primary key.
     *
     * @param markId the mark's ID
     * @return mark response DTO
     * @throws com.codegnan.schoolms.exception.ResourceNotFoundException if not found
     */
    MarkResponse getMarkById(Integer markId);

    /**
     * Records a new mark for a student-subject-exam combination.
     *
     * @param request validated in bound pay load
     * @return the created mark as a response DTO
     * @throws com.codegnan.schoolms.exception.ResourceNotFoundException if any referenced entity does not exist
     * @throws com.codegnan.schoolms.exception.DuplicateMarkException    if the combination already has a mark
     */
    MarkResponse createMark(MarkRequest request);

    /**
     * Corrects the score on an existing mark record.
     *
     * @param markId  the mark's ID
     * @param request validated in bound pay load containing the new score
     * @return the updated mark as a response DTO
     * @throws com.codegnan.schoolms.exception.ResourceNotFoundException if not found
     */
    MarkResponse updateMark(Integer markId, MarkUpdateRequest request);

    /**
     * Deletes a mark record.
     *
     * @param markId the mark's ID
     * @throws com.codegnan.schoolms.exception.ResourceNotFoundException if not found
     */
    void deleteMark(Integer markId);

    /**
     * Retrieves the {@link Mark} JPA entity (with eagerly loaded associations) or throws if absent.
     *
     * @param markId the mark's ID
     * @return the found entity
     * @throws com.codegnan.schoolms.exception.ResourceNotFoundException if not found
     */
    Mark findMarkOrThrow(Integer markId);
}