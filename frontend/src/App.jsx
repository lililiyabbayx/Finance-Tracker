import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import PersonalDashboard from './pages/PersonalDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './theme';
import { useMemo } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';

const App = () => {
  const theme = useMemo(() => createTheme(themeSettings), []);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box width="100%" height="100%">
        {/* Wrap Routes with BrowserRouter */}
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/personal-dashboard" element={<PersonalDashboard />} />
            <Route path="/business-dashboard/*" element={<BusinessDashboard />} />
          </Routes>
        </Router>
      </Box>
    </ThemeProvider>
  );
};

export default App;
