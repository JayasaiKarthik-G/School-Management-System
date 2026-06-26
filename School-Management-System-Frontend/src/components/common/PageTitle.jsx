import { Box, Typography } from "@mui/material";
export default function PageTitle({ title, subtitle }) {
  return (
    <Box>
      <Typography variant="h5" fontWeight={700}>{title}</Typography>
      <Typography variant="body2" color="text.secondary" mt={0.5}>{subtitle}</Typography>
    </Box>
  );
}
