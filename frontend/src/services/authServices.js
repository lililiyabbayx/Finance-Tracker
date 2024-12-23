// src/services/authService.js
import api from "../utils/axios";

export const signup = async (userData) => {
  const response = await api.post("/api/v1/users/register", userData);
  return response.data;
};

export const login = async (credentials) => {
  try {
    const response = await api.post("/api/v1/users/login", credentials);
    return response.data; // This will include the response body from the backend
  } catch (error) {
    console.error("Login error:", error);
    throw new Error(error.response?.data?.message || "Login failed.");
  }
};
