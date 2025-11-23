import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLessons } from "../../services/lessonService";
import Loader from "../../components/ui/loader/Loader";
import ErrorNotice from "../../components/ui/error/ErrorNotice";
import EmptyState from "../../components/ui/empty/EmptyState";
import { formatDate } from "../../helpers/formatDate";
import { Calendar, Clock, MapPin } from "lucide-react";
import "./Lessons.css";

export default function Lessons() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const res = await getLessons();
        const list = Array.isArray(res?.data) ? res.data : [];
        setItems(list);
      } catch (e) {
        if (e.code === "ECONNABORTED")
          setErr("De server reageert traag. Probeer het zo nog eens.");
        else setErr("Kon lessen niet laden.");
        console.error("Lessons error:", e?.response?.data || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;
  if (err) return <ErrorNotice message={err} />;
  if (items.length === 0) return <EmptyState message="Geen lessen gevonden." />;

  return (
    <section className="lessons">
      <h1 className="lessons__title">Lessen</h1>
      <div className="lessons__grid">
        {items.map((lesson) => (
          <Link
            key={lesson.id}
            to={`/lessons/${lesson.id}`}
            className="lesson-card"
          >
            <div className="lesson-card__header">
              <h3 className="lesson-card__title">{lesson.title || "Les"}</h3>
              <span className="lesson-card__level">{lesson.level}</span>
            </div>

            <div className="lesson-card__meta">
              <div className="lesson-card__meta-item">
                <Calendar size={16} />
                <span>{formatDate(lesson.date, false)}</span>
              </div>

              {lesson.startTime && (
                <div className="lesson-card__meta-item">
                  <Clock size={16} />
                  <span>
                    {lesson.startTime}
                    {lesson.endTime ? ` - ${lesson.endTime}` : ""}
                  </span>
                </div>
              )}

              {lesson.location && (
                <div className="lesson-card__meta-item">
                  <MapPin size={16} />
                  <span>{lesson.location}</span>
                </div>
              )}
            </div>

            {lesson.description && (
              <p className="lesson-card__description">
                {lesson.description.length > 100
                  ? `${lesson.description.substring(0, 100)}...`
                  : lesson.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
