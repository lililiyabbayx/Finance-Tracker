import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  useTheme,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import BarChartIcon from "@mui/icons-material/BarChart";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import BudgetIcon from "@mui/icons-material/AccountBalanceWallet";
import EmailIcon from "@mui/icons-material/Email";
import ReportIcon from "@mui/icons-material/Description";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;

const PersonalNavbar = () => {
  const { palette } = useTheme();
  const location = useLocation(); // Hook to get the current route
  const [openDrawer, setOpenDrawer] = useState(false);

  // Determine the selected state based on the current path
  const selected = location.pathname;

  // Toggle Drawer
  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        {/* Drawer for navigation */}
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "#0650C6",
            },
          }}
          variant="permanent"
          open={openDrawer}
        >
          <Box sx={{ display: "flex", flexDirection: "column", padding: 2 }}>
            {/* Logo */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                color: "white",
              }}
            >
              <BusinessCenterIcon sx={{ fontSize: "28px", mr: 1 }} />
              <Typography variant="h4" fontSize="16px">
                Fin-Track
              </Typography>
            </Box>

            {/* Navigation Links */}
            <List>
              {/* Home */}
              <ListItemButton
                selected={selected === "/personal-dashboard"}
                component={Link}
                to="/personal-dashboard"
                sx={{
                  backgroundColor:
                    selected === "/personal-dashboard" ? "black" : "transparent",
                  color: "white",
                  "&.Mui-selected": {
                    backgroundColor: "black",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "black",
                  },
                  "&:hover": {
                    backgroundColor:
                      selected === "/personal-dashboard" ? "black" : "#003f9a",
                  },
                }}
              >
                <HomeIcon sx={{ mr: 2, color: "white" }} />
                <ListItemText primary="Home" />
              </ListItemButton>

              {/* Add Income/Expense */}
              <ListItemButton
                selected={selected === "/personal-dashboard/add-income-expense"}
                component={Link}
                to="/personal-dashboard/add-income-expense"
                sx={{
                  backgroundColor:
                    selected === "/personal-dashboard/add-income-expense"
                      ? "black"
                      : "transparent",
                  color: "white",
                  "&.Mui-selected": {
                    backgroundColor: "black",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "black",
                  },
                  "&:hover": {
                    backgroundColor:
                      selected === "/personal-dashboard/add-income-expense"
                        ? "black"
                        : "#003f9a",
                  },
                }}
              >
                <AddIcon sx={{ mr: 2 }} />
                <ListItemText primary="Add Income/Expense" />
              </ListItemButton>

              {/* Budget Settings */}
              <ListItemButton
                selected={selected === "/personal-dashboard/budget-settings"}
                component={Link}
                to="/personal-dashboard/budget-settings"
                sx={{
                  backgroundColor:
                    selected === "/personal-dashboard/budget-settings"
                      ? "black"
                      : "transparent",
                  color: "white",
                  "&.Mui-selected": {
                    backgroundColor: "black",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "black",
                  },
                  "&:hover": {
                    backgroundColor:
                      selected === "/personal-dashboard/budget-settings"
                        ? "black"
                        : "#003f9a",
                  },
                }}
              >
                <BudgetIcon sx={{ mr: 2 }} />
                <ListItemText primary="Budget Settings" />
              </ListItemButton>

              {/* Expense Summary */}
              <ListItemButton
                selected={selected === "/personal-dashboard/expense-summary"}
                component={Link}
                to="/personal-dashboard/expense-summary"
                sx={{
                  backgroundColor:
                    selected === "/personal-dashboard/expense-summary"
                      ? "black"
                      : "transparent",
                  color: "white",
                  "&.Mui-selected": {
                    backgroundColor: "black",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "black",
                  },
                  "&:hover": {
                    backgroundColor:
                      selected === "/personal-dashboard/expense-summary"
                        ? "black"
                        : "#003f9a",
                  },
                }}
              >
                <BarChartIcon sx={{ mr: 2 }} />
                <ListItemText primary="Expense Summary" />
              </ListItemButton>

              {/* Email Alerts */}
              <ListItemButton
                selected={selected === "/personal-dashboard/email-alert"}
                component={Link}
                to="/personal-dashboard/email-alert"
                sx={{
                  backgroundColor:
                    selected === "/personal-dashboard/email-alert"
                      ? "black"
                      : "transparent",
                  color: "white",
                  "&.Mui-selected": {
                    backgroundColor: "black",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "black",
                  },
                  "&:hover": {
                    backgroundColor:
                      selected === "/personal-dashboard/email-alert"
                        ? "black"
                        : "#003f9a",
                  },
                }}
              >
                <EmailIcon sx={{ mr: 2 }} />
                <ListItemText primary="Email Alerts" />
              </ListItemButton>

              {/* Monthly Report */}
              <ListItemButton
                selected={selected === "/personal-dashboard/monthly-report"}
                component={Link}
                to="/personal-dashboard/monthly-report"
                sx={{
                  backgroundColor:
                    selected === "/personal-dashboard/monthly-report"
                      ? "black"
                      : "transparent",
                  color: "white",
                  "&.Mui-selected": {
                    backgroundColor: "black",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "black",
                  },
                  "&:hover": {
                    backgroundColor:
                      selected === "/personal-dashboard/monthly-report"
                        ? "black"
                        : "#003f9a",
                  },
                }}
              >
                <ReportIcon sx={{ mr: 2 }} />
                <ListItemText primary="Monthly Report" />
              </ListItemButton>
            </List>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: palette.background.default,
            padding: 3,
            transition: "margin-left 0.3s ease",
            marginLeft: openDrawer ? `${drawerWidth}px` : 0,
          }}
        >
          {/* Toggle Drawer Button */}
          <Box
            sx={{
              position: "absolute",
              top: 20,
              left: 20,
              cursor: "pointer",
              zIndex: 10,
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PersonalNavbar;
