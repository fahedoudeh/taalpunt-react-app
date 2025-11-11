import api from "./api";

export const getLessons = (params) => api.get("/lessons", { params });

export const getLessonById = (id) => api.get(`/lessons/${id}`);

export const createLesson = (payload) => api.post("/lessons", payload);

export const updateLesson = (id, payload) => api.put(`/lessons/${id}`, payload);

export const deleteLesson  = (id) => api.delete(`/lessons/${id}`);
