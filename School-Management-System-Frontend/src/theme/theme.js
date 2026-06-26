import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#2563eb" },
    background: { default: "#020617", paper: "#0f172a" },
    text: { primary: "#f8fafc", secondary: "#94a3b8" }
  },
  shape: { borderRadius: 12 },
  typography: { fontFamily: "Arial, Helvetica, sans-serif" }
});

export default theme;
