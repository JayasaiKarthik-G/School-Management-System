package com.spring_boot.service.impl;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring_boot.dto.response.analytics.ExamSummaryResponse;
import com.spring_boot.dto.response.analytics.PassFailReportResponse;
import com.spring_boot.dto.response.analytics.StudentExamScoresResponse;
import com.spring_boot.dto.response.analytics.StudentFullPerformanceResponse;
import com.spring_boot.dto.response.analytics.SubjectAverageResponse;
import com.spring_boot.dto.response.analytics.TopPerformerResponse;
import com.spring_boot.entity.Exam;
import com.spring_boot.entity.Mark;
import com.spring_boot.entity.Student;
import com.spring_boot.repository.MarkRepository;
import com.spring_boot.service.ExamService;
import com.spring_boot.service.PerformanceService;
import com.spring_boot.service.StudentService;

@Service
public class PerformanceServiceImpl implements PerformanceService {

    private static final Logger log =
            LoggerFactory.getLogger(PerformanceServiceImpl.class);

    private static final int DEFAULT_PASS_THRESHOLD = 70;

    private final MarkRepository markRepository;
    private final StudentService studentService;
    private final ExamService examService;

    // Constructor Injection
    public PerformanceServiceImpl(MarkRepository markRepository,
                                 StudentService studentService,
                                 ExamService examService) {
        this.markRepository = markRepository;
        this.studentService = studentService;
        this.examService = examService;
    }

    // =========================================================
    // 5.1 Full Performance Report
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public StudentFullPerformanceResponse getFullPerformanceReport(Integer studentId) {

        log.debug("Building full performance report for student ID: {}", studentId);

        Student student = studentService.findStudentOrThrow(studentId);
        List<Mark> marks = markRepository.findByStudentIdWithDetails(studentId);

        Map<Integer, List<Mark>> marksByExam = new LinkedHashMap<>();
        for (Mark mark : marks) {
            marksByExam
                .computeIfAbsent(mark.getExam().getExamId(), k -> new ArrayList<>())
                .add(mark);
        }

        List<StudentFullPerformanceResponse.ExamPerformance> examPerformances = new ArrayList<>();
        int totalScore = 0;
        int totalCount = 0;

        for (List<Mark> examMarks : marksByExam.values()) {

            Exam exam = examMarks.get(0).getExam();

            List<StudentFullPerformanceResponse.SubjectScore> subjectScores =
                    examMarks.stream()
                            .map(m -> new StudentFullPerformanceResponse.SubjectScore(
                                    m.getSubject().getSubjectName(),
                                    m.getScore(),
                                    m.getScore() >= DEFAULT_PASS_THRESHOLD ? "Pass" : "Fail"))
                            .collect(Collectors.toList());

            int examTotal = examMarks.stream().mapToInt(Mark::getScore).sum();
            double examAvg = round2((double) examTotal / examMarks.size());

            totalScore += examTotal;
            totalCount += examMarks.size();

            examPerformances.add(new StudentFullPerformanceResponse.ExamPerformance(
                    exam.getExamId(),
                    exam.getExamName(),
                    exam.getExamDate().toString(),
                    subjectScores,
                    examTotal,
                    examAvg
            ));
        }

        double overallAvg = totalCount > 0
                ? round2((double) totalScore / totalCount)
                : 0.0;

        return new StudentFullPerformanceResponse(
                new StudentFullPerformanceResponse.StudentDetail(
                        student.getStudentId(),
                        student.getFirstName() + " " + student.getLastName(),
                        student.getEnrollmentYear()
                ),
                overallAvg,
                marksByExam.size(),
                examPerformances
        );
    }

    // =========================================================
    // 5.2 Student Performance in Specific Exam
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public StudentExamScoresResponse getStudentPerformanceInExam(Integer studentId, Integer examId) {

        log.debug("Fetching performance for student {} in exam {}", studentId, examId);

        Student student = studentService.findStudentOrThrow(studentId);
        Exam exam = examService.findExamOrThrow(examId);

        List<Mark> marks = markRepository.findByStudentIdAndExamId(studentId, examId);

        List<StudentExamScoresResponse.SubjectScore> scores =
                marks.stream()
                        .map(m -> new StudentExamScoresResponse.SubjectScore(
                                m.getSubject().getSubjectName(),
                                m.getScore(),
                                m.getScore() >= DEFAULT_PASS_THRESHOLD ? "Pass" : "Fail"))
                        .collect(Collectors.toList());

        int totalScore = marks.stream().mapToInt(Mark::getScore).sum();
        double avgScore = marks.isEmpty() ? 0.0 : round2((double) totalScore / marks.size());

        return new StudentExamScoresResponse(
                new StudentExamScoresResponse.StudentRef(
                        student.getStudentId(),
                        student.getFirstName() + " " + student.getLastName()
                ),
                new StudentExamScoresResponse.ExamRef(
                        exam.getExamId(),
                        exam.getExamName(),
                        exam.getExamDate().toString()
                ),
                scores,
                totalScore,
                avgScore
        );
    }

