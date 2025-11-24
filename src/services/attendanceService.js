
import api from "./api";

export const getAttendance = async (params) => {
  return api.get("/attendance", { params });
};

export const createAttendance = async (payload) => {
  return api.post("/attendance", payload);
};

export const updateAttendance = async (id, payload) => {
  return api.put(`/attendance/${id}`, payload);
};

export const deleteAttendance = async (id) => {
  return api.delete(`/attendance/${id}`);
};
