import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";

const FinancialInsights = () => {
  const [timeRange, setTimeRange] = useState("Last Month");
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axios.get("http://localhost:3300/api/v1/financial-insights");
        setInsights(response.data);
      } catch (error) {
        console.error("Failed to fetch financial insights", error);
      }
    };

    fetchInsights();
  }, []);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Financial Insights
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Time Range</InputLabel>
        <Select value={timeRange} onChange={handleTimeRangeChange}>
          <MenuItem value="Last Month">Last Month</MenuItem>
          <MenuItem value="Last Quarter">Last Quarter</MenuItem>
          <MenuItem value="Last Half Year">Last Half Year</MenuItem>
          <MenuItem value="Last Year">Last Year</MenuItem>
        </Select>
      </FormControl>
      <Grid container spacing={3}>
        {/* Render insights data here */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Predictive Analytics</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={insights}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinancialInsights;