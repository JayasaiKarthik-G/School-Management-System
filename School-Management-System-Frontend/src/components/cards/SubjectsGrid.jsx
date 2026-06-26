import {
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import BadgeIcon from "@mui/icons-material/Badge";

function SubjectsGrid({ rows, onView, onEdit, onDelete }) {
  if (rows.length === 0) {
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
          No subjects found
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
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)"
        },
        gap: 2
      }}
    >
      {rows.map((subject) => {
        const subjectId = subject.subjectId || subject.id;

        return (
          <Card
            key={subjectId}
            elevation={0}
            sx={{
              backgroundColor: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 3,
              height: "100%"
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={2}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#f8fafc",
                        fontWeight: 700,
                        fontSize: { xs: "1rem", sm: "1.1rem" }
                      }}
                    >
                      {subject.subjectName}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#94a3b8",
                        fontSize: "0.9rem",
                        mt: 0.5
                      }}
                    >
                      Subject ID: {subjectId}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      backgroundColor: "#1e293b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}
                  >
                    <MenuBookIcon sx={{ color: "#60a5fa" }} />
                  </Box>
                </Stack>

                <Stack spacing={1.2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <BadgeIcon sx={{ color: "#60a5fa", fontSize: 20 }} />
                    <Typography sx={{ color: "#cbd5e1", fontSize: "0.95rem" }}>
                      Subject Name: {subject.subjectName}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  spacing={1}
                  sx={{ pt: 1 }}
                >
                  <IconButton
                    onClick={() => onView(subjectId)}
                    sx={{
                      color: "#38bdf8",
                      backgroundColor: "rgba(56, 189, 248, 0.08)"
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>

                  <IconButton
                    onClick={() => onEdit(subjectId)}
                    sx={{
                      color: "#facc15",
                      backgroundColor: "rgba(250, 204, 21, 0.08)"
                    }}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    onClick={() => onDelete(subjectId)}
                    sx={{
                      color: "#f87171",
                      backgroundColor: "rgba(248, 113, 113, 0.08)"
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}

export default SubjectsGrid;