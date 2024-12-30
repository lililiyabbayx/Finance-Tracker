import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const travelExpensesApi = createApi({
  reducerPath: 'travelExpensesApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:3300/api/v1/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
    credentials: 'include'
  }),
  tagTypes: ['TravelExpenses'],
  endpoints: (builder) => ({
    getTravelExpenses: builder.query({
      query: () => 'travel-expenses',
      providesTags: ['TravelExpenses'],
      transformResponse: (response) => response ?? [],
      transformErrorResponse: (error) => {
        console.error('Get expenses error:', error);
        return error;
      }
    }),
    addTravelExpense: builder.mutation({
      query: (expense) => ({
        url: 'travel-expenses',
        method: 'POST',
        body: expense,
      }),
      invalidatesTags: ['TravelExpenses'],
      transformErrorResponse: (error) => {
        console.error('Add expense error:', error);
        return error;
      }
    }),
    updateTravelExpense: builder.mutation({
      query: ({ id, ...expense }) => ({
        url: `travel-expenses/${id}`,
        method: 'PUT',
        body: expense,
      }),
      invalidatesTags: ['TravelExpenses'],
      transformErrorResponse: (error) => {
        console.error('Update expense error:', error);
        return error;
      }
    }),
    deleteTravelExpense: builder.mutation({
      query: (id) => ({
        url: `travel-expenses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TravelExpenses'],
      transformErrorResponse: (error) => {
        console.error('Delete expense error:', error);
        return error;
      }
    }),
  }),
});

export const {
  useGetTravelExpensesQuery,
  useAddTravelExpenseMutation,
  useUpdateTravelExpenseMutation,
  useDeleteTravelExpenseMutation,
} = travelExpensesApi;
