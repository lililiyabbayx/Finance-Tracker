import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { Navbar } from "../scenes/navbar/index.tsx";
import Home from "@/scenes/dashboard";
import Analytics from "./businesspages/analytics";
import RevenueAndExpense from "./businesspages/revenue-expense";
import Transactions from "./businesspages/transactions";
import RecurrentEntries from "./businesspages/RecurrentEntries";
import FinancialInsights from "./businesspages/FinancialInsights";
import TravelExpenses from "./businesspages/TravelExpenses";
import FinancialWidgets from "./businesspages/FinancialWidgets";

const BusinessDashboard = () => {
  return (
    <Box sx={{ display: "flex", width: "100%", height: "100vh" }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: "calc(100% - 240px)",
          ml: "240px",
          mt: "64px",
          bgcolor: "#F5F5F5",
          minHeight: "100vh",
          overflow: "auto"
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="revenue-expense" element={<RevenueAndExpense />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="recurrent-entries" element={<RecurrentEntries />} />
          <Route path="financial-insights" element={<FinancialInsights />} />
          <Route path="travel-expenses" element={<TravelExpenses />} />
          <Route path="financial-widgets" element={<FinancialWidgets />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default BusinessDashboard;