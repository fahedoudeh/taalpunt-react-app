
import api from "./api";

// Get all event comments 
export const getEventComments = async (params) => {
  return api.get("/eventComments", { params });
};


export const getEventCommentById = async (id) => {
  return api.get(`/eventComments/${id}`);
};


export const createEventComment = async (payload) => {
  return api.post("/eventComments", payload);
};


export const updateEventComment = async (id, payload) => {
  return api.put(`/eventComments/${id}`, payload);
};


export const deleteEventComment = async (id) => {
  return api.delete(`/eventComments/${id}`);
};
