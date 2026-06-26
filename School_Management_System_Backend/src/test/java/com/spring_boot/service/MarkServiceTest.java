package com.spring_boot.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
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
import com.spring_boot.dto.request.MarkRequest;
import com.spring_boot.dto.request.MarkUpdateRequest;
import com.spring_boot.dto.response.MarkResponse;
import com.spring_boot.entity.Exam;
import com.spring_boot.entity.Mark;
import com.spring_boot.entity.Student;
import com.spring_boot.entity.Subject;
import com.spring_boot.exception.DuplicateMarkException;
import com.spring_boot.exception.ResourceNotFoundException;
import com.spring_boot.repository.MarkRepository;
import com.spring_boot.service.impl.MarkServiceImpl;

@ExtendWith(MockitoExtension.class)
@DisplayName("MarkServiceImpl — Unit Tests")
class MarkServiceTest {

    @Mock
    private MarkRepository markRepository;

    @Mock
    private StudentService studentService;

    @Mock
    private SubjectService subjectService;

    @Mock
    private ExamService examService;

    @InjectMocks
    private MarkServiceImpl markService;

    private Student student;
    private Subject subject;
    private Exam    exam;
    private Mark    sampleMark;

    @BeforeEach
    void setUp() {
        student = new Student();
        student.setStudentId(1);
        student.setFirstName("Alice");
        student.setLastName("Smith");
        student.setEnrollmentYear(2022);

        subject = new Subject();
        subject.setSubjectId(1);
        subject.setSubjectName("Mathematics");

        exam = new Exam();
        exam.setExamId(1);
        exam.setExamName("Midterm 2024");
        exam.setExamDate(LocalDate.of(2024, 6, 15));

        sampleMark = new Mark();
        sampleMark.setMarkId(1);
        sampleMark.setStudent(student);
        sampleMark.setSubject(subject);
        sampleMark.setExam(exam);
        sampleMark.setScore(85);
    }

    // ------------------------------------------------------------------
    // getAllMarks
    // ------------------------------------------------------------------

