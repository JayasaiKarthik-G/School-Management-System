package com.spring_boot.controller;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.spring_boot.dto.response.StudentResponse;
import com.spring_boot.exception.ResourceNotFoundException;
import com.spring_boot.service.StudentService;

@WebMvcTest(StudentController.class)
@ActiveProfiles("test")
@DisplayName("StudentController — Integration Tests")
class StudentControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private StudentService studentService;

    // ------------------------------------------------------------------
    // GET /api/students
    // ------------------------------------------------------------------

    @Test
    @DisplayName("GET /api/students — returns 200 with a list of students")
    void getAllStudents_shouldReturn200WithList() throws Exception {
        StudentResponse s1 = new StudentResponse(1, "Alice", "Smith", 2022, "Alice Smith");
        StudentResponse s2 = new StudentResponse(2, "Bob",   "Jones", 2023, "Bob Jones");

        when(studentService.getAllStudents()).thenReturn(List.of(s1, s2));

        mockMvc.perform(get("/api/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.totalCount").value(2))
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[0].firstName").value("Alice"))
                .andExpect(jsonPath("$.data[1].firstName").value("Bob"));
    }

    // ------------------------------------------------------------------
    // GET /api/students/{id}
    // ------------------------------------------------------------------

    @Test
    @DisplayName("GET /api/students/{id} — returns 200 when student exists")
    void getStudentById_existingId_shouldReturn200() throws Exception {
        StudentResponse student = new StudentResponse(1, "Alice", "Smith", 2022, "Alice Smith");

        when(studentService.getStudentById(1)).thenReturn(student);

        mockMvc.perform(get("/api/students/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.studentId").value(1))
                .andExpect(jsonPath("$.data.fullName").value("Alice Smith"));
    }

    @Test
    @DisplayName("GET /api/students/{id} — returns 404 when student not found")
    void getStudentById_nonExistingId_shouldReturn404() throws Exception {
        when(studentService.getStudentById(99))
                .thenThrow(new ResourceNotFoundException("STUDENT_NOT_FOUND",
                        "Student with ID 99 does not exist."));

        mockMvc.perform(get("/api/students/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.errorCode").value("STUDENT_NOT_FOUND"))
                .andExpect(jsonPath("$.message").value(containsString("99")));
    }

    // ------------------------------------------------------------------
    // POST /api/students
    // ------------------------------------------------------------------

    @Test
    @DisplayName("POST /api/students — returns 201 when payload is valid")
    void createStudent_validPayload_shouldReturn201() throws Exception {
        String body = """
                {
                  "firstName": "Alice",
                  "lastName":  "Smith",
                  "enrollmentYear": 2022
                }
                """;

        StudentResponse created = new StudentResponse(1, "Alice", "Smith", 2022, "Alice Smith");
        when(studentService.createStudent(any())).thenReturn(created);

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.studentId").value(1))
                .andExpect(jsonPath("$.data.firstName").value("Alice"));
    }

    @Test
    @DisplayName("POST /api/students — returns 422 when firstName is blank")
    void createStudent_blankFirstName_shouldReturn422() throws Exception {
        String body = """
                {
                  "firstName": "",
                  "lastName":  "Smith",
                  "enrollmentYear": 2022
                }
                """;

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.errorCode").value("VALIDATION_ERROR"));
    }

    // ------------------------------------------------------------------
    // PUT /api/students/{id}
    // ------------------------------------------------------------------

    @Test
    @DisplayName("PUT /api/students/{id} — returns 200 when update succeeds")
    void updateStudent_validPayload_shouldReturn200() throws Exception {
        String body = """
                {
                  "firstName": "Alicia",
                  "lastName":  "Smith",
                  "enrollmentYear": 2022
                }
                """;

        StudentResponse updated = new StudentResponse(1, "Alicia", "Smith", 2022, "Alicia Smith");
        when(studentService.updateStudent(eq(1), any())).thenReturn(updated);

        mockMvc.perform(put("/api/students/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.firstName").value("Alicia"));
    }

    // ------------------------------------------------------------------
    // DELETE /api/students/{id}
    // ------------------------------------------------------------------

    @Test
    @DisplayName("DELETE /api/students/{id} — returns 200 when deletion succeeds")
    void deleteStudent_existingId_shouldReturn200() throws Exception {
        mockMvc.perform(delete("/api/students/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.message").value(containsString("1")));
    }
}