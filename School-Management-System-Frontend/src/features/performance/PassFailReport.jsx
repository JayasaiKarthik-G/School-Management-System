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
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useState } from "react";

import PageTitle from "../../components/common/PageTitle";
import FormCard from "../../components/forms/FormCard";
import LoaderBox from "../../components/common/LoaderBox";
import { performanceApi } from "../../api/services";

export default function PassFailReport() {
  const [examId, setExamId] = useState("");
  const [passThreshold, setPassThreshold] = useState("");
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

    if (!examId.trim()) {
      showPopup("Please enter exam ID", "warning");
      return;
    }

    setLoading(true);
    setSearched(true);
    setData(null);

    try {
      const thresholdValue =
        passThreshold.trim() !== "" ? Number(passThreshold) : 80;

      const result = await performanceApi.passFail({
        examId: Number(examId),
        passThreshold: thresholdValue
      });

      const finalData = result?.data ? result.data : result;

      if (finalData) {
        setData(finalData);
        showPopup("Pass / fail report loaded successfully", "success");
      } else {
        setData(null);
        showPopup("No pass / fail report found", "warning");
      }
    } catch (error) {
      console.error("Pass / fail report error:", error);

      const responseData = error?.response?.data;

      const backendMessage =
        responseData?.message ||
        responseData?.msg ||
        responseData?.error ||
        responseData?.details ||
        "Failed to load pass / fail report";

      showPopup(
        typeof backendMessage === "string"
          ? backendMessage
          : "Failed to load pass / fail report",
        "error"
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const report = data || {};
  const exam = report?.exam || {};
  const summary = report?.summary || {};
  const results = Array.isArray(report?.results) ? report.results : [];
  const thresholdValue = report?.passThreshold ?? (passThreshold.trim() !== "" ? Number(passThreshold) : 80);

  return (
    <>
      <Stack spacing={3}>
        <PageTitle
          title="Pass / Fail Report"
          subtitle="Fetch pass / fail report by exam ID"
        />

        <FormCard onSubmit={handleSubmit}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="stretch"
            sx={{ width: "100%" }}
          >
            <TextField
              label="Exam ID"
              value={examId}
              onChange={(event) => setExamId(event.target.value)}
              fullWidth
              sx={{ flex: 1 }}
            />

            <TextField
              label="Pass Threshold"
              value={passThreshold}
              onChange={(event) => setPassThreshold(event.target.value)}
              fullWidth
              sx={{ flex: 1 }}
              helperText="Default threshold is 80 if left empty"
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                flex: { xs: 1, sm: "unset" },
                minWidth: { xs: 0, sm: "170px" },
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
              Get Report
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
                  {exam.examName || "Exam Report"}
                </Typography>

                <Typography
                  sx={{
                    color: "#94a3b8"
                  }}
                >
                  Exam Date: {exam.examDate || "-"}
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  flexWrap="wrap"
                  useFlexGap
                >
                  <Chip
                    icon={
                      <QuizOutlinedIcon sx={{ color: "#f8fafc !important" }} />
                    }
                    label={`Exam ID: ${exam.examId ?? "-"}`}
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
                    label={`Total Students: ${summary.totalStudents ?? 0}`}
                    sx={{
                      backgroundColor: "#1e293b",
                      color: "#f8fafc",
                      fontWeight: 600
                    }}
                  />

                  <Chip
                    icon={
                      <CheckCircleOutlineOutlinedIcon
                        sx={{ color: "#ffffff !important" }}
                      />
                    }
                    label={`Passed: ${summary.passed ?? 0}`}
                    sx={{
                      backgroundColor: "#047857",
                      color: "#ffffff",
                      fontWeight: 700
                    }}
                  />

                  <Chip
                    icon={
                      <CancelOutlinedIcon
                        sx={{ color: "#ffffff !important" }}
                      />
                    }
                    label={`Failed: ${summary.failed ?? 0}`}
                    sx={{
                      backgroundColor: "#b91c1c",
                      color: "#ffffff",
                      fontWeight: 700
                    }}
                  />

                  <Chip
                    icon={
                      <TrendingUpOutlinedIcon
                        sx={{ color: "#ffffff !important" }}
                      />
                    }
                    label={`Pass %: ${summary.passPercentage ?? 0}%`}
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
                    label={`Threshold: ${thresholdValue}`}
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
                Student Results
              </Typography>

              {results.length === 0 ? (
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
                    No pass / fail report data found
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
                    gap: 3
                  }}
                >
                  {results.map((item, index) => {
                    const student = item.student || {};
                    const subjectResults = Array.isArray(item.subjectResults)
                      ? item.subjectResults
                      : [];
                    const isOverallPass = item.overallStatus === "Pass";

                    return (
                      <Paper
                        key={`${student.studentId || index}-${index}`}
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
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <PersonOutlineOutlinedIcon
                                sx={{ color: "#60a5fa" }}
                              />
                              <Typography
                                variant="h6"
                                sx={{
                                  color: "#f8fafc",
                                  fontWeight: 700
                                }}
                              >
                                {student.fullName || "Student"}
                              </Typography>
                            </Stack>

                            <Typography
                              sx={{
                                color: "#94a3b8",
                                mt: 0.75
                              }}
                            >
                              Student ID: {student.studentId ?? "-"}
                            </Typography>
                          </Box>

                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            flexWrap="wrap"
                            useFlexGap
                          >
                            <Chip
                              icon={
                                isOverallPass ? (
                                  <CheckCircleOutlineOutlinedIcon
                                    sx={{ color: "#ffffff !important" }}
                                  />
                                ) : (
                                  <CancelOutlinedIcon
                                    sx={{ color: "#ffffff !important" }}
                                  />
                                )
                              }
                              label={`Overall: ${item.overallStatus || "-"}`}
                              sx={{
                                backgroundColor: isOverallPass
                                  ? "#047857"
                                  : "#b91c1c",
                                color: "#ffffff",
                                fontWeight: 700
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
                              Subject Results
                            </Typography>

                            {subjectResults.map((subject, subjectIndex) => {
                              const isPass = subject.status === "Pass";

                              return (
                                <Box
                                  key={`${student.studentId}-${subjectIndex}`}
                                  sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor: "#111827",
                                    border: "1px solid #1f2937"
                                  }}
                                >
                                  <Stack spacing={1.5}>
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
                                        {subject.subjectName || "-"}
                                      </Typography>
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
                    );
                  })}
                </Box>
              )}
            </Stack>
          </>
        )}

        {!loading && searched && !data && (
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
              No pass / fail report data found
            </Typography>
          </Paper>
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