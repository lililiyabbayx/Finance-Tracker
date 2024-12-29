import api from "@/utils/axios";
// Signup function to register a new user
export const signup = async (userData) => {
  const response = await api.post("/users/register", userData); // Send user data to backend
  return response.data;
};

// Login function to authenticate user
export const login = async (credentials) => {
  try {
    const response = await api.post("/users/login", credentials); // Send login credentials to backend
    return response.data; // Response contains the JWT token, user details, and redirect URL
  } catch (error) {
    console.error("Login error:", error);
    throw new Error(error.response?.data?.message || "Login failed.");
  }
};
