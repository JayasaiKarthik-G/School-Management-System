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
import CompareArrowsOutlinedIcon from "@mui/icons-material/CompareArrowsOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import { useState } from "react";

import PageTitle from "../../components/common/PageTitle";
import FormCard from "../../components/forms/FormCard";
import LoaderBox from "../../components/common/LoaderBox";
import { reportApi } from "../../api/services";

export default function StudentCompare() {
  const [studentIdA, setStudentIdA] = useState("");
  const [studentIdB, setStudentIdB] = useState("");
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

    if (!studentIdA.trim() || !studentIdB.trim()) {
      showPopup("Please enter both Student ID A and Student ID B", "warning");
      return;
    }

    setLoading(true);
    setData(null);
    setSearched(true);

    try {
      const result = await reportApi.studentCompare(
        studentIdA.trim(),
        studentIdB.trim(),
        examId.trim()
      );

      const finalData = result?.data ? result.data : result;

      if (finalData) {
        setData(finalData);
        showPopup("Student comparison loaded successfully", "success");
      } else {
        setData(null);
        showPopup("No comparison data found", "warning");
      }
    } catch (error) {
      console.error("Student compare error:", error);

      const responseData = error?.response?.data;

      const backendMessage =
        responseData?.message ||
        responseData?.msg ||
        responseData?.error ||
        responseData?.details ||
        "Failed to load student comparison";

      showPopup(
        typeof backendMessage === "string"
          ? backendMessage
          : "Failed to load student comparison",
        "error"
      );

      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const report = data?.data || data || {};
  const studentA = report?.studentA || {};
  const studentB = report?.studentB || {};
  const winner = report?.winner || {};

  const studentAInfo = studentA?.student || {};
  const studentBInfo = studentB?.student || {};

  const studentASubjects = Array.isArray(studentA?.subjectAverages)
    ? studentA.subjectAverages
    : [];
  const studentBSubjects = Array.isArray(studentB?.subjectAverages)
    ? studentB.subjectAverages
    : [];

  const hasComparisonData =
    studentAInfo?.studentId ||
    studentBInfo?.studentId ||
    winner?.studentId;

  return (
    <>
      <Stack spacing={3}>
        <PageTitle
          title="Student Compare"
          subtitle="Compare two students head-to-head"
        />

        <FormCard onSubmit={handleSubmit}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="stretch"
            sx={{ width: "100%", flexWrap: "wrap" }}
          >
            <TextField
              label="Student ID A"
              value={studentIdA}
              onChange={(event) => setStudentIdA(event.target.value)}
              fullWidth
              sx={{ flex: 1 }}
            />

            <TextField
              label="Student ID B"
              value={studentIdB}
              onChange={(event) => setStudentIdB(event.target.value)}
              fullWidth
              sx={{ flex: 1 }}
            />

            <TextField
              label="Exam ID (Optional)"
              value={examId}
              onChange={(event) => setExamId(event.target.value)}
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
                backgroundColor: "#2563eb",
                boxShadow: "none",
                whiteSpace: "nowrap",
                "&:hover": {
                  backgroundColor: "#1d4ed8",
                  boxShadow: "none"
                }
              }}
            >
              Compare
            </Button>
          </Stack>
        </FormCard>

        {loading && <LoaderBox />}

        {!loading && data && hasComparisonData && (
          <>
            {/* Winner Summary */}
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
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmojiEventsOutlinedIcon sx={{ color: "#facc15" }} />
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#f8fafc",
                      fontWeight: 700
                    }}
                  >
                    Comparison Result
                  </Typography>
                </Stack>

                {winner?.studentId ? (
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    flexWrap="wrap"
                    useFlexGap
                  >
                    <Chip
                      icon={
                        <PersonOutlineOutlinedIcon
                          sx={{ color: "#ffffff !important" }}
                        />
                      }
                      label={`Winner: ${winner.fullName || "-"}`}
                      sx={{
                        backgroundColor: "#ca8a04",
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
                      label={`Winner ID: ${winner.studentId ?? "-"}`}
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
                      label={`Margin: ${winner.margin ?? 0}`}
                      sx={{
                        backgroundColor: "#7c3aed",
                        color: "#ffffff",
                        fontWeight: 700
                      }}
                    />

                    {examId.trim() && (
                      <Chip
                        icon={
                          <QuizOutlinedIcon
                            sx={{ color: "#ffffff !important" }}
                          />
                        }
                        label={`Exam ID: ${examId}`}
                        sx={{
                          backgroundColor: "#1d4ed8",
                          color: "#ffffff",
                          fontWeight: 700
                        }}
                      />
                    )}
                  </Stack>
                ) : (
                  <Typography sx={{ color: "#cbd5e1" }}>
                    No winner information available
                  </Typography>
                )}
              </Stack>
            </Paper>

            {/* Student Compare Cards */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(2, 1fr)"
                },
                gap: 3
              }}
            >
              {/* Student A */}
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
                <Stack spacing={2.5}>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CompareArrowsOutlinedIcon sx={{ color: "#38bdf8" }} />
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#f8fafc",
                          fontWeight: 700
                        }}
                      >
                        Student A
                      </Typography>
                    </Stack>

                    <Typography
                      sx={{
                        color: "#f8fafc",
                        fontWeight: 600,
                        fontSize: "1rem"
                      }}
                    >
                      {studentAInfo?.fullName || "-"}
                    </Typography>

                    <Typography sx={{ color: "#94a3b8" }}>
                      Student ID: {studentAInfo?.studentId ?? "-"}
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
                        <TrendingUpOutlinedIcon
                          sx={{ color: "#ffffff !important" }}
                        />
                      }
                      label={`Overall Average: ${studentA?.overallAverage ?? 0}`}
                      sx={{
                        backgroundColor: "#1d4ed8",
                        color: "#ffffff",
                        fontWeight: 700
                      }}
                    />
                  </Stack>

                  <Stack spacing={1.5}>
                    <Typography
                      sx={{
                        color: "#cbd5e1",
                        fontWeight: 700
                      }}
                    >
                      Subject Averages
                    </Typography>

                    {studentASubjects.length === 0 ? (
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          backgroundColor: "#111827",
                          border: "1px solid #1f2937",
                          borderRadius: 2
                        }}
                      >
                        <Typography sx={{ color: "#94a3b8" }}>
                          No subject averages found
                        </Typography>
                      </Paper>
                    ) : (
                      <Stack spacing={1.5}>
                        {studentASubjects.map((subject, index) => (
                          <Paper
                            key={`${subject.subjectId || index}-A`}
                            elevation={0}
                            sx={{
                              p: 2,
                              backgroundColor: "#111827",
                              border: "1px solid #1f2937",
                              borderRadius: 2
                            }}
                          >
                            <Stack spacing={1}>
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

                              <Chip
                                label={`Average: ${subject.averageScore ?? 0}`}
                                size="small"
                                sx={{
                                  alignSelf: "flex-start",
                                  backgroundColor: "#1e293b",
                                  color: "#f8fafc"
                                }}
                              />
                            </Stack>
                          </Paper>
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </Paper>

              {/* Student B */}
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
                <Stack spacing={2.5}>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CompareArrowsOutlinedIcon sx={{ color: "#818cf8" }} />
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#f8fafc",
                          fontWeight: 700
                        }}
                      >
                        Student B
                      </Typography>
                    </Stack>

                    <Typography
                      sx={{
                        color: "#f8fafc",
                        fontWeight: 600,
                        fontSize: "1rem"
                      }}
                    >
                      {studentBInfo?.fullName || "-"}
                    </Typography>

                    <Typography sx={{ color: "#94a3b8" }}>
                      Student ID: {studentBInfo?.studentId ?? "-"}
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
                        <TrendingUpOutlinedIcon
                          sx={{ color: "#ffffff !important" }}
                        />
                      }
                      label={`Overall Average: ${studentB?.overallAverage ?? 0}`}
                      sx={{
                        backgroundColor: "#7c3aed",
                        color: "#ffffff",
                        fontWeight: 700
                      }}
                    />
                  </Stack>

                  <Stack spacing={1.5}>
                    <Typography
                      sx={{
                        color: "#cbd5e1",
                        fontWeight: 700
                      }}
                    >
                      Subject Averages
                    </Typography>

                    {studentBSubjects.length === 0 ? (
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          backgroundColor: "#111827",
                          border: "1px solid #1f2937",
                          borderRadius: 2
                        }}
                      >
                        <Typography sx={{ color: "#94a3b8" }}>
                          No subject averages found
                        </Typography>
                      </Paper>
                    ) : (
                      <Stack spacing={1.5}>
                        {studentBSubjects.map((subject, index) => (
                          <Paper
                            key={`${subject.subjectId || index}-B`}
                            elevation={0}
                            sx={{
                              p: 2,
                              backgroundColor: "#111827",
                              border: "1px solid #1f2937",
                              borderRadius: 2
                            }}
                          >
                            <Stack spacing={1}>
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

                              <Chip
                                label={`Average: ${subject.averageScore ?? 0}`}
                                size="small"
                                sx={{
                                  alignSelf: "flex-start",
                                  backgroundColor: "#1e293b",
                                  color: "#f8fafc"
                                }}
                              />
                            </Stack>
                          </Paper>
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </Paper>
            </Box>
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
              No comparison data found
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