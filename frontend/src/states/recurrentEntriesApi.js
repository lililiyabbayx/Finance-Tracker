import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const recurrentEntriesApi = createApi({
  reducerPath: 'recurrentEntriesApi',
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
  tagTypes: ['RecurrentEntries'],
  endpoints: (builder) => ({
    getRecurrentEntries: builder.query({
      query: () => 'recurrent-entries',
      providesTags: ['RecurrentEntries'],
    }),
    addRecurrentEntry: builder.mutation({
      query: (entry) => ({
        url: 'recurrent-entries',
        method: 'POST',
        body: entry,
      }),
      invalidatesTags: ['RecurrentEntries'],
    }),
    updateRecurrentEntry: builder.mutation({
      query: ({ id, ...entry }) => ({
        url: `recurrent-entries/${id}`,
        method: 'PUT',
        body: entry,
      }),
      invalidatesTags: ['RecurrentEntries'],
    }),
    deleteRecurrentEntry: builder.mutation({
      query: (id) => ({
        url: `recurrent-entries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['RecurrentEntries'],
    }),
  }),
});
