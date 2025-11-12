// Import configured axios instance (with baseURL, timeout, interceptors)
import api from "./api";

// Export a function called "login"
// Takes credentials (email, password) as parameter
// Makes POST request to /login endpoint
// Returns a promise with the response
export const loginRequest = (credentials) => api.post("/login", credentials);

// Export a function called "register"
// Takes payload (user data) as parameter
// Makes POST request to /users endpoint
// Returns a promise with the response
export const registerRequest = (payload) => api.post("/users", payload);
