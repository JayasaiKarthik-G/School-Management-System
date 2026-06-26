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
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import { useState } from "react";

import PageTitle from "../../components/common/PageTitle";
import FormCard from "../../components/forms/FormCard";
import LoaderBox from "../../components/common/LoaderBox";
import { performanceApi } from "../../api/services";

function TopPerformers() {
  const [limit, setLimit] = useState("");
  const [examId, setExamId] = useState("");
  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

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

    setHasSearched(true);
    setLoading(true);
    setItems([]);
    setTotalCount(0);

    try {
      const queryParams = {};

      if (limit.trim() !== "") {
        queryParams.limit = Number(limit);
      }

      if (examId.trim() !== "") {
        queryParams.examId = Number(examId);
      }

      const result = await performanceApi.topPerformers(queryParams);

      let finalItems = [];
      let finalTotalCount = 0;

      if (Array.isArray(result)) {
        finalItems = result;
        finalTotalCount = result.length;
      } else if (Array.isArray(result?.data)) {
        finalItems = result.data;
        finalTotalCount = result.totalCount ?? result.data.length;
      } else if (Array.isArray(result?.data?.data)) {
        finalItems = result.data.data;
        finalTotalCount =
          result.data.totalCount ?? result.data.data.length;
      }

      setItems(finalItems);
      setTotalCount(finalTotalCount);

      if (finalItems.length === 0) {
        showPopup("No top performers found", "warning");
      } else {
        showPopup("Top performers loaded successfully", "success");
      }
    } catch (error) {
      console.error("Top performers error:", error);

      const responseData = error?.response?.data;

      const backendMessage =
        responseData?.message ||
        responseData?.msg ||
        responseData?.error ||
        responseData?.details ||
        "Failed to load top performers";

      showPopup(backendMessage, "error");
      setItems([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <PageTitle
          title="Top Performers"
          subtitle="Get top students by exam"
        />

        <FormCard onSubmit={handleSubmit}>
          <Stack spacing={2} sx={{ width: "100%" }}>
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
                label="Limit"
                value={limit}
                onChange={(event) => setLimit(event.target.value)}
                fullWidth
                sx={{ flex: 1 }}
              />

              <Button
                type="submit"
                variant="contained"
                sx={{
                  minWidth: { xs: "100%", sm: "200px" },
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
                Get Top Performers
              </Button>
            </Stack>
          </Stack>
        </FormCard>

        {loading ? (
          <LoaderBox />
        ) : hasSearched && items.length > 0 ? (
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
                  variant="h6"
                  sx={{
                    color: "#f8fafc",
                    fontWeight: 700
                  }}
                >
                  Top Performers Summary
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  flexWrap="wrap"
                >
                  <Chip
                    icon={
                      <EmojiEventsOutlinedIcon
                        sx={{ color: "#ffffff !important" }}
                      />
                    }
                    label={`Results Found: ${totalCount}`}
                    sx={{
                      backgroundColor: "#1d4ed8",
                      color: "#ffffff",
                      fontWeight: 700
                    }}
                  />

                  {examId.trim() !== "" && (
                    <Chip
                      icon={
                        <QuizOutlinedIcon
                          sx={{ color: "#f8fafc !important" }}
                        />
                      }
                      label={`Exam ID: ${examId}`}
                      sx={{
                        backgroundColor: "#1e293b",
                        color: "#f8fafc",
                        fontWeight: 600
                      }}
                    />
                  )}

                  {limit.trim() !== "" && (
                    <Chip
                      icon={
                        <NumbersOutlinedIcon
                          sx={{ color: "#f8fafc !important" }}
                        />
                      }
                      label={`Limit: ${limit}`}
                      sx={{
                        backgroundColor: "#1e293b",
                        color: "#f8fafc",
                        fontWeight: 600
                      }}
                    />
                  )}
                </Stack>
              </Stack>
            </Paper>

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
              {items.map((item, index) => (
                <Paper
                  key={`${item.student?.studentId}-${item.rank}-${index}`}
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: 3
                  }}
                >
                  <Stack spacing={2.5}>
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
                        label={`Rank #${item.rank ?? "-"}`}
                        sx={{
                          backgroundColor:
                            item.rank === 1
                              ? "#ca8a04"
                              : item.rank === 2
                              ? "#475569"
                              : item.rank === 3
                              ? "#92400e"
                              : "#1d4ed8",
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
                        label={`Score: ${item.highestScore ?? "-"}`}
                        sx={{
                          backgroundColor: "#047857",
                          color: "#ffffff",
                          fontWeight: 700
                        }}
                      />
                    </Stack>

                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "#111827",
                        border: "1px solid #1f2937"
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <PersonOutlineOutlinedIcon sx={{ color: "#60a5fa" }} />
                        <Box>
                          <Typography
                            sx={{
                              color: "#94a3b8",
                              fontSize: "0.85rem"
                            }}
                          >
                            Student
                          </Typography>
                          <Typography
                            sx={{
                              color: "#f8fafc",
                              fontWeight: 700
                            }}
                          >
                            {item.student?.fullName || "N/A"}
                          </Typography>
                          <Typography
                            sx={{
                              color: "#94a3b8",
                              fontSize: "0.9rem"
                            }}
                          >
                            Student ID: {item.student?.studentId ?? "-"}
                          </Typography>
                        </Box>
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
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <QuizOutlinedIcon sx={{ color: "#f59e0b" }} />
                        <Box>
                          <Typography
                            sx={{
                              color: "#94a3b8",
                              fontSize: "0.85rem"
                            }}
                          >
                            Exam
                          </Typography>
                          <Typography
                            sx={{
                              color: "#f8fafc",
                              fontWeight: 700
                            }}
                          >
                            {item.exam?.examName || "N/A"}
                          </Typography>
                        </Box>
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
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <MenuBookOutlinedIcon sx={{ color: "#34d399" }} />
                        <Box>
                          <Typography
                            sx={{
                              color: "#94a3b8",
                              fontSize: "0.85rem"
                            }}
                          >
                            Subject
                          </Typography>
                          <Typography
                            sx={{
                              color: "#f8fafc",
                              fontWeight: 700
                            }}
                          >
                            {item.subject?.subjectName || "N/A"}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Box>
          </>
        ) : hasSearched ? (
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
              No top performers data found
            </Typography>
          </Paper>
        ) : null}
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

export default TopPerformers;