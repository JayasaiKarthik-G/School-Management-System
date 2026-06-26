package com.spring_boot.controller;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
import com.spring_boot.dto.response.MarkResponse;
import com.spring_boot.exception.DuplicateMarkException;
import com.spring_boot.exception.ResourceNotFoundException;
import com.spring_boot.service.MarkService;

@WebMvcTest(MarkController.class)
@ActiveProfiles("test")
@DisplayName("MarkController — Integration Tests")
class MarkControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MarkService markService;

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------

    private MarkResponse buildMarkResponse(int markId, int studentId, int subjectId, int examId, int score) {
        return new MarkResponse(
                markId,
                new MarkResponse.StudentRef(studentId, "Alice Smith"),
                new MarkResponse.SubjectRef(subjectId, "Mathematics"),
                new MarkResponse.ExamRef(examId, "Midterm 2024"),
                score
        );
    }

    // ------------------------------------------------------------------
    // GET /api/marks
    // ------------------------------------------------------------------

    @Test
    @DisplayName("GET /api/marks — returns 200 with all marks")
    void getAllMarks_shouldReturn200WithList() throws Exception {
        MarkResponse mark = buildMarkResponse(1, 1, 1, 1, 85);
        when(markService.getAllMarks(null, null, null, null)).thenReturn(List.of(mark));

        mockMvc.perform(get("/api/marks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.totalCount").value(1))
                .andExpect(jsonPath("$.data[0].score").value(85));
    }

    @Test
    @DisplayName("GET /api/marks?studentId=1 — filters by student")
    void getAllMarks_filteredByStudent_shouldReturn200() throws Exception {
        MarkResponse mark = buildMarkResponse(1, 1, 1, 1, 85);
        when(markService.getAllMarks(1, null, null, null)).thenReturn(List.of(mark));

        mockMvc.perform(get("/api/marks").param("studentId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].student.studentId").value(1));
    }

    // ------------------------------------------------------------------
    // GET /api/marks/{id}
    // ------------------------------------------------------------------

    @Test
    @DisplayName("GET /api/marks/{id} — returns 200 when mark exists")
    void getMarkById_existingId_shouldReturn200() throws Exception {
        MarkResponse mark = buildMarkResponse(1, 1, 1, 1, 90);
        when(markService.getMarkById(1)).thenReturn(mark);

        mockMvc.perform(get("/api/marks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.markId").value(1))
                .andExpect(jsonPath("$.data.score").value(90));
    }

    @Test
    @DisplayName("GET /api/marks/{id} — returns 404 when mark not found")
    void getMarkById_nonExistingId_shouldReturn404() throws Exception {
        when(markService.getMarkById(999))
                .thenThrow(new ResourceNotFoundException("MARK_NOT_FOUND",
                        "Mark with ID 999 does not exist."));

        mockMvc.perform(get("/api/marks/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.errorCode").value("MARK_NOT_FOUND"));
    }

    // ------------------------------------------------------------------
    // POST /api/marks
    // ------------------------------------------------------------------

    @Test
    @DisplayName("POST /api/marks — returns 201 with valid payload")
    void createMark_validPayload_shouldReturn201() throws Exception {
        String body = """
                {
                  "studentId": 1,
                  "subjectId": 1,
                  "examId":    1,
                  "score":     88
                }
                """;

        MarkResponse created = buildMarkResponse(1, 1, 1, 1, 88);
        when(markService.createMark(any())).thenReturn(created);

        mockMvc.perform(post("/api/marks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.score").value(88));
    }

    @Test
    @DisplayName("POST /api/marks — returns 409 on duplicate mark")
    void createMark_duplicate_shouldReturn409() throws Exception {
        String body = """
                {
                  "studentId": 1,
                  "subjectId": 1,
                  "examId":    1,
                  "score":     88
                }
                """;

        when(markService.createMark(any()))
                .thenThrow(new DuplicateMarkException(
                        "A mark already exists for Student 1, Subject 1, Exam 1."));

        mockMvc.perform(post("/api/marks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.errorCode").value("DUPLICATE_MARK"));
    }

    @Test
    @DisplayName("POST /api/marks — returns 422 when score exceeds 100")
    void createMark_scoreOutOfRange_shouldReturn422() throws Exception {
        String body = """
                {
                  "studentId": 1,
                  "subjectId": 1,
                  "examId":    1,
                  "score":     150
                }
                """;

        mockMvc.perform(post("/api/marks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.errorCode").value("VALIDATION_ERROR"));
    }

    // ------------------------------------------------------------------
    // DELETE /api/marks/{id}
    // ------------------------------------------------------------------

    @Test
    @DisplayName("DELETE /api/marks/{id} — returns 200 on success")
    void deleteMark_existingId_shouldReturn200() throws Exception {
        mockMvc.perform(delete("/api/marks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.message").value(containsString("1")));
    }
}