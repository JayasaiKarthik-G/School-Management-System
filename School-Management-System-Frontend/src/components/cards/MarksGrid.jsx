import {
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlineOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";

function MarksGrid({ rows = [], onView, onEdit, onDelete }) {
  const groupedMarks = rows.reduce((acc, item) => {
    const studentId = item?.student?.studentId || "unknown";

    if (!acc[studentId]) {
      acc[studentId] = {
        student: item.student,
        marks: []
      };
    }

    acc[studentId].marks.push(item);
    return acc;
  }, {});

  const studentGroups = Object.values(groupedMarks);

  if (!studentGroups.length) {
    return (
      <Box
        sx={{
          p: 3,
          textAlign: "center",
          backgroundColor: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 3
        }}
      >
        <Typography sx={{ color: "#cbd5e1" }}>
          No exams found
        </Typography>
      </Box>
    );
  }

  return (
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
      {studentGroups.map((group) => (
        <Card
          key={group.student?.studentId}
          elevation={0}
          sx={{
            backgroundColor: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 3,
            overflow: "hidden"
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {/* Student Header */}
            <Box
              sx={{
                px: 3,
                py: 2.5,
                borderBottom: "1px solid #1e293b",
                background:
                  "linear-gradient(135deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,1) 100%)"
              }}
            >
              <Stack spacing={1}>
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <PersonOutlineIcon sx={{ color: "#60a5fa" }} />
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#f8fafc",
                      fontWeight: 700
                    }}
                  >
                    {group.student?.fullName || "Student Name"}
                  </Typography>
                </Stack>

                <Typography
                  sx={{
                    color: "#94a3b8",
                    fontSize: "0.95rem"
                  }}
                >
                  Student ID: {group.student?.studentId ?? "-"} • Total Marks:{" "}
                  {group.marks.length}
                </Typography>
              </Stack>
            </Box>

            {/* Marks List */}
            <Stack spacing={0}>
              {group.marks.map((mark, index) => (
                <Box key={mark.markId}>
                  <Box
                    sx={{
                      px: 3,
                      py: 2.25
                    }}
                  >
                    <Stack spacing={1.75}>
                      {/* Subject */}
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        flexWrap="wrap"
                      >
                        <MenuBookOutlinedIcon
                          sx={{ color: "#38bdf8", fontSize: 19 }}
                        />
                        <Typography
                          sx={{
                            color: "#f8fafc",
                            fontWeight: 600,
                            fontSize: "0.98rem"
                          }}
                        >
                          {mark.subject?.subjectName || "-"}
                        </Typography>
                      </Stack>

                      {/* Exam */}
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        flexWrap="wrap"
                      >
                        <QuizOutlinedIcon
                          sx={{ color: "#818cf8", fontSize: 19 }}
                        />
                        <Typography
                          sx={{
                            color: "#cbd5e1",
                            fontSize: "0.95rem"
                          }}
                        >
                          {mark.exam?.examName || "-"}
                        </Typography>
                      </Stack>

                      {/* Score */}
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <NumbersOutlinedIcon
                          sx={{ color: "#22c55e", fontSize: 19 }}
                        />
                        <Typography
                          sx={{
                            color: "#22c55e",
                            fontWeight: 700,
                            fontSize: "0.95rem"
                          }}
                        >
                          Score: {mark.score ?? "-"}
                        </Typography>
                      </Stack>

                      {/* Actions - always below details */}
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            onClick={() => onView?.(mark.markId)}
                            sx={{
                              color: "#38bdf8",
                              backgroundColor: "rgba(56, 189, 248, 0.08)",
                              border: "1px solid rgba(56, 189, 248, 0.18)",
                              "&:hover": {
                                backgroundColor: "rgba(56, 189, 248, 0.16)"
                              }
                            }}
                          >
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => onEdit?.(mark.markId)}
                            sx={{
                              color: "#facc15",
                              backgroundColor: "rgba(250, 204, 21, 0.08)",
                              border: "1px solid rgba(250, 204, 21, 0.18)",
                              "&:hover": {
                                backgroundColor: "rgba(250, 204, 21, 0.16)"
                              }
                            }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => onDelete?.(mark.markId)}
                            sx={{
                              color: "#f87171",
                              backgroundColor: "rgba(248, 113, 113, 0.08)",
                              border: "1px solid rgba(248, 113, 113, 0.18)",
                              "&:hover": {
                                backgroundColor: "rgba(248, 113, 113, 0.16)"
                              }
                            }}
                          >
                            <DeleteOutlineOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </Box>

                  {index !== group.marks.length - 1 && (
                    <Divider sx={{ borderColor: "#1e293b" }} />
                  )}
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default MarksGrid;