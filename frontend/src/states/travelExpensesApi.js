import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const travelExpensesApi = createApi({
  reducerPath: 'travelExpensesApi',
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
  tagTypes: ['TravelExpenses'],
  endpoints: (builder) => ({
    getTravelExpenses: builder.query({
      query: () => 'travel-expenses',
      providesTags: ['TravelExpenses'],
    }),
    addTravelExpense: builder.mutation({
      query: (expense) => ({
        url: 'travel-expenses',
        method: 'POST',
        body: expense,
      }),
      invalidatesTags: ['TravelExpenses'],
    }),
    updateTravelExpense: builder.mutation({
      query: ({ id, ...expense }) => ({
        url: `travel-expenses/${id}`,
        method: 'PUT',
        body: expense,
      }),
      invalidatesTags: ['TravelExpenses'],
    }),
    deleteTravelExpense: builder.mutation({
      query: (id) => ({
        url: `travel-expenses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TravelExpenses'],
    }),
  }),
});
