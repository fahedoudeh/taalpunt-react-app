import api from "./api";

/** GET /homework */
export const getHomework = (params) => api.get("/homework", { params });

/** GET /homework/:id */
export const getHomeworkById = (id) => api.get(`/homework/${id}`);

/** POST /homework */
export const createHomework = (payload) => api.post("/homework", payload);

/** PUT /homework/:id */
export const updateHomework = (id, payload) =>
  api.put(`/homework/${id}`, payload);

/** PATCH /homework/:id */
export const patchHomework = (id, payload) =>
  api.patch(`/homework/${id}`, payload);

/** DELETE /homework/:id */
export const deleteHomework = (id) => api.delete(`/homework/${id}`);
