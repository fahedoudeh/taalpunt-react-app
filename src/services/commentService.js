import api from "./api";

/** GET /comments */
export const getComments = (params) => api.get("/comments", { params });

/** GET /comments/:id */
export const getCommentById = (id) => api.get(`/comments/${id}`);

/** POST /comments */
export const createComment = (payload) => api.post("/comments", payload);

/** PUT /comments/:id */
export const updateComment = (id, payload) =>
  api.put(`/comments/${id}`, payload);

/** PATCH /comments/:id */
export const patchComment = (id, payload) =>
  api.patch(`/comments/${id}`, payload);

/** DELETE /comments/:id */
export const deleteComment = (id) => api.delete(`/comments/${id}`);
