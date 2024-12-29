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
  Collapse,
} from "@mui/material";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const drawerWidth = 240;

const Navbar = () => {
  const { palette } = useTheme();
  const location = useLocation();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openAdditionalFeature, setOpenAdditionalFeature] = useState(false);

  const selected = location.pathname;

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleAdditionalFeatureClick = () => {
    setOpenAdditionalFeature(!openAdditionalFeature);
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
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
                    backgroundColor: "black",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "black",
                  },
                  "&:hover": {
                    backgroundColor:
                      selected === "/business-dashboard" ? "black" : "#003f9a",
                  },
                }}
              >
                <DashboardIcon sx={{ mr: 2, color: "white" }} />
                <ListItemText primary="Dashboard" />
              </ListItemButton>

              {/* Analytics */}
              <ListItemButton
                selected={selected === "/business-dashboard/analytics"}
                component={Link}
                to="/business-dashboard/analytics"
                sx={{
                  backgroundColor:
                    selected === "/business-dashboard/analytics"
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
                      selected === "/business-dashboard/analytics" ? "black" : "#003f9a",
                  },
                }}
              >
                <BarChartIcon sx={{ mr: 2, color: "white" }} />
                <ListItemText primary="Analytics" />
              </ListItemButton>

              {/* Revenue & Expense */}
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
                    backgroundColor: "black",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "black",
                  },
                  "&:hover": {
                    backgroundColor:
                      selected === "/business-dashboard/revenue&expense" ? "black" : "#003f9a",
                  },
                }}
              >
                <BarChartIcon sx={{ mr: 2, color: "white" }} />
                <ListItemText primary="Revenue & Expense" />
              </ListItemButton>

              {/* Transactions */}
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
                    backgroundColor: "black",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "black",
                  },
                  "&:hover": {
                    backgroundColor:
                      selected === "/business-dashboard/transaction" ? "black" : "#003f9a",
                  },
                }}
              >
                <BarChartIcon sx={{ mr: 2, color: "white" }} />
                <ListItemText primary="Transactions" />
              </ListItemButton>

              <ListItemButton
                selected={selected === "/business-dashboard/Chatbot"}
                component={Link}
                to="/business-dashboard/Chatbot"
                sx={{
                  backgroundColor:
                    selected === "/business-dashboard/Chatbot"
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
                      selected === "/business-dashboard/Chatbot"
                        ? "black"
                        : "#003f9a",
                  },
                }}
              >
                <BarChartIcon sx={{ mr: 2 }} />
                <ListItemText primary="Chatbot" />
              </ListItemButton>

              {/* Additional Feature */}
              <ListItemButton
                onClick={handleAdditionalFeatureClick}
                sx={{
                  color: "white",
                  "&.Mui-selected": {
                    backgroundColor: "black",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "black",
                  },
                  "&:hover": {
                    backgroundColor: "#003f9a",
                  },
                }}
              >
                <DashboardIcon sx={{ mr: 2, color: "white" }} />
                <ListItemText primary="Additional Feature" />
                {openAdditionalFeature ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openAdditionalFeature} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton
                    selected={selected === "/business-dashboard/recurrent-entries"}
                    component={Link}
                    to="/business-dashboard/recurrent-entries"
                    sx={{
                      pl: 4,
                      color: "white",
                      "&.Mui-selected": {
                        backgroundColor: "black",
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "black",
                      },
                      "&:hover": {
                        backgroundColor: "#003f9a",
                      },
                    }}
                  >
                    <ListItemText primary="Recurrent Entries" />
                  </ListItemButton>
                  <ListItemButton
                    selected={selected === "/business-dashboard/financial-insights"}
                    component={Link}
                    to="/business-dashboard/financial-insights"
                    sx={{
                      pl: 4,
                      color: "white",
                      "&.Mui-selected": {
                        backgroundColor: "black",
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "black",
                      },
                      "&:hover": {
                        backgroundColor: "#003f9a",
                      },
                    }}
                  >
                    <ListItemText primary="Financial Insights" />
                  </ListItemButton>
                  <ListItemButton
                    selected={selected === "/business-dashboard/travel-expenses"}
                    component={Link}
                    to="/business-dashboard/travel-expenses"
                    sx={{
                      pl: 4,
                      color: "white",
                      "&.Mui-selected": {
                        backgroundColor: "black",
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "black",
                      },
                      "&:hover": {
                        backgroundColor: "#003f9a",
                      },
                    }}
                  >
                    <ListItemText primary="Travel Expenses" />
                  </ListItemButton>
                  <ListItemButton
                    selected={selected === "/business-dashboard/financial-widgets"}
                    component={Link}
                    to="/business-dashboard/financial-widgets"
                    sx={{
                      pl: 4,
                      color: "white",
                      "&.Mui-selected": {
                        backgroundColor: "black",
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "black",
                      },
                      "&:hover": {
                        backgroundColor: "#003f9a",
                      },
                    }}
                  >
                    <ListItemText primary="Financial Widgets" />
                  </ListItemButton>
                </List>
              </Collapse>
            </List>
          </Box>
        </Drawer>
      </Box>
    </>
  );
};

export default Navbar;