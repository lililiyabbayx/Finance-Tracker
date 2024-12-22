import { useMemo } from "react";
import Navbar from "@/scenes/navbar";
import { ThemeProvider } from "@mui/material/styles";
import { Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "@/theme";
import Box from "@mui/material/Box";
import Predictions from "./businesspages/prediction";
import Home from "@/scenes/dashboard/index";
import RevenueandExpense from "./businesspages/revenue&expense";
const BusinessDashboard = () => {
  const theme = useMemo(() => createTheme(themeSettings), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
  <Navbar /> {/* Sidebar */}
  <Box
    component="main"
    sx={{
      flexGrow: 1,
      p: 3, // Padding for content
      width: "calc(100% - 240px)", // Adjust based on Navbar width
    }}
  >
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/predictions" element={<Predictions />} />
      <Route path="/revenue&expense" element={<RevenueandExpense />} />
    </Routes>
  </Box>
</Box>

    </ThemeProvider>  
  );
};

export default BusinessDashboard;
