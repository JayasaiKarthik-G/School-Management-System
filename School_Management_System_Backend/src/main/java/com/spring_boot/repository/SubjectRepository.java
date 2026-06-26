package com.spring_boot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.spring_boot.entity.Subject;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Integer> {
    // Standard CRUD operations inherited from JpaRepository.
	
}