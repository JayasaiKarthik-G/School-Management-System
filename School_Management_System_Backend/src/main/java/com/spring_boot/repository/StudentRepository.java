package com.spring_boot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.spring_boot.entity.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {
    // All standard CRUD operations are inherited from JpaRepository.
    // No custom queries needed for Students at repository level;
    // complex analytics are handled via MarkRepository.
	
	 // Check if student already exists (case-insensitive)
	boolean existsByFirstNameIgnoreCaseAndLastNameIgnoreCase(String firstName, String lastName);
}