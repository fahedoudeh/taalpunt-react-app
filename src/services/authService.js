
import api from "./api";


export const loginRequest = (credentials) => api.post("/login", credentials);


export const registerRequest = (payload) => api.post("/users", payload);
