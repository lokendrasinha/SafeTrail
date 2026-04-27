import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

// 🔐 Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ⚠️ Handle ONLY protected route failures
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest =
      error.config?.url?.includes("/auth/login");

    // ❗ Only clear token, DO NOT redirect
    if (error.response?.status === 401 && !isLoginRequest) {
      console.warn("Session expired — clearing token");

      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

export default api;