    @Test
    @DisplayName("getAllMarks — returns mapped list with no filters")
    void getAllMarks_noFilters_shouldReturnMappedList() {
        when(markRepository.findWithFilters(null, null, null, null))
                .thenReturn(List.of(sampleMark));

        List<MarkResponse> result = markService.getAllMarks(null, null, null, null);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getScore()).isEqualTo(85);
        assertThat(result.get(0).getStudent().getFullName()).isEqualTo("Alice Smith");
    }

    // ------------------------------------------------------------------
    // getMarkById
    // ------------------------------------------------------------------

    @Test
    @DisplayName("getMarkById — returns mark when found")
    void getMarkById_existingId_shouldReturnMarkResponse() {
        when(markRepository.findByIdWithDetails(1)).thenReturn(Optional.of(sampleMark));

        MarkResponse result = markService.getMarkById(1);

        assertThat(result.getMarkId()).isEqualTo(1);
        assertThat(result.getScore()).isEqualTo(85);
        assertThat(result.getSubject().getSubjectName()).isEqualTo("Mathematics");
    }

    @Test
    @DisplayName("getMarkById — throws ResourceNotFoundException when not found")
    void getMarkById_nonExistingId_shouldThrowResourceNotFoundException() {
        when(markRepository.findByIdWithDetails(999)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> markService.getMarkById(999))
                .isInstanceOf(ResourceNotFoundException.class)
                .satisfies(ex -> {
                    ResourceNotFoundException rnfe = (ResourceNotFoundException) ex;
                    assertThat(rnfe.getErrorCode()).isEqualTo(ErrorCodes.MARK_NOT_FOUND);
                });
    }

    // ------------------------------------------------------------------
    // createMark
    // ------------------------------------------------------------------

    @Test
    @DisplayName("createMark — persists and returns new mark when no duplicate")
    void createMark_noDuplicate_shouldSaveAndReturnResponse() {
        MarkRequest request = new MarkRequest();
        request.setStudentId(1);
        request.setSubjectId(1);
        request.setExamId(1);
        request.setScore(90);

        when(studentService.findStudentOrThrow(1)).thenReturn(student);
        when(subjectService.findSubjectOrThrow(1)).thenReturn(subject);
        when(examService.findExamOrThrow(1)).thenReturn(exam);
        when(markRepository.existsByStudentStudentIdAndSubjectSubjectIdAndExamExamId(1, 1, 1))
                .thenReturn(false);

        Mark savedMark = new Mark();
        savedMark.setMarkId(5);
        savedMark.setStudent(student);
        savedMark.setSubject(subject);
        savedMark.setExam(exam);
        savedMark.setScore(90);

        when(markRepository.save(any(Mark.class))).thenReturn(savedMark);

        MarkResponse result = markService.createMark(request);

        assertThat(result.getMarkId()).isEqualTo(5);
        assertThat(result.getScore()).isEqualTo(90);
        verify(markRepository, times(1)).save(any(Mark.class));
    }

    @Test
    @DisplayName("createMark — throws DuplicateMarkException on duplicate combination")
    void createMark_duplicate_shouldThrowDuplicateMarkException() {
        MarkRequest request = new MarkRequest();
        request.setStudentId(1);
        request.setSubjectId(1);
        request.setExamId(1);
        request.setScore(75);

        when(studentService.findStudentOrThrow(1)).thenReturn(student);
        when(subjectService.findSubjectOrThrow(1)).thenReturn(subject);
        when(examService.findExamOrThrow(1)).thenReturn(exam);
        when(markRepository.existsByStudentStudentIdAndSubjectSubjectIdAndExamExamId(1, 1, 1))
                .thenReturn(true);

        assertThatThrownBy(() -> markService.createMark(request))
                .isInstanceOf(DuplicateMarkException.class)
                .satisfies(ex -> {
                    DuplicateMarkException dme = (DuplicateMarkException) ex;
                    assertThat(dme.getErrorCode()).isEqualTo(ErrorCodes.DUPLICATE_MARK);
                });

        verify(markRepository, never()).save(any());
    }

    // ------------------------------------------------------------------
    // updateMark
    // ------------------------------------------------------------------

    @Test
    @DisplayName("updateMark — updates score and returns updated response")
    void updateMark_validRequest_shouldUpdateScore() {
        when(markRepository.findByIdWithDetails(1)).thenReturn(Optional.of(sampleMark));

        Mark updatedMark = new Mark();
        updatedMark.setMarkId(1);
        updatedMark.setStudent(student);
        updatedMark.setSubject(subject);
        updatedMark.setExam(exam);
        updatedMark.setScore(95);

        when(markRepository.save(any(Mark.class))).thenReturn(updatedMark);

        MarkUpdateRequest updateRequest = new MarkUpdateRequest();
        updateRequest.setScore(95);

        MarkResponse result = markService.updateMark(1, updateRequest);

        assertThat(result.getScore()).isEqualTo(95);
    }

    // ------------------------------------------------------------------
    // deleteMark
    // ------------------------------------------------------------------

    @Test
    @DisplayName("deleteMark — deletes successfully when mark exists")
    void deleteMark_existingId_shouldDelete() {
        when(markRepository.findByIdWithDetails(1)).thenReturn(Optional.of(sampleMark));

        assertThatCode(() -> markService.deleteMark(1)).doesNotThrowAnyException();

        verify(markRepository, times(1)).delete(sampleMark);
    }

    @Test
    @DisplayName("deleteMark — throws ResourceNotFoundException when mark not found")
    void deleteMark_nonExistingId_shouldThrowResourceNotFoundException() {
        when(markRepository.findByIdWithDetails(50)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> markService.deleteMark(50))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(markRepository, never()).delete(any());
    }
}