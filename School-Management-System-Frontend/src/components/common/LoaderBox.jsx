import { Box, CircularProgress } from "@mui/material";

function LoaderBox() {
  return (
    <Box
      sx={{
        py: 6,
        display: "flex",
        justifyContent: "center"
      }}
    >
      <CircularProgress />
    </Box>
  );
}

export default LoaderBox;