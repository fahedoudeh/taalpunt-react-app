
import api from "./api";

// Get all likes (with optional filters)
export const getLikes = async (params) => {
  return api.get("/likes", { params });
};

// Get like by ID
export const getLikeById = async (id) => {
  return api.get(`/likes/${id}`);
};

// Create a like
export const createLike = async (payload) => {
  return api.post("/likes", payload);
};

// Delete a like
export const deleteLike = async (id) => {
  return api.delete(`/likes/${id}`);
};
