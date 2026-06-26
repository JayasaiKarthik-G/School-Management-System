package com.spring_boot.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.spring_boot.constants.ErrorCodes;
import com.spring_boot.dto.request.StudentRequest;
import com.spring_boot.dto.response.StudentResponse;
import com.spring_boot.entity.Student;
import com.spring_boot.exception.ResourceConflictException;
import com.spring_boot.exception.ResourceNotFoundException;
import com.spring_boot.repository.MarkRepository;
import com.spring_boot.repository.StudentRepository;
import com.spring_boot.service.impl.StudentServiceImpl;

@ExtendWith(MockitoExtension.class)
@DisplayName("StudentServiceImpl — Unit Tests")
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private MarkRepository markRepository;

    @InjectMocks
    private StudentServiceImpl studentService;

    private Student sampleStudent;

    @BeforeEach
    void setUp() {
        sampleStudent = new Student();
        sampleStudent.setStudentId(1);
        sampleStudent.setFirstName("Alice");
        sampleStudent.setLastName("Smith");
        sampleStudent.setEnrollmentYear(2022);
    }

    // ------------------------------------------------------------------
    // getAllStudents
    // ------------------------------------------------------------------

    @Test
    @DisplayName("getAllStudents — returns mapped response list")
    void getAllStudents_shouldReturnMappedResponses() {
        when(studentRepository.findAll()).thenReturn(List.of(sampleStudent));

        List<StudentResponse> result = studentService.getAllStudents();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getFirstName()).isEqualTo("Alice");
        assertThat(result.get(0).getFullName()).isEqualTo("Alice Smith");
        verify(studentRepository, times(1)).findAll();
    }

    // ------------------------------------------------------------------
    // getStudentById
    // ------------------------------------------------------------------

    @Test
    @DisplayName("getStudentById — returns student when found")
    void getStudentById_existingId_shouldReturnStudentResponse() {
        when(studentRepository.findById(1)).thenReturn(Optional.of(sampleStudent));

        StudentResponse result = studentService.getStudentById(1);

        assertThat(result.getStudentId()).isEqualTo(1);
        assertThat(result.getLastName()).isEqualTo("Smith");
    }

    @Test
    @DisplayName("getStudentById — throws ResourceNotFoundException when not found")
    void getStudentById_nonExistingId_shouldThrowResourceNotFoundException() {
        when(studentRepository.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> studentService.getStudentById(99))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    // ------------------------------------------------------------------
    // createStudent
    // ------------------------------------------------------------------

    @Test
    @DisplayName("createStudent — persists and returns new student")
    void createStudent_validRequest_shouldSaveAndReturnResponse() {
        StudentRequest request = new StudentRequest();
        request.setFirstName("Bob");
        request.setLastName("Jones");
        request.setEnrollmentYear(2023);

        Student savedStudent = new Student();
        savedStudent.setStudentId(2);
        savedStudent.setFirstName("Bob");
        savedStudent.setLastName("Jones");
        savedStudent.setEnrollmentYear(2023);

        when(studentRepository.save(any(Student.class))).thenReturn(savedStudent);

        StudentResponse result = studentService.createStudent(request);

        assertThat(result.getStudentId()).isEqualTo(2);
        assertThat(result.getFirstName()).isEqualTo("Bob");
        assertThat(result.getFullName()).isEqualTo("Bob Jones");
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    // ------------------------------------------------------------------
    // updateStudent
    // ------------------------------------------------------------------

    @Test
    @DisplayName("updateStudent — updates fields and returns updated response")
    void updateStudent_validRequest_shouldUpdateAndReturn() {
        when(studentRepository.findById(1)).thenReturn(Optional.of(sampleStudent));

        Student updated = new Student();
        updated.setStudentId(1);
        updated.setFirstName("Alicia");
        updated.setLastName("Smith");
        updated.setEnrollmentYear(2022);

        when(studentRepository.save(any(Student.class))).thenReturn(updated);

        StudentRequest request = new StudentRequest();
        request.setFirstName("Alicia");
        request.setLastName("Smith");
        request.setEnrollmentYear(2022);

        StudentResponse result = studentService.updateStudent(1, request);

        assertThat(result.getFirstName()).isEqualTo("Alicia");
        assertThat(result.getFullName()).isEqualTo("Alicia Smith");
    }

    // ------------------------------------------------------------------
    // deleteStudent
    // ------------------------------------------------------------------

    @Test
    @DisplayName("deleteStudent — deletes successfully when student has no marks")
    void deleteStudent_noMarks_shouldDelete() {
        when(studentRepository.findById(1)).thenReturn(Optional.of(sampleStudent));
        when(markRepository.countByStudentStudentId(1)).thenReturn(0L);

        assertThatCode(() -> studentService.deleteStudent(1)).doesNotThrowAnyException();

        verify(studentRepository, times(1)).delete(sampleStudent);
    }

    @Test
    @DisplayName("deleteStudent — throws ResourceConflictException when student has marks")
    void deleteStudent_hasMarks_shouldThrowResourceConflictException() {
        when(studentRepository.findById(1)).thenReturn(Optional.of(sampleStudent));
        when(markRepository.countByStudentStudentId(1)).thenReturn(3L);

        assertThatThrownBy(() -> studentService.deleteStudent(1))
                .isInstanceOf(ResourceConflictException.class)
                .satisfies(ex -> {
                    ResourceConflictException rce = (ResourceConflictException) ex;
                    assertThat(rce.getErrorCode()).isEqualTo(ErrorCodes.STUDENT_HAS_MARKS);
                });

        verify(studentRepository, never()).delete(any());
    }

    // ------------------------------------------------------------------
    // findStudentOrThrow
    // ------------------------------------------------------------------

    @Test
    @DisplayName("findStudentOrThrow — returns entity when found")
    void findStudentOrThrow_existingId_shouldReturnEntity() {
        when(studentRepository.findById(1)).thenReturn(Optional.of(sampleStudent));

        Student result = studentService.findStudentOrThrow(1);

        assertThat(result.getFirstName()).isEqualTo("Alice");
    }

    @Test
    @DisplayName("findStudentOrThrow — throws with correct error code when missing")
    void findStudentOrThrow_nonExistingId_shouldThrowWithCorrectErrorCode() {
        when(studentRepository.findById(42)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> studentService.findStudentOrThrow(42))
                .isInstanceOf(ResourceNotFoundException.class)
                .satisfies(ex -> {
                    ResourceNotFoundException rnfe = (ResourceNotFoundException) ex;
                    assertThat(rnfe.getErrorCode()).isEqualTo(ErrorCodes.STUDENT_NOT_FOUND);
                });
    }
}