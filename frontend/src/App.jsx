import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './theme';
import { useMemo } from 'react';

// Page imports
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BusinessDashboard from './pages/BusinessDashboard';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  const theme = useMemo(() => createTheme(themeSettings), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Box sx={{ height: '100vh' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/business-dashboard" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/business-dashboard/*" element={<BusinessDashboard />} />
            <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
          </Routes>
        </Box>
    </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
