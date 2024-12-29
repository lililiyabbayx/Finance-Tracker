import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  RevenueExpenseComparisonData,
  RevenueProfitData,
} from "@/states/types";

// Dynamically use the base URL from environment variables
const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3300/api/v1"; // Use the base URL from .env or fallback to localhost

export const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/analytics`, // Add '/analytics' to the base URL dynamically
    prepareHeaders: (headers) => {
      // Get the token from localStorage and set the Authorization header
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Analytics"],

  endpoints: (builder) => ({
    // Fetch revenue-expense comparison for a given period
    getRevenueExpenseComparison: builder.query<
      RevenueExpenseComparisonData,
      { period: string }
    >({
      query: ({ period }) => `/revenue-expense/${period}`, // Call to the backend route
    }),

    // Fetch revenue-profit data
    getRevenueProfit: builder.query<RevenueProfitData, void>({
      query: () => `/revenue-profit`, // Call to the backend route
    }),
  }),
});

export const { useGetRevenueExpenseComparisonQuery, useGetRevenueProfitQuery } =
  analyticsApi;
