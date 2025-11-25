
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getHomework } from "../../services/homeworkService";
import { getSubmissions } from "../../services/homeworkService";
import Loader from "../../components/ui/loader/Loader";
import ErrorNotice from "../../components/ui/error/ErrorNotice";
import { Link } from "react-router-dom";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
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
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [homeworkRes, submissionsRes] = await Promise.all([
        getHomework(),
        getSubmissions(),
      ]);

      setHomework(homeworkRes?.data || []);
      setSubmissions(submissionsRes?.data || []);
    } catch (e) {
      setError("Kon huiswerk niet laden.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader label="Huiswerk laden..." />;
  if (error) return <ErrorNotice message={error} />;

  const getSubmissionStatus = (homeworkId) => {
    const submission = submissions.find(
      (sub) =>
        Number(sub.homeworkId) === Number(homeworkId) &&
        Number(sub.studentId) === Number(user?.id)
    );
    return submission ? "submitted" : "pending";
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="homework-page">
      <div className="homework-page__inner">
        <header className="homework-page__header">
          <div>
            <h1 className="homework-page__title">Huiswerk Overzicht</h1>
            <p className="homework-page__subtitle">
              {isTeacher
                ? "Bekijk en beheer alle huiswerkopdrachten"
                : "Al je huiswerkopdrachten op één plek"}
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
              const status = isTeacher ? null : getSubmissionStatus(hw.id);
              const overdue = isOverdue(hw.dueDate);

              return (
                <Link
                  key={hw.id}
                  to={`/lessons/${hw.lessonId}`}
                  className="homework-card"
                >
                  <div className="homework-card__header">
                    <h3 className="homework-card__title">{hw.title}</h3>
                    {!isTeacher && (
                      <div
                        className={`homework-card__status homework-card__status--${status}`}
                      >
                        {status === "submitted" ? (
                          <>
                            <CheckCircle size={16} /> Ingeleverd
                          </>
                        ) : (
                          <>
                            <Clock size={16} /> Te doen
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <p className="homework-card__description">
                    {hw.description.slice(0, 120)}
                    {hw.description.length > 120 ? "..." : ""}
                  </p>

                  <div className="homework-card__footer">
                    <div
                      className={`homework-card__due ${
                        overdue ? "homework-card__due--overdue" : ""
                      }`}
                    >
                      {overdue && <AlertCircle size={14} />}
                      <span>
                        {overdue ? "Verlopen: " : "Inleveren voor: "}
                        {new Date(hw.dueDate).toLocaleDateString("nl-NL", {
                          day: "numeric",
                          month: "long",
                        })}
                      </span>
                    </div>
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
