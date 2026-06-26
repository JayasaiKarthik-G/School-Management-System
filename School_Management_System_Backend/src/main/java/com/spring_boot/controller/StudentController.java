package com.spring_boot.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring_boot.dto.request.StudentRequest;
import com.spring_boot.dto.response.ApiResponse;
import com.spring_boot.dto.response.StudentResponse;
import com.spring_boot.service.StudentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private static final Logger log = LoggerFactory.getLogger(StudentController.class);

    private final StudentService studentService;

    // Constructor Injection (replacing @RequiredArgsConstructor)
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

   
    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentResponse>>> getAllStudents() {

        log.info("GET /api/students");

        List<StudentResponse> students = studentService.getAllStudents();
        return ResponseEntity.ok(ApiResponse.success(students, students.size()));
    }

   
    @GetMapping("/{studentId}")
    public ResponseEntity<ApiResponse<StudentResponse>> getStudentById(
            @PathVariable Integer studentId) {

        log.info("GET /api/students/{}", studentId);

        StudentResponse student = studentService.getStudentById(studentId);
        return ResponseEntity.ok(ApiResponse.success(student));
    }

   
    @PostMapping
    public ResponseEntity<ApiResponse<StudentResponse>> createStudent(
            @Valid @RequestBody StudentRequest request) {

        log.info("POST /api/students");

        StudentResponse created = studentService.createStudent(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Student created successfully.", created));
    }

    
    @PutMapping("/{studentId}")
    public ResponseEntity<ApiResponse<StudentResponse>> updateStudent(
            @PathVariable Integer studentId,
            @Valid @RequestBody StudentRequest request) {

        log.info("PUT /api/students/{}", studentId);

        StudentResponse updated = studentService.updateStudent(studentId, request);

        return ResponseEntity.ok(ApiResponse.success("Student updated successfully.", updated));
    }

   
    @DeleteMapping("/{studentId}")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(
            @PathVariable Integer studentId) {

        log.info("DELETE /api/students/{}", studentId);

        studentService.deleteStudent(studentId);

        return ResponseEntity.ok(
                ApiResponse.success("Student with ID " + studentId + " has been deleted successfully."));
    }
}
