import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography, Stack } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Define your custom theme or import it
const customTheme = createTheme({
  // Add customizations based on your second code snippet
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3300/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.token) {
        alert("Login successful");
        localStorage.setItem("token", data.token);
        navigate(data.redirectUrl); // Redirect based on role
      } else {
        alert(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ maxWidth: 400, margin: "0 auto", padding: 3 }}>
        <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 3 }}>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
          </Stack>
        </form>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;
