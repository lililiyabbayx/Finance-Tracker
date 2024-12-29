import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GetKpisResponse } from "./types";

// Dynamically use the base URL from environment variables
const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3300/api/v1"; // Use the base URL from .env or fallback to localhost

export const kpiApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }), // Dynamically set the base URL
  reducerPath: "kpiApi",
  tagTypes: ["Kpis"],
  endpoints: (build) => ({
    getKpis: build.query<Array<GetKpisResponse>, void>({
      query: () => "kpi/kpis/", // This is relative to the base URL
      providesTags: ["Kpis"],
    }),
  }),
});

export const { useGetKpisQuery } = kpiApi;
