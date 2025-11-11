import api from "./api";

/** GET /enrollments */
export const getEnrollments = (params) => api.get("/enrollments", { params });

/** GET /enrollments/:id */
export const getEnrollmentById = (id) => api.get(`/enrollments/${id}`);

/** POST /enrollments */
export const createEnrollment = (payload) => api.post("/enrollments", payload);

/** DELETE /enrollments/:id */
export const deleteEnrollment = (id) => api.delete(`/enrollments/${id}`);
