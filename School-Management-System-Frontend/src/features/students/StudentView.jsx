import {
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageTitle from "../../components/common/PageTitle";
import LoaderBox from "../../components/common/LoaderBox";
import { performanceApi } from "../../api/services";

function StudentView() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      const result = await performanceApi.student(id);
      console.log("Student performance response:", result);

      if (result?.data) {
        setData(result.data);
      } else {
        setData(result);
      }
    } catch (error) {
      console.error("Error loading student performance:", error);
      setData(null);
    }
  };

  if (!data) {
    return <LoaderBox />;
  }

  const student = data.student || {};
  const performance = Array.isArray(data.performance) ? data.performance : [];

  return (
    <Stack spacing={3}>
      <PageTitle
        title="Student Details"
        subtitle="View full student performance information"
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
            {student.fullName || "Student Name"}
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
              label={`Enrollment Year: ${student.enrollmentYear ?? "-"}`}
              sx={{
                backgroundColor: "#1e293b",
                color: "#f8fafc",
                fontWeight: 600
              }}
            />

            <Chip
              label={`Overall Average: ${data.overallAverage ?? "-"}%`}
              sx={{
                backgroundColor: "#1d4ed8",
                color: "#ffffff",
                fontWeight: 700
              }}
            />

            <Chip
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
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(3, minmax(0, 1fr))"
              }
            }}
          >
            {performance.map((exam) => (
              <Paper
                key={exam.examId}
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
                      label={`Total Score: ${exam.totalScore ?? "-"}`}
                      sx={{
                        backgroundColor: "#1e293b",
                        color: "#f8fafc"
                      }}
                    />
                    <Chip
                      label={`Average Score: ${exam.averageScore ?? "-"}`}
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

                    {(exam.subjectScores || []).map((subject, index) => (
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
                          spacing={1}
                        >
                          <Typography
                            sx={{
                              color: "#f8fafc",
                              fontWeight: 600
                            }}
                          >
                            {subject.subjectName}
                          </Typography>

                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            <Chip
                              label={`Score: ${subject.score ?? "-"}`}
                              size="small"
                              sx={{
                                backgroundColor: "#1e293b",
                                color: "#f8fafc"
                              }}
                            />
                            <Chip
                              label={subject.status || "-"}
                              size="small"
                              sx={{
                                backgroundColor:
                                  subject.status === "Pass"
                                    ? "#065f46"
                                    : "#7f1d1d",
                                color: "#ffffff",
                                fontWeight: 700
                              }}
                            />
                          </Stack>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Box>
        )}
      </Stack>
    </Stack>
  );
}

export default StudentView;