import api from "./api";

/** GET /profiles */
export const getProfiles = (params) => api.get("/profiles", { params });

/** GET /profiles/:id */
export const getProfileById = (id) => api.get(`/profiles/${id}`);

/** POST /profiles */
export const createProfile = (payload) => api.post("/profiles", payload);

/** PUT /profiles/:id */
export const updateProfile = (id, payload) =>
  api.put(`/profiles/${id}`, payload);

/** PATCH /profiles/:id */
export const patchProfile = (id, payload) =>
  api.patch(`/profiles/${id}`, payload);

/** DELETE /profiles/:id */
export const deleteProfile = (id) => api.delete(`/profiles/${id}`);
