// src/components/lesson/homeworkForm/StudentHomeworkSubmit.jsx
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../contexts/AuthContext";
import {
  getHomeworkByLesson,
  getSubmissionsByHomeworkAndStudent,
  getSubmissions,
  createSubmission,
} from "../../../services/homeworkService";
import Loader from "../../ui/loader/Loader";
import "./HomeworkForm.css";

const friendlyError = (e, d) =>
  e?.code === "ECONNABORTED"
    ? "De server reageert traag. Probeer het zo nog eens."
    : d;

/**
 * Props:
 * - lessonId (number) -> the lesson being viewed
 */
export default function StudentHomeworkSubmit({ lessonId }) {
  const { user } = useAuth();
  const studentId = useMemo(() => Number(user?.userId), [user]);

  const [loading, setLoading] = useState(true);
  const [serverErr, setServerErr] = useState("");
  const [homework, setHomework] = useState(null);
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [savedMsg, setSavedMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: { submissionUrl: "" },
  });

  // Load homework for this lesson, then check if this student already submitted
  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setServerErr("");
      setSavedMsg("");
      try {
        // 1) homework for the lesson (usually 0 or 1 rows)
        const hwRes = await getHomeworkByLesson(lessonId);
        const list = Array.isArray(hwRes?.data) ? hwRes.data : [];
        const first = list[0] || null;
        if (ignore) return;

        setHomework(first);

        // 2) if there is homework, check if *this student* already submitted
        if (first?.id != null && studentId) {
          const subRes = await getSubmissionsByHomeworkAndStudent(
            first.id,
            studentId
          );
          const subs = Array.isArray(subRes?.data) ? subRes.data : [];
          if (ignore) return;

          setExistingSubmission(subs[0] || null);
        } else {
          setExistingSubmission(null);
        }
      } catch (e) {
        console.error(
          "StudentHomeworkSubmit load error:",
          e?.response?.data || e.message
        );
        if (!ignore) setServerErr(friendlyError(e, "Kon huiswerk niet laden."));
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [lessonId, studentId]);

  async function onSubmit(values) {
    if (!homework?.id || !studentId) return;

    setServerErr("");
    setSavedMsg("");
    try {
      // Compute next id (same pattern used elsewhere)
      const allSubRes = await getSubmissions(); // fetch all to compute next id safely
      const all = Array.isArray(allSubRes?.data) ? allSubRes.data : [];
      const nextId =
        (all.reduce((m, it) => Math.max(m, Number(it?.id || 0)), 0) || 0) + 1;

      const payload = {
        id: nextId,
        homeworkId: Number(homework.id),
        studentId: Number(studentId),
        submissionUrl: values.submissionUrl.trim(),
      };

      const createRes = await createSubmission(payload);
      setExistingSubmission(createRes?.data || payload);
      setSavedMsg("Ingeleverd! Bedankt.");
      reset();
    } catch (e) {
      console.error("Create submission error:", e?.response?.data || e.message);
      setServerErr(friendlyError(e, "Kon inlevering niet opslaan."));
    }
  }

  if (loading) return <Loader />;

  // No homework assigned for this lesson (student view)
  if (!homework) {
    return (
      <section className="hw-section">
        <h3>Huiswerk inleveren</h3>
        {serverErr && (
          <p className="form-error" role="alert">
            {serverErr}
          </p>
        )}
        <p className="side__muted">Geen huiswerk toegewezen voor deze les.</p>
      </section>
    );
  }

  // Already submitted → show the status
  if (existingSubmission) {
    return (
      <section className="hw-section">
        <h3>Huiswerk inleveren</h3>
        {serverErr && (
          <p className="form-error" role="alert">
            {serverErr}
          </p>
        )}

        <div className="hw-info">
          <p>
            <strong>Opdracht:</strong> {homework.title}
          </p>
          <p>
            <strong>Deadline:</strong> {homework.dueDate}
          </p>
        </div>

        <div className="hw-submission">
          <p className="success">Je hebt al ingeleverd.</p>
          <p>
            Link:{" "}
            <a
              href={existingSubmission.submissionUrl}
              target="_blank"
              rel="noreferrer"
            >
              {existingSubmission.submissionUrl}
            </a>
          </p>
        </div>
      </section>
    );
  }

  // Not yet submitted → show form
  return (
    <section className="hw-section">
      <h3>Huiswerk inleveren</h3>
      {serverErr && (
        <p className="form-error" role="alert">
          {serverErr}
        </p>
      )}
      {savedMsg && (
        <p className="form-success" role="status">
          {savedMsg}
        </p>
      )}

      <div className="hw-info">
        <p>
          <strong>Opdracht:</strong> {homework.title}
        </p>
        <p>
          <strong>Deadline:</strong> {homework.dueDate}
        </p>
      </div>

      <form
        className="homework-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="form-row">
          <label htmlFor="shs-url">Inleverlink (Drive/Docs)</label>
          <input
            id="shs-url"
            type="url"
            {...register("submissionUrl", {
              required: "Verplicht",
              maxLength: { value: 500, message: "Max. 500 tekens" },
              pattern: {
                value: /^https?:\/\/.+/i,
                message: "Geef een geldige URL (https://...)",
              },
            })}
            placeholder="https://..."
          />
          {errors.submissionUrl && (
            <p className="form-error">{errors.submissionUrl.message}</p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Inleveren…" : "Inleveren"}
        </button>
      </form>
    </section>
  );
}
