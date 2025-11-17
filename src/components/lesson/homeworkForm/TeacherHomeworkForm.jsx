import { useForm } from "react-hook-form";
import { createHomework, getHomeworkByLesson } from "../../../services/homeworkService";
import { useState } from "react";

const friendlyError = (e, d) =>
  e?.code === "ECONNABORTED"
    ? "De server reageert traag. Probeer het zo nog eens."
    : d;

/**
 * Props:
 * - lessonId: number (required)
 * - students: [{ id:number, label:string }] (required, list to assign to)
 * - onCreated?: (row) => void
 */
export default function TeacherHomeworkForm({
  lessonId,
  students = [],
  onCreated,
}) {
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      studentId: students[0]?.id ? String(students[0].id) : "",
    },
  });

  const onSubmit = async (v) => {
    setServerError("");
    try {
      // Compute next id locally (Dynamic API doesn't auto-increment)
      const response = await getHomeworkByLesson(lessonId); 
      const existing = Array.isArray(response?.data) ? response.data : []; 
      const nextId =
        (existing.reduce((m, it) => Math.max(m, Number(it?.id || 0)), 0) || 0) +
        1;

      const payload = {
        id: nextId,
        title: v.title.trim(),
        description: v.description.trim(),
        dueDate: v.dueDate, // YYYY-MM-DD
        submissionUrl: "",
        submitted: false,
        lessonId: Number(lessonId),
        studentId: Number(v.studentId),
        // createdAt defaults from config
      };

      const res = await createHomework(payload);
      onCreated?.(res.data);
      reset();
    } catch (e) {
      console.error("Create homework error:", e?.response?.data || e.message);
      setServerError(friendlyError(e, "Kon huiswerk niet opslaan."));
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError && (
        <p className="form-error" role="alert">
          {serverError}
        </p>
      )}

      <div className="form-row">
        <label htmlFor="thf-title">Titel</label>
        <input
          id="thf-title"
          {...register("title", {
            required: "Verplicht",
            minLength: { value: 3, message: "Min. 3 tekens" },
            maxLength: { value: 200, message: "Max. 200 tekens" },
          })}
        />
        {errors.title && <p className="form-error">{errors.title.message}</p>}
      </div>

      <div className="form-row">
        <label htmlFor="thf-desc">Beschrijving</label>
        <textarea
          id="thf-desc"
          rows={4}
          {...register("description", {
            required: "Verplicht",
            minLength: { value: 10, message: "Min. 10 tekens" },
            maxLength: { value: 2000, message: "Max. 2000 tekens" },
          })}
        />
        {errors.description && (
          <p className="form-error">{errors.description.message}</p>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="thf-due">Deadline</label>
        <input
          id="thf-due"
          type="date"
          {...register("dueDate", {
            required: "Verplicht",
            pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: "JJJJ-MM-DD" },
          })}
        />
        {errors.dueDate && (
          <p className="form-error">{errors.dueDate.message}</p>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="thf-student">Student</label>
        <select
          id="thf-student"
          {...register("studentId", { required: "Kies een student" })}
        >
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        {errors.studentId && (
          <p className="form-error">{errors.studentId.message}</p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Opslaan…" : "Huiswerk toevoegen"}
      </button>
    </form>
  );
}
