import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  getSubmissions,
  createSubmission,
} from "../../../services/homeworkService";
import { useAuth } from "../../../contexts/AuthContext";
import Button from "../../ui/button/Button";
import "./HomeworkForm.css";

export default function StudentHomeworkSubmit({ homework }) {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Check if student already submitted
  useEffect(() => {
    async function checkSubmission() {
      if (!homework?.id || !user?.id) return;

      try {
        setLoading(true);
        const response = await getSubmissions();

        const submissions = response?.data || [];
        const existingSubmission = submissions.find(
          (s) =>
            Number(s.studentId) === Number(user.id) &&
            Number(s.homeworkId) === Number(homework.id)
        );

        if (existingSubmission) {
          setSubmitted(true);
          setSubmissionData(existingSubmission);
        }
      } catch (err) {
        console.error("Error checking submission:", err);
      } finally {
        setLoading(false);
      }
    }

    checkSubmission();
  }, [homework?.id, user?.id]);

  const onSubmit = async (data) => {
    setError("");

    try {
      const payload = {
        homeworkId: Number(homework.id),
        studentId: Number(user.id),
        submissionUrl: data.submissionUrl.trim(),
        comment: data.comment?.trim() || "",
        submittedAt: new Date().toISOString(),
      };

      const response = await createSubmission(payload);
      setSubmitted(true);
      setSubmissionData(response.data);
    } catch (err) {
      console.error("Error submitting homework:", err);
      setError(err.response?.data?.message || "Kon huiswerk niet indienen");
    }
  };

  if (loading) {
    return <p className="homework-loading">Laden...</p>;
  }

  if (submitted && submissionData) {
    return (
      <div className="homework-submitted">
        <h4 className="homework-submitted__title">
          ✅ Je hebt dit huiswerk al ingeleverd
        </h4>

        {submissionData.submissionUrl && (
          <p className="homework-submitted__link">
            <strong>Link:</strong>{" "}
            <a
              href={submissionData.submissionUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {submissionData.submissionUrl}
            </a>
          </p>
        )}

        {submissionData.comment && (
          <div className="homework-submitted__comment">
            <strong>Opmerking:</strong>
            <p>{submissionData.comment}</p>
          </div>
        )}
        {submissionData.feedback && (
          <div className="homework-submitted__feedback">
            <strong>Feedback van docent:</strong>
            <p>{submissionData.feedback}</p>
          </div>
        )}

        {submissionData.submittedAt && (
          <p className="homework-submitted__date">
            Ingeleverd op:{" "}
            {new Date(submissionData.submittedAt).toLocaleString("nl-NL")}
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="homework-form">
      <h4 className="homework-form__title">Huiswerk indienen</h4>

      {error && <p className="homework-form__error">{error}</p>}

      <div className="homework-form__field">
        <label htmlFor="submissionUrl" className="homework-form__label">
          Link naar je werk (Google Drive, Dropbox, etc.) *
        </label>
        <input
          id="submissionUrl"
          type="url"
          className="homework-form__input"
          placeholder="https://drive.google.com/..."
          {...register("submissionUrl", {
            required: "Link is verplicht",
            pattern: {
              value: /^https?:\/\/.+/,
              message: "Link moet beginnen met http:// of https://",
            },
          })}
        />
        {errors.submissionUrl && (
          <span className="homework-form__error">
            {errors.submissionUrl.message}
          </span>
        )}
        <p className="homework-form__hint">
          💡 Upload je bestand naar Google Drive of Dropbox en plak hier de
          deelbare link
        </p>
      </div>

      <div className="homework-form__field">
        <label htmlFor="comment" className="homework-form__label">
          Opmerking (optioneel)
        </label>
        <textarea
          id="comment"
          className="homework-form__textarea"
          rows="3"
          placeholder="Voeg een opmerking toe aan je inlevering..."
          {...register("comment", {
            maxLength: {
              value: 500,
              message: "Opmerking mag maximaal 500 tekens bevatten",
            },
          })}
        />
        {errors.comment && (
          <span className="homework-form__error">{errors.comment.message}</span>
        )}
      </div>

      <div className="homework-form__actions">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Bezig met indienen..." : "Indienen"}
        </Button>
      </div>
    </form>
  );
}
