import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const financialWidgetsApi = createApi({
  reducerPath: 'financialWidgetsApi',
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
  tagTypes: ['FinancialWidgets'],
  endpoints: (builder) => ({
    getFinancialWidgets: builder.query({
      query: () => 'financial-widgets',
      providesTags: ['FinancialWidgets'],
    }),
    updateWidgetSettings: builder.mutation({
      query: (settings) => ({
        url: 'financial-widgets/settings',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['FinancialWidgets'],
    }),
  }),
});
