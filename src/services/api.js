import axios from "axios";

// Create a dedicated Axios client for this app.
// - baseURL: from .env
// - headers: NOVI project id + JSON
// - timeout: abort requests that take longer than 10s (10,000 ms)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // https://novi-backend-api-wgsgz.ondigitalocean.app/api
  headers: {
    "Content-Type": "application/json",
    "novi-education-project-id": import.meta.env.VITE_NOVI_PROJECT_ID, // NOVI requires this on every request cc3fe423-f322-495b-95d9-0579d147a403
  },
  timeout: 10000, //  10 seconds
});

// Before each request: attach Authorization if we have a token.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// After each response: centralize 401 handling (logout + redirect).
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const url = err?.config?.url || "";

    // Only redirect on 401 if it's NOT the login request
    if (status === 401 && !url.endsWith("/login")) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return; // not strictly necessary, but keeps intent clear
    }

    return Promise.reject(err);
  }
);


export default api;
