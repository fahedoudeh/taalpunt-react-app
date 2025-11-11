import api from "./api";

export const getMessages = (params) => api.get("/messages", { params });

export const getMessageById = (id) => api.get(`/messages/${id}`);

export const createMessage = (payload) => api.post("/messages", payload);

export const updateMessage = (id, payload) =>
  api.put(`/messages/${id}`, payload);

export const deleteMessage = (id) => api.delete(`/messages/${id}`);
