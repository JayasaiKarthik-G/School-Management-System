import {
  Box,
 Card,
  CardContent,
  Divider,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import NumbersIcon from "@mui/icons-material/Numbers";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageTitle from "../../components/common/PageTitle";
import LoaderBox from "../../components/common/LoaderBox";
import { reportApi } from "../../api/services";

function ExamView() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      const result = await reportApi.examLeaderboard(id);
      console.log("Exam leaderboard response:", result);
      setData(result || null);
    } catch (error) {
      console.error("Error loading exam details:", error);
      setData(null);
    }
  };

  if (!data) {
    return <LoaderBox />;
  }

  const exam = data.exam || {};
  const leaderboard = Array.isArray(data.leaderboard) ? data.leaderboard : [];

  return (
    <Stack spacing={3}>
      <PageTitle
        title="Exam Details"
        subtitle="View full exam leaderboard information"
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
            {exam.examName || "Exam Name"}
          </Typography>

          <Typography sx={{ color: "#94a3b8" }}>
            Exam ID: {exam.examId ?? "-"}
          </Typography>
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
          Leaderboard
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
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)"
              },
              gap: 2,
              alignItems: "stretch"
            }}
          >
            {leaderboard.map((item) => (
              <Card
                key={item.rank}
                elevation={0}
                sx={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <CardContent
                  sx={{
                    p: 2.5,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <Stack
                    spacing={2}
                    sx={{
                      height: "100%"
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      spacing={2}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#f8fafc",
                            fontWeight: 700,
                            wordBreak: "break-word"
                          }}
                        >
                          {item.student?.fullName || "Student Name"}
                        </Typography>

                        <Typography
                          sx={{
                            color: "#94a3b8",
                            fontSize: "0.9rem",
                            mt: 0.5
                          }}
                        >
                          Student ID: {item.student?.studentId ?? "-"}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          px: 1.25,
                          py: 0.5,
                          borderRadius: 2,
                          backgroundColor: "rgba(250, 204, 21, 0.12)",
                          border: "1px solid rgba(250, 204, 21, 0.25)",
                          display: "flex",
                          alignItems: "center",
                          minHeight: "auto"
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                          sx={{ lineHeight: 1 }}
                        >
                          <EmojiEventsIcon
                            sx={{
                              color: "#facc15",
                              fontSize: 16
                            }}
                          />

                          <Typography
                            sx={{
                              color: "#facc15",
                              fontWeight: 700,
                              fontSize: "0.85rem",
                              whiteSpace: "nowrap",
                              lineHeight: 1
                            }}
                          >
                            Rank #{item.rank}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>

                    <Divider sx={{ borderColor: "#1e293b" }} />

                    <Stack spacing={1.2} sx={{ mt: "auto" }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <NumbersIcon sx={{ color: "#60a5fa", fontSize: 20 }} />
                        <Typography
                          sx={{ color: "#cbd5e1", fontSize: "0.95rem" }}
                        >
                          Total Score: {item.totalScore ?? "-"}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <SchoolIcon sx={{ color: "#60a5fa", fontSize: 20 }} />
                        <Typography
                          sx={{ color: "#cbd5e1", fontSize: "0.95rem" }}
                        >
                          Subjects Attempted: {item.subjectsAttempted ?? "-"}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <PersonIcon sx={{ color: "#60a5fa", fontSize: 20 }} />
                        <Typography
                          sx={{ color: "#cbd5e1", fontSize: "0.95rem" }}
                        >
                          Student Rank: #{item.rank ?? "-"}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Stack>
    </Stack>
  );
}

export default ExamView;