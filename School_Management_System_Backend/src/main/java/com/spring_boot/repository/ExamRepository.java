package com.spring_boot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.spring_boot.entity.Exam;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Integer> {

    /**
     * Returns all exams ordered by exam date descending (most recent first).
     * Used when the caller requests ?sort=date on GET /api/exams.
     */
    List<Exam> findAllByOrderByExamDateDesc();
}