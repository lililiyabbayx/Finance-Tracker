import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GetKpisResponse } from "./types";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3300" }),
  reducerPath: "main",
  tagTypes: ["Kpis"],
  endpoints: (build) => ({
    getKpis: build.query<Array<GetKpisResponse>, void>({
      query: () => "kpi/kpis/", // Ensure this matches your backend route
      providesTags: ["Kpis"],
    }),
  }),
});

export const { useGetKpisQuery } = api;