    // =========================================================
    // 5.3 Subject Averages
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<SubjectAverageResponse> getSubjectAverages() {

        log.debug("Fetching subject averages");

        return markRepository.findSubjectAverage();
    }

    // =========================================================
    // 5.4 Top Performers
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<TopPerformerResponse> getTopPerformers(Integer limit, Integer examId) {

        int effectiveLimit = (limit != null && limit > 0) ? limit : 5;

        log.debug("Fetching top {} performers", effectiveLimit);

        List<Mark> marks = markRepository.findTopPerformers(
        		examId, PageRequest.of(0, effectiveLimit));

        List<TopPerformerResponse> result = new ArrayList<>();

        for (int i = 0; i < marks.size(); i++) {

            Mark m = marks.get(i);

            String fullName = m.getStudent().getFirstName() + " " + 
            						m.getStudent().getLastName();

            TopPerformerResponse response = new TopPerformerResponse(
                    i + 1,
                    new TopPerformerResponse.StudentRef(
                            m.getStudent().getStudentId(),
                            fullName
                    ),
                    new TopPerformerResponse.ExamRef(
                            m.getExam().getExamName()
                    ),
                    new TopPerformerResponse.SubjectRef(
                            m.getSubject().getSubjectName()
                    ),
                    m.getScore()
            );

            result.add(response);
        }

        return result;
    }

    // =========================================================
    // 5.5 Pass/Fail Report
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public PassFailReportResponse getPassFailReport(Integer examId, Integer passThreshold) {

        int threshold = (passThreshold != null && passThreshold >= 0)
                ? passThreshold : DEFAULT_PASS_THRESHOLD;

        log.debug("Generating pass/fail report for exam {}", examId);

        Exam exam = examService.findExamOrThrow(examId);
        List<Mark> marks = markRepository.findByExamIdWithDetails(examId);

        Map<Integer, List<Mark>> marksByStudent = new LinkedHashMap<>();

        for (Mark mark : marks) {
            marksByStudent
                .computeIfAbsent(mark.getStudent().getStudentId(), k -> new ArrayList<>())
                .add(mark);
        }

        List<PassFailReportResponse.StudentResult> results = new ArrayList<>();
        int passedCount = 0;

        for (List<Mark> studentMarks : marksByStudent.values()) {

            Student student = studentMarks.get(0).getStudent();

            List<PassFailReportResponse.SubjectResult> subjectResults =
                    studentMarks.stream()
                            .map(m -> new PassFailReportResponse.SubjectResult(
                                    m.getSubject().getSubjectName(),
                                    m.getScore(),
                                    m.getScore() >= threshold ? "Pass" : "Fail"))
                            .collect(Collectors.toList());

            boolean allPassed = subjectResults.stream()
                    .allMatch(s -> "Pass".equals(s.getStatus()));

            if (allPassed) passedCount++;

            results.add(new PassFailReportResponse.StudentResult(
                    new PassFailReportResponse.StudentRef(
                            student.getStudentId(),
                            student.getFirstName() + " " + student.getLastName()
                    ),
                    subjectResults,
                    allPassed ? "Pass" : "Fail"
            ));
        }

        int totalStudents = results.size();
        int failedCount = totalStudents - passedCount;

        double passPercentage = totalStudents > 0
                ? round2((passedCount * 100.0) / totalStudents)
                : 0.0;

        return new PassFailReportResponse(
                new PassFailReportResponse.ExamRef(
                        exam.getExamId(),
                        exam.getExamName(),
                        exam.getExamDate().toString()
                ),
                threshold,
                new PassFailReportResponse.Summary(
                        totalStudents,
                        passedCount,
                        failedCount,
                        passPercentage
                ),
                results
        );
    }

    
    // =========================================================
    // 5.6 Exam Summary
    // =========================================================
    
    @Override
    @Transactional(readOnly = true)
    public List<ExamSummaryResponse> getExamSummary(Integer minTotalScore) {

        int threshold = (minTotalScore != null && minTotalScore >= 0) ? minTotalScore : 0;

        log.debug("Building exam summary with minTotalScore={}", threshold);

        return markRepository.findExamSummary(threshold);
    }
    
    
    // =========================================================
    // Utility
    // =========================================================

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}