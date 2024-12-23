// src/utils/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3300", // Backend API URL (make sure your backend is running on this port)
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
