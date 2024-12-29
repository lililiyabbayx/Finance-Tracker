import React, { useState } from "react";
import {
  useGetRevenueExpenseComparisonQuery,
  useGetRevenueProfitQuery,
} from "@/states/analyticsApi";
import {
  Box,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
} from "recharts";
import { RevenueExpenseData } from "@/states/types";

const Analytics = () => {
  const [period, setPeriod] = useState("monthly"); // Default period is monthly

  // Fetching revenue-expense comparison data based on selected period
  const { data: revenueExpenseComparison, isLoading: comparisonLoading } =
    useGetRevenueExpenseComparisonQuery({ period });

  const { data: revenueProfit, isLoading: profitLoading } =
    useGetRevenueProfitQuery();

  // Handling loading state
  if (comparisonLoading || profitLoading) {
    return <CircularProgress />;
  }

  // Combine income and expense data by category for the Pie chart
  const incomeExpenseByCategory = revenueExpenseComparison
    ? [
        ...revenueExpenseComparison.revenue.map(
          (revenue: RevenueExpenseData) => ({
            name: `Income - ${revenue._id}`,
            value: revenue.total,
            fill: "#0650C6", // Blue for Income
          })
        ),
        ...revenueExpenseComparison.expenses.map(
          (expense: RevenueExpenseData) => ({
            name: `Expense - ${expense._id}`,
            value: expense.total,
            fill: "#FF6347", // Red for Expenses
          })
        ),
      ]
    : [];

  // Preparing data for the bar chart (revenue vs expenses vs profit)
  const revenueExpenses = revenueExpenseComparison
    ? revenueExpenseComparison.revenue.map(
        (revenue: RevenueExpenseData, index: number) => ({
          name: revenue._id,
          revenue: revenue.total,
          expenses: revenueExpenseComparison.expenses[index]?.total || 0,
          profit:
            revenue.total -
            (revenueExpenseComparison.expenses[index]?.total || 0),
        })
      )
    : [];

  return (
    <div>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h1" textAlign="center">
          Revenue, Expenses & Profit Overview
        </Typography>
      </Box>

      <Box sx={{ padding: 3 }}>
        <Typography variant="h3" textAlign="center">
          Total Income: ${revenueProfit?.totalIncome || 0}
        </Typography>
        <Typography variant="h3" textAlign="center">
          Total Expenses: ${revenueProfit?.totalExpense || 0}
        </Typography>
        <Typography variant="h3" textAlign="center">
          Profit: ${revenueProfit?.profit || 0}
        </Typography>
        <Typography variant="h3" textAlign="center">
          Total Revenue: ${revenueProfit?.totalRevenue || 0}
        </Typography>
      </Box>

      <Box sx={{ padding: 3 }}>
        {/* Period selector */}
        <FormControl fullWidth>
          <InputLabel>Period</InputLabel>
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            label="Period"
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ padding: 3 }}>
        {/* Pie chart - Income vs Expense by Category */}
        <Typography variant="h4" textAlign="center">
          Income vs Expense by Category (
          {period.charAt(0).toUpperCase() + period.slice(1)})
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={incomeExpenseByCategory} // Use the updated data with fill property
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Box sx={{ padding: 3 }}>
        {/* Bar chart - Revenue, Expense, Profit comparison */}
        <Typography variant="h4" textAlign="center">
          Revenue vs Expenses vs Profit (
          {period.charAt(0).toUpperCase() + period.slice(1)} Comparison)
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={revenueExpenses}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#0650C6" />
            <Bar dataKey="expenses" fill="#FF6347" />
            <Bar dataKey="profit" fill="#32CD32" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </div>
  );
};

export default Analytics;
