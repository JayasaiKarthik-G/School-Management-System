package com.spring_boot.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring_boot.constants.ErrorCodes;
import com.spring_boot.dto.request.ExamRequest;
import com.spring_boot.dto.response.ExamResponse;
import com.spring_boot.entity.Exam;
import com.spring_boot.exception.ResourceConflictException;
import com.spring_boot.exception.ResourceNotFoundException;
import com.spring_boot.repository.ExamRepository;
import com.spring_boot.repository.MarkRepository;
import com.spring_boot.service.ExamService;

@Service
public class ExamServiceImpl implements ExamService {

    private static final Logger log = LoggerFactory.getLogger(ExamServiceImpl.class);

    private final ExamRepository examRepository;
    private final MarkRepository markRepository;

    // Constructor Injection (replacing @RequiredArgsConstructor)
    public ExamServiceImpl(ExamRepository examRepository, MarkRepository markRepository) {
        this.examRepository = examRepository;
        this.markRepository = markRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamResponse> getAllExams(boolean sortByDate) {
        log.debug("Fetching all exams, sortByDate={}", sortByDate);

        List<Exam> exams = sortByDate
                ? examRepository.findAllByOrderByExamDateDesc()
                : examRepository.findAll();

        return exams.stream()
                .map(this::toExamResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ExamResponse getExamById(Integer examId) {
        log.debug("Fetching exam with ID: {}", examId);
        return toExamResponse(findExamOrThrow(examId));
    }

    @Override
    @Transactional
    public ExamResponse createExam(ExamRequest request) {
        log.info("Creating new exam: {} on {}", request.getExamName(), request.getExamDate());

        Exam exam = new Exam();
        exam.setExamName(request.getExamName().trim());
        exam.setExamDate(request.getExamDate());

        Exam saved = examRepository.save(exam);

        log.info("Exam created with ID: {}", saved.getExamId());
        return toExamResponse(saved);
    }

    @Override
    @Transactional
    public ExamResponse updateExam(Integer examId, ExamRequest request) {
        log.info("Updating exam with ID: {}", examId);

        Exam exam = findExamOrThrow(examId);
        exam.setExamName(request.getExamName().trim());
        exam.setExamDate(request.getExamDate());

        Exam updated = examRepository.save(exam);

        log.info("Exam updated: ID={}", examId);
        return toExamResponse(updated);
    }

    @Override
    @Transactional
    public void deleteExam(Integer examId) {
        log.info("Attempting to delete exam with ID: {}", examId);

        Exam exam = findExamOrThrow(examId);

        long markCount = markRepository.countByExamExamId(examId);

        if (markCount > 0) {
            throw new ResourceConflictException(
                    ErrorCodes.EXAM_HAS_MARKS,
                    "Cannot delete Exam with ID " + examId +
                    " — it has " + markCount + " associated mark record(s). " +
                    "Remove all marks for this exam first.");
        }

        examRepository.delete(exam);

        log.info("Exam with ID {} deleted successfully.", examId);
    }

    @Override
    public Exam findExamOrThrow(Integer examId) {
        return examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCodes.EXAM_NOT_FOUND,
                        "Exam with ID " + examId + " does not exist."));
    }

    // ------------------------------------------------------------------
    // Private mapping helper
    // ------------------------------------------------------------------

    private ExamResponse toExamResponse(Exam exam) {
        return new ExamResponse(
                exam.getExamId(),
                exam.getExamName(),
                exam.getExamDate()
        );
    }
}