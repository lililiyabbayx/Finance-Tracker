import React, { useMemo } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { themeSettings } from "../theme";
import AddIncomeExpense from "./personalpages/addEntry";
import BudgetSettings from "./personalpages/budget";
import ExpenseSummary from "./personalpages/expSum";
import EmailAlert from "./personalpages/emailAlert";
import MonthlyReport from "./personalpages/report";
import PersonalHome from "../personal_scenes/dashboard";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
} from '@mui/material';
import {
  Home as HomeIcon,
  AddCircle as AddIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
  Notifications as AlertIcon,
  BarChart as ReportIcon,
  AccountCircle as ProfileIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 240;

const PersonalDashboard = () => {
  const theme = useMemo(() => createTheme(themeSettings), []);
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/personal-dashboard' },
    { text: 'Add Transaction', icon: <AddIcon />, path: '/personal-dashboard/add-income-expense' },
    { text: 'Budget Settings', icon: <SettingsIcon />, path: '/personal-dashboard/budget-settings' },
    { text: 'Expense Summary', icon: <AssessmentIcon />, path: '/personal-dashboard/expense-summary' },
    { text: 'Email Alerts', icon: <AlertIcon />, path: '/personal-dashboard/email-alert' },
    { text: 'Monthly Report', icon: <ReportIcon />, path: '/personal-dashboard/monthly-report' },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Left Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              backgroundColor: theme.palette.primary.main,
              color: 'white',
            },
          }}
        >
          {/* Logo/Title Section */}
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                py: 2,
              }}
            >
              Fin Track
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <ProfileIcon sx={{ fontSize: 40 }} />
            </Box>
          </Box>

          <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />

          {/* Navigation Items */}
          <List sx={{ pt: 2 }}>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255, 255, 255, 0.16)',
                    },
                  }}
                  selected={window.location.pathname === item.path}
                >
                  <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: 'medium'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: theme.palette.background.default,
            minHeight: '100vh',
          }}
        >
          <Routes>
            <Route index element={<PersonalHome />} />
            <Route path="add-income-expense" element={<AddIncomeExpense />} />
            <Route path="budget-settings" element={<BudgetSettings />} />
            <Route path="expense-summary" element={<ExpenseSummary />} />
            <Route path="email-alert" element={<EmailAlert />} />
            <Route path="monthly-report" element={<MonthlyReport />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default PersonalDashboard;
