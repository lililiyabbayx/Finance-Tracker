import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Transaction } from "./types";

// Dynamically use the base URL from environment variables
const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3300/api/v1"; // Base URL should be up to /api/v1/

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL, // Dynamically set the base URL up to /api/v1
    prepareHeaders: (headers) => {
      // Get the token from localStorage
      const token = localStorage.getItem("token");

      // If the token exists, add it to the Authorization header
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Transaction"],

  endpoints: (builder) => ({
    fetchTransactions: builder.query<Transaction[], void>({
      query: () => "/transactions", // Correct relative path
      transformResponse: (response: Transaction[]) => {
        return response.map((transaction) => ({
          ...transaction,
          id: transaction._id || transaction.id,
        }));
      },
    }),

    addTransaction: builder.mutation<Transaction, Transaction>({
      query: (transaction) => ({
        url: "/transactions", // Correct relative path
        method: "POST",
        body: transaction,
      }),
    }),

    updateTransaction: builder.mutation<
      Transaction,
      { transactionId: string; data: Transaction }
    >({
      query: ({ transactionId, data }) => ({
        url: `/transactions/${transactionId}`, // Correct relative path
        method: "PUT",
        body: data,
      }),
    }),

    deleteTransaction: builder.mutation<void, string>({
      query: (transactionId) => ({
        url: `/transactions/${transactionId}`, // Correct relative path
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks
export const {
  useFetchTransactionsQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionApi;
