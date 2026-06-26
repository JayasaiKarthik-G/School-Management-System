package com.spring_boot.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.spring_boot.dto.response.analytics.ExamSummaryResponse;
import com.spring_boot.dto.response.analytics.SubjectAverageResponse;
import com.spring_boot.entity.Mark;

@Repository
public interface MarkRepository extends JpaRepository<Mark, Integer> {

    // ------------------------------------------------------------------
    // Single-record lookup with joins
    // ------------------------------------------------------------------

    @Query("SELECT m FROM Mark m " +
           "JOIN FETCH m.student " +
           "JOIN FETCH m.subject " +
           "JOIN FETCH m.exam " +
           "WHERE m.markId = :id")
    Optional<Mark> findByIdWithDetails(@Param("id") Integer id);

    // ------------------------------------------------------------------
    // Filter query
    // ------------------------------------------------------------------

    @Query("SELECT m FROM Mark m " +
           "JOIN FETCH m.student " +
           "JOIN FETCH m.subject " +
           "JOIN FETCH m.exam " +
           "WHERE (:studentId IS NULL OR m.student.studentId = :studentId) " +
           "AND (:subjectId IS NULL OR m.subject.subjectId = :subjectId) " +
           "AND (:examId IS NULL OR m.exam.examId = :examId) " +
           "AND (:minScore IS NULL OR m.score >= :minScore)")
    List<Mark> findWithFilters(@Param("studentId") Integer studentId,
                               @Param("subjectId") Integer subjectId,
                               @Param("examId") Integer examId,
                               @Param("minScore") Integer minScore);

    // ------------------------------------------------------------------
    // Duplicate check
    // ------------------------------------------------------------------

    boolean existsByStudentStudentIdAndSubjectSubjectIdAndExamExamId(
            Integer studentId, Integer subjectId, Integer examId);

    // ------------------------------------------------------------------
    // Count methods
    // ------------------------------------------------------------------

    long countByStudentStudentId(Integer studentId);

    long countBySubjectSubjectId(Integer subjectId);

    long countByExamExamId(Integer examId);

    // ------------------------------------------------------------------
    // Student analytics
    // ------------------------------------------------------------------

    @Query("SELECT m FROM Mark m " +
           "JOIN FETCH m.subject " +
           "JOIN FETCH m.exam " +
           "WHERE m.student.studentId = :studentId " +
           "ORDER BY m.exam.examDate ASC, m.subject.subjectName ASC")
    List<Mark> findByStudentIdWithDetails(@Param("studentId") Integer studentId);

    @Query("SELECT m FROM Mark m " +
           "JOIN FETCH m.subject " +
           "WHERE m.student.studentId = :studentId " +
           "AND m.exam.examId = :examId")
    List<Mark> findByStudentIdAndExamId(@Param("studentId") Integer studentId,
                                        @Param("examId") Integer examId);

    // ------------------------------------------------------------------
    // Exam analytics
    // ------------------------------------------------------------------

    @Query("SELECT m FROM Mark m " +
           "JOIN FETCH m.student " +
           "JOIN FETCH m.subject " +
           "WHERE m.exam.examId = :examId " +
           "ORDER BY m.student.studentId ASC")
    List<Mark> findByExamIdWithDetails(@Param("examId") Integer examId);

    // ------------------------------------------------------------------
    // Subject aggregates (DTO)
    // ------------------------------------------------------------------

    @Query("SELECT new com.spring_boot.dto.response.analytics.SubjectAverageResponse(" +
    	       "m.subject.subjectId, m.subject.subjectName, " +
    	       "AVG(m.score), COUNT(m), MAX(m.score), MIN(m.score)) " +
    	       "FROM Mark m " +
    	       "GROUP BY m.subject.subjectId, m.subject.subjectName " +
    	       "ORDER BY m.subject.subjectName ASC")
    	List<SubjectAverageResponse> findSubjectAverage();

    // ------------------------------------------------------------------
    // Top performers
    // ------------------------------------------------------------------

    @Query("SELECT m FROM Mark m " +
    	       "JOIN FETCH m.student " +
    	       "JOIN FETCH m.subject " +
    	       "JOIN FETCH m.exam " +
    	       "WHERE (:examId IS NULL OR m.exam.examId = :examId) " +
    	       "ORDER BY m.score DESC")
    	List<Mark> findTopPerformers(@Param("examId") Integer examId, Pageable pageable);
    // ------------------------------------------------------------------
    // Leader board
    // ------------------------------------------------------------------

    @Query("SELECT m.student.studentId, m.student.firstName, m.student.lastName, " +
    	       "SUM(m.score), COUNT(m) " +
    	       "FROM Mark m " +
    	       "WHERE m.exam.examId = :examId " +
    	       "GROUP BY m.student.studentId, m.student.firstName, m.student.lastName " +
    	       "ORDER BY SUM(m.score) DESC")
    	List<Object[]> findLeaderboardByExamId(@Param("examId") Integer examId);
    // ------------------------------------------------------------------
    // Exam summary
    // ------------------------------------------------------------------

	@Query("SELECT new com.spring_boot.dto.response.analytics.ExamSummaryResponse(" +
		       "m.exam.examId, m.exam.examName, m.exam.examDate, " +
		       "SUM(m.score), COUNT(DISTINCT m.student.studentId)) " +
		       "FROM Mark m " +
		       "GROUP BY m.exam.examId, m.exam.examName, m.exam.examDate " +
		       "HAVING SUM(m.score) >= :minTotalScore " +
		       "ORDER BY SUM(m.score) DESC")
		List<ExamSummaryResponse> findExamSummary(@Param("minTotalScore") Integer minTotalScore);

    // ------------------------------------------------------------------
    // Subject averages for student
    // ------------------------------------------------------------------

    @Query("SELECT m.subject.subjectName, AVG(m.score) " +
           "FROM Mark m " +
           "WHERE m.student.studentId = :studentId " +
           "AND (:examId IS NULL OR m.exam.examId = :examId) " +
           "GROUP BY m.subject.subjectId, m.subject.subjectName " +
           "ORDER BY m.subject.subjectName ASC")
    List<Object[]> findSubjectAveragesForStudent(@Param("studentId") Integer studentId,
                                                 @Param("examId") Integer examId);

    // ------------------------------------------------------------------
    // Student trend
    // ------------------------------------------------------------------

    @Query("SELECT m FROM Mark m " +
           "JOIN FETCH m.exam " +
           "JOIN FETCH m.subject " +
           "WHERE m.student.studentId = :studentId " +
           "AND (:subjectId IS NULL OR m.subject.subjectId = :subjectId) " +
           "ORDER BY m.exam.examDate ASC")
    List<Mark> findStudentTrend(@Param("studentId") Integer studentId,
                                @Param("subjectId") Integer subjectId);
}