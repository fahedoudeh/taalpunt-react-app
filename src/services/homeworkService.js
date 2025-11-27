import api from "./api";

// ---------- HOMEWORK (assignments) ----------

// Get all homework rows (with optional filters)
export const getHomework = async (params) => {
  return api.get("/homework", { params });
};

// Get homework by ID
export const getHomeworkById = async (id) => {
  return api.get(`/homework/${id}`);
};

// Get homework for a specific lesson
export const getHomeworkByLesson = async (lessonId) => {
  return api.get("/homework", { params: { lessonId } });
};

// Create homework assignment
export const createHomework = async (payload) => {
  return api.post("/homework", payload);
};

// Update homework assignment (NEW - for editing)
export const updateHomework = async (id, payload) => {
  return api.put(`/homework/${id}`, payload);
};

// Delete homework assignment (NEW - for future use)
export const deleteHomework = async (id) => {
  return api.delete(`/homework/${id}`);
};

// ---------- SUBMISSIONS (student deliveries) ----------

// Get all submissions (with optional filters)
export const getSubmissions = async (params) => {
  return api.get("/submissions", { params });
};

// Get submission by ID (NEW)
export const getSubmissionById = async (id) => {
  return api.get(`/submissions/${id}`);
};

// Get submissions filtered by homework + student
export const getSubmissionsByHomeworkAndStudent = async (
  homeworkId,
  studentId
) => {
  return api.get("/submissions", { params: { homeworkId, studentId } });
};

// Create submission
export const createSubmission = async (payload) => {
  return api.post("/submissions", payload);
};

// Update submission (NEW - for future re-submission feature)
export const updateSubmission = async (id, payload) => {
  return api.patch(`/submissions/${id}`, payload);
};
