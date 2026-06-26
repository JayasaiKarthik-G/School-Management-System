import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import TrendingDownOutlinedIcon from "@mui/icons-material/TrendingDownOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import { useState } from "react";

import PageTitle from "../../components/common/PageTitle";
import FormCard from "../../components/forms/FormCard";
import LoaderBox from "../../components/common/LoaderBox";
import { reportApi } from "../../api/services";

export default function StudentTrend() {
  const [studentId, setStudentId] = useState("");
  const [subjectId, setSubjectId] = useState("");
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
    setData(null);
    setSearched(true);

    try {
      const result = await reportApi.studentTrend(
        studentId.trim(),
        subjectId.trim()
      );

      const finalData = result?.data ? result.data : result;

      if (finalData) {
        setData(finalData);
        showPopup("Student trend loaded successfully", "success");
      } else {
        setData(null);
        showPopup("No trend data found", "warning");
      }
    } catch (error) {
      console.error("Student trend error:", error);

      const responseData = error?.response?.data;

      const backendMessage =
        responseData?.message ||
        responseData?.msg ||
        responseData?.error ||
        responseData?.details ||
        "Failed to load student trend";

      showPopup(
        typeof backendMessage === "string"
          ? backendMessage
          : "Failed to load student trend",
        "error"
      );

      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const report = data?.data || data || {};
  const student = report?.student || {};
  const subject = report?.subject || {};
  const trend = Array.isArray(report?.trend) ? report.trend : [];
  const trendDirection = report?.trendDirection || "-";
  const changePercent = report?.changePercent ?? 0;

  const isImproving = trendDirection?.toLowerCase() === "improving";
  const isDeclining = trendDirection?.toLowerCase() === "declining";

  return (
    <>
      <Stack spacing={3}>
        <PageTitle
          title="Student Trend"
          subtitle="Track score progression across exams"
        />

        <FormCard onSubmit={handleSubmit}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="stretch"
            sx={{
              width: "100%",
              flexWrap: "wrap"
            }}
          >
            <TextField
              label="Student ID"
              value={studentId}
              onChange={(event) => setStudentId(event.target.value)}
              fullWidth
              sx={{ flex: 1 }}
            />

            <TextField
              label="Subject ID (Optional)"
              value={subjectId}
              onChange={(event) => setSubjectId(event.target.value)}
              fullWidth
              sx={{ flex: 1 }}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
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
              Get Trend
            </Button>
          </Stack>
        </FormCard>

        {loading && <LoaderBox />}

        {!loading && data && (
          <>
            {/* Summary Card */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: 3
              }}
            >
              <Stack spacing={2.5}>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonOutlineOutlinedIcon sx={{ color: "#60a5fa" }} />
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#f8fafc",
                        fontWeight: 700
                      }}
                    >
                      {student.fullName || "Student Trend"}
                    </Typography>
                  </Stack>

                  <Typography sx={{ color: "#94a3b8" }}>
                    Student ID: {student.studentId ?? "-"}
                  </Typography>
                </Stack>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  flexWrap="wrap"
                  useFlexGap
                >
                  <Chip
                    icon={
                      <MenuBookOutlinedIcon
                        sx={{ color: "#ffffff !important" }}
                      />
                    }
                    label={
                      subject?.subjectName
                        ? `Subject: ${subject.subjectName}`
                        : "All Subjects / Subject not specified"
                    }
                    sx={{
                      backgroundColor: "#1e293b",
                      color: "#f8fafc",
                      fontWeight: 600
                    }}
                  />

                  <Chip
                    icon={
                      isImproving ? (
                        <TrendingUpOutlinedIcon
                          sx={{ color: "#ffffff !important" }}
                        />
                      ) : isDeclining ? (
                        <TrendingDownOutlinedIcon
                          sx={{ color: "#ffffff !important" }}
                        />
                      ) : (
                        <TimelineOutlinedIcon
                          sx={{ color: "#ffffff !important" }}
                        />
                      )
                    }
                    label={`Trend: ${trendDirection}`}
                    sx={{
                      backgroundColor: isImproving
                        ? "#047857"
                        : isDeclining
                        ? "#b91c1c"
                        : "#475569",
                      color: "#ffffff",
                      fontWeight: 700
                    }}
                  />

                  <Chip
                    icon={
                      <ShowChartOutlinedIcon
                        sx={{ color: "#ffffff !important" }}
                      />
                    }
                    label={`Change %: ${changePercent}%`}
                    sx={{
                      backgroundColor: "#7c3aed",
                      color: "#ffffff",
                      fontWeight: 700
                    }}
                  />

                  <Chip
                    icon={
                      <QuizOutlinedIcon sx={{ color: "#ffffff !important" }} />
                    }
                    label={`Exams Tracked: ${trend.length}`}
                    sx={{
                      backgroundColor: "#1d4ed8",
                      color: "#ffffff",
                      fontWeight: 700
                    }}
                  />
                </Stack>
              </Stack>
            </Paper>

            {/* Trend Cards */}
            <Stack spacing={2}>
              <Typography
                variant="h6"
                sx={{
                  color: "#f8fafc",
                  fontWeight: 700
                }}
              >
                Exam Trend
              </Typography>

              {trend.length === 0 ? (
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
                    No trend data found
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
                  {trend.map((item, index) => {
                    const previousScore =
                      index > 0 ? trend[index - 1]?.score ?? null : null;

                    const scoreChange =
                      previousScore !== null
                        ? Number(item.score) - Number(previousScore)
                        : null;

                    const isUp = scoreChange > 0;
                    const isDown = scoreChange < 0;

                    return (
                      <Paper
                        key={`${item.examId}-${index}`}
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
                              <QuizOutlinedIcon sx={{ color: "#38bdf8" }} />
                              <Typography
                                variant="h6"
                                sx={{
                                  color: "#f8fafc",
                                  fontWeight: 700
                                }}
                              >
                                {item.examName || "Exam"}
                              </Typography>
                            </Stack>

                            <Typography
                              sx={{
                                color: "#94a3b8",
                                mt: 0.75
                              }}
                            >
                              Exam ID: {item.examId ?? "-"}
                            </Typography>

                            <Typography
                              sx={{
                                color: "#94a3b8",
                                mt: 0.5
                              }}
                            >
                              Exam Date: {item.examDate || "-"}
                            </Typography>
                          </Box>

                          <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            useFlexGap
                          >
                            <Chip
                              icon={
                                <NumbersOutlinedIcon
                                  sx={{ color: "#ffffff !important" }}
                                />
                              }
                              label={`Score: ${item.score ?? "-"}`}
                              sx={{
                                backgroundColor: "#047857",
                                color: "#ffffff",
                                fontWeight: 700
                              }}
                            />

                            {scoreChange !== null && (
                              <Chip
                                icon={
                                  isUp ? (
                                    <TrendingUpOutlinedIcon
                                      sx={{ color: "#ffffff !important" }}
                                    />
                                  ) : isDown ? (
                                    <TrendingDownOutlinedIcon
                                      sx={{ color: "#ffffff !important" }}
                                    />
                                  ) : (
                                    <TimelineOutlinedIcon
                                      sx={{ color: "#ffffff !important" }}
                                    />
                                  )
                                }
                                label={`Change: ${
                                  scoreChange > 0 ? `+${scoreChange}` : scoreChange
                                }`}
                                sx={{
                                  backgroundColor: isUp
                                    ? "#1d4ed8"
                                    : isDown
                                    ? "#b91c1c"
                                    : "#475569",
                                  color: "#ffffff",
                                  fontWeight: 700
                                }}
                              />
                            )}
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
              No trend data found
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