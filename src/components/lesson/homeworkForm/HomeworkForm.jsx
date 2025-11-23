
import { useForm } from "react-hook-form";
import { createHomework } from "../../../services/homeworkService";
import { useState } from "react";

const friendlyError = (e, defaultMsg) =>
  e?.code === "ECONNABORTED"
    ? "De server reageert traag. Probeer het zo nog eens."
    : defaultMsg;

export default function HomeworkForm({
  defaultLessonId = "",
  defaultStudentId = "",
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
      submissionUrl: "",
      lessonId: String(defaultLessonId),
      studentId: String(defaultStudentId),
    },
  });

  const onSubmit = async (values) => {
    setServerError("");
    try {
      
      const payload = {
        title: values.title.trim(),
        description: values.description.trim(),
        dueDate: values.dueDate, // "YYYY-MM-DD"
        submissionUrl: values.submissionUrl.trim(),
        submitted: false,
        lessonId: Number(values.lessonId),
        studentId: Number(values.studentId),
      };

      const res = await createHomework(payload);
      onCreated?.(res.data);

      reset({
        title: "",
        description: "",
        dueDate: "",
        submissionUrl: "",
        lessonId: String(defaultLessonId),
        studentId: String(defaultStudentId),
      });
    } catch (e) {
      console.error("Homework create error:", e?.response?.data || e.message);
      setServerError(friendlyError(e, "Kon huiswerk niet opslaan."));
    }
  };

  return (
    <form
      className="homework-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {serverError && (
        <p className="form-error" role="alert">
          {serverError}
        </p>
      )}

      <div className="form-row">
        <label htmlFor="hw-title">Titel</label>
        <input
          id="hw-title"
          {...register("title", {
            required: "Verplicht",
            minLength: { value: 3, message: "Minimaal 3 tekens" },
            maxLength: { value: 200, message: "Maximaal 200 tekens" },
          })}
        />
        {errors.title && <p className="form-error">{errors.title.message}</p>}
      </div>

      <div className="form-row">
        <label htmlFor="hw-desc">Beschrijving</label>
        <textarea
          id="hw-desc"
          rows={4}
          {...register("description", {
            required: "Verplicht",
            minLength: { value: 10, message: "Minimaal 10 tekens" },
            maxLength: { value: 2000, message: "Maximaal 2000 tekens" },
          })}
        />
        {errors.description && (
          <p className="form-error">{errors.description.message}</p>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="hw-date">Deadline</label>
        <input
          id="hw-date"
          type="date"
          {...register("dueDate", {
            required: "Verplicht",
            pattern: {
              value: /^\d{4}-\d{2}-\d{2}$/,
              message: "Gebruik formaat JJJJ-MM-DD",
            },
          })}
        />
        {errors.dueDate && (
          <p className="form-error">{errors.dueDate.message}</p>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="hw-lesson">Les-ID</label>
        <input
          id="hw-lesson"
          type="number"
          {...register("lessonId", {
            required: "Verplicht",
            validate: (v) => Number(v) > 0 || "Ongeldige ID",
          })}
        />
        {errors.lessonId && (
          <p className="form-error">{errors.lessonId.message}</p>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="hw-student">Student-ID</label>
        <input
          id="hw-student"
          type="number"
          {...register("studentId", {
            required: "Verplicht",
            validate: (v) => Number(v) > 0 || "Ongeldige ID",
          })}
        />
        {errors.studentId && (
          <p className="form-error">{errors.studentId.message}</p>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="hw-url">Inleverlink (optioneel)</label>
        <input
          id="hw-url"
          type="url"
          placeholder="https://…"
          {...register("submissionUrl", {
            pattern: {
              value: /^$|^https?:\/\/.+/i,
              message: "Gebruik een geldige URL",
            },
          })}
        />
        {errors.submissionUrl && (
          <p className="form-error">{errors.submissionUrl.message}</p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Opslaan…" : "Opslaan"}
      </button>
    </form>
  );
}
