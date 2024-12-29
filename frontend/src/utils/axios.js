import axios from "axios";

// Dynamically use the base URL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:3300/api/v1", // Fallback to localhost if not set
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
