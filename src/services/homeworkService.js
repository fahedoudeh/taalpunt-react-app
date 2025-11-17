import api from "./api";

// ---------- HOMEWORK (assignments) ----------

// Get all homework rows (for teacher overview, stats, etc.)
export const getHomework = async () => {
  return api.get("/homework");
};

// Get homework for a specific lesson (e.g. on lesson detail page)
export const getHomeworkByLesson = async (lessonId) => {
  // returns all homework rows for a lesson (usually 0 or 1)
  return api.get("/homework", { params: { lessonId } });
};

// Create homework assignment
// payload: { title, description, dueDate, lessonId, ... }
export const createHomework = async (payload) => {
  return api.post("/homework", payload);
};

// ---------- SUBMISSIONS (student deliveries) ----------

// Get all submissions (optional, for later teacher features)
export const getSubmissions = async () => {
  return api.get("/submissions");
};

// Get submissions filtered by homework + student
export const getSubmissionsByHomeworkAndStudent = async (
  homeworkId,
  studentId
) => {
  return api.get("/submissions", { params: { homeworkId, studentId } });
};
export const createSubmission = async (payload) => {
  // { id, homeworkId, studentId, submissionUrl }
  return api.post(`/submissions`, payload);
};
