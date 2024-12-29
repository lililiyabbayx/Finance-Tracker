import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const financialInsightsApi = createApi({
  reducerPath: 'financialInsightsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:3300/api/v1/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['FinancialInsights'],
  endpoints: (builder) => ({
    getFinancialInsights: builder.query({
      query: () => 'financial-insights',
      providesTags: ['FinancialInsights'],
    }),
    getInsightsByCategory: builder.query({
      query: (category) => `financial-insights/category/${category}`,
      providesTags: ['FinancialInsights'],
    }),
    generateInsightReport: builder.mutation({
      query: (params) => ({
        url: 'financial-insights/report',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: ['FinancialInsights'],
    }),
  }),
});
