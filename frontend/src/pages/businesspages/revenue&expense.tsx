import { useMemo } from "react";
import { useGetKpisQuery } from "@/states/kpiApi";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Navbar from "@/scenes/navbar"; // Ensure this path is correct
import {
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from "recharts"; // Recharts imports

const RevenueandExpense = () => {
  const { data } = useGetKpisQuery();

  // Memoize the data transformation for efficiency
  const revenueExpenses = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, revenue, expenses }) => {
        return {
          name: month.substring(0, 3), // Shorten month name (e.g., "January" -> "Jan")
          revenue: revenue,
          expenses: expenses,
        };
      })
    );
  }, [data]);

  return (
    <div>
      <Navbar />
      <Box sx={{ padding: 3 }}>
        <Typography variant="h1" textAlign="center" color="#000">
          Revenue and Expenses Overview
        </Typography>
      </Box>
      <Box sx={{ padding: 3 }}>
        <h1>Revenue and Expenses Overview</h1>
        {/* Display the graph and list side by side */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Graph Area */}
          <Box sx={{ flex: 1 }}>
            <h3>Revenue & Expense Graph</h3>
            {/* Graph Component */}
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart
                width={500}
                height={400}
                data={revenueExpenses}
                margin={{ top: 15, right: 25, left: -10, bottom: 60 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0650C6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0650C6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorExpenses"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#0650C6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0650C6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  style={{ fontSize: "10px" }}
                />
                <YAxis
                  axisLine={{ strokeWidth: "0" }}
                  tickLine={false}
                  style={{ fontSize: "10px" }}
                  domain={[8000, 23000]}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  dot={true}
                  stroke="#0650C6"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  dot={true}
                  stroke="#0650C6"
                  fillOpacity={1}
                  fill="url(#colorExpenses)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>

          {/* Scrollable List Area */}
          <Box
            sx={{
              flex: 1,
              maxHeight: 400, // Set the max height for the scrollable area
              overflow: "auto", // Make it scrollable
              border: "1px solid #ddd",
              borderRadius: 2,
              padding: 2,
            }}
          >
            <h3>Revenue and Expenses for Each Month</h3>
            <List>
              {revenueExpenses?.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={item.name}
                    secondary={`Revenue: $${item.revenue}, Expenses: $${item.expenses}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default RevenueandExpense;
