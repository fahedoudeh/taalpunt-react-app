
import api from "./api";

// Get all event comments (with optional filters)
export const getEventComments = async (params) => {
  return api.get("/eventComments", { params });
};

// Get event comment by ID
export const getEventCommentById = async (id) => {
  return api.get(`/eventComments/${id}`);
};

// Create an event comment
export const createEventComment = async (payload) => {
  return api.post("/eventComments", payload);
};

// Update an event comment
export const updateEventComment = async (id, payload) => {
  return api.put(`/eventComments/${id}`, payload);
};

// Delete an event comment
export const deleteEventComment = async (id) => {
  return api.delete(`/eventComments/${id}`);
};
