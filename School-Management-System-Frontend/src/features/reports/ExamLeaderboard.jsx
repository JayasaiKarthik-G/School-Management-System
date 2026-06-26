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
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import { useState } from "react";

import PageTitle from "../../components/common/PageTitle";
import FormCard from "../../components/forms/FormCard";
import LoaderBox from "../../components/common/LoaderBox";
import { reportApi } from "../../api/services";

export default function ExamLeaderboard() {
  const [examId, setExamId] = useState("");
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
      const result = await reportApi.examLeaderboard(examId.trim());
      const finalData = result?.data ? result.data : result;

      if (finalData) {
        setData(finalData);
        showPopup("Leaderboard loaded successfully", "success");
      } else {
        setData(null);
        showPopup("No leaderboard data found", "warning");
      }
    } catch (error) {
      console.error("Exam leaderboard error:", error);

      const responseData = error?.response?.data;

      const backendMessage =
        responseData?.message ||
        responseData?.msg ||
        responseData?.error ||
        responseData?.details ||
        "Failed to load leaderboard";

      showPopup(
        typeof backendMessage === "string"
          ? backendMessage
          : "Failed to load leaderboard",
        "error"
      );

      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const report = data || {};
  const exam = report?.exam || {};
  const leaderboard = Array.isArray(report?.leaderboard)
    ? report.leaderboard
    : [];

  return (
    <>
      <Stack spacing={3}>
        <PageTitle
          title="Exam Leaderboard"
          subtitle="Rank students by total score in an exam"
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

            <Button
              type="submit"
              variant="contained"
              sx={{
                flex: { xs: 1, sm: "unset" },
                minWidth: { xs: 0, sm: "180px" },
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
              Get Leaderboard
            </Button>
          </Stack>
        </FormCard>

        {loading && <LoaderBox />}

        {!loading && data && (
          <>
            {/* Exam Summary Card */}
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
                  {exam.examName || "Exam Leaderboard"}
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
                    label={`Exam ID: ${exam.examId ?? examId ?? "-"}`}
                    sx={{
                      backgroundColor: "#1e293b",
                      color: "#f8fafc",
                      fontWeight: 600
                    }}
                  />

                  <Chip
                    icon={
                      <LeaderboardOutlinedIcon
                        sx={{ color: "#ffffff !important" }}
                      />
                    }
                    label={`Leaderboard Entries: ${leaderboard.length}`}
                    sx={{
                      backgroundColor: "#1d4ed8",
                      color: "#ffffff",
                      fontWeight: 700
                    }}
                  />
                </Stack>
              </Stack>
            </Paper>

            {/* Leaderboard Cards */}
            <Stack spacing={2}>
              <Typography
                variant="h6"
                sx={{
                  color: "#f8fafc",
                  fontWeight: 700
                }}
              >
                Leaderboard Results
              </Typography>

              {leaderboard.length === 0 ? (
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
                    No leaderboard data found
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
                  {leaderboard.map((item, index) => {
                    const student = item.student || {};
                    const rank = item.rank ?? index + 1;

                    const rankBg =
                      rank === 1
                        ? "#ca8a04"
                        : rank === 2
                        ? "#475569"
                        : rank === 3
                        ? "#92400e"
                        : "#1d4ed8";

                    return (
                      <Paper
                        key={`${student.studentId || index}-${rank}`}
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
                          {/* Rank */}
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            spacing={2}
                          >
                            <Chip
                              icon={
                                <EmojiEventsOutlinedIcon
                                  sx={{ color: "#ffffff !important" }}
                                />
                              }
                              label={`Rank #${rank}`}
                              sx={{
                                backgroundColor: rankBg,
                                color: "#ffffff",
                                fontWeight: 700
                              }}
                            />
                          </Stack>

                          {/* Student */}
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

                          {/* Stats */}
                          <Stack spacing={1.5}>
                            <Box
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
                                    Total Score
                                  </Typography>
                                </Stack>

                                <Typography
                                  sx={{
                                    color: "#22c55e",
                                    fontWeight: 700,
                                    fontSize: "1rem"
                                  }}
                                >
                                  {item.totalScore ?? "-"}
                                </Typography>
                              </Stack>
                            </Box>

                            <Box
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
                                    Subjects Attempted
                                  </Typography>
                                </Stack>

                                <Typography
                                  sx={{
                                    color: "#cbd5e1",
                                    fontWeight: 700,
                                    fontSize: "1rem"
                                  }}
                                >
                                  {item.subjectsAttempted ?? "-"}
                                </Typography>
                              </Stack>
                            </Box>
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
              No leaderboard data found
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