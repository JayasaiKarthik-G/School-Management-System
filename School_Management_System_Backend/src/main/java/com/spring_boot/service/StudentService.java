package com.spring_boot.service;

import java.util.List;

import com.spring_boot.dto.request.StudentRequest;
import com.spring_boot.dto.response.StudentResponse;
import com.spring_boot.entity.Student;

/**
 * Contract for student CRUD operations.
 * Implemented by {@link com.codegnan.schoolms.service.impl.StudentServiceImpl}.
 */
public interface StudentService {

    /**
     * Returns all students in the system.
     *
     * @return list of student response DTOs
     */
    List<StudentResponse> getAllStudents();

    /**
     * Retrieves a single student by primary key.
     *
     * @param studentId the student's ID
     * @return student response DTO
     * @throws com.codegnan.schoolms.exception.ResourceNotFoundException if not found
     */
    StudentResponse getStudentById(Integer studentId);

    /**
     * Creates and persists a new student record.
     *
     * @param request validated in bound pay load
     * @return the created student as a response DTO
     */
    StudentResponse createStudent(StudentRequest request);

    /**
     * Updates an existing student record.
     *
     * @param studentId the student's ID
     * @param request   validated in bound pay load
     * @return the updated student as a response DTO
     * @throws com.codegnan.schoolms.exception.ResourceNotFoundException if not found
     */
    StudentResponse updateStudent(Integer studentId, StudentRequest request);

    /**
     * Deletes a student record.
     *
     * @param studentId the student's ID
     * @throws com.codegnan.schoolms.exception.ResourceNotFoundException  if not found
     * @throws com.codegnan.schoolms.exception.ResourceConflictException if the student has associated marks
     */
    void deleteStudent(Integer studentId);

    /**
     * Retrieves the {@link Student} JPA entity or throws if absent.
     * Shared with MarkService, PerformanceService, and ReportService.
     *
     * @param studentId the student's ID
     * @return the found entity
     * @throws com.codegnan.schoolms.exception.ResourceNotFoundException if not found
     */
    Student findStudentOrThrow(Integer studentId);
}