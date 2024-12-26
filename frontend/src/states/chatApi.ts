import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the types for the request and response data
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatResponse {
  reply: string;
}

// API URL for your backend
const API_URL = "http://localhost:3300/api/chatbot"; // Update this URL if needed

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      // Get the token from localStorage and set the Authorization header
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        console.log("Authorization header set with token:", token); // Log token for debugging
      }
      return headers;
    },
  }),
  tagTypes: ["Chat"],

  endpoints: (builder) => ({
    // Send chat messages to the chatbot
    sendChatMessage: builder.mutation<
      ChatResponse,
      { userId: string; messages: ChatMessage[] }
    >({
      query: ({ userId, messages }) => {
        console.log(
          "Sending request with userId:",
          userId,
          "and messages:",
          messages
        ); // Log the data sent
        return {
          url: "/chatbot",
          method: "POST",
          body: { userId, messages },
        };
      },
    }),
  }),
});

export const { useSendChatMessageMutation } = chatApi;
