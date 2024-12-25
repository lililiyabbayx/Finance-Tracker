import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Transaction } from "./types";

// API URL
const API_URL = "http://localhost:3300/api/v1/transactions"; // Adjust URL as needed

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
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
      query: () => "/",
      transformResponse: (response: Transaction[]) => {
        return response.map((transaction) => ({
          ...transaction,
          id: transaction._id || transaction.id,
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

// Export hooks
export const {
  useFetchTransactionsQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionApi;
