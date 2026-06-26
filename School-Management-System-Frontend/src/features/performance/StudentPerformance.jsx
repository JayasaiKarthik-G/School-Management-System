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
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useState } from "react";

import PageTitle from "../../components/common/PageTitle";
import FormCard from "../../components/forms/FormCard";
import LoaderBox from "../../components/common/LoaderBox";
import { performanceApi } from "../../api/services";

function StudentPerformance() {
  const [studentId, setStudentId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

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

    if (!studentId.trim()) {
      showPopup("Please enter student ID", "warning");
      return;
    }

    setLoading(true);
    setSearched(true);
    setData(null);

    try {
      const result = await performanceApi.student(studentId.trim());

      const finalData = result?.data ? result.data : result;

      if (finalData) {
        setData(finalData);
        showPopup("Student performance loaded successfully", "success");
      } else {
        setData(null);
        showPopup("No performance data found", "warning");
      }
    } catch (error) {
      console.error("Error loading student performance:", error);

      const responseData = error?.response?.data;

      const backendMessage =
        responseData?.message ||
        responseData?.msg ||
        responseData?.error ||
        responseData?.details ||
        "Failed to load student performance";

      showPopup(backendMessage, "error");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const student = data?.student || {};
  const performance = Array.isArray(data?.performance) ? data.performance : [];

  return (
    <>
      <Stack spacing={3}>
        <PageTitle
          title="Student Performance"
          subtitle="Fetch complete performance by student ID"
        />

        <FormCard onSubmit={handleSubmit}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="stretch"
            sx={{ width: "100%" }}
          >
            <TextField
              label="Student ID"
              value={studentId}
              onChange={(event) => setStudentId(event.target.value)}
              fullWidth
              sx={{ flex: 1 }}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                minWidth: { xs: "100%", sm: "180px" },
                height: { xs: "44px", sm: "56px" },
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                whiteSpace: "nowrap",
                boxShadow: "none",
                backgroundColor: "#2563eb",
                "&:hover": {
                  backgroundColor: "#1d4ed8",
                  boxShadow: "none"
                }
              }}
            >
              Get Performance
            </Button>
          </Stack>
        </FormCard>

        {loading ? ( <LoaderBox />)
        : !loading && searched && !data ? (
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
              No student performance data found
            </Typography>
          </Paper>
        ) : !loading && data ? (
    
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
                  {student.fullName || "Student Name"}
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  flexWrap="wrap"
                >
                  <Chip
                    icon={
                      <PersonOutlineOutlinedIcon
                        sx={{ color: "#f8fafc !important" }}
                      />
                    }
                    label={`Student ID: ${student.studentId ?? "-"}`}
                    sx={{
                      backgroundColor: "#1e293b",
                      color: "#f8fafc",
                      fontWeight: 600
                    }}
                  />

                  <Chip
                    icon={
                      <SchoolOutlinedIcon
                        sx={{ color: "#f8fafc !important" }}
                      />
                    }
                    label={`Enrollment Year: ${student.enrollmentYear ?? "-"}`}
                    sx={{
                      backgroundColor: "#1e293b",
                      color: "#f8fafc",
                      fontWeight: 600
                    }}
                  />

                  <Chip
                    icon={
                      <TrendingUpOutlinedIcon
                        sx={{ color: "#ffffff !important" }}
                      />
                    }
                    label={`Overall Average: ${data.overallAverage ?? "-"}%`}
                    sx={{
                      backgroundColor: "#1d4ed8",
                      color: "#ffffff",
                      fontWeight: 700
                    }}
                  />

                  <Chip
                    icon={
                      <AssessmentOutlinedIcon
                        sx={{ color: "#ffffff !important" }}
                      />
                    }
                    label={`Total Exams: ${data.totalExamsAppeared ?? 0}`}
                    sx={{
                      backgroundColor: "#047857",
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
                Exam Performance
              </Typography>

              {performance.length === 0 ? (
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
                    No performance data found
                  </Typography>
                </Paper>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2
                  }}
                >
                  {performance.map((exam) => (
                    <Box
                      key={exam.examId}
                      sx={{
                        width: {
                          xs: "100%",
                          sm: "100%",
                          md: "calc(50% - 8px)"
                        }
                      }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          backgroundColor: "#0f172a",
                          border: "1px solid #1e293b",
                          borderRadius: 3,
                          height: "100%"
                        }}
                      >
                        <Stack spacing={2}>
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{
                                color: "#f8fafc",
                                fontWeight: 700
                              }}
                            >
                              {exam.examName}
                            </Typography>

                            <Typography
                              sx={{
                                color: "#94a3b8",
                                mt: 0.5
                              }}
                            >
                              Exam Date: {exam.examDate}
                            </Typography>
                          </Box>

                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            flexWrap="wrap"
                          >
                            <Chip
                              icon={
                                <NumbersOutlinedIcon
                                  sx={{ color: "#f8fafc !important" }}
                                />
                              }
                              label={`Total Score: ${exam.totalScore ?? "-"}`}
                              sx={{
                                backgroundColor: "#1e293b",
                                color: "#f8fafc"
                              }}
                            />

                            <Chip
                              icon={
                                <TrendingUpOutlinedIcon
                                  sx={{ color: "#f8fafc !important" }}
                                />
                              }
                              label={`Average Score: ${exam.averageScore ?? "-"}`}
                              sx={{
                                backgroundColor: "#1e293b",
                                color: "#f8fafc"
                              }}
                            />

                            <Chip
                              icon={
                                <QuizOutlinedIcon
                                  sx={{ color: "#f8fafc !important" }}
                                />
                              }
                              label={`Exam ID: ${exam.examId ?? "-"}`}
                              sx={{
                                backgroundColor: "#1e293b",
                                color: "#f8fafc"
                              }}
                            />
                          </Stack>

                          <Divider sx={{ borderColor: "#334155" }} />

                          <Stack spacing={1.5}>
                            <Typography
                              sx={{
                                color: "#cbd5e1",
                                fontWeight: 600
                              }}
                            >
                              Subject Scores
                            </Typography>

                            {(exam.subjectScores || []).map((subject, index) => {
                              const isPass = subject.status === "Pass";

                              return (
                                <Box
                                  key={`${exam.examId}-${index}`}
                                  sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor: "#111827",
                                    border: "1px solid #1f2937"
                                  }}
                                >
                                  <Stack
                                    direction={{ xs: "column", sm: "row" }}
                                    justifyContent="space-between"
                                    spacing={1.5}
                                  >
                                    <Stack spacing={0.5}>
                                      <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                      >
                                        <MenuBookOutlinedIcon
                                          sx={{
                                            color: "#60a5fa",
                                            fontSize: 20
                                          }}
                                        />
                                        <Typography
                                          sx={{
                                            color: "#f8fafc",
                                            fontWeight: 600
                                          }}
                                        >
                                          {subject.subjectName}
                                        </Typography>
                                      </Stack>
                                    </Stack>

                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      flexWrap="wrap"
                                      useFlexGap
                                    >
                                      <Chip
                                        label={`Score: ${subject.score ?? "-"}`}
                                        size="small"
                                        sx={{
                                          backgroundColor: "#1e293b",
                                          color: "#f8fafc"
                                        }}
                                      />

                                      <Chip
                                        icon={
                                          isPass ? (
                                            <CheckCircleOutlineOutlinedIcon
                                              sx={{
                                                color: "#ffffff !important"
                                              }}
                                            />
                                          ) : (
                                            <CancelOutlinedIcon
                                              sx={{
                                                color: "#ffffff !important"
                                              }}
                                            />
                                          )
                                        }
                                        label={subject.status || "-"}
                                        size="small"
                                        sx={{
                                          backgroundColor: isPass
                                            ? "#065f46"
                                            : "#7f1d1d",
                                          color: "#ffffff",
                                          fontWeight: 700
                                        }}
                                      />
                                    </Stack>
                                  </Stack>
                                </Box>
                              );
                            })}
                          </Stack>
                        </Stack>
                      </Paper>
                    </Box>
                  ))}
                </Box>
              )}
            </Stack>
          </>
        ): null}
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

export default StudentPerformance;