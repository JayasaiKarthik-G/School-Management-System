package com.spring_boot.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring_boot.constants.ErrorCodes;
import com.spring_boot.dto.request.StudentRequest;
import com.spring_boot.dto.response.StudentResponse;
import com.spring_boot.entity.Student;
import com.spring_boot.exception.ResourceConflictException;
import com.spring_boot.exception.ResourceNotFoundException;
import com.spring_boot.repository.MarkRepository;
import com.spring_boot.repository.StudentRepository;
import com.spring_boot.service.StudentService;

@Service
public class StudentServiceImpl implements StudentService {

    private static final Logger log = LoggerFactory.getLogger(StudentServiceImpl.class);

    private final StudentRepository studentRepository;
    private final MarkRepository markRepository;

    // Constructor Injection (replacing @RequiredArgsConstructor)
    public StudentServiceImpl(StudentRepository studentRepository,
                              MarkRepository markRepository) {
        this.studentRepository = studentRepository;
        this.markRepository = markRepository;
    }

    // ------------------------------------------------------------------
    // GET /api/students
    // ------------------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponse> getAllStudents() {

        log.debug("Fetching all students");

        return studentRepository.findAll()
                .stream()
                .map(this::toStudentResponse)
                .collect(Collectors.toList());
    }

    // ------------------------------------------------------------------
    // GET /api/students/{studentId}
    // ------------------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public StudentResponse getStudentById(Integer studentId) {

        log.debug("Fetching student with ID: {}", studentId);

        return toStudentResponse(findStudentOrThrow(studentId));
    }

    // ------------------------------------------------------------------
    // POST /api/students
    // ------------------------------------------------------------------

    @Override
    @Transactional
    public StudentResponse createStudent(StudentRequest request) {

        String firstName = request.getFirstName().trim();
        String lastName = request.getLastName().trim();

        log.info("Creating new student: {} {}", firstName, lastName);


        if (studentRepository.existsByFirstNameIgnoreCaseAndLastNameIgnoreCase(firstName, lastName)) {
            throw new ResourceConflictException(
                    ErrorCodes.DUPLICATE_STUDENT,
                    "Student with name '" + firstName + " " + lastName + "' already exists."
            );
        }

        Student student = new Student();
        student.setFirstName(firstName);
        student.setLastName(lastName);
        student.setEnrollmentYear(request.getEnrollmentYear());

        Student saved = studentRepository.save(student);

        log.info("Student created with ID: {}", saved.getStudentId());

        return toStudentResponse(saved);
    }

    // ------------------------------------------------------------------
    // PUT /api/students/{studentId}
    // ------------------------------------------------------------------

    @Override
    @Transactional
    public StudentResponse updateStudent(Integer studentId, StudentRequest request) {

        log.info("Updating student with ID: {}", studentId);

        Student student = findStudentOrThrow(studentId);

        String firstName = request.getFirstName().trim();
        String lastName = request.getLastName().trim();


        if (!(student.getFirstName().equalsIgnoreCase(firstName) &&
              student.getLastName().equalsIgnoreCase(lastName)) &&
            studentRepository.existsByFirstNameIgnoreCaseAndLastNameIgnoreCase(firstName, lastName)) {

            throw new ResourceConflictException(
                    ErrorCodes.DUPLICATE_STUDENT,
                    "Another student with same name already exists."
            );
        }

        student.setFirstName(firstName);
        student.setLastName(lastName);
        student.setEnrollmentYear(request.getEnrollmentYear());

        Student updated = studentRepository.save(student);

        log.info("Student updated: ID={}", studentId);

        return toStudentResponse(updated);
    }

    // ------------------------------------------------------------------
    // DELETE /api/students/{studentId}
    // ------------------------------------------------------------------

    @Override
    @Transactional
    public void deleteStudent(Integer studentId) {

        log.info("Attempting to delete student with ID: {}", studentId);

        Student student = findStudentOrThrow(studentId);

        long markCount = markRepository.countByStudentStudentId(studentId);

        if (markCount > 0) {
            throw new ResourceConflictException(
                    ErrorCodes.STUDENT_HAS_MARKS,
                    "Cannot delete Student with ID " + studentId +
                    " — they have " + markCount + " associated mark record(s). " +
                    "Remove all marks for this student first."
            );
        }

        studentRepository.delete(student);

        log.info("Student with ID {} deleted successfully.", studentId);
    }

    // ------------------------------------------------------------------
    // Helper method
    // ------------------------------------------------------------------

    @Override
    public Student findStudentOrThrow(Integer studentId) {

        return studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCodes.STUDENT_NOT_FOUND,
                        "Student with ID " + studentId + " does not exist."
                ));
    }

    // ------------------------------------------------------------------
    // Mapping Method
    // ------------------------------------------------------------------

    private StudentResponse toStudentResponse(Student student) {

        String fullName = student.getFirstName() + " " + student.getLastName();

        return new StudentResponse(
                student.getStudentId(),
                student.getFirstName(),
                student.getLastName(),
                student.getEnrollmentYear(),
                fullName
        );
    }
}