import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import {
  HomeOutlined,
  AnalyticsOutlined,
  MonetizationOnOutlined,
  ReceiptLongOutlined,
  AutorenewOutlined,
  InsightsOutlined,
  FlightTakeoffOutlined,
  WidgetsOutlined,
} from '@mui/icons-material';

interface NavItem {
  text: string;
  icon: JSX.Element;
  path: string;
}

const navItems: NavItem[] = [
  {
    text: "Home",
    icon: <HomeOutlined />,
    path: "/"
  },
  {
    text: "Analytics",
    icon: <AnalyticsOutlined />,
    path: "/analytics"
  },
  {
    text: "Revenue & Expense",
    icon: <MonetizationOnOutlined />,
    path: "/revenue-expense"
  },
  {
    text: "Transactions",
    icon: <ReceiptLongOutlined />,
    path: "/transactions"
  },
  {
    text: "Recurrent Entries",
    icon: <AutorenewOutlined />,
    path: "/recurrent-entries"
  },
  {
    text: "Financial Insights",
    icon: <InsightsOutlined />,
    path: "/financial-insights"
  },
  {
    text: "Travel Expenses",
    icon: <FlightTakeoffOutlined />,
    path: "/travel-expenses"
  },
  {
    text: "Financial Widgets",
    icon: <WidgetsOutlined />,
    path: "/financial-widgets"
  }
];

export const Navbar: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #1976D2 0%, #2196F3 100%)',
          borderRight: 'none',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: "64px" }}>
        <List>
          {navItems.map(({ text, icon, path }) => {
            const isActive = location.pathname === path;
            
            return (
              <ListItem
                key={text}
                component={Link}
                to={path}
                sx={{
                  backgroundColor: isActive 
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'transparent',
                  color: '#fff',
                  margin: '4px 8px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                    minWidth: '40px',
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontSize: "0.95rem",
                      fontWeight: isActive ? 600 : 400,
                      letterSpacing: '0.5px',
                    }}
                  >
                    {text}
                  </Typography>
                </ListItemText>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};