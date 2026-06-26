import { Paper, Stack, Typography, Button, Box } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useNavigate } from "react-router-dom";

export default function SummaryCard({
  title,
  value,
  description,
  icon,
  color,
  path
}) {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: "100%",
        borderRadius: 3,
        backgroundColor: "#0f172a",
        border: "1px solid #1e293b",
        transition: "0.25s",

        "&:hover": {
          transform: "translateY(-5px)",
          borderColor: color,
          boxShadow: `0 10px 30px ${color}30`
        }
      }}
    >
      <Stack spacing={3}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box
            sx={{
              width: 58,
              height: 58,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: `${color}20`,
              mr: 2
            }}
          >
            {icon}
          </Box>

          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              color: "#f8fafc"
            }}
          >
            {value}
          </Typography>
        </Stack>

        <Stack spacing={0.5}>
          <Typography
            variant="h6"
            fontWeight={700}
            color="#f8fafc"
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            color="#94a3b8"
          >
            {description}
          </Typography>
        </Stack>

        <Button
          variant="contained"
          endIcon={<ArrowForwardRoundedIcon />}
          onClick={() => navigate(path)}
          sx={{
            mt: 1,
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            backgroundColor: color,
            boxShadow: "none",

            "&:hover": {
              backgroundColor: color,
              opacity: 0.9,
              boxShadow: "none"
            }
          }}
        >
          View {title}
        </Button>
      </Stack>
    </Paper>
  );
}