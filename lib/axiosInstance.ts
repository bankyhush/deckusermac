import axios from "axios";

const api = axios.create({
  baseURL: "/",
});

// ✅ if any request returns 401, automatically refresh and retry once
api.interceptors.response.use(
  (response) => response, // success — pass through
  async (error) => {
    const originalRequest = error.config;

    // only retry once — _retry flag prevents infinite loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // call refresh endpoint — sets new cookies automatically
        await axios.post("/api/auth/refresh");

        // retry the original request with new access token cookie
        return api(originalRequest);
      } catch {
        // refresh failed — redirect to login
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
