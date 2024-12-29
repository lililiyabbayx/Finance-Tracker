import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  RevenueExpenseComparisonData,
  RevenueProfitData,
} from "@/states/types";

// API URL for your backend
const API_URL = "http://localhost:3300/api/v1/analytics"; // Update this URL as needed

export const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
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
