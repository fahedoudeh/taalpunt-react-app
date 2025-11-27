import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHomeworkById } from "../../services/homeworkService";
import { useAuth } from "../../contexts/AuthContext";
import Loader from "../../components/ui/loader/Loader";
import ErrorNotice from "../../components/ui/error/ErrorNotice";
import Button from "../../components/ui/button/Button";
import "./HomeworkDetail.css";

export default function HomeworkDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [homework, setHomework] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHomework();
  }, [id]);

  const fetchHomework = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getHomeworkById(id);
      setHomework(data);
    } catch (err) {
      console.error("Fetch homework error:", err);
      setError("Kon huiswerk niet laden.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader label="Huiswerk laden..." />;
  if (error) return <ErrorNotice message={error} />;
  if (!homework) return <ErrorNotice message="Huiswerk niet gevonden." />;

  return (
    <div className="homework-detail">
      <Button variant="secondary" onClick={() => navigate(-1)}>
        ← Terug
      </Button>

      <div className="homework-detail__header">
        <h1>{homework.title}</h1>
        <span className="homework-detail__due-date">
          Inleveren voor:{" "}
          {new Date(homework.dueDate).toLocaleDateString("nl-NL")}
        </span>
      </div>

      <div className="homework-detail__content">
        <h2>Beschrijving</h2>
        <p>{homework.description}</p>

        {homework.instructions && (
          <>
            <h2>Instructies</h2>
            <p>{homework.instructions}</p>
          </>
        )}

        {homework.materialsUrl && (
          <div className="homework-detail__materials">
            <h3>Materialen</h3>
            <a
              href={homework.materialsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {homework.materialsUrl}
            </a>
          </div>
        )}
      </div>

      {user?.role !== "teacher" && (
        <div className="homework-detail__actions">
          <Button
            onClick={() => {
              // Navigate to lesson detail to submit homework
              navigate(`/lessons/${homework.lessonId}`);
            }}
          >
            Huiswerk inleveren
          </Button>
        </div>
      )}
    </div>
  );
}
