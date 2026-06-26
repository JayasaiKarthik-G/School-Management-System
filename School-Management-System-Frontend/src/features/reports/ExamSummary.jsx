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
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import { useState } from "react";

import PageTitle from "../../components/common/PageTitle";
import FormCard from "../../components/forms/FormCard";
import LoaderBox from "../../components/common/LoaderBox";
import { reportApi } from "../../api/services";

export default function ExamSummary() {
  const [minTotalScore, setMinTotalScore] = useState("0");
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

    setLoading(true);
    setSearched(true);
    setData(null);

    try {
      const scoreValue =
        minTotalScore.trim() === "" ? 0 : Number(minTotalScore.trim());

      const result = await reportApi.examSummary(scoreValue);
      const finalData = Array.isArray(result?.data) ? result.data : result;

      if (finalData) {
        setData(finalData);
        showPopup("Exam summary loaded successfully", "success");
      } else {
        setData([]);
        showPopup("No exam summary data found", "warning");
      }
    } catch (error) {
      console.error("Exam summary error:", error);

      const responseData = error?.response?.data;

      const backendMessage =
        responseData?.message ||
        responseData?.msg ||
        responseData?.error ||
        responseData?.details ||
        "Failed to load exam summary";

      showPopup(
        typeof backendMessage === "string"
          ? backendMessage
          : "Failed to load exam summary",
        "error"
      );

      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const summaryRows = Array.isArray(data) ? data : [];
  const totalExams = summaryRows.length;
  const totalScoreSum = summaryRows.reduce(
    (sum, item) => sum + Number(item?.totalScoreSum || 0),
    0
  );
  const totalStudentsAppeared = summaryRows.reduce(
    (sum, item) => sum + Number(item?.studentsAppeared || 0),
    0
  );

  return (
    <>
      <Stack spacing={3}>
        <PageTitle
          title="Exam Summary"
          subtitle="Exams above a threshold total score"
        />

        <FormCard onSubmit={handleSubmit}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="stretch"
            sx={{ width: "100%" }}
          >
            <TextField
              label="Minimum Total Score"
              value={minTotalScore}
              onChange={(event) => setMinTotalScore(event.target.value)}
              fullWidth
              sx={{ flex: 1 }}
              helperText="Default value is 0"
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
              Get Summary
            </Button>
          </Stack>
        </FormCard>

        {loading && <LoaderBox />}

        {!loading && summaryRows.length > 0 && (
          <>
            {/* Summary Header Card */}
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
                  Exam Summary Report
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  flexWrap="wrap"
                  useFlexGap
                >
                  <Chip
                    icon={
                      <AssessmentOutlinedIcon
                        sx={{ color: "#f8fafc !important" }}
                      />
                    }
                    label={`Minimum Total Score: ${
                      minTotalScore.trim() === "" ? 0 : minTotalScore
                    }`}
                    sx={{
                      backgroundColor: "#1e293b",
                      color: "#f8fafc",
                      fontWeight: 600
                    }}
                  />

                  <Chip
                    icon={
                      <QuizOutlinedIcon sx={{ color: "#ffffff !important" }} />
                    }
                    label={`Total Exams: ${totalExams}`}
                    sx={{
                      backgroundColor: "#1d4ed8",
                      color: "#ffffff",
                      fontWeight: 700
                    }}
                  />

                  <Chip
                    icon={
                      <NumbersOutlinedIcon
                        sx={{ color: "#ffffff !important" }}
                      />
                    }
                    label={`Combined Score: ${totalScoreSum}`}
                    sx={{
                      backgroundColor: "#047857",
                      color: "#ffffff",
                      fontWeight: 700
                    }}
                  />

                  <Chip
                    icon={
                      <GroupsOutlinedIcon
                        sx={{ color: "#ffffff !important" }}
                      />
                    }
                    label={`Students Appeared Total: ${totalStudentsAppeared}`}
                    sx={{
                      backgroundColor: "#7c3aed",
                      color: "#ffffff",
                      fontWeight: 700
                    }}
                  />
                </Stack>
              </Stack>
            </Paper>

            {/* Exam Cards */}
            <Stack spacing={2}>
              <Typography
                variant="h6"
                sx={{
                  color: "#f8fafc",
                  fontWeight: 700
                }}
              >
                Exam Results
              </Typography>

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
                {summaryRows.map((item, index) => (
                  <Paper
                    key={item.examId || index}
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
                      {/* Exam Name */}
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <QuizOutlinedIcon sx={{ color: "#60a5fa" }} />
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
                      </Box>

                      {/* Date */}
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: "#111827",
                          border: "1px solid #1f2937"
                        }}
                      >
                        <Stack spacing={1.25}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <CalendarMonthOutlinedIcon
                              sx={{
                                color: "#38bdf8",
                                fontSize: 20
                              }}
                            />
                            <Typography
                              sx={{
                                color: "#f8fafc",
                                fontWeight: 600
                              }}
                            >
                              Exam Date
                            </Typography>
                          </Stack>

                          <Typography
                            sx={{
                              color: "#cbd5e1",
                              fontWeight: 600
                            }}
                          >
                            {item.examDate || "-"}
                          </Typography>
                        </Stack>
                      </Box>

                      {/* Total Score Sum */}
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: "#111827",
                          border: "1px solid #1f2937"
                        }}
                      >
                        <Stack spacing={1.25}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <NumbersOutlinedIcon
                              sx={{
                                color: "#22c55e",
                                fontSize: 20
                              }}
                            />
                            <Typography
                              sx={{
                                color: "#f8fafc",
                                fontWeight: 600
                              }}
                            >
                              Total Score Sum
                            </Typography>
                          </Stack>

                          <Typography
                            sx={{
                              color: "#22c55e",
                              fontWeight: 700
                            }}
                          >
                            {item.totalScoreSum ?? 0}
                          </Typography>
                        </Stack>
                      </Box>

                      {/* Students Appeared */}
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: "#111827",
                          border: "1px solid #1f2937"
                        }}
                      >
                        <Stack spacing={1.25}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <GroupsOutlinedIcon
                              sx={{
                                color: "#a78bfa",
                                fontSize: 20
                              }}
                            />
                            <Typography
                              sx={{
                                color: "#f8fafc",
                                fontWeight: 600
                              }}
                            >
                              Students Appeared
                            </Typography>
                          </Stack>

                          <Typography
                            sx={{
                              color: "#c4b5fd",
                              fontWeight: 700
                            }}
                          >
                            {item.studentsAppeared ?? 0}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Box>
            </Stack>
          </>
        )}

        {!loading && searched && summaryRows.length === 0 && (
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
              No exam summary data found
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