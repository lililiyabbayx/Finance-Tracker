// src/services/authService.js
import api from "../utils/axios";

export const signup = async (userData) => {
  const response = await api.post("/api/v1/users/register", userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post("/api/v1/users/login", credentials);
  return response.data;
};
