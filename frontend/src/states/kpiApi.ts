// src/states/kpiApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GetKpisResponse } from "./types";

export const kpiApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3300" }),
  reducerPath: "kpiApi",
  tagTypes: ["Kpis"],
  endpoints: (build) => ({
    getKpis: build.query<Array<GetKpisResponse>, void>({
      query: () => "kpi/kpis/",
      providesTags: ["Kpis"],
    }),
  }),
});

export const { useGetKpisQuery } = kpiApi;
