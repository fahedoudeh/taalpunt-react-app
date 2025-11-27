import api from "./api";

export const getActivities = (params) => api.get("/events", { params });

export const getActivityById = (id) => api.get(`/events/${id}`);

export const createActivity = (payload) => api.post("/events", payload);

export const updateActivity = (id, payload) => api.patch(`/events/${id}`, payload);

export const deleteActivity  = (id) => api.delete(`/events/${id}`);

