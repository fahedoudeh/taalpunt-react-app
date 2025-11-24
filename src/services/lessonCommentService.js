
import api from "./api";

// Get all lesson comments (with optional filters)
export const getLessonComments = async (params) => {
  return api.get("/lessonComments", { params });
};

// Get lesson comment by ID
export const getLessonCommentById = async (id) => {
  return api.get(`/lessonComments/${id}`);
};

// Create a lesson comment
export const createLessonComment = async (payload) => {
  return api.post("/lessonComments", payload);
};

// Update a lesson comment
export const updateLessonComment = async (id, payload) => {
  return api.put(`/lessonComments/${id}`, payload);
};

// Delete a lesson comment
export const deleteLessonComment = async (id) => {
  return api.delete(`/lessonComments/${id}`);
};
