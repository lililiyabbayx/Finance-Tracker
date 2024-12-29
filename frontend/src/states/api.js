import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3300/api/v1',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  reducerPath: 'api',
  tagTypes: ['User', 'Transaction', 'Analytics'],
  endpoints: (build) => ({
    // Add your endpoints here
  }),
});
