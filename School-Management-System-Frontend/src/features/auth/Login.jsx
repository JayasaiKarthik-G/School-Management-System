import { useState } from "react";
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "./authSlice";

import LoginIcon from "@mui/icons-material/Login";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      formData.email === "admin@school.com" &&
      formData.password === "123456"
    ) {
      dispatch(loginSuccess({ name: "Admin", email: formData.email }));
      navigate("/dashboard", { replace: true });
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 500,
          p: { xs: 3, sm: 4 },
          backgroundColor: "#0f172a",
          border: "1px solid #1e293b"
        }}
      >
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <Box>
            <Typography variant="h5" sx={{fontWeight: "700"}}>
              School Login
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{fontSize: 12, mt:2}}>
              Email: admin@school.com | Password: 123456
            </Typography>
          </Box>

          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            sx={{
              "& input::-ms-reveal": {
                filter: "invert(1)",
              },
            }}
          />

          {error && <Typography color="error">{error}</Typography>}

          <Button 
            type="submit" 
            variant="contained"
            startIcon={<LoginIcon />}
            sx={{
              textTransform: "none",
              py: 1.2,
              backgroundColor: "#2563eb",
              "&:hover": {
                backgroundColor: "#1b52e7"
              }
            }}
          >
            Login
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}