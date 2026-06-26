import {
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageTitle from "../../components/common/PageTitle";
import LoaderBox from "../../components/common/LoaderBox";
import { markApi } from "../../api/services";

function MarkView() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      const result = await markApi.getById(id);
      console.log("Mark details response:", result);

      if (result?.data) {
        setData(result.data);
      } else {
        setData(result);
      }
    } catch (error) {
      console.error("Error loading mark details:", error);
      setData(null);
    }
  };

  if (!data) {
    return <LoaderBox />;
  }

  const student = data.student || {};
  const subject = data.subject || {};
  const exam = data.exam || {};
  const score = Number(data.score ?? 0);

  // your rule
  const status = score <= 35 ? "Fail" : "Pass";

  return (
    <Stack spacing={3}>
      <PageTitle
        title="Mark Details"
        subtitle="View full mark information"
      />

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
            Mark #{data.markId ?? id}
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            flexWrap="wrap"
          >
            <Chip
              label={`Score: ${score}`}
              sx={{
                backgroundColor: "#1d4ed8",
                color: "#ffffff",
                fontWeight: 700
              }}
            />

            <Chip
              label={`Status: ${status}`}
              sx={{
                backgroundColor: status === "Pass" ? "#047857" : "#b91c1c",
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
          {/* Student + Subject + Exam in row, xs -> column */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
          >
            {/* Student */}
            <Box
              sx={{
                flex: 1,
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
                    {student.fullName || "N/A"}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#94a3b8",
                      fontSize: "0.9rem"
                    }}
                  >
                    Student ID: {student.studentId ?? "-"}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Subject */}
            <Box
              sx={{
                flex: 1,
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
                    {subject.subjectName || "N/A"}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#94a3b8",
                      fontSize: "0.9rem"
                    }}
                  >
                    Subject ID: {subject.subjectId ?? "-"}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Exam */}
            <Box
              sx={{
                flex: 1,
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
                    {exam.examName || "N/A"}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#94a3b8",
                      fontSize: "0.9rem"
                    }}
                  >
                    Exam ID: {exam.examId ?? "-"}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>

          <Divider sx={{ borderColor: "#334155" }} />

          {/* Score + Result same row, xs -> column */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
          >
            <Box
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 2,
                backgroundColor: "#111827",
                border: "1px solid #1f2937"
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <NumbersOutlinedIcon sx={{ color: "#38bdf8" }} />
                <Box>
                  <Typography
                    sx={{
                      color: "#94a3b8",
                      fontSize: "0.85rem"
                    }}
                  >
                    Score
                  </Typography>
                  <Typography
                    sx={{
                      color: "#f8fafc",
                      fontWeight: 700,
                      fontSize: "1.1rem"
                    }}
                  >
                    {score}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 2,
                backgroundColor: "#111827",
                border: "1px solid #1f2937"
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                {status === "Pass" ? (
                  <CheckCircleIcon sx={{ color: "#22c55e" }} />
                ) : (
                  <CancelIcon sx={{ color: "#ef4444" }} />
                )}

                <Box>
                  <Typography
                    sx={{
                      color: "#94a3b8",
                      fontSize: "0.85rem"
                    }}
                  >
                    Result
                  </Typography>
                  <Typography
                    sx={{
                      color: status === "Pass" ? "#22c55e" : "#ef4444",
                      fontWeight: 700,
                      fontSize: "1.1rem"
                    }}
                  >
                    {status}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default MarkView;