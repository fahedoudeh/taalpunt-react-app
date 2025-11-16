import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLessonById } from "../../services/lessonService";
import Loader from "../../components/ui/loader/Loader";
import ErrorNotice from "../../components/ui/error/ErrorNotice";
import { formatDate } from "../../helpers/formatDate";
import "./LessonDetail.css";

export default function LessonDetail() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const res = await getLessonById(id);
        setLesson(res?.data ?? null);
      } catch (e) {
        if (e.code === "ECONNABORTED")
          setErr("De server reageert traag. Probeer het zo nog eens.");
        else setErr("Kon les niet laden.");
        console.error("Lesson detail error:", e?.response?.data || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Loader />;
  if (err) return <ErrorNotice message={err} />;
  if (!lesson) return <ErrorNotice message="Les niet gevonden." />;

  return (
    <section className="lesson-detail">
      <Link to="/lessons" className="lesson-detail__back">
        ← Terug naar lessen
      </Link>

      <h1 className="lesson-detail__title">{lesson.title ?? "Les"}</h1>
      <div className="lesson-detail__meta">
        Datum: {formatDate(lesson.date, false)}
      </div>

      {lesson.description && (
        <p className="lesson-detail__desc">{lesson.description}</p>
      )}

      <hr className="lesson-detail__hr" />

      <h2>Huiswerk</h2>
      <p className="lesson-detail__muted">
        Nog geen items — we voegen een formulier toe in stap 3.3.
      </p>
    </section>
  );
}
