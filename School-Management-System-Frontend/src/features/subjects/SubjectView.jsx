import { Chip, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageTitle from "../../components/common/PageTitle";
import LoaderBox from "../../components/common/LoaderBox";
import { performanceApi } from "../../api/services";

function SubjectView() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    setLoading(true);

    try {
      const result = await performanceApi.subjectAverages();

      let subjects = [];

      if (Array.isArray(result)) {
        subjects = result;
      } else if (Array.isArray(result?.data)) {
        subjects = result.data;
      } else if (Array.isArray(result?.data?.data)) {
        subjects = result.data.data;
      }

      const selectedSubject = subjects.find(
        (subject) => String(subject.subjectId) === String(id)
      );

      setData(selectedSubject || null);
    } catch (error) {
      console.error("Error loading subject details:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoaderBox />;
  }

  if (!data) {
    return (
      <Stack spacing={3}>
        <PageTitle
          title="Subject Details"
          subtitle="View subject performance information"
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
          <Typography sx={{ color: "#cbd5e1" }}>
            No subject found
          </Typography>
        </Paper>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <PageTitle
        title="Subject Details"
        subtitle="View subject performance information"
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
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography
              variant="h5"
              sx={{
                color: "#f8fafc",
                fontWeight: 700
              }}
            >
              {data.subjectName}
            </Typography>

            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: "0.95rem"
              }}
            >
              Subject ID: {data.subjectId}
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            flexWrap="wrap"
          >
            <Chip
              label={`Average Score: ${Number(data.averageScore || 0).toFixed(2)}`}
              sx={{
                backgroundColor: "#1d4ed8",
                color: "#ffffff",
                fontWeight: 700
              }}
            />

            <Chip
              label={`Total Marks Recorded: ${data.totalMarksRecorded ?? 0}`}
              sx={{
                backgroundColor: "#047857",
                color: "#ffffff",
                fontWeight: 700
              }}
            />

            <Chip
              label={`Highest Score: ${data.highestScore ?? "-"}`}
              sx={{
                backgroundColor: "#1e293b",
                color: "#f8fafc",
                fontWeight: 600
              }}
            />

            <Chip
              label={`Lowest Score: ${data.lowestScore ?? "-"}`}
              sx={{
                backgroundColor: "#1e293b",
                color: "#f8fafc",
                fontWeight: 600
              }}
            />
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default SubjectView;