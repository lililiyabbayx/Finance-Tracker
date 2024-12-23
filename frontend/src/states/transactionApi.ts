import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Transaction } from "./types";

// API URL
const API_URL = "http://localhost:3300/api/v1/transactions"; // Adjust URL as needed

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      // Get the token from localStorage (or wherever it's stored)
      const token = localStorage.getItem("token");

      // If the token exists, add it to the Authorization header
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Transaction"], // Optional: for cache invalidation

  endpoints: (builder) => ({
    fetchTransactions: builder.query<Transaction[], void>({
      query: () => "/",
      transformResponse: (response: Transaction[]) => {
        // Ensure `id` is included (in case `_id` is used in the DB)
        return response.map((transaction) => ({
          ...transaction,
          id: transaction._id || transaction.id, // Normalize _id to id
        }));
      },
    }),

    addTransaction: builder.mutation<Transaction, Transaction>({
      query: (transaction) => ({
        url: "/",
        method: "POST",
        body: transaction,
      }),
    }),

    updateTransaction: builder.mutation<
      Transaction,
      { transactionId: string; data: Transaction }
    >({
      query: ({ transactionId, data }) => ({
        url: `/${transactionId}`,
        method: "PUT",
        body: data,
      }),
    }),

    deleteTransaction: builder.mutation<void, string>({
      query: (transactionId) => ({
        url: `/${transactionId}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks to use the endpoints
export const {
  useFetchTransactionsQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionApi;
