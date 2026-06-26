import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";

import PageTitle from "../../components/common/PageTitle";
import FormCard from "../../components/forms/FormCard";
import LoaderBox from "../../components/common/LoaderBox";
import { performanceApi } from "../../api/services";

function StudentExamPerformance() {
  const [studentId, setStudentId] = useState("");
  const [examId, setExamId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [popup, setPopup] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const showPopup = (message, severity = "success") => {
    setPopup({
      open: true,
      message,
      severity
    });
  };

  const handleClosePopup = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setPopup((prev) => ({
      ...prev,
      open: false
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!studentId.trim() || !examId.trim()) {
      showPopup("Student ID and Exam ID are required", "warning");
      return;
    }

    setLoading(true);

    try {
      const result = await performanceApi.studentExam(studentId, examId);

      if (result?.data) {
        setData(result.data);
      } else {
        setData(result);
      }

      showPopup("Performance loaded successfully", "success");
    } catch (error) {
      console.error("Error loading student exam performance:", error);
      setData(null);

      const responseData = error?.response?.data;

      const backendMessage =
        responseData?.message ||
        responseData?.msg ||
        responseData?.error ||
        responseData?.details ||
        "Failed to load student exam performance";

      showPopup(backendMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const student = data?.student || {};
  const exam = data?.exam || {};
  const scores = Array.isArray(data?.scores) ? data.scores : [];

  return (
    <>
      <Stack spacing={3}>
        <PageTitle
          title="Student Exam Performance"
          subtitle="Get performance of one student in one exam"
        />

        <FormCard onSubmit={handleSubmit}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="stretch"
          >
            <TextField
              label="Student ID"
              value={studentId}
              onChange={(event) => setStudentId(event.target.value)}
              fullWidth
            />

            <TextField
              label="Exam ID"
              value={examId}
              onChange={(event) => setExamId(event.target.value)}
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                width: { xs: "100%", sm: "170px" },
                minWidth: { xs: "100%", sm: "170px" },
                height: { xs: "44px", sm: "56px" },
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                backgroundColor: "#2563eb",
                boxShadow: "none",
                whiteSpace: "nowrap",
                "&:hover": {
                  backgroundColor: "#1d4ed8",
                  boxShadow: "none"
                }
              }}
            >
              Get Result
            </Button>
          </Stack>
        </FormCard>

        {loading && <LoaderBox />}

        {!loading && data && (
          <>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: 3
              }}
            >
              <Stack spacing={2}>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#f8fafc",
                    fontWeight: 700
                  }}
                >
                  {student.fullName || "Student Performance"}
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  flexWrap="wrap"
                >
                  <Chip
                    label={`Student ID: ${student.studentId ?? "-"}`}
                    sx={{
                      backgroundColor: "#1e293b",
                      color: "#f8fafc",
                      fontWeight: 600
                    }}
                  />

                  <Chip
                    label={`Exam ID: ${exam.examId ?? "-"}`}
                    sx={{
                      backgroundColor: "#1e293b",
                      color: "#f8fafc",
                      fontWeight: 600
                    }}
                  />

                  <Chip
                    label={`Exam: ${exam.examName || "-"}`}
                    sx={{
                      backgroundColor: "#1d4ed8",
                      color: "#ffffff",
                      fontWeight: 700
                    }}
                  />

                  <Chip
                    label={`Exam Date: ${exam.examDate || "-"}`}
                    sx={{
                      backgroundColor: "#047857",
                      color: "#ffffff",
                      fontWeight: 700
                    }}
                  />
                </Stack>
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: 3
              }}
            >
              <Stack spacing={2}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#f8fafc",
                    fontWeight: 700
                  }}
                >
                  Result Summary
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  flexWrap="wrap"
                >
                  <Chip
                    label={`Total Score: ${data.totalScore ?? "-"}`}
                    sx={{
                      backgroundColor: "#1e293b",
                      color: "#f8fafc",
                      fontWeight: 600
                    }}
                  />

                  <Chip
                    label={`Average Score: ${data.averageScore ?? "-"}`}
                    sx={{
                      backgroundColor: "#1e293b",
                      color: "#f8fafc",
                      fontWeight: 600
                    }}
                  />

                  <Chip
                    label={`Subjects: ${scores.length}`}
                    sx={{
                      backgroundColor: "#7c3aed",
                      color: "#ffffff",
                      fontWeight: 700
                    }}
                  />
                </Stack>
              </Stack>
            </Paper>

            <Stack spacing={2}>
              <Typography
                variant="h6"
                sx={{
                  color: "#f8fafc",
                  fontWeight: 700
                }}
              >
                Subject Scores
              </Typography>

              {scores.length === 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: 3
                  }}
                >
                  <Typography sx={{ color: "#cbd5e1" }}>
                    No subject scores found
                  </Typography>
                </Paper>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)"
                    },
                    gap: 2
                  }}
                >
                  {scores.map((subject, index) => {
                    const isPass =
                      String(subject.status || "").toLowerCase() === "pass";

                    return (
                      <Paper
                        key={index}
                        elevation={0}
                        sx={{
                          p: 3,
                          backgroundColor: "#0f172a",
                          border: "1px solid #1e293b",
                          borderRadius: 3,
                          height: "100%"
                        }}
                      >
                        <Stack spacing={2} sx={{ height: "100%" }}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: "#f8fafc",
                              fontWeight: 700
                            }}
                          >
                            {subject.subjectName || "Subject"}
                          </Typography>

                          {/* score + status always same row */}
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            flexWrap="wrap"
                          >
                            <Chip
                              label={`Score: ${subject.score ?? "-"}`}
                              sx={{
                                backgroundColor: "#1e293b",
                                color: "#f8fafc",
                                fontWeight: 600
                              }}
                            />

                            <Chip
                              label={subject.status || "-"}
                              sx={{
                                backgroundColor: isPass ? "#065f46" : "#7f1d1d",
                                color: "#ffffff",
                                fontWeight: 700
                              }}
                            />
                          </Stack>

                          <Divider sx={{ borderColor: "#334155" }} />

                          <Typography
                            sx={{
                              color: "#94a3b8",
                              fontSize: "0.95rem"
                            }}
                          >
                            {isPass
                              ? "Student passed in this subject."
                              : "Student failed in this subject."}
                          </Typography>
                        </Stack>
                      </Paper>
                    );
                  })}
                </Box>
              )}
            </Stack>
          </>
        )}
      </Stack>

      <Snackbar
        open={popup.open}
        autoHideDuration={3000}
        onClose={handleClosePopup}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClosePopup}
          severity={popup.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {popup.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default StudentExamPerformance;