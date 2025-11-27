import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getHomework, getSubmissions } from "../../services/homeworkService";
import Loader from "../../components/ui/loader/Loader";
import ErrorNotice from "../../components/ui/error/ErrorNotice";
import { Link } from "react-router-dom";
import { Clock, CheckCircle, AlertCircle, MessageCircle } from "lucide-react";
import "./Homework.css";

export default function Homework() {
  const { user } = useAuth();
  const [homework, setHomework] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isTeacher =
    user?.roles?.includes("teacher") || user?.roles?.includes("admin");

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [hwRes, subsRes] = await Promise.all([
          getHomework(),
          getSubmissions(),
        ]);

        if (!isMounted) return;

        setHomework(hwRes?.data || []);
        setSubmissions(subsRes?.data || []);
      } catch (err) {
        console.error("Error loading homework overview:", err);
        if (isMounted) {
          setError("Kon het huiswerkoverzicht niet laden.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  // ---------- Student status helpers ----------

  const getStatusForStudent = (hw) => {
    if (!user) {
      return {
        label: "Log in om je status te zien",
        variant: "neutral",
      };
    }

    const mySubmission = submissions.find(
      (sub) =>
        Number(sub.homeworkId) === Number(hw.id) &&
        Number(sub.studentId) === Number(user.id)
    );

    if (!mySubmission) {
      if (isOverdue(hw.dueDate)) {
        return {
          label: "Niet ingeleverd (te laat)",
          variant: "overdue",
        };
      }

      return {
        label: "Nog niet ingeleverd",
        variant: "pending",
      };
    }

    if (mySubmission.reviewed) {
      if (mySubmission.feedback && mySubmission.feedback.trim().length > 0) {
        return {
          label: "Beoordeeld – feedback beschikbaar",
          variant: "reviewed-with-feedback",
          submission: mySubmission,
        };
      }

      return {
        label: "Beoordeeld",
        variant: "reviewed",
        submission: mySubmission,
      };
    }

    return {
      label: "Ingeleverd – wachten op beoordeling",
      variant: "submitted",
      submission: mySubmission,
    };
  };

  // ---------- Teacher summary helpers ----------

  const getTeacherSummary = (hw) => {
    const related = submissions.filter(
      (sub) => Number(sub.homeworkId) === Number(hw.id)
    );
    const total = related.length;
    const reviewed = related.filter((s) => s.reviewed).length;
    const withFeedback = related.filter(
      (s) => s.reviewed && s.feedback && s.feedback.trim().length > 0
    ).length;

    return { total, reviewed, withFeedback };
  };

  // ---------- Render ----------

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorNotice message={error} />;
  }

  return (
    <div className="homework-page">
      <div className="homework-page__inner">
        <header className="homework-page__header">
          <div>
            <h1 className="homework-page__title">Huiswerk overzicht</h1>
            <p className="homework-page__subtitle">
              {isTeacher
                ? "Bekijk en beheer alle huiswerkopdrachten."
                : "Al je huiswerkopdrachten, inclusief status en feedback, op één plek."}
            </p>
          </div>
        </header>

        {homework.length === 0 ? (
          <div className="homework-page__empty">
            <p>Nog geen huiswerk beschikbaar.</p>
          </div>
        ) : (
          <div className="homework-page__grid">
            {homework.map((hw) => {
              const overdue = isOverdue(hw.dueDate);
              const status = isTeacher ? null : getStatusForStudent(hw);
              const summary = isTeacher ? getTeacherSummary(hw) : null;

              return (
                <Link
                  key={hw.id}
                  to={`/homework/${hw.lessonId}`}
                  className="homework-card"
                >
                  <div className="homework-card__header">
                    <h2 className="homework-card__title">{hw.title}</h2>

                    {/* Student status pill */}
                    {!isTeacher && status && (
                      <span
                        className={`homework-card__status homework-card__status--${status.variant}`}
                      >
                        {status.variant === "overdue" && (
                          <AlertCircle
                            size={16}
                            className="homework-card__status-icon"
                          />
                        )}
                        {status.variant === "submitted" && (
                          <Clock
                            size={16}
                            className="homework-card__status-icon"
                          />
                        )}
                        {(status.variant === "reviewed" ||
                          status.variant === "reviewed-with-feedback") && (
                          <CheckCircle
                            size={16}
                            className="homework-card__status-icon"
                          />
                        )}
                        {status.variant === "reviewed-with-feedback" && (
                          <MessageCircle
                            size={16}
                            className="homework-card__status-icon"
                          />
                        )}
                        {status.label}
                      </span>
                    )}

                    {/* Teacher summary pill */}
                    {isTeacher && summary && (
                      <span className="homework-card__status homework-card__status--teacher">
                        {summary.total === 0 ? (
                          "Nog geen inzendingen"
                        ) : (
                          <>
                            <CheckCircle
                              size={14}
                              className="homework-card__status-icon"
                            />
                            {summary.reviewed}/{summary.total} beoordeeld
                            {summary.withFeedback > 0 &&
                              ` · ${summary.withFeedback} met feedback`}
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  <p className="homework-card__description">
                    {hw.description.length > 120
                      ? `${hw.description.slice(0, 120)}…`
                      : hw.description}
                  </p>

                  <div className="homework-card__footer">
                    <div
                      className={`homework-card__due ${
                        overdue ? "homework-card__due--overdue" : ""
                      }`}
                    >
                      <Clock size={16} className="homework-card__due-icon" />
                      <span>
                        Inleveren voor{" "}
                        {new Date(hw.dueDate).toLocaleDateString("nl-NL", {
                          day: "numeric",
                          month: "long",
                        })}
                      </span>
                    </div>

                    {/* Small hint for students when feedback exists */}
                    {!isTeacher &&
                      status?.submission?.feedback &&
                      status.variant === "reviewed-with-feedback" && (
                        <div className="homework-card__feedback-pill">
                          <MessageCircle
                            size={14}
                            className="homework-card__feedback-icon"
                          />
                          Feedback beschikbaar
                        </div>
                      )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
