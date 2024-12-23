import { useState } from "react";
import React from "react";
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
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;

const Navbar = () => {
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
              <ListItemButton
                selected={selected === "/business-dashboard"}
                component={Link}
                to="/business-dashboard"
                sx={{
                  backgroundColor:
                    selected === "/business-dashboard"
                      ? "black"
                      : "transparent",
                  color: "white",
                  "&.Mui-selected": {
                    backgroundColor: "black", // Ensures selected state overrides default styles
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "black", // Keeps it black on hover when selected
                  },
                  "&:hover": {
                    backgroundColor:
                      selected === "/business-dashboard" ? "black" : "#003f9a", // Lighter blue for hover
                  },
                }}
              >
                <DashboardIcon sx={{ mr: 2, color: "white" }} />
                <ListItemText primary="Dashboard" />
              </ListItemButton>
              <ListItemButton
                selected={selected === "/business-dashboard/revenue&expense"}
                component={Link}
                to="/business-dashboard/revenue&expense"
                sx={{
                  backgroundColor:
                    selected === "/business-dashboard/revenue&expense"
                      ? "black"
                      : "transparent",
                  color: "white",
                  "&.Mui-selected": {
                    backgroundColor: "black", // Ensures selected state overrides default styles
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "black", // Keeps it black on hover when selected
                  },
                  "&:hover": {
                    backgroundColor:
                      selected === "/business-dashboard/revenue&expense"
                        ? "black"
                        : "#003f9a", // Lighter blue for hover
                  },
                }}
              >
                <DashboardIcon sx={{ mr: 2, color: "white" }} />
                <ListItemText primary="Revenue & Expense" />
              </ListItemButton>
              <ListItemButton
                selected={selected === "/business-dashboard/transaction"}
                component={Link}
                to="/business-dashboard/transaction"
                sx={{
                  backgroundColor:
                    selected === "/business-dashboard/transaction"
                      ? "black"
                      : "transparent",
                  color: "white",
                  "&.Mui-selected": {
                    backgroundColor: "black", // Ensures selected state overrides default styles
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "black", // Keeps it black on hover when selected
                  },
                  "&:hover": {
                    backgroundColor:
                      selected === "/business-dashboard/transaction"
                        ? "black"
                        : "#003f9a", // Lighter blue for hover
                  },
                }}
              >
                <DashboardIcon sx={{ mr: 2, color: "white" }} />
                <ListItemText primary="Transaction" />
              </ListItemButton>

              <ListItemButton
                selected={selected === "/business-dashboard/predictions"}
                component={Link}
                to="/business-dashboard/predictions"
                sx={{
                  backgroundColor:
                    selected === "/business-dashboard/predictions"
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
                      selected === "/business-dashboard/predictions"
                        ? "black"
                        : "#003f9a",
                  },
                }}
              >
                <BarChartIcon sx={{ mr: 2 }} />
                <ListItemText primary="Predictions" />
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

export default Navbar;
