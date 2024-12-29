import api from "../utils/axios";

export const signup = async (userData) => {
  const response = await api.post("/users/register", userData); // The endpoint part without the base URL
  return response.data;
};

export const login = async (credentials) => {
  try {
    const response = await api.post("/users/login", credentials); // The endpoint part without the base URL
    return response.data; // This will include the response body from the backend
  } catch (error) {
    console.error("Login error:", error);
    throw new Error(error.response?.data?.message || "Login failed.");
  }
};
