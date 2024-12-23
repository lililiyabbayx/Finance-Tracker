import { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography, Stack, Paper, CircularProgress } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Define custom theme
const customTheme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }
  
    setLoading(true);
    setErrorMessage(""); // Clear previous errors
  
    try {
      const response = await fetch("http://localhost:3300/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Ensures cookies are sent/received
      });
  
      const data = await response.json();
  
      if (data.token) {
        // Store token in localStorage
        localStorage.setItem("authToken", data.token);
        navigate(data.redirectUrl || "/dashboard"); // Redirect to the appropriate page
      } else {
        setErrorMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <ThemeProvider theme={customTheme}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(to bottom, #0650C6,rgb(197, 196, 228))', // Blue to white gradient
        }}
      >
        <Paper elevation={5} sx={{ padding: 4, borderRadius: 3, maxWidth: 400, width: '100%' }}>
          <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 3, fontWeight: 600 }}>
            Login
          </Typography>
          <form onSubmit={handleLogin}>
            <Stack spacing={3}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ borderRadius: 2 }}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ borderRadius: 2 }}
              />
              {errorMessage && (
                <Typography color="error" sx={{ textAlign: "center" }}>
                  {errorMessage}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  borderRadius: 2,
                  padding: "10px 0",
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;
