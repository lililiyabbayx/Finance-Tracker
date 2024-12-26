import { useMemo } from "react";
import Navbar from "@/scenes/navbar";
import { ThemeProvider } from "@mui/material/styles";
import { Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "@/theme";
import Box from "@mui/material/Box";
import Analytics from "./businesspages/analytics";
import Home from "@/scenes/dashboard/index";
import RevenueandExpense from "./businesspages/revenue&expense";
import Transactions from "./businesspages/transactions";
import ChatInterface from "./businesspages/chatInterface";
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
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/revenue&expense" element={<RevenueandExpense />} />
      <Route path="/transaction" element={<Transactions />} />
      <Route path="/chatbot" element={<ChatInterface />} />
    </Routes>
  </Box>
</Box>

    </ThemeProvider>  
  );
};

export default BusinessDashboard;